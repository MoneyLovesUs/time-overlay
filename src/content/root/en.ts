import type { RootPageContent } from "@/content/root/types";

const enRootPageContent = {
  metadata: {
    title: "Time Overlay — Free Transparent Timer Overlay Generator",
    description:
      "Time Overlay is a free transparent timer overlay generator. Build a countdown overlay timer in your browser and export PNG or WebM with alpha for any editor.",
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
      "Time Overlay is the free countdown timer overlay tool for creators who need clean, readable countdowns in recordings and live streams.",
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
        "Transparent VP8 video. Drops into OBS, Premiere, DaVinci, CapCut, and Streamlabs as a video layer with the background already cut out.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Transparent video for Premiere, DaVinci Resolve, Final Cut, and CapCut.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription:
        "Apple-friendly transparent video. Best on Safari and macOS.",
      proBadge: "Pro",
      proLockedHint: "Pro unlocks this format. Click to upgrade.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Quality",
      launchNoteTitle: "Launch note",
      launchNoteFallback:
        "Export remains local-first in the MVP. If a format is unsupported in the current browser, the UI will steer users toward PNG sequence.",
      exportButtonIdle: "Export asset",
      exportButtonBusy: "Exporting...",
      exportStatusTitle: "Export status",
      exportStatusIdle: "Idle. Choose a format and start a local export.",
      qualityOptions: {
        standard: "Standard",
        high: "High",
      },
      advisoryMessages: {
        workerSupportError:
          "This browser cannot spin up a background worker, so local video export is disabled. Use PNG sequence on a modern desktop browser instead.",
        webmUnavailableError:
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError:
          "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError:
          "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "This export is likely to be heavy on memory and CPU. Consider 720p, 30 seconds, or PNG sequence if your browser starts to struggle.",
        pngSequenceInfo:
          "PNG sequence is the most reliable local-first handoff for editors, especially when transparency matters.",
        vp9AlphaInfo:
          "WebM VP9 + alpha is the recommended transparent video format for modern editors.",
        hevcAlphaInfo:
          "MOV HEVC + alpha is the recommended transparent video format for Final Cut Pro.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export ready: {fileName}",
        preparingWebm: "Preparing local WebM export",
        preparingPngSequence: "Preparing local PNG sequence export",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable:
          "Export worker is unavailable in this browser session.",
        webmFailedUnexpectedly: "WebM export failed unexpectedly.",
        alphaVideoFailedUnexpectedly:
          "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "PNG sequence export failed unexpectedly.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Tool Notes",
    heading:
      "One Time Overlay tool page, plus the context needed to use it well.",
    description:
      "Time Overlay is designed as a local-first generator for readable countdown assets. Use the controls above to configure duration, style, position, and export format, then keep this lower section for the questions that still matter for SEO and real-world workflow choices.",
    exportFormatsTitle: "Export formats",
    exportFormatsPngText:
      "PNG sequence is the most dependable Time Overlay export when you need transparent frames or editor-friendly image assets.",
    exportFormatsWebmText:
      "WebM (with alpha) is the single-file transparent Time Overlay video path. The VP8 output drops into Premiere, DaVinci, CapCut, OBS, and Streamlabs as a video layer with the Time Overlay background already cut out.",
    workflowEyebrow: "How it works",
    workflowHeading: "How Time Overlay export works",
    workflowSteps: [
      {
        title: "Set the Time Overlay duration and layout",
        body:
          "Start in the Time Overlay generator above. Pick the total duration, choose a clean clock layout, and place the Time Overlay where it will stay readable over gameplay, product footage, or talking-head edits.",
      },
      {
        title: "Pick a Time Overlay style for your footage",
        body:
          "Adjust typography, contrast, scale, and placement so the Time Overlay feels intentional instead of pasted on. The strongest Time Overlay looks use bold numerals, stable spacing, and enough breathing room from the frame edge.",
      },
      {
        title: "Export the Time Overlay format that fits your editor",
        body:
          "Ship the Time Overlay as PNG sequence for master-grade transparency in Premiere, DaVinci, or Final Cut. Ship the Time Overlay as WebM (with alpha) for a single transparent video file that drops into CapCut and OBS as a video layer.",
      },
    ],
    usageEyebrow: "How to use",
    usageHeading: "How to use Time Overlay",
    usageNotes: [
      "Open the Time Overlay generator, set the timer length, and preview the Time Overlay before exporting anything.",
      "Use the Time Overlay PNG sequence for transparent overlays in CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve, or any workflow that prefers image assets.",
      "Use the Time Overlay WebM (with alpha) export when you want a single transparent video file for OBS, Streamlabs, or a quick social edit.",
      "Keep the Time Overlay short, high-contrast, and away from captions or face framing so it survives mobile viewing.",
    ],
    usageCta: {
      beforeFirstLink: "Start in the ",
      firstLinkLabel: "live Time Overlay generator",
      betweenLinks: "and use the ",
      secondLinkLabel: "Time Overlay export guide",
      afterSecondLink:
        "below it when you are deciding between transparent frames and a single Time Overlay video file.",
    },
    aboutEyebrow: "About",
    aboutHeading: "About Time Overlay",
    aboutPoints: [
      "Time Overlay is a local-first Time Overlay generator built for creators who need countdown graphics without uploading footage to a remote render service.",
      "The Time Overlay page is intentionally compact: one working tool surface, one export explanation block, and one SEO support area that answers the workflow questions people search for before trusting a timer tool.",
      "That makes Time Overlay useful both as a real production utility and as a crawlable Time Overlay landing page for related queries such as timer overlay, overlay timer, transparent timer overlay, and countdown timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink:
        "If you only need the practical objections handled first, jump to the ",
      linkLabel: "Time Overlay FAQ",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Time Overlay essentials",
    faqItems: [
      {
        question: "Can I export a Time Overlay with transparency?",
        answer:
          "Yes. The safest Time Overlay route is PNG sequence because editors handle image-based transparent assets more reliably than compressed video. The Time Overlay WebM (with alpha) export is the single-file alternative when you want a transparent video layer instead of an image sequence.",
      },
      {
        question: "Which Time Overlay export format should I pick first?",
        answer:
          "Start with PNG sequence if you want the most dependable Time Overlay handoff, especially for compositing over real footage. Choose the Time Overlay WebM (with alpha) export when you want a single transparent video file ready for CapCut, OBS, or Streamlabs.",
      },
      {
        question: "Is the Time Overlay generator rendered on the server?",
        answer:
          "No. The Time Overlay generator is local-first. Preview and export run on the user's machine so the Time Overlay homepage behaves like a real tool instead of waiting on a remote render queue.",
      },
      {
        question: "What Time Overlay style reads best on video?",
        answer:
          "Simple Time Overlay numerals with strong contrast usually win. Monospaced digits, restrained glow, and careful corner placement keep the Time Overlay readable over busy footage better than decorative timer skins.",
      },
      {
        question:
          "Does Time Overlay work for TikTok, YouTube, CapCut, and Premiere?",
        answer:
          "Yes. Time Overlay supports short-form and editor workflows that need transparent or image-sequence exports, and the Time Overlay WebM (with alpha) export covers quick local video exports for OBS, CapCut, and Streamlabs without a separate compositing step.",
      },
    ],
  },
} satisfies RootPageContent;

export default enRootPageContent;
