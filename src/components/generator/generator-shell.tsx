"use client";

import { quoteAnalytics } from "@/lib/pro/regional-pricing";

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
import { LiveLinkDialog } from "@/components/generator/live-link-dialog";
import { PreviewPanel } from "@/components/generator/preview-panel";
import {
  ProPaywallModal,
  resolveGeneratorCheckoutContext,
} from "@/components/generator/pro-paywall-modal";
import { TemplateGallery } from "@/components/generator/template-gallery";
import type { RootPageContent } from "@/content/root/types";
import { getProGateCopy } from "@/content/pro-gate";
import {
  DEFAULT_EXPORT_PROGRESS_STATE,
  DEFAULT_GENERATOR_SETTINGS,
  GENERATOR_CANVAS_PRESETS,
  getProExportBlockReason,
  getProFallbackReasons,
  getProFeatureUsage,
  applyGeneratorTemplate,
  normalizeGeneratorSettings,
  resolveDefaultExportFormat,
  type ProFallbackReason,
} from "@/lib/generator/defaults";
import {
  GENERATOR_TEMPLATES,
  getDefaultTemplateForPreset,
  getGeneratorTemplateById,
} from "@/lib/generator/templates";
import {
  GENERATOR_DURATION_LIMIT_SECONDS,
} from "@/lib/generator/defaults";
import {
  resolveDurationLimitState,
  type DurationLimitState,
} from "@/lib/generator/duration-limit";
import { PRO_MAX_DURATION_SECONDS, isProFormat, isProResolution } from "@/lib/pro/entitlements";
import {
  restorePro,
  setProUpsellSource,
  startProCheckout,
  upsellSourcePayload,
  usePro,
} from "@/lib/pro/client";
import {
  createLazyExportRuntime,
  type LazyExportRuntime,
} from "@/lib/generator/export/runtime";
import { validateExportArtifact } from "@/lib/generator/export/artifact";
import { downloadBlob } from "@/lib/generator/export/png-sequence";
import { holdScreenWakeLock } from "@/lib/generator/export/wake-lock";
import { estimateRemainingMs } from "@/lib/generator/export/progress";
import { buildExportFunnelTelemetry } from "@/lib/generator/export/telemetry";
import {
  collectPngRecoveryOffers,
  createPngJobDirectory,
  cleanPngOpfsJob,
  pickPngDirectory,
  queryPngDirectoryPermission,
  readOpfsPngPart,
  readPngFontBackup,
  removePngRecoveryRecord,
  requestPngDirectoryPermission,
  supportsPngDirectoryPicker,
  tryAcquirePngJobLock,
  type PngJobLock,
  type PngRecoveryOffer,
} from "@/lib/generator/export/png-client";
import {
  deletePngCheckpoint,
  isPngCheckpointStoreAvailable,
  listPngCheckpoints,
} from "@/lib/generator/export/png-checkpoint";
import {
  isPngWorkerResponse,
  PNG_RENDERER_VERSION,
  type PngErrorCode,
  type PngOutputMode,
  type PngPartDescriptor,
  type PngPreflightResult,
  type PngStartPayload,
  type PngWorkerResponse,
} from "@/lib/generator/export/png-contract";
import {
  formatPngBytes,
  getPngPlatformAdvice,
  isPngLongExport,
  PNG_MEMORY_BUDGET_BYTES,
  type PngPlatformAdvice,
} from "@/lib/generator/export/png-limits";
import { readLatestPngManifest } from "@/lib/generator/export/png-manifest";
import { ensurePreviewFontsLoaded } from "@/lib/generator/export/font-assets";
import {
  claimPngStart,
  createPngStartGuard,
} from "@/lib/generator/export/png-start-guard";
import { sha256Hex } from "@/lib/generator/export/png-zip";
import {
  PngPrepareDialog,
  PngRecoveryCard,
  PngResultCard,
  PngRunCard,
  type PngResultView,
} from "@/components/generator/png-export-view";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
  getLocalExportSupport,
  probeAlphaExportSupport,
  probeMp4ExportSupport,
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
import type { ProTrigger, ProUpsellSource } from "@/lib/pro/entitlements";
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

type PngPrepState = {
  jobId: string;
  attemptId: string;
  settings: GeneratorSettings;
  uploadedFont: UploadedFont | null;
  totalFrames: number;
  preflight: PngPreflightResult | null;
  advice: PngPlatformAdvice | null;
  isLongJob: boolean;
  canDirectory: boolean;
  opfsWritable: boolean;
  checkpointAvailable: boolean;
  lockAvailable: boolean;
  memoryAllowed: boolean;
  autoDownload: boolean;
  error: string | null;
};

type PngRunState = {
  jobId: string;
  attemptId: string;
  outputMode: PngOutputMode;
  settings: GeneratorSettings;
  totalFrames: number;
  parts: PngPartDescriptor[];
  processedFrames: number;
  committedFrames: number;
  currentPart: number;
  bytesWritten: number;
  stage: string;
  cancelling: boolean;
  autoDownload: boolean;
  resumed: boolean;
};

type PngResultState = PngResultView & {
  blob?: Blob;
  cleanupAvailable: boolean;
  downloadError: string | null;
};

type PngRecoveryView = PngRecoveryOffer & {
  needsFont: boolean;
  needsPermission: boolean;
  error: string | null;
};

const WORKER_WATCHDOG_MS = 60_000;
const WORKER_PACKAGING_WATCHDOG_MS = 120_000;
const PNG_WATCHDOG_MS = 120_000;
const PNG_PREFLIGHT_WATCHDOG_MS = 180_000;
const PNG_CANCEL_GRACE_MS = 5_000;
const DEFAULT_PNG_GENERIC_ERROR =
  "The PNG export failed unexpectedly. Your completed ZIP parts, if any, are kept below.";

// MP4 copy lands with the export-panel button (task 3); until then the
// pipeline uses the same English fallbacks as the other runtime messages.
const DEFAULT_PREPARING_MP4_MESSAGE = "Preparing local MP4 export";
const DEFAULT_MP4_FAILED_MESSAGE = "MP4 export failed unexpectedly.";
const DEFAULT_MP4_STORAGE_UNAVAILABLE_MESSAGE =
  "This browser blocked the local storage that long MP4 exports need (private browsing can do this). Use a regular browser window, or keep the timer to 5 minutes or less.";
const DEFAULT_MP4_STORAGE_FULL_MESSAGE =
  "Not enough free storage on this device for this export. Free up some space, or shorten the timer or lower the quality.";
const DEFAULT_PRO_DURATION_HINT =
  "That is past the free 5-minute limit. Pro unlocks durations up to 60 minutes.";
const DEFAULT_PRO_ENABLED_LABEL = "Pro enabled";
const DEFAULT_PRO_BADGE_LABEL = "Pro";

// One upsell-exposure event per session (spec 6.2): reopening the paywall in
// the same page session must not inflate pro_upsell_viewed counts.
let proUpsellExposureReported = false;
// Auto-open the duration paywall at most once per page session; after that the
// inline CTA under the duration input is the only way back in.
let durationPaywallAutoOpened = false;

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
  const { status: proStatus } = usePro();
  const isPro = proStatus === "pro";
  const [paywallTrigger, setPaywallTrigger] = useState<ProTrigger | null>(
    null,
  );
  const [durationLimitHitSeconds, setDurationLimitHitSeconds] = useState<
    number | null
  >(null);
  // Whether the last requested duration was above the free cap, so
  // duration_limit_hit fires on the crossing instead of every keystroke.
  const durationLimitStateRef = useRef<DurationLimitState>({
    aboveLimit: false,
  });
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
  const [liveLinkOpen, setLiveLinkOpen] = useState(false);
  // Set when a free session loses a Pro-only canvas or format to the fallback,
  // so the downgrade is visible instead of silent.
  const [proFallbackReasons, setProFallbackReasons] = useState<
    ProFallbackReason[]
  >([]);
  // Set on the first manual format pick; the mp4 auto-default must never
  // override a choice the user made themselves.
  const hasUserSelectedFormatRef = useRef(false);
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
  const activeExportKindRef = useRef<
    "finalizing" | "webm" | "worker" | "png" | null
  >(null);
  const isExportingRef = useRef(false);
  const releaseWakeLockRef = useRef<(() => void) | null>(null);
  const webmAbortControllerRef = useRef<AbortController | null>(null);
  const workerWatchdogRef = useRef<number | null>(null);
  const pngPrepRef = useRef<PngPrepState | null>(null);
  const pngRunRef = useRef<PngRunState | null>(null);
  const pngJobLockRef = useRef<PngJobLock | null>(null);
  const pngStartGuardRef = useRef(createPngStartGuard());
  const pngCancelTimerRef = useRef<number | null>(null);
  const pngWatchdogRef = useRef<number | null>(null);
  const pngProgressSignatureRef = useRef<string | null>(null);
  const pngRecoveryFontOfferRef = useRef<PngRecoveryView | null>(null);
  const pngFontInputRef = useRef<HTMLInputElement | null>(null);
  const [pngPrep, setPngPrep] = useState<PngPrepState | null>(null);
  const [pngRun, setPngRun] = useState<PngRunState | null>(null);
  const [pngResult, setPngResult] = useState<PngResultState | null>(null);
  const [pngRecoveries, setPngRecoveries] = useState<PngRecoveryView[]>([]);
  const [pngRecoveryBusy, setPngRecoveryBusy] = useState(false);
  const [pngRecoveryFonts, setPngRecoveryFonts] = useState<
    Record<string, UploadedFont>
  >({});
  const [pngImportError, setPngImportError] = useState<string | null>(null);

  // Preview ownership is a three-state protocol: committed (state holds it),
  // drawn (React's effect actually painted it), and retired (no longer the
  // rendered bitmap). A retired bitmap is closed only after the replacement has
  // been drawn, or after the surface has committed an empty state. There is no
  // timer: a suspended tab cannot outlive a drawable bitmap, and StrictMode's
  // repeated setup still sees a live image. PNG acknowledgements are sent after
  // the draw, so the worker holds at most one outstanding preview.
  const consumedPreviewRef = useRef(new WeakSet<ImageBitmap>());
  const retiredPreviewsRef = useRef<ImageBitmap[]>([]);
  const pngPendingPreviewRef = useRef<{
    bitmap: ImageBitmap;
    jobId: string;
    attemptId: string;
  } | null>(null);

  const closeRetiredPreviews = useCallback(() => {
    for (const bitmap of retiredPreviewsRef.current) {
      bitmap.close();
    }
    retiredPreviewsRef.current = [];
  }, []);

  const setPreview = useCallback((next: ImageBitmap | null) => {
    const previous = previewBitmapRef.current;
    if (previous && previous !== next) {
      retiredPreviewsRef.current.push(previous);
    }
    previewBitmapRef.current = next;
    setPreviewBitmap(next);
  }, []);

  const handlePreviewDrawn = useCallback(
    (bitmap: ImageBitmap) => {
      consumedPreviewRef.current.add(bitmap);
      // Everything retired before this draw belongs to older commits; React has
      // already run their effects (or dropped them) before committing this one.
      closeRetiredPreviews();
      const pending = pngPendingPreviewRef.current;
      if (pending?.bitmap === bitmap) {
        pngPendingPreviewRef.current = null;
        exportRuntimeRef.current?.getExportWorker().postMessage({
          kind: "png-preview-ack",
          jobId: pending.jobId,
          attemptId: pending.attemptId,
        });
      }
    },
    [closeRetiredPreviews],
  );

  const handlePreviewCleared = useCallback(() => {
    // The canvas is gone, so no pending effect can still draw these bitmaps.
    closeRetiredPreviews();
  }, [closeRetiredPreviews]);

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
  const pngCopy = ui.exportPanel.png;
  const clientEnvironment = useMemo(() => detectClientEnvironment(), []);
  const isMobileDevice = clientEnvironment.deviceType !== "desktop";
  const exportAdvisory = useMemo(
    () => getExportAdvisory(settings, support, clientEnvironment.deviceType),
    [settings, support, clientEnvironment.deviceType],
  );
  const liveLinkLocale = useMemo(
    () =>
      typeof window === "undefined"
        ? "en"
        : resolveGeneratorCheckoutContext(window.location.pathname, "").locale,
    [],
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
      supportsMp4: support.supportsMp4 ?? "unknown",
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
    // The fallback notice describes a downgrade that already happened; the next
    // edit supersedes it.
    setProFallbackReasons([]);
    startTransition(() => {
      setSettings((current) =>
        normalizeGeneratorSettings(updater(current), { isPro }),
      );
    });
  };

  const openPaywall = useCallback(
    (trigger: ProTrigger, source: ProUpsellSource = "inline") => {
      setPaywallTrigger(trigger);
      // Quote/checkout events inherit this source so an auto-popped paywall and
      // a self-served one can be told apart later.
      setProUpsellSource(source);
      if (!proUpsellExposureReported) {
        proUpsellExposureReported = true;
        trackEvent("pro_upsell_viewed", { trigger, source });
      }
    },
    [],
  );

  useEffect(
    () => () => {
      releaseWakeLockRef.current?.();
    },
    [],
  );

  // Re-clamp settings when the Pro entitlement resolves or is revoked, so a
  // Pro user's >300s duration survives the initial "unknown" paint and a
  // revoked token drops back under the free cap. A free session that arrives
  // holding a Pro-only canvas or alpha format gets a short notice rather than
  // a silent downgrade.
  useEffect(() => {
    // Read the reasons before the updater runs: a state updater must stay pure,
    // and the notice has to describe what the normalize call is about to drop.
    if (!isPro) {
      const reasons = getProFallbackReasons(settings);
      if (reasons.length) {
        setProFallbackReasons(reasons);
      }
    }
    setSettings((current) => normalizeGeneratorSettings(current, { isPro }));
    // Only the entitlement transition should re-clamp; settings changes are
    // already normalized by updateSettings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPro]);

  useEffect(() => {
    // The preview canvas resolves the same pinned families the export worker
    // loads before rendering, so what the user sees matches the exported PNG.
    void ensurePreviewFontsLoaded().catch(() => undefined);
  }, []);

  useEffect(() => {
    setSupport(getLocalExportSupport());
    probeAlphaExportSupport().then(({ supportsVp9Alpha, supportsHevcAlpha }) => {
      setSupport((prev) => ({
        ...prev,
        supportsVp9Alpha,
        supportsHevcAlpha,
      }));
    });
    probeMp4ExportSupport().then((supportsMp4) => {
      setSupport((prev) => ({
        ...prev,
        supportsMp4,
      }));
    });
  }, []);

  // Deep links (?template= / ?preset=) apply once the entitlement is known.
  // Applying them while the status is still "unknown" would normalize a Pro-only
  // 4K template canvas down to 1080p before the stored token is read.
  const deepLinkAppliedRef = useRef(false);
  useEffect(() => {
    if (proStatus === "unknown" || deepLinkAppliedRef.current) {
      return;
    }
    deepLinkAppliedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get("template");
    if (templateParam) {
      const template = GENERATOR_TEMPLATES.find(
        (item) => item.id === templateParam,
      );
      if (template) {
        setSettings((current) =>
          applyGeneratorTemplate(current, template.id, { isPro }),
        );
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
      setSettings((current) =>
        applyGeneratorTemplate(current, template.id, { isPro }),
      );
      setIsTemplateCustomized(false);
    }
  }, [isPro, proStatus]);

  // Once the async mp4 capability probe lands, phones that support it switch
  // their default format to mp4 — unless the user already picked a format.
  useEffect(() => {
    if (support.supportsMp4 === undefined || support.supportsMp4 === null) {
      return;
    }
    const defaultFormat = resolveDefaultExportFormat({
      deviceType: clientEnvironment.deviceType,
      supportsMp4: support.supportsMp4,
      hasUserSelectedFormat: hasUserSelectedFormatRef.current,
    });
    setSettings((current) =>
      current.export.format === defaultFormat
        ? current
        : {
            ...current,
            export: { ...current.export, format: defaultFormat },
          },
    );
  }, [clientEnvironment.deviceType, support.supportsMp4]);

  const getExportRuntime = () => {
    exportRuntimeRef.current ??= createLazyExportRuntime();
    return exportRuntimeRef.current;
  };

  // Most free users who hit the duration cap never clicked the small inline
  // CTA, so surface the paywall once they finish editing the field. Phones
  // without MP4 stay capped at 60s whatever the plan, so skip them.
  const handleDurationCommit = () => {
    if (
      isPro ||
      durationLimitHitSeconds === null ||
      durationPaywallAutoOpened ||
      (isMobileDevice && support.supportsMp4 !== true)
    ) {
      return;
    }
    durationPaywallAutoOpened = true;
    openPaywall("duration", "auto");
  };

  const handleDurationChange = (durationSeconds: number) => {
    const durationLimit = isPro
      ? PRO_MAX_DURATION_SECONDS
      : GENERATOR_DURATION_LIMIT_SECONDS;
    // The field is not clamped, so a free user sits "above" the cap until they
    // type back under it. Only the crossing itself is a signal of intent.
    const { state: limitState, crossedUp } = resolveDurationLimitState(
      durationLimitStateRef.current,
      durationSeconds,
      durationLimit,
    );
    durationLimitStateRef.current = limitState;
    if (durationSeconds > durationLimit) {
      if (!isPro) {
        setDurationLimitHitSeconds(durationSeconds);
        if (crossedUp) {
          trackEvent("duration_limit_hit", {
            requestedSeconds: durationSeconds,
          });
        }
      }
    } else if (durationLimitHitSeconds !== null) {
      setDurationLimitHitSeconds(null);
    }
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
    const preset = GENERATOR_CANVAS_PRESETS.find(
      (item) => item.id === resolutionPresetId,
    );
    if (
      !isPro &&
      preset &&
      isProResolution(preset.width, preset.height)
    ) {
      // Free users cannot switch to 4K: open the paywall, leave canvas as-is.
      openPaywall("resolution", "feature");
      return;
    }
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
    if (!isPro && isProFormat(format)) {
      // Free users cannot pick single-file alpha video: open the paywall and
      // leave the format untouched.
      openPaywall("format", "feature");
      return;
    }
    hasUserSelectedFormatRef.current = true;
    updateSettings((current) => ({
      ...current,
      export: {
        ...current.export,
        format,
      },
    }));
  };

  const handleFpsChange = (fps: number) => {
    if (!isPro && fps === 60) {
      // Free users cannot switch to 60fps: open the paywall, leave fps as-is.
      openPaywall("fps", "feature");
      return;
    }
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
      // Pass the session's Pro state so a Pro user switching to a 4K template
      // keeps the 4K canvas instead of being normalized down to 1080p.
      setSettings((current) =>
        applyGeneratorTemplate(current, template.id, { isPro }),
      );
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
      releaseWakeLockRef.current?.();
      releaseWakeLockRef.current = null;
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
      releaseWakeLockRef.current?.();
      releaseWakeLockRef.current = null;
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

  function createPngId(prefix: string) {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return prefix ? `${prefix}-${crypto.randomUUID()}` : crypto.randomUUID();
    }
    return `${prefix}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }

  function clearPngWatchdog() {
    if (pngWatchdogRef.current !== null) {
      window.clearTimeout(pngWatchdogRef.current);
      pngWatchdogRef.current = null;
    }
    pngProgressSignatureRef.current = null;
  }

  function clearPngCancelTimer() {
    if (pngCancelTimerRef.current !== null) {
      window.clearTimeout(pngCancelTimerRef.current);
      pngCancelTimerRef.current = null;
    }
  }

  function releasePngJobLock() {
    pngJobLockRef.current?.release();
    pngJobLockRef.current = null;
  }

  function pngErrorText(code: string): string {
    const messages = pngCopy.errorMessages as Record<string, string>;
    return messages[code] ?? DEFAULT_PNG_GENERIC_ERROR;
  }

  function updatePngRecovery(
    jobId: string,
    patch: Partial<PngRecoveryView>,
  ) {
    setPngRecoveries((current) =>
      current.map((offer) =>
        offer.jobId === jobId ? { ...offer, ...patch } : offer,
      ),
    );
  }

  const refreshPngRecoveries = useCallback(async () => {
    try {
      const offers = await collectPngRecoveryOffers(
        await listPngCheckpoints(),
      );
      const views: PngRecoveryView[] = [];
      for (const offer of offers) {
        let needsFont = false;
        if (offer.manifest.uploadedFont) {
          const bytes =
            offer.checkpoint?.uploadedFont?.bytes ??
            (offer.jobDirectory
              ? await readPngFontBackup(offer.jobDirectory)
              : null);
          needsFont = !bytes;
        }
        const permission = offer.jobDirectory
          ? await queryPngDirectoryPermission(offer.jobDirectory)
          : "granted";
        views.push({
          ...offer,
          needsFont,
          needsPermission: permission === "prompt",
          error: null,
        });
      }
      setPngRecoveries(views);
    } catch {
      // Recovery is an enhancement; a scan failure must not break the page.
    }
  }, []);

  useEffect(() => {
    void refreshPngRecoveries();
  }, [refreshPngRecoveries]);

  function setPngRunState(next: PngRunState | null) {
    pngRunRef.current = next;
    setPngRun(next);
  }

  function resetPngRuntime() {
    pngStartGuardRef.current.release();
    clearPngWatchdog();
    clearPngCancelTimer();
    releasePngJobLock();
    activeExportKindRef.current = null;
    activeExportSettingsRef.current = null;
    isExportingRef.current = false;
    releaseWakeLockRef.current?.();
    releaseWakeLockRef.current = null;
    abandonFiredRef.current = true;
    exportStartedAtRef.current = null;
    setIsExporting(false);
    pngPendingPreviewRef.current = null;
    setPreview(null);
    setEtaMs(null);
    setPngRunState(null);
  }

  function armPngWatchdog(exportId: number) {
    const run = pngRunRef.current;
    const signature = run
      ? `${run.stage}:${run.processedFrames}:${run.committedFrames}:${run.bytesWritten}`
      : "preflight";
    // A heartbeat that repeats the same progress must not push the deadline
    // forever; only a real frame/byte/commit change resets it.
    if (
      pngWatchdogRef.current !== null &&
      pngProgressSignatureRef.current === signature
    ) {
      return;
    }
    pngProgressSignatureRef.current = signature;
    if (pngWatchdogRef.current !== null) {
      window.clearTimeout(pngWatchdogRef.current);
    }
    const check = () => {
      if (
        activeExportIdRef.current !== exportId ||
        !isExportingRef.current ||
        activeExportKindRef.current !== "png"
      ) {
        return;
      }
      if (document.visibilityState === "hidden") {
        // Sleep / background suspension is not proof of a stall. Probe after
        // waking; only then does a silent worker count as interrupted.
        pngWatchdogRef.current = window.setTimeout(check, 15_000);
        return;
      }
      pngWatchdogRef.current = null;
      exportRuntimeRef.current?.terminateExportWorker();
      releasePngJobLock();
      finishExportFailure(
        exportId,
        "exportWorkerStalled",
        pngErrorText("pngFailedUnexpectedly"),
        true,
      );
      setPngRunState(null);
      void refreshPngRecoveries();
    };
    pngWatchdogRef.current = window.setTimeout(
      check,
      pngRunRef.current ? PNG_WATCHDOG_MS : PNG_PREFLIGHT_WATCHDOG_MS,
    );
  }

  function attachPngWorker(exportId: number) {
    const worker = getExportRuntime().getExportWorker();
    worker.onmessage = (event) => handlePngWorkerMessage(event, exportId);
    worker.onerror = (event) => {
      event.preventDefault();
      exportRuntimeRef.current?.terminateExportWorker();
      releasePngJobLock();
      finishExportFailure(
        exportId,
        "exportWorkerCrashed",
        pngErrorText("pngFailedUnexpectedly"),
        true,
      );
      setPngRunState(null);
      void refreshPngRecoveries();
    };
    worker.onmessageerror = () => {
      exportRuntimeRef.current?.terminateExportWorker();
      releasePngJobLock();
      finishExportFailure(
        exportId,
        "exportWorkerMessageUnreadable",
        pngErrorText("pngFailedUnexpectedly"),
        true,
      );
      setPngRunState(null);
      void refreshPngRecoveries();
    };
    return worker;
  }

  function cancelPngPrep() {
    clearPngWatchdog();
    exportRuntimeRef.current?.terminateExportWorker();
    releasePngJobLock();
    pngPrepRef.current = null;
    setPngPrep(null);
    resetPngRuntime();
    setExportProgress({
      stage: "idle",
      completedFrames: 0,
      totalFrames: exportTotalsRef.current,
      message: "",
    });
  }

  function failPngPrep(code: PngErrorCode) {
    exportRuntimeRef.current?.terminateExportWorker();
    releasePngJobLock();
    pngPrepRef.current = null;
    setPngPrep(null);
    // Sampling/destination failures happen before export_started; record them
    // as unsupported conditions rather than pretending a job failed mid-run.
    trackEvent("export_unsupported", {
      reason: code,
      ...activeExportTelemetryRef.current,
    });
    resetPngRuntime();
    exportProgressRef.current = {
      stage: "error",
      completedFrames: 0,
      totalFrames: exportTotalsRef.current,
      message: pngErrorText(code),
    };
    setExportProgress(exportProgressRef.current);
  }

  async function beginPngExport(exportSettings: GeneratorSettings) {
    const exportId = activeExportIdRef.current + 1;
    activeExportIdRef.current = exportId;
    pngStartGuardRef.current.release();
    activeExportKindRef.current = "png";
    isExportingRef.current = true;
    const jobId = createPngId("job");
    const attemptId = createPngId("attempt");
    const totalFrames = Math.max(
      1,
      Math.round(
        exportSettings.timer.durationSeconds * exportSettings.export.fps,
      ),
    );
    const telemetry = buildExportFunnelTelemetry({
      settings: exportSettings,
      environment: analyticsEnvironment,
      template: templateAnalytics,
    });
    const checkpointAvailable = await isPngCheckpointStoreAvailable();
    const lockAvailable =
      typeof navigator !== "undefined" && Boolean(navigator.locks);
    const prep: PngPrepState = {
      jobId,
      attemptId,
      settings: exportSettings,
      uploadedFont,
      totalFrames,
      preflight: null,
      advice: null,
      isLongJob: false,
      canDirectory: supportsPngDirectoryPicker(),
      opfsWritable: false,
      checkpointAvailable,
      lockAvailable,
      memoryAllowed: false,
      autoDownload: false,
      error: null,
    };
    pngPrepRef.current = prep;
    setPngPrep(prep);
    setPngResult(null);
    exportTotalsRef.current = totalFrames;
    exportStartedAtRef.current = performance.now();
    activeExportSettingsRef.current = exportSettings;
    activeExportTelemetryRef.current = telemetry;
    // No export_started yet: abandonment during sampling is not a started job.
    abandonFiredRef.current = true;
    releaseWakeLockRef.current?.();
    releaseWakeLockRef.current = holdScreenWakeLock();
    setPreview(null);
    setEtaMs(null);
    setIsExporting(true);
    const initialProgress: ExportProgressState = {
      stage: "validating",
      completedFrames: 0,
      totalFrames,
      message: ui.exportPanel.runtimeMessages.preparingPngSequence,
    };
    exportProgressRef.current = initialProgress;
    setExportProgress(initialProgress);

    const pixelFrames =
      exportSettings.canvas.width *
      exportSettings.canvas.height *
      totalFrames;
    const enablePreview = !isMobileDevice && pixelFrames < 4_000_000_000;
    try {
      const worker = attachPngWorker(exportId);
      worker.postMessage({
        kind: "png-preflight",
        jobId,
        attemptId,
        payload: {
          settings: exportSettings,
          uploadedFont: uploadedFont ?? undefined,
          rendererVersion: PNG_RENDERER_VERSION,
          enablePreview,
        },
      });
      armPngWatchdog(exportId);
    } catch {
      failPngPrep("pngFailedUnexpectedly");
    }
  }

  function applyPngPreflight(
    exportId: number,
    jobId: string,
    attemptId: string,
    result: PngPreflightResult,
  ) {
    const prep = pngPrepRef.current;
    if (
      !prep ||
      prep.jobId !== jobId ||
      prep.attemptId !== attemptId ||
      activeExportIdRef.current !== exportId
    ) {
      return;
    }
    clearPngWatchdog();
    const settings = prep.settings;
    const shape = {
      durationSeconds: settings.timer.durationSeconds,
      fps: settings.export.fps,
      totalFrames: result.totalFrames,
      width: settings.canvas.width,
      height: settings.canvas.height,
      estimatedArchiveBytes: result.estimatedArchiveBytes,
    };
    const advice = getPngPlatformAdvice({
      shape,
      deviceType: clientEnvironment.deviceType,
      browser: clientEnvironment.browser,
    });
    const isLongJob = isPngLongExport(shape);
    const memoryAllowed =
      result.estimatedArchiveBytes === null ||
      result.estimatedArchiveBytes <= PNG_MEMORY_BUDGET_BYTES;
    const next: PngPrepState = {
      ...prep,
      totalFrames: result.totalFrames,
      preflight: result,
      advice,
      isLongJob,
      opfsWritable: result.opfsWritable,
      memoryAllowed,
      autoDownload: !isLongJob && advice === null,
      error: null,
    };
    pngPrepRef.current = next;
    setPngPrep(next);

    // Long jobs and platform advice need one explicit preparation step. Short
    // jobs keep the click-export-download experience.
    if (isLongJob || advice !== null) {
      return;
    }

    if (memoryAllowed) {
      void startPngRunFromPrep(exportId, next, {
        outputMode: "memory",
        autoDownload: true,
      });
      return;
    }
    if (result.opfsWritable) {
      void startPngRunFromPrep(exportId, next, {
        outputMode: "opfs",
        autoDownload: true,
      });
      return;
    }
    failPngPrep("pngMemoryLimitExceeded");
  }

  function claimPngPrep(prep: PngPrepState): boolean {
    return claimPngStart(
      pngStartGuardRef.current,
      pngPrepRef.current?.jobId,
      prep.jobId,
      () => {
        // Claim synchronously: the second click must see no preparation and
        // return without touching the worker or lock held by the winner.
        pngPrepRef.current = null;
        setPngPrep(null);
      },
    );
  }

  async function startPngRunFromPrep(
    exportId: number,
    prep: PngPrepState,
    destination: {
      outputMode: PngOutputMode;
      directory?: FileSystemDirectoryHandle;
      directoryName?: string;
      autoDownload: boolean;
    },
    alreadyClaimed = false,
  ) {
    if (!alreadyClaimed && !claimPngPrep(prep)) {
      return;
    }
    if (alreadyClaimed) {
      pngPrepRef.current = null;
      setPngPrep(null);
    }
    if (destination.outputMode !== "memory") {
      if (!prep.checkpointAvailable) {
        failPngPrep("pngCheckpointFailed");
        pngStartGuardRef.current.release();
        return;
      }
      const lock = await tryAcquirePngJobLock(prep.jobId);
      if (!lock) {
        failPngPrep("pngLocked");
        pngStartGuardRef.current.release();
        return;
      }
      pngJobLockRef.current = lock;
    }
    const parts: PngPartDescriptor[] = [];
    const committedFrames = 0;
    const run: PngRunState = {
      jobId: prep.jobId,
      attemptId: prep.attemptId,
      outputMode: destination.outputMode,
      settings: prep.settings,
      totalFrames: prep.totalFrames,
      parts,
      processedFrames: committedFrames,
      committedFrames,
      currentPart: 1,
      bytesWritten: 0,
      stage: "preparing",
      cancelling: false,
      autoDownload: destination.autoDownload,
      resumed: false,
    };
    setPngRunState(run);
    abandonFiredRef.current = false;
    const pixelFrames =
      prep.settings.canvas.width *
      prep.settings.canvas.height *
      prep.totalFrames;
    const payload: PngStartPayload = {
      jobId: prep.jobId,
      attemptId: prep.attemptId,
      settings: prep.settings,
      uploadedFont: prep.uploadedFont ?? undefined,
      rendererVersion: PNG_RENDERER_VERSION,
      outputMode: destination.outputMode,
      outputDirectory: destination.directory,
      outputDirectoryName: destination.directoryName,
      enablePreview: !isMobileDevice && pixelFrames < 4_000_000_000,
    };
    trackEvent("export_started", {
      ...activeExportTelemetryRef.current,
      outputMode: destination.outputMode,
      resumed: false,
    });
    try {
      const worker = attachPngWorker(exportId);
      worker.postMessage({ kind: "png-start", payload });
      armPngWatchdog(exportId);
    } catch {
      releasePngJobLock();
      finishExportFailure(
        exportId,
        "exportWorkerUnavailable",
        pngErrorText("pngFailedUnexpectedly"),
        true,
      );
      setPngRunState(null);
    }
    pngStartGuardRef.current.release();
  }

  async function handlePngChooseFolder() {
    const prep = pngPrepRef.current;
    if (!prep?.preflight || pngStartGuardRef.current.isBusy()) {
      return;
    }
    // Hold the guard across picker + directory creation so a double-click
    // cannot create two task directories.
    if (!pngStartGuardRef.current.claim()) {
      return;
    }
    try {
      let picked: FileSystemDirectoryHandle | "cancelled";
      try {
        // First await in the click handler: the picker needs this activation.
        picked = await pickPngDirectory();
      } catch {
        updatePngPrepError(pngCopy.capabilityMissing);
        return;
      }
      if (picked === "cancelled") {
        cancelPngPrep();
        return;
      }
      const job = await createPngJobDirectory(picked, prep.jobId);
      const next: PngPrepState = { ...prep, jobId: job.jobId };
      pngPrepRef.current = next;
      setPngPrep(next);
      await startPngRunFromPrep(
        activeExportIdRef.current,
        next,
        {
          outputMode: "directory",
          directory: job.directory,
          directoryName: job.directoryName,
          autoDownload: false,
        },
        true,
      );
    } catch {
      updatePngPrepError(pngErrorText("pngDirectoryPermissionDenied"));
    } finally {
      pngStartGuardRef.current.release();
    }
  }

  function updatePngPrepError(message: string | null) {
    const prep = pngPrepRef.current;
    if (!prep) {
      return;
    }
    const next = { ...prep, error: message };
    pngPrepRef.current = next;
    setPngPrep(next);
  }

  function handlePngUseOpfs() {
    const prep = pngPrepRef.current;
    if (!prep?.preflight) {
      return;
    }
    void startPngRunFromPrep(activeExportIdRef.current, prep, {
      outputMode: "opfs",
      autoDownload: false,
    });
  }

  function handlePngContinueMemory() {
    const prep = pngPrepRef.current;
    if (!prep?.preflight) {
      return;
    }
    void startPngRunFromPrep(activeExportIdRef.current, prep, {
      outputMode: "memory",
      autoDownload: true,
    });
  }

  function handlePngWorkerMessage(
    event: MessageEvent<ExportWorkerMessage>,
    exportId: number,
  ) {
    const message = event.data;
    const run = pngRunRef.current;
    const prep = pngPrepRef.current;

    if (message.kind === "preview") {
      if (
        !run ||
        message.jobId !== run.jobId ||
        message.attemptId !== run.attemptId
      ) {
        message.payload.bitmap.close();
        return;
      }
      armPngWatchdog(exportId);
      pngPendingPreviewRef.current = {
        bitmap: message.payload.bitmap,
        jobId: run.jobId,
        attemptId: run.attemptId,
      };
      setPreview(message.payload.bitmap);
      return;
    }

    if (!isPngWorkerResponse(message)) {
      return;
    }

    if (message.kind === "png-preflight-result") {
      if (
        prep &&
        message.jobId === prep.jobId &&
        message.attemptId === prep.attemptId
      ) {
        applyPngPreflight(
          exportId,
          message.jobId,
          message.attemptId,
          message.payload,
        );
      }
      return;
    }

    if (message.kind === "png-error" && !run) {
      // A stale worker message must not dismiss an unrelated preparation.
      if (
        prep &&
        message.jobId === prep.jobId &&
        message.attemptId === prep.attemptId
      ) {
        failPngPrep(message.payload.errorCode);
      }
      return;
    }

    if (
      !run ||
      message.jobId !== run.jobId ||
      message.attemptId !== run.attemptId
    ) {
      return;
    }

    if (message.kind === "png-progress") {
      const progress = message.payload;
      const nextRun: PngRunState = {
        ...run,
        stage: progress.stage,
        processedFrames: progress.processedFrames,
        committedFrames: progress.committedFrames,
        currentPart: progress.currentPart,
        bytesWritten: progress.bytesWritten,
      };
      setPngRunState(nextRun);
      const stage: ExportProgressState["stage"] =
        progress.stage === "preparing"
          ? "validating"
          : progress.stage === "rendering" || progress.stage === "writing"
            ? "rendering-frames"
            : "packaging";
      const nextProgress: ExportProgressState = {
        stage,
        completedFrames: progress.processedFrames,
        totalFrames: run.totalFrames,
        message: "",
      };
      const localized = localizeProgressMessage(nextProgress);
      exportProgressRef.current = localized;
      setExportProgress(localized);
      setEtaMs(
        estimateRemainingMs(
          elapsedExportMs() ?? 0,
          progress.processedFrames,
          run.totalFrames,
        ),
      );
      armPngWatchdog(exportId);
      return;
    }

    if (message.kind === "png-part-committed") {
      const part = message.payload.part;
      const parts = run.parts.some(
        (existing) => existing.partNumber === part.partNumber,
      )
        ? run.parts
        : [...run.parts, part];
      setPngRunState({
        ...run,
        parts,
        committedFrames: part.nextFrameIndex,
        currentPart: parts.length + 1,
      });
      armPngWatchdog(exportId);
      return;
    }

    if (message.kind === "png-complete") {
      void completePngRun(exportId, message.payload);
      return;
    }

    if (message.kind === "png-cancelled") {
      void cancelledPngRun(exportId, message.payload);
      return;
    }

    if (message.kind === "png-error") {
      void errorPngRun(exportId, message.payload);
    }
  }

  async function completePngRun(
    exportId: number,
    payload: Extract<PngWorkerResponse, { kind: "png-complete" }>["payload"],
  ) {
    const run = pngRunRef.current;
    if (
      !run ||
      activeExportIdRef.current !== exportId ||
      !isExportingRef.current
    ) {
      return;
    }
    clearPngWatchdog();
    clearPngCancelTimer();
    exportRuntimeRef.current?.terminateExportWorker();
    releasePngJobLock();
    const outputTelemetry: AnalyticsEventPayload = {
      ...activeExportTelemetryRef.current,
      outputMode: payload.outputMode,
      partCount: payload.parts.length,
      totalBytes: payload.totalBytes,
      totalFrames: payload.totalFrames,
      committedFrames: payload.totalFrames,
      resumed: run.resumed,
    };
    trackEvent("export_generated", outputTelemetry);

    let autoDownloaded = false;
    let downloadError: string | null = null;
    let resultBlob: Blob | undefined;
    const fileName = "time-overlay.zip";

    try {
      if (payload.outputMode === "memory") {
        if (!payload.blob) {
          throw new Error("The in-memory PNG archive is missing.");
        }
        await validateExportArtifact(payload.blob, "application/zip", fileName);
        downloadBlob(payload.blob, fileName);
        resultBlob = payload.blob;
        autoDownloaded = true;
        trackEvent("export_download_requested", {
          ...outputTelemetry,
          fileName,
        });
      } else if (
        payload.outputMode === "opfs" &&
        run.autoDownload &&
        payload.parts.length === 1
      ) {
        const part = payload.parts[0];
        const file = await readOpfsPngPart(run.jobId, part.fileName);
        downloadBlob(file, part.fileName);
        autoDownloaded = true;
        trackEvent("export_download_requested", {
          ...outputTelemetry,
          fileName: part.fileName,
          partNumber: part.partNumber,
        });
      }
    } catch {
      // The output exists; a failed automatic download must not discard it.
      downloadError = pngCopy.downloadFailed;
    }
    // One completion event for the whole task; it does not mean every browser
    // part was downloaded. Downloads are tracked separately per part.
    trackEvent("export_completed", {
      ...outputTelemetry,
      outputMode: payload.outputMode,
      downloadsRequested: autoDownloaded ? 1 : 0,
    });

    setPngResult({
      jobId: run.jobId,
      outputMode: payload.outputMode,
      parts: payload.parts,
      totalFrames: payload.totalFrames,
      totalBytes: payload.totalBytes,
      outputDirectoryName: payload.outputDirectoryName,
      autoDownloaded,
      blob: resultBlob,
      cleanupAvailable: payload.outputMode === "opfs",
      downloadError,
    });

    const completeMessage =
      payload.outputMode === "directory"
        ? formatTemplate(pngCopy.directorySavedTemplate, {
            folder: payload.outputDirectoryName ?? run.jobId,
            parts: payload.parts.length,
            frames: payload.totalFrames,
            size: formatPngBytes(payload.totalBytes),
          })
        : payload.outputMode === "opfs"
          ? pngCopy.resultTitle
          : formatTemplate(
              ui.exportPanel.runtimeMessages.exportReadyTemplate,
              { fileName },
            );

    resetPngRuntime();
    setExportProgress({
      stage: "complete",
      completedFrames: payload.totalFrames,
      totalFrames: payload.totalFrames,
      message: completeMessage,
    });
    await deletePngCheckpoint(run.jobId).catch(() => undefined);
    await refreshPngRecoveries();
  }

  async function cancelledPngRun(
    exportId: number,
    payload: Extract<PngWorkerResponse, { kind: "png-cancelled" }>["payload"],
  ) {
    const run = pngRunRef.current;
    if (
      !run ||
      activeExportIdRef.current !== exportId ||
      !isExportingRef.current
    ) {
      return;
    }
    const committedFrames =
      payload.committedParts.length > 0
        ? payload.committedParts[payload.committedParts.length - 1]
            .nextFrameIndex
        : 0;
    trackEvent("export_cancelled", {
      ...activeExportTelemetryRef.current,
      stage: run.stage,
      outputMode: run.outputMode,
      committedFrames,
      totalFrames: run.totalFrames,
      durationMs: elapsedExportMs(),
    });
    exportRuntimeRef.current?.terminateExportWorker();
    resetPngRuntime();
    setExportProgress({
      stage: "idle",
      completedFrames: committedFrames,
      totalFrames: run.totalFrames,
      message: pngCopy.cancelledMessage,
    });
    await refreshPngRecoveries();
  }

  async function errorPngRun(
    exportId: number,
    payload: Extract<PngWorkerResponse, { kind: "png-error" }>["payload"],
  ) {
    const run = pngRunRef.current;
    if (
      !run ||
      activeExportIdRef.current !== exportId ||
      !isExportingRef.current
    ) {
      return;
    }
    exportRuntimeRef.current?.terminateExportWorker();
    releasePngJobLock();
    setPngRunState(null);
    finishExportFailure(
      exportId,
      payload.errorCode,
      pngErrorText(payload.errorCode),
      true,
    );
    await refreshPngRecoveries();
  }

  async function handlePngRecoveryRestore(offer: PngRecoveryView) {
    if (isExportingRef.current) {
      return;
    }
    if (offer.needsDirectorySelection) {
      await handlePngRecoverySelectFolder(offer);
      return;
    }
    const directory = offer.jobDirectory;
    if (directory) {
      // First await in this click: requestPermission needs the gesture.
      const permission = await requestPngDirectoryPermission(directory);
      if (permission !== "granted") {
        updatePngRecovery(offer.jobId, {
          needsPermission: permission === "prompt",
          error: pngCopy.errorMessages.pngDirectoryPermissionDenied,
        });
        return;
      }
    }
    updatePngRecovery(offer.jobId, { needsPermission: false, error: null });
    await proceedPngResume(offer, directory);
  }

  async function handlePngRecoverySelectFolder(offer: PngRecoveryView) {
    let picked: FileSystemDirectoryHandle | "cancelled";
    try {
      picked = await pickPngDirectory();
    } catch {
      updatePngRecovery(offer.jobId, { error: pngCopy.capabilityMissing });
      return;
    }
    if (picked === "cancelled") {
      return;
    }
    const latest = await readLatestPngManifest(picked, offer.jobId)
      .then((result) => result?.manifest ?? null)
      .catch(() => null);
    if (!latest) {
      updatePngRecovery(offer.jobId, {
        error: pngCopy.errorMessages.pngResumeFileMissing,
      });
      return;
    }
    const next: PngRecoveryView = {
      ...offer,
      manifest: latest,
      parts: latest.parts,
      jobDirectory: picked,
      needsDirectorySelection: false,
      needsPermission: false,
      error: null,
    };
    updatePngRecovery(offer.jobId, next);
    await proceedPngResume(next, picked);
  }

  async function proceedPngResume(
    offer: PngRecoveryView,
    directory: FileSystemDirectoryHandle | null,
  ) {
    setPngRecoveryBusy(true);
    try {
      const manifest = offer.manifest;
      let font: UploadedFont | undefined;
      if (manifest.uploadedFont) {
        font = pngRecoveryFonts[manifest.jobId];
        if (!font) {
          const bytes =
            offer.checkpoint?.uploadedFont?.bytes ??
            (directory ? await readPngFontBackup(directory) : null);
          if (!bytes) {
            updatePngRecovery(manifest.jobId, {
              needsFont: true,
              error: null,
            });
            return;
          }
          const digest = await sha256Hex(new Uint8Array(bytes));
          if (digest !== manifest.uploadedFont.sha256) {
            updatePngRecovery(manifest.jobId, {
              needsFont: true,
              error: pngCopy.fontRequired,
            });
            return;
          }
          font = {
            family: manifest.uploadedFont.family,
            data: bytes,
          };
        }
      }

      const lock = await tryAcquirePngJobLock(manifest.jobId);
      if (!lock) {
        updatePngRecovery(manifest.jobId, {
          error: pngCopy.errorMessages.pngLocked,
        });
        return;
      }
      pngJobLockRef.current = lock;

      const exportId = activeExportIdRef.current + 1;
      activeExportIdRef.current = exportId;
      const attemptId = createPngId("attempt");
      const totalFrames = manifest.totalFrames;
      const settings = manifest.settings;
      const template = getGeneratorTemplateById(settings.templateId);
      const telemetry = buildExportFunnelTelemetry({
        settings,
        environment: analyticsEnvironment,
        template: {
          templateId: template.id,
          templateCategory: template.category,
          templateTier: template.tier,
          templateOrientation: template.orientation,
          templateRecommendedFormat: template.recommendedFormat,
          templateCustomized: true,
        },
      });
      exportTotalsRef.current = totalFrames;
      exportStartedAtRef.current = performance.now();
      activeExportSettingsRef.current = settings;
      activeExportTelemetryRef.current = telemetry;
      abandonFiredRef.current = false;
      isExportingRef.current = true;
      activeExportKindRef.current = "png";
      releaseWakeLockRef.current?.();
      releaseWakeLockRef.current = holdScreenWakeLock();
      setPreview(null);
      setEtaMs(null);
      setIsExporting(true);
      setPngResult(null);

      const pixelFrames =
        settings.canvas.width * settings.canvas.height * totalFrames;
      const run: PngRunState = {
        jobId: manifest.jobId,
        attemptId,
        outputMode: manifest.outputMode,
        settings,
        totalFrames,
        parts: manifest.parts,
        processedFrames: manifest.nextFrameIndex,
        committedFrames: manifest.nextFrameIndex,
        currentPart: manifest.nextPartNumber,
        bytesWritten: manifest.parts.reduce(
          (total, part) => total + part.bytes,
          0,
        ),
        stage: "preparing",
        cancelling: false,
        autoDownload: false,
        resumed: true,
      };
      setPngRunState(run);
      const initialProgress: ExportProgressState = {
        stage: "validating",
        completedFrames: manifest.nextFrameIndex,
        totalFrames,
        message: ui.exportPanel.runtimeMessages.preparingPngSequence,
      };
      exportProgressRef.current = initialProgress;
      setExportProgress(initialProgress);
      trackEvent("export_started", {
        ...telemetry,
        outputMode: manifest.outputMode,
        resumed: true,
        committedFrames: manifest.nextFrameIndex,
      });

      const payload: PngStartPayload = {
        jobId: manifest.jobId,
        attemptId,
        settings,
        uploadedFont: font,
        rendererVersion: PNG_RENDERER_VERSION,
        outputMode: manifest.outputMode,
        outputDirectory:
          manifest.outputMode === "directory" ? directory ?? undefined : undefined,
        outputDirectoryName:
          manifest.outputMode === "directory"
            ? directory?.name ?? offer.checkpoint?.outputDirectoryName
            : manifest.jobId,
        resumeFrom: {
          nextFrameIndex: manifest.nextFrameIndex,
          nextPartNumber: manifest.nextPartNumber,
          parts: manifest.parts,
        },
        enablePreview: !isMobileDevice && pixelFrames < 4_000_000_000,
      };

      const worker = attachPngWorker(exportId);
      worker.postMessage({ kind: "png-resume", payload });
      armPngWatchdog(exportId);
      setPngRecoveries((current) =>
        current.filter((item) => item.jobId !== manifest.jobId),
      );
    } catch {
      releasePngJobLock();
      updatePngRecovery(offer.jobId, {
        error: pngErrorText("pngResumeVersionMismatch"),
      });
    } finally {
      setPngRecoveryBusy(false);
    }
  }

  async function handlePngRecoveryRemove(jobId: string) {
    setPngRecoveryBusy(true);
    try {
      await removePngRecoveryRecord(jobId);
      setPngRecoveries((current) =>
        current.filter((item) => item.jobId !== jobId),
      );
    } finally {
      setPngRecoveryBusy(false);
    }
  }

  async function handlePngRecoveryCleanup(jobId: string) {
    setPngRecoveryBusy(true);
    try {
      await cleanPngOpfsJob(jobId);
      setPngRecoveries((current) =>
        current.filter((item) => item.jobId !== jobId),
      );
    } finally {
      setPngRecoveryBusy(false);
    }
  }

  async function handlePngCleanupResult(jobId: string) {
    await cleanPngOpfsJob(jobId);
    setPngResult(null);
  }

  async function handlePngDownloadPartForJob(
    jobId: string,
    part: PngPartDescriptor,
  ) {
    try {
      const file = await readOpfsPngPart(jobId, part.fileName);
      downloadBlob(file, part.fileName);
      trackEvent("export_download_requested", {
        format: "png-sequence",
        outputMode: "opfs",
        partNumber: part.partNumber,
        partBytes: part.bytes,
      });
    } catch {
      setPngResult((current) =>
        current ? { ...current, downloadError: pngCopy.downloadFailed } : current,
      );
    }
  }

  async function handlePngDownloadPart(part: PngPartDescriptor) {
    const result = pngResult;
    if (result) {
      await handlePngDownloadPartForJob(result.jobId, part);
    }
  }

  async function handlePngCleanupStoredJob(jobId: string) {
    await cleanPngOpfsJob(jobId);
    await refreshPngRecoveries();
  }

  async function handlePngImportFolder() {
    if (isExportingRef.current) {
      return;
    }
    setPngImportError(null);
    let picked: FileSystemDirectoryHandle | "cancelled";
    try {
      picked = await pickPngDirectory();
    } catch {
      setPngImportError(pngCopy.capabilityMissing);
      return;
    }
    if (picked === "cancelled") {
      return;
    }
    const latest = await readLatestPngManifest(picked)
      .then((result) => result?.manifest ?? null)
      .catch(() => null);
    if (!latest) {
      setPngImportError(pngCopy.errorMessages.pngResumeFileMissing);
      return;
    }
    if (latest.status === "complete") {
      setPngResult({
        jobId: latest.jobId,
        outputMode: "directory",
        parts: latest.parts,
        totalFrames: latest.totalFrames,
        totalBytes: latest.parts.reduce(
          (total, part) => total + part.bytes,
          0,
        ),
        outputDirectoryName: picked.name,
        autoDownloaded: false,
        cleanupAvailable: false,
        downloadError: null,
      });
      return;
    }
    const needsFont = latest.uploadedFont
      ? !(await readPngFontBackup(picked))
      : false;
    const offer: PngRecoveryView = {
      jobId: latest.jobId,
      manifest: latest,
      checkpoint: null,
      jobDirectory: picked,
      source: "folder",
      parts: latest.parts,
      needsDirectorySelection: false,
      needsPermission: false,
      needsFont,
      error: null,
    };
    setPngRecoveries((current) => [
      offer,
      ...current.filter((item) => item.jobId !== latest.jobId),
    ]);
  }

  function handlePngFontPicked(font: UploadedFont) {
    const offer = pngRecoveryFontOfferRef.current;
    if (!offer || !offer.manifest.uploadedFont) {
      return;
    }
    setPngRecoveryFonts((current) => ({
      ...current,
      [offer.jobId]: {
        family: offer.manifest.uploadedFont?.family ?? font.family,
        data: font.data,
      },
    }));
    updatePngRecovery(offer.jobId, { needsFont: false, error: null });
  }

  async function handlePngFontInputChange(file: File) {
    try {
      const font = await readFontFile(file);
      if (!pngRecoveryFontOfferRef.current) {
        return;
      }
      const digest = await sha256Hex(new Uint8Array(font.data));
      const offer = pngRecoveryFontOfferRef.current;
      if (
        offer.manifest.uploadedFont &&
        digest !== offer.manifest.uploadedFont.sha256
      ) {
        updatePngRecovery(offer.jobId, { error: pngCopy.fontRequired });
        return;
      }
      handlePngFontPicked(font);
    } catch (error) {
      const offer = pngRecoveryFontOfferRef.current;
      if (offer) {
        updatePngRecovery(offer.jobId, {
          error:
            error instanceof Error ? error.message : pngCopy.fontRequired,
        });
      }
    }
  }

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
        if (document.visibilityState === "hidden") {
          // Nobody can paint this; drop it instead of queueing GPU memory.
          event.data.payload.bitmap.close();
          return;
        }
        setPreview(event.data.payload.bitmap);
        return;
      }

      if (event.data.kind === "complete") {
        void finalizeCompletedExport(exportId, event.data.payload);
        return;
      }

      if (event.data.kind !== "error") {
        return;
      }

      const code = event.data.payload.code;
      if (code === "mp4StorageUnavailable" || code === "mp4StorageFull") {
        // Storage problems have their own localized advice; switching formats
        // would not help, so skip the generic message and suggestion.
        finishExportFailure(
          exportId,
          code,
          code === "mp4StorageFull"
            ? (ui.exportPanel.runtimeMessages.mp4StorageFull ??
                DEFAULT_MP4_STORAGE_FULL_MESSAGE)
            : (ui.exportPanel.runtimeMessages.mp4StorageUnavailable ??
                DEFAULT_MP4_STORAGE_UNAVAILABLE_MESSAGE),
          true,
        );
        return;
      }
      const fallback =
        code === "mp4FailedUnexpectedly"
          ? (ui.exportPanel.runtimeMessages.mp4FailedUnexpectedly ??
            DEFAULT_MP4_FAILED_MESSAGE)
          : ui.exportPanel.runtimeMessages.alphaVideoFailedUnexpectedly;
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
    const retiredPreviews = retiredPreviewsRef.current;
    return () => {
      webmAbortControllerRef.current?.abort(
        createCodedError("exportCancelled", "Export cancelled."),
      );
      clearWorkerWatchdog();
      exportRuntimeRef.current?.terminateExportWorker();
      exportRuntimeRef.current = null;
      previewBitmapRef.current?.close();
      previewBitmapRef.current = null;
      for (const bitmap of retiredPreviews) {
        bitmap.close();
      }
      retiredPreviews.length = 0;
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
      reason: exportAdvisory.code,
      ...buildExportFunnelTelemetry({
        settings,
        environment: analyticsEnvironment,
        template: templateAnalytics,
      }),
    });
  }, [
    exportAdvisory.severity,
    exportAdvisory.code,
    settings,
    templateAnalytics,
    analyticsEnvironment,
  ]);

  function handleCancelExport() {
    if (!isExportingRef.current) {
      return;
    }
    if (activeExportKindRef.current === "png") {
      const run = pngRunRef.current;
      if (!run) {
        // Sampling or the preparation dialog: cancelling preparation writes no
        // output and is not an export failure.
        cancelPngPrep();
        return;
      }
      if (run.cancelling) {
        return;
      }
      const nextRun = { ...run, cancelling: true };
      pngRunRef.current = nextRun;
      setPngRun(nextRun);
      exportRuntimeRef.current?.getExportWorker().postMessage({
        kind: "cancel-png",
        jobId: run.jobId,
        attemptId: run.attemptId,
      });
      clearPngCancelTimer();
      pngCancelTimerRef.current = window.setTimeout(() => {
        const current = pngRunRef.current;
        if (!current || current.attemptId !== run.attemptId) {
          return;
        }
        exportRuntimeRef.current?.terminateExportWorker();
        releasePngJobLock();
        setPngRunState(null);
        finishExportFailure(
          activeExportIdRef.current,
          "exportWorkerStalled",
          pngErrorText("pngWriteFailed"),
          true,
        );
        void refreshPngRecoveries();
      }, PNG_CANCEL_GRACE_MS);
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
  }

  // Localized text for the Pro fallback notice: one line per gated setting that
  // a free session just lost, in the same order the gates apply them.
  const proFallbackNotice = useMemo(() => {
    if (!proFallbackReasons.length) {
      return null;
    }
    const gate = getProGateCopy(liveLinkLocale);
    return proFallbackReasons
      .map((reason) =>
        reason === "resolution" ? gate.fallbackResolution : gate.fallbackFormat,
      )
      .join(" ");
  }, [proFallbackReasons, liveLinkLocale]);

  const handleExport = async () => {
    // A synchronous ref closes the tiny gap before React commits disabled=true,
    // so a double click cannot start two jobs against the same worker.
    if (isExportingRef.current || exportAdvisory.severity === "error") {
      return;
    }
    // Free users may select and preview Pro templates, but the export click is
    // where the paywall intercepts (spec 6.1).
    if (getProExportBlockReason(settings.templateId, isPro) === "template") {
      openPaywall("template", "feature");
      return;
    }

    if (settings.export.format === "png-sequence") {
      // Sampling, destination choice and part streaming have their own flow;
      // the frozen settings are captured here before any panel edit.
      await beginPngExport(settings);
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
    const telemetry = buildExportFunnelTelemetry({
      settings: exportSettings,
      environment: analyticsEnvironment,
      template: templateAnalytics,
    });

    exportTotalsRef.current = totalFrames;
    exportStartedAtRef.current = performance.now();
    activeExportSettingsRef.current = exportSettings;
    activeExportTelemetryRef.current = telemetry;
    abandonFiredRef.current = false;
    isExportingRef.current = true;
    releaseWakeLockRef.current?.();
    releaseWakeLockRef.current = holdScreenWakeLock();
    setPreview(null);
    setEtaMs(null);
    setIsExporting(true);
    trackEvent("export_started", { ...telemetry, isPro });
    if (isPro) {
      for (const { feature, value } of getProFeatureUsage(exportSettings)) {
        trackEvent("pro_feature_used", { feature, value });
      }
    }

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
        : exportSettings.export.format === "mp4"
          ? (ui.exportPanel.runtimeMessages.preparingMp4 ??
            DEFAULT_PREPARING_MP4_MESSAGE)
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
      if (exportSettings.export.format === "mp4") {
        exportWorker.postMessage({
          kind: "export-mp4",
          payload: {
            settings: exportSettings,
            uploadedFont: uploadedFont ?? undefined,
            enablePreview,
            allowInMemoryFallback: !isMobileDevice,
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

  const activePngRecovery =
    pngRecoveries.find((offer) => offer.manifest.status !== "complete") ?? null;
  const completedPngStorage = pngRecoveries.filter(
    (offer) =>
      offer.manifest.status === "complete" &&
      offer.source === "opfs" &&
      offer.jobId !== pngResult?.jobId,
  );
  const pngExtras = (
    <>
      {pngResult ? (
        <PngResultCard
          cleanupAvailable={pngResult.cleanupAvailable}
          copy={pngCopy}
          error={pngResult.downloadError}
          onCleanup={() => void handlePngCleanupResult(pngResult.jobId)}
          onDownloadPart={(part) => void handlePngDownloadPart(part)}
          result={pngResult}
        />
      ) : null}
      {pngRun ? (
        <PngRunCard
          bytesWritten={pngRun.bytesWritten}
          cancelling={pngRun.cancelling}
          committedFrames={pngRun.committedFrames}
          copy={pngCopy}
          currentPart={pngRun.currentPart}
          outputMode={pngRun.outputMode}
          partCount={pngRun.parts.length}
          processedFrames={pngRun.processedFrames}
          totalFrames={pngRun.totalFrames}
        />
      ) : null}
      {!pngRun
        ? completedPngStorage.map((offer) => (
            <div key={offer.jobId}>
              <p className="mb-1 break-all font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {offer.jobId}
              </p>
              <PngResultCard
                cleanupAvailable
                copy={pngCopy}
                onCleanup={() =>
                  void handlePngCleanupStoredJob(offer.jobId)
                }
                onDownloadPart={(part) =>
                  void handlePngDownloadPartForJob(offer.jobId, part)
                }
                result={{
                  jobId: offer.jobId,
                  outputMode: offer.manifest.outputMode,
                  parts: offer.parts,
                  totalFrames: offer.manifest.totalFrames,
                  totalBytes: offer.parts.reduce(
                    (total, part) => total + part.bytes,
                    0,
                  ),
                  outputDirectoryName: offer.manifest.jobId,
                  autoDownloaded: false,
                }}
              />
            </div>
          ))
        : null}
      {!pngRun && !pngResult && activePngRecovery ? (
        <PngRecoveryCard
          busy={pngRecoveryBusy}
          cleanupAvailable={activePngRecovery.manifest.outputMode === "opfs"}
          committedFrames={activePngRecovery.parts.at(-1)?.nextFrameIndex ?? 0}
          copy={pngCopy}
          error={activePngRecovery.error}
          jobId={activePngRecovery.jobId}
          needsDirectorySelection={
            activePngRecovery.needsDirectorySelection ||
            (activePngRecovery.manifest.outputMode === "directory" &&
              activePngRecovery.needsPermission)
          }
          needsFont={activePngRecovery.needsFont}
          needsPermission={activePngRecovery.needsPermission}
          onCleanup={() =>
            void handlePngRecoveryCleanup(activePngRecovery.jobId)
          }
          onRemoveRecord={() =>
            void handlePngRecoveryRemove(activePngRecovery.jobId)
          }
          onDownloadPart={(part) =>
            void handlePngDownloadPartForJob(activePngRecovery.jobId, part)
          }
          partsDownloadable={activePngRecovery.source === "opfs"}
          onRestore={() => void handlePngRecoveryRestore(activePngRecovery)}
          onSelectFolder={() =>
            void handlePngRecoverySelectFolder(activePngRecovery)
          }
          onSelectFont={() => {
            pngRecoveryFontOfferRef.current = activePngRecovery;
            pngFontInputRef.current?.click();
          }}
          outputMode={activePngRecovery.manifest.outputMode}
          parts={activePngRecovery.parts}
          totalFrames={activePngRecovery.manifest.totalFrames}
        />
      ) : null}
      {settings.export.format === "png-sequence" &&
      !pngRun &&
      !pngResult &&
      !pngPrep ? (
        <div>
          <button
            className="w-full border border-border/70 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground underline underline-offset-4"
            onClick={() => void handlePngImportFolder()}
            type="button"
          >
            {pngCopy.selectFolderButton}
          </button>
          {pngImportError ? (
            <p className="mt-1 text-[11px] leading-5 text-destructive">
              {pngImportError}
            </p>
          ) : null}
        </div>
      ) : null}
      <input
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) {
            void handlePngFontInputChange(file);
          }
        }}
        ref={pngFontInputRef}
        type="file"
      />
    </>
  );

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
                maxDurationSeconds={
                  isPro ? PRO_MAX_DURATION_SECONDS : GENERATOR_DURATION_LIMIT_SECONDS
                }
                durationLimitNotice={
                  !isPro && durationLimitHitSeconds !== null
                    ? (ui.pro?.durationUpsellHint ?? DEFAULT_PRO_DURATION_HINT)
                    : null
                }
                durationUpsellCtaLabel={ui.pro?.paywall?.unlockButton ?? null}
                proBadgeLabel={
                  ui.pro?.proBadgeLabel ?? DEFAULT_PRO_BADGE_LABEL
                }
                onUnlockPro={() => openPaywall("duration", "inline")}
                uploadedFontName={uploadedFont?.family ?? null}
                onDurationChange={handleDurationChange}
                onDurationCommit={handleDurationCommit}
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
                isPro={isPro}
                proEnabledLabel={
                  ui.pro?.proEnabledLabel ?? DEFAULT_PRO_ENABLED_LABEL
                }
                fps60Label={ui.pro?.fps60Label}
                proBadgeLabel={
                  ui.pro?.proBadgeLabel ?? DEFAULT_PRO_BADGE_LABEL
                }
                fallbackNotice={proFallbackNotice}
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
                onOpenLiveLink={() => setLiveLinkOpen(true)}
                onUnlockPro={
                  isPro
                    ? undefined
                    : () => openPaywall("direct", "export_complete")
                }
                onPreviewCleared={handlePreviewCleared}
                onPreviewDrawn={handlePreviewDrawn}
                pngExtras={pngExtras}
                cancelLabel={
                  pngRun?.cancelling
                    ? pngCopy.stoppingButton
                    : pngPrep
                      ? pngCopy.cancelPrepButton
                      : undefined
                }
              />
            </div>
          </div>

          {pngPrep ? (
            <PngPrepareDialog
              busy={false}
              copy={pngCopy}
              error={pngPrep.error}
              isResuming={false}
              onCancel={cancelPngPrep}
              onChooseFolder={() => void handlePngChooseFolder()}
              onContinueMemory={handlePngContinueMemory}
              onUseOpfs={handlePngUseOpfs}
              open
              state={{
                durationSeconds: pngPrep.settings.timer.durationSeconds,
                fps: pngPrep.settings.export.fps,
                width: pngPrep.settings.canvas.width,
                height: pngPrep.settings.canvas.height,
                totalFrames: pngPrep.totalFrames,
                preflight: pngPrep.preflight,
                advice: pngPrep.advice,
                isLongJob: pngPrep.isLongJob,
                canDirectory: pngPrep.canDirectory,
                opfsWritable: pngPrep.opfsWritable,
                checkpointAvailable: pngPrep.checkpointAvailable,
                lockAvailable: pngPrep.lockAvailable,
                memoryAllowed: pngPrep.memoryAllowed,
              }}
            />
          ) : null}

          <ProPaywallModal
            open={paywallTrigger !== null}
            trigger={paywallTrigger}
            copy={ui.pro?.paywall}
            onClose={() => {
              setPaywallTrigger(null);
              setProUpsellSource(null);
            }}
            onCheckout={(trigger, quote) => {
              trackEvent("pro_checkout_clicked", {
                trigger,
                ...quoteAnalytics(quote),
                ...upsellSourcePayload(),
              });
              const { locale, returnPath } = resolveGeneratorCheckoutContext(
                window.location.pathname,
                window.location.search,
              );
              return startProCheckout(trigger, locale, returnPath, quote);
            }}
            onRestore={(email) => {
              trackEvent("pro_restore_clicked", {});
              return restorePro(email);
            }}
          />

          <LiveLinkDialog
            open={liveLinkOpen}
            settings={settings}
            isPro={isPro}
            locale={liveLinkLocale}
            onClose={() => setLiveLinkOpen(false)}
            onUnlockPro={() => {
              setLiveLinkOpen(false);
              openPaywall("template", "feature");
            }}
          />
        </div>
      </section>
    </main>
  );
}
