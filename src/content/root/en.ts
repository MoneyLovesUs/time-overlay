import type { RootPageContent } from "@/content/root/types";

const enRootPageContent = {
  metadata: {
    title: "Overlay Timer Generator for PNG Sequence and WebM Export",
    description:
      "Build an overlay timer directly in the browser, preview it live, and export PNG sequence or WebM assets from one local-first tool page.",
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
        { href: "/#tool", label: "Generator" },
        { href: "/#faq", label: "FAQ" },
        { href: "/#export-formats", label: "Formats" },
      ],
      productDescription:
        "One local-first tool page for countdown overlays, compact FAQ, and export format guidance.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Theme preset",
      description: "Pick a starting look, then adjust controls only if needed.",
    },
    controlPanel: {
      title: "Controls",
      subtitle: "Input stack",
      timerSetupTitle: "Timer setup",
      durationLabel: "Duration (seconds)",
      displayFormatLabel: "Display format",
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Resolution preset",
      backgroundModeLabel: "Background mode",
      styleTitle: "Style",
      fontFamilyLabel: "Font family",
      anchorLabel: "Anchor",
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
      qualityLabel: "Quality",
      launchNoteTitle: "Launch note",
      launchNoteFallback:
        "Export remains local-first in the MVP. If a format is unsupported in the current browser, the UI will steer users toward PNG sequence.",
      exportButtonIdle: "Export asset",
      exportButtonBusy: "Exporting...",
      exportStatusTitle: "Export status",
      exportStatusIdle: "Idle. Choose a format and start a local export.",
      standardQualityLabel: "Standard",
      highQualityLabel: "High",
    },
    preview: {
      playButton: "Play Preview",
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
