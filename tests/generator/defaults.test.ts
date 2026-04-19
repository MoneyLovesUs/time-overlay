import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";

describe("createGeneratorSettings", () => {
  it("uses center anchor defaults for the initial generator state", () => {
    const settings = createGeneratorSettings();

    expect(settings.placement.anchor).toBe("center");
    expect(settings.placement.offsetX).toBe(0);
    expect(settings.placement.offsetY).toBe(0);
  });
});
