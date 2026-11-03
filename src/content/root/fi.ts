import type { RootPageContent } from "@/content/root/types";

const fiRootPageContent = {
  metadata: {
    title: "Countdown-overlay-ajastin videoihin ja livestriimeihin",
    description:
      "Luo selkeitä countdown-overlay-ajastimia selaimessa. Esikatsele heti ja vie läpinäkyvä PNG-kuvasarja tai WebM videoeditointiin ja striimeihin.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "Aseta kesto, esikatsele ruutu ja vie sitten ajastinassetti.",
    intro:
      "Suositeltu ensimmäinen kokeilu: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Overlay-ajastintyökalut sisällöntuottajille, jotka tarvitsevat selkeät ja luettavat lähtölaskennat tallenteisiin ja live-lähetyksiin.",
    header: {
      shellLabel: "Julkinen shell",
      toolLinkLabel: "Työkalu",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Järjestelmäraide",
      publicStatusLabel: "Julkinen tila",
      identityTitle: "Identiteetti",
      jumpTitle: "Siirry",
      productTitle: "Tuote",
      jumpLinks: [
        { anchorId: "tool", label: "Generaattori" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formaatit" },
      ],
      productDescription:
        "Yksi local-first-työkalusivu lähtölaskenta-overlayssa, tiiviissä FAQ:ssa ja vientimuotojen ohjeissa.",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "Mallikirjasto",
      description:
        "Aloita hyväksi todetusta asettelusta. Kesto ja vientivalinnat säilyvät.",
      browseLabel: "Selaa kaikkia 48:aa",
      searchPlaceholder: "Hae malleja tai käyttötarkoituksia",
      categoryLabels: {
        all: "Kaikki",
        editing: "Editointi",
        streaming: "Suoratoisto",
        social: "Sosiaalinen",
        events: "Tapahtumat",
        fitness: "Treeni",
        cinematic: "Elokuvallinen",
        minimal: "Minimalistinen",
      },
      selectedLabel: "Valittu",
      editedLabel: "Muokattu",
      resultTemplate: "{count} mallia",
      noResults: "Tätä suodatinta vastaavia malleja ei löytynyt.",
      closeLabel: "Sulje mallikirjasto",
    },
    themePresetPicker: {
      title: "Teemaesiasetus",
      description:
        "Valitse ensin lähtötyyli ja säädä asetuksia vain tarvittaessa.",
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
      title: "Asetukset",
      subtitle: "Syöttökerros",
      timerSetupTitle: "Ajastimen asetukset",
      durationLabel: "Kesto (sekuntia)",
      displayFormatLabel: "Näyttömuoto",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Tarkkuusesiasetus",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Taustatila",
      styleTitle: "Tyyli",
      fontFamilyLabel: "Fonttiperhe",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Ankkuri",
      anchorOptions: {
        "top-left": "Ylävasen",
        "top-center": "Yläkeskellä",
        "top-right": "Yläoikea",
        "center-left": "Keskellä vasen",
        center: "Keskellä",
        "center-right": "Keskellä oikea",
        "bottom-left": "Alavasen",
        "bottom-center": "Alhaalla keskellä",
        "bottom-right": "Alaoikea",
      },
      transparentOptionLabel: "Läpinäkyvä",
      solidOptionLabel: "Yksivärinen",
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
      title: "Esikatselu",
      subtitle: "Live-canvas",
      playButton: "Toista esikatselu",
      pauseButton: "Tauko",
      resetButton: "Nollaa",
      safeAreaOnButton: "Turva-alue päällä",
      safeAreaOffButton: "Turva-alue pois",
      currentReadoutLabel: "Nykyinen näyttö",
    },
    exportPanel: {
      title: "Vienti",
      subtitle: "Toimitusalue",
      outputFormatTitle: "Tulostusmuoto",
      pngSequenceLabel: "PNG-sekvenssi",
      pngSequenceDescription:
        "Luotettavin vaihtoehto editoreille ja läpinäkyvään toimitukseen.",
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Läpinäkyvä VP8-video OBS:lle ja Streamlabsille. Lisää se medialähteeksi ilman taustan poistoa.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Pienempi läpinäkyvä video OBS:lle ja testattuihin VP9 alpha -työnkulkuihin; tuontituki vaihtelee editorin mukaan.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Laatu",
      launchNoteTitle: "Julkaisuhuomio",
      launchNoteFallback:
        "Vienti pysyy MVP-vaiheessa local-first-mallissa. Jos muotoa ei tueta nykyisessä selaimessa, käyttöliittymä ohjaa PNG Sequence -vientiin.",
      exportButtonIdle: "Vie assetti",
      exportButtonBusy: "Viedään...",
      exportStatusTitle: "Viennin tila",
      exportStatusIdle:
        "Valmiustila. Valitse muoto ja käynnistä paikallinen vienti.",
      qualityOptions: {
        standard: "Perus",
        high: "Korkea",
      },
      advisoryMessages: {
        workerSupportError:
          "Tämä selain ei pysty käynnistämään taustaworkeria, joten paikallinen videovienti on pois käytöstä. Käytä PNG Sequencea modernissa työpöytäselaimessa.",
        webmUnavailableError:
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "Tämä vienti kuormittaa todennäköisesti muistia ja CPU:ta paljon. Harkitse 720p:tä, 30 sekuntia tai PNG Sequencea, jos selain alkaa hidastua.",
        pngSequenceInfo:
          "PNG Sequence on luotettavin local-first-siirtotapa editoreille, erityisesti kun läpinäkyvyys on tärkeää.",
      vp9AlphaInfo:
        "WebM VP9 + alpha on kompakti läpinäkyvä muoto OBS:lle ja testattuihin VP9 alpha -työnkulkuihin.",
      hevcAlphaInfo:
        "MOV HEVC + alpha on suositeltu suora vientimuoto Final Cut Prolle yhteensopivassa Macissa.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Vienti valmis: {fileName}",
        preparingWebm: "Valmistellaan paikallista WebM-vientiä",
        preparingPngSequence: "Valmistellaan paikallista PNG Sequence -vientiä",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable:
          "Export worker ei ole käytettävissä tässä selainistunnossa.",
        webmFailedUnexpectedly: "WebM-vienti epäonnistui odottamatta.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "PNG Sequence -vienti epäonnistui odottamatta.",
      },
      png: {
        prepareTitle: "Valmistele PNG-jakso",
        prepareIntro:
          "Olet viemässä läpinäkyvää PNG-jaksoa. Tarkista alla oleva suunnitelma ennen kuin valitset, mihin kuvat tallennetaan.",
        prepareSummaryTemplate:
          "{duration} s · {fps} fps · {frames} kuvaa · {width}×{height}",
        estimateTemplate:
          "Noin {size}, {parts} ZIP-osaa, koodausta noin {time}. Arviot tarkentuvat sitä mukaa kuin kuvia kirjoitetaan.",
        estimateUnknown:
          "Näytekuvia ei ollut saatavilla, joten koko- ja aika-arviot eivät ole tiedossa. Vienti voi silti jatkua.",
        sampleProgress: "Luodaan näytekuvia koon ja ajan arvioimiseksi…",
        longJobTitle: "Tämä on pitkä vienti",
        longJobBody:
          "Kuvat kirjoitetaan levylle osa kerrallaan, joten koko jaksoa ei koskaan pidetä muistissa. Jokainen ZIP-osa on purettava ja yhdistettävä ennen tuontia.",
        saveFolderButton: "Valitse tallennuskansio ja aloita",
        saveFolderHint:
          "Selain pyytää kirjoitusoikeuden kerran. Sen sisään luodaan tehtäväkansio, ja valmiit osat jäävät levylle.",
        opfsButton: "Luo selaimessa ja lataa osat",
        opfsHint:
          "Selain säilyttää väliaikaiset tiedostot, kunnes lataat ne ja siivoat. Varaa tilaa väliaikaiselle kopiolle, latauksille ja puretuille kuville.",
        continueButton: "Jatka tässä välilehdessä",
        cancelPrepButton: "Peruuta valmistelu",
        adviceDesktopSafari:
          "Sujuvampaa vientiä varten käytä tietokoneen Chromea. Voit jatkaa, mutta pitkät PNG-viennit varmistetaan ensisijaisesti Chromessa.",
        adviceMobile:
          "Sujuvampaa vientiä varten vie tietokoneella. Voit jatkaa, jos laite läpäisee tallennustilan tarkistuksen.",
        capabilityMissing:
          "Tämä vienti vaatii keskeytyksen kestävän paikallisen tallennustilan ja yhden aktiivisen välilehden, joita tämä selain tai profiili ei tarjoa.",
        longStorageMissing:
          "Pitkä vienti vaatii joko kirjoitettavan kansion tai selaintallennustilan, joka todella vastaanottaa kirjoituksia. Tämä selain ei tarjoa turvallista kohdetta, joten kuvia ei luotu.",
        runTitle: "PNG-jakson vienti",
        modeDirectory: "Tallennuskansio",
        modeBrowserStorage: "Selainmuisti",
        modeMemory: "Väliaikaismuisti",
        runFramesTemplate: "Käsitellyt kuvat",
        runCommittedTemplate: "Turvassa tallennetut kuvat",
        runPartTemplate: "Nykyinen osa · tallennetut osat",
        runBytesTemplate: "Kirjoitettu",
        stoppingButton: "Pysäytetään…",
        cancelButton: "Peruuta vienti",
        cancelledMessage:
          "Vienti pysäytetty. Valmiit ZIP-osat säilytetään; jatka viimeksi tallennetusta osasta.",
        resultTitle: "PNG-vienti valmis",
        directorySavedTemplate:
          "Tallennettiin {frames} kuvaa {parts} ZIP-osana kansioon {folder} ({size}).",
        opfsPartsTitle:
          "{parts} ZIP-osaa, {size}. Lataa jokainen osa, kun se on luettelossa.",
        partDownloadButton: "Lataa",
        partRangeTemplate: "kuvat {first}–{last} · {size}",
        mergeInstructionsTitle: "Ennen tuontia",
        mergeInstructionsBody:
          "Pura kaikki osat, siirrä kaikki frame-*.png-tiedostot yhteen kansioon ja tuo se kansio kuvasarjana valitulla fps-arvolla. Älä tuo jokaista osaa erillisenä lähtölaskentana. Ensimmäinen ZIP sisältää skriptit puuttuvien kuvien tarkistamiseen.",
        autoDownloadNote:
          "Selaimen lataus on alkanut. Pidä tämä välilehti auki, kunnes se valmistuu.",
        openFolderHint:
          "Selain ei voi avata tiedostoselainta; käytä tarvittaessa järjestelmän kansioikkunaa.",
        cleanupButton: "Siivoa selaimen väliaikaistiedostot",
        recoveryTitle: "Löytyi kesken jäänyt PNG-vienti",
        recoveryBodyTemplate:
          "{frames} / {total} kuvaa on tallennettu turvassa {parts} osaan. Keskeneräinen osa tehdään uudelleen.",
        restoreButton: "Jatka vientiä",
        authorizeButton: "Salli ja jatka",
        selectFolderButton: "Valitse vientikansio",
        removeRecordButton: "Poista palautustietue",
        fontRequired:
          "Tämä vienti käytti mukautettua fonttia. Anna sama fonttitiedosto jatkaaksesi.",
        fontButton: "Valitse fonttitiedosto",
        downloadFailed:
          "Latausta ei voitu aloittaa. Valmiit tiedostot ovat yhä saatavilla yllä; yritä uudelleen.",
        errorTitle: "PNG-viennin ongelma",
        errorMessages: {
          pngStorageUnavailable:
            "Tämä selain esti PNG-vienneille tarvittavan paikallisen tallennustilan. Käytä tietokoneen Chromen tavallista ikkunaa.",
          pngDirectoryPermissionDenied:
            "Kirjoitusoikeutta valittuun kansioon ei myönnetty. Valitse kansio uudelleen ja salli kirjoitus; vientiä ei aloitettu.",
          pngStorageFull:
            "Vapaata tilaa ei riitä tämän PNG-osan viimeistelyyn. Vapauta tilaa ja jatka; tallennetut osat säilytetään.",
          pngWriteFailed:
            "PNG-osan tallennus epäonnistui. Tallennetut osat säilytetään; tarkista kansio tai tallennustila ja jatka.",
          pngZipValidationFailed:
            "Tallennettu ZIP-osa ei läpäissyt tarkistusta. Se tehdään uudelleen; aiemmat osat säilytetään.",
          pngFrameTooLarge:
            "Yksi PNG-kuva tai sen vaatima ZIP-metatieto ylittää osakohtaisen rajan. Pienennä resoluutiota tai käytä yksinkertaisempaa tyyliä.",
          pngMemoryLimitExceeded:
            "Tämä vienti tarvitsee enemmän väliaikaista muistia kuin rajattu muistipolku sallii. Käytä pitkässä viennissä tietokoneen Chromea ja kirjoitettavaa kansiota.",
          pngResumeVersionMismatch:
            "Tallennettu vienti on tehty eri asetuksilla, aineistoilla tai vanhemmalla sovellusversiolla. Sitä ei voi yhdistää turvallisesti; aloita uusi vienti ja säilytä olemassa olevat osat.",
          pngResumeFileMissing:
            "Tallennettu ZIP-osa puuttuu tai on muuttunut. Kyseinen osa on tehtävä uudelleen; valitse tehtäväkansio uudelleen ja jatka.",
          pngLocked:
            "Tämä vienti on auki toisessa välilehdessä tai selain ei voi lukita tehtävää. Sulje toinen välilehti ja yritä uudelleen.",
          pngCheckpointFailed:
            "Tämä selain ei voi säilyttää paikallista tarkistuspistettä, jota keskeytyksen kestävä PNG-vienti tarvitsee. Käytä tietokoneen Chromea tai vie lyhyt tehtävä, joka mahtuu muistiin.",
          pngFailedUnexpectedly:
            "PNG-vienti pysähtyi odottamatta. Tallennetut osat, jos niitä on, säilytetään; jatka tai aloita uusi vienti.",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "Työkalumuistiinpanot",
    heading:
      "Yksi työkalusivu ja vain se konteksti, joka tarvitaan tehokkaaseen käyttöön.",
    description:
      "Time Overlay on paikallisesti toimiva generaattori. Määritä yllä kesto, tyyli, sijainti ja muoto; tarkista alta, miten läpinäkyvyys säilyy ja mitä kannattaa testata ennen tuotantokäyttöä.",
    exportFormatsTitle: "Vientiformaatit",
    exportFormatsPngText:
      "PNG Sequence on luotettavin paikallinen vienti, kun tarvitset läpinäkyviä overlay-elementtejä tai editoriystävällisiä assetteja.",
    exportFormatsWebmText:
      "WebM on saatavilla selainnatiivina vaihtoehtona, kun nykyinen ympäristö tukee sitä vakaasti.",
    workflowEyebrow: "Miten se toimii",
    workflowHeading: "Näin overlay-ajastimen vienti toimii",
    workflowSteps: [
      {
        title: "Aseta laskurin kesto ja asettelu",
        body:
          "Aloita yllä olevasta generaattorista. Valitse kokonaiskesto, siisti kellon asettelu ja sijoita overlay kohtaan, jossa se pysyy luettavana gameplayn, tuotevideon tai talking-head-kuvan päällä.",
      },
      {
        title: "Valitse videollesi sopiva ajastintyyli",
        body:
          "Säädä typografiaa, kontrastia, kokoa ja sijaintia niin, että laskuri näyttää harkitulta eikä päälle liimatulta. Parhaat overlay-ajastimet käyttävät yleensä selkeitä numeroita, tasaista välistystä ja riittävää etäisyyttä ruudun reunasta.",
      },
      {
        title: "Vie formaatti, joka sopii editoriisi",
        body:
          "Valitse PNG Sequence, kun tarvitset turvallisimman läpinäkyvän asset-työnkulun, tai WebM, kun kevyempi paikallinen videotiedosto riittää projektiisi.",
      },
    ],
    usageEyebrow: "Käyttö",
    usageHeading: "Näin käytät Time Overlayta",
    usageNotes: [
      "Avaa generaattori, aseta ajastimen pituus ja tarkista laskenta ennen kuin viet mitään ulos.",
      "Käytä PNG Sequencea läpinäkyviin overlayihin CapCutissa, Premiere Prossa, Final Cut Prossa, DaVinci Resolvessa tai missä tahansa työnkulussa, joka suosii kuva-assetteja.",
      "Käytä WebM:ää, kun haluat nopean selainviennin mockupeihin, rough cutteihin tai kevyisiin some-editteihin.",
      "Pidä ajastin lyhyenä, kontrastisena ja erossa tekstityksistä tai kasvokuvauksesta, jotta se säilyy luettavana mobiilissa.",
    ],
    usageCta: {
      beforeFirstLink: "Aloita ",
      firstLinkLabel: "live-generaattorista",
      betweenLinks: "ja käytä alla olevaa ",
      secondLinkLabel: "vientiohjetta",
      afterSecondLink:
        "kun päätät läpinäkyvien framejen ja selaimen videolähdön välillä.",
    },
    aboutEyebrow: "Tietoa",
    aboutHeading: "Tietoa Time Overlaysta",
    aboutPoints: [
      "Time Overlay on local-first overlay-ajastimen generaattori sisällöntuottajille, jotka tarvitsevat countdown-grafiikkaa ilman videon lataamista etärenderipalveluun.",
      "Generaattori kokoaa ohjaimet, vientiohjeet ja vianmäärityksen samaan paikkaan, jotta voit luoda aineiston ja siirtää sen oikein toiseen sovellukseen.",
      "Oppaissa dokumentoitu tuki erotetaan käytännön suosituksista. Niissä näkyvät tarkistetut lähteet ja viimeisin tarkistuspäivä, jotta yhteensopivuus voidaan arvioida uudelleen.",
    ],
    aboutCta: {
      beforeLink:
        "Jos haluat ratkaista käytännön kysymykset ensin, siirry kohtaan ",
      linkLabel: "overlay-ajastimen FAQ",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Overlay-ajastimen perusteet",
    faqItems: [
      {
        question: "Voinko viedä overlay-ajastimen läpinäkyvällä taustalla?",
        answer:
          "Kyllä. Turvallisin local-first-reitti on PNG Sequence, koska editorit käsittelevät kuvapohjaisia läpinäkyviä assetteja luotettavammin kuin pakattuja videotyönkulkuja. WebM on käytettävissä, jos selain tukee sitä, mutta läpinäkyvyyttä painottavassa tuotannossa PNG Sequence on yleensä varmempi valinta.",
      },
      {
        question: "Mikä vientimuoto kannattaa valita ensin?",
        answer:
          "Aloita PNG Sequence -muodosta, jos haluat mahdollisimman varman editori-siirron, erityisesti oikean videomateriaalin päälle kompositoitaessa. Valitse WebM, kun tarvitset kevyemmän paikallisen videotiedoston ja selaintuki on kunnossa.",
      },
      {
        question: "Renderöidäänkö tämä työkalu palvelimella?",
        answer:
          "Ei. Ydinkokemus on local-first. Esikatselu ja vienti ajetaan käyttäjän koneella, jotta etusivu toimii oikeana työkaluna eikä odota etärenderöintijonoa.",
      },
      {
        question: "Millainen ajastintyyli toimii videossa parhaiten?",
        answer:
          "Yksinkertaiset numerot vahvalla kontrastilla toimivat yleensä parhaiten. Tasaleveät numerot, hillitty hehku ja huolellinen kulmasijoittelu pysyvät luettavina vilkkaassakin kuvassa paremmin kuin koristeelliset skin-tyylit.",
      },
      {
        question:
          "Sopiiko tämä TikTokiin, YouTubeen ja editoreihin kuten CapCut tai Premiere?",
        answer:
          "Kyllä, mutta luovutuspolku vaihtelee. Lyhytvideo- ja editorityönkulut hyötyvät usein läpinäkyvistä tai kuvasekvenssivienneistä, kun taas nopea paikallinen WebM-vienti toimii hyvin, jos tarvitset vain kevyen tiedoston.",
      },
    ],
  },
} satisfies RootPageContent;

export default fiRootPageContent;
