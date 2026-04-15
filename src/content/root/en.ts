import type { RootPageContent } from "@/content/root/types";

const enRootPageContent = {
  metadata: {
    title: "Overlay Timer Generator for PNG Sequence and WebM Export",
    description:
      "Build an overlay timer directly in the browser, preview it live, and export PNG sequence or WebM assets from one local-first tool page.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "Set the duration, preview the frame, then export your timer asset.",
    intro: "Recommended first try: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Overlay timer tools for creators who need clean, readable countdowns in recordings and live streams.",
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
        "One local-first tool page for countdown overlays, compact FAQ, and export format guidance.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Theme preset",
      description: "Pick a starting look, then adjust controls only if needed.",
      presetLabels: {
        "minimal-neon": "Minimal Neon",
        "broadcast-alert": "Broadcast Alert",
        "calm-studio": "Calm Studio",
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
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
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
      webmLabel: "WebM",
      webmDescription:
        "Good for lightweight local video export on supported browsers.",
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
          "WebM export is not available in this browser. PNG sequence remains the safest fallback.",
        heavyExportWarning:
          "This export is likely to be heavy on memory and CPU. Consider 720p, 30 seconds, or PNG sequence if your browser starts to struggle.",
        pngSequenceInfo:
          "PNG sequence is the most reliable local-first handoff for editors, especially when transparency matters.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export ready: {fileName}",
        preparingWebm: "Preparing local WebM export",
        preparingPngSequence: "Preparing local PNG sequence export",
        exportWorkerUnavailable:
          "Export worker is unavailable in this browser session.",
        webmFailedUnexpectedly: "WebM export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "PNG sequence export failed unexpectedly.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Tool Notes",
    heading:
      "One tool page, plus the smallest amount of context needed to use it well.",
    description:
      "Time Overlay is designed as a local-first overlay timer generator. Use the controls above to configure duration, style, position, and export format, then keep this lower section for the handful of questions that still matter for SEO and real-world workflow choices.",
    exportFormatsTitle: "Export formats",
    exportFormatsPngText:
      "PNG sequence is the most dependable local export when you need transparent overlays or editor-friendly assets.",
    exportFormatsWebmText:
      "WebM is available as a browser-native convenience path when the current environment supports it cleanly.",
    workflowEyebrow: "How it works",
    workflowHeading: "How overlay timer export works",
    workflowSteps: [
      {
        title: "Set the countdown duration and layout",
        body:
          "Start in the generator above. Pick the total duration, choose a clean clock layout, and place the overlay where it will stay readable over gameplay, product footage, or talking-head edits.",
      },
      {
        title: "Choose a timer style for your footage",
        body:
          "Adjust typography, contrast, scale, and placement so the countdown feels intentional instead of pasted on. The strongest overlay timers usually use bold numerals, stable spacing, and enough breathing room from the frame edge.",
      },
      {
        title: "Export the format that fits your editor",
        body:
          "Export PNG sequence when you need the safest transparent asset workflow, or choose WebM when a lightweight local video file is enough for the project you are cutting.",
      },
    ],
    usageEyebrow: "How to use",
    usageHeading: "How to use Time Overlay",
    usageNotes: [
      "Open the generator, set the timer length, and preview the countdown before exporting anything.",
      "Use PNG sequence for transparent overlays in CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve, or any workflow that prefers image assets.",
      "Use WebM when you want a quick browser export for mockups, rough cuts, or lightweight social edits.",
      "Keep the timer short, high-contrast, and away from captions or face framing so it survives mobile viewing.",
    ],
    usageCta: {
      beforeFirstLink: "Start in the ",
      firstLinkLabel: "live generator",
      betweenLinks: "and use the ",
      secondLinkLabel: "export guide",
      afterSecondLink:
        "below it when you are deciding between transparent frames and browser video output.",
    },
    aboutEyebrow: "About",
    aboutHeading: "About Time Overlay",
    aboutPoints: [
      "Time Overlay is a local-first overlay timer generator built for creators who need countdown graphics without uploading footage to a remote render service.",
      "The page is intentionally compact: one working tool surface, one export explanation block, and one SEO support area that answers the workflow questions people search for before trusting a timer tool.",
      "That makes the homepage useful both as a real production utility and as a crawlable landing page for queries such as overlay timer, countdown timer overlay, transparent countdown overlay, and timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink:
        "If you only need the practical objections handled first, jump to the ",
      linkLabel: "overlay timer FAQ",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Overlay timer essentials",
    faqItems: [
      {
        question: "Can I export an overlay timer with transparency?",
        answer:
          "Yes. The safest local-first route is PNG sequence, because editors handle image-based transparent assets more reliably than compressed video workflows. WebM is available when the browser supports it, but PNG sequence stays the safest handoff when transparency matters most.",
      },
      {
        question: "Which export format should I pick first?",
        answer:
          "Start with PNG sequence if you want the most dependable editor handoff, especially for compositing over real footage. Choose WebM when you want a lighter local video export and your browser already supports it cleanly.",
      },
      {
        question: "Is this tool rendered on the server?",
        answer:
          "No. The core experience is local-first. Preview and export run on the user's machine so the homepage can behave like a real tool instead of waiting on a remote render queue.",
      },
      {
        question: "What timer style reads best on video?",
        answer:
          "Simple numerals with strong contrast usually win. Monospaced digits, restrained glow, and careful corner placement stay readable over busy footage better than decorative timer skins.",
      },
      {
        question:
          "Should I use this for TikTok, YouTube, and editors like CapCut or Premiere?",
        answer:
          "Yes, but the handoff path changes. Short-form and editor workflows usually benefit from transparent or image-sequence exports, while quick local video exports can work when you only need a lightweight WebM asset.",
      },
    ],
  },
} satisfies RootPageContent;

export default enRootPageContent;
