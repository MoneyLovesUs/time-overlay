import type {
  PngOutputMode,
  PngPartDescriptor,
} from "@/lib/generator/export/png-contract";
import { PngExportError } from "@/lib/generator/export/png-error";
import {
  getPngFrameNameWidth,
  getPngPartFileName,
  PNG_JOB_DIRECTORY_PATTERN,
  PNG_PART_FILE_NAME_PATTERN,
} from "@/lib/generator/export/png-naming";
import { PRO_MAX_DURATION_SECONDS } from "@/lib/pro/entitlements";
import type { GeneratorSettings } from "@/lib/generator/types";

export const PNG_MANIFEST_SCHEMA = "time-overlay-png-manifest";
export const PNG_MANIFEST_VERSION = 1;
export const PNG_MANIFEST_FILE_PATTERN = /^manifest-(\d{6})\.json$/;
export const PNG_FONT_FILE_NAME = "font.bin";

export type PngFontFingerprint = {
  family: string;
  sha256: string;
  byteLength: number;
};

export type PngManifest = {
  schema: typeof PNG_MANIFEST_SCHEMA;
  version: typeof PNG_MANIFEST_VERSION;
  jobId: string;
  rendererVersion: string;
  settingsHash: string;
  settings: GeneratorSettings;
  uploadedFont?: PngFontFingerprint;
  totalFrames: number;
  fps: number;
  frameNameWidth: number;
  outputMode: Exclude<PngOutputMode, "memory">;
  parts: PngPartDescriptor[];
  nextFrameIndex: number;
  nextPartNumber: number;
  /** Registered but uncommitted part; recovery deletes and redoes it. */
  pendingPart?: {
    fileName: string;
    partNumber: number;
    firstFrameIndex: number;
  };
  status: "running" | "interrupted" | "complete" | "cancelled";
  updatedAt: string;
};

/** Recursively key-sorted JSON so the settings hash is stable across engines. */
export function stableJsonStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableJsonStringify).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJsonStringify(record[key])}`)
    .join(",")}}`;
}

export async function hashPngJobSettings(
  settings: GeneratorSettings,
  rendererVersion: string,
): Promise<string> {
  const payload = new TextEncoder().encode(
    stableJsonStringify({ rendererVersion, settings }),
  );
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

type DirectoryWithKeys = FileSystemDirectoryHandle & {
  keys?: () => AsyncIterable<string>;
};

export async function listDirectoryNames(
  directory: FileSystemDirectoryHandle,
): Promise<string[]> {
  const iterator = (directory as DirectoryWithKeys).keys?.();
  if (!iterator) {
    return [];
  }
  const names: string[] = [];
  for await (const name of iterator) {
    names.push(name);
  }
  return names;
}

export async function writeTextFile(
  directory: FileSystemDirectoryHandle,
  fileName: string,
  content: string,
): Promise<void> {
  const handle = await directory.getFileHandle(fileName, { create: true });
  const writable = await handle.createWritable({ keepExistingData: false });
  try {
    await writable.write(content);
  } finally {
    await writable.close();
  }
}

/** Generation files make the manifest commit atomic without rename support. */
export async function writePngManifest(
  directory: FileSystemDirectoryHandle,
  manifest: PngManifest,
  generation: number,
): Promise<void> {
  const fileName = `manifest-${String(generation).padStart(6, "0")}.json`;
  await writeTextFile(directory, fileName, `${JSON.stringify(manifest, null, 2)}\n`);
  // Keep one previous generation for crash recovery, drop older ones.
  const names = await listDirectoryNames(directory);
  const generations = names
    .map((name) => PNG_MANIFEST_FILE_PATTERN.exec(name)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .sort((a, b) => b - a);
  for (const old of generations.slice(2)) {
    await directory
      .removeEntry(`manifest-${String(old).padStart(6, "0")}.json`)
      .catch(() => undefined);
  }
}

function requireSafeString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      `The PNG manifest has an invalid ${label}.`,
    );
  }
  if (
    value.includes("..") ||
    value.includes("/") ||
    value.includes("\\") ||
    value.startsWith(".")
  ) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      `The PNG manifest ${label} points outside the task directory.`,
    );
  }
  return value;
}

function requireInteger(
  value: unknown,
  min: number,
  max: number,
  label: string,
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      `The PNG manifest has an invalid ${label}.`,
    );
  }
  return value;
}

function validatePartDescriptor(
  value: unknown,
  expectedPartNumber: number,
  expectedFirstFrameIndex: number,
  totalFrames: number,
  frameNameWidth: number,
): PngPartDescriptor {
  if (!value || typeof value !== "object") {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "A PNG manifest part is not an object.",
    );
  }
  const part = value as Record<string, unknown>;
  const fileName = requireSafeString(part.fileName, "part file name");
  if (
    !PNG_PART_FILE_NAME_PATTERN.test(fileName) ||
    fileName !== getPngPartFileName(expectedPartNumber)
  ) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "A PNG manifest part name does not match its number.",
    );
  }
  const firstFrameIndex = requireInteger(
    part.firstFrameIndex,
    expectedFirstFrameIndex,
    expectedFirstFrameIndex,
    "part first frame",
  );
  const nextFrameIndex = requireInteger(
    part.nextFrameIndex,
    firstFrameIndex + 1,
    totalFrames,
    "part next frame",
  );
  const bytes = requireInteger(part.bytes, 128, 512 * 1024 * 1024, "part size");
  const entryCount = requireInteger(
    part.entryCount,
    1,
    65535,
    "part entry count",
  );
  const directoryOffset = requireInteger(
    part.directoryOffset,
    0,
    bytes - 22,
    "part directory offset",
  );
  const directorySize = requireInteger(
    part.directorySize,
    22,
    bytes - directoryOffset,
    "part directory size",
  );
  if (directoryOffset + directorySize !== bytes) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "A PNG manifest part directory range is inconsistent.",
    );
  }
  const directoryDigest = part.directoryDigest;
  if (
    typeof directoryDigest !== "string" ||
    !/^[0-9a-f]{64}$/.test(directoryDigest)
  ) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "A PNG manifest part digest is invalid.",
    );
  }
  if (part.partNumber !== expectedPartNumber) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "A PNG manifest part number is out of order.",
    );
  }
  if (part.frameNameWidth !== frameNameWidth) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "A PNG manifest part uses a different frame-number width.",
    );
  }
  return {
    partNumber: expectedPartNumber,
    fileName,
    firstFrameIndex,
    nextFrameIndex,
    bytes,
    entryCount,
    directoryDigest,
    directoryOffset,
    directorySize,
    frameNameWidth,
  };
}

/**
 * Strict manifest validation. This is a local checkpoint, not a trust boundary
 * for remote input, but a hand-edited manifest must still not be able to point
 * at files outside the task directory or exceed the Pro duration entitlement.
 */
export function validatePngManifest(
  value: unknown,
  expectedJobId?: string,
): PngManifest {
  if (!value || typeof value !== "object") {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest is not an object.",
    );
  }
  const manifest = value as Record<string, unknown>;
  if (
    manifest.schema !== PNG_MANIFEST_SCHEMA ||
    manifest.version !== PNG_MANIFEST_VERSION
  ) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest version is not supported.",
    );
  }
  const jobId = requireSafeString(manifest.jobId, "job id");
  if (!/^[A-Za-z0-9-]{8,64}$/.test(jobId)) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest job id is invalid.",
    );
  }
  if (expectedJobId && jobId !== expectedJobId) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest belongs to a different job.",
    );
  }
  const totalFrames = requireInteger(
    manifest.totalFrames,
    1,
    PRO_MAX_DURATION_SECONDS * 60,
    "total frame count",
  );
  const fps = requireInteger(manifest.fps, 1, 60, "frame rate");
  const settingsCandidate: unknown = manifest.settings;
  let durationSeconds: unknown;
  if (
    settingsCandidate &&
    typeof settingsCandidate === "object" &&
    "timer" in settingsCandidate
  ) {
    const timer = settingsCandidate.timer;
    if (timer && typeof timer === "object" && "durationSeconds" in timer) {
      durationSeconds = timer.durationSeconds;
    }
  }
  if (
    typeof durationSeconds !== "number" ||
    !Number.isFinite(durationSeconds) ||
    durationSeconds <= 0 ||
    durationSeconds > PRO_MAX_DURATION_SECONDS ||
    Math.round(durationSeconds * fps) !== totalFrames
  ) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest settings do not match its frame count.",
    );
  }
  const frameNameWidth = requireInteger(
    manifest.frameNameWidth,
    4,
    7,
    "frame-number width",
  );
  if (frameNameWidth !== getPngFrameNameWidth(totalFrames)) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest frame-number width is inconsistent.",
    );
  }
  if (manifest.outputMode !== "directory" && manifest.outputMode !== "opfs") {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest output mode is invalid.",
    );
  }
  if (
    manifest.status !== "running" &&
    manifest.status !== "interrupted" &&
    manifest.status !== "complete" &&
    manifest.status !== "cancelled"
  ) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest status is invalid.",
    );
  }
  const rendererVersion = requireSafeString(
    manifest.rendererVersion,
    "renderer version",
  );
  const settingsHash = requireSafeString(manifest.settingsHash, "settings hash");
  if (!/^[0-9a-f]{64}$/.test(settingsHash)) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest settings hash is invalid.",
    );
  }
  if (!manifest.settings || typeof manifest.settings !== "object") {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest is missing its settings.",
    );
  }
  if (!Array.isArray(manifest.parts)) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The PNG manifest is missing its parts.",
    );
  }
  const parts: PngPartDescriptor[] = [];
  let expectedNextFrame = 0;
  for (let index = 0; index < manifest.parts.length; index += 1) {
    const part = validatePartDescriptor(
      manifest.parts[index],
      index + 1,
      expectedNextFrame,
      totalFrames,
      frameNameWidth,
    );
    parts.push(part);
    expectedNextFrame = part.nextFrameIndex;
  }
  const nextFrameIndex = requireInteger(
    manifest.nextFrameIndex,
    expectedNextFrame,
    expectedNextFrame,
    "next frame index",
  );
  const nextPartNumber = requireInteger(
    manifest.nextPartNumber,
    parts.length + 1,
    parts.length + 1,
    "next part number",
  );

  let pendingPart: PngManifest["pendingPart"];
  if (manifest.pendingPart) {
    if (typeof manifest.pendingPart !== "object") {
      throw new PngExportError(
        "pngResumeVersionMismatch",
        "The PNG manifest pending part is invalid.",
      );
    }
    const pending = manifest.pendingPart as Record<string, unknown>;
    const pendingName = requireSafeString(pending.fileName, "pending part name");
    const pendingNumber = requireInteger(
      pending.partNumber,
      parts.length + 1,
      parts.length + 1,
      "pending part number",
    );
    if (
      !PNG_PART_FILE_NAME_PATTERN.test(pendingName) ||
      pendingName !== getPngPartFileName(pendingNumber) ||
      pending.firstFrameIndex !== nextFrameIndex
    ) {
      throw new PngExportError(
        "pngResumeVersionMismatch",
        "The PNG manifest pending part does not match its frames.",
      );
    }
    pendingPart = {
      fileName: pendingName,
      partNumber: pendingNumber,
      firstFrameIndex: nextFrameIndex,
    };
  }

  let uploadedFont: PngFontFingerprint | undefined;
  if (manifest.uploadedFont) {
    const font = manifest.uploadedFont as Record<string, unknown>;
    const family = requireSafeString(font.family, "font family");
    const fontHash = font.sha256;
    const byteLength = requireInteger(
      font.byteLength,
      1,
      64 * 1024 * 1024,
      "font size",
    );
    if (typeof fontHash !== "string" || !/^[0-9a-f]{64}$/.test(fontHash)) {
      throw new PngExportError(
        "pngResumeVersionMismatch",
        "The PNG manifest font fingerprint is invalid.",
      );
    }
    uploadedFont = { family, sha256: fontHash, byteLength };
  }

  return {
    schema: PNG_MANIFEST_SCHEMA,
    version: PNG_MANIFEST_VERSION,
    jobId,
    rendererVersion,
    settingsHash,
    settings: manifest.settings as GeneratorSettings,
    uploadedFont,
    totalFrames,
    fps,
    frameNameWidth,
    outputMode: manifest.outputMode,
    parts,
    nextFrameIndex,
    nextPartNumber,
    pendingPart,
    status: manifest.status,
    updatedAt:
      typeof manifest.updatedAt === "string" ? manifest.updatedAt : "",
  };
}

/**
 * Read the newest manifest generation that parses and validates. A crash
 * between part close and manifest write leaves the previous generation intact.
 */
export async function readLatestPngManifest(
  directory: FileSystemDirectoryHandle,
  expectedJobId?: string,
): Promise<{ manifest: PngManifest; generation: number } | null> {
  const names = await listDirectoryNames(directory);
  const generations = names
    .map((name) => PNG_MANIFEST_FILE_PATTERN.exec(name)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .sort((a, b) => b - a);

  for (const generation of generations) {
    const fileName = `manifest-${String(generation).padStart(6, "0")}.json`;
    try {
      const handle = await directory.getFileHandle(fileName);
      const text = await (await handle.getFile()).text();
      const manifest = validatePngManifest(JSON.parse(text), expectedJobId);
      return { manifest, generation };
    } catch {
      // Try the previous generation.
    }
  }
  return null;
}

export async function ensurePngJobDirectoryName(jobId: string) {
  const name = `time-overlay-${jobId}`;
  if (!PNG_JOB_DIRECTORY_PATTERN.test(name)) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "The job id cannot be used as a directory name.",
    );
  }
  return name;
}
