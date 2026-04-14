import type { RootPageContent } from "@/content/root/types";

const fiRootPageContent = {
  metadata: {
    title: "Overlay-ajastimen generaattori PNG Sequence- ja WebM-vientiin",
    description:
      "Rakenna overlay-ajastin suoraan selaimessa, esikatsele sitä livenä ja vie tiedostot PNG Sequence- tai WebM-muodossa yhdeltä local-first-työkalusivulta.",
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
    themePresetPicker: {
      title: "Teemaesiasetus",
      description:
        "Valitse ensin lähtötyyli ja säädä asetuksia vain tarvittaessa.",
    },
    controlPanel: {
      title: "Asetukset",
      subtitle: "Syöttökerros",
      timerSetupTitle: "Ajastimen asetukset",
      durationLabel: "Kesto (sekuntia)",
      displayFormatLabel: "Näyttömuoto",
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Tarkkuusesiasetus",
      backgroundModeLabel: "Taustatila",
      styleTitle: "Tyyli",
      fontFamilyLabel: "Fonttiperhe",
      anchorLabel: "Ankkuri",
      transparentOptionLabel: "Läpinäkyvä",
      solidOptionLabel: "Yksivärinen",
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
      webmLabel: "WebM",
      webmDescription:
        "Hyvä kevyeen paikalliseen videovientiin tuetuissa selaimissa.",
      fpsLabel: "FPS",
      qualityLabel: "Laatu",
      launchNoteTitle: "Julkaisuhuomio",
      launchNoteFallback:
        "Vienti pysyy MVP-vaiheessa local-first-mallissa. Jos muotoa ei tueta nykyisessä selaimessa, käyttöliittymä ohjaa PNG Sequence -vientiin.",
      exportButtonIdle: "Vie assetti",
      exportButtonBusy: "Viedään...",
      exportStatusTitle: "Viennin tila",
      exportStatusIdle:
        "Valmiustila. Valitse muoto ja käynnistä paikallinen vienti.",
      standardQualityLabel: "Perus",
      highQualityLabel: "Korkea",
    },
  },
  seoSection: {
    notesEyebrow: "Työkalumuistiinpanot",
    heading:
      "Yksi työkalusivu ja vain se konteksti, joka tarvitaan tehokkaaseen käyttöön.",
    description:
      "Time Overlay on suunniteltu local-first overlay-ajastimen generaattoriksi. Aseta yllä kestot, tyyli, sijainti ja vientimuoto, ja käytä tätä alaosaa niihin kysymyksiin, jotka ovat edelleen tärkeitä SEO:n ja käytännön työnkulkujen kannalta.",
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
      "Sivu on tarkoituksella tiivis: yksi toimiva työkalupinta, yksi selkeä vientiformaattiosio ja yksi SEO-tukialue, joka vastaa työnkulkuun liittyviin kysymyksiin ennen kuin käyttäjä luottaa ajastintyökaluun.",
      "Siksi homepage toimii sekä oikeana tuotantotyökaluna että indeksoitavana laskeutumissivuna hauille kuten overlay timer, countdown timer overlay, transparent countdown overlay ja timer overlay for video editing.",
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
