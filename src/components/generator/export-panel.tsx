import { Download, FileStack, Film } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  return (
    <section className="cyber-panel cyber-chamfer overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Export</span>
        <span className="text-primary">Delivery bay</span>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            Output format
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
                  PNG Sequence
                </span>
                <span className="mt-1 block text-muted-foreground">
                  Most reliable for editors and transparent handoff.
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
                  WebM
                </span>
                <span className="mt-1 block text-muted-foreground">
                  Good for lightweight local video export on supported browsers.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            FPS
            <select
              className={fieldClassName}
              onChange={(event) => onFpsChange(Number(event.target.value))}
              value={settings.export.fps}
            >
              <option value={24}>24 fps</option>
              <option value={30}>30 fps</option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-foreground">
            Quality
            <select
              className={fieldClassName}
              onChange={(event) =>
                onQualityChange(event.target.value as ExportQualityPreset)
              }
              value={settings.export.quality}
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <div className={`rounded-none border px-4 py-4 ${advisoryClassName}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            Launch note
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {advisory.message ??
              "Export remains local-first in the MVP. If a format is unsupported in the current browser, the UI will steer users toward PNG sequence."}
          </p>
        </div>

        <Button
          className="h-11 w-full justify-between rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
          disabled={isExporting || advisory.severity === "error"}
          onClick={onExport}
        >
          <span>{isExporting ? "Exporting..." : "Export asset"}</span>
          <Download className="size-4" />
        </Button>

        <div className="rounded-none border border-border/80 bg-background/65 px-4 py-3 text-sm text-muted-foreground">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Export status
          </p>
          <p className="mt-2 leading-6">
            {exportProgress.message || "Idle. Choose a format and start a local export."}
          </p>
        </div>
      </div>
    </section>
  );
}
