import type { RootPageContent } from "@/content/root/types";

const svRootPageContent = {
  metadata: {
    title: "Generator för nedräknings-overlay till videor och livesändningar",
    description:
      "Skapa tydliga nedräknings-overlays direkt i webbläsaren. Förhandsgranska direkt och exportera transparenta PNG-sekvenser eller WebM för videoredigering, livesändningar och guider.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "Ställ in längden, förhandsgranska bildrutan och exportera sedan din timer-asset.",
    intro: "Rekommenderat första test: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Overlay-timerverktyg för kreatörer som behöver rena och lättlästa nedräkningar i inspelningar och livestreams.",
    header: {
      shellLabel: "Publikt skal",
      toolLinkLabel: "Verktyg",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Systemspår",
      publicStatusLabel: "Publik status",
      identityTitle: "Identitet",
      jumpTitle: "Gå till",
      productTitle: "Produkt",
      jumpLinks: [
        { anchorId: "tool", label: "Generator" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Format" },
      ],
      productDescription:
        "En enda local-first verktygssida för countdown-overlays, kompakt FAQ och vägledning kring exportformat.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Temaförval",
      description: "Välj först ett utgångsläge och justera sedan kontrollerna bara om det behövs.",
      presetLabels: {
        "minimal-neon": "Minimal Neon",
        "broadcast-alert": "Broadcast Alert",
        "calm-studio": "Calm Studio",
      },
    },
    controlPanel: {
      title: "Kontroller",
      subtitle: "Inmatningsstack",
      timerSetupTitle: "Timerinställning",
      durationLabel: "Längd (sekunder)",
      displayFormatLabel: "Visningsformat",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Upplösningsförval",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Bakgrundsläge",
      styleTitle: "Stil",
      fontFamilyLabel: "Typsnittsfamilj",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Ankare",
      anchorOptions: {
        "top-left": "Överst vänster",
        "top-center": "Överst mitten",
        "top-right": "Överst höger",
        "center-left": "Mitten vänster",
        center: "Mitten",
        "center-right": "Mitten höger",
        "bottom-left": "Nederst vänster",
        "bottom-center": "Nederst mitten",
        "bottom-right": "Nederst höger",
      },
      transparentOptionLabel: "Transparent",
      solidOptionLabel: "Solid",
    },
    previewPanel: {
      title: "Förhandsvisning",
      subtitle: "Live-canvas",
      playButton: "Spela förhandsvisning",
      pauseButton: "Pausa",
      resetButton: "Återställ",
      safeAreaOnButton: "Safe area på",
      safeAreaOffButton: "Safe area av",
      currentReadoutLabel: "Aktuell visning",
    },
    exportPanel: {
      title: "Export",
      subtitle: "Leveransyta",
      outputFormatTitle: "Utdataformat",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription: "Det mest pålitliga valet för editorer och transparent överlämning.",
      webmLabel: "WebM",
      webmDescription: "Bra för lätt lokal videoexport i stödda webbläsare.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Kvalitet",
      launchNoteTitle: "Notis",
      launchNoteFallback:
        "Export förblir local-first i denna MVP. Om ett format inte stöds i den aktuella webbläsaren styr UI:t dig mot PNG Sequence.",
      exportButtonIdle: "Exportera asset",
      exportButtonBusy: "Exporterar...",
      exportStatusTitle: "Exportstatus",
      exportStatusIdle: "Vilar. Välj ett format och starta en lokal export.",
      qualityOptions: {
        standard: "Standard",
        high: "Hög",
      },
      advisoryMessages: {
        workerSupportError:
          "Den här webbläsaren kan inte starta en bakgrundsworker, så lokal videoexport är avstängd. Använd PNG Sequence i en modern desktop-webbläsare.",
        webmUnavailableError:
          "WebM-export är inte tillgänglig i den här webbläsaren. PNG Sequence är fortfarande den säkraste reservvägen.",
        heavyExportWarning:
          "Den här exporten kommer sannolikt att belasta minne och CPU rejält. Överväg 720p, 30 sekunder eller PNG Sequence om webbläsaren börjar kämpa.",
        pngSequenceInfo:
          "PNG Sequence är den mest pålitliga local-first-överlämningen till editorer, särskilt när transparens är viktig.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export klar: {fileName}",
        preparingWebm: "Förbereder lokal WebM-export",
        preparingPngSequence: "Förbereder lokal PNG Sequence-export",
        exportWorkerUnavailable: "Export-worker är inte tillgänglig i den här webbläsarsessionen.",
        webmFailedUnexpectedly: "WebM-exporten misslyckades oväntat.",
        pngSequenceFailedUnexpectedly: "PNG Sequence-exporten misslyckades oväntat.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Verktygsnoteringar",
    heading: "En verktygssida, plus precis så mycket kontext som behövs för att använda den väl.",
    description:
      "Time Overlay är byggd som en local-first overlay-timergenerator. Använd kontrollerna ovan för att ställa in längd, stil, position och exportformat, och använd den nedre delen för de frågor som faktiskt spelar roll för SEO och verkliga arbetsflödesbeslut.",
    exportFormatsTitle: "Exportformat",
    exportFormatsPngText:
      "PNG Sequence är den mest pålitliga lokala exporten när du behöver transparenta overlays eller editorvänliga assets.",
    exportFormatsWebmText:
      "WebM finns tillgängligt som ett webbläsarinbyggt bekvämlighetsalternativ när den aktuella miljön stöder det stabilt.",
    workflowEyebrow: "Så fungerar det",
    workflowHeading: "Så fungerar export av en overlay-timer",
    workflowSteps: [
      {
        title: "Ställ in nedräkningens längd och layout",
        body:
          "Börja i generatorn ovan. Välj total längd, ett rent klockupplägg och placera overlayen där den fortsätter vara läsbar över gameplay, produktvideo eller talking-head-klipp.",
      },
      {
        title: "Välj en timerstil som passar ditt material",
        body:
          "Justera typografi, kontrast, skala och placering så att nedräkningen känns avsiktlig i bilden istället för påklistrad. Starka overlay-timers använder ofta tydliga siffror, stabil spacing och tillräckligt avstånd till bildkanten.",
      },
      {
        title: "Exportera formatet som passar din editor",
        body:
          "Använd PNG Sequence när du behöver det säkraste transparenta asset-flödet, eller välj WebM när en lättare lokal videofil räcker för projektet du klipper.",
      },
    ],
    usageEyebrow: "Användning",
    usageHeading: "Så använder du Time Overlay",
    usageNotes: [
      "Öppna generatorn, ställ in timerlängden och kontrollera nedräkningen innan du exporterar något.",
      "Använd PNG Sequence för transparenta overlays i CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve eller andra arbetsflöden som föredrar bildbaserade assets.",
      "Använd WebM när du vill ha snabb webbläsarexport för mockups, rough cuts eller lätta sociala redigeringar.",
      "Håll timern kort, kontrastrik och borta från undertexter eller ansiktsinramning så att den förblir läsbar på mobil.",
    ],
    usageCta: {
      beforeFirstLink: "Börja i ",
      firstLinkLabel: "live-generatorn",
      betweenLinks: "och använd ",
      secondLinkLabel: "exportguiden",
      afterSecondLink: "nedan när du väljer mellan transparenta bildrutor och videoutmatning från webbläsaren.",
    },
    aboutEyebrow: "Om",
    aboutHeading: "Om Time Overlay",
    aboutPoints: [
      "Time Overlay är en local-first overlay-timergenerator för kreatörer som behöver countdown-grafik utan att ladda upp footage till en extern renderingtjänst.",
      "Sidan är medvetet kompakt: en verklig verktygsyta, ett tydligt block om exportformat och en SEO-zon som svarar på arbetsflödesfrågor som människor söker efter innan de litar på ett timertool.",
      "Det gör att homepage fungerar både som ett verkligt produktionsverktyg och som en indexerbar landningssida för sökningar som overlay timer, countdown timer overlay, transparent countdown overlay och timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink: "Om du först vill lösa de praktiska invändningarna, gå till ",
      linkLabel: "overlay timer FAQ",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Overlay-timer essentials",
    faqItems: [
      {
        question: "Kan jag exportera en overlay-timer med transparens?",
        answer:
          "Ja. Den säkraste local-first-vägen är PNG Sequence, eftersom editorer hanterar transparenta bildassets mer pålitligt än komprimerade videoflöden. WebM finns om webbläsaren stöder det, men när transparens är viktig är PNG Sequence fortfarande det säkraste valet.",
      },
      {
        question: "Vilket exportformat ska jag välja först?",
        answer:
          "Börja med PNG Sequence om du vill ha den mest pålitliga överlämningen till editorer, särskilt vid compositing ovanpå verkligt videomaterial. Välj WebM när du behöver en lättare lokal videofil och din webbläsare stöder den vägen väl.",
      },
      {
        question: "Rendras verktyget på servern?",
        answer:
          "Nej. Kärnupplevelsen är local-first. Förhandsvisning och export körs på användarens enhet, så att sidan beter sig som ett riktigt verktyg istället för en fjärrkö för rendering.",
      },
      {
        question: "Vilken timerstil är mest läsbar i video?",
        answer:
          "Enkla siffror med hög kontrast fungerar oftast bäst. Monospace-siffror, återhållen glow och noggrann placering i hörn förblir mer läsbara över stökigt footage än dekorativa skins.",
      },
      {
        question: "Fungerar detta för TikTok, YouTube och editorer som CapCut eller Premiere?",
        answer:
          "Ja, men överlämningsvägen varierar. Short-form- och editingsflöden gynnas ofta av transparenta assets eller bildsekvenser, medan snabb lokal WebM-export räcker när du bara behöver en lätt fil.",
      },
    ],
  },
} satisfies RootPageContent;

export default svRootPageContent;
