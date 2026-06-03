import { useEffect, useRef, useState } from "react";

import type { RootPageContent } from "@/content/root/types";
import {
  computeProgressFraction,
  formatRemaining,
  isActiveExportStage,
  progressPercent,
} from "@/lib/generator/export/progress";
import type { ExportProgressState, ExportStage } from "@/lib/generator/types";

type ProgressCopy = NonNullable<
  RootPageContent["generatorUi"]["exportPanel"]["progress"]
>;

// Built-in English fallback so locales that have not translated the progress
// block still get a working, readable experience. The numeric parts (percent,
// ETA) are language-neutral and rendered regardless.
const DEFAULT_PROGRESS_COPY: ProgressCopy = {
  remainingTemplate: "{time} left",
  previewLabel: "Live preview",
  elapsedLabel: "Building your overlay",
  tips: [
    "Everything renders locally in your browser — your frames never leave this device.",
    "PNG sequence imports cleanly into Premiere, DaVinci Resolve, Final Cut, and CapCut.",
    "Keep this tab in focus for the fastest export.",
    "Transparent exports drop straight onto your footage — no green screen needed.",
  ],
  desktopNote:
    "Heads up: exporting works best on a desktop browser. On mobile, stick to PNG sequence or open this page on your computer.",
  fallbackSuggestionTemplate: "Tip: try {format} instead.",
  stageLabels: {
    validating: "Preparing export",
    rendering: "Rendering frames",
    encoding: "Encoding video",
    packaging: "Packaging files",
    complete: "Done",
  },
};

function stageLabel(stage: ExportStage, copy: ProgressCopy): string {
  switch (stage) {
    case "validating":
      return copy.stageLabels.validating;
    case "rendering-frames":
      return copy.stageLabels.rendering;
    case "encoding":
      return copy.stageLabels.encoding;
    case "packaging":
      return copy.stageLabels.packaging;
    case "complete":
      return copy.stageLabels.complete;
    default:
      return copy.elapsedLabel;
  }
}

function useRotatingTip(tips: readonly string[], active: boolean): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || tips.length <= 1) {
      return;
    }
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % tips.length);
    }, 3800);
    return () => window.clearInterval(interval);
  }, [active, tips.length]);

  return tips[index % Math.max(1, tips.length)] ?? "";
}

function PreviewSurface({
  bitmap,
  label,
}: {
  bitmap: ImageBitmap | null;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bitmap) {
      return;
    }
    if (canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0);
  }, [bitmap]);

  if (!bitmap) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-none border border-border/70 bg-[repeating-conic-gradient(#0c0e14_0deg_90deg,#11141d_90deg_180deg)] bg-[length:18px_18px]">
      <canvas
        ref={canvasRef}
        className="block h-auto w-full"
        aria-hidden="true"
      />
      <span className="absolute left-2 top-2 rounded-none bg-background/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-primary">
        {label}
      </span>
    </div>
  );
}

type ExportProgressViewProps = {
  exportProgress: ExportProgressState;
  isExporting: boolean;
  etaMs: number | null;
  previewBitmap: ImageBitmap | null;
  statusTitle: string;
  idleMessage: string;
  progressCopy?: ProgressCopy;
};

export function ExportProgressView({
  exportProgress,
  isExporting,
  etaMs,
  previewBitmap,
  statusTitle,
  idleMessage,
  progressCopy,
}: ExportProgressViewProps) {
  const copy = progressCopy ?? DEFAULT_PROGRESS_COPY;
  const active = isExporting && isActiveExportStage(exportProgress.stage);
  const targetFraction = computeProgressFraction(
    exportProgress.completedFrames,
    exportProgress.totalFrames,
  );
  const tip = useRotatingTip(copy.tips, active);

  // The bar width is driven straight from the real fraction; the CSS width
  // transition tweens smoothly across the worker's ~90ms progress ticks so the
  // bar never looks frozen between updates (a stalled bar is what makes people
  // abandon a wait).
  const percent = progressPercent(targetFraction);
  const remainingText = active ? formatRemaining(etaMs) : null;
  const remainingLabel = remainingText
    ? copy.remainingTemplate.replace("{time}", remainingText)
    : null;

  const isComplete = exportProgress.stage === "complete";
  const isError = exportProgress.stage === "error";

  // Idle / terminal state keeps the original compact status line.
  if (!active) {
    return (
      <div className="rounded-none border border-border/80 bg-background/65 px-4 py-3 text-sm text-muted-foreground">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {statusTitle}
        </p>
        <p
          className={`mt-2 leading-6 ${
            isComplete
              ? "text-primary"
              : isError
                ? "text-destructive"
                : "text-muted-foreground"
          }`}
        >
          {exportProgress.message || idleMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-none border border-primary/40 bg-primary/5 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
          {stageLabel(exportProgress.stage, copy)}
        </p>
        <span className="font-mono text-sm tabular-nums text-foreground">
          {percent}%
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-none bg-border/60"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div
          className="h-full bg-gradient-to-r from-primary via-tertiary to-secondary transition-[width] duration-300 ease-out"
          style={{ width: `${Math.max(2, percent)}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        <span className="tabular-nums">
          {exportProgress.completedFrames}/{exportProgress.totalFrames}
        </span>
        {remainingLabel ? (
          <span className="tabular-nums text-foreground">{remainingLabel}</span>
        ) : null}
      </div>

      <PreviewSurface bitmap={previewBitmap} label={copy.previewLabel} />

      {tip ? (
        <p className="text-[11px] leading-5 text-muted-foreground">{tip}</p>
      ) : null}
    </div>
  );
}
