import type { RootPageContent } from "@/content/root/types";

const deRootPageContent = {
  metadata: {
    title: "Overlay-Timer-Generator für PNG Sequence- und WebM-Export",
    description:
      "Erstelle einen Overlay-Timer direkt im Browser, prüfe ihn live in der Vorschau und exportiere Assets als PNG Sequence oder WebM auf einer einzigen Local-First-Seite.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "Lege die Dauer fest, prüfe den Frame in der Vorschau und exportiere dann dein Timer-Asset.",
    intro:
      "Empfohlener erster Test: `30s`, `PNG sequence`, `bottom-right`.",
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
        { anchorId: "tool", label: "Generator" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formate" },
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
    workflowEyebrow: "So funktioniert es",
    workflowHeading: "So funktioniert der Export eines Overlay-Timers",
    workflowSteps: [
      {
        title: "Countdown-Dauer und Layout festlegen",
        body:
          "Starte im Generator oben. Wähle die Gesamtdauer, entscheide dich für ein sauberes Uhr-Layout und platziere das Overlay dort, wo es über Gameplay, Produktaufnahmen oder Talking-Head-Szenen gut lesbar bleibt.",
      },
      {
        title: "Einen Timer-Stil für dein Footage wählen",
        body:
          "Passe Typografie, Kontrast, Größe und Position so an, dass der Countdown bewusst gestaltet wirkt statt aufgeklebt. Die stärksten Overlay-Timer arbeiten meist mit klaren Ziffern, stabilem Rhythmus und genug Abstand zum Bildrand.",
      },
      {
        title: "Das passende Format für deinen Editor exportieren",
        body:
          "Nutze PNG Sequence, wenn du den sichersten transparenten Asset-Workflow brauchst, oder WebM, wenn für deinen Schnitt ein leichter lokaler Videofile genügt.",
      },
    ],
    usageEyebrow: "Anwendung",
    usageHeading: "So nutzt du Time Overlay",
    usageNotes: [
      "Öffne den Generator, stelle die Timer-Länge ein und prüfe die Vorschau, bevor du irgendetwas exportierst.",
      "Nutze PNG Sequence für transparente Overlays in CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve oder jedem Workflow, der lieber mit Bild-Assets arbeitet.",
      "Nutze WebM, wenn du einen schnellen Browser-Export für Mockups, Rough Cuts oder leichte Social-Edits brauchst.",
      "Halte den Timer kurz, kontrastreich und fern von Untertiteln oder Gesichtsausschnitten, damit er auf Mobilgeräten lesbar bleibt.",
    ],
    usageCta: {
      beforeFirstLink: "Starte im ",
      firstLinkLabel: "Live-Generator",
      betweenLinks: "und nutze den ",
      secondLinkLabel: "Export-Guide",
      afterSecondLink:
        "darunter, wenn du zwischen transparenten Frames und Browser-Videoausgabe abwägst.",
    },
    aboutEyebrow: "Über",
    aboutHeading: "Über Time Overlay",
    aboutPoints: [
      "Time Overlay ist ein Local-First-Overlay-Timer-Generator für Creator, die Countdown-Grafiken brauchen, ohne Material an einen entfernten Render-Service hochzuladen.",
      "Die Seite ist bewusst kompakt gehalten: eine echte Tool-Oberfläche, ein klarer Exportformat-Block und ein SEO-Bereich, der die Workflow-Fragen beantwortet, nach denen Menschen suchen, bevor sie einem Timer-Tool vertrauen.",
      "Dadurch funktioniert die Homepage sowohl als praktisches Produktionswerkzeug als auch als indexierbare Landingpage für Suchanfragen wie overlay timer, countdown timer overlay, transparent countdown overlay oder timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink:
        "Wenn du zuerst die praktischen Einwände klären willst, springe zum ",
      linkLabel: "Overlay-Timer-FAQ",
      afterLink: ".",
    },
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
