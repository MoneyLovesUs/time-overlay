import { PNG_MEMORY_BUDGET_BYTES } from "@/lib/generator/export/png-limits";
import {
  PngExportError,
  toPngStorageError,
} from "@/lib/generator/export/png-error";

/**
 * Disk/memory sinks for one PNG ZIP part. A sink commits nothing until
 * `close()` resolves: a created handle or a resolved write is not a saved file.
 */
export type PngPartSink = {
  /** Total bytes accepted by the sink so far. */
  readonly bytesWritten: number;
  write: (chunk: Uint8Array<ArrayBuffer>) => Promise<void>;
  close: () => Promise<{ file?: File; blob?: Blob; size: number }>;
  discard: () => Promise<void>;
};

const MAX_WRITE_CHUNK_BYTES = 4 * 1024 * 1024;

type SyncAccessHandle = {
  write: (data: Uint8Array, options?: { at?: number }) => number;
  flush: () => void;
  close: () => void;
};

type SyncAccessFileHandle = FileSystemFileHandle & {
  createSyncAccessHandle?: () => Promise<SyncAccessHandle>;
};

async function writeInBoundedChunks(
  recipient: (bytes: Uint8Array<ArrayBuffer>) => Promise<void> | void,
  chunk: Uint8Array<ArrayBuffer>,
) {
  let offset = 0;
  while (offset < chunk.byteLength) {
    const end = Math.min(offset + MAX_WRITE_CHUNK_BYTES, chunk.byteLength);
    // A subarray view avoids copying a multi-megabyte chunk just to split it.
    await recipient(chunk.subarray(offset, end) as Uint8Array<ArrayBuffer>);
    offset = end;
  }
}

/** Directory mode: an ordinary read/write file in the user's picked folder. */
export async function createDirectoryPartSink(
  directory: FileSystemDirectoryHandle,
  fileName: string,
): Promise<PngPartSink> {
  let writable: FileSystemWritableFileStream;
  let fileHandle: FileSystemFileHandle;
  try {
    fileHandle = await directory.getFileHandle(fileName, { create: true });
    writable = await fileHandle.createWritable({ keepExistingData: false });
  } catch (error) {
    throw toPngStorageError(error);
  }

  let bytesWritten = 0;
  let closed = false;

  return {
    get bytesWritten() {
      return bytesWritten;
    },
    async write(chunk) {
      try {
        await writeInBoundedChunks(async (slice) => {
          await writable.write(slice);
          bytesWritten += slice.byteLength;
        }, chunk);
      } catch (error) {
        throw toPngStorageError(error);
      }
    },
    async close() {
      if (closed) {
        throw new PngExportError(
          "pngWriteFailed",
          "The PNG part was already closed.",
        );
      }
      closed = true;
      try {
        await writable.close();
      } catch (error) {
        throw toPngStorageError(error);
      }
      const file = await fileHandle.getFile();
      if (file.size !== bytesWritten) {
        throw new PngExportError(
          "pngZipValidationFailed",
          "The saved ZIP size does not match the bytes written.",
          true,
        );
      }
      return { file, size: file.size };
    },
    async discard() {
      try {
        await writable.abort();
      } catch {
        // Already closed/failed; the file removal below is the real cleanup.
      }
      await directory.removeEntry(fileName).catch(() => undefined);
    },
  };
}

/** OPFS mode: dedicated-worker-only synchronous access handle. */
export async function createOpfsPartSink(
  directory: FileSystemDirectoryHandle,
  fileName: string,
): Promise<PngPartSink> {
  let access: SyncAccessHandle;
  let fileHandle: SyncAccessFileHandle;
  try {
    fileHandle = (await directory.getFileHandle(fileName, {
      create: true,
    })) as SyncAccessFileHandle;
    if (!fileHandle.createSyncAccessHandle) {
      throw new PngExportError(
        "pngStorageUnavailable",
        "This browser cannot stream PNG exports to local storage.",
      );
    }
    access = await fileHandle.createSyncAccessHandle();
  } catch (error) {
    await directory.removeEntry(fileName).catch(() => undefined);
    if (error instanceof PngExportError) {
      throw error;
    }
    throw toPngStorageError(error);
  }

  let bytesWritten = 0;
  let closed = false;

  return {
    get bytesWritten() {
      return bytesWritten;
    },
    async write(chunk) {
      try {
        await writeInBoundedChunks((slice) => {
          const written = access.write(slice);
          // Chromium can return a short/negative count at the quota instead of
          // throwing; continuing would publish a silently truncated ZIP.
          if (written !== slice.byteLength) {
            throw new PngExportError(
              "pngStorageFull",
              "Not enough free storage to finish this PNG part.",
              true,
            );
          }
          bytesWritten += written;
        }, chunk);
      } catch (error) {
        throw toPngStorageError(error);
      }
    },
    async close() {
      if (closed) {
        throw new PngExportError(
          "pngWriteFailed",
          "The PNG part was already closed.",
        );
      }
      let closeError: PngExportError | undefined;
      try {
        access.flush();
      } catch (error) {
        closeError = toPngStorageError(error);
      }
      try {
        access.close();
        closed = true;
      } catch (error) {
        // Preserve the flush failure; discard can retry a failed close.
        closeError ??= toPngStorageError(error);
      }
      if (closeError) {
        throw closeError;
      }
      const file = await fileHandle.getFile();
      if (file.size !== bytesWritten) {
        throw new PngExportError(
          "pngZipValidationFailed",
          "The stored ZIP size does not match the bytes written.",
          true,
        );
      }
      return { file, size: file.size };
    },
    async discard() {
      try {
        if (!closed) {
          closed = true;
          access.close();
        }
      } catch {
        // Ignore; removal below is the cleanup that matters.
      }
      await directory.removeEntry(fileName).catch(() => undefined);
    },
  };
}

export type PngMemoryBudget = { usedBytes: number; limitBytes: number };

export function createPngMemoryBudget(
  limitBytes = PNG_MEMORY_BUDGET_BYTES,
): PngMemoryBudget {
  return { usedBytes: 0, limitBytes };
}

/**
 * Short-job compatibility path. The cap covers every archive chunk in the whole
 * job, not one chunk; exceeding it terminates instead of growing unbounded.
 */
export function createMemoryPartSink(budget: PngMemoryBudget): PngPartSink {
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let bytesWritten = 0;
  let discarded = false;

  return {
    get bytesWritten() {
      return bytesWritten;
    },
    async write(chunk) {
      if (discarded) {
        throw new PngExportError("pngWriteFailed", "The archive was discarded.");
      }
      if (budget.usedBytes + chunk.byteLength > budget.limitBytes) {
        throw new PngExportError(
          "pngMemoryLimitExceeded",
          "This export needs more temporary memory than the browser allows.",
        );
      }
      // Keep an owned copy: the ZIP writer may reuse its scratch buffer.
      const copy = chunk.slice();
      chunks.push(copy);
      budget.usedBytes += copy.byteLength;
      bytesWritten += copy.byteLength;
    },
    async close() {
      if (discarded) {
        throw new PngExportError("pngWriteFailed", "The archive was discarded.");
      }
      return {
        blob: new Blob(chunks, { type: "application/zip" }),
        size: bytesWritten,
      };
    },
    async discard() {
      discarded = true;
      for (const chunk of chunks) {
        budget.usedBytes -= chunk.byteLength;
      }
      chunks.length = 0;
    },
  };
}

export async function readOpfsFile(
  directory: FileSystemDirectoryHandle,
  fileName: string,
): Promise<File> {
  const handle = await directory.getFileHandle(fileName);
  return handle.getFile();
}

/**
 * Actual write/read/delete probe. The API being present does not mean this
 * browser profile can persist an export (private mode, quota, policy).
 */
export async function probeOpfsWritable(): Promise<boolean> {
  try {
    const root = await navigator.storage.getDirectory();
    const probe = `time-overlay-png-probe-${Math.random()
      .toString(36)
      .slice(2)}.tmp`;
    const handle = (await root.getFileHandle(probe, {
      create: true,
    })) as SyncAccessFileHandle;
    if (!handle.createSyncAccessHandle) {
      await root.removeEntry(probe).catch(() => undefined);
      return false;
    }
    const access = await handle.createSyncAccessHandle();
    try {
      const payload = new Uint8Array([0x70, 0x6e, 0x67, 0x0a]);
      const written = access.write(payload);
      access.flush();
      access.close();
      if (written !== payload.byteLength) {
        return false;
      }
      const file = await handle.getFile();
      const stored = new Uint8Array(await file.arrayBuffer());
      return (
        stored.byteLength === payload.byteLength &&
        payload.every((byte, index) => stored[index] === byte)
      );
    } finally {
      await root.removeEntry(probe).catch(() => undefined);
    }
  } catch {
    return false;
  }
}
