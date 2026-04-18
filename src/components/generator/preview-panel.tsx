"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

import { Pause, Play, ScanLine, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RootPageContent } from "@/content/root/types";
import {
  advancePreviewPlayback,
  clampPreviewElapsedSeconds,
  syncCanvasElementSize,
} from "@/lib/generator/preview-runtime";
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
  ui: RootPageContent["generatorUi"]["previewPanel"];
  onToggleSafeArea: () => void;
};

export function PreviewPanel({
  settings,
  ui,
  onToggleSafeArea,
}: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const displayText = useMemo(
    () =>
      formatCountdownTime(
        getRemainingDurationSeconds(settings.timer.durationSeconds, elapsedSeconds),
        settings.timer.displayFormat,
      ),
    [elapsedSeconds, settings.timer.displayFormat, settings.timer.durationSeconds],
  );

  useEffect(() => {
    setElapsedSeconds((current) =>
      clampPreviewElapsedSeconds(current, settings.timer.durationSeconds),
    );
  }, [settings.timer.durationSeconds]);

  const stepPreview = useEffectEvent(function tick(timestamp: number) {
    const nextState = advancePreviewPlayback({
      timestamp,
      previousElapsedSeconds: elapsedSeconds,
      durationSeconds: settings.timer.durationSeconds,
      startedAtTimestamp: startedAtRef.current,
    });

    startedAtRef.current = nextState.startedAtTimestamp;
    setElapsedSeconds(nextState.elapsedSeconds);

    if (nextState.completed) {
      setIsPlaying(false);
      rafRef.current = null;
      return;
    }

    rafRef.current = window.requestAnimationFrame(tick);
  });

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      return;
    }

    rafRef.current = window.requestAnimationFrame((timestamp) => {
      stepPreview(timestamp);
    });

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, stepPreview]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    syncCanvasElementSize(canvas, settings.canvas.width, settings.canvas.height);
  }, [settings.canvas.height, settings.canvas.width]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

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

  const handlePlay = () => {
    if (elapsedSeconds >= settings.timer.durationSeconds) {
      setElapsedSeconds(0);
      startedAtRef.current = null;
    }

    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    startedAtRef.current = null;
  };

  return (
    <section className="cyber-panel cyber-chamfer overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{ui.title}</span>
        <span className="text-primary">{ui.subtitle}</span>
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
            onClick={handlePlay}
          >
            <Play className="size-4" />
            {ui.playButton}
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            disabled={!isPlaying}
            onClick={handlePause}
          >
            <Pause className="size-4" />
            {ui.pauseButton}
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={handleReset}>
            <RotateCcw className="size-4" />
            {ui.resetButton}
          </Button>
          <Button
            variant={settings.canvas.showSafeArea ? "default" : "outline"}
            className="justify-start gap-2"
            onClick={onToggleSafeArea}
          >
            <ScanLine className="size-4" />
            {settings.canvas.showSafeArea
              ? ui.safeAreaOnButton
              : ui.safeAreaOffButton}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-none border border-border/80 bg-background/65 px-4 py-3 text-sm text-muted-foreground">
          <span>{ui.currentReadoutLabel}</span>
          <span className="font-mono text-foreground">{displayText}</span>
        </div>
      </div>
    </section>
  );
}
