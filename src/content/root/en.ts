import type { RootPageContent } from "@/content/root/types";

const enRootPageContent = {
  metadata: {
    title:
      "Countdown Timer Overlay Generator — Transparent Timer | Time Overlay",
    description:
      "Time Overlay builds a transparent timer overlay or countdown timer overlay in-browser. Export PNG or WebM with alpha for CapCut, Premiere, DaVinci, OBS.",
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
      progress: {
        remainingTemplate: "{time} left",
        previewLabel: "Live preview",
        elapsedLabel: "Building your overlay",
        tips: [
          "Everything renders locally in your browser — your frames never leave this device.",
          "PNG sequence imports cleanly into Premiere, DaVinci Resolve, Final Cut, and CapCut.",
          "Keep this tab in focus for the fastest export.",
          "Transparent exports drop straight onto your footage — no green screen needed.",
        ],
        desktopNote:
          "Heads up: exporting works best on a desktop browser. On mobile, stick to PNG sequence or open this page on your computer.",
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
      "WebM (with alpha) is the single-file transparent timer overlay video. The VP8 output drops into Premiere, DaVinci, CapCut, OBS, and Streamlabs as a video layer with the background already cut out.",
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
          "Ship it as a PNG sequence for master-grade transparency in Premiere, DaVinci, or Final Cut. Ship it as WebM (with alpha) for a single transparent video file that drops into CapCut and OBS as a video layer.",
      },
    ],
    usageEyebrow: "How to use",
    usageHeading: "How to use Time Overlay in your video",
    usageNotes: [
      "Open the generator, set the timer length, and preview the overlay before exporting anything.",
      "Use the PNG sequence for a transparent timer overlay in CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve, or any workflow that prefers image assets.",
      "Use the WebM (with alpha) export when you want a single transparent countdown timer overlay video for OBS, Streamlabs, or a quick social edit.",
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
      "The Time Overlay page is intentionally compact: one working tool surface, one export explanation block, and one help area that answers the questions people search for before they trust a timer overlay tool.",
      "That makes it useful both as a real production utility and as a landing page for related searches such as timer overlay, overlay timer, transparent timer overlay, on-screen timer, and countdown timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink:
        "If you only need the practical objections handled first, jump to the ",
      linkLabel: "timer overlay FAQ",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Timer overlay essentials",
    faqItems: [
      {
        question: "How do I add a timer overlay to a video?",
        answer:
          "Set the duration and style in the generator above, then export. Choose PNG sequence for the most reliable transparent timer overlay, or WebM (with alpha) for a single transparent video file, and drop it onto a layer above your footage in CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve, or OBS.",
      },
      {
        question: "Can I make a transparent timer overlay for OBS or Twitch?",
        answer:
          "Yes. Export the WebM (with alpha) format and add it as a video layer in OBS, Streamlabs, or Twitch Studio. The background is already cut out, so the countdown sits cleanly over your scene without an extra chroma-key step.",
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
          "Start with PNG sequence if you want the most dependable handoff, especially for compositing over real footage. Choose the WebM (with alpha) export when you want a single transparent video file ready for CapCut, OBS, or Streamlabs.",
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
          "Yes. It supports short-form and editor workflows that need transparent or image-sequence exports, and the WebM (with alpha) export covers quick local video exports for OBS, CapCut, and Streamlabs without a separate compositing step.",
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
