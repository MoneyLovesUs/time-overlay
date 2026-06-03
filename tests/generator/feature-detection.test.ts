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
});
