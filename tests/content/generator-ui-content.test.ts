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
    expect(markup).toContain("Preajuste de tema");
    expect(markup).toContain("Controles");
    expect(markup).toContain("Vista previa");
    expect(markup).toContain("Zona de entrega");
    expect(markup).toContain("Arriba izquierda");
    expect(markup).toContain("Estándar");
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
});
