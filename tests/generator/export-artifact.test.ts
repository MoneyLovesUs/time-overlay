import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ArtifactValidationError,
  validateExportArtifact,
} from "@/lib/generator/export/artifact";
import { downloadBlob } from "@/lib/generator/export/png-sequence";

function blobFromBytes(bytes: number[], type = "application/octet-stream") {
  return new Blob([new Uint8Array(bytes)], { type });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("validateExportArtifact", () => {
  it.each([
    {
      label: "ZIP local file",
      blob: blobFromBytes([0x50, 0x4b, 0x03, 0x04, 0x00]),
      mimeType: "application/zip",
      fileName: "frames.zip",
    },
    {
      label: "empty ZIP archive",
      blob: blobFromBytes([0x50, 0x4b, 0x05, 0x06, 0x00]),
      mimeType: "application/zip",
      fileName: "frames.zip",
    },
    {
      label: "WebM",
      blob: blobFromBytes([0x1a, 0x45, 0xdf, 0xa3, 0x00]),
      mimeType: "video/webm;codecs=vp8,opus",
      fileName: "timer.webm",
    },
    {
      label: "MOV",
      blob: blobFromBytes([
        0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20,
        0x20,
      ]),
      mimeType: "video/quicktime",
      fileName: "timer.mov",
    },
    {
      label: "unknown non-empty file",
      blob: blobFromBytes([0x01]),
      mimeType: "application/octet-stream",
      fileName: "timer.bin",
    },
  ])("accepts a valid $label artifact", async ({ blob, mimeType, fileName }) => {
    await expect(
      validateExportArtifact(blob, mimeType, fileName),
    ).resolves.toBeUndefined();
  });

  it.each([
    ["ZIP", "application/zip", "frames.zip"],
    ["WebM", "video/webm", "timer.webm"],
    ["MOV", "video/quicktime", "timer.mov"],
  ])("rejects an invalid %s signature", async (_label, mimeType, fileName) => {
    const promise = validateExportArtifact(
      blobFromBytes([0xde, 0xad, 0xbe, 0xef, 0x00, 0x00, 0x00, 0x00]),
      mimeType,
      fileName,
    );

    await expect(promise).rejects.toMatchObject({
      name: "ArtifactValidationError",
      code: "outputValidationFailed",
    });
  });

  it("rejects an empty blob with the structured validation error", async () => {
    const promise = validateExportArtifact(
      new Blob([], { type: "application/zip" }),
      "application/zip",
      "frames.zip",
    );

    await expect(promise).rejects.toBeInstanceOf(ArtifactValidationError);
    await expect(promise).rejects.toMatchObject({
      code: "outputValidationFailed",
    });
  });

  it("uses the file extension when the MIME type is generic", async () => {
    await expect(
      validateExportArtifact(
        blobFromBytes([0xde, 0xad, 0xbe, 0xef]),
        "application/octet-stream",
        "frames.zip",
      ),
    ).rejects.toMatchObject({ code: "outputValidationFailed" });
  });
});

describe("downloadBlob", () => {
  it("clicks an attached hidden anchor, removes it, and delays URL revocation", () => {
    vi.useFakeTimers();

    const click = vi.fn();
    const remove = vi.fn();
    const anchor = {
      click,
      download: "",
      hidden: false,
      href: "",
      remove,
    };
    const append = vi.fn((node: typeof anchor) => {
      expect(node).toBe(anchor);
      expect(node.hidden).toBe(true);
    });
    const createObjectURL = vi.fn(() => "blob:time-overlay-export");
    const revokeObjectURL = vi.fn();

    vi.stubGlobal("document", {
      body: { append },
      createElement: vi.fn(() => anchor),
    });
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    vi.stubGlobal("window", { setTimeout });

    const blob = blobFromBytes([0x01]);
    downloadBlob(blob, "timer.webm");

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(anchor.href).toBe("blob:time-overlay-export");
    expect(anchor.download).toBe("timer.webm");
    expect(append).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
    expect(append.mock.invocationCallOrder[0]!).toBeLessThan(
      click.mock.invocationCallOrder[0]!,
    );
    expect(click.mock.invocationCallOrder[0]!).toBeLessThan(
      remove.mock.invocationCallOrder[0]!,
    );
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(59_999);
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(revokeObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:time-overlay-export");
  });
});
