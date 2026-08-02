import { afterEach, describe, expect, it, vi } from "vitest";

import { getPreferredAlphaWebmMimeType } from "@/lib/generator/export/webm-mime";

const originalMediaRecorder = globalThis.MediaRecorder;

afterEach(() => {
  vi.restoreAllMocks();
  if (originalMediaRecorder === undefined) {
    delete (globalThis as { MediaRecorder?: unknown }).MediaRecorder;
  } else {
    globalThis.MediaRecorder = originalMediaRecorder;
  }
});

function installMediaRecorderSupport(supported: readonly string[]) {
  (globalThis as { MediaRecorder?: unknown }).MediaRecorder = {
    isTypeSupported: vi.fn((mimeType: string) => supported.includes(mimeType)),
  };
}

describe("getPreferredAlphaWebmMimeType", () => {
  it("uses VP8 for silent transparent WebM", () => {
    installMediaRecorderSupport(["video/webm;codecs=vp8"]);
    expect(getPreferredAlphaWebmMimeType(false)).toBe(
      "video/webm;codecs=vp8",
    );
  });

  it("requires the exact VP8 + Opus declaration when audio is present", () => {
    installMediaRecorderSupport([
      "video/webm;codecs=vp8",
      "video/webm;codecs=vp8,opus",
    ]);
    expect(getPreferredAlphaWebmMimeType(true)).toBe(
      "video/webm;codecs=vp8,opus",
    );
  });

  it("does not fall back to a video-only mime type for an audio stream", () => {
    installMediaRecorderSupport(["video/webm;codecs=vp8"]);
    expect(getPreferredAlphaWebmMimeType(true)).toBeNull();
  });
});
