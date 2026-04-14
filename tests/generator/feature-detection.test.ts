import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";

describe("getInitialLocalExportSupport", () => {
  it("returns a stable SSR-safe fallback snapshot", () => {
    expect(getInitialLocalExportSupport()).toEqual({
      hasWorkerSupport: null,
      supportsPngSequence: true,
      supportsWebm: null,
    });
  });
});

describe("getExportAdvisory", () => {
  it("does not surface a hard error before browser capability detection has run", () => {
    const advisory = getExportAdvisory(
      createGeneratorSettings(),
      getInitialLocalExportSupport(),
    );

    expect(advisory.severity).toBe("info");
    expect(advisory.code).toBe("pngSequenceInfo");
    expect(advisory.disabledFormats).toEqual([]);
  });
});
