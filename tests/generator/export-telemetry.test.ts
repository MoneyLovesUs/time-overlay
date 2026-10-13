import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import { buildExportFunnelTelemetry } from "@/lib/generator/export/telemetry";

describe("buildExportFunnelTelemetry", () => {
  it("reports the full job dimensions carried by export_unsupported", () => {
    const settings = createGeneratorSettings({
      timer: { durationSeconds: 45 },
      export: { format: "webm", fps: 24, quality: "high" },
    });

    const payload = buildExportFunnelTelemetry({
      settings,
      environment: { browser: "safari", deviceType: "mobile" },
      template: { templateId: "clean-corner" },
    });

    expect(payload).toMatchObject({
      format: "webm",
      fps: 24,
      durationSeconds: 45,
      resolution: "landscape-720",
      width: 1280,
      height: 720,
      pixelFrames: 1280 * 720 * 45 * 24,
      quality: "high",
      audioVariant: "none",
      templateId: "clean-corner",
      browser: "safari",
      deviceType: "mobile",
    });
  });

  it("keeps export_started and export_unsupported parameters identical", () => {
    const settings = createGeneratorSettings({
      audio: { variant: "tick" },
      export: { format: "png-sequence", fps: 30, quality: "standard" },
    });
    const environment = { os: "android", supportsMp4: true };
    const template = { templateTier: "free" };

    const payload = buildExportFunnelTelemetry({
      settings,
      environment,
      template,
    });

    expect(Object.keys(payload).sort()).toEqual(
      [
        "format",
        "fps",
        "durationSeconds",
        "resolution",
        "width",
        "height",
        "pixelFrames",
        "quality",
        "audioVariant",
        "templateTier",
        "os",
        "supportsMp4",
      ].sort(),
    );
  });
});
