import {
  type PngPreflightPayload,
  type PngPreflightResult,
  type PngProgressStage,
  type PngStartPayload,
  PNG_RENDERER_VERSION,
} from "@/lib/generator/export/png-contract";
import {
  putPngCheckpoint,
  type PngCheckpoint,
} from "@/lib/generator/export/png-checkpoint";
import { PngExportError } from "@/lib/generator/export/png-error";
import {
  drawExportFrame,
  getExportFrameText,
} from "@/lib/generator/export/frame-drawer";
import {
  EXPAND_BUNDLE_FILES,
  buildExpandBundle,
} from "@/lib/generator/export/png-expand-bundle";
import { encodePalettePng } from "@/lib/generator/export/png-palette";
import {
  estimatePngArchiveBytes,
  estimatePngParts,
  PNG_PART_MAX_BYTES,
  PNG_PART_MAX_PNG_COUNT,
} from "@/lib/generator/export/png-limits";
import {
  hashPngJobSettings,
  listDirectoryNames,
  readLatestPngManifest,
  type PngFontFingerprint,
  type PngManifest,
  writePngManifest,
  writeTextFile,
} from "@/lib/generator/export/png-manifest";
import {
  getPngFrameFileName,
  getPngFrameNameWidth,
  getPngJobDirectoryName,
  getPngOpfsNamespace,
  getPngPartFileName,
  getPngTotalFrames,
} from "@/lib/generator/export/png-naming";
import {
  createDirectoryPartSink,
  createMemoryPartSink,
  createOpfsPartSink,
  createPngMemoryBudget,
  probeOpfsWritable,
  type PngPartSink,
} from "@/lib/generator/export/png-sinks";
import {
  type PngZipHelperFile,
  PngZipPartWriter,
  sha256Hex,
  verifyPngPartFile,
} from "@/lib/generator/export/png-zip";
import {
  buildPngExportInstructions,
  buildPngPartNote,
  buildProResBundle,
  EXPORT_INSTRUCTIONS_FILE,
  getPngPartNoteReservedBytes,
  type ProResBundleFile,
  PRORES_BUNDLE_FILES,
} from "@/lib/generator/export/prores-bundle";
import type { ExportWorkerMessage } from "@/lib/generator/export/job";
import { loadFontIntoWorker, type UploadedFont } from "@/lib/generator/font-loader";
import type { GeneratorSettings } from "@/lib/generator/types";

const PROGRESS_INTERVAL_MS = 150;
const PREVIEW_INTERVAL_MS = 250;
const PREVIEW_MAX_WIDTH = 320;
const FONT_ASSET_DIRECTORY = "assets";
const FONT_ASSET_FILE = "font.bin";

export type PngEngineDependencies = {
  /** Test seam: produce the PNG bytes without an OffscreenCanvas. */
  encodeFrame?: (frameIndex: number) => Promise<Uint8Array<ArrayBuffer>>;
  emitPreview?: (frameIndex: number) => Promise<void>;
  /** Test seam: replace IndexedDB while exercising recovery behaviour. */
  persistCheckpoint?: (checkpoint: PngCheckpoint) => Promise<void>;
};

export type PngEngineContext = {
  jobId: string;
  attemptId: string;
  post: (message: ExportWorkerMessage, transfer?: Transferable[]) => void;
  isCancelled: () => boolean;
  /** False while a previous preview is still unconsumed on the host. */
  isPreviewAllowed: () => boolean;
  onPreviewPosted: () => void;
};

type PreparedFont = PngFontFingerprint & { data: ArrayBuffer };

async function prepareFont(
  font: UploadedFont | undefined,
): Promise<PreparedFont | null> {
  if (!font) {
    return null;
  }
  const data = font.data.slice(0);
  return {
    family: font.family,
    data,
    byteLength: data.byteLength,
    sha256: await sha256Hex(new Uint8Array(data)),
  };
}

function getSampleFrameIndices(totalFrames: number, maxSamples: number) {
  if (totalFrames <= maxSamples) {
    return Array.from({ length: totalFrames }, (_, index) => index);
  }
  const last = totalFrames - 1;
  const indices = new Set<number>([0, Math.floor(last / 2), last]);
  for (let slot = 1; slot < maxSamples; slot += 1) {
    indices.add(Math.round((slot * last) / (maxSamples - 1)));
  }
  return [...indices].sort((a, b) => a - b);
}

function encodeText(value: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(value);
}

function padToLength(
  bytes: Uint8Array<ArrayBuffer>,
  length: number,
): Uint8Array<ArrayBuffer> {
  if (bytes.byteLength === length) {
    return bytes;
  }
  if (bytes.byteLength > length) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "A part helper file exceeded its reserved size.",
    );
  }
  const padded = new Uint8Array(length);
  padded.fill(0x20);
  padded.set(bytes);
  return padded;
}

function getBundleFiles(
  bundle: Record<ProResBundleFile, string>,
): PngZipHelperFile[] {
  return PRORES_BUNDLE_FILES.map((name) => ({
    name,
    bytes: encodeText(bundle[name]),
  }));
}

async function emitPreview(
  context: PngEngineContext,
  canvas: OffscreenCanvas,
  frameIndex: number,
) {
  if (
    typeof createImageBitmap !== "function" ||
    canvas.width === 0 ||
    canvas.height === 0 ||
    !context.isPreviewAllowed()
  ) {
    return;
  }
  try {
    const scale = Math.min(1, PREVIEW_MAX_WIDTH / canvas.width);
    const bitmap = await createImageBitmap(canvas, {
      resizeWidth: Math.max(1, Math.round(canvas.width * scale)),
      resizeHeight: Math.max(1, Math.round(canvas.height * scale)),
      resizeQuality: "low",
    });
    context.onPreviewPosted();
    context.post(
      {
        kind: "preview",
        jobId: context.jobId,
        attemptId: context.attemptId,
        payload: { bitmap, frameIndex },
      },
      [bitmap],
    );
  } catch {
    // Preview is decorative; never abort the export for it.
  }
}

/**
 * Encode the current canvas as an indexed PNG. `convertToBlob` can only emit
 * truecolor RGBA, which measured 2-3.5x larger on this content, so the export
 * reads the pixels back and runs the palette encoder instead.
 */
function encodeCanvasFrame(
  canvas: OffscreenCanvas,
  context: OffscreenCanvasRenderingContext2D,
): Uint8Array<ArrayBuffer> {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  return encodePalettePng(image.data, canvas.width, canvas.height);
}

export async function runPngPreflight(
  context: PngEngineContext,
  payload: PngPreflightPayload,
): Promise<void> {
  const { settings, uploadedFont } = payload;
  if (uploadedFont) {
    await loadFontIntoWorker(uploadedFont);
  }
  const totalFrames = getPngTotalFrames(
    settings.timer.durationSeconds,
    settings.export.fps,
  );
  const frameNameWidth = getPngFrameNameWidth(totalFrames);
  const canvas = new OffscreenCanvas(
    settings.canvas.width,
    settings.canvas.height,
  );
  const canvasContext = canvas.getContext("2d");
  if (!canvasContext) {
    throw new PngExportError(
      "pngFailedUnexpectedly",
      "Could not create an offscreen canvas context.",
    );
  }

  const sampleIndices = getSampleFrameIndices(totalFrames, 12);
  let sampledBytes = 0;
  let sampledElapsedMs = 0;
  let samples = 0;

  for (const frameIndex of sampleIndices) {
    drawExportFrame({
      context: canvasContext,
      settings,
      frameIndex,
      fps: settings.export.fps,
    });
    const startedAt = performance.now();
    const bytes = encodeCanvasFrame(canvas, canvasContext);
    sampledElapsedMs += performance.now() - startedAt;
    sampledBytes += bytes.byteLength;
    samples += 1;
  }

  const averageFrameBytes = samples > 0 ? sampledBytes / samples : null;
  const estimatedArchiveBytes =
    averageFrameBytes === null
      ? null
      : estimatePngArchiveBytes(averageFrameBytes, totalFrames, 4096);
  const estimatedElapsedMs =
    samples > 0
      ? Math.round((sampledElapsedMs / samples) * totalFrames)
      : null;
  let estimatedParts: number | null = null;
  if (averageFrameBytes !== null) {
    const framesPerPart = Math.max(
      1,
      Math.min(
        PNG_PART_MAX_PNG_COUNT,
        Math.floor((PNG_PART_MAX_BYTES - 4096) / (averageFrameBytes + 140)),
      ),
    );
    estimatedParts = estimatedArchiveBytes
      ? estimatePngParts(estimatedArchiveBytes, totalFrames)
      : Math.ceil(totalFrames / framesPerPart);
  }

  const result: PngPreflightResult = {
    totalFrames,
    frameNameWidth,
    sampleCount: samples,
    estimatedArchiveBytes,
    estimatedElapsedMs,
    estimatedParts,
    opfsWritable: await probeOpfsWritable(),
  };

  context.post({
    kind: "png-preflight-result",
    jobId: context.jobId,
    attemptId: context.attemptId,
    payload: result,
  });
}

type OutputLocation = {
  directory: FileSystemDirectoryHandle;
  directoryName: string;
};

async function resolveOutputLocation(
  payload: PngStartPayload,
): Promise<OutputLocation | null> {
  if (payload.outputMode === "memory") {
    return null;
  }
  if (payload.outputMode === "directory") {
    if (!payload.outputDirectory) {
      throw new PngExportError(
        "pngDirectoryPermissionDenied",
        "The save folder is not available.",
        true,
      );
    }
    return {
      directory: payload.outputDirectory,
      directoryName:
        payload.outputDirectoryName ??
        payload.outputDirectory.name ??
        getPngJobDirectoryName(payload.jobId),
    };
  }
  try {
    const root = await navigator.storage.getDirectory();
    const namespace = await root.getDirectoryHandle(getPngOpfsNamespace(), {
      create: true,
    });
    return {
      directory: await namespace.getDirectoryHandle(payload.jobId, {
        create: true,
      }),
      directoryName: payload.jobId,
    };
  } catch (error) {
    throw new PngExportError(
      "pngStorageUnavailable",
      error instanceof Error
        ? error.message
        : "This browser blocked the local storage needed for the export.",
    );
  }
}

async function writeFontAsset(
  directory: FileSystemDirectoryHandle,
  font: PreparedFont,
) {
  const assets = await directory.getDirectoryHandle(FONT_ASSET_DIRECTORY, {
    create: true,
  });
  const handle = await assets.getFileHandle(FONT_ASSET_FILE, { create: true });
  const writable = await handle.createWritable({ keepExistingData: false });
  try {
    await writable.write(font.data);
  } finally {
    await writable.close();
  }
}

function descriptorsMatch(
  left: PngManifest["parts"],
  right: PngManifest["parts"],
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (part, index) => JSON.stringify(part) === JSON.stringify(right[index]),
    )
  );
}

function buildInstructions(
  settings: GeneratorSettings,
  jobId: string,
  totalFrames: number,
  frameNameWidth: number,
  skipDuplicateFrames: boolean,
) {
  return buildPngExportInstructions({
    jobId,
    fps: settings.export.fps,
    totalFrames,
    frameNameWidth,
    layout: "zipped",
    skipDuplicateFrames,
  });
}

export async function runPngExport(
  context: PngEngineContext,
  payload: PngStartPayload,
  resume: boolean,
  dependencies: PngEngineDependencies = {},
): Promise<void> {
  const { settings, jobId, attemptId, enablePreview } = payload;
  if (payload.rendererVersion !== PNG_RENDERER_VERSION) {
    throw new PngExportError(
      "pngResumeVersionMismatch",
      "This page and the export worker use different renderer versions.",
    );
  }
  if (payload.uploadedFont) {
    await loadFontIntoWorker(payload.uploadedFont);
  }

  const totalFrames = getPngTotalFrames(
    settings.timer.durationSeconds,
    settings.export.fps,
  );
  const frameNameWidth = getPngFrameNameWidth(totalFrames);
  const fps = settings.export.fps;
  const font = await prepareFont(payload.uploadedFont);
  const settingsHash = await hashPngJobSettings(
    settings,
    payload.rendererVersion,
  );
  const location = await resolveOutputLocation(payload);
  const outputMode = payload.outputMode;

  let canvas: OffscreenCanvas | null = null;
  let canvasContext: OffscreenCanvasRenderingContext2D | null = null;
  if (!dependencies.encodeFrame) {
    canvas = new OffscreenCanvas(settings.canvas.width, settings.canvas.height);
    canvasContext = canvas.getContext("2d");
    if (!canvasContext) {
      throw new PngExportError(
        "pngFailedUnexpectedly",
        "Could not create an offscreen canvas context.",
      );
    }
  }

  let parts: PngManifest["parts"] = [];
  let nextFrameIndex = 0;
  let nextPartNumber = 1;
  let manifestGeneration = 0;
  const runtime: {
    writer: PngZipPartWriter | null;
    memoryBlob?: Blob;
  } = { writer: null };
  const getWriter = () => runtime.writer;
  const memoryBudget = createPngMemoryBudget();
  let lastProgressAt = 0;
  let lastPreviewAt = 0;

  const committedFrames = () =>
    parts.length > 0 ? parts[parts.length - 1].nextFrameIndex : 0;
  const totalCommittedBytes = () =>
    parts.reduce((total, part) => total + part.bytes, 0);

  const emitProgress = (
    stage: PngProgressStage,
    processedFrames: number,
    force = false,
  ) => {
    const activeWriter = getWriter();
    const now = performance.now();
    if (!force && now - lastProgressAt < PROGRESS_INTERVAL_MS) {
      return;
    }
    lastProgressAt = now;
    context.post({
      kind: "png-progress",
      jobId,
      attemptId,
      payload: {
        stage,
        processedFrames,
        committedFrames: committedFrames(),
        currentPart: activeWriter?.partNumber ?? nextPartNumber,
        bytesWritten: totalCommittedBytes() + (activeWriter?.writtenBytes ?? 0),
      },
    });
  };

  const manifestBase = {
    schema: "time-overlay-png-manifest" as const,
    version: 1 as const,
    jobId,
    rendererVersion: payload.rendererVersion,
    settingsHash,
    settings,
    uploadedFont: font
      ? {
          family: font.family,
          sha256: font.sha256,
          byteLength: font.byteLength,
        }
      : undefined,
    totalFrames,
    fps,
    frameNameWidth,
    outputMode: outputMode === "memory" ? ("opfs" as const) : outputMode,
    parts,
    nextFrameIndex,
    nextPartNumber,
    status: "running" as const,
    updatedAt: new Date().toISOString(),
  };

  // Mutation is enabled only after this attempt has proved it owns a fresh or
  // successfully validated job. A rejected resume must leave the previous
  // manifest generation and checkpoint untouched.
  let canPersist = false;

  const persistCheckpoint = async (
    status: PngCheckpoint["status"],
    pendingPart?: PngManifest["pendingPart"],
  ) => {
    if (!location || !canPersist) {
      return;
    }
    const checkpoint: PngCheckpoint = {
      jobId,
      attemptId,
      rendererVersion: payload.rendererVersion,
      settingsHash,
      settings,
      uploadedFont: font
        ? {
            family: font.family,
            sha256: font.sha256,
            byteLength: font.byteLength,
            bytes: font.data.slice(0),
          }
        : undefined,
      totalFrames,
      fps,
      frameNameWidth,
      skipDuplicateFrames: payload.skipDuplicateFrames,
      outputMode: outputMode === "memory" ? "opfs" : outputMode,
      outputDirectory:
        outputMode === "directory" ? payload.outputDirectory : undefined,
      outputDirectoryName: location.directoryName,
      parts,
      nextFrameIndex,
      nextPartNumber,
      pendingPart,
      status,
      updatedAt: new Date().toISOString(),
    };
    if (dependencies.persistCheckpoint) {
      await dependencies.persistCheckpoint(checkpoint);
    } else {
      await putPngCheckpoint(checkpoint);
    }
  };

  const persistManifest = async (
    status: PngManifest["status"],
    pendingPart?: PngManifest["pendingPart"],
  ) => {
    if (!location || !canPersist) {
      return;
    }
    manifestGeneration += 1;
    const manifest: PngManifest = {
      ...manifestBase,
      parts,
      nextFrameIndex,
      nextPartNumber,
      pendingPart,
      status,
      updatedAt: new Date().toISOString(),
    };
    await writePngManifest(location.directory, manifest, manifestGeneration);
  };

  const writeDirectoryHelpFiles = async () => {
    if (!location || outputMode !== "directory") {
      return;
    }
    const bundle = buildProResBundle({
      fps,
      totalFrames,
      frameNameWidth,
      layout: "directory",
    });
    await writeTextFile(
      location.directory,
      EXPORT_INSTRUCTIONS_FILE,
      buildInstructions(
        settings,
        jobId,
        totalFrames,
        frameNameWidth,
        payload.skipDuplicateFrames,
      ),
    );
    for (const name of PRORES_BUNDLE_FILES) {
      await writeTextFile(location.directory, name, bundle[name]);
    }
  };

  try {
    if (resume) {
      if (!location || !payload.resumeFrom) {
        throw new PngExportError(
          "pngResumeVersionMismatch",
          "Memory exports cannot be resumed.",
        );
      }
      const latest = await readLatestPngManifest(location.directory, jobId);
      if (!latest) {
        throw new PngExportError(
          "pngResumeVersionMismatch",
          "No compatible PNG manifest was found in this folder.",
        );
      }
      const manifest = latest.manifest;
      manifestGeneration = latest.generation;
      if (
        manifest.rendererVersion !== payload.rendererVersion ||
        manifest.settingsHash !== settingsHash ||
        manifest.totalFrames !== totalFrames ||
        manifest.fps !== fps ||
        manifest.frameNameWidth !== frameNameWidth ||
        manifest.outputMode !== outputMode
      ) {
        throw new PngExportError(
          "pngResumeVersionMismatch",
          "The saved export was rendered with different settings or a different app version.",
        );
      }
      const manifestFont = manifest.uploadedFont;
      if (Boolean(manifestFont) !== Boolean(font)) {
        throw new PngExportError(
          "pngResumeVersionMismatch",
          "The saved export uses a custom font that was not provided.",
        );
      }
      if (
        manifestFont &&
        font &&
        (manifestFont.sha256 !== font.sha256 ||
          manifestFont.family !== font.family)
      ) {
        throw new PngExportError(
          "pngResumeVersionMismatch",
          "The provided font does not match the saved export.",
        );
      }
      if (
        payload.resumeFrom.nextFrameIndex !== manifest.nextFrameIndex ||
        payload.resumeFrom.nextPartNumber !== manifest.nextPartNumber ||
        !descriptorsMatch(payload.resumeFrom.parts, manifest.parts)
      ) {
        throw new PngExportError(
          "pngResumeVersionMismatch",
          "The local checkpoint no longer matches the saved export.",
        );
      }

      for (const part of manifest.parts) {
        let file: File;
        try {
          const handle = await location.directory.getFileHandle(part.fileName);
          file = await handle.getFile();
        } catch {
          throw new PngExportError(
            "pngResumeFileMissing",
            `The saved ${part.fileName} is missing from the export folder.`,
            true,
          );
        }
        await verifyPngPartFile(file, part);
      }
      if (manifest.pendingPart) {
        // Registered but uncommitted: safe to remove, then redo that part.
        await location.directory
          .removeEntry(manifest.pendingPart.fileName)
          .catch(() => undefined);
      }
      parts = manifest.parts;
      nextFrameIndex = manifest.nextFrameIndex;
      nextPartNumber = manifest.nextPartNumber;
      // Validation and ownership are complete; only now may this attempt
      // advance the durable manifest or the local index.
      canPersist = true;
      if (font) {
        await writeFontAsset(location.directory, font).catch(() => undefined);
      }
      await writeDirectoryHelpFiles();
      emitProgress("preparing", nextFrameIndex, true);
    } else {
      if (location) {
        const existing = await readLatestPngManifest(
          location.directory,
          jobId,
        ).catch(() => null);
        const names = await listDirectoryNames(location.directory);
        const hasParts = names.some((name) => name.startsWith("timer-part-"));
        if (existing || hasParts) {
          throw new PngExportError(
            "pngResumeVersionMismatch",
            "The task folder already contains an export.",
          );
        }
        if (font) {
          await writeFontAsset(location.directory, font);
        }
        await writeDirectoryHelpFiles();
      }
      canPersist = true;
      await persistManifest("running");
      await persistCheckpoint("running");
      emitProgress("preparing", 0, true);
    }

    let cancelled = false;
    let processedFrames = nextFrameIndex;

    const buildHelperFiles = async (): Promise<{
      reserve: PngZipHelperFile[];
      finish: () => PngZipHelperFile[];
    }> => {
      if (nextPartNumber === 1) {
        const bundle = buildProResBundle({
          fps,
          totalFrames,
          frameNameWidth,
          layout: "zipped",
        });
        const expandBundle = payload.skipDuplicateFrames
          ? buildExpandBundle({ totalFrames })
          : null;
        const files: PngZipHelperFile[] = [
          {
            name: EXPORT_INSTRUCTIONS_FILE,
            bytes: encodeText(
              buildInstructions(
                settings,
                jobId,
                totalFrames,
                frameNameWidth,
                payload.skipDuplicateFrames,
              ),
            ),
          },
          ...getBundleFiles(bundle),
          ...(expandBundle
            ? EXPAND_BUNDLE_FILES.map((name) => ({
                name,
                bytes: encodeText(
                  (expandBundle as Record<string, string>)[name],
                ),
              }))
            : []),
        ];
        return { reserve: files, finish: () => files };
      }
      const reservedLength = getPngPartNoteReservedBytes({
        jobId,
        partNumber: nextPartNumber,
        fps,
        totalFrames,
        frameNameWidth,
      });
      const placeholder = buildPngPartNote({
        jobId,
        partNumber: nextPartNumber,
        firstFrameIndex: 0,
        nextFrameIndex: totalFrames,
        fps,
        totalFrames,
        frameNameWidth,
      });
      const reserve: PngZipHelperFile[] = [
        {
          name: placeholder.name,
          bytes: padToLength(encodeText(placeholder.content), reservedLength),
        },
      ];
      return {
        reserve,
        finish: () => {
          const range = getWriter()?.frameRange;
          const actual = buildPngPartNote({
            jobId,
            partNumber: nextPartNumber,
            firstFrameIndex: range?.firstFrameIndex ?? 0,
            nextFrameIndex: range?.nextFrameIndex ?? totalFrames,
            fps,
            totalFrames,
            frameNameWidth,
          });
          return [
            {
              name: actual.name,
              bytes: padToLength(
                encodeText(actual.content),
                reservedLength,
              ),
            },
          ];
        },
      };
    };

    const openPart = async () => {
      const partNumber = nextPartNumber;
      const fileName = getPngPartFileName(partNumber);
      const helpers = await buildHelperFiles();
      if (location) {
        // A crash can leave a file for this part number before its pending
        // marker was written. Directory writables truncate, but an OPFS sync
        // handle does not, so remove the uncommitted file before rewriting it.
        await location.directory
          .removeEntry(fileName)
          .catch(() => undefined);
      }
      let sink: PngPartSink;
      if (outputMode === "memory") {
        if (partNumber !== 1) {
          throw new PngExportError(
            "pngMemoryLimitExceeded",
            "This export needs more parts than the in-memory path supports.",
          );
        }
        sink = createMemoryPartSink(memoryBudget);
      } else if (outputMode === "directory") {
        sink = await createDirectoryPartSink(
          location!.directory,
          fileName,
        );
      } else {
        sink = await createOpfsPartSink(location!.directory, fileName);
      }
      runtime.writer = new PngZipPartWriter({
        partNumber,
        fileName,
        sink,
        helperFiles: helpers.reserve,
      });
      if (location) {
        await persistManifest("running", {
          fileName,
          partNumber,
          firstFrameIndex: nextFrameIndex,
        });
        await persistCheckpoint("running", {
          fileName,
          partNumber,
          firstFrameIndex: nextFrameIndex,
        });
      }
      emitProgress("rendering", processedFrames, true);
      return helpers;
    };

    const commitPart = async (
      currentWriter: PngZipPartWriter,
      helpers: { finish: () => PngZipHelperFile[] },
    ) => {
      emitProgress("closing", processedFrames, true);
      currentWriter.setRangeEnd(processedFrames);
      const result = await currentWriter.finish(
        frameNameWidth,
        helpers.finish(),
      );
      if (result.blob) {
        runtime.memoryBlob = result.blob;
      }
      parts.push(result.descriptor);
      nextFrameIndex = result.descriptor.nextFrameIndex;
      nextPartNumber = parts.length + 1;
      runtime.writer = null;
      if (location) {
        emitProgress("checkpointing", processedFrames, true);
        await persistManifest("running");
        await persistCheckpoint("running");
      }
      if (location) {
        context.post({
          kind: "png-part-committed",
          jobId,
          attemptId,
          payload: {
            part: result.descriptor,
            nextFrameIndex,
          },
        });
      }
    };

    type PartHelpers = { reserve: PngZipHelperFile[]; finish: () => PngZipHelperFile[] };
    let helpers: PartHelpers | null = null;
    if (nextFrameIndex < totalFrames) {
      helpers = await openPart();
    }
    // Whole-second countdowns repeat the same image for every frame inside a
    // second, so the previous frame's text identifies the previous image.
    let previousFrameText =
      payload.skipDuplicateFrames && nextFrameIndex > 0
        ? getExportFrameText(settings, nextFrameIndex - 1, fps)
        : null;

    while (nextFrameIndex < totalFrames && helpers) {
      if (context.isCancelled()) {
        cancelled = true;
        break;
      }
      const frameIndex = nextFrameIndex;
      if (payload.skipDuplicateFrames) {
        const frameText = getExportFrameText(settings, frameIndex, fps);
        const duplicate =
          previousFrameText !== null && previousFrameText === frameText;
        previousFrameText = frameText;
        if (duplicate) {
          processedFrames = frameIndex + 1;
          nextFrameIndex = processedFrames;
          emitProgress("rendering", processedFrames, false);
          continue;
        }
      }
      const partWriter = getWriter();
      if (!partWriter) {
        throw new PngExportError(
          "pngFailedUnexpectedly",
          "The PNG part writer disappeared during the export.",
        );
      }
      let bytes: Uint8Array<ArrayBuffer>;
      if (dependencies.encodeFrame) {
        bytes = await dependencies.encodeFrame(frameIndex);
      } else {
        drawExportFrame({
          context: canvasContext!,
          settings,
          frameIndex,
          fps,
        });
        bytes = encodeCanvasFrame(canvas!, canvasContext!);
      }
      const frameName = getPngFrameFileName(frameIndex, frameNameWidth);

      if (!partWriter.canAddFrame(frameName, bytes.byteLength)) {
        await commitPart(partWriter, helpers);
        if (context.isCancelled()) {
          cancelled = true;
          break;
        }
        helpers = await openPart();
      }
      const activeWriter = getWriter();
      if (!activeWriter) {
        throw new PngExportError(
          "pngFailedUnexpectedly",
          "The PNG part writer disappeared during the export.",
        );
      }
      emitProgress("writing", frameIndex, true);
      await activeWriter.addFrame(frameIndex, frameName, bytes);
      processedFrames = frameIndex + 1;
      nextFrameIndex = processedFrames;
      emitProgress("rendering", processedFrames, false);

      const now = performance.now();
      if (
        enablePreview &&
        (frameIndex === 0 ||
          frameIndex === totalFrames - 1 ||
          now - lastPreviewAt >= PREVIEW_INTERVAL_MS)
      ) {
        lastPreviewAt = now;
        if (dependencies.emitPreview) {
          await dependencies.emitPreview(processedFrames);
        } else if (canvas) {
          await emitPreview(context, canvas, processedFrames);
        }
      }
    }

    if (cancelled || context.isCancelled()) {
      const activeWriter = getWriter();
      if (activeWriter) {
        await activeWriter.discard().catch(() => undefined);
        runtime.writer = null;
      }
      if (location) {
        nextFrameIndex = committedFrames();
        nextPartNumber = parts.length + 1;
        await persistManifest("interrupted").catch(() => undefined);
        await persistCheckpoint("interrupted").catch(() => undefined);
      }
      context.post({
        kind: "png-cancelled",
        jobId,
        attemptId,
        payload: {
          committedParts: parts,
          resumeAvailable: Boolean(location),
        },
      });
      return;
    }

    const finalWriter = getWriter();
    if (finalWriter && helpers) {
      await commitPart(finalWriter, helpers);
    }

    emitProgress("finalizing", totalFrames, true);
    const blob = runtime.memoryBlob;
    if (location) {
      await writeDirectoryHelpFiles();
      await persistManifest("complete");
      await persistCheckpoint("complete");
    }
    context.post({
      kind: "png-complete",
      jobId,
      attemptId,
      payload: {
        outputMode,
        parts,
        totalFrames,
        totalBytes: totalCommittedBytes(),
        outputDirectoryName: location?.directoryName,
        blob,
      },
    });
  } catch (error) {
    const failedWriter = getWriter();
    if (failedWriter) {
      await failedWriter.discard().catch(() => undefined);
      runtime.writer = null;
    }
    if (location && canPersist) {
      try {
        nextFrameIndex = committedFrames();
        nextPartNumber = parts.length + 1;
        await persistManifest("interrupted");
        await persistCheckpoint("interrupted");
      } catch {
        // The original error is the actionable one.
      }
    }
    const pngError =
      error instanceof PngExportError
        ? error
        : new PngExportError(
            "pngFailedUnexpectedly",
            error instanceof Error
              ? error.message
              : "The PNG export failed unexpectedly.",
          );
    context.post({
      kind: "png-error",
      jobId,
      attemptId,
      payload: {
        errorCode: pngError.code,
        recoverable: Boolean(location) && parts.length > 0,
        committedParts: parts,
        message: pngError.message,
      },
    });
  }
}
