import type { ProPageContent } from "./types";

const fiProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro - 60 minuutin ajastimet, 60 fps ja signature-mallit $9 hintaan",
    description:
      "Yksi $9 maksu, ei tilausta. Pro nostaa 5 minuutin rajan 60 minuuttiin, lisää 60 fps:n ja sisältää 12 signature-mallia sekä Pro-mallit OBS:n live-linkeissä.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Maksa kerran ja pidä Pro-ajastintyökalut pysyvästi",
  lead:
    "Ilmainen generaattori hoitaa nopeat 5 minuutin ajastimet. Pro on niitä töitä varten, joiden pitää näyttää hyvältä: tunnin striimit, pehmeä 60 fps:n liike ja signature-mallit OBS:lle, Premierelle ja DaVincille.",
  priceNote: "$9 kerran · käyttöoikeus pysyvästi · ei tilausta",
  compareTitle: "Mitä Pro sisältää",
  compareColumns: {
    feature: "Ominaisuus",
    free: "Ilmainen",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Ajastimen kesto",
      free: "Enintään 5 minuuttia",
      pro: "Enintään 60 minuuttia",
    },
    {
      feature: "Kuvataajuus",
      free: "24 tai 30 fps",
      pro: "Enintään 60 fps",
    },
    {
      feature: "Mallit",
      free: "48 mallia",
      pro: "48 mallia + 12 signature-mallia",
    },
    {
      feature: "Live-linkki OBS:lle",
      free: "Ilmaiset mallit",
      pro: "Ilmaiset + signature-mallit",
    },
    {
      feature: "Tulevat Pro-mallit",
      free: "Eivät sisälly",
      pro: "Sisältyvät",
    },
  ],
  audienceTitle: "Kenelle Pro on",
  audienceItems: [
    {
      title: "Striimaajat",
      body:
        "Aloituslaskuri OBS:lle, joka pyörii koko preshown ajan eikä vain viisi minuuttia.",
    },
    {
      title: "Videoeditoijat",
      body:
        "Työskentele 12 signature-mallin kanssa, jotta laskuri sopii muuhun leikkaukseesi, ja vie 60 fps:nä, kun leikkaus sitä vaatii.",
    },
    {
      title: "Esitykset ja tapahtumat",
      body:
        "Pitkät sessiokellot ja puhuja-ajastimet, jotka pysyvät luettavina isolla näytöllä.",
    },
  ],
  faqTitle: "Kysymykset",
  faqItems: [
    {
      question: "Onko tämä tilaus?",
      answer:
        "Ei. Maksat $9 kerran, eikä avausta uusita automaattisesti. Myöhemmin lisättävät Pro-mallit sisältyvät ilman lisämaksua.",
    },
    {
      question: "Vaihdoin selainta tai sain uuden kannettavan. Pitääkö maksaa uudelleen?",
      answer:
        "Ei. Käytä palautustoimintoa maksamasi sähköpostiosoitteen kanssa, niin Pro avautuu uudelleen siinä selaimessa.",
    },
    {
      question: "Saanko rahat takaisin?",
      answer:
        "Kyllä. Jos Pro ei toimi kuvatulla tavalla, ota yhteyttä 7 päivän kuluessa ostoksesta, niin palautamme koko summan.",
    },
    {
      question: "Miten maksan?",
      answer:
        "Stripe Checkoutin kautta. Korttitiedot käsittelee Stripe, ja tässä näkyvä hinta sisältää jo mahdollisen alueellisen alennuksen.",
    },
  ],
  buyButton: "Hanki Pro hintaan $9",
  buyNote: "Turvallinen maksu Stripellä · täysi palautus 7 päivän kuluessa",
  restoreHint: "Ostitko Pro:n jo? Palauta se ostosähköpostillasi.",
  footerLinkLabel: "Takaisin generaattoriin",
};

export default fiProPageContent;
