import { describe, expect, it } from "vitest";

import {
  GENERATOR_SUPPORTED_FORMATS,
  applyGeneratorTemplate,
  createGeneratorSettings,
} from "@/lib/generator/defaults";
import {
  GENERATOR_QUICK_TEMPLATE_IDS,
  GENERATOR_TEMPLATES,
} from "@/lib/generator/templates";

describe("generator templates", () => {
  it("ships the complete 48-template catalog with unique ids", () => {
    const ids = GENERATOR_TEMPLATES.map((template) => template.id);

    expect(GENERATOR_TEMPLATES).toHaveLength(48);
    expect(new Set(ids).size).toBe(48);
  });

  it("keeps the planned free, growth, and signature tier split", () => {
    const countByTier = Object.fromEntries(
      ["free", "growth", "signature"].map((tier) => [
        tier,
        GENERATOR_TEMPLATES.filter((template) => template.tier === tier).length,
      ]),
    );

    expect(countByTier).toEqual({
      free: 18,
      growth: 18,
      signature: 12,
    });
  });

  it("only recommends export formats supported by the generator", () => {
    for (const template of GENERATOR_TEMPLATES) {
      expect(GENERATOR_SUPPORTED_FORMATS).toContain(template.recommendedFormat);
    }
  });

  it("keeps every quick-pick id connected to a real template", () => {
    const catalogIds = new Set(
      GENERATOR_TEMPLATES.map((template) => template.id),
    );

    expect(new Set(GENERATOR_QUICK_TEMPLATE_IDS).size).toBe(
      GENERATOR_QUICK_TEMPLATE_IDS.length,
    );
    for (const id of GENERATOR_QUICK_TEMPLATE_IDS) {
      expect(catalogIds.has(id)).toBe(true);
    }
  });

  it("applies a portrait template without resetting user export choices", () => {
    const current = createGeneratorSettings({
      timer: {
        durationSeconds: 125,
        displayFormat: "hh:mm:ss",
      },
      canvas: {
        showSafeArea: false,
      },
      textStyle: {
        customFontFamily: "Customer Brand",
      },
      export: {
        format: "webm",
        fps: 24,
        quality: "high",
      },
      audio: {
        variant: "beep",
      },
    });

    const next = applyGeneratorTemplate(current, "capcut-portrait");

    expect(next.templateId).toBe("capcut-portrait");
    expect(next.canvas.resolutionPresetId).toBe("portrait-1080");
    expect(next.timer.durationSeconds).toBe(125);
    expect(next.export).toEqual(current.export);
    expect(next.canvas.showSafeArea).toBe(false);
    expect(next.textStyle.customFontFamily).toBe("Customer Brand");
    expect(next.audio).toEqual(current.audio);
  });

  it("applies every catalog template with valid canvas and preserved workflow choices", () => {
    const current = createGeneratorSettings({
      timer: {
        durationSeconds: 77,
      },
      canvas: {
        showSafeArea: false,
      },
      export: {
        format: "webm",
        fps: 24,
        quality: "high",
      },
    });

    for (const template of GENERATOR_TEMPLATES) {
      const next = applyGeneratorTemplate(current, template.id);

      expect(next.templateId, template.id).toBe(template.id);
      expect(next.themePresetId, template.id).toBe(template.themePresetId);
      expect(next.timer.durationSeconds, template.id).toBe(77);
      expect(next.export, template.id).toEqual(current.export);
      expect(next.canvas.showSafeArea, template.id).toBe(false);
      expect(next.canvas.width, template.id).toBeGreaterThan(0);
      expect(next.canvas.height, template.id).toBeGreaterThan(0);

      if (template.orientation === "portrait") {
        expect(next.canvas.height, template.id).toBeGreaterThan(next.canvas.width);
      }
      if (template.orientation === "landscape") {
        expect(next.canvas.width, template.id).toBeGreaterThan(next.canvas.height);
      }
      if (template.orientation === "square") {
        expect(next.canvas.width, template.id).toBe(next.canvas.height);
      }
    }
  });

  it("only changes audio when the selected template explicitly provides a cue", () => {
    const current = createGeneratorSettings({
      audio: {
        variant: "beep",
      },
    });

    expect(
      applyGeneratorTemplate(current, "clean-corner").audio.variant,
    ).toBe("beep");
    expect(
      applyGeneratorTemplate(current, "audio-tick-sync").audio.variant,
    ).toBe("tick-and-beep");
  });
});
