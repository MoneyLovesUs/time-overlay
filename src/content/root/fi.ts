import type { RootPageContent } from "@/content/root/types";

const fiRootPageContent = {
  metadata: {
    title: "Overlay-ajastimen generaattori PNG Sequence- ja WebM-vientiin",
    description:
      "Rakenna overlay-ajastin suoraan selaimessa, esikatsele sitä livenä ja vie tiedostot PNG Sequence- tai WebM-muodossa yhdeltä local-first-työkalusivulta.",
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
        { href: "/#tool", label: "Generaattori" },
        { href: "/#faq", label: "FAQ" },
        { href: "/#export-formats", label: "Formaatit" },
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
