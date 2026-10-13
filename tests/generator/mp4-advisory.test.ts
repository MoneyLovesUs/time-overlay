import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";

describe("mp4 capability gating", () => {
  it("lists mp4 in disabledFormats when supportsMp4 is false", () => {
    const advisory = getExportAdvisory(
      createGeneratorSettings({ export: { format: "mp4" } }),
      {
        ...getInitialLocalExportSupport(),
        hasWorkerSupport: true,
        supportsMp4: false,
      },
    );

    expect(advisory.disabledFormats).toContain("mp4");
  });

  it("does not disable mp4 while the capability probe is still pending", () => {
    const advisory = getExportAdvisory(
      createGeneratorSettings({ export: { format: "mp4" } }),
      getInitialLocalExportSupport(),
    );

    expect(advisory.disabledFormats).not.toContain("mp4");
  });
});
