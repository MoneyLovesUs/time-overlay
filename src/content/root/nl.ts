import type { RootPageContent } from "@/content/root/types";

const nlRootPageContent = {
  metadata: {
    title: "Overlay-timer voor video's, streams en tutorials",
    description:
      "Maak direct in de browser een overlay-timer voor video's, livestreams en tutorials, met snelle preview en een duidelijke workflow voor creators.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "Stel de duur in, bekijk het frame en exporteer daarna je timer-asset.",
    intro: "Aanbevolen eerste test: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Overlay-timertools voor makers die schone en goed leesbare countdowns nodig hebben in opnames en livestreams.",
    header: {
      shellLabel: "Publieke shell",
      toolLinkLabel: "Tool",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Systeemrail",
      publicStatusLabel: "Publieke status",
      identityTitle: "Identiteit",
      jumpTitle: "Ga naar",
      productTitle: "Product",
      jumpLinks: [
        { anchorId: "tool", label: "Generator" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formaten" },
      ],
      productDescription:
        "Eén local-first toolpagina voor countdown-overlays, compacte FAQ en uitleg over exportformaten.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Thema-preset",
      description: "Kies eerst een startlook en pas daarna alleen de bediening aan als dat nodig is.",
      presetLabels: {
        "minimal-neon": "Minimal Neon",
        "broadcast-alert": "Broadcast Alert",
        "calm-studio": "Calm Studio",
      },
    },
    controlPanel: {
      title: "Bediening",
      subtitle: "Inputstack",
      timerSetupTitle: "Timerinstelling",
      durationLabel: "Duur (seconden)",
      displayFormatLabel: "Weergaveformaat",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Resolutie-preset",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Achtergrondmodus",
      styleTitle: "Stijl",
      fontFamilyLabel: "Lettertypefamilie",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Anker",
      anchorOptions: {
        "top-left": "Linksboven",
        "top-center": "Boven midden",
        "top-right": "Rechtsboven",
        "center-left": "Midden links",
        center: "Midden",
        "center-right": "Midden rechts",
        "bottom-left": "Linksonder",
        "bottom-center": "Onder midden",
        "bottom-right": "Rechtsonder",
      },
      transparentOptionLabel: "Transparant",
      solidOptionLabel: "Volledig",
    },
    previewPanel: {
      title: "Preview",
      subtitle: "Live-canvas",
      playButton: "Preview afspelen",
      pauseButton: "Pauzeren",
      resetButton: "Resetten",
      safeAreaOnButton: "Safe area aan",
      safeAreaOffButton: "Safe area uit",
      currentReadoutLabel: "Huidige weergave",
    },
    exportPanel: {
      title: "Export",
      subtitle: "Uitgiftezone",
      outputFormatTitle: "Uitvoerformaat",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription:
        "De betrouwbaarste keuze voor editors en transparante overdracht.",
      webmLabel: "WebM",
      webmDescription:
        "Geschikt voor lichte lokale video-export in ondersteunde browsers.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Kwaliteit",
      launchNoteTitle: "Notitie",
      launchNoteFallback:
        "Export blijft in deze MVP local-first. Als een formaat niet door de huidige browser wordt ondersteund, stuurt de UI je naar PNG Sequence.",
      exportButtonIdle: "Asset exporteren",
      exportButtonBusy: "Bezig met exporteren...",
      exportStatusTitle: "Exportstatus",
      exportStatusIdle: "Inactief. Kies een formaat en start een lokale export.",
      qualityOptions: {
        standard: "Standaard",
        high: "Hoog",
      },
      advisoryMessages: {
        workerSupportError:
          "Deze browser kan geen achtergrondworker starten, dus lokale video-export is uitgeschakeld. Gebruik PNG Sequence in een moderne desktopbrowser.",
        webmUnavailableError:
          "WebM-export is niet beschikbaar in deze browser. PNG Sequence blijft de veiligste terugvaloptie.",
        heavyExportWarning:
          "Deze export zal waarschijnlijk zwaar zijn voor geheugen en CPU. Overweeg 720p, 30 seconden of PNG Sequence als je browser begint te haperen.",
        pngSequenceInfo:
          "PNG Sequence is de betrouwbaarste local-first overdracht voor editors, vooral wanneer transparantie belangrijk is.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export gereed: {fileName}",
        preparingWebm: "Lokale WebM-export voorbereiden",
        preparingPngSequence: "Lokale PNG Sequence-export voorbereiden",
        exportWorkerUnavailable: "De exportworker is niet beschikbaar in deze browsersessie.",
        webmFailedUnexpectedly: "WebM-export is onverwacht mislukt.",
        pngSequenceFailedUnexpectedly: "PNG Sequence-export is onverwacht mislukt.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Toolnotities",
    heading: "Eén toolpagina, plus precies genoeg context om hem goed te gebruiken.",
    description:
      "Time Overlay is ontworpen als een local-first overlay-timergenerator. Gebruik de bediening hierboven om duur, stijl, positie en exportformaat in te stellen; bewaar dit onderste gedeelte voor de paar vragen die echt belangrijk blijven voor SEO en echte workflowkeuzes.",
    exportFormatsTitle: "Exportformaten",
    exportFormatsPngText:
      "PNG Sequence is de betrouwbaarste lokale export wanneer je transparante overlays of editor-vriendelijke assets nodig hebt.",
    exportFormatsWebmText:
      "WebM is beschikbaar als handige browsernative optie wanneer de huidige omgeving het stabiel ondersteunt.",
    workflowEyebrow: "Hoe het werkt",
    workflowHeading: "Zo werkt de export van een overlay-timer",
    workflowSteps: [
      {
        title: "Stel countdown-duur en lay-out in",
        body:
          "Begin in de generator hierboven. Kies de totale duur, selecteer een schone kloklay-out en plaats de overlay waar die leesbaar blijft boven gameplay, productbeelden of talking-head video.",
      },
      {
        title: "Kies een timerstijl die bij je footage past",
        body:
          "Pas typografie, contrast, schaal en positie zo aan dat de countdown bewust ontworpen oogt in plaats van erop geplakt. De sterkste overlay-timers gebruiken meestal duidelijke cijfers, stabiele spacing en genoeg ruimte tot de rand van het frame.",
      },
      {
        title: "Exporteer het formaat dat bij je editor past",
        body:
          "Gebruik PNG Sequence wanneer je de veiligste workflow voor transparante assets nodig hebt, of kies WebM als een lichter lokaal videobestand voldoende is voor je project.",
      },
    ],
    usageEyebrow: "Gebruik",
    usageHeading: "Zo gebruik je Time Overlay",
    usageNotes: [
      "Open de generator, stel de timerlengte in en bekijk de countdown voordat je iets exporteert.",
      "Gebruik PNG Sequence voor transparante overlays in CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve of elke workflow die beeldassets verkiest.",
      "Gebruik WebM wanneer je een snelle browserexport wilt voor mockups, rough cuts of lichte social edits.",
      "Houd de timer kort, contrastrijk en weg van ondertitels of gezichtskadering zodat hij ook op mobiel leesbaar blijft.",
    ],
    usageCta: {
      beforeFirstLink: "Begin in de ",
      firstLinkLabel: "live generator",
      betweenLinks: "en gebruik de ",
      secondLinkLabel: "exportgids",
      afterSecondLink: "hieronder wanneer je kiest tussen transparante frames en browservideo-uitvoer.",
    },
    aboutEyebrow: "Over",
    aboutHeading: "Over Time Overlay",
    aboutPoints: [
      "Time Overlay is een local-first overlay-timergenerator voor makers die countdown-graphics nodig hebben zonder footage naar een externe renderdienst te uploaden.",
      "De pagina is bewust compact gehouden: één echt tooloppervlak, één duidelijk blok over exportformaten en één SEO-ondersteuningsgedeelte dat workflowvragen beantwoordt die mensen opzoeken voordat ze een timertool vertrouwen.",
      "Daardoor werkt de homepage zowel als echte production utility als crawlbare landingspagina voor zoekopdrachten zoals overlay timer, countdown timer overlay, transparent countdown overlay en timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink: "Als je eerst de praktische vragen wilt afhandelen, ga dan naar de ",
      linkLabel: "overlay timer FAQ",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Overlay-timer essentials",
    faqItems: [
      {
        question: "Kan ik een overlay-timer met transparantie exporteren?",
        answer:
          "Ja. De veiligste local-first route is PNG Sequence, omdat editors transparante beeldassets betrouwbaarder verwerken dan gecomprimeerde videoworkflows. WebM is beschikbaar wanneer de browser het ondersteunt, maar als transparantie belangrijk is blijft PNG Sequence meestal de veiligste keuze.",
      },
      {
        question: "Welk exportformaat moet ik als eerste kiezen?",
        answer:
          "Begin met PNG Sequence als je de betrouwbaarste overdracht naar editors wilt, vooral bij compositing over echte beelden. Kies WebM wanneer je een lichter lokaal videobestand wilt en je browser die route goed ondersteunt.",
      },
      {
        question: "Wordt deze tool op de server gerenderd?",
        answer:
          "Nee. De kernervaring is local-first. Preview en export draaien op het apparaat van de gebruiker, zodat de homepage zich gedraagt als een echte tool in plaats van een externe renderqueue.",
      },
      {
        question: "Welke timerstijl leest het best in video?",
        answer:
          "Meestal werken eenvoudige cijfers met hoog contrast het beste. Monospace cijfers, subtiele glow en zorgvuldige plaatsing in een hoek blijven beter leesbaar boven drukke beelden dan decoratieve skins.",
      },
      {
        question: "Werkt dit voor TikTok, YouTube en editors zoals CapCut of Premiere?",
        answer:
          "Ja, maar het overdrachtspad verschilt per use case. Short-form en editing-workflows profiteren vaak van transparante assets of beeldsequenties, terwijl snelle lokale WebM-export prima werkt als je alleen een licht bestand nodig hebt.",
      },
    ],
  },
} satisfies RootPageContent;

export default nlRootPageContent;
