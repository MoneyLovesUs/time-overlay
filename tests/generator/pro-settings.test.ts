import { describe, expect, it } from "vitest";

import {
  createGeneratorSettings,
  normalizeGeneratorSettings,
} from "@/lib/generator/defaults";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";
import {
  GENERATOR_TEMPLATES,
  isProTemplateId,
  PRO_SIGNATURE_TEMPLATE_IDS,
} from "@/lib/generator/templates";

const baseSettings = createGeneratorSettings();

function withDuration(durationSeconds: number) {
  return {
    ...baseSettings,
    timer: { ...baseSettings.timer, durationSeconds },
  };
}

function withFps(fps: number) {
  return {
    ...baseSettings,
    export: { ...baseSettings.export, fps },
  };
}

describe("pro-aware settings fallback", () => {
  it("clamps a free 301s duration back to 300s (spec 6.5 #1)", () => {
    const normalized = normalizeGeneratorSettings(withDuration(301));
    expect(normalized.timer.durationSeconds).toBe(300);
  });

  it("allows pro 3600s and clamps 3601s to 3600s (spec 6.5 #2)", () => {
    const at3600 = normalizeGeneratorSettings(withDuration(3600), {
      isPro: true,
    });
    expect(at3600.timer.durationSeconds).toBe(3600);

    const over = normalizeGeneratorSettings(withDuration(3601), {
      isPro: true,
    });
    expect(over.timer.durationSeconds).toBe(3600);
  });

  it("keeps free fallback results identical to the pre-Pro behavior", () => {
    // Free normalize ignores the pro-only fps entry entirely.
    expect(normalizeGeneratorSettings(withFps(60)).export.fps).toBe(30);
    // Explicit free options produce exactly the historical result.
    expect(normalizeGeneratorSettings(baseSettings)).toEqual(
      normalizeGeneratorSettings(baseSettings, { isPro: false }),
    );
  });

  it("keeps 60fps for pro users (spec 6.5 #5)", () => {
    const pro60 = normalizeGeneratorSettings(withFps(60), { isPro: true });
    expect(pro60.export.fps).toBe(60);

    const free60 = normalizeGeneratorSettings(withFps(60));
    expect(free60.export.fps).not.toBe(60);
  });

  it("flags pro png-sequence jobs over 600s with pngSequenceTooLongError (spec 6.5 #6)", () => {
    const settings = normalizeGeneratorSettings(
      {
        ...withDuration(601),
        export: { ...baseSettings.export, format: "png-sequence" as const },
      },
      { isPro: true },
    );
    const advisory = getExportAdvisory(
      settings,
      getInitialLocalExportSupport(),
      "desktop",
    );
    expect(advisory.code).toBe("pngSequenceTooLongError");
    expect(advisory.severity).toBe("error");
  });

  it("does not flag pro png-sequence jobs at exactly 600s", () => {
    const settings = normalizeGeneratorSettings(
      {
        ...withDuration(600),
        export: { ...baseSettings.export, format: "png-sequence" as const },
      },
      { isPro: true },
    );
    const advisory = getExportAdvisory(
      settings,
      getInitialLocalExportSupport(),
      "desktop",
    );
    expect(advisory.code).not.toBe("pngSequenceTooLongError");
  });
});

describe("pro template gating list", () => {
  it("gates exactly the 12 new signature templates", () => {
    expect(PRO_SIGNATURE_TEMPLATE_IDS).toHaveLength(12);
    for (const id of PRO_SIGNATURE_TEMPLATE_IDS) {
      expect(isProTemplateId(id)).toBe(true);
    }
  });

  it("keeps all 48 original templates exportable for free users", () => {
    const originalTemplates = GENERATOR_TEMPLATES.filter(
      (template) => !isProTemplateId(template.id),
    );
    expect(originalTemplates).toHaveLength(48);
  });

  it("keeps the pre-Pro signature-tier templates free", () => {
    expect(isProTemplateId("prores-master-look")).toBe(false);
    expect(isProTemplateId("countdown-ring")).toBe(false);
  });
});
