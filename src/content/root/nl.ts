import type { RootPageContent } from "@/content/root/types";

const nlRootPageContent = {
  metadata: {
    title: "Countdown-overlaytimer voor video's en livestreams",
    description:
      "Maak strakke countdown-overlaytimers direct in je browser. Bekijk meteen een preview en exporteer transparante PNG-sequenties of WebM voor videobewerking.",
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
    templateGallery: {
      title: "Sjabloonbibliotheek",
      description:
        "Begin met een beproefde lay-out. Je duur en exportkeuzes blijven behouden.",
      browseLabel: "Bekijk alle 48",
      searchPlaceholder: "Zoek sjablonen of toepassingen",
      categoryLabels: {
        all: "Alles",
        editing: "Bewerking",
        streaming: "Streaming",
        social: "Sociaal",
        events: "Evenementen",
        fitness: "Fitness",
        cinematic: "Filmisch",
        minimal: "Minimalistisch",
      },
      selectedLabel: "Geselecteerd",
      editedLabel: "Bewerkt",
      resultTemplate: "{count} sjablonen",
      noResults: "Geen sjablonen komen overeen met dit filter.",
      closeLabel: "Sjabloonbibliotheek sluiten",
    },
    themePresetPicker: {
      title: "Thema-preset",
      description: "Kies eerst een startlook en pas daarna alleen de bediening aan als dat nodig is.",
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
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
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
    audioTitle: "Audio",
    audioVariantLabel: "Audio cues",
    audioVariantOptions: {
      none: "None",
      tick: "Tick every second",
      beep: "Final beep only",
      "tick-and-beep": "Tick + final beep",
    },
    audioNote: "Audio is embedded in WebM (with alpha) exports. PNG sequence is silent.",
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
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Transparante VP8-video voor OBS en Streamlabs. Voeg hem toe als mediabron; de achtergrond is al verwijderd.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Compactere transparante video voor OBS en geteste VP9-alpha-workflows; importondersteuning verschilt per editor.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
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
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "Deze export zal waarschijnlijk zwaar zijn voor geheugen en CPU. Overweeg 720p, 30 seconden of PNG Sequence als je browser begint te haperen.",
        pngSequenceInfo:
          "PNG Sequence is de betrouwbaarste local-first overdracht voor editors, vooral wanneer transparantie belangrijk is.",
      vp9AlphaInfo:
        "WebM VP9 + alpha is een compact transparant formaat voor OBS en al geteste VP9-alpha-workflows.",
      hevcAlphaInfo:
        "MOV HEVC + alpha is de aanbevolen directe export voor Final Cut Pro op een compatibele Mac.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export gereed: {fileName}",
        preparingWebm: "Lokale WebM-export voorbereiden",
        preparingPngSequence: "Lokale PNG Sequence-export voorbereiden",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable: "De exportworker is niet beschikbaar in deze browsersessie.",
        webmFailedUnexpectedly: "WebM-export is onverwacht mislukt.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly: "PNG Sequence-export is onverwacht mislukt.",
      },
      png: {
        prepareTitle: "PNG-sequentie voorbereiden",
        prepareIntro:
          "Je exporteert een transparante PNG-sequentie. Controleer het plan hieronder voordat je kiest waar de frames worden opgeslagen.",
        prepareSummaryTemplate:
          "{duration} s · {fps} fps · {frames} frames · {width}×{height}",
        estimateTemplate:
          "Ongeveer {size}, {parts} ZIP-deel(en), ongeveer {time} coderen. De schattingen worden bijgewerkt terwijl de echte frames worden weggeschreven.",
        estimateUnknown:
          "Er waren geen voorbeeldframes beschikbaar, dus de schatting van grootte en tijd is onbekend. De export kan gewoon doorgaan.",
        sampleProgress:
          "Voorbeeldframes renderen om grootte en tijd te schatten…",
        longJobTitle: "Deze export duurt lang",
        longJobBody:
          "Frames worden deel voor deel naar schijf geschreven, dus de hele reeks staat nooit in het geheugen. Elk ZIP-deel moet worden uitgepakt en samengevoegd voordat je importeert.",
        saveFolderButton: "Map kiezen en starten",
        saveFolderHint:
          "De browser vraagt één keer om schrijftoegang. Daarin wordt een taakmap aangemaakt en voltooide delen blijven op schijf staan.",
        opfsButton: "In de browser genereren, delen downloaden",
        opfsHint:
          "De browser bewaart tijdelijke bestanden tot je ze downloadt en opruimt. Houd ruimte vrij voor de tijdelijke kopie, je downloads en de uitgepakte frames.",
        continueButton: "Doorgaan in dit tabblad",
        cancelPrepButton: "Voorbereiding annuleren",
        adviceDesktopSafari:
          "Gebruik Chrome op de desktop voor betere exportprestaties. Je kunt doorgaan, maar lange PNG-exports worden vooral in Chrome gecontroleerd.",
        adviceMobile:
          "Exporteer op een computer voor betere prestaties. Je kunt doorgaan als dit apparaat de opslagcontrole haalt.",
        capabilityMissing:
          "Deze export vereist hervatbare lokale opslag en één actief tabblad, wat deze browser of dit profiel niet biedt.",
        longStorageMissing:
          "Een lange export heeft een beschrijfbare map nodig of browseropslag die schrijfacties echt accepteert. Deze browser biedt geen veilige bestemming, dus er zijn geen frames gemaakt.",
        runTitle: "PNG-sequentie exporteren",
        modeDirectory: "Opslagmap",
        modeBrowserStorage: "Browseropslag",
        modeMemory: "Tijdelijk geheugen",
        runFramesTemplate: "Verwerkte frames",
        runCommittedTemplate: "Veilig opgeslagen frames",
        runPartTemplate: "Huidig deel · opgeslagen delen",
        runBytesTemplate: "Geschreven",
        stoppingButton: "Stoppen…",
        cancelButton: "Export annuleren",
        cancelledMessage:
          "Export gestopt. Voltooide ZIP-delen blijven bewaard; hervat vanaf het laatst opgeslagen deel.",
        resultTitle: "PNG-export voltooid",
        directorySavedTemplate:
          "{frames} frames opgeslagen als {parts} ZIP-deel(en) in {folder} ({size}).",
        opfsPartsTitle:
          "{parts} ZIP-deel(en), {size}. Download elk deel zolang het hier staat.",
        partDownloadButton: "Downloaden",
        partRangeTemplate: "frames {first}–{last} · {size}",
        mergeInstructionsTitle: "Voor het importeren",
        mergeInstructionsBody:
          "Pak elk deel uit, zet alle frame-*.png-bestanden in één map en importeer die map als beeldsequentie met de gekozen fps. Importeer elk deel niet als aparte countdown. De eerste ZIP bevat conversiescripts die ontbrekende frames controleren.",
        autoDownloadNote:
          "De download van de browser is gestart. Houd dit tabblad open tot hij klaar is.",
        openFolderHint:
          "De browser kan je bestandsbeheer niet openen; gebruik zo nodig het mapvenster van je systeem.",
        cleanupButton: "Tijdelijke browserbestanden opruimen",
        recoveryTitle: "Onvoltooide PNG-export gevonden",
        recoveryBodyTemplate:
          "{frames} van {total} frames zijn veilig opgeslagen over {parts} deel(en). Het onvoltooide deel wordt opnieuw gedaan.",
        restoreButton: "Export hervatten",
        authorizeButton: "Toestaan en doorgaan",
        selectFolderButton: "Exportmap selecteren",
        removeRecordButton: "Herstelregistratie verwijderen",
        fontRequired:
          "Deze export gebruikte een aangepast lettertype. Geef hetzelfde lettertypebestand op om te hervatten.",
        fontButton: "Lettertypebestand selecteren",
        downloadFailed:
          "De download kon niet starten. De voltooide bestanden staan hierboven nog; probeer het opnieuw.",
        errorTitle: "Probleem met PNG-export",
        errorMessages: {
          pngStorageUnavailable:
            "Deze browser heeft de lokale opslag geblokkeerd die PNG-exports nodig hebben. Gebruik een normaal Chrome-venster op de desktop.",
          pngDirectoryPermissionDenied:
            "Schrijftoegang tot de gekozen map is niet verleend. Kies de map opnieuw en sta schrijven toe; er is geen export gestart.",
          pngStorageFull:
            "Er is niet genoeg vrije ruimte om dit PNG-deel af te maken. Maak ruimte vrij en hervat; opgeslagen delen blijven bewaard.",
          pngWriteFailed:
            "Het opslaan van een PNG-deel is mislukt. Opgeslagen delen blijven bewaard; controleer de map of opslag en hervat.",
          pngZipValidationFailed:
            "Een opgeslagen ZIP-deel is niet door de validatie gekomen. Het wordt opnieuw gedaan; eerdere delen blijven bewaard.",
          pngFrameTooLarge:
            "Een PNG-frame of de benodigde ZIP-metadata is groter dan de limiet per deel. Verlaag de resolutie of gebruik een eenvoudiger stijl.",
          pngMemoryLimitExceeded:
            "Deze export vraagt meer tijdelijk geheugen dan het beperkte in-memory pad toestaat. Gebruik voor een lange export Chrome op de desktop met een beschrijfbare map.",
          pngResumeVersionMismatch:
            "De opgeslagen export is gemaakt met andere instellingen, assets of een oudere app-versie. Hij kan niet veilig worden samengevoegd; start een nieuwe export en bewaar de bestaande delen.",
          pngResumeFileMissing:
            "Een opgeslagen ZIP-deel ontbreekt of is gewijzigd. Het getroffen deel moet opnieuw; selecteer de taakmap opnieuw en hervat.",
          pngLocked:
            "Deze export is open in een ander tabblad, of deze browser kan de taak niet vergrendelen. Sluit het andere tabblad en probeer opnieuw.",
          pngCheckpointFailed:
            "Deze browser kan het lokale controlepunt niet bewaren dat hervatbare PNG-exports nodig hebben. Gebruik Chrome op de desktop, of exporteer een korte taak die in het geheugen past.",
          pngFailedUnexpectedly:
            "De PNG-export is onverwacht gestopt. Opgeslagen delen, als die er zijn, blijven bewaard; hervat of start een nieuwe export.",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "Toolnotities",
    heading: "Eén toolpagina, plus precies genoeg context om hem goed te gebruiken.",
    description:
      "Time Overlay is een local-first generator. Stel hierboven duur, stijl, positie en formaat in; lees hieronder hoe transparantie behouden blijft en wat u vóór productiegebruik moet testen.",
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
      "De generator brengt bediening, exportadvies en probleemoplossing samen, zodat u het bestand kunt maken en correct naar een andere toepassing kunt overbrengen.",
      "De handleidingen scheiden gedocumenteerde ondersteuning van praktisch advies, noemen de gecontroleerde bronnen en tonen de laatste beoordelingsdatum zodat compatibiliteit opnieuw kan worden getoetst.",
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
