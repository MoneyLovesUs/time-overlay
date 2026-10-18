import type { RootPageContent } from "@/content/root/types";

const enRootPageContent = {
  metadata: {
    title:
      "Countdown Timer Overlay Generator — Transparent Timer | Time Overlay",
    description:
      "Time Overlay builds a transparent countdown in your browser. Export PNG frames for editing or WebM with alpha for OBS and Streamlabs. No footage upload.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "Build a transparent timer overlay, preview the countdown, then export it for your video edit.",
    intro: "Recommended first timer overlay: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Time Overlay is a free countdown timer overlay tool for creators who need clean, readable transparent timers in recordings, edits, and live streams.",
    header: {
      shellLabel: "Public Shell",
      toolLinkLabel: "Tool",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "System Rail",
      publicStatusLabel: "Public Status",
      identityTitle: "Identity",
      jumpTitle: "Jump",
      productTitle: "Product",
      jumpLinks: [
        { anchorId: "tool", label: "Generator" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formats" },
      ],
      productDescription:
        "One local-first Time Overlay page for countdown assets, a compact Time Overlay FAQ, and export format guidance.",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "Template library",
      description:
        "Start with a proven layout. Your duration and export choices stay put.",
      browseLabel: "Browse all 48",
      searchPlaceholder: "Search templates or use cases",
      categoryLabels: {
        all: "All",
        editing: "Editing",
        streaming: "Streaming",
        social: "Social",
        events: "Events",
        fitness: "Fitness",
        cinematic: "Cinematic",
        minimal: "Minimal",
      },
      selectedLabel: "Selected",
      editedLabel: "Edited",
      resultTemplate: "{count} templates",
      noResults: "No templates match this filter.",
      closeLabel: "Close template library",
    },
    themePresetPicker: {
      title: "Theme preset",
      description: "Pick a starting look, then adjust controls only if needed.",
      presetLabels: {
        cyber: "Cyber",
        minimal: "Minimal",
        mono: "Mono",
        neon: "Neon",
        glow: "Glow",
        scanline: "Scanline",
        classic: "Classic",
        retro: "Retro 80s",
        glass: "Glass",
        neumorphic: "Neumorphic",
      },
    },
    controlPanel: {
      title: "Controls",
      subtitle: "Input stack",
      timerSetupTitle: "Timer setup",
      durationLabel: "Duration (seconds)",
      displayFormatLabel: "Display format",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Resolution preset",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Background mode",
      styleTitle: "Style",
      fontFamilyLabel: "Font family",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Anchor",
      anchorOptions: {
        "top-left": "Top Left",
        "top-center": "Top Center",
        "top-right": "Top Right",
        "center-left": "Center Left",
        center: "Center",
        "center-right": "Center Right",
        "bottom-left": "Bottom Left",
        "bottom-center": "Bottom Center",
        "bottom-right": "Bottom Right",
      },
      transparentOptionLabel: "Transparent",
      solidOptionLabel: "Solid",
      audioTitle: "Audio",
      audioVariantLabel: "Audio cues",
      audioVariantOptions: {
        none: "None",
        tick: "Tick every second",
        beep: "Final beep only",
        "tick-and-beep": "Tick + final beep",
      },
      audioNote:
        "Audio is embedded in WebM (with alpha) exports. PNG sequence is silent.",
    },
    previewPanel: {
      title: "Preview",
      subtitle: "Live canvas scaffold",
      playButton: "Play Preview",
      pauseButton: "Pause",
      resetButton: "Reset",
      safeAreaOnButton: "Safe Area On",
      safeAreaOffButton: "Safe Area Off",
      currentReadoutLabel: "Current readout",
    },
    exportPanel: {
      title: "Export",
      subtitle: "Delivery bay",
      outputFormatTitle: "Output format",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription:
        "Most reliable for editors and transparent handoff.",
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Transparent VP8 video for OBS and Streamlabs. Add it as a Media Source with the background already removed.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "A smaller transparent video for OBS and workflows where VP9 alpha has been tested. Editor import support varies.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription:
        "Apple-friendly transparent video. Best on Safari and macOS.",
      mp4Label: "MP4 (green screen)",
      mp4Description:
        "MP4 with a solid green background. Works in CapCut, InShot and other phone editors — use Chroma Key to remove the green.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Quality",
      launchNoteTitle: "Launch note",
      launchNoteFallback:
        "Export remains local-first. Device-aware limits keep large jobs off memory-constrained browsers and point 4K or long exports to desktop.",
      exportButtonIdle: "Export asset",
      exportButtonBusy: "Exporting...",
      cancelButton: "Cancel export",
      exportStatusTitle: "Export status",
      exportStatusIdle: "Idle. Choose a format and start a local export.",
      qualityOptions: {
        standard: "Standard",
        high: "High",
      },
      advisoryMessages: {
        workerSupportError:
          "This browser cannot start the background worker required for PNG and offline video exports. Retry in a modern browser; real-time WebM may still be available.",
        webmUnavailableError:
          "WebM export is not available in this browser. Safari added WebM recording in 18.4, but this exporter also needs canvas capture, which may still be unavailable on iPhone and iPad.",
        webmAudioUnavailableError:
          "This browser cannot record transparent WebM with an Opus audio track. Turn Audio Cues off and retry, or use a supported desktop browser.",
        vp9AlphaUnavailableError:
          "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError:
          "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        mobileExportLimitError:
          "This job is too large for a reliable phone or tablet export. Use 720p for up to 60 seconds, keep 1080p near 30 seconds, and move 4K or longer work to desktop.",
        webmRealtimeWarning:
          "WebM records in real time. This export will take at least as long as the timer, and you must keep this tab in the foreground until the download starts.",
        heavyExportWarning:
          "This desktop export is likely to be heavy on memory and CPU. Consider 720p or a shorter duration if your browser starts to struggle.",
        pngSequenceInfo:
          "PNG sequence is the most reliable local-first handoff for editors, especially when transparency matters.",
        vp9AlphaInfo:
          "WebM VP9 + alpha is a compact transparent format for OBS and verified VP9-alpha workflows.",
        hevcAlphaInfo:
          "MOV HEVC + alpha is the recommended transparent video format for Final Cut Pro.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export ready: {fileName}",
        preparingWebm: "Preparing local WebM export",
        preparingPngSequence: "Preparing local PNG sequence export",
        preparingAlphaVideo: "Preparing transparent video export",
        preparingMp4: "Preparing local MP4 export",
        exportWorkerUnavailable:
          "Export worker is unavailable in this browser session.",
        webmFailedUnexpectedly: "WebM export failed unexpectedly.",
        alphaVideoFailedUnexpectedly:
          "Transparent video export failed unexpectedly.",
        mp4FailedUnexpectedly: "MP4 export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "PNG sequence export failed unexpectedly.",
      },
      progress: {
        remainingTemplate: "{time} left",
        previewLabel: "Live preview",
        elapsedLabel: "Building your overlay",
        tips: [
          "Everything renders locally in your browser — your frames never leave this device.",
          "PNG preserves lossless alpha; test sequence timing in your target editor before a long export.",
          "Keep this tab in focus for the fastest export.",
          "Transparent exports drop straight onto your footage — no green screen needed.",
        ],
        desktopNote:
          "On phones and tablets, use 720p for up to 60 seconds or keep 1080p near 30 seconds, and keep this page visible while exporting. Use desktop for 4K or longer jobs.",
        fallbackSuggestionTemplate: "Tip: try {format} instead.",
        stageLabels: {
          validating: "Preparing export",
          rendering: "Rendering frames",
          encoding: "Encoding video",
          packaging: "Packaging files",
          complete: "Done",
        },
      },
    },
    pro: {
      durationUpsellHint:
        "That is past the free 5-minute limit. Pro unlocks durations up to 60 minutes.",
      fps60Label: "60 FPS (Pro)",
      proEnabledLabel: "Pro enabled",
      proBadgeLabel: "Pro",
      paywall: {
        title: "Unlock Time Overlay Pro",
        titleDuration: "Export timers up to 60 minutes",
        titleFps: "Export smooth 60 FPS timers",
        titleTemplate: "Export with this Pro template",
        benefitDuration: "Timers up to 60 minutes",
        benefitFps: "60 FPS exports",
        benefitTemplates: "12 extra Pro templates",
        benefitFutureTemplates: "Future Pro templates included",
        priceNote: "$9 one-time payment · lifetime access, no subscription.",
        priceTemplate: "{price} one-time payment · lifetime access, no subscription.",
        regionalPriceNote: "Regional pricing applied.",
        trustNote: "Secure checkout by Stripe · 14-day full refund",
        quoteLoading: "Loading price…",
        quoteRetry: "Retry price",
        quoteChanged: "Price updated. Please review it and click unlock again.",
        unlockButton: "Unlock Pro",
        unlockButtonTemplate: "Unlock for {price}",
        unavailableMessage:
          "Payments are temporarily unavailable. Please try again later.",
        errorMessage: "Something went wrong starting checkout. Please retry.",
        restoreHeading: "Already purchased? Restore purchase",
        restoreEmailLabel: "Email used for purchase",
        restoreEmailPlaceholder: "you@example.com",
        restoreButton: "Restore purchase",
        restoreSuccessMessage: "Pro unlocked on this device.",
        restoreNotFoundMessage:
          "No Pro purchase found for that email address.",
        closeLabel: "Close",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Tool Notes",
    heading:
      "A real countdown timer overlay tool with transparent exports.",
    description:
      "Time Overlay is a local-first transparent timer overlay generator for readable countdown assets. Use the controls above to set duration, style, position, and export format, then read on for the practical choices that matter in a real edit.",
    exportFormatsTitle: "Time Overlay transparent timer overlay export formats",
    exportFormatsPngText:
      "PNG sequence is the most dependable countdown timer overlay export when you need transparent frames or editor-friendly image assets.",
    exportFormatsWebmText:
      "WebM (with alpha) is the single-file option for OBS and Streamlabs. Editing-app support varies, so use a PNG sequence when the destination editor does not document alpha-enabled WebM import.",
    workflowEyebrow: "How it works",
    workflowHeading: "How the countdown timer overlay export works",
    workflowSteps: [
      {
        title: "Set the countdown timer overlay duration and layout",
        body:
          "Start in the generator above. Pick the total duration, choose a clean countdown layout, and place the overlay where it stays readable over gameplay, product footage, or talking-head edits.",
      },
      {
        title: "Pick a transparent timer overlay style for your footage",
        body:
          "Adjust typography, contrast, scale, and placement so the overlay feels intentional instead of pasted on. The strongest timer overlays use bold numerals, stable spacing, and enough breathing room from the frame edge.",
      },
      {
        title: "Export the timer overlay format that fits your editor",
        body:
          "Use a PNG sequence for the broadest editor compatibility, including Premiere and DaVinci Resolve. Use WebM (with alpha) when you need a single transparent media file for OBS or Streamlabs.",
      },
    ],
    usageEyebrow: "How to use",
    usageHeading: "How to use Time Overlay in your video",
    usageNotes: [
      "Open the generator, set the timer length, and preview the overlay before exporting anything.",
      "Use the PNG sequence for a transparent timer overlay in Premiere Pro, DaVinci Resolve, or another workflow that accepts image assets. Check your editor's sequence-import behavior before a deadline.",
      "Use the WebM (with alpha) export when you want a single transparent countdown timer overlay video for OBS or Streamlabs.",
      "Keep the overlay short, high-contrast, and away from captions or face framing so it survives mobile viewing.",
    ],
    usageCta: {
      beforeFirstLink: "Start in the ",
      firstLinkLabel: "live timer overlay generator",
      betweenLinks: "and use the ",
      secondLinkLabel: "countdown overlay export guide",
      afterSecondLink:
        "below it when you are deciding between transparent frames and a single timer overlay video file.",
    },
    aboutEyebrow: "About",
    aboutHeading: "About Time Overlay",
    aboutPoints: [
      "Time Overlay is a local-first countdown timer overlay generator built for creators who need transparent countdown graphics without uploading footage to a remote render service.",
      "The generator keeps the working controls, export guidance, and troubleshooting notes together so creators can make an asset and understand how to hand it off to another application.",
      "Our guides distinguish documented support from practical recommendations, list the sources we reviewed, and show a last-reviewed date so compatibility advice can be checked over time.",
    ],
    aboutCta: {
      beforeLink:
        "Read more about the project's local-first approach and editorial process on the ",
      linkLabel: "About page",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Timer overlay essentials",
    faqItems: [
      {
        question: "How do I add a timer overlay to a video?",
        answer:
          "Set the duration and style in the generator above, then export. Choose PNG sequence for the broadest editor compatibility, or WebM (with alpha) for a single transparent file in OBS or Streamlabs. Import the result and place it on a layer above your footage.",
      },
      {
        question: "Can I make a transparent timer overlay for OBS or Twitch?",
        answer:
          "Yes. Export WebM (with alpha) and add it as a Media Source in OBS or Streamlabs. The background is already cut out, so the countdown sits over your scene without an extra chroma-key step. Twitch Studio is omitted because Twitch ended support after May 30, 2024.",
      },
      {
        question:
          "What is the difference between a timer overlay and a countdown overlay?",
        answer:
          "They usually mean the same thing: a timer overlay that counts down from a set duration to zero on top of your video. This tool builds a transparent countdown timer overlay, so set the total seconds, pick a display format like MM:SS, and export it for your editor.",
      },
      {
        question: "Can I export a Time Overlay with transparency?",
        answer:
          "Yes. The safest route is a PNG sequence, because editors handle image-based transparent assets more reliably than compressed video. The WebM (with alpha) export is the single-file alternative when you want a transparent video layer instead of an image sequence.",
      },
      {
        question: "Which export format should I pick first?",
        answer:
          "Start with PNG sequence if you want the most dependable handoff, especially for compositing over real footage. Choose WebM (with alpha) when you want a single transparent video file for OBS or Streamlabs.",
      },
      {
        question: "Is the timer overlay generator rendered on the server?",
        answer:
          "No. The generator is local-first. Preview and export run on your own machine, so the page behaves like a real tool instead of waiting on a remote render queue.",
      },
      {
        question: "What timer overlay style reads best on video?",
        answer:
          "Simple numerals with strong contrast usually win. Monospaced digits, restrained glow, and careful corner placement keep the timer readable over busy footage better than decorative timer skins.",
      },
      {
        question:
          "Does the timer overlay work for TikTok, YouTube, CapCut, and Premiere?",
        answer:
          "The exported overlay is platform-agnostic; compatibility depends on the editing app used before upload. PNG sequences are the safer editor handoff, while WebM (with alpha) is intended for OBS and Streamlabs. Test a short export in your exact app version before producing a long timer.",
      },
    ],
  },
  guidesSection: {
    eyebrow: "Guides",
    heading: "How to add a timer overlay in your editor",
    intro:
      "Step-by-step guides for dropping a transparent countdown timer overlay into the tools creators actually use.",
    links: [
      {
        slug: "add-countdown-to-obs",
        label: "Add a timer overlay countdown in OBS Studio",
      },
      {
        slug: "add-countdown-to-premiere",
        label: "Add a transparent timer overlay in Premiere Pro",
      },
      {
        slug: "add-countdown-to-davinci-resolve",
        label: "Add a countdown timer overlay in DaVinci Resolve",
      },
      {
        slug: "add-countdown-to-final-cut-pro",
        label: "Add a timer overlay countdown in Final Cut Pro",
      },
      {
        slug: "transparent-overlay-for-twitch",
        label: "Make a transparent timer overlay for Twitch",
      },
      {
        slug: "png-to-prores",
        label: "Convert a timer overlay PNG sequence to ProRes 4444",
      },
    ],
  },
} satisfies RootPageContent;

export default enRootPageContent;
