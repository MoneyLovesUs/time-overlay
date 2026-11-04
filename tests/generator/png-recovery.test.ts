import { describe, expect, it, vi } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import {
  PNG_RENDERER_VERSION,
  type PngPartDescriptor,
  type PngStartPayload,
} from "@/lib/generator/export/png-contract";
import {
  runPngExport,
  type PngEngineContext,
} from "@/lib/generator/export/png-engine";
import type { PngCheckpoint } from "@/lib/generator/export/png-checkpoint";
import { readLatestPngManifest } from "@/lib/generator/export/png-manifest";
import { PngExportError } from "@/lib/generator/export/png-error";
import type { ExportWorkerMessage } from "@/lib/generator/export/job";

/**
 * Minimal in-memory File System Access directory. This is a filesystem
 * boundary, not a mock of the module under test: the engine reads and writes
 * real File/Blob objects through the same APIs a browser uses.
 */
class MemoryFile {
  bytes = new Uint8Array(0);
}

type PartFaults = {
  gate?: Promise<void>;
  failure?: "write" | "close" | "shortWrite";
  onWrite?: (bytes: number) => void;
};

class MemoryFileHandle {
  constructor(
    private readonly file: MemoryFile,
    readonly name: string,
    private readonly faults?: PartFaults,
  ) {}
  async getFile() {
    return new File([Uint8Array.from(this.file.bytes)], this.name);
  }
  async createWritable() {
    const file = this.file;
    const faults = this.faults;
    let buffer = new Uint8Array(0);
    return {
      async write(data: Uint8Array | string) {
        const next =
          typeof data === "string" ? new TextEncoder().encode(data) : data;
        faults?.onWrite?.(next.byteLength);
        if (faults?.gate) {
          await faults.gate;
        }
        if (faults?.failure === "write") {
          throw new DOMException("write failed", "NotReadableError");
        }
        if (faults?.failure === "shortWrite") {
          throw new PngExportError(
            "pngStorageFull",
            "The storage accepted fewer bytes than were written.",
            true,
          );
        }
        const merged = new Uint8Array(buffer.length + next.byteLength);
        merged.set(buffer);
        merged.set(next, buffer.length);
        buffer = merged;
      },
      async close() {
        if (faults?.failure === "close") {
          throw new DOMException("close failed", "NotReadableError");
        }
        file.bytes = Uint8Array.from(buffer);
      },
      async abort() {
        file.bytes = new Uint8Array(0);
      },
    };
  }
}

class MemoryDirectory {
  readonly files = new Map<string, MemoryFile>();
  readonly directories = new Map<string, MemoryDirectory>();
  partFaults?: PartFaults;
  constructor(readonly name: string) {}

  async getFileHandle(name: string, options?: { create?: boolean }) {
    let file = this.files.get(name);
    if (!file) {
      if (!options?.create) {
        throw new DOMException("missing", "NotFoundError");
      }
      file = new MemoryFile();
      this.files.set(name, file);
    }
    return new MemoryFileHandle(
      file,
      name,
      name.startsWith("timer-part-") ? this.partFaults : undefined,
    ) as unknown as FileSystemFileHandle;
  }

  async getDirectoryHandle(name: string, options?: { create?: boolean }) {
    let directory = this.directories.get(name);
    if (!directory) {
      if (!options?.create) {
        throw new DOMException("missing", "NotFoundError");
      }
      directory = new MemoryDirectory(name);
      this.directories.set(name, directory);
    }
    return directory as unknown as FileSystemDirectoryHandle;
  }

  async removeEntry(name: string) {
    if (!this.files.delete(name) && !this.directories.delete(name)) {
      throw new DOMException("missing", "NotFoundError");
    }
  }

  async *keys() {
    for (const name of this.files.keys()) {
      yield name;
    }
    for (const name of this.directories.keys()) {
      yield name;
    }
  }

  snapshot() {
    return new Map(
      [...this.files.entries()].map(([name, file]) => [
        name,
        [...file.bytes],
      ]),
    );
  }

  latestManifestFile() {
    const name = [...this.files.keys()]
      .filter((entry) => /^manifest-\d{6}\.json$/.test(entry))
      .sort()
      .at(-1)!;
    return { name, text: new TextDecoder().decode(this.files.get(name)!.bytes) };
  }
}

function createContext(overrides: Partial<PngEngineContext> = {}) {
  const messages: ExportWorkerMessage[] = [];
  const context: PngEngineContext = {
    jobId: "job-recovery-test",
    attemptId: "attempt-1",
    post: (message) => messages.push(message),
    isCancelled: () => false,
    isPreviewAllowed: () => false,
    onPreviewPosted: () => undefined,
    ...overrides,
  };
  return { context, messages };
}

function createPayload(
  directory: MemoryDirectory,
  overrides: Partial<PngStartPayload> = {},
): PngStartPayload {
  const settings = createGeneratorSettings({
    timer: { durationSeconds: 3 },
    export: { format: "png-sequence", fps: 30 },
  });
  return {
    jobId: "job-recovery-test",
    attemptId: "attempt-1",
    settings,
    rendererVersion: PNG_RENDERER_VERSION,
    outputMode: "directory",
    outputDirectory: directory as unknown as FileSystemDirectoryHandle,
    outputDirectoryName: directory.name,
    enablePreview: false,
    ...overrides,
  };
}

async function runFresh(
  directory: MemoryDirectory,
  overrides: Partial<PngStartPayload> = {},
) {
  const { context, messages } = createContext();
  const checkpoints: PngCheckpoint[] = [];
  await runPngExport(context, createPayload(directory, overrides), false, {
    encodeFrame: async (frameIndex) =>
      new Uint8Array([frameIndex & 0xff, 0x50, 0x4e, 0x47]),
    persistCheckpoint: async (checkpoint) => {
      checkpoints.push(checkpoint);
    },
  });
  const complete = messages.find(
    (message) => message.kind === "png-complete",
  );
  expect(complete).toBeDefined();
  return { messages, checkpoints };
}

describe("PNG recovery ownership", () => {
  it("leaves the committed manifest untouched when resume validation rejects settings", async () => {
    const directory = new MemoryDirectory("time-overlay-job-recovery-test");
    await runFresh(directory);
    const before = directory.snapshot();

    const settings = createGeneratorSettings({
      timer: { durationSeconds: 3 },
      export: { format: "png-sequence", fps: 30 },
      textStyle: { textColor: "#123456" },
    });
    const { context, messages } = createContext();
    const latest = directory.latestManifestFile();
    const manifest = JSON.parse(latest.text) as {
      parts: PngPartDescriptor[];
      nextFrameIndex: number;
      nextPartNumber: number;
    };

    await runPngExport(
      context,
      createPayload(directory, {
        attemptId: "attempt-rejected",
        settings,
        resumeFrom: {
          nextFrameIndex: manifest.nextFrameIndex,
          nextPartNumber: manifest.nextPartNumber,
          parts: manifest.parts,
        },
      }),
      true,
      {
        encodeFrame: async () => {
          throw new Error("must not render a rejected resume");
        },
        persistCheckpoint: async () => {
          throw new Error("must not persist a rejected resume");
        },
      },
    );

    expect(
      messages.find((message) => message.kind === "png-error")?.payload,
    ).toMatchObject({ errorCode: "pngResumeVersionMismatch" });
    expect(directory.snapshot()).toEqual(before);
  });

  it("does not delete or rewrite metadata when a committed part is missing", async () => {
    const directory = new MemoryDirectory("time-overlay-job-recovery-test");
    await runFresh(directory);
    directory.files.delete("timer-part-001.zip");
    const before = directory.snapshot();

    const latest = JSON.parse(directory.latestManifestFile().text) as {
      parts: PngPartDescriptor[];
      nextFrameIndex: number;
      nextPartNumber: number;
    };
    const { context, messages } = createContext();
    await runPngExport(
      context,
      createPayload(directory, {
        attemptId: "attempt-missing",
        resumeFrom: {
          nextFrameIndex: latest.nextFrameIndex,
          nextPartNumber: latest.nextPartNumber,
          parts: latest.parts,
        },
      }),
      true,
      {
        encodeFrame: async () => {
          throw new Error("must not render a rejected resume");
        },
        persistCheckpoint: async () => {
          throw new Error("must not persist a rejected resume");
        },
      },
    );

    expect(
      messages.find((message) => message.kind === "png-error")?.payload,
    ).toMatchObject({ errorCode: "pngResumeFileMissing" });
    expect(directory.snapshot()).toEqual(before);
  });

  it("rejects a different font without rewriting the manifest", async () => {
    const directory = new MemoryDirectory("time-overlay-job-recovery-test");
    await runFresh(directory, {
      uploadedFont: { family: "custom-font", data: new ArrayBuffer(8) },
    });
    const before = directory.snapshot();
    const latest = JSON.parse(directory.latestManifestFile().text) as {
      parts: PngPartDescriptor[];
      nextFrameIndex: number;
      nextPartNumber: number;
    };
    const { context, messages } = createContext();
    await runPngExport(
      context,
      createPayload(directory, {
        attemptId: "attempt-font",
        uploadedFont: { family: "custom-font", data: new ArrayBuffer(9) },
        resumeFrom: {
          nextFrameIndex: latest.nextFrameIndex,
          nextPartNumber: latest.nextPartNumber,
          parts: latest.parts,
        },
      }),
      true,
      {
        encodeFrame: async () => {
          throw new Error("must not render a rejected resume");
        },
        persistCheckpoint: async () => {
          throw new Error("must not persist a rejected resume");
        },
      },
    );
    expect(
      messages.find((message) => message.kind === "png-error")?.payload,
    ).toMatchObject({ errorCode: "pngResumeVersionMismatch" });
    expect(directory.snapshot()).toEqual(before);
  });

  it("rejects a corrupted committed part without rewriting metadata", async () => {
    const directory = new MemoryDirectory("time-overlay-job-recovery-test");
    await runFresh(directory);
    const file = directory.files.get("timer-part-001.zip")!;
    file.bytes = Uint8Array.from(file.bytes);
    file.bytes[file.bytes.length - 30] ^= 0xff;
    const before = directory.snapshot();
    const latest = JSON.parse(directory.latestManifestFile().text) as {
      parts: PngPartDescriptor[];
      nextFrameIndex: number;
      nextPartNumber: number;
    };
    const { context, messages } = createContext();
    await runPngExport(
      context,
      createPayload(directory, {
        attemptId: "attempt-corrupt",
        resumeFrom: {
          nextFrameIndex: latest.nextFrameIndex,
          nextPartNumber: latest.nextPartNumber,
          parts: latest.parts,
        },
      }),
      true,
      {
        encodeFrame: async () => {
          throw new Error("must not render a rejected resume");
        },
        persistCheckpoint: async () => {
          throw new Error("must not persist a rejected resume");
        },
      },
    );
    expect(
      messages.find((message) => message.kind === "png-error")?.payload,
    ).toMatchObject({ errorCode: "pngResumeFileMissing" });
    expect(directory.snapshot()).toEqual(before);
  });

  it("repairs only the manifest when every frame was already committed", async () => {
    const directory = new MemoryDirectory("time-overlay-job-recovery-test");
    await runFresh(directory);
    const latest = JSON.parse(directory.latestManifestFile().text) as {
      parts: PngPartDescriptor[];
      nextFrameIndex: number;
      nextPartNumber: number;
      [key: string]: unknown;
    };
    const running = {
      ...latest,
      status: "running",
      updatedAt: new Date().toISOString(),
    };
    directory.files.set(
      "manifest-000099.json",
      Object.assign(new MemoryFile(), {
        bytes: new TextEncoder().encode(JSON.stringify(running)),
      }),
    );
    const partNames = [...directory.files.keys()].filter((name) =>
      name.startsWith("timer-part-"),
    );
    const encodeFrame = vi.fn(async () => new Uint8Array([1]));
    const put = vi.fn(async () => undefined);
    const { context, messages } = createContext();

    await runPngExport(
      context,
      createPayload(directory, {
        attemptId: "attempt-finalize",
        resumeFrom: {
          nextFrameIndex: latest.nextFrameIndex,
          nextPartNumber: latest.nextPartNumber,
          parts: latest.parts,
        },
      }),
      true,
      { encodeFrame, persistCheckpoint: put },
    );

    expect(encodeFrame).not.toHaveBeenCalled();
    expect(messages.at(-1)?.kind).toBe("png-complete");
    expect(
      [...directory.files.keys()].filter((name) =>
        name.startsWith("timer-part-"),
      ),
    ).toEqual(partNames);
    const final = await readLatestPngManifest(
      directory as unknown as FileSystemDirectoryHandle,
    );
    expect(final?.manifest.status).toBe("complete");
  });
});

describe("PNG write backpressure and failures", () => {
  it("stops encoding while a real part write is blocked, then completes", async () => {
    const directory = new MemoryDirectory("time-overlay-job-recovery-test");
    const gate = Promise.withResolvers<void>();
    const writeStarted = Promise.withResolvers<void>();
    let writes = 0;
    let queuedBytes = 0;
    directory.partFaults = {
      gate: gate.promise,
      onWrite: (bytes) => {
        writes += 1;
        queuedBytes += bytes;
        writeStarted.resolve();
      },
    };
    const encoded: number[] = [];
    const { context, messages } = createContext();
    const run = runPngExport(context, createPayload(directory), false, {
      encodeFrame: async (frameIndex) => {
        encoded.push(frameIndex);
        return new Uint8Array([frameIndex & 0xff, 1, 2, 3]);
      },
      persistCheckpoint: async () => undefined,
    });

    await writeStarted.promise;
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(encoded).toEqual([0]);
    expect(writes).toBe(1);
    expect(queuedBytes).toBeLessThan(256);
    expect(
      messages.filter((message) => message.kind === "png-part-committed"),
    ).toHaveLength(0);

    gate.resolve();
    await run;
    expect(messages.at(-1)?.kind).toBe("png-complete");
    expect(encoded).toHaveLength(90);
    const complete = messages.find((message) => message.kind === "png-complete");
    expect(complete?.kind === "png-complete" && complete.payload.parts[0]).toMatchObject({
      firstFrameIndex: 0,
      nextFrameIndex: 90,
    });
  });

  it.each(["write", "close", "shortWrite"] as const)(
    "does not commit frames or a part when the part write fails at %s",
    async (failure) => {
      const directory = new MemoryDirectory("time-overlay-job-recovery-test");
      directory.partFaults = { failure };
      const checkpoints: PngCheckpoint[] = [];
      const { context, messages } = createContext();
      await runPngExport(context, createPayload(directory), false, {
        encodeFrame: async (frameIndex) => new Uint8Array([frameIndex & 0xff]),
        persistCheckpoint: async (checkpoint) => {
          checkpoints.push(checkpoint);
        },
      });

      expect(
        messages.find((message) => message.kind === "png-error")?.payload,
      ).toMatchObject({ committedParts: [] });
      expect(
        messages.filter((message) => message.kind === "png-part-committed"),
      ).toHaveLength(0);
      const manifest = await readLatestPngManifest(
        directory as unknown as FileSystemDirectoryHandle,
      );
      expect(manifest?.manifest.parts).toEqual([]);
      expect(manifest?.manifest.nextFrameIndex).toBe(0);
      expect(checkpoints.at(-1)?.parts).toEqual([]);
      expect(checkpoints.at(-1)?.nextFrameIndex).toBe(0);
    },
  );
});
