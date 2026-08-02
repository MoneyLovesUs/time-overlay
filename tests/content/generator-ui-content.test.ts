import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import esRootPageContent from "@/content/root/es";
import { ExportPanel } from "@/components/generator/export-panel";
import { RootPage } from "@/components/site/root-page";
import { DEFAULT_EXPORT_PROGRESS_STATE, createGeneratorSettings } from "@/lib/generator/defaults";
import { getExportAdvisory, getInitialLocalExportSupport } from "@/lib/generator/feature-detection";

describe("localized generator ui", () => {
  it("renders locale-specific hero and generator control copy", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RootPage, {
        locale: "es",
        content: esRootPageContent,
      }),
    );

    expect(markup).toContain(
      "Define la duración, previsualiza el fotograma y después exporta tu recurso de temporizador.",
    );
    expect(markup).toContain("generator-loading-shell");
    expect(markup).not.toContain("Preajuste de tema");
    expect(markup).not.toContain("Controles");
    expect(markup).not.toContain("Vista previa");
    expect(markup).not.toContain("Zona de entrega");
  });

  it("renders localized advisory and fps option labels in the export panel", () => {
    const settings = createGeneratorSettings();
    const advisory = getExportAdvisory(
      settings,
      getInitialLocalExportSupport(),
    );
    const markup = renderToStaticMarkup(
      React.createElement(ExportPanel, {
        settings,
        advisory,
        exportProgress: DEFAULT_EXPORT_PROGRESS_STATE,
        isExporting: false,
        onExport: () => {},
        onFormatChange: () => {},
        onFpsChange: () => {},
        onQualityChange: () => {},
        support: getInitialLocalExportSupport(),
        ui: esRootPageContent.generatorUi.exportPanel,
      }),
    );

    expect(markup).toContain("24 FPS");
    expect(markup).toContain("30 FPS");
    expect(markup).toContain(
      "PNG Sequence es la entrega local-first más fiable para editores, especialmente cuando la transparencia importa.",
    );
  });

  it("falls back to clear mobile limits and a cancel action for locales without new copy", () => {
    const settings = createGeneratorSettings({
      timer: { durationSeconds: 61 },
    });
    const advisory = getExportAdvisory(
      settings,
      getInitialLocalExportSupport(),
      "mobile",
    );
    const limitedMarkup = renderToStaticMarkup(
      React.createElement(ExportPanel, {
        settings,
        advisory,
        exportProgress: DEFAULT_EXPORT_PROGRESS_STATE,
        isExporting: false,
        isMobile: true,
        onExport: () => {},
        onFormatChange: () => {},
        onFpsChange: () => {},
        onQualityChange: () => {},
        support: getInitialLocalExportSupport(),
        ui: esRootPageContent.generatorUi.exportPanel,
      }),
    );

    expect(limitedMarkup).toContain(
      "This job is too large for a reliable phone or tablet export.",
    );
    expect(limitedMarkup).toContain(
      "On phones and tablets, use 720p for up to 60 seconds",
    );

    const exportingMarkup = renderToStaticMarkup(
      React.createElement(ExportPanel, {
        settings: createGeneratorSettings(),
        advisory: getExportAdvisory(
          createGeneratorSettings(),
          getInitialLocalExportSupport(),
        ),
        exportProgress: DEFAULT_EXPORT_PROGRESS_STATE,
        isExporting: true,
        onCancel: () => {},
        onExport: () => {},
        onFormatChange: () => {},
        onFpsChange: () => {},
        onQualityChange: () => {},
        support: getInitialLocalExportSupport(),
        ui: esRootPageContent.generatorUi.exportPanel,
      }),
    );

    expect(exportingMarkup).toContain("Cancel export");
  });
});
