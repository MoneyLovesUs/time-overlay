import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";
import type { GeneratorSettings } from "@/lib/generator/types";

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

describe("mobile mp4 export limits", () => {
  const support = {
    ...getInitialLocalExportSupport(),
    hasWorkerSupport: true,
    supportsMp4: true,
  };

  // createGeneratorSettings clamps duration to 300s, so boundary tests above
  // the limit build their settings directly.
  const withOverrides = ({
    durationSeconds,
    format,
    resolutionPresetId,
  }: {
    durationSeconds: number;
    format: GeneratorSettings["export"]["format"];
    resolutionPresetId: GeneratorSettings["canvas"]["resolutionPresetId"];
  }): GeneratorSettings => {
    const base = createGeneratorSettings();
    return {
      ...base,
      timer: { ...base.timer, durationSeconds },
      canvas: { ...base.canvas, resolutionPresetId },
      export: { ...base.export, format },
    };
  };

  it("allows mobile mp4 at 300s and 1080p without an error advisory", () => {
    const advisory = getExportAdvisory(
      withOverrides({
        durationSeconds: 300,
        format: "mp4",
        resolutionPresetId: "landscape-1080",
      }),
      support,
      "mobile",
    );

    expect(advisory.severity).not.toBe("error");
    expect(advisory.code).toBeNull();
  });

  it("lets a phone without OPFS go past 300s while the file fits in memory", () => {
    const advisory = getExportAdvisory(
      withOverrides({
        durationSeconds: 900,
        format: "mp4",
        resolutionPresetId: "landscape-1080",
      }),
      support,
      "mobile",
    );

    expect(advisory.severity).not.toBe("error");
  });

  it("blocks a phone without OPFS once the scaled file exceeds the memory budget", () => {
    const advisory = getExportAdvisory(
      withOverrides({
        durationSeconds: 1300,
        format: "mp4",
        resolutionPresetId: "landscape-1080",
      }),
      support,
      "mobile",
    );

    expect(advisory).toMatchObject({
      code: "mobileExportLimitError",
      severity: "error",
    });
  });

  it("allows a 60-minute 30fps mobile mp4 when OPFS streaming is available", () => {
    const advisory = getExportAdvisory(
      withOverrides({
        durationSeconds: 3600,
        format: "mp4",
        resolutionPresetId: "landscape-1080",
      }),
      { ...support, supportsStreamingMp4: true },
      "mobile",
    );

    expect(advisory.severity).not.toBe("error");
  });

  it("still caps streamed mobile mp4 at 3600s and at 108k frames", () => {
    const streaming = { ...support, supportsStreamingMp4: true };
    const tooLong = withOverrides({
      durationSeconds: 3601,
      format: "mp4",
      resolutionPresetId: "landscape-1080",
    });
    const tooManyFrames = withOverrides({
      durationSeconds: 3600,
      format: "mp4",
      resolutionPresetId: "landscape-1080",
    });
    tooManyFrames.export = { ...tooManyFrames.export, fps: 60 };

    expect(getExportAdvisory(tooLong, streaming, "mobile").code).toBe(
      "mobileExportLimitError",
    );
    expect(getExportAdvisory(tooManyFrames, streaming, "mobile").code).toBe(
      "mobileExportLimitError",
    );
  });

  it("keeps the existing mobile png-sequence limit: 61s is still blocked", () => {
    const advisory = getExportAdvisory(
      withOverrides({
        durationSeconds: 61,
        format: "png-sequence",
        resolutionPresetId: "landscape-720",
      }),
      support,
      "mobile",
    );

    expect(advisory).toMatchObject({
      code: "mobileExportLimitError",
      severity: "error",
    });
  });
});
