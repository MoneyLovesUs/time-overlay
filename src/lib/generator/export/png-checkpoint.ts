import type {
  PngOutputMode,
  PngPartDescriptor,
} from "@/lib/generator/export/png-contract";
import { PngExportError } from "@/lib/generator/export/png-error";
import type { PngFontFingerprint } from "@/lib/generator/export/png-manifest";
import type { GeneratorSettings } from "@/lib/generator/types";

/**
 * Local checkpoint index. IndexedDB can clone directory handles and font
 * bytes; localStorage JSON cannot. Records are advisory: recovery always
 * re-validates the durable manifest and the actual part files.
 */

const DB_NAME = "time-overlay-png-exports";
const DB_VERSION = 1;
const STORE_NAME = "jobs";

export type PngCheckpointStatus =
  | "running"
  | "interrupted"
  | "complete"
  | "cancelled";

export type PngCheckpoint = {
  jobId: string;
  attemptId: string;
  rendererVersion: string;
  settingsHash: string;
  settings: GeneratorSettings;
  uploadedFont?: PngFontFingerprint & { bytes: ArrayBuffer };
  totalFrames: number;
  fps: number;
  frameNameWidth: number;
  /** Absent on records written before de-duplication existed. */
  skipDuplicateFrames?: boolean;
  outputMode: Exclude<PngOutputMode, "memory">;
  outputDirectory?: FileSystemDirectoryHandle;
  outputDirectoryName?: string;
  parts: PngPartDescriptor[];
  nextFrameIndex: number;
  nextPartNumber: number;
  pendingPart?: {
    fileName: string;
    partNumber: number;
    firstFrameIndex: number;
  };
  status: PngCheckpointStatus;
  updatedAt: string;
};

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  dbPromise ??= (() => {
    const { promise, resolve } = Promise.withResolvers<IDBDatabase | null>();
    let settled = false;
    const finish = (db: IDBDatabase | null) => {
      if (!settled) {
        settled = true;
        resolve(db);
      }
    };
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "jobId" });
        }
      };
      request.onsuccess = () => finish(request.result);
      request.onerror = () => finish(null);
      request.onblocked = () => finish(null);
    } catch {
      finish(null);
    }
    return promise;
  })();
  return dbPromise;
}

export async function isPngCheckpointStoreAvailable(): Promise<boolean> {
  return (await openDatabase()) !== null;
}

function requestAsPromise<T>(request: IDBRequest<T>): Promise<T> {
  const { promise, resolve, reject } = Promise.withResolvers<T>();
  request.onsuccess = () => resolve(request.result);
  request.onerror = () =>
    reject(
      new PngExportError(
        "pngCheckpointFailed",
        "The local export checkpoint could not be read.",
        true,
      ),
    );
  return promise;
}

export async function putPngCheckpoint(checkpoint: PngCheckpoint): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    throw new PngExportError(
      "pngCheckpointFailed",
      "This browser does not allow the local checkpoint a resumable export needs.",
    );
  }
  try {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    await requestAsPromise(transaction.objectStore(STORE_NAME).put(checkpoint));
  } catch (error) {
    if (error instanceof PngExportError) {
      throw error;
    }
    throw new PngExportError(
      "pngCheckpointFailed",
      "The local export checkpoint could not be saved.",
      true,
    );
  }
}

export async function getPngCheckpoint(
  jobId: string,
): Promise<PngCheckpoint | null> {
  const db = await openDatabase();
  if (!db) {
    return null;
  }
  try {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const record = await requestAsPromise<PngCheckpoint | undefined>(
      transaction.objectStore(STORE_NAME).get(jobId),
    );
    return record ?? null;
  } catch {
    return null;
  }
}

export async function listPngCheckpoints(): Promise<PngCheckpoint[]> {
  const db = await openDatabase();
  if (!db) {
    return [];
  }
  try {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const records = await requestAsPromise<PngCheckpoint[]>(
      transaction.objectStore(STORE_NAME).getAll(),
    );
    return records.filter(
      (record) =>
        record &&
        typeof record.jobId === "string" &&
        Array.isArray(record.parts) &&
        record.status !== "cancelled",
    );
  } catch {
    return [];
  }
}

export async function deletePngCheckpoint(jobId: string): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    return;
  }
  try {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    await requestAsPromise(transaction.objectStore(STORE_NAME).delete(jobId));
  } catch {
    // Removing a recovery record is best-effort; its parts stay untouched.
  }
}
