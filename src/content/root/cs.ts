import type { RootPageContent } from "@/content/root/types";

const csRootPageContent = {
  metadata: {
    title: "Generátor overlay odpočtu pro videa a streamy",
    description:
      "V prohlížeči vytvoříte čistý overlay s odpočtem. Okamžitě uvidíte náhled a vyexportujete průhlednou PNG sekvenci nebo WebM pro střih videa, streamy a návody.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "Nastavte délku, zkontrolujte snímek v náhledu a potom exportujte timer asset.",
    intro: "Doporučený první pokus: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Overlay timer nástroj pro tvůrce, kteří potřebují čisté a dobře čitelné odpočty ve videích a live streamech.",
    header: {
      shellLabel: "Veřejné rozhraní",
      toolLinkLabel: "Nástroj",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Systémová lišta",
      publicStatusLabel: "Veřejný stav",
      identityTitle: "Identita",
      jumpTitle: "Přejít na",
      productTitle: "Produkt",
      jumpLinks: [
        { anchorId: "tool", label: "Generátor" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formáty" },
      ],
      productDescription:
        "Jedna local-first stránka s countdown overlay, kompaktním FAQ a průvodcem exportními formáty.",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "Knihovna šablon",
      description:
        "Začněte ověřeným rozvržením. Délka a volby exportu zůstanou zachovány.",
      browseLabel: "Procházet všech 48",
      searchPlaceholder: "Hledat šablony nebo použití",
      categoryLabels: {
        all: "Vše",
        editing: "Úpravy",
        streaming: "Streamování",
        social: "Sociální sítě",
        events: "Události",
        fitness: "Fitness",
        cinematic: "Filmové",
        minimal: "Minimalistické",
      },
      selectedLabel: "Vybráno",
      editedLabel: "Upraveno",
      resultTemplate: "{count} šablon",
      noResults: "Tomuto filtru neodpovídají žádné šablony.",
      closeLabel: "Zavřít knihovnu šablon",
    },
    themePresetPicker: {
      title: "Předvolba motivu",
      description: "Vyberte výchozí vzhled a ovládací prvky dolaďte jen tehdy, když je to potřeba.",
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
      title: "Ovládání",
      subtitle: "Vstupní vrstva",
      timerSetupTitle: "Nastavení timeru",
      durationLabel: "Délka (sekundy)",
      displayFormatLabel: "Formát zobrazení",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Předvolba rozlišení",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Režim pozadí",
      styleTitle: "Styl",
      fontFamilyLabel: "Rodina písma",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Kotva",
      anchorOptions: {
        "top-left": "Vlevo nahoře",
        "top-center": "Nahoře uprostřed",
        "top-right": "Vpravo nahoře",
        "center-left": "Vlevo uprostřed",
        center: "Uprostřed",
        "center-right": "Vpravo uprostřed",
        "bottom-left": "Vlevo dole",
        "bottom-center": "Dole uprostřed",
        "bottom-right": "Vpravo dole",
      },
      transparentOptionLabel: "Průhledné",
      solidOptionLabel: "Plné",
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
      title: "Náhled",
      subtitle: "Živý canvas",
      playButton: "Přehrát náhled",
      pauseButton: "Pauza",
      resetButton: "Reset",
      safeAreaOnButton: "Bezpečná zóna zapnuta",
      safeAreaOffButton: "Bezpečná zóna vypnuta",
      currentReadoutLabel: "Aktuální hodnota",
    },
    exportPanel: {
      title: "Export",
      subtitle: "Výstupní zóna",
      outputFormatTitle: "Výstupní formát",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription: "Nejspolehlivější volba pro editory a transparentní předání.",
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Průhledné video VP8 pro OBS a Streamlabs. Přidejte ho jako zdroj médií s již odstraněným pozadím.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Menší průhledné video pro OBS a ověřené postupy s VP9 alpha; podpora importu se mezi editory liší.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Kvalita",
      launchNoteTitle: "Poznámka",
      launchNoteFallback:
        "V MVP zůstává export local-first. Pokud prohlížeč nepodporuje vybraný formát, rozhraní vás přesměruje na PNG Sequence.",
      exportButtonIdle: "Exportovat asset",
      exportButtonBusy: "Exportuje se…",
      exportStatusTitle: "Stav exportu",
      exportStatusIdle: "Nečinné. Vyberte formát a spusťte lokální export.",
      qualityOptions: {
        standard: "Standard",
        high: "Vysoká",
      },
      advisoryMessages: {
        workerSupportError:
          "Tento prohlížeč nedokáže spustit pracovníka na pozadí, takže lokální export videa je vypnutý. Použijte PNG Sequence v moderním desktopovém prohlížeči.",
        webmUnavailableError:
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "Tento export pravděpodobně výrazně zatíží paměť a CPU. Pokud se prohlížeč začne zadýchávat, zvažte 720p, 30 sekund nebo PNG Sequence.",
        pngSequenceInfo:
          "PNG Sequence je nejspolehlivější local-first způsob předání do editorů, zejména když záleží na průhlednosti.",
      vp9AlphaInfo:
        "WebM VP9 + alpha je kompaktní průhledný formát pro OBS a ověřené postupy s VP9 alpha.",
      hevcAlphaInfo:
        "MOV HEVC + alpha je doporučený přímý export pro Final Cut Pro na kompatibilním Macu.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export připraven: {fileName}",
        preparingWebm: "Připravuje se lokální export WebM",
        preparingPngSequence: "Připravuje se lokální export PNG Sequence",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable: "Export worker není v této relaci prohlížeče dostupný.",
        webmFailedUnexpectedly: "Export WebM neočekávaně selhal.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly: "Export PNG Sequence neočekávaně selhal.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Poznámky k nástroji",
    heading: "Jedna stránka nástroje a jen tolik kontextu, kolik je opravdu potřeba.",
    description:
      "Time Overlay je generátor pracující především lokálně. Nahoře nastavíte délku, styl, pozici a formát; dole zjistíte, jak zachovat průhlednost a co ověřit před použitím ve skutečném projektu.",
    exportFormatsTitle: "Exportní formáty",
    exportFormatsPngText:
      "Pokud potřebujete transparentní overlay nebo assety vhodné do editoru, PNG Sequence je nejspolehlivější lokální export.",
    exportFormatsWebmText:
      "Pokud to aktuální prostředí stabilně podporuje, můžete použít WebM jako pohodlnou nativní variantu z prohlížeče.",
    workflowEyebrow: "Jak to funguje",
    workflowHeading: "Jak funguje export overlay timeru",
    workflowSteps: [
      {
        title: "Nastavte délku odpočtu a rozvržení",
        body:
          "Začněte generátorem nahoře. Vyberte celkovou délku, čistý hodinový layout a umístěte overlay tam, kde zůstane čitelný přes gameplay, produktové video i talking-head scénu.",
      },
      {
        title: "Vyberte styl timeru podle záběru",
        body:
          "Upravte typografii, kontrast, velikost a pozici tak, aby odpočet působil jako záměrná součást obrazu, ne jako dodatečně nalepený prvek. Nejlepší overlay timery obvykle používají jasné číslice, stabilní rytmus a dostatek prostoru od okrajů.",
      },
      {
        title: "Exportujte formát, který sedí vašemu editoru",
        body:
          "Použijte PNG Sequence, když potřebujete nejbezpečnější workflow pro transparentní assety, nebo zvolte WebM, když vám pro projekt stačí lehčí lokální video.",
      },
    ],
    usageEyebrow: "Jak používat",
    usageHeading: "Jak používat Time Overlay",
    usageNotes: [
      "Otevřete generátor, nastavte délku timeru a náhled zkontrolujte dřív, než něco exportujete.",
      "PNG Sequence používejte pro transparentní overlaye v CapCutu, Premiere Pro, Final Cut Pro, DaVinci Resolve a všude tam, kde workflow preferuje obrazové assety.",
      "WebM použijte, když chcete rychlý export z prohlížeče pro mockupy, rough cuty nebo lehké sociální editace.",
      "Držte timer krátký, kontrastní a mimo titulky nebo obličej, aby zůstal dobře čitelný i na mobilu.",
    ],
    usageCta: {
      beforeFirstLink: "Začněte v ",
      firstLinkLabel: "živém generátoru",
      betweenLinks: "a použijte níže ",
      secondLinkLabel: "průvodce exportem",
      afterSecondLink: "ve chvíli, kdy se rozhodujete mezi transparentními snímky a videovým výstupem z prohlížeče.",
    },
    aboutEyebrow: "O projektu",
    aboutHeading: "O Time Overlay",
    aboutPoints: [
      "Time Overlay je local-first generátor overlay timeru pro tvůrce, kteří potřebují countdown grafiku bez nahrávání záběrů do vzdálené renderovací služby.",
      "Generátor spojuje ovládání, doporučení k exportu a řešení potíží, abyste mohli soubor vytvořit a správně předat do jiné aplikace.",
      "Průvodci oddělují doloženou podporu od praktických doporučení, uvádějí ověřené zdroje i datum poslední kontroly a umožňují kompatibilitu později znovu posoudit.",
    ],
    aboutCta: {
      beforeLink: "Pokud chcete nejdřív vyřešit praktické námitky, přejděte na ",
      linkLabel: "FAQ k overlay timeru",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Základy overlay timeru",
    faqItems: [
      {
        question: "Mohu exportovat overlay timer s průhledností?",
        answer:
          "Ano. Nejjistější local-first cesta je PNG Sequence, protože editory pracují s transparentními obrazovými assety spolehlivěji než s komprimovanými video workflow. Pokud to prohlížeč podporuje, můžete použít i WebM, ale při důležité průhlednosti je PNG Sequence bezpečnější volba.",
      },
      {
        question: "Jaký exportní formát mám zvolit jako první?",
        answer:
          "Začněte PNG Sequence, pokud chcete co nejspolehlivější předání do editorů, zvlášť pro compositing přes reálné video. WebM zvolte tehdy, když vám stačí lehčí lokální video a prohlížeč tu cestu dobře podporuje.",
      },
      {
        question: "Renderuje se tento nástroj na serveru?",
        answer:
          "Ne. Základní zkušenost je local-first. Náhled i export běží na zařízení uživatele, takže stránka funguje jako skutečný nástroj, ne jako vzdálená renderovací fronta.",
      },
      {
        question: "Jaký styl timeru se ve videu čte nejlépe?",
        answer:
          "Nejčastěji fungují jednoduché číslice s vysokým kontrastem. Monospace čísla, střídmé glow a pečlivé umístění do rohů zůstávají na rušném záběru čitelnější než dekorativní varianty.",
      },
      {
        question: "Hodí se to pro TikTok, YouTube a editory jako CapCut nebo Premiere?",
        answer:
          "Ano, ale cesta předání se liší podle použití. Short-form a editorská workflow často těží z průhledných assetů nebo obrazových sekvencí, zatímco rychlý lokální WebM stačí tam, kde potřebujete jen lehký soubor.",
      },
    ],
  },
} satisfies RootPageContent;

export default csRootPageContent;
