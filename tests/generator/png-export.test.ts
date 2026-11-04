import { unzipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { PngExportError } from "@/lib/generator/export/png-error";
import {
  getPngFrameFileName,
  getPngFrameNameWidth,
  getPngFramePattern,
  getPngPartFileName,
  getPngTotalFrames,
} from "@/lib/generator/export/png-naming";
import {
  createPngMemoryBudget,
  createMemoryPartSink,
  createOpfsPartSink,
  type PngPartSink,
} from "@/lib/generator/export/png-sinks";
import {
  PngZipPartWriter,
  getHelperBytesSplit,
  getPngPartProjectedBytes,
  getZipArchiveBytes,
  getZipCentralEntryBytes,
  getZipEntryBytes,
  getZipLocalEntryBytes,
  verifyPngPartFile,
} from "@/lib/generator/export/png-zip";
import {
  estimatePngArchiveBytes,
  getPngPlatformAdvice,
  isPngLongExport,
  PNG_MEMORY_BUDGET_BYTES,
  PNG_PART_MAX_BYTES,
  PNG_PART_MAX_PNG_COUNT,
} from "@/lib/generator/export/png-limits";
import {
  buildPngExportInstructions,
  buildPngPartNote,
  getPngPartNoteReservedBytes,
} from "@/lib/generator/export/png-helpers";
import {
  validatePngManifest,
  PNG_MANIFEST_SCHEMA,
  PNG_MANIFEST_VERSION,
} from "@/lib/generator/export/png-manifest";
import { createGeneratorSettings } from "@/lib/generator/defaults";

function fakeSink(initialBytes = 0): PngPartSink & {
  forceBytes: (bytes: number) => void;
} {
  let bytes = initialBytes;
  return {
    get bytesWritten() {
      return bytes;
    },
    async write(chunk) {
      bytes += chunk.byteLength;
    },
    async close() {
      return { size: bytes };
    },
    async discard() {},
    forceBytes(next: number) {
      bytes = next;
    },
  };
}

function helper() {
  return [
    {
      name: "EXPORT-INSTRUCTIONS.txt",
      bytes: new TextEncoder().encode("readme"),
    },
  ];
}

describe("PNG frame naming", () => {
  it("keeps the global one-based width stable at every accepted scale", () => {
    expect(getPngFrameNameWidth(1)).toBe(4);
    expect(getPngFrameNameWidth(9_999)).toBe(4);
    expect(getPngFrameNameWidth(10_000)).toBe(5);
    expect(getPngFrameNameWidth(45_000)).toBe(5);
    expect(getPngFrameNameWidth(108_000)).toBe(6);
    expect(getPngFrameNameWidth(216_000)).toBe(6);
    expect(getPngFrameFileName(0, 6)).toBe("frame-000001.png");
    expect(getPngFrameFileName(107_999, 6)).toBe("frame-108000.png");
    expect(getPngFrameFileName(215_999, 6)).toBe("frame-216000.png");
    expect(getPngFramePattern(6)).toBe("frame-%06d.png");
  });

  it("derives total frames with the existing round(duration * fps) rule", () => {
    expect(getPngTotalFrames(3600, 30)).toBe(108_000);
    expect(getPngTotalFrames(3600, 60)).toBe(216_000);
    expect(getPngTotalFrames(0, 30)).toBe(1);
    expect(getPngPartFileName(1)).toBe("timer-part-001.zip");
    expect(getPngPartFileName(22)).toBe("timer-part-022.zip");
  });
});

describe("exact ZIP part accounting", () => {
  it("counts local header, descriptor, central header, name, and EOCD", () => {
    const name = "frame-0001.png";
    const nameBytes = new TextEncoder().encode(name).byteLength;
    expect(getZipEntryBytes(name, 100)).toBe(
      30 + nameBytes + 100 + 16 + 46 + nameBytes,
    );
    const archive = getZipArchiveBytes([{ name, dataLength: 100 }]);
    expect(archive).toBe(getZipEntryBytes(name, 100) + 22);
  });

  it("rotates at the exact byte boundary, including pending central directories", async () => {
    const helpers = helper();
    const helperSplit = getHelperBytesSplit(helpers);
    const firstLocal = getZipLocalEntryBytes("frame-0001.png", 1);
    const firstCentral = getZipCentralEntryBytes("frame-0001.png");
    const secondLocal = getZipLocalEntryBytes("frame-0002.png", 10);
    const secondCentral = getZipCentralEntryBytes("frame-0002.png");
    const maxSink = PNG_PART_MAX_BYTES
      - firstCentral
      - secondLocal
      - secondCentral
      - helperSplit.localBytes
      - helperSplit.centralBytes
      - 22;

    const sink = fakeSink();
    const writer = new PngZipPartWriter({
      partNumber: 1,
      fileName: getPngPartFileName(1),
      sink,
      helperFiles: helpers,
    });
    await writer.addFrame(0, "frame-0001.png", new Uint8Array([1]));
    expect(sink.bytesWritten).toBe(firstLocal);

    sink.forceBytes(maxSink);
    expect(writer.canAddFrame("frame-0002.png", 10)).toBe(true);

    sink.forceBytes(maxSink + 1);
    expect(writer.canAddFrame("frame-0002.png", 10)).toBe(false);
    expect(
      getPngPartProjectedBytes({
        sinkBytes: maxSink + 1,
        centralDirectoryBytes: firstCentral,
        frameName: "frame-0002.png",
        dataLength: 10,
        helperLocalBytes: helperSplit.localBytes,
        helperCentralBytes: helperSplit.centralBytes,
      }),
    ).toBe(PNG_PART_MAX_BYTES + 1);

    const tinySink = fakeSink(PNG_PART_MAX_BYTES);
    const tinyWriter = new PngZipPartWriter({
      partNumber: 1,
      fileName: getPngPartFileName(1),
      sink: tinySink,
      helperFiles: [],
    });
    expect(() => tinyWriter.canAddFrame("frame-0001.png", 1)).toThrow(
      PngExportError,
    );
  });

  it("waits for the sink before accepting the next frame", async () => {
    const gate = Promise.withResolvers<void>();
    const started = Promise.withResolvers<void>();
    let bytes = 0;
    let concurrent = 0;
    let maxConcurrent = 0;
    const sink: PngPartSink = {
      get bytesWritten() {
        return bytes;
      },
      async write(chunk) {
        concurrent += 1;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        started.resolve();
        await gate.promise;
        concurrent -= 1;
        bytes += chunk.byteLength;
      },
      async close() {
        return { size: bytes };
      },
      async discard() {},
    };
    const writer = new PngZipPartWriter({
      partNumber: 1,
      fileName: getPngPartFileName(1),
      sink,
      helperFiles: [],
    });
    const pending = writer.addFrame(0, "frame-0001.png", new Uint8Array([1]));
    await started.promise;
    expect(maxConcurrent).toBe(1);
    gate.resolve();
    await pending;
    expect(maxConcurrent).toBe(1);
    expect(bytes).toBeGreaterThan(0);
  });

  it("refuses to commit a closed archive that crossed the byte cap", async () => {
    const sink = fakeSink();
    const writer = new PngZipPartWriter({
      partNumber: 1,
      fileName: getPngPartFileName(1),
      sink,
      helperFiles: [],
    });
    await writer.addFrame(0, "frame-0001.png", new Uint8Array([1]));
    sink.forceBytes(PNG_PART_MAX_BYTES);
    await expect(writer.finish(4)).rejects.toMatchObject({
      code: "pngFrameTooLarge",
    });
  });

  it("stops at 10,000 PNGs even when bytes still fit", async () => {
    const sink = fakeSink();
    const writer = new PngZipPartWriter({
      partNumber: 1,
      fileName: getPngPartFileName(1),
      sink,
      helperFiles: [],
    });
    for (let index = 0; index < PNG_PART_MAX_PNG_COUNT; index += 1) {
      const name = getPngFrameFileName(index, 5);
      expect(writer.canAddFrame(name, 1)).toBe(true);
      await writer.addFrame(index, name, new Uint8Array([index & 0xff]));
    }
    expect(writer.canAddFrame("frame-10001.png", 1)).toBe(false);
  });
});

describe("bounded memory sink", () => {
  it("caps all archive chunks in the job and restores the budget on discard", async () => {
    const budget = createPngMemoryBudget(10);
    const sink = createMemoryPartSink(budget);
    await sink.write(new Uint8Array(6));
    await expect(sink.write(new Uint8Array(5))).rejects.toMatchObject({
      code: "pngMemoryLimitExceeded",
    });
    expect(budget.usedBytes).toBe(6);
    await sink.discard();
    expect(budget.usedBytes).toBe(0);
  });
});

describe("PNG ZIP writer", () => {
  it("produces real archive bytes with continuous global names", async () => {
    const budget = createPngMemoryBudget();
    const writer = new PngZipPartWriter({
      partNumber: 2,
      fileName: getPngPartFileName(2),
      sink: createMemoryPartSink(budget),
      helperFiles: helper(),
    });
    await writer.addFrame(4, "frame-00005.png", new Uint8Array([1, 2, 3]));
    await writer.addFrame(5, "frame-00006.png", new Uint8Array([4, 5]));
    const result = await writer.finish(5);

    expect(result.blob).toBeDefined();
    const archive = new Uint8Array(await result.blob!.arrayBuffer());
    expect(archive.byteLength).toBe(result.descriptor.bytes);
    expect(result.descriptor.entryCount).toBe(3);
    expect(result.descriptor.firstFrameIndex).toBe(4);
    expect(result.descriptor.nextFrameIndex).toBe(6);
    expect(result.descriptor.directoryDigest).toMatch(/^[0-9a-f]{64}$/);

    const entries = unzipSync(archive);
    expect([...entries["frame-00005.png"]]).toEqual([1, 2, 3]);
    expect([...entries["frame-00006.png"]]).toEqual([4, 5]);
    expect(new TextDecoder().decode(entries["EXPORT-INSTRUCTIONS.txt"])).toBe(
      "readme",
    );

    const file = new File([result.blob!], result.descriptor.fileName);
    await expect(
      verifyPngPartFile(file, result.descriptor),
    ).resolves.toBeUndefined();

    await expect(
      verifyPngPartFile(file, {
        ...result.descriptor,
        directoryDigest: "0".repeat(64),
      }),
    ).rejects.toMatchObject({ code: "pngResumeFileMissing" });
  });
});

describe("OPFS failed finalization", () => {
  it.each([false, true])("removes the failed part after a flush failure (close also fails: %s)", async (failFirstClose) => {
    let locked = true;
    let exists = true;
    let closeFails = failFirstClose;
    // A failed close retains the exclusive lock, as an OPFS handle would.
    const directory = {
      async getFileHandle() {
        return {
          async createSyncAccessHandle() {
            return {
              write(chunk: Uint8Array) { return chunk.byteLength; },
              flush() { throw new DOMException("Quota exhausted", "QuotaExceededError"); },
              close() {
                if (closeFails) {
                  closeFails = false;
                  throw new DOMException("Close failed", "UnknownError");
                }
                locked = false;
              },
            };
          },
          async getFile() { throw new Error("Failed output must not be published"); },
        };
      },
      async removeEntry() {
        if (locked) throw new DOMException("Locked", "NoModificationAllowedError");
        exists = false;
      },
    } as unknown as FileSystemDirectoryHandle;
    const sink = await createOpfsPartSink(directory, "failed.zip");
    await sink.write(new Uint8Array([1, 2, 3]));
    await expect(sink.close()).rejects.toMatchObject({ code: "pngStorageFull" });
    await sink.discard();
    expect(exists).toBe(false);
    expect(locked).toBe(false);
  });
});

describe("OPFS short writes", () => {
  it("rejects a short access-handle write instead of publishing a truncated part", async () => {
    const directory = {
      async getFileHandle() {
        return {
          async createSyncAccessHandle() {
            return {
              write(data: Uint8Array) {
                return data.byteLength - 1;
              },
              flush() {},
              close() {},
            };
          },
          async getFile() {
            return new File([new Uint8Array(0)], "short.zip");
          },
        };
      },
      async removeEntry() {},
    } as unknown as FileSystemDirectoryHandle;
    const sink = await createOpfsPartSink(directory, "short.zip");
    await expect(sink.write(new Uint8Array([1, 2, 3]))).rejects.toMatchObject({
      code: "pngStorageFull",
    });
    await sink.discard();
  });
});

describe("PNG limits and platform advice", () => {
  it("treats duration, frame count, and sampled bytes as long-export triggers", () => {
    expect(
      isPngLongExport({
        durationSeconds: 600,
        totalFrames: 10_000,
        estimatedArchiveBytes: PNG_PART_MAX_BYTES,
      }),
    ).toBe(false);
    expect(
      isPngLongExport({
        durationSeconds: 601,
        totalFrames: 10_000,
        estimatedArchiveBytes: 1,
      }),
    ).toBe(true);
    expect(
      isPngLongExport({
        durationSeconds: 300,
        totalFrames: 10_001,
        estimatedArchiveBytes: 1,
      }),
    ).toBe(true);
    expect(
      isPngLongExport({
        durationSeconds: 300,
        totalFrames: 9_000,
        estimatedArchiveBytes: PNG_PART_MAX_BYTES + 1,
      }),
    ).toBe(true);
  });

  it("advises once by threshold without pretending it is a capability failure", () => {
    const base = {
      durationSeconds: 300,
      fps: 30,
      totalFrames: 9_000,
      width: 1280,
      height: 720,
      estimatedArchiveBytes: null,
    };
    expect(
      getPngPlatformAdvice({
        shape: base,
        deviceType: "mobile",
        browser: "chrome",
      }),
    ).toBe("mobile");
    expect(
      getPngPlatformAdvice({
        shape: { ...base, durationSeconds: 30, totalFrames: 900 },
        deviceType: "desktop",
        browser: "safari",
      }),
    ).toBeNull();
    expect(
      getPngPlatformAdvice({
        shape: { ...base, durationSeconds: 601 },
        deviceType: "desktop",
        browser: "safari",
      }),
    ).toBe("desktopSafari");
    expect(
      getPngPlatformAdvice({
        shape: { ...base, durationSeconds: 300 },
        deviceType: "desktop",
        browser: "chrome",
      }),
    ).toBeNull();
    expect(PNG_MEMORY_BUDGET_BYTES).toBe(128 * 1024 * 1024);
  });
});

describe("merged framing templates", () => {
  it("keeps every part on the global numbering and reserves the note size", () => {
    const note = buildPngPartNote({
      jobId: "job-1234abcd",
      partNumber: 2,
      firstFrameIndex: 10_000,
      nextFrameIndex: 20_000,
      fps: 30,
      totalFrames: 108_000,
      frameNameWidth: 6,
    });
    expect(note.name).toBe("PART-002-README.txt");
    expect(note.content).toContain("frame-010001.png");
    expect(note.content).toContain("frame-020000.png");
    const reserved = getPngPartNoteReservedBytes({
      jobId: "job-1234abcd",
      partNumber: 2,
      fps: 30,
      totalFrames: 108_000,
      frameNameWidth: 6,
    });
    expect(new TextEncoder().encode(note.content).byteLength).toBe(reserved);
  });

  it("ships only the instruction file as a helper", () => {
    const instructions = buildPngExportInstructions({
      jobId: "job-1234abcd",
      fps: 30,
      totalFrames: 108_000,
      frameNameWidth: 6,
    });
    expect(instructions).toContain("frame-108000.png");
    expect(instructions).toContain("frame-%06d.png");
    expect(instructions).toContain("timer-part-001.zip");
    // The ProRes bundle was removed from exports: no script is offered there.
    expect(instructions).not.toContain("convert-to-prores");
  });
});

describe("manifest validation", () => {
  const manifest = () => ({
    schema: PNG_MANIFEST_SCHEMA,
    version: PNG_MANIFEST_VERSION,
    jobId: "job-1234abcd",
    rendererVersion: "time-overlay-png-1",
    settingsHash: "a".repeat(64),
    settings: createGeneratorSettings({ timer: { durationSeconds: 300 } }),
    totalFrames: 9_000,
    fps: 30,
    frameNameWidth: 4,
    outputMode: "opfs" as const,
    parts: [],
    nextFrameIndex: 0,
    nextPartNumber: 1,
    status: "interrupted" as const,
    updatedAt: "2026-11-04T00:00:00.000Z",
  });

  it("accepts a coherent checkpoint and rejects traversal or mismatched parts", () => {
    expect(validatePngManifest(manifest()).jobId).toBe("job-1234abcd");

    expect(() =>
      validatePngManifest({
        ...manifest(),
        parts: [
          {
            partNumber: 1,
            fileName: "../timer-part-001.zip",
            firstFrameIndex: 0,
            nextFrameIndex: 10,
            bytes: 1_000,
            entryCount: 10,
            directoryDigest: "b".repeat(64),
            directoryOffset: 900,
            directorySize: 78,
            frameNameWidth: 4,
          },
        ],
        nextFrameIndex: 10,
        nextPartNumber: 2,
      }),
    ).toThrow(PngExportError);

    expect(() =>
      validatePngManifest({
        ...manifest(),
        totalFrames: 216_001,
      }),
    ).toThrow(PngExportError);
  });
});

describe("preflight estimate", () => {
  it("keeps unknown estimates unknown rather than inventing bytes", () => {
    const estimate = estimatePngArchiveBytes(1_000, 9_000, 4_096);
    expect(estimate).toBeGreaterThan(9_000_000);
  });
});
