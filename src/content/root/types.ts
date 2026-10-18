import type {
  AudioCueVariant,
  ExportQualityPreset,
  FontFamilyPreset,
  PlacementAnchor,
  RenderThemePresetId,
  ResolutionPresetId,
  TimerDisplayFormat,
} from "@/lib/generator/types";

export type RootFaqItem = {
  question: string;
  answer: string;
};

export type RootContentStep = {
  title: string;
  body: string;
};

export type RootInlineCta = {
  beforeLink: string;
  linkLabel: string;
  afterLink: string;
};

export type RootDualLinkCta = {
  beforeFirstLink: string;
  firstLinkLabel: string;
  betweenLinks: string;
  secondLinkLabel: string;
  afterSecondLink: string;
};

export type RootPageContent = {
  metadata: {
    title: string;
    description: string;
  };
  generatorHero: {
    eyebrow: string;
    heading: string;
    intro: string;
  };
  siteChrome: {
    siteName: string;
    siteDescription: string;
    header: {
      shellLabel: string;
      toolLinkLabel: string;
      faqLinkLabel: string;
      languagePickerLabel?: string;
      primaryNavAriaLabel?: string;
    };
    footer: {
      systemRailLabel: string;
      publicStatusLabel: string;
      identityTitle: string;
      jumpTitle: string;
      productTitle: string;
      navAriaLabel?: string;
      jumpLinks: readonly {
        anchorId: string;
        label: string;
      }[];
      productDescription: string;
    };
  };
  generatorUi: {
    templateGallery: {
      title: string;
      description: string;
      browseLabel: string;
      searchPlaceholder: string;
      categoryLabels: Record<
        | "all"
        | "editing"
        | "streaming"
        | "social"
        | "events"
        | "fitness"
        | "cinematic"
        | "minimal",
        string
      >;
      selectedLabel: string;
      editedLabel: string;
      resultTemplate: string;
      noResults: string;
      closeLabel: string;
    };
    themePresetPicker: {
      title: string;
      description: string;
      presetLabels: Record<RenderThemePresetId, string>;
    };
    controlPanel: {
      title: string;
      subtitle: string;
      timerSetupTitle: string;
      durationLabel: string;
      displayFormatLabel: string;
      displayFormatOptions: Record<TimerDisplayFormat, string>;
      canvasTitle: string;
      resolutionPresetLabel: string;
      resolutionPresetOptions: Record<ResolutionPresetId, string>;
      backgroundModeLabel: string;
      styleTitle: string;
      fontFamilyLabel: string;
      fontFamilyOptions: Record<FontFamilyPreset, string>;
      anchorLabel: string;
      anchorOptions: Record<PlacementAnchor, string>;
      transparentOptionLabel: string;
      solidOptionLabel: string;
      audioTitle: string;
      audioVariantLabel: string;
      audioVariantOptions: Record<AudioCueVariant, string>;
      audioNote: string;
    };
    previewPanel: {
      title: string;
      subtitle: string;
      playButton: string;
      pauseButton: string;
      resetButton: string;
      safeAreaOnButton: string;
      safeAreaOffButton: string;
      currentReadoutLabel: string;
    };
    exportPanel: {
      title: string;
      subtitle: string;
      outputFormatTitle: string;
      pngSequenceLabel: string;
      pngSequenceDescription: string;
      webmLabel: string;
      webmDescription: string;
      vp9AlphaLabel: string;
      vp9AlphaDescription: string;
      hevcAlphaLabel: string;
      hevcAlphaDescription: string;
      // Optional so locales without MP4 copy fall back to the English strings
      // built into the export panel (same pattern as mobileExportLimitError?).
      mp4Label?: string;
      mp4Description?: string;
      fpsLabel: string;
      fpsOptions: Record<24 | 30, string>;
      qualityLabel: string;
      launchNoteTitle: string;
      launchNoteFallback: string;
      exportButtonIdle: string;
      exportButtonBusy: string;
      cancelButton?: string;
      exportStatusTitle: string;
      exportStatusIdle: string;
      qualityOptions: Record<ExportQualityPreset, string>;
      advisoryMessages: {
        workerSupportError: string;
        webmUnavailableError: string;
        webmAudioUnavailableError?: string;
        vp9AlphaUnavailableError: string;
        hevcAlphaUnavailableError: string;
        mobileExportLimitError?: string;
        webmRealtimeWarning?: string;
        heavyExportWarning: string;
        pngSequenceInfo: string;
        vp9AlphaInfo: string;
        hevcAlphaInfo: string;
      };
      runtimeMessages: {
        exportReadyTemplate: string;
        preparingWebm: string;
        preparingPngSequence: string;
        preparingAlphaVideo: string;
        preparingMp4?: string;
        exportWorkerUnavailable: string;
        webmFailedUnexpectedly: string;
        alphaVideoFailedUnexpectedly: string;
        mp4FailedUnexpectedly?: string;
        pngSequenceFailedUnexpectedly: string;
      };
      // Optional perceived-wait copy for the live export progress view. Optional
      // so non-English locales can omit it and fall back to built-in English
      // defaults; the numeric parts (percent, ETA) are language-neutral.
      progress?: {
        remainingTemplate: string;
        previewLabel: string;
        elapsedLabel: string;
        tips: readonly string[];
        desktopNote: string;
        fallbackSuggestionTemplate: string;
        stageLabels: {
          validating: string;
          rendering: string;
          encoding: string;
          packaging: string;
          complete: string;
        };
      };
    };
    // Optional so locales without Pro copy fall back to the English strings
    // built into the generator components (spec 6.4: en + zh-hans required,
    // every other locale uses the English fallback).
    pro?: {
      // Shown under the duration input after a free user's request is clamped
      // back to the free cap (spec 6.1).
      durationUpsellHint: string;
      fps60Label?: string;
      // Export-panel badge for unlocked Pro sessions (spec 6.2).
      proEnabledLabel: string;
      // Badge on the 12 Pro-gated templates in the gallery.
      proBadgeLabel: string;
      paywall: {
        // Generic headline, used for the "direct" trigger.
        title: string;
        // Headlines matched to the action that opened the paywall.
        titleDuration: string;
        titleFps: string;
        titleTemplate: string;
        benefitDuration: string;
        benefitFps: string;
        benefitTemplates: string;
        benefitFutureTemplates: string;
        priceNote: string;
        priceTemplate: string;
        regionalPriceNote: string;
        trustNote: string;
        quoteLoading: string;
        quoteRetry: string;
        quoteChanged: string;
        // Plain label for CTAs outside the modal and while the price loads.
        unlockButton: string;
        unlockButtonTemplate: string;
        unavailableMessage: string;
        errorMessage: string;
        restoreHeading: string;
        restoreEmailLabel: string;
        restoreEmailPlaceholder: string;
        restoreButton: string;
        restoreSuccessMessage: string;
        restoreNotFoundMessage: string;
        closeLabel: string;
      };
    };
  };
  seoSection: {
    notesEyebrow: string;
    heading: string;
    description: string;
    exportFormatsTitle: string;
    exportFormatsPngText: string;
    exportFormatsWebmText: string;
    workflowEyebrow: string;
    workflowHeading: string;
    workflowSteps: readonly RootContentStep[];
    usageEyebrow: string;
    usageHeading: string;
    usageNotes: readonly string[];
    usageCta: RootDualLinkCta;
    aboutEyebrow: string;
    aboutHeading: string;
    aboutPoints: readonly string[];
    aboutCta: RootInlineCta;
    faqTitle: string;
    faqSubtitle: string;
    faqItems: readonly RootFaqItem[];
  };
  guidesSection?: {
    eyebrow: string;
    heading: string;
    intro: string;
    links: readonly {
      slug: string;
      label: string;
    }[];
  };
};
