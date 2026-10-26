import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import { createRenderFrameState } from "@/lib/generator/render-frame";

const settings = createGeneratorSettings({
  timer: { durationSeconds: 45, displayFormat: "mm:ss" },
});
const textBox = { width: 240, height: 96 };

describe("createRenderFrameState textOverride", () => {
  it("keeps the existing formatted output when no override is passed", () => {
    const withoutOverride = createRenderFrameState({
      settings,
      elapsedSeconds: 5,
      textBox,
      safeAreaInset: 32,
    });

    expect(withoutOverride.text).toBe("00:40");
  });

  it("draws the override text instead of the timer", () => {
    const withOverride = createRenderFrameState({
      settings,
      elapsedSeconds: 0,
      textBox,
      safeAreaInset: 32,
      textOverride: "LIVE NOW",
    });

    expect(withOverride.text).toBe("LIVE NOW");
  });
});
