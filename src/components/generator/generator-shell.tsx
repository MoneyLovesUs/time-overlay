"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { ControlPanel } from "@/components/generator/control-panel";
import { ExportPanel } from "@/components/generator/export-panel";
import { PreviewPanel } from "@/components/generator/preview-panel";
import { ThemePresetPicker } from "@/components/generator/theme-preset-picker";
import {
  DEFAULT_EXPORT_PROGRESS_STATE,
  DEFAULT_GENERATOR_SETTINGS,
  GENERATOR_CANVAS_PRESETS,
  GENERATOR_THEME_PRESETS,
  normalizeGeneratorSettings,
} from "@/lib/generator/defaults";
import { downloadBlob } from "@/lib/generator/export/png-sequence";
import { exportWebmLocally } from "@/lib/generator/export/webm";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
  getLocalExportSupport,
} from "@/lib/generator/feature-detection";
import type {
  BackgroundMode,
  ExportProgressState,
  ExportQualityPreset,
  FontFamilyPreset,
  GeneratorFormat,
  GeneratorSettings,
  PlacementAnchor,
  RenderThemePresetId,
  ResolutionPresetId,
  TimerDisplayFormat,
} from "@/lib/generator/types";
import type { ExportWorkerMessage } from "@/lib/generator/export/job";

export function GeneratorShell() {
  const [settings, setSettings] = useState<GeneratorSettings>(() => ({
    ...DEFAULT_GENERATOR_SETTINGS,
  }));
  const [exportProgress, setExportProgress] = useState<ExportProgressState>(
    DEFAULT_EXPORT_PROGRESS_STATE,
  );
  const [isExporting, setIsExporting] = useState(false);
  const [support, setSupport] = useState(getInitialLocalExportSupport);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const deferredSettings = useDeferredValue(settings);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const exportWorkerRef = useRef<Worker | null>(null);
  const exportTotalsRef = useRef(0);
  const exportAdvisory = useMemo(
    () => getExportAdvisory(settings, support),
    [settings, support],
  );

  const updateSettings = (updater: (current: GeneratorSettings) => GeneratorSettings) => {
    startTransition(() => {
      setSettings((current) => normalizeGeneratorSettings(updater(current)));
    });
  };

  useEffect(() => {
    setSupport(getLocalExportSupport());
  }, []);

  useEffect(() => {
    setElapsedSeconds((current) =>
      Math.min(current, settings.timer.durationSeconds),
    );
  }, [settings.timer.durationSeconds]);

  const stepPreview = useEffectEvent(function tick(timestamp: number) {
    const baseTimestamp =
      startedAtRef.current ?? timestamp - elapsedSeconds * 1000;
    const nextElapsedSeconds = (timestamp - baseTimestamp) / 1000;

    startedAtRef.current = baseTimestamp;

    if (nextElapsedSeconds >= settings.timer.durationSeconds) {
      setElapsedSeconds(settings.timer.durationSeconds);
      setIsPlaying(false);
      startedAtRef.current = null;
      rafRef.current = null;
      return;
    }

    setElapsedSeconds(nextElapsedSeconds);
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
  }, [isPlaying]);

  const handleDurationChange = (durationSeconds: number) => {
    updateSettings((current) => ({
      ...current,
      timer: {
        ...current.timer,
        durationSeconds,
      },
    }));
  };

  const handleDisplayFormatChange = (displayFormat: TimerDisplayFormat) => {
    updateSettings((current) => ({
      ...current,
      timer: {
        ...current.timer,
        displayFormat,
      },
    }));
  };

  const handleResolutionPresetChange = (resolutionPresetId: ResolutionPresetId) => {
    updateSettings((current) => ({
      ...current,
      canvas: {
        ...current.canvas,
        resolutionPresetId,
      },
    }));
  };

  const handleBackgroundModeChange = (backgroundMode: BackgroundMode) => {
    updateSettings((current) => ({
      ...current,
      canvas: {
        ...current.canvas,
        backgroundMode,
      },
    }));
  };

  const handleFontFamilyChange = (fontFamily: FontFamilyPreset) => {
    updateSettings((current) => ({
      ...current,
      textStyle: {
        ...current.textStyle,
        fontFamily,
      },
    }));
  };

  const handleAnchorChange = (anchor: PlacementAnchor) => {
    updateSettings((current) => ({
      ...current,
      placement: {
        ...current.placement,
        anchor,
      },
    }));
  };

  const handleFormatChange = (format: GeneratorFormat) => {
    updateSettings((current) => ({
      ...current,
      export: {
        ...current.export,
        format,
      },
    }));
  };

  const handleFpsChange = (fps: number) => {
    updateSettings((current) => ({
      ...current,
      export: {
        ...current.export,
        fps,
      },
    }));
  };

  const handleQualityChange = (quality: ExportQualityPreset) => {
    updateSettings((current) => ({
      ...current,
      export: {
        ...current.export,
        quality,
      },
    }));
  };

  const handleThemePresetChange = (presetId: RenderThemePresetId) => {
    const preset = GENERATOR_THEME_PRESETS.find((item) => item.id === presetId);

    if (!preset) {
      return;
    }

    updateSettings((current) => ({
      ...current,
      themePresetId: preset.id,
      textStyle: {
        ...current.textStyle,
        ...preset.textStyle,
      },
      placement: {
        ...current.placement,
        ...preset.placement,
      },
      canvas: {
        ...current.canvas,
        ...preset.canvas,
      },
    }));
  };

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

  const handleToggleSafeArea = () => {
    updateSettings((current) => ({
      ...current,
      canvas: {
        ...current.canvas,
        showSafeArea: !current.canvas.showSafeArea,
      },
    }));
  };

  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/generator-export.worker.ts", import.meta.url),
      {
        type: "module",
      },
    );

    exportWorkerRef.current = worker;

    worker.onmessage = (event: MessageEvent<ExportWorkerMessage>) => {
      if (event.data.kind === "progress") {
        setExportProgress(event.data.payload);
        return;
      }

      if (event.data.kind === "complete") {
        setIsExporting(false);
        setExportProgress({
          stage: "complete",
          completedFrames: exportTotalsRef.current,
          totalFrames: exportTotalsRef.current,
          message: `Export ready: ${event.data.payload.fileName}`,
        });
        downloadBlob(event.data.payload.blob, event.data.payload.fileName);
        return;
      }

      setIsExporting(false);
      setExportProgress({
        stage: "error",
        completedFrames: 0,
        totalFrames: 0,
        message: event.data.payload.message,
      });
    };

    return () => {
      worker.terminate();
      exportWorkerRef.current = null;
    };
  }, []);

  const handleExport = async () => {
    const totalFrames = Math.round(settings.timer.durationSeconds * settings.export.fps);
    exportTotalsRef.current = totalFrames;

    if (settings.export.format === "png-sequence" && !exportWorkerRef.current) {
      setExportProgress({
        stage: "error",
        completedFrames: 0,
        totalFrames: 0,
        message: "Export worker is unavailable in this browser session.",
      });
      return;
    }

    const exportWorker = exportWorkerRef.current;

    setIsExporting(true);
    setExportProgress({
      stage: "validating",
      completedFrames: 0,
      totalFrames,
      message:
        settings.export.format === "webm"
          ? "Preparing local WebM export"
          : "Preparing local PNG sequence export",
    });

    if (settings.export.format === "webm") {
      try {
        const result = await exportWebmLocally(settings, {
          onProgress: (progress) => {
            setExportProgress(progress);
          },
        });

        setIsExporting(false);
        setExportProgress({
          stage: "complete",
          completedFrames: totalFrames,
          totalFrames,
          message: `Export ready: ${result.fileName}`,
        });
        downloadBlob(result.blob, result.fileName);
      } catch (error) {
        setIsExporting(false);
        setExportProgress({
          stage: "error",
          completedFrames: 0,
          totalFrames: 0,
          message:
            error instanceof Error
              ? error.message
              : "WebM export failed unexpectedly.",
        });
      }

      return;
    }

    exportWorker?.postMessage({
      kind: "export-png-sequence",
      payload: {
        settings,
      },
    });
  };

  return (
    <main id="tool" className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.14),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(0,255,136,0.12),transparent_22%),linear-gradient(180deg,rgba(9,10,14,0.99),rgba(7,8,12,1))]"
        />
        <div
          aria-hidden="true"
          className="cyber-grid cyber-scanlines absolute inset-0 opacity-75"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 sm:py-8 lg:gap-6 lg:py-10">
          <div className="rounded-none border border-border/70 bg-background/35 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                Time Overlay
              </p>
              <h1 className="text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">
                Set the duration, preview the frame, then export your timer asset.
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Recommended first try: `30s`, `PNG sequence`, `bottom-right`.
              </p>
            </div>
          </div>

          <ThemePresetPicker
            presets={GENERATOR_THEME_PRESETS}
            activePresetId={settings.themePresetId}
            onSelectPreset={handleThemePresetChange}
          />

          <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_18rem]">
            <ControlPanel
              settings={settings}
              canvasPresets={GENERATOR_CANVAS_PRESETS}
              onDurationChange={handleDurationChange}
              onDisplayFormatChange={handleDisplayFormatChange}
              onResolutionPresetChange={handleResolutionPresetChange}
              onBackgroundModeChange={handleBackgroundModeChange}
              onFontFamilyChange={handleFontFamilyChange}
              onAnchorChange={handleAnchorChange}
            />
            <PreviewPanel
              settings={deferredSettings}
              elapsedSeconds={elapsedSeconds}
              isPlaying={isPlaying}
              onPause={handlePause}
              onPlay={handlePlay}
              onReset={handleReset}
              onToggleSafeArea={handleToggleSafeArea}
            />
            <ExportPanel
              advisory={exportAdvisory}
              exportProgress={exportProgress}
              isExporting={isExporting}
              onExport={handleExport}
              settings={settings}
              onFormatChange={handleFormatChange}
              onFpsChange={handleFpsChange}
              onQualityChange={handleQualityChange}
              support={support}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
