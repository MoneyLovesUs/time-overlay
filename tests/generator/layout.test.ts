import { describe, expect, it } from "vitest";

import { getTimerBoxPosition } from "@/lib/generator/layout";

describe("getTimerBoxPosition", () => {
  const frame = {
    width: 1280,
    height: 720,
  };

  const textBox = {
    width: 240,
    height: 96,
  };

  it("places top-left anchors using positive safe-area padding", () => {
    expect(
      getTimerBoxPosition({
        frame,
        textBox,
        anchor: "top-left",
        offsetX: 0,
        offsetY: 0,
        safeAreaInset: 32,
      }),
    ).toEqual({ x: 32, y: 32 });
  });

  it("places centered anchors in the middle of the frame", () => {
    expect(
      getTimerBoxPosition({
        frame,
        textBox,
        anchor: "center",
        offsetX: 0,
        offsetY: 0,
        safeAreaInset: 32,
      }),
    ).toEqual({ x: 520, y: 312 });
  });

  it("applies offsets after anchor placement", () => {
    expect(
      getTimerBoxPosition({
        frame,
        textBox,
        anchor: "bottom-right",
        offsetX: -20,
        offsetY: -12,
        safeAreaInset: 32,
      }),
    ).toEqual({ x: 988, y: 580 });
  });
});
