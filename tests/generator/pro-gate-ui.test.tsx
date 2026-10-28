import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ControlPanel } from "@/components/generator/control-panel";
import { ExportPanel } from "@/components/generator/export-panel";
import en from "@/content/root/en";
import { getProGateCopy } from "@/content/pro-gate";
import {
  createGeneratorSettings,
  DEFAULT_EXPORT_PROGRESS_STATE,
  GENERATOR_CANVAS_PRESETS,
} from "@/lib/generator/defaults";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";

const noop = () => undefined;

function renderControlPanel(proBadgeLabel?: string) {
  return renderToStaticMarkup(
    React.createElement(ControlPanel, {
      settings: createGeneratorSettings(),
      canvasPresets: GENERATOR_CANVAS_PRESETS,
      ui: en.generatorUi.controlPanel,
      proBadgeLabel,
      uploadedFontName: null,
      onDurationChange: noop,
      onDisplayFormatChange: noop,
      onResolutionPresetChange: noop,
      onBackgroundModeChange: noop,
      onFontFamilyChange: noop,
      onAnchorChange: noop,
      onTextColorChange: noop,
      onUploadFont: noop,
      onClearUploadedFont: noop,
      onAudioVariantChange: noop,
    }),
  );
}

describe("resolution preset Pro badge", () => {
  it("marks only the two 4K presets", () => {
    const markup = renderControlPanel("Pro");
    const labelled = [...markup.matchAll(/<option value="([^"]+)">([^<]*)<\/option>/g)]
      .filter(([, , label]) => label.includes("(Pro)"))
      .map(([, id]) => id);

    expect(labelled.sort()).toEqual(["landscape-2160", "portrait-2160"]);
  });

  it("honours a localized badge label", () => {
    const markup = renderControlPanel("专业版");
    const labelled = [...markup.matchAll(/<option value="([^"]+)">([^<]*)<\/option>/g)]
      .filter(([, , label]) => label.includes("(专业版)"))
      .map(([, id]) => id);

    expect(labelled.sort()).toEqual(["landscape-2160", "portrait-2160"]);
  });
});

function renderExportPanel(fallbackNotice?: string | null) {
  const settings = createGeneratorSettings();
  // Both alpha encoders available, so the two Pro-badged format rows render.
  const support = {
    ...getInitialLocalExportSupport(),
    supportsVp9Alpha: true,
    supportsHevcAlpha: true,
  };
  return renderToStaticMarkup(
    React.createElement(ExportPanel, {
      settings,
      advisory: getExportAdvisory(settings, support),
      exportProgress: DEFAULT_EXPORT_PROGRESS_STATE,
      isExporting: false,
      onExport: noop,
      onFormatChange: noop,
      onFpsChange: noop,
      onQualityChange: noop,
      support,
      ui: en.generatorUi.exportPanel,
      fallbackNotice,
    }),
  );
}

describe("export panel fallback notice", () => {
  it("stays out of the panel when nothing was downgraded", () => {
    expect(renderExportPanel()).not.toContain('role="status"');
  });

  it("shows the downgrade as a status line, not a dialog", () => {
    const notice = getProGateCopy("en").fallbackResolution;
    const markup = renderExportPanel(notice);

    expect(markup).toContain(notice);
    expect(markup).toContain('role="status"');
    expect(markup).not.toContain('role="dialog"');
  });

  it("badges both alpha video formats with the locale's Pro label", () => {
    const markup = renderExportPanel();
    const proBadges = markup.split('uppercase tracking-[0.2em] text-primary">Pro</span>').length - 1;

    expect(markup).toContain(en.generatorUi.exportPanel.vp9AlphaLabel);
    expect(markup).toContain(en.generatorUi.exportPanel.hevcAlphaLabel);
    expect(proBadges).toBe(2);
  });
});
