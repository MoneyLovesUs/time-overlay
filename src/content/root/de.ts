import type { RootPageContent } from "@/content/root/types";

const deRootPageContent = {
  metadata: {
    title: "Overlay-Timer-Generator für PNG Sequence- und WebM-Export",
    description:
      "Erstelle einen Overlay-Timer direkt im Browser, prüfe ihn live in der Vorschau und exportiere Assets als PNG Sequence oder WebM auf einer einzigen Local-First-Seite.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Overlay-Timer-Tools für Creator, die gut lesbare Countdowns in Aufnahmen und Livestreams brauchen.",
    header: {
      shellLabel: "Öffentliche Shell",
      toolLinkLabel: "Tool",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Systemleiste",
      publicStatusLabel: "Öffentlicher Status",
      identityTitle: "Identität",
      jumpTitle: "Sprungziele",
      productTitle: "Produkt",
      jumpLinks: [
        { href: "/#tool", label: "Generator" },
        { href: "/#faq", label: "FAQ" },
        { href: "/#export-formats", label: "Formate" },
      ],
      productDescription:
        "Eine Local-First-Toolseite für Countdown-Overlays, kompaktes FAQ und Hinweise zu Exportformaten.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Theme-Preset",
      description:
        "Wähle einen Start-Look und passe die Controls nur bei Bedarf an.",
    },
    controlPanel: {
      title: "Steuerung",
      subtitle: "Eingabestapel",
      timerSetupTitle: "Timer-Setup",
      durationLabel: "Dauer (Sekunden)",
      displayFormatLabel: "Anzeigeformat",
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Auflösungs-Preset",
      backgroundModeLabel: "Hintergrundmodus",
      styleTitle: "Stil",
      fontFamilyLabel: "Schriftfamilie",
      anchorLabel: "Anker",
      transparentOptionLabel: "Transparent",
      solidOptionLabel: "Vollfarbe",
    },
    previewPanel: {
      title: "Vorschau",
      subtitle: "Live-Canvas",
      playButton: "Vorschau starten",
      pauseButton: "Pausieren",
      resetButton: "Zurücksetzen",
      safeAreaOnButton: "Sicherheitsbereich an",
      safeAreaOffButton: "Sicherheitsbereich aus",
      currentReadoutLabel: "Aktuelle Anzeige",
    },
    exportPanel: {
      title: "Export",
      subtitle: "Ausgabezone",
      outputFormatTitle: "Ausgabeformat",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription:
        "Am zuverlässigsten für Schnittprogramme und transparente Übergabe.",
      webmLabel: "WebM",
      webmDescription:
        "Gut für leichten lokalen Videoexport auf unterstützten Browsern.",
      fpsLabel: "FPS",
      qualityLabel: "Qualität",
      launchNoteTitle: "Hinweis",
      launchNoteFallback:
        "Export bleibt im MVP local-first. Wenn ein Format im aktuellen Browser nicht unterstützt wird, leitet die UI zu PNG Sequence.",
      exportButtonIdle: "Asset exportieren",
      exportButtonBusy: "Export läuft...",
      exportStatusTitle: "Exportstatus",
      exportStatusIdle:
        "Leerlauf. Wähle ein Format und starte einen lokalen Export.",
      standardQualityLabel: "Standard",
      highQualityLabel: "Hoch",
    },
  },
  seoSection: {
    notesEyebrow: "Tool-Hinweise",
    heading:
      "Eine Toolseite plus genau der Kontext, den man für den Einsatz braucht.",
    description:
      "Time Overlay ist als Local-First-Overlay-Timer-Generator konzipiert. Stelle oben Dauer, Stil, Position und Exportformat ein; dieser untere Bereich beantwortet die wenigen Fragen, die für SEO und reale Workflow-Entscheidungen wichtig bleiben.",
    exportFormatsTitle: "Exportformate",
    exportFormatsPngText:
      "PNG Sequence ist der verlässlichste lokale Export, wenn transparente Overlays oder editorfreundliche Assets gefragt sind.",
    exportFormatsWebmText:
      "WebM ist als browsernativer Komfortpfad verfügbar, wenn die aktuelle Umgebung ihn stabil unterstützt.",
    faqTitle: "FAQ",
    faqSubtitle: "Overlay-Timer Grundlagen",
    faqItems: [
      {
        question: "Kann ich einen Overlay-Timer mit Transparenz exportieren?",
        answer:
          "Ja. Der sicherste Local-First-Weg ist PNG Sequence, weil Schnittprogramme bildbasierte transparente Assets zuverlässiger verarbeiten als komprimierte Video-Workflows. WebM ist verfügbar, wenn der Browser es unterstützt, aber bei Transparenz bleibt PNG Sequence meist die robusteste Übergabe.",
      },
      {
        question: "Welches Exportformat sollte ich zuerst wählen?",
        answer:
          "Starte mit PNG Sequence, wenn du die stabilste Übergabe in Schnittprogramme willst, besonders fürs Compositing über Realmaterial. Nimm WebM, wenn du einen leichteren lokalen Videoexport brauchst und dein Browser den Weg sauber unterstützt.",
      },
      {
        question: "Wird dieses Tool auf dem Server gerendert?",
        answer:
          "Nein. Das Kernerlebnis ist local-first. Vorschau und Export laufen auf dem Gerät der Nutzer, sodass sich die Startseite wie ein echtes Tool anfühlt statt wie eine entfernte Render-Warteschlange.",
      },
      {
        question: "Welcher Timer-Stil ist im Video am besten lesbar?",
        answer:
          "Einfache Ziffern mit starkem Kontrast funktionieren meist am besten. Monospace-Zahlen, zurückhaltendes Glow und saubere Eckplatzierung sind über unruhigem Footage besser lesbar als dekorative Timer-Skins.",
      },
      {
        question:
          "Kann ich das für TikTok, YouTube und Editoren wie CapCut oder Premiere nutzen?",
        answer:
          "Ja, aber der Übergabepfad variiert. Short-Form- und Editor-Workflows profitieren oft von transparenten oder bildsequenzbasierten Exports; schneller lokaler WebM-Export passt, wenn nur ein leichtes Asset nötig ist.",
      },
    ],
  },
} satisfies RootPageContent;

export default deRootPageContent;
