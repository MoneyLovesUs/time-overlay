import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import { createRenderFrameState } from "@/lib/generator/render-frame";

describe("createRenderFrameState", () => {
  it("formats the current frame text from the active timer settings", () => {
    const settings = createGeneratorSettings({
      timer: {
        durationSeconds: 45,
        displayFormat: "mm:ss",
      },
    });

    const frameState = createRenderFrameState({
      settings,
      elapsedSeconds: 0,
      textBox: { width: 240, height: 96 },
      safeAreaInset: 32,
    });

    expect(frameState.text).toBe("00:45");
  });

  it("omits background fill for transparent exports", () => {
    const settings = createGeneratorSettings({
      canvas: {
        backgroundMode: "transparent",
      },
    });

    const frameState = createRenderFrameState({
      settings,
      elapsedSeconds: 10,
      textBox: { width: 240, height: 96 },
      safeAreaInset: 32,
    });

    expect(frameState.backgroundFill).toBeNull();
  });

  it("includes background fill when the user chooses a solid background", () => {
    const settings = createGeneratorSettings({
      canvas: {
        backgroundMode: "solid",
        backgroundColor: "#101828",
      },
    });

    const frameState = createRenderFrameState({
      settings,
      elapsedSeconds: 10,
      textBox: { width: 240, height: 96 },
      safeAreaInset: 32,
    });

    expect(frameState.backgroundFill).toBe("#101828");
  });

  it("keeps preset visual tokens in the resolved frame state", () => {
    const settings = createGeneratorSettings({
      themePresetId: "broadcast-alert",
    });

    const frameState = createRenderFrameState({
      settings,
      elapsedSeconds: 0,
      textBox: { width: 240, height: 96 },
      safeAreaInset: 32,
    });

    expect(frameState.style.fontFamily).toBe("geist-sans");
    expect(frameState.style.strokeColor).toBe("#091018");
  });

  it("uses anchor layout calculations to resolve the text box position", () => {
    const settings = createGeneratorSettings({
      placement: {
        anchor: "bottom-right",
        offsetX: -20,
        offsetY: -12,
      },
    });

    const frameState = createRenderFrameState({
      settings,
      elapsedSeconds: 0,
      textBox: { width: 240, height: 96 },
      safeAreaInset: 32,
    });

    expect(frameState.position).toEqual({ x: 717, y: 471 });
  });

  it("scales default countdown text to better fill the anchored canvas region", () => {
    const settings = createGeneratorSettings();

    const frameState = createRenderFrameState({
      settings,
      elapsedSeconds: 0,
      textBox: { width: 240, height: 96 },
      safeAreaInset: 32,
    });

    expect(frameState.style.fontSize).toBeGreaterThan(settings.textStyle.fontSize);
    expect(frameState.position.x).toBeLessThan(900);
    expect(frameState.position.y).toBeLessThan(560);
  });
});
