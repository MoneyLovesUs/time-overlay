import { afterEach, describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import {
  detectCanvasCaptureStream,
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";

describe("getInitialLocalExportSupport", () => {
  it("returns a stable SSR-safe fallback snapshot", () => {
    expect(getInitialLocalExportSupport()).toEqual({
      hasWorkerSupport: null,
      supportsPngSequence: true,
      supportsWebm: null,
      supportsWebmAudio: null,
      supportsVp9Alpha: null,
      supportsHevcAlpha: null,
    });
  });
});

describe("detectCanvasCaptureStream", () => {
  const originalDocument = (globalThis as { document?: unknown }).document;

  afterEach(() => {
    if (originalDocument === undefined) {
      delete (globalThis as { document?: unknown }).document;
    } else {
      (globalThis as { document?: unknown }).document = originalDocument;
    }
  });

  it("returns false when there is no document (SSR/worker)", () => {
    delete (globalThis as { document?: unknown }).document;
    expect(detectCanvasCaptureStream()).toBe(false);
  });

  it("returns false when the canvas lacks captureStream", () => {
    (globalThis as { document?: unknown }).document = {
      createElement: () => ({}),
    };
    expect(detectCanvasCaptureStream()).toBe(false);
  });

  it("returns true when the canvas exposes captureStream", () => {
    (globalThis as { document?: unknown }).document = {
      createElement: () => ({ captureStream: () => ({}) }),
    };
    expect(detectCanvasCaptureStream()).toBe(true);
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

  it("allows a 60-second 720p export on phones", () => {
    const advisory = getExportAdvisory(
      createGeneratorSettings({ timer: { durationSeconds: 60 } }),
      getInitialLocalExportSupport(),
      "mobile",
    );

    expect(advisory).toMatchObject({
      code: "pngSequenceInfo",
      severity: "info",
    });
  });

  it("blocks mobile and tablet jobs above the duration, canvas, or pixel-frame limits", () => {
    const support = getInitialLocalExportSupport();

    expect(
      getExportAdvisory(
        createGeneratorSettings({ timer: { durationSeconds: 61 } }),
        support,
        "mobile",
      ),
    ).toMatchObject({ code: "mobileExportLimitError", severity: "error" });

    expect(
      getExportAdvisory(
        createGeneratorSettings({
          timer: { durationSeconds: 31 },
          canvas: { resolutionPresetId: "landscape-1080" },
        }),
        support,
        "tablet",
      ),
    ).toMatchObject({ code: "mobileExportLimitError", severity: "error" });

    expect(
      getExportAdvisory(
        createGeneratorSettings(
          {
            timer: { durationSeconds: 3 },
            canvas: { resolutionPresetId: "landscape-2160" },
          },
          // 4K is a Pro-only canvas now, so only a Pro session reaches here.
          { isPro: true },
        ),
        support,
        "mobile",
      ),
    ).toMatchObject({ code: "mobileExportLimitError", severity: "error" });
  });

  it("warns that long desktop WebM exports run in real time", () => {
    const advisory = getExportAdvisory(
      createGeneratorSettings({
        timer: { durationSeconds: 61 },
        export: { format: "webm" },
      }),
      {
        ...getInitialLocalExportSupport(),
        hasWorkerSupport: true,
        supportsWebm: true,
      },
    );

    expect(advisory).toMatchObject({
      code: "webmRealtimeWarning",
      severity: "warning",
    });
  });

  it("blocks WebM audio when the browser cannot declare VP8 plus Opus", () => {
    const advisory = getExportAdvisory(
      createGeneratorSettings({
        audio: { variant: "tick" },
        export: { format: "webm" },
      }),
      {
        ...getInitialLocalExportSupport(),
        hasWorkerSupport: true,
        supportsWebm: true,
        supportsWebmAudio: false,
      },
    );

    expect(advisory).toMatchObject({
      code: "webmAudioUnavailableError",
      severity: "error",
    });
  });

  it("keeps real-time WebM available when Worker is unavailable", () => {
    const advisory = getExportAdvisory(
      createGeneratorSettings({ export: { format: "webm" } }),
      {
        ...getInitialLocalExportSupport(),
        hasWorkerSupport: false,
        supportsPngSequence: false,
        supportsWebm: true,
      },
    );

    expect(advisory.severity).not.toBe("error");
    expect(advisory.disabledFormats).not.toContain("webm");
    expect(advisory.disabledFormats).toContain("png-sequence");
  });

  it("warns on desktop jobs at the high pixel-frame or canvas thresholds", () => {
    const support = getInitialLocalExportSupport();
    const pixelFrameHeavy = getExportAdvisory(
      createGeneratorSettings({
        timer: { durationSeconds: 65 },
        canvas: { resolutionPresetId: "landscape-1080" },
      }),
      support,
    );
    const canvasHeavy = getExportAdvisory(
      createGeneratorSettings(
        {
          timer: { durationSeconds: 3 },
          canvas: { resolutionPresetId: "landscape-2160" },
        },
        // A 4K canvas is Pro-only, so the heavy-export warning can only apply
        // to a Pro session now.
        { isPro: true },
      ),
      support,
    );

    expect(pixelFrameHeavy).toMatchObject({
      code: "heavyExportWarning",
      severity: "warning",
    });
    expect(canvasHeavy).toMatchObject({
      code: "heavyExportWarning",
      severity: "warning",
    });
  });
});
