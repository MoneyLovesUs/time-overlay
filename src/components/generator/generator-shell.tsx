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
import { TemplateGallery } from "@/components/generator/template-gallery";
import type { RootPageContent } from "@/content/root/types";
import {
  DEFAULT_EXPORT_PROGRESS_STATE,
  DEFAULT_GENERATOR_SETTINGS,
  GENERATOR_CANVAS_PRESETS,
  applyGeneratorTemplate,
  normalizeGeneratorSettings,
} from "@/lib/generator/defaults";
import {
  GENERATOR_TEMPLATES,
  getDefaultTemplateForPreset,
  getGeneratorTemplateById,
} from "@/lib/generator/templates";
import {
  createLazyExportRuntime,
  type LazyExportRuntime,
} from "@/lib/generator/export/runtime";
import { validateExportArtifact } from "@/lib/generator/export/artifact";
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
import {
  trackEvent,
  type AnalyticsEventPayload,
} from "@/lib/analytics/events";
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
  ResolutionPresetId,
  TemplateId,
  TimerDisplayFormat,
} from "@/lib/generator/types";
import type { ExportWorkerMessage } from "@/lib/generator/export/job";

type GeneratorShellProps = {
  hero: RootPageContent["generatorHero"];
  ui: RootPageContent["generatorUi"];
};

type CompletedExportArtifact = {
  blob: Blob;
  fileName: string;
  mimeType: string;
};

const WORKER_WATCHDOG_MS = 60_000;
const WORKER_PACKAGING_WATCHDOG_MS = 120_000;

function getExportErrorCode(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  if (
    error instanceof Error &&
    /chunk|dynamically imported module|failed to fetch/i.test(error.message)
  ) {
    return "webmChunkLoadFailed";
  }
  return fallback;
}

function createCodedError(code: string, message: string) {
  return Object.assign(new Error(message), { code });
}

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
  const [isTemplateCustomized, setIsTemplateCustomized] = useState(false);
  const deferredSettings = useDeferredValue(settings);
  const exportRuntimeRef = useRef<LazyExportRuntime | null>(null);
  const exportTotalsRef = useRef(0);
  const lastUnsupportedCodeRef = useRef<string | null>(null);
  const exportStartedAtRef = useRef<number | null>(null);
  const exportProgressRef = useRef<ExportProgressState>(exportProgress);
  const abandonFiredRef = useRef(false);
  const previewBitmapRef = useRef<ImageBitmap | null>(null);
  const activeExportIdRef = useRef(0);
  const activeExportSettingsRef = useRef<GeneratorSettings | null>(null);
  const activeExportTelemetryRef = useRef<AnalyticsEventPayload>({});
  const activeExportKindRef = useRef<"finalizing" | "webm" | "worker" | null>(
    null,
  );
  const isExportingRef = useRef(false);
  const webmAbortControllerRef = useRef<AbortController | null>(null);
  const workerWatchdogRef = useRef<number | null>(null);

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
  const clientEnvironment = useMemo(() => detectClientEnvironment(), []);
  const isMobileDevice = clientEnvironment.deviceType !== "desktop";
  const exportAdvisory = useMemo(
    () => getExportAdvisory(settings, support, clientEnvironment.deviceType),
    [settings, support, clientEnvironment.deviceType],
  );
  // Stable context attached to every export funnel event. Without browser/device
  // and capability flags, export_failed is a black box — we cannot tell a Safari
  // codec gap from a low-memory crash, or a mobile drop-off from a desktop one.
  const analyticsEnvironment = useMemo<Record<string, string | number | boolean>>(() => {
    return {
      browser: clientEnvironment.browser,
      browserVersion: clientEnvironment.browserVersion,
      os: clientEnvironment.os,
      deviceType: clientEnvironment.deviceType,
      supportsWebm: support.supportsWebm ?? "unknown",
      supportsWebmAudio: support.supportsWebmAudio ?? "unknown",
      supportsVp9Alpha: support.supportsVp9Alpha ?? "unknown",
      supportsHevcAlpha: support.supportsHevcAlpha ?? "unknown",
      hasWorkerSupport: support.hasWorkerSupport ?? "unknown",
    };
  }, [support, clientEnvironment]);
  const activeTemplate = useMemo(
    () => getGeneratorTemplateById(settings.templateId),
    [settings.templateId],
  );
  const templateGalleryCopy = ui.templateGallery;
  const templateAnalytics = useMemo<
    Record<string, string | number | boolean>
  >(
    () => ({
      templateId: activeTemplate.id,
      templateCategory: activeTemplate.category,
      templateTier: activeTemplate.tier,
      templateOrientation: activeTemplate.orientation,
      templateRecommendedFormat: activeTemplate.recommendedFormat,
      templateCustomized: isTemplateCustomized,
    }),
    [activeTemplate, isTemplateCustomized],
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
        message: `${progress.completedFrames}/${progress.totalFrames}`,
      };
    }

    return progress;
  };

  const updateSettings = (
    updater: (current: GeneratorSettings) => GeneratorSettings,
    markTemplateCustomized = false,
  ) => {
    if (markTemplateCustomized) {
      setIsTemplateCustomized(true);
    }
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
    const templateParam = params.get("template");
    if (templateParam) {
      const template = GENERATOR_TEMPLATES.find(
        (item) => item.id === templateParam,
      );
      if (template) {
        setSettings((current) => applyGeneratorTemplate(current, template.id));
        setIsTemplateCustomized(false);
        return;
      }
    }

    const presetParam = params.get("preset");
    if (!presetParam) {
      return;
    }
    const template = getDefaultTemplateForPreset(presetParam);
    if (template.themePresetId === presetParam) {
      setSettings((current) => applyGeneratorTemplate(current, template.id));
      setIsTemplateCustomized(false);
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
    updateSettings(
      (current) => ({
        ...current,
        timer: {
          ...current.timer,
          displayFormat,
        },
      }),
      true,
    );
  };

  const handleResolutionPresetChange = (resolutionPresetId: ResolutionPresetId) => {
    updateSettings(
      (current) => ({
        ...current,
        canvas: {
          ...current.canvas,
          resolutionPresetId,
        },
      }),
      true,
    );
  };

  const handleBackgroundModeChange = (backgroundMode: BackgroundMode) => {
    updateSettings(
      (current) => ({
        ...current,
        canvas: {
          ...current.canvas,
          backgroundMode,
        },
      }),
      true,
    );
  };

  const handleFontFamilyChange = (fontFamily: FontFamilyPreset) => {
    updateSettings(
      (current) => ({
        ...current,
        textStyle: {
          ...current.textStyle,
          fontFamily,
        },
      }),
      true,
    );
  };

  const handleAnchorChange = (anchor: PlacementAnchor) => {
    updateSettings(
      (current) => ({
        ...current,
        placement: {
          ...current.placement,
          anchor,
        },
      }),
      true,
    );
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
    updateSettings(
      (current) => ({
        ...current,
        audio: {
          ...current.audio,
          variant,
        },
      }),
      true,
    );
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

  const handleTemplateChange = (templateId: TemplateId) => {
    const template = getGeneratorTemplateById(templateId);

    trackEvent("template_selected", {
      templateId: template.id,
      templateCategory: template.category,
      templateTier: template.tier,
      templateOrientation: template.orientation,
      recommendedFormat: template.recommendedFormat,
      previousTemplateId: settings.templateId,
      previousTemplateCustomized: isTemplateCustomized,
    });

    startTransition(() => {
      setSettings((current) => applyGeneratorTemplate(current, template.id));
      setIsTemplateCustomized(false);
    });
  };

  const handleTextColorChange = (textColor: string) => {
    updateSettings(
      (current) => ({
        ...current,
        textStyle: {
          ...current.textStyle,
          textColor,
        },
      }),
      true,
    );
  };

  const handleFontUpload = async (file: File) => {
    try {
      const font = await readFontFile(file);
      await loadFontIntoDocument(font);
      setUploadedFont(font);
      updateSettings(
        (current) => ({
          ...current,
          textStyle: {
            ...current.textStyle,
            customFontFamily: font.family,
          },
        }),
        true,
      );
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
    updateSettings(
      (current) => ({
        ...current,
        textStyle: {
          ...current.textStyle,
          customFontFamily: undefined,
        },
      }),
      true,
    );
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

  const clearWorkerWatchdog = useCallback(() => {
    if (workerWatchdogRef.current !== null) {
      window.clearTimeout(workerWatchdogRef.current);
      workerWatchdogRef.current = null;
    }
  }, []);

  const finishExportFailure = useCallback(
    (
      exportId: number,
      code: string,
      message: string,
      terminateWorker = false,
    ) => {
      if (
        activeExportIdRef.current !== exportId ||
        !isExportingRef.current
      ) {
        return;
      }

      const elapsedMs = elapsedExportMs();
      const telemetry = activeExportTelemetryRef.current;
      const progress = exportProgressRef.current;

      clearWorkerWatchdog();
      if (terminateWorker) {
        exportRuntimeRef.current?.terminateExportWorker();
      }
      webmAbortControllerRef.current = null;
      activeExportKindRef.current = null;
      activeExportSettingsRef.current = null;
      isExportingRef.current = false;
      abandonFiredRef.current = true;
      setIsExporting(false);
      setPreview(null);
      setEtaMs(null);
      setExportProgress({
        stage: "error",
        completedFrames: progress.completedFrames,
        totalFrames: progress.totalFrames,
        message,
      });

      if (code === "exportCancelled") {
        trackEvent("export_cancelled", {
          ...telemetry,
          stage: progress.stage,
          completedFrames: progress.completedFrames,
          totalFrames: progress.totalFrames,
          durationMs: elapsedMs,
        });
      } else {
        trackEvent("export_failed", {
          ...telemetry,
          errorCode: code,
          errorMessage: message,
          stage: progress.stage,
          completedFrames: progress.completedFrames,
          totalFrames: progress.totalFrames,
          durationMs: elapsedMs,
        });
      }
      exportStartedAtRef.current = null;
    },
    [clearWorkerWatchdog, setPreview],
  );

  const finalizeCompletedExport = useCallback(
    async (exportId: number, artifact: CompletedExportArtifact) => {
      if (
        activeExportIdRef.current !== exportId ||
        !isExportingRef.current
      ) {
        return;
      }

      clearWorkerWatchdog();
      if (activeExportKindRef.current === "worker") {
        // Release OffscreenCanvas, encoder, and ZIP memory before validating the
        // artifact or asking the browser to download it.
        exportRuntimeRef.current?.terminateExportWorker();
      }
      activeExportKindRef.current = "finalizing";
      setEtaMs(null);
      const validatingProgress: ExportProgressState = {
        stage: "packaging",
        completedFrames: exportTotalsRef.current,
        totalFrames: exportTotalsRef.current,
        message: "Validating generated file",
      };
      exportProgressRef.current = validatingProgress;
      setExportProgress(validatingProgress);

      try {
        await validateExportArtifact(
          artifact.blob,
          artifact.mimeType,
          artifact.fileName,
        );
      } catch (error) {
        finishExportFailure(
          exportId,
          getExportErrorCode(error, "outputValidationFailed"),
          error instanceof Error
            ? error.message
            : "The generated file could not be validated. Please retry.",
        );
        return;
      }

      if (
        activeExportIdRef.current !== exportId ||
        !isExportingRef.current
      ) {
        return;
      }

      const durationMs = elapsedExportMs();
      const outputTelemetry: AnalyticsEventPayload = {
        ...activeExportTelemetryRef.current,
        fileName: artifact.fileName,
        mimeType: artifact.mimeType,
        blobSize: artifact.blob.size,
        durationMs,
      };
      trackEvent("export_generated", outputTelemetry);

      try {
        downloadBlob(artifact.blob, artifact.fileName);
      } catch (error) {
        finishExportFailure(
          exportId,
          "downloadRequestFailed",
          error instanceof Error
            ? error.message
            : "The browser could not start the download. Please retry.",
        );
        return;
      }

      trackEvent("export_download_requested", outputTelemetry);
      trackEvent("export_completed", outputTelemetry);
      isExportingRef.current = false;
      activeExportKindRef.current = null;
      activeExportSettingsRef.current = null;
      activeExportTelemetryRef.current = {};
      webmAbortControllerRef.current = null;
      abandonFiredRef.current = true;
      exportStartedAtRef.current = null;
      setIsExporting(false);
      setPreview(null);
      setEtaMs(null);
      setExportProgress({
        stage: "complete",
        completedFrames: exportTotalsRef.current,
        totalFrames: exportTotalsRef.current,
        message: formatTemplate(
          ui.exportPanel.runtimeMessages.exportReadyTemplate,
          { fileName: artifact.fileName },
        ),
      });
    },
    [clearWorkerWatchdog, finishExportFailure, setPreview, ui.exportPanel],
  );

  const armWorkerWatchdog = useCallback(
    (exportId: number, timeoutMs = WORKER_WATCHDOG_MS) => {
      clearWorkerWatchdog();
      const check = () => {
        if (
          activeExportIdRef.current !== exportId ||
          !isExportingRef.current ||
          activeExportKindRef.current !== "worker"
        ) {
          return;
        }
        if (document.visibilityState === "hidden") {
          workerWatchdogRef.current = window.setTimeout(check, 15_000);
          return;
        }
        finishExportFailure(
          exportId,
          "exportWorkerStalled",
          "The export stopped responding. It has been reset; reduce the duration or resolution and retry.",
          true,
        );
      };
      workerWatchdogRef.current = window.setTimeout(check, timeoutMs);
    },
    [clearWorkerWatchdog, finishExportFailure],
  );

  const handleExportWorkerMessage = useCallback(
    (event: MessageEvent<ExportWorkerMessage>, exportId: number) => {
      if (
        activeExportIdRef.current !== exportId ||
        !isExportingRef.current
      ) {
        if (event.data.kind === "preview") {
          event.data.payload.bitmap.close();
        }
        return;
      }

      if (event.data.kind === "progress") {
        const payload = event.data.payload;
        armWorkerWatchdog(
          exportId,
          payload.stage === "packaging"
            ? WORKER_PACKAGING_WATCHDOG_MS
            : WORKER_WATCHDOG_MS,
        );
        const localizedProgress = localizeProgressMessage(payload);
        exportProgressRef.current = localizedProgress;
        setExportProgress(localizedProgress);
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
        armWorkerWatchdog(exportId);
        setPreview(event.data.payload.bitmap);
        return;
      }

      if (event.data.kind === "complete") {
        void finalizeCompletedExport(exportId, event.data.payload);
        return;
      }

      const code = event.data.payload.code;
      const fallback =
        code === "alphaVideoFailedUnexpectedly"
          ? ui.exportPanel.runtimeMessages.alphaVideoFailedUnexpectedly
          : ui.exportPanel.runtimeMessages.pngSequenceFailedUnexpectedly;
      const baseMessage = event.data.payload.message ?? fallback;
      const activeSettings = activeExportSettingsRef.current;
      const suggestedLabel =
        activeSettings?.export.format !== "png-sequence" &&
        support.supportsPngSequence
          ? ui.exportPanel.pngSequenceLabel
          : activeSettings?.export.format === "png-sequence" &&
              support.supportsWebm
            ? ui.exportPanel.webmLabel
            : null;
      const suggestionTemplate =
        ui.exportPanel.progress?.fallbackSuggestionTemplate ??
        "Tip: try {format} instead.";
      const suggestion = suggestedLabel
        ? suggestionTemplate.replace("{format}", suggestedLabel)
        : null;
      finishExportFailure(
        exportId,
        code ?? "unknown",
        suggestion ? `${baseMessage} ${suggestion}` : baseMessage,
        true,
      );
    },
    [
      armWorkerWatchdog,
      finalizeCompletedExport,
      finishExportFailure,
      setPreview,
      support,
      ui.exportPanel,
    ],
  );

  useEffect(() => {
    return () => {
      webmAbortControllerRef.current?.abort(
        createCodedError("exportCancelled", "Export cancelled."),
      );
      clearWorkerWatchdog();
      exportRuntimeRef.current?.terminateExportWorker();
      exportRuntimeRef.current = null;
      previewBitmapRef.current?.close();
      previewBitmapRef.current = null;
    };
  }, [clearWorkerWatchdog]);

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
        ...activeExportTelemetryRef.current,
        stage: progress.stage,
        completedFrames: progress.completedFrames,
        totalFrames: progress.totalFrames,
        durationMs: elapsedExportMs(),
      });
    };
    window.addEventListener("pagehide", reportAbandon);
    window.addEventListener("beforeunload", reportAbandon);
    return () => {
      window.removeEventListener("pagehide", reportAbandon);
      window.removeEventListener("beforeunload", reportAbandon);
    };
  }, [isExporting]);

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
      ...templateAnalytics,
      ...analyticsEnvironment,
    });
  }, [
    exportAdvisory.severity,
    exportAdvisory.code,
    settings.export.format,
    templateAnalytics,
    analyticsEnvironment,
  ]);

  const handleCancelExport = useCallback(() => {
    if (!isExportingRef.current) {
      return;
    }
    const exportId = activeExportIdRef.current;
    const cancellation = createCodedError(
      "exportCancelled",
      "Export cancelled.",
    );
    webmAbortControllerRef.current?.abort(cancellation);
    finishExportFailure(
      exportId,
      "exportCancelled",
      cancellation.message,
      activeExportKindRef.current === "worker",
    );
  }, [finishExportFailure]);

  const handleExport = async () => {
    // A synchronous ref closes the tiny gap before React commits disabled=true,
    // so a double click cannot start two jobs against the same worker.
    if (isExportingRef.current || exportAdvisory.severity === "error") {
      return;
    }

    const exportId = activeExportIdRef.current + 1;
    activeExportIdRef.current = exportId;
    const exportSettings = settings;
    const totalFrames = Math.max(
      1,
      Math.round(
        exportSettings.timer.durationSeconds * exportSettings.export.fps,
      ),
    );
    const pixelFrames =
      exportSettings.canvas.width *
      exportSettings.canvas.height *
      totalFrames;
    const telemetry: AnalyticsEventPayload = {
      format: exportSettings.export.format,
      fps: exportSettings.export.fps,
      durationSeconds: exportSettings.timer.durationSeconds,
      resolution: exportSettings.canvas.resolutionPresetId,
      width: exportSettings.canvas.width,
      height: exportSettings.canvas.height,
      pixelFrames,
      quality: exportSettings.export.quality,
      audioVariant: exportSettings.audio.variant,
      ...templateAnalytics,
      ...analyticsEnvironment,
    };

    exportTotalsRef.current = totalFrames;
    exportStartedAtRef.current = performance.now();
    activeExportSettingsRef.current = exportSettings;
    activeExportTelemetryRef.current = telemetry;
    abandonFiredRef.current = false;
    isExportingRef.current = true;
    setPreview(null);
    setEtaMs(null);
    setIsExporting(true);
    trackEvent("export_started", telemetry);

    if (exportSettings.export.format === "webm") {
      activeExportKindRef.current = "webm";
      const initialProgress: ExportProgressState = {
        stage: "validating",
        completedFrames: 0,
        totalFrames,
        message: ui.exportPanel.runtimeMessages.preparingWebm,
      };
      exportProgressRef.current = initialProgress;
      setExportProgress(initialProgress);
      const controller = new AbortController();
      webmAbortControllerRef.current = controller;

      try {
        const { exportWebmLocally } =
          await getExportRuntime().loadWebmExporter();
        if (controller.signal.aborted) {
          throw controller.signal.reason;
        }
        const result = await exportWebmLocally(exportSettings, {
          signal: controller.signal,
          onProgress: (progress) => {
            if (
              activeExportIdRef.current !== exportId ||
              !isExportingRef.current
            ) {
              return;
            }
            const localizedProgress = localizeProgressMessage(progress);
            exportProgressRef.current = localizedProgress;
            setExportProgress(localizedProgress);
            setEtaMs(
              estimateRemainingMs(
                elapsedExportMs() ?? 0,
                progress.completedFrames,
                progress.totalFrames,
              ),
            );
          },
        });
        await finalizeCompletedExport(exportId, result);
      } catch (error) {
        const code = getExportErrorCode(error, "webmFailedUnexpectedly");
        finishExportFailure(
          exportId,
          code,
          error instanceof Error
            ? error.message
            : ui.exportPanel.runtimeMessages.webmFailedUnexpectedly,
        );
      }
      return;
    }

    activeExportKindRef.current = "worker";
    const preparingMessage =
      exportSettings.export.format === "png-sequence"
        ? ui.exportPanel.runtimeMessages.preparingPngSequence
        : ui.exportPanel.runtimeMessages.preparingAlphaVideo;
    const initialProgress: ExportProgressState = {
      stage: "validating",
      completedFrames: 0,
      totalFrames,
      message: preparingMessage,
    };
    exportProgressRef.current = initialProgress;
    setExportProgress(initialProgress);

    try {
      const exportWorker = getExportRuntime().getExportWorker();
      exportWorker.onmessage = (event) =>
        handleExportWorkerMessage(event, exportId);
      exportWorker.onerror = (event) => {
        event.preventDefault();
        finishExportFailure(
          exportId,
          "exportWorkerCrashed",
          event.message ||
            "The export worker crashed. It has been reset; reduce the job size and retry.",
          true,
        );
      };
      exportWorker.onmessageerror = () => {
        finishExportFailure(
          exportId,
          "exportWorkerMessageUnreadable",
          "The browser could not read the export result. The worker has been reset; please retry.",
          true,
        );
      };
      armWorkerWatchdog(exportId);

      const enablePreview = !isMobileDevice && pixelFrames < 4_000_000_000;
      if (exportSettings.export.format === "png-sequence") {
        exportWorker.postMessage({
          kind: "export-png-sequence",
          payload: {
            settings: exportSettings,
            uploadedFont: uploadedFont ?? undefined,
            enablePreview,
          },
        });
        return;
      }
      const alphaTarget =
        exportSettings.export.format === "webm-vp9-alpha"
          ? "webm-vp9"
          : "mov-hevc";
      exportWorker.postMessage({
        kind: "export-alpha-video",
        payload: {
          settings: exportSettings,
          target: alphaTarget,
          uploadedFont: uploadedFont ?? undefined,
          enablePreview,
        },
      });
    } catch (error) {
      finishExportFailure(
        exportId,
        "exportWorkerUnavailable",
        error instanceof Error
          ? error.message
          : ui.exportPanel.runtimeMessages.exportWorkerUnavailable,
        true,
      );
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

          <TemplateGallery
            templates={GENERATOR_TEMPLATES}
            activeTemplateId={settings.templateId}
            isCustomized={isTemplateCustomized}
            copy={templateGalleryCopy}
            onSelectTemplate={handleTemplateChange}
            onGalleryOpened={() =>
              trackEvent("template_gallery_opened", {
                activeTemplateId: settings.templateId,
                templateCustomized: isTemplateCustomized,
              })
            }
            onFilterChanged={(filter) =>
              trackEvent("template_filter_changed", { filter })
            }
          />

          <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_18rem]">
            <div className="xl:col-start-2 xl:row-start-1 [&>*]:h-full">
              <PreviewPanel
                settings={deferredSettings}
                ui={ui.previewPanel}
                onToggleSafeArea={handleToggleSafeArea}
              />
            </div>
            <div className="xl:col-start-1 xl:row-start-1 [&>*]:h-full">
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
            <div className="xl:col-start-3 xl:row-start-1 [&>*]:h-full">
              <ExportPanel
                advisory={exportAdvisory}
                exportProgress={exportProgress}
                isExporting={isExporting}
                onExport={handleExport}
                onCancel={handleCancelExport}
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
