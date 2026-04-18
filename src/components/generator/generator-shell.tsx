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
import type { RootPageContent } from "@/content/root/types";
import {
  DEFAULT_EXPORT_PROGRESS_STATE,
  DEFAULT_GENERATOR_SETTINGS,
  GENERATOR_CANVAS_PRESETS,
  GENERATOR_THEME_PRESETS,
  normalizeGeneratorSettings,
} from "@/lib/generator/defaults";
import {
  createLazyExportRuntime,
  type LazyExportRuntime,
} from "@/lib/generator/export/runtime";
import { downloadBlob } from "@/lib/generator/export/png-sequence";
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

type GeneratorShellProps = {
  hero: RootPageContent["generatorHero"];
  ui: RootPageContent["generatorUi"];
};

export function GeneratorShell({ hero, ui }: GeneratorShellProps) {
  const [settings, setSettings] = useState<GeneratorSettings>(() => ({
    ...DEFAULT_GENERATOR_SETTINGS,
  }));
  const [exportProgress, setExportProgress] = useState<ExportProgressState>(
    DEFAULT_EXPORT_PROGRESS_STATE,
  );
  const [isExporting, setIsExporting] = useState(false);
  const [support, setSupport] = useState(getInitialLocalExportSupport);
  const deferredSettings = useDeferredValue(settings);
  const exportRuntimeRef = useRef<LazyExportRuntime | null>(null);
  const exportTotalsRef = useRef(0);
  const formatTemplate = (
    template: string,
    replacements: Record<string, string | number>,
  ) =>
    Object.entries(replacements).reduce(
      (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
      template,
    );
  const exportAdvisory = useMemo(
    () => getExportAdvisory(settings, support),
    [settings, support],
  );
  const localizeProgressMessage = (
    progress: ExportProgressState,
  ): ExportProgressState => {
    if (
      progress.stage === "rendering-frames" ||
      progress.stage === "encoding" ||
      progress.stage === "packaging"
    ) {
      return {
        ...progress,
        message:
          progress.stage === "packaging"
            ? `${progress.completedFrames}/${progress.totalFrames}`
            : `${progress.completedFrames}/${progress.totalFrames}`,
      };
    }

    return progress;
  };

  const updateSettings = (updater: (current: GeneratorSettings) => GeneratorSettings) => {
    startTransition(() => {
      setSettings((current) => normalizeGeneratorSettings(updater(current)));
    });
  };

  useEffect(() => {
    setSupport(getLocalExportSupport());
  }, []);

  const getExportRuntime = () => {
    exportRuntimeRef.current ??= createLazyExportRuntime();
    return exportRuntimeRef.current;
  };

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

  const handleToggleSafeArea = () => {
    updateSettings((current) => ({
      ...current,
      canvas: {
        ...current.canvas,
        showSafeArea: !current.canvas.showSafeArea,
      },
    }));
  };

  const handlePngSequenceWorkerMessage = useEffectEvent(
    (event: MessageEvent<ExportWorkerMessage>) => {
      if (event.data.kind === "progress") {
        setExportProgress(localizeProgressMessage(event.data.payload));
        return;
      }

      if (event.data.kind === "complete") {
        setIsExporting(false);
        setExportProgress({
          stage: "complete",
          completedFrames: exportTotalsRef.current,
          totalFrames: exportTotalsRef.current,
          message: formatTemplate(
            ui.exportPanel.runtimeMessages.exportReadyTemplate,
            { fileName: event.data.payload.fileName },
          ),
        });
        downloadBlob(event.data.payload.blob, event.data.payload.fileName);
        return;
      }

      setIsExporting(false);
      setExportProgress({
        stage: "error",
        completedFrames: 0,
        totalFrames: 0,
        message:
          event.data.payload.message ??
          (event.data.payload.code === "pngSequenceFailedUnexpectedly"
            ? ui.exportPanel.runtimeMessages.pngSequenceFailedUnexpectedly
            : ui.exportPanel.runtimeMessages.pngSequenceFailedUnexpectedly),
      });
    },
  );

  useEffect(() => {
    return () => {
      exportRuntimeRef.current?.terminatePngSequenceWorker();
      exportRuntimeRef.current = null;
    };
  }, []);

  const handleExport = async () => {
    const totalFrames = Math.round(settings.timer.durationSeconds * settings.export.fps);
    exportTotalsRef.current = totalFrames;

    setIsExporting(true);
    setExportProgress({
      stage: "validating",
      completedFrames: 0,
      totalFrames,
      message:
        settings.export.format === "webm"
          ? ui.exportPanel.runtimeMessages.preparingWebm
          : ui.exportPanel.runtimeMessages.preparingPngSequence,
    });

    if (settings.export.format === "webm") {
      try {
        const { exportWebmLocally } = await getExportRuntime().loadWebmExporter();
        const result = await exportWebmLocally(settings, {
          onProgress: (progress) => {
            setExportProgress(localizeProgressMessage(progress));
          },
        });

        setIsExporting(false);
        setExportProgress({
          stage: "complete",
          completedFrames: totalFrames,
          totalFrames,
          message: formatTemplate(
            ui.exportPanel.runtimeMessages.exportReadyTemplate,
            { fileName: result.fileName },
          ),
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
              : ui.exportPanel.runtimeMessages.webmFailedUnexpectedly,
        });
      }

      return;
    }

    try {
      const exportWorker = getExportRuntime().getPngSequenceWorker();
      exportWorker.onmessage = handlePngSequenceWorkerMessage;
      exportWorker.postMessage({
        kind: "export-png-sequence",
        payload: {
          settings,
        },
      });
    } catch {
      setIsExporting(false);
      setExportProgress({
        stage: "error",
        completedFrames: 0,
        totalFrames: 0,
        message: ui.exportPanel.runtimeMessages.exportWorkerUnavailable,
      });
    }
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
                {hero.eyebrow}
              </p>
              <h1 className="text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">
                {hero.heading}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                {hero.intro}
              </p>
            </div>
          </div>

          <ThemePresetPicker
            presets={GENERATOR_THEME_PRESETS}
            activePresetId={settings.themePresetId}
            onSelectPreset={handleThemePresetChange}
            ui={ui.themePresetPicker}
          />

          <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_18rem]">
            <ControlPanel
              settings={settings}
              canvasPresets={GENERATOR_CANVAS_PRESETS}
              ui={ui.controlPanel}
              onDurationChange={handleDurationChange}
              onDisplayFormatChange={handleDisplayFormatChange}
              onResolutionPresetChange={handleResolutionPresetChange}
              onBackgroundModeChange={handleBackgroundModeChange}
              onFontFamilyChange={handleFontFamilyChange}
              onAnchorChange={handleAnchorChange}
            />
            <PreviewPanel
              settings={deferredSettings}
              ui={ui.previewPanel}
              onToggleSafeArea={handleToggleSafeArea}
            />
            <ExportPanel
              advisory={exportAdvisory}
              exportProgress={exportProgress}
              isExporting={isExporting}
              onExport={handleExport}
              settings={settings}
              ui={ui.exportPanel}
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
