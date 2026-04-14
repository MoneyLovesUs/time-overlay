import { Download, FileStack, Film } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RootPageContent } from "@/content/root/types";
import type { ExportAdvisory, LocalExportSupport } from "@/lib/generator/feature-detection";
import type {
  ExportProgressState,
  ExportQualityPreset,
  GeneratorFormat,
  GeneratorSettings,
} from "@/lib/generator/types";

type ExportPanelProps = {
  settings: GeneratorSettings;
  advisory: ExportAdvisory;
  ui: RootPageContent["generatorUi"]["exportPanel"];
  exportProgress: ExportProgressState;
  isExporting: boolean;
  onExport: () => void;
  onFormatChange: (format: GeneratorFormat) => void;
  onFpsChange: (fps: number) => void;
  onQualityChange: (quality: ExportQualityPreset) => void;
  support: LocalExportSupport;
};

const fieldClassName =
  "mt-2 h-10 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary";

export function ExportPanel({
  settings,
  advisory,
  ui,
  exportProgress,
  isExporting,
  onExport,
  onFormatChange,
  onFpsChange,
  onQualityChange,
  support,
}: ExportPanelProps) {
  const advisoryClassName =
    advisory.severity === "error"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : advisory.severity === "warning"
        ? "border-secondary/35 bg-secondary/10 text-foreground"
        : "border-tertiary/30 bg-tertiary/8 text-foreground";
  const advisoryMessage =
    advisory.code === "workerSupportError"
      ? ui.advisoryMessages.workerSupportError
      : advisory.code === "webmUnavailableError"
        ? ui.advisoryMessages.webmUnavailableError
        : advisory.code === "heavyExportWarning"
          ? ui.advisoryMessages.heavyExportWarning
          : advisory.code === "pngSequenceInfo"
            ? ui.advisoryMessages.pngSequenceInfo
            : null;

  return (
    <section className="cyber-panel cyber-chamfer overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{ui.title}</span>
        <span className="text-primary">{ui.subtitle}</span>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.outputFormatTitle}
          </p>
          <div className="mt-4 grid gap-3">
            <label className="flex items-start gap-3 border border-border/80 bg-background/65 px-3 py-3 text-sm">
              <input
                checked={settings.export.format === "png-sequence"}
                disabled={!support.supportsPngSequence}
                name="format"
                onChange={() => onFormatChange("png-sequence")}
                type="radio"
                value="png-sequence"
              />
              <span>
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <FileStack className="size-4 text-primary" />
                  {ui.pngSequenceLabel}
                </span>
                <span className="mt-1 block text-muted-foreground">
                  {ui.pngSequenceDescription}
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 border border-border/80 bg-background/65 px-3 py-3 text-sm">
              <input
                checked={settings.export.format === "webm"}
                disabled={advisory.disabledFormats.includes("webm")}
                name="format"
                onChange={() => onFormatChange("webm")}
                type="radio"
                value="webm"
              />
              <span>
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Film className="size-4 text-tertiary" />
                  {ui.webmLabel}
                </span>
                <span className="mt-1 block text-muted-foreground">
                  {ui.webmDescription}
                </span>
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            {ui.fpsLabel}
            <select
              className={fieldClassName}
              onChange={(event) => onFpsChange(Number(event.target.value))}
              value={settings.export.fps}
            >
              <option value={24}>{ui.fpsOptions[24]}</option>
              <option value={30}>{ui.fpsOptions[30]}</option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.qualityLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onQualityChange(event.target.value as ExportQualityPreset)
              }
              value={settings.export.quality}
            >
              <option value="standard">{ui.qualityOptions.standard}</option>
              <option value="high">{ui.qualityOptions.high}</option>
            </select>
          </label>
        </div>

        <div className={`rounded-none border px-4 py-4 ${advisoryClassName}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.launchNoteTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {advisoryMessage ?? ui.launchNoteFallback}
          </p>
        </div>

        <Button
          className="h-11 w-full justify-between rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
          disabled={isExporting || advisory.severity === "error"}
          onClick={onExport}
        >
          <span>{isExporting ? ui.exportButtonBusy : ui.exportButtonIdle}</span>
          <Download className="size-4" />
        </Button>

        <div className="rounded-none border border-border/80 bg-background/65 px-4 py-3 text-sm text-muted-foreground">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            {ui.exportStatusTitle}
          </p>
          <p className="mt-2 leading-6">
            {exportProgress.message || ui.exportStatusIdle}
          </p>
        </div>
      </div>
    </section>
  );
}
