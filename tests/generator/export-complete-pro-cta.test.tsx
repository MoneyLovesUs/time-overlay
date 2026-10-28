import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ExportPanel } from "@/components/generator/export-panel";
import esRootPageContent from "@/content/root/es";
import { getProCtaCopy } from "@/content/pro-cta";
import {
  createGeneratorSettings,
  DEFAULT_EXPORT_PROGRESS_STATE,
} from "@/lib/generator/defaults";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";

const COMPLETE_PROGRESS = {
  stage: "complete" as const,
  completedFrames: 30,
  totalFrames: 30,
  message: "timer.mp4 is ready",
};

function renderPanel({
  isPro = false,
  exportProgress = COMPLETE_PROGRESS,
  onUnlockPro,
}: {
  isPro?: boolean;
  exportProgress?: typeof DEFAULT_EXPORT_PROGRESS_STATE;
  onUnlockPro?: () => void;
}) {
  const settings = createGeneratorSettings();
  return renderToStaticMarkup(
    React.createElement(ExportPanel, {
      settings,
      isPro,
      advisory: getExportAdvisory(settings, getInitialLocalExportSupport()),
      exportProgress,
      isExporting: false,
      onExport: () => {},
      onFormatChange: () => {},
      onFpsChange: () => {},
      onQualityChange: () => {},
      support: getInitialLocalExportSupport(),
      ui: esRootPageContent.generatorUi.exportPanel,
      onUnlockPro,
    }),
  );
}

describe("export-complete Pro CTA", () => {
  it("offers Pro once a free user's export finishes", () => {
    const markup = renderPanel({ onUnlockPro: () => {} });
    const copy = getProCtaCopy("en");

    expect(markup).toContain(copy.exportCtaTitle);
    expect(markup).toContain(copy.exportCtaButton);
  });

  it("stays hidden for Pro users", () => {
    const markup = renderPanel({ isPro: true, onUnlockPro: () => {} });

    expect(markup).not.toContain(getProCtaCopy("en").exportCtaTitle);
  });

  it("does not show before an export has completed", () => {
    const idle = renderPanel({ onUnlockPro: () => {} , exportProgress: DEFAULT_EXPORT_PROGRESS_STATE });
    const failed = renderPanel({
      onUnlockPro: () => {},
      exportProgress: { ...COMPLETE_PROGRESS, stage: "error" },
    });

    expect(idle).not.toContain(getProCtaCopy("en").exportCtaTitle);
    expect(failed).not.toContain(getProCtaCopy("en").exportCtaTitle);
  });

  it("is purely secondary: no dialog, and the download status stays visible", () => {
    const markup = renderPanel({ onUnlockPro: () => {} });

    expect(markup).not.toContain('role="dialog"');
    expect(markup).toContain("timer.mp4 is ready");
  });
});
