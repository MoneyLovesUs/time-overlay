import type { PngPartDescriptor } from "@/lib/generator/export/png-contract";
import {
  type PngCheckpoint,
  deletePngCheckpoint,
} from "@/lib/generator/export/png-checkpoint";
import {
  listDirectoryNames,
  type PngManifest,
  readLatestPngManifest,
} from "@/lib/generator/export/png-manifest";
import {
  getPngJobDirectoryName,
  getPngOpfsNamespace,
  PNG_JOB_DIRECTORY_PATTERN,
} from "@/lib/generator/export/png-naming";

const DISMISSED_STORAGE_KEY = "time-overlay-png-dismissed";

export function supportsPngDirectoryPicker(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (
      window as Window & { showDirectoryPicker?: unknown }
    ).showDirectoryPicker === "function"
  );
}

type PickerWindow = Window & {
  showDirectoryPicker: (options?: {
    id?: string;
    mode?: "read" | "readwrite";
  }) => Promise<FileSystemDirectoryHandle>;
};

/**
 * Must be called synchronously inside the click handler: awaiting sampling or
 * other work first would consume the user activation the picker requires.
 * AbortError means the user closed the picker; it is not an export failure.
 */
export async function pickPngDirectory(): Promise<
  FileSystemDirectoryHandle | "cancelled"
> {
  if (!supportsPngDirectoryPicker()) {
    throw new Error("This browser cannot save into a folder.");
  }
  const picker = window as unknown as PickerWindow;
  if (!picker.showDirectoryPicker) {
    throw new Error("This browser cannot save into a folder.");
  }
  try {
    return await picker.showDirectoryPicker({
      id: "time-overlay-png",
      mode: "readwrite",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    throw error;
  }
}

export type PngJobDirectory = {
  jobId: string;
  directoryName: string;
  directory: FileSystemDirectoryHandle;
};

function newJobId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Exclusive task subdirectory; never overwrite an existing export folder. */
export async function createPngJobDirectory(
  parent: FileSystemDirectoryHandle,
  preferredJobId = newJobId(),
): Promise<PngJobDirectory> {
  let jobId = preferredJobId;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const directoryName = getPngJobDirectoryName(jobId);
    try {
      await parent.getDirectoryHandle(directoryName);
      // Exists: pick a fresh id instead of writing into it.
      jobId = newJobId();
    } catch (error) {
      if (error instanceof DOMException && error.name !== "NotFoundError") {
        throw error;
      }
      return {
        jobId,
        directoryName,
        directory: await parent.getDirectoryHandle(directoryName, {
          create: true,
        }),
      };
    }
  }
  throw new Error("Could not create a unique export folder.");
}

type PermissionCapableDirectory = FileSystemDirectoryHandle & {
  queryPermission?: (descriptor: {
    mode: "read" | "readwrite";
  }) => Promise<PermissionState>;
  requestPermission?: (descriptor: {
    mode: "read" | "readwrite";
  }) => Promise<PermissionState>;
};

export async function queryPngDirectoryPermission(
  directory: FileSystemDirectoryHandle,
): Promise<PermissionState> {
  const handle = directory as PermissionCapableDirectory;
  try {
    return await handle.queryPermission?.({ mode: "readwrite" }) ?? "prompt";
  } catch {
    return "prompt";
  }
}

/** Call directly from a click: requestPermission needs that gesture. */
export async function requestPngDirectoryPermission(
  directory: FileSystemDirectoryHandle,
): Promise<PermissionState> {
  const handle = directory as PermissionCapableDirectory;
  try {
    return await handle.requestPermission?.({ mode: "readwrite" }) ?? "prompt";
  } catch {
    return "denied";
  }
}

export type PngJobLock = { release: () => void };

/**
 * One jobId-level Web Lock stops two tabs writing the same task. Environments
 * without Web Locks cannot offer resumable long exports.
 */
export async function tryAcquirePngJobLock(
  jobId: string,
): Promise<PngJobLock | null> {
  if (
    typeof navigator === "undefined" ||
    !navigator.locks ||
    typeof navigator.locks.request !== "function"
  ) {
    return null;
  }
  const held = Promise.withResolvers<void>();
  const released = Promise.withResolvers<void>();
  let acquired = false;
  const request = navigator.locks
    .request(`time-overlay-png-${jobId}`, { ifAvailable: true }, async (lock) => {
      if (!lock) {
        held.resolve();
        return;
      }
      acquired = true;
      held.resolve();
      await released.promise;
    })
    .catch(() => {
      held.resolve();
    });

  await Promise.race([held.promise, request]);
  if (!acquired) {
    return null;
  }
  return {
    release: () => {
      released.resolve();
    },
  };
}

/** Browser-storage namespace for one job, or null when OPFS is unavailable. */
export async function getPngOpfsJobDirectory(
  jobId: string,
): Promise<FileSystemDirectoryHandle | null> {
  try {
    const root = await navigator.storage.getDirectory();
    const namespace = await root.getDirectoryHandle(getPngOpfsNamespace(), {
      create: false,
    });
    if (!jobId) {
      return namespace;
    }
    return await namespace.getDirectoryHandle(jobId);
  } catch {
    return null;
  }
}

export async function readOpfsPngPart(
  jobId: string,
  fileName: string,
): Promise<File> {
  const directory = await getPngOpfsJobDirectory(jobId);
  if (!directory) {
    throw new Error("The browser export files are no longer available.");
  }
  return (await directory.getFileHandle(fileName)).getFile();
}

export async function readPngFontBackup(
  directory: FileSystemDirectoryHandle,
): Promise<ArrayBuffer | null> {
  try {
    const assets = await directory.getDirectoryHandle("assets");
    const handle = await assets.getFileHandle("font.bin");
    return await (await handle.getFile()).arrayBuffer();
  } catch {
    return null;
  }
}

function readDismissed(): string[] {
  if (typeof localStorage === "undefined") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(DISMISSED_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeDismissed(ids: string[]) {
  if (typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(ids.slice(-50)));
  } catch {
    // A storage failure only means the card can reappear.
  }
}

export function dismissPngRecovery(jobId: string) {
  const dismissed = readDismissed();
  if (!dismissed.includes(jobId)) {
    writeDismissed([...dismissed, jobId]);
  }
}

export function undismissPngRecovery(jobId: string) {
  writeDismissed(readDismissed().filter((id) => id !== jobId));
}

export type PngOpfsJob = {
  jobId: string;
  directory: FileSystemDirectoryHandle;
  manifest: PngManifest;
};

/** Scan the project namespace so a lost IndexedDB index can still recover. */
export async function scanPngOpfsJobs(): Promise<PngOpfsJob[]> {
  const namespace = await getPngOpfsJobDirectory("");
  if (!namespace) {
    return [];
  }
  const dismissed = readDismissed();
  const jobs: PngOpfsJob[] = [];
  for (const name of await listDirectoryNames(namespace)) {
    if (
      !PNG_JOB_DIRECTORY_PATTERN.test(`time-overlay-${name}`) ||
      dismissed.includes(name)
    ) {
      continue;
    }
    try {
      const directory = await namespace.getDirectoryHandle(name);
      const latest = await readLatestPngManifest(directory, name);
      if (!latest) {
        continue;
      }
      jobs.push({ jobId: name, directory, manifest: latest.manifest });
    } catch {
      // Not one of ours, or unreadable; leave it alone.
    }
  }
  return jobs;
}

/**
 * Remove only browser-temporary data for this project's job. Never touches the
 * user's picked folder.
 */
export async function cleanPngOpfsJob(jobId: string): Promise<void> {
  const namespace = await getPngOpfsJobDirectory("");
  if (namespace) {
    await namespace.removeEntry(jobId, { recursive: true }).catch(() => undefined);
  }
  await deletePngCheckpoint(jobId);
  undismissPngRecovery(jobId);
}

export async function removePngRecoveryRecord(jobId: string) {
  await deletePngCheckpoint(jobId);
  dismissPngRecovery(jobId);
}

export type PngRecoveryOffer = {
  jobId: string;
  manifest: PngManifest;
  checkpoint: PngCheckpoint | null;
  jobDirectory: FileSystemDirectoryHandle | null;
  /** Where the record came from, so completed OPFS parts are not confused
   * with a user folder whose files cannot be read through the OPFS helper. */
  source: "opfs" | "indexeddb" | "folder";
  /** The kept manifest needs the user to reselect the task folder. */
  needsDirectorySelection: boolean;
  needsPermission: boolean;
  parts: PngPartDescriptor[];
};

/**
 * Merge the IndexedDB index with OPFS manifests. The durable manifest wins on
 * part lists because IndexedDB and the filesystem have no shared transaction.
 */
export async function collectPngRecoveryOffers(
  checkpoints: PngCheckpoint[],
): Promise<PngRecoveryOffer[]> {
  const offers = new Map<string, PngRecoveryOffer>();

  for (const checkpoint of checkpoints) {
    if (checkpoint.status === "complete" || checkpoint.status === "cancelled") {
      continue;
    }
    const manifest = checkpoint.outputDirectory
      ? await readLatestPngManifest(
          checkpoint.outputDirectory,
          checkpoint.jobId,
        ).catch(() => null)
      : null;
    const source = manifest?.manifest;
    if (source && source.status === "complete") {
      continue;
    }
    offers.set(checkpoint.jobId, {
      jobId: checkpoint.jobId,
      manifest:
        source ??
        ({
          schema: "time-overlay-png-manifest",
          version: 1,
          jobId: checkpoint.jobId,
          rendererVersion: checkpoint.rendererVersion,
          settingsHash: checkpoint.settingsHash,
          settings: checkpoint.settings,
          uploadedFont: checkpoint.uploadedFont
            ? {
                family: checkpoint.uploadedFont.family,
                sha256: checkpoint.uploadedFont.sha256,
                byteLength: checkpoint.uploadedFont.byteLength,
              }
            : undefined,
          totalFrames: checkpoint.totalFrames,
          fps: checkpoint.fps,
          frameNameWidth: checkpoint.frameNameWidth,
          outputMode: checkpoint.outputMode,
          parts: checkpoint.parts,
          nextFrameIndex: checkpoint.nextFrameIndex,
          nextPartNumber: checkpoint.nextPartNumber,
          status: "interrupted",
          updatedAt: checkpoint.updatedAt,
        } satisfies PngManifest),
      checkpoint,
      jobDirectory: checkpoint.outputDirectory ?? null,
      source: "indexeddb",
      needsDirectorySelection:
        checkpoint.outputMode === "directory" && !checkpoint.outputDirectory,
      needsPermission: false,
      parts: source?.parts ?? checkpoint.parts,
    });
  }

  for (const job of await scanPngOpfsJobs()) {
    const existing = offers.get(job.jobId);
    offers.set(job.jobId, {
      jobId: job.jobId,
      manifest: job.manifest,
      checkpoint: existing?.checkpoint ?? null,
      jobDirectory: job.directory,
      source: "opfs",
      needsDirectorySelection: false,
      needsPermission: false,
      parts: job.manifest.parts,
    });
  }

  return [...offers.values()];
}
