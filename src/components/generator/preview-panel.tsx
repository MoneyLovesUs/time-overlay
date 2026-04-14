"use client";

import { useEffect, useMemo, useRef } from "react";

import { Pause, Play, ScanLine, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  createRenderFrameState,
  measureRenderTextBox,
  renderFrameToCanvas,
  resolveCanvasFontFamily,
} from "@/lib/generator/render-frame";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";
import type { GeneratorSettings } from "@/lib/generator/types";

type PreviewPanelProps = {
  settings: GeneratorSettings;
  elapsedSeconds: number;
  isPlaying: boolean;
  onPause: () => void;
  onPlay: () => void;
  onReset: () => void;
  onToggleSafeArea: () => void;
};

export function PreviewPanel({
  settings,
  elapsedSeconds,
  isPlaying,
  onPause,
  onPlay,
  onReset,
  onToggleSafeArea,
}: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayText = useMemo(
    () =>
      formatCountdownTime(
        getRemainingDurationSeconds(settings.timer.durationSeconds, elapsedSeconds),
        settings.timer.displayFormat,
      ),
    [elapsedSeconds, settings.timer.displayFormat, settings.timer.durationSeconds],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = settings.canvas.width;
    canvas.height = settings.canvas.height;
    context.font = `${settings.textStyle.fontWeight} ${settings.textStyle.fontSize}px ${resolveCanvasFontFamily(settings.textStyle.fontFamily)}`;
    const textBox = measureRenderTextBox(context, displayText, {
      fontFamily: settings.textStyle.fontFamily,
      fontSize: settings.textStyle.fontSize,
      fontWeight: settings.textStyle.fontWeight,
      letterSpacing: settings.textStyle.letterSpacing,
      textColor: settings.textStyle.textColor,
      strokeWidth: settings.textStyle.strokeWidth,
      strokeColor: settings.textStyle.strokeColor,
      glowBlur: settings.textStyle.glowBlur,
      glowColor: settings.textStyle.glowColor,
      shadowBlur: settings.textStyle.shadowBlur,
      shadowColor: settings.textStyle.shadowColor,
      shadowOffsetX: settings.textStyle.shadowOffsetX,
      shadowOffsetY: settings.textStyle.shadowOffsetY,
    });

    const frameState = createRenderFrameState({
      settings,
      elapsedSeconds,
      textBox,
      safeAreaInset: 32,
    });

    renderFrameToCanvas(context, frameState);
  }, [displayText, elapsedSeconds, settings]);

  return (
    <section className="cyber-panel cyber-chamfer overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Preview</span>
        <span className="text-primary">Live canvas scaffold</span>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="relative overflow-hidden border border-border/80 bg-[linear-gradient(180deg,rgba(8,11,16,0.96),rgba(9,10,14,0.98))]">
          <div className="relative aspect-video">
            <canvas
              ref={canvasRef}
              className="block h-full w-full bg-transparent"
            />
            {settings.canvas.showSafeArea ? (
              <div className="pointer-events-none absolute inset-[8%] border border-dashed border-white/10" />
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Button
            variant="outline"
            className="justify-start gap-2"
            disabled={isPlaying}
            onClick={onPlay}
          >
            <Play className="size-4" />
            Play Preview
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            disabled={!isPlaying}
            onClick={onPause}
          >
            <Pause className="size-4" />
            Pause
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={onReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            variant={settings.canvas.showSafeArea ? "default" : "outline"}
            className="justify-start gap-2"
            onClick={onToggleSafeArea}
          >
            <ScanLine className="size-4" />
            {settings.canvas.showSafeArea ? "Safe Area On" : "Safe Area Off"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-none border border-border/80 bg-background/65 px-4 py-3 text-sm text-muted-foreground">
          <span>Current readout</span>
          <span className="font-mono text-foreground">{displayText}</span>
        </div>
      </div>
    </section>
  );
}
