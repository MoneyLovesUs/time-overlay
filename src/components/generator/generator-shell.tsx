"use client";

import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
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
import { estimateRemainingMs } from "@/lib/generator/export/progress";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
  getLocalExportSupport,
  probeAlphaExportSupport,
} from "@/lib/generator/feature-detection";
import {
  loadFontIntoDocument,
  readFontFile,
  type UploadedFont,
} from "@/lib/generator/font-loader";
import { trackEvent } from "@/lib/analytics/events";
import { detectClientEnvironment } from "@/lib/analytics/environment";
import type {
  AudioCueVariant,
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
  const [uploadedFont, setUploadedFont] = useState<UploadedFont | null>(null);
  const [etaMs, setEtaMs] = useState<number | null>(null);
  const [previewBitmap, setPreviewBitmap] = useState<ImageBitmap | null>(null);
  const deferredSettings = useDeferredValue(settings);
  const exportRuntimeRef = useRef<LazyExportRuntime | null>(null);
  const exportTotalsRef = useRef(0);
  const lastUnsupportedCodeRef = useRef<string | null>(null);
  const exportStartedAtRef = useRef<number | null>(null);
  const exportProgressRef = useRef<ExportProgressState>(exportProgress);
  const abandonFiredRef = useRef(false);
  const previewBitmapRef = useRef<ImageBitmap | null>(null);

  // Swap in a fresh preview snapshot and release the previous bitmap. ImageBitmap
  // holds GPU/canvas memory until close() is called, so leaking one per ~250ms of
  // export would balloon memory on long renders.
  const setPreview = useCallback((next: ImageBitmap | null) => {
    if (previewBitmapRef.current && previewBitmapRef.current !== next) {
      previewBitmapRef.current.close();
    }
    previewBitmapRef.current = next;
    setPreviewBitmap(next);
  }, []);

  const elapsedExportMs = () =>
    exportStartedAtRef.current === null
      ? undefined
      : Math.round(performance.now() - exportStartedAtRef.current);

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
  // Stable context attached to every export funnel event. Without browser/device
  // and capability flags, export_failed is a black box — we cannot tell a Safari
  // codec gap from a low-memory crash, or a mobile drop-off from a desktop one.
  const analyticsEnvironment = useMemo<Record<string, string | number | boolean>>(() => {
    const env = detectClientEnvironment();
    return {
      browser: env.browser,
      browserVersion: env.browserVersion,
      os: env.os,
      deviceType: env.deviceType,
      supportsWebm: support.supportsWebm ?? "unknown",
      supportsVp9Alpha: support.supportsVp9Alpha ?? "unknown",
      supportsHevcAlpha: support.supportsHevcAlpha ?? "unknown",
      hasWorkerSupport: support.hasWorkerSupport ?? "unknown",
    };
  }, [support]);
  const isMobileDevice = analyticsEnvironment.deviceType !== "desktop";

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
        message: `${progress.completedFrames}/${progress.totalFrames}`,
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
    probeAlphaExportSupport().then(({ supportsVp9Alpha, supportsHevcAlpha }) => {
      setSupport((prev) => ({
        ...prev,
        supportsVp9Alpha,
        supportsHevcAlpha,
      }));
    });

    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const presetParam = params.get("preset");
    if (!presetParam) {
      return;
    }
    const preset = GENERATOR_THEME_PRESETS.find((item) => item.id === presetParam);
    if (preset) {
      updateSettings((current) => ({
        ...current,
        themePresetId: preset.id,
        textStyle: { ...current.textStyle, ...preset.textStyle },
        placement: { ...current.placement, ...preset.placement },
        canvas: { ...current.canvas, ...preset.canvas },
      }));
    }
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

  const handleAudioVariantChange = (variant: AudioCueVariant) => {
    updateSettings((current) => ({
      ...current,
      audio: {
        ...current.audio,
        variant,
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

    trackEvent("preset_selected", { presetId });

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

  const handleTextColorChange = (textColor: string) => {
    updateSettings((current) => ({
      ...current,
      textStyle: {
        ...current.textStyle,
        textColor,
      },
    }));
  };

  const handleFontUpload = async (file: File) => {
    try {
      const font = await readFontFile(file);
      await loadFontIntoDocument(font);
      setUploadedFont(font);
      updateSettings((current) => ({
        ...current,
        textStyle: {
          ...current.textStyle,
          customFontFamily: font.family,
        },
      }));
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Could not load this font file.",
      );
    }
  };

  const handleClearUploadedFont = () => {
    setUploadedFont(null);
    updateSettings((current) => ({
      ...current,
      textStyle: {
        ...current.textStyle,
        customFontFamily: undefined,
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

  const handleExportWorkerMessage = useCallback(
    (event: MessageEvent<ExportWorkerMessage>) => {
      if (event.data.kind === "progress") {
        const payload = event.data.payload;
        setExportProgress(localizeProgressMessage(payload));
        setEtaMs(
          estimateRemainingMs(
            elapsedExportMs() ?? 0,
            payload.completedFrames,
            payload.totalFrames,
          ),
        );
        return;
      }

      if (event.data.kind === "preview") {
        setPreview(event.data.payload.bitmap);
        return;
      }

      if (event.data.kind === "complete") {
        setIsExporting(false);
        setPreview(null);
        setEtaMs(null);
        setExportProgress({
          stage: "complete",
          completedFrames: exportTotalsRef.current,
          totalFrames: exportTotalsRef.current,
          message: formatTemplate(
            ui.exportPanel.runtimeMessages.exportReadyTemplate,
            { fileName: event.data.payload.fileName },
          ),
        });
        // Trigger the download first, then record completion, so the funnel's
        // success event lines up with the moment the file actually leaves.
        downloadBlob(event.data.payload.blob, event.data.payload.fileName);
        trackEvent("export_completed", {
          format: settings.export.format,
          fileName: event.data.payload.fileName,
          durationMs: elapsedExportMs(),
          ...analyticsEnvironment,
        });
        return;
      }

      setIsExporting(false);
      setPreview(null);
      setEtaMs(null);
      const code = event.data.payload.code;
      const fallback =
        code === "alphaVideoFailedUnexpectedly"
          ? ui.exportPanel.runtimeMessages.alphaVideoFailedUnexpectedly
          : ui.exportPanel.runtimeMessages.pngSequenceFailedUnexpectedly;
      const baseMessage = event.data.payload.message ?? fallback;
      const suggestedLabel =
        settings.export.format !== "png-sequence" && support.supportsPngSequence
          ? ui.exportPanel.pngSequenceLabel
          : settings.export.format === "png-sequence" && support.supportsWebm
            ? ui.exportPanel.webmLabel
            : null;
      const suggestionTemplate =
        ui.exportPanel.progress?.fallbackSuggestionTemplate ??
        "Tip: try {format} instead.";
      const suggestion = suggestedLabel
        ? suggestionTemplate.replace("{format}", suggestedLabel)
        : null;
      setExportProgress({
        stage: "error",
        completedFrames: 0,
        totalFrames: 0,
        message: suggestion ? `${baseMessage} ${suggestion}` : baseMessage,
      });
      trackEvent("export_failed", {
        format: settings.export.format,
        errorCode: code ?? "unknown",
        errorMessage: event.data.payload.message,
        durationMs: elapsedExportMs(),
        ...analyticsEnvironment,
      });
    },
    [
      settings.export.format,
      ui.exportPanel,
      analyticsEnvironment,
      support,
      setPreview,
    ],
  );

  useEffect(() => {
    return () => {
      exportRuntimeRef.current?.terminateExportWorker();
      exportRuntimeRef.current = null;
      previewBitmapRef.current?.close();
      previewBitmapRef.current = null;
    };
  }, []);

  // Mirror the latest progress into a ref so the abandonment listener can read
  // it without re-subscribing on every progress tick.
  useEffect(() => {
    exportProgressRef.current = exportProgress;
  }, [exportProgress]);

  // The desktop funnel loses ~1/3 of users mid-encode, and they currently vanish
  // silently (export_started fires, nothing follows). Recording a leave-during-
  // export event turns that black hole into a measurable stage-by-stage drop-off.
  useEffect(() => {
    if (!isExporting || typeof window === "undefined") {
      return;
    }
    const reportAbandon = () => {
      if (abandonFiredRef.current) {
        return;
      }
      abandonFiredRef.current = true;
      const progress = exportProgressRef.current;
      trackEvent("export_abandoned", {
        format: settings.export.format,
        stage: progress.stage,
        completedFrames: progress.completedFrames,
        totalFrames: progress.totalFrames,
        durationMs: elapsedExportMs(),
        ...analyticsEnvironment,
      });
    };
    window.addEventListener("pagehide", reportAbandon);
    window.addEventListener("beforeunload", reportAbandon);
    return () => {
      window.removeEventListener("pagehide", reportAbandon);
      window.removeEventListener("beforeunload", reportAbandon);
    };
  }, [isExporting, settings.export.format, analyticsEnvironment]);

  // When capability detection puts the selected format into a hard-error state,
  // the Export button is disabled and the user produces no funnel events at all.
  // Emit one diagnostic per distinct blocking code so this otherwise-invisible
  // "cannot export here" cohort shows up in analytics.
  useEffect(() => {
    if (exportAdvisory.severity !== "error" || !exportAdvisory.code) {
      lastUnsupportedCodeRef.current = null;
      return;
    }
    if (lastUnsupportedCodeRef.current === exportAdvisory.code) {
      return;
    }
    lastUnsupportedCodeRef.current = exportAdvisory.code;
    trackEvent("export_unsupported", {
      format: settings.export.format,
      reason: exportAdvisory.code,
      ...analyticsEnvironment,
    });
  }, [exportAdvisory.severity, exportAdvisory.code, settings.export.format, analyticsEnvironment]);

  const handleExport = async () => {
    // The Export button is disabled in this state, but guard anyway so a stray
    // call can never run into a guaranteed throw (and skew the failure rate).
    if (exportAdvisory.severity === "error") {
      return;
    }

    const totalFrames = Math.round(settings.timer.durationSeconds * settings.export.fps);
    exportTotalsRef.current = totalFrames;
    exportStartedAtRef.current = performance.now();
    abandonFiredRef.current = false;
    setPreview(null);
    setEtaMs(null);

    trackEvent("export_started", {
      format: settings.export.format,
      fps: settings.export.fps,
      durationSeconds: settings.timer.durationSeconds,
      resolution: settings.canvas.resolutionPresetId,
      ...analyticsEnvironment,
    });

    setIsExporting(true);

    if (settings.export.format === "webm") {
      setExportProgress({
        stage: "validating",
        completedFrames: 0,
        totalFrames,
        message: ui.exportPanel.runtimeMessages.preparingWebm,
      });

      try {
        const { exportWebmLocally } = await getExportRuntime().loadWebmExporter();
        const result = await exportWebmLocally(settings, {
          onProgress: (progress) => {
            setExportProgress(localizeProgressMessage(progress));
            setEtaMs(
              estimateRemainingMs(
                elapsedExportMs() ?? 0,
                progress.completedFrames,
                progress.totalFrames,
              ),
            );
          },
        });

        setIsExporting(false);
        setEtaMs(null);
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
        trackEvent("export_completed", {
          format: settings.export.format,
          fileName: result.fileName,
          durationMs: elapsedExportMs(),
          ...analyticsEnvironment,
        });
      } catch (error) {
        setIsExporting(false);
        setEtaMs(null);
        setExportProgress({
          stage: "error",
          completedFrames: 0,
          totalFrames: 0,
          message:
            error instanceof Error
              ? error.message
              : ui.exportPanel.runtimeMessages.webmFailedUnexpectedly,
        });
        // WebM runs on the main thread, so its failures never reach the worker
        // message handler. Reporting them here is what makes Safari/mobile codec
        // gaps visible instead of silently vanishing from the funnel.
        trackEvent("export_failed", {
          format: settings.export.format,
          errorCode: "webmFailedUnexpectedly",
          errorMessage: error instanceof Error ? error.message : undefined,
          durationMs: elapsedExportMs(),
          ...analyticsEnvironment,
        });
      }
      return;
    }

    const preparingMessage =
      settings.export.format === "png-sequence"
        ? ui.exportPanel.runtimeMessages.preparingPngSequence
        : ui.exportPanel.runtimeMessages.preparingAlphaVideo;

    setExportProgress({
      stage: "validating",
      completedFrames: 0,
      totalFrames,
      message: preparingMessage,
    });

    try {
      const exportWorker = getExportRuntime().getExportWorker();
      exportWorker.onmessage = handleExportWorkerMessage;
      if (settings.export.format === "png-sequence") {
        exportWorker.postMessage({
          kind: "export-png-sequence",
          payload: {
            settings,
            uploadedFont: uploadedFont ?? undefined,
          },
        });
        return;
      }
      const alphaTarget =
        settings.export.format === "webm-vp9-alpha" ? "webm-vp9" : "mov-hevc";
      exportWorker.postMessage({
        kind: "export-alpha-video",
        payload: {
          settings,
          target: alphaTarget,
          uploadedFont: uploadedFont ?? undefined,
        },
      });
    } catch (error) {
      setIsExporting(false);
      setEtaMs(null);
      setExportProgress({
        stage: "error",
        completedFrames: 0,
        totalFrames: 0,
        message: ui.exportPanel.runtimeMessages.exportWorkerUnavailable,
      });
      trackEvent("export_failed", {
        format: settings.export.format,
        errorCode: "exportWorkerUnavailable",
        errorMessage: error instanceof Error ? error.message : undefined,
        durationMs: elapsedExportMs(),
        ...analyticsEnvironment,
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
            <div className="order-2 xl:order-none [&>*]:h-full">
              <ControlPanel
                settings={settings}
                canvasPresets={GENERATOR_CANVAS_PRESETS}
                ui={ui.controlPanel}
                uploadedFontName={uploadedFont?.family ?? null}
                onDurationChange={handleDurationChange}
                onDisplayFormatChange={handleDisplayFormatChange}
                onResolutionPresetChange={handleResolutionPresetChange}
                onBackgroundModeChange={handleBackgroundModeChange}
                onFontFamilyChange={handleFontFamilyChange}
                onAnchorChange={handleAnchorChange}
                onTextColorChange={handleTextColorChange}
                onUploadFont={handleFontUpload}
                onClearUploadedFont={handleClearUploadedFont}
                onAudioVariantChange={handleAudioVariantChange}
              />
            </div>
            <div className="order-1 xl:order-none [&>*]:h-full">
              <PreviewPanel
                settings={deferredSettings}
                ui={ui.previewPanel}
                onToggleSafeArea={handleToggleSafeArea}
              />
            </div>
            <div className="order-3 xl:order-none [&>*]:h-full">
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
                etaMs={etaMs}
                previewBitmap={previewBitmap}
                isMobile={isMobileDevice}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
