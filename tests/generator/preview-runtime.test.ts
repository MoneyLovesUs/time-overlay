import { describe, expect, it } from "vitest";

import {
  advancePreviewPlayback,
  clampPreviewElapsedSeconds,
  syncCanvasElementSize,
} from "@/lib/generator/preview-runtime";

describe("clampPreviewElapsedSeconds", () => {
  it("keeps elapsed time within the configured duration", () => {
    expect(clampPreviewElapsedSeconds(8, 5)).toBe(5);
    expect(clampPreviewElapsedSeconds(-1, 5)).toBe(0);
    expect(clampPreviewElapsedSeconds(3, 5)).toBe(3);
  });
});

describe("advancePreviewPlayback", () => {
  it("advances elapsed time while playback is still within bounds", () => {
    expect(
      advancePreviewPlayback({
        timestamp: 6_000,
        previousElapsedSeconds: 1,
        durationSeconds: 10,
        startedAtTimestamp: 4_000,
      }),
    ).toEqual({
      completed: false,
      elapsedSeconds: 2,
      startedAtTimestamp: 4_000,
    });
  });

  it("marks playback complete once the duration is reached", () => {
    expect(
      advancePreviewPlayback({
        timestamp: 15_500,
        previousElapsedSeconds: 1,
        durationSeconds: 10,
        startedAtTimestamp: 4_000,
      }),
    ).toEqual({
      completed: true,
      elapsedSeconds: 10,
      startedAtTimestamp: null,
    });
  });
});

describe("syncCanvasElementSize", () => {
  it("only resizes the canvas when dimensions actually change", () => {
    const canvas = {
      width: 1280,
      height: 720,
    };

    expect(syncCanvasElementSize(canvas, 1280, 720)).toBe(false);
    expect(canvas).toEqual({ width: 1280, height: 720 });

    expect(syncCanvasElementSize(canvas, 1920, 1080)).toBe(true);
    expect(canvas).toEqual({ width: 1920, height: 1080 });
  });
});
