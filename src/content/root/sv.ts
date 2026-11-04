import type { RootPageContent } from "@/content/root/types";

const svRootPageContent = {
  metadata: {
    title: "Generator för nedräknings-overlay till videor och livesändningar",
    description:
      "Skapa tydliga nedräknings-overlays i webbläsaren. Förhandsgranska direkt och exportera transparenta PNG-sekvenser eller WebM för videoredigering.",
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
    templateGallery: {
      title: "Mallbibliotek",
      description:
        "Börja med en beprövad layout. Längd och exportval behålls.",
      browseLabel: "Visa alla 48",
      searchPlaceholder: "Sök mallar eller användningsområden",
      categoryLabels: {
        all: "Alla",
        editing: "Redigering",
        streaming: "Streaming",
        social: "Socialt",
        events: "Evenemang",
        fitness: "Träning",
        cinematic: "Filmisk",
        minimal: "Minimalistisk",
      },
      selectedLabel: "Vald",
      editedLabel: "Redigerad",
      resultTemplate: "{count} mallar",
      noResults: "Inga mallar matchar det här filtret.",
      closeLabel: "Stäng mallbiblioteket",
    },
    themePresetPicker: {
      title: "Temaförval",
      description: "Välj först ett utgångsläge och justera sedan kontrollerna bara om det behövs.",
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
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
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
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Genomskinlig VP8-video för OBS och Streamlabs. Lägg till den som mediekälla; bakgrunden är redan borttagen.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Mindre genomskinlig video för OBS och testade VP9-alpha-flöden; importstödet varierar mellan redigerare.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
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
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "Den här exporten kommer sannolikt att belasta minne och CPU rejält. Överväg 720p, 30 sekunder eller PNG Sequence om webbläsaren börjar kämpa.",
        pngSequenceInfo:
          "PNG Sequence är den mest pålitliga local-first-överlämningen till editorer, särskilt när transparens är viktig.",
      vp9AlphaInfo:
        "WebM VP9 + alpha är ett kompakt genomskinligt format för OBS och verifierade VP9-alpha-flöden.",
      hevcAlphaInfo:
        "MOV HEVC + alpha är rekommenderad direktexport för Final Cut Pro på en kompatibel Mac.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export klar: {fileName}",
        preparingWebm: "Förbereder lokal WebM-export",
        preparingPngSequence: "Förbereder lokal PNG Sequence-export",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable: "Export-worker är inte tillgänglig i den här webbläsarsessionen.",
        webmFailedUnexpectedly: "WebM-exporten misslyckades oväntat.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly: "PNG Sequence-exporten misslyckades oväntat.",
      },
      png: {
        prepareTitle: "Förbered PNG-sekvens",
        prepareIntro:
          "Du exporterar en transparent PNG-sekvens. Kontrollera planen nedan innan du väljer var bildrutorna sparas.",
        prepareSummaryTemplate:
          "{duration} s · {fps} fps · {frames} bildrutor · {width}×{height}",
        estimateTemplate:
          "Cirka {size} i {parts} ZIP-del(ar), ungefär {time} att exportera.",
        estimateUnknown:
          "Uppskattningar av storlek och tid visas medan exporten körs.",
        sampleProgress:
          "Renderar exempelbildrutor för att uppskatta storlek och tid…",
        longJobTitle: "Den här exporten tar lång tid",
        longJobBody:
          "Bildrutor skrivs till disk del för del, så hela sekvensen hålls aldrig i minnet. Varje ZIP-del måste packas upp och slås ihop före import.",
        saveFolderButton: "Välj mapp och starta",
        saveFolderHint:
          "Webbläsaren frågar en gång om skrivåtkomst. Inuti skapas en uppgiftsmapp och färdiga delar ligger kvar på disken.",
        opfsButton: "Skapa i webbläsaren, ladda ner delar",
        opfsHint:
          "Webbläsaren behåller tillfälliga filer tills du laddar ner och rensar dem. Lämna plats för den tillfälliga kopian, dina nedladdningar och de uppackade bildrutorna.",
        continueButton: "Fortsätt i den här fliken",
        cancelPrepButton: "Avbryt förberedelsen",
        adviceDesktopSafari:
          "Safari kan inte spara en så här stor export — dess inbyggda lagring tar slut innan den är klar. Använd Chrome eller Edge på din dator för en så här lång timer.",
        adviceMobile:
          "Använd en dator för en så här lång timer. Telefoner och surfplattor får ofta slut på lagring innan exporten är klar.",
        capabilityMissing:
          "Den här webbläsaren kan inte spara exportfiler. Stäng andra flikar på den här sidan och försök igen, eller använd Chrome på din dator.",
        longStorageMissing:
          "Din webbläsare kunde inte skapa en plats att spara bildrutorna på. Frigör lagringsutrymme eller använd Chrome på en dator och försök igen.",
        dedupeLabel: "Skriv varje bild en gång",
        dedupeHint:
          "Bara {unique} av {total} bildrutor skiljer sig — resten upprepar bilden före. expand-sequence.sh fyller tillbaka dem och nedladdningen krymper till ungefär {size}.",
        dedupeResultNote:
          "Dubbla bildrutor sparades bara en gång. Kör expand-sequence.sh (eller expand-sequence.ps1 på Windows) i mappen med sammanslagna bildrutor innan du importerar — den återskapar de upprepade bildrutorna.",
        runTitle: "Export av PNG-sekvens",
        modeDirectory: "Sparmapp",
        modeBrowserStorage: "Sparat i webbläsaren",
        modeMemory: "Kvar i minnet",
        runFramesTemplate: "Bearbetade bildrutor",
        runCommittedTemplate: "Säkert sparade bildrutor",
        runPartTemplate: "Aktuell del · sparade delar",
        runBytesTemplate: "Skrivet",
        stoppingButton: "Stoppar…",
        cancelButton: "Avbryt export",
        cancelledMessage:
          "Exporten stoppades. Färdiga ZIP-delar behålls; återuppta från den senast sparade delen.",
        resultTitle: "PNG-exporten är klar",
        directorySavedTemplate:
          "Sparade {frames} bildrutor som {parts} ZIP-del(ar) i {folder} ({size}).",
        opfsPartsTitle:
          "{parts} ZIP-del(ar), {size}. Ladda ner varje del medan den visas här.",
        partDownloadButton: "Ladda ner",
        partRangeTemplate: "bildrutor {first}–{last} · {size}",
        mergeInstructionsTitle: "Före import",
        mergeInstructionsBody:
          "Packa upp alla delar, flytta alla frame-*.png-filer till en mapp och importera sedan mappen som bildsekvens med vald fps. Importera inte varje del som en egen nedräkning. Den första ZIP-filen innehåller konverteringsskript som kontrollerar saknade bildrutor.",
        autoDownloadNote:
          "Webbläsarens nedladdning har startat. Håll fliken öppen tills den är klar.",
        openFolderHint: "Öppna mappen i din filhanterare.",
        cleanupButton: "Ta bort tillfälliga filer",
        recoveryTitle: "Oavslutad PNG-export hittades",
        recoveryBodyTemplate:
          "{frames} av {total} bildrutor är säkert sparade i {parts} del(ar). Den oavslutade delen görs om.",
        restoreButton: "Återuppta export",
        authorizeButton: "Tillåt och fortsätt",
        selectFolderButton: "Välj exportmapp",
        removeRecordButton: "Ta bort återställningspost",
        fontRequired:
          "Den här exporten använde ett eget typsnitt. Ange samma typsnittsfil för att återuppta.",
        fontButton: "Välj typsnittsfil",
        downloadFailed:
          "Nedladdningen kunde inte startas. De färdiga filerna finns fortfarande ovan; försök igen.",
        errorTitle: "Problem med PNG-exporten",
        errorMessages: {
          pngStorageUnavailable:
            "Den här webbläsaren blockerade den lokala lagring som PNG-exporter behöver. Använd ett vanligt Chrome-fönster på datorn.",
          pngDirectoryPermissionDenied:
            "Skrivåtkomst till den valda mappen beviljades inte. Välj mappen igen och tillåt skrivning; ingen export startades.",
          pngStorageFull:
            "Det finns inte tillräckligt med ledigt utrymme för att slutföra den här PNG-delen. Frigör utrymme och återuppta; sparade delar behålls.",
          pngWriteFailed:
            "Det gick inte att spara en PNG-del. Sparade delar behålls; kontrollera mappen eller lagringen och återuppta.",
          pngZipValidationFailed:
            "En sparad ZIP-del klarade inte valideringen. Den görs om; tidigare delar behålls.",
          pngFrameTooLarge:
            "En enda PNG-bildruta är större än gränsen per del. Minska upplösningen eller använd en enklare stil.",
          pngMemoryLimitExceeded:
            "Den här exporten är för stor för att slutföras i den här webbläsaren. Använd Chrome på din dator och välj ”Sparmapp” så att bildrutorna skrivs direkt till disk.",
          pngResumeVersionMismatch:
            "Den sparade exporten skapades med andra inställningar eller en äldre version. Den kan inte fortsättas; starta en ny export och behåll de befintliga delarna.",
          pngResumeFileMissing:
            "En sparad ZIP-del saknas eller har ändrats. Den delen görs om; välj uppgiftsmappen igen och återuppta.",
          pngLocked:
            "Den här exporten är öppen i en annan flik. Stäng den andra fliken och försök igen.",
          pngCheckpointFailed:
            "Den här webbläsaren kan inte spara förloppet för att återuppta senare. Använd Chrome på din dator, eller exportera en kortare timer.",
          pngFailedUnexpectedly:
            "PNG-exporten stoppades oväntat. Sparade delar, om några, behålls; återuppta eller starta en ny export.",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "Verktygsnoteringar",
    heading: "En verktygssida, plus precis så mycket kontext som behövs för att använda den väl.",
    description:
      "Time Overlay är en local-first-generator. Ställ in längd, stil, position och format ovan; läs nedan hur transparensen bevaras och vad du bör testa före användning i produktion.",
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
      "Generatorn samlar reglage, exportråd och felsökning på ett ställe, så att du både kan skapa materialet och lämna över det korrekt till en annan app.",
      "Guiderna skiljer dokumenterat stöd från praktiska rekommendationer, anger granskade källor och visar senaste granskningsdatum så att kompatibiliteten kan kontrolleras igen.",
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
