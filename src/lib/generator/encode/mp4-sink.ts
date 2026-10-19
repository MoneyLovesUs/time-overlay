import {
  BufferTarget,
  StreamTarget,
  type StreamTargetChunk,
  type Target,
} from "mediabunny";

/**
 * Where an MP4 export is written. The in-memory sink is the original path; the
 * OPFS sink streams to the browser's origin-private file system so long
 * exports stay within a phone's memory, and hands back a disk-backed File.
 */
export type Mp4Sink = {
  target: Target;
  finish: () => Promise<Blob>;
  abort: () => Promise<void>;
  // Set when a disk write failed, so the encoder can surface a storage error
  // instead of whatever the muxer wrapped it in.
  readonly writeError: Mp4SinkError | null;
};

export type Mp4SinkErrorCode = "mp4StorageUnavailable" | "mp4StorageFull";

export class Mp4SinkError extends Error {
  readonly code: Mp4SinkErrorCode;

  constructor(code: Mp4SinkErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const OPFS_EXPORT_PREFIX = "time-overlay-export-";
const OPFS_CHUNK_SIZE = 4 * 1024 * 1024;
// The bitrate estimate is a ceiling: flat timer frames encode far smaller
// (a 10-minute test export came out at ~10% of it). Only refuse up front when
// even half of it will not fit; a real overflow surfaces as mp4StorageFull.
const STORAGE_PRECHECK_FRACTION = 0.5;

const STORAGE_FULL_MESSAGE =
  "Not enough free storage on this device for this export.";

export function createMemoryMp4Sink(): Mp4Sink {
  const target = new BufferTarget();
  return {
    target,
    async finish() {
      if (!target.buffer) {
        throw new Error("Encoder finalized without producing a buffer.");
      }
      return new Blob([target.buffer], { type: "video/mp4" });
    },
    async abort() {},
    writeError: null,
  };
}

type SyncAccessHandle = {
  write: (data: Uint8Array, options: { at: number }) => number;
  flush: () => void;
  close: () => void;
};

type SyncAccessFileHandle = FileSystemFileHandle & {
  createSyncAccessHandle?: () => Promise<SyncAccessHandle>;
};

/**
 * The previous export's file must outlive its download, so stale files are
 * swept when the next export starts rather than right after completion.
 */
async function removeStaleExports(root: FileSystemDirectoryHandle) {
  const names: string[] = [];
  const entries = (
    root as FileSystemDirectoryHandle & { keys?: () => AsyncIterable<string> }
  ).keys?.();
  if (!entries) {
    return;
  }
  for await (const name of entries) {
    if (name.startsWith(OPFS_EXPORT_PREFIX)) {
      names.push(name);
    }
  }
  await Promise.all(
    names.map((name) => root.removeEntry(name).catch(() => undefined)),
  );
}

/** Worker-only: sync access handles are not exposed on the main thread. */
export async function createOpfsMp4Sink(
  estimatedBytes: number,
): Promise<Mp4Sink> {
  let root: FileSystemDirectoryHandle;
  let fileHandle: SyncAccessFileHandle;
  let access: SyncAccessHandle;
  const fileName = `${OPFS_EXPORT_PREFIX}${Date.now()}.mp4`;

  try {
    root = await navigator.storage.getDirectory();
    await removeStaleExports(root);
  } catch {
    throw new Mp4SinkError(
      "mp4StorageUnavailable",
      "This browser blocked the local storage needed for long MP4 exports.",
    );
  }

  try {
    const { quota, usage } = await navigator.storage.estimate();
    if (
      typeof quota === "number" &&
      quota - (usage ?? 0) < estimatedBytes * STORAGE_PRECHECK_FRACTION
    ) {
      throw new Mp4SinkError("mp4StorageFull", STORAGE_FULL_MESSAGE);
    }
  } catch (error) {
    if (error instanceof Mp4SinkError) {
      throw error;
    }
    // estimate() is advisory; a failure here should not block the export.
  }

  try {
    fileHandle = await root.getFileHandle(fileName, { create: true });
    if (!fileHandle.createSyncAccessHandle) {
      throw new Error("createSyncAccessHandle is unavailable.");
    }
    access = await fileHandle.createSyncAccessHandle();
  } catch {
    await root.removeEntry(fileName).catch(() => undefined);
    throw new Mp4SinkError(
      "mp4StorageUnavailable",
      "This browser blocked the local storage needed for long MP4 exports.",
    );
  }

  let closed = false;
  let writeError: Mp4SinkError | null = null;
  const close = () => {
    if (!closed) {
      closed = true;
      access.close();
    }
  };

  const writable = new WritableStream<StreamTargetChunk>({
    write(chunk) {
      let written: number;
      try {
        written = access.write(chunk.data, { at: chunk.position });
      } catch (error) {
        writeError =
          error instanceof DOMException && error.name === "QuotaExceededError"
            ? new Mp4SinkError("mp4StorageFull", STORAGE_FULL_MESSAGE)
            : null;
        throw writeError ?? error;
      }
      // Chromium does not throw at the quota: write() returns a count other
      // than the chunk length (seen: 0xFFFFFFF8), which would otherwise ship
      // a silently truncated MP4.
      if (written !== chunk.data.byteLength) {
        writeError = new Mp4SinkError("mp4StorageFull", STORAGE_FULL_MESSAGE);
        throw writeError;
      }
    },
  });

  return {
    target: new StreamTarget(writable, {
      chunked: true,
      chunkSize: OPFS_CHUNK_SIZE,
    }),
    async finish() {
      access.flush();
      close();
      const file = await fileHandle.getFile();
      return file.type === "video/mp4"
        ? file
        : new File([file], file.name, { type: "video/mp4" });
    },
    async abort() {
      try {
        close();
      } finally {
        await root.removeEntry(fileName).catch(() => undefined);
      }
    },
    get writeError() {
      return writeError;
    },
  };
}
