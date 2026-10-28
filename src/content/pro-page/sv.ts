import type { ProPageContent } from "./types";

const svProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro - timers på 60 minuter, 60 fps och exklusiva mallar för $9",
    description:
      "En betalning på $9, inget abonnemang. Pro höjer gränsen från 5 minuter till 60 minuter, lägger till 60 fps och inkluderar de 12 exklusiva mallarna samt Pro-mallar i live-länkar för OBS.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Betala en gång och behåll pro-timerverktygen för alltid",
  lead:
    "Den kostnadsfria generatorn klarar snabba timers på 5 minuter. Pro är för jobb som ska se bra ut: streams på en timme, mjuk rörelse i 60 fps och de exklusiva mallarna för OBS, Premiere och DaVinci.",
  priceNote: "$9 en gång · livstidsåtkomst · inget abonnemang",
  compareTitle: "Det här får du med Pro",
  compareColumns: {
    feature: "Funktion",
    free: "Gratis",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Timerlängd",
      free: "Upp till 5 minuter",
      pro: "Upp till 60 minuter",
    },
    {
      feature: "Bildfrekvens",
      free: "24 eller 30 fps",
      pro: "Upp till 60 fps",
    },
    {
      feature: "Mallar",
      free: "48 mallar",
      pro: "48 mallar + 12 exklusiva",
    },
    {
      feature: "Live-länk för OBS",
      free: "Gratis mallar",
      pro: "Gratis + exklusiva mallar",
    },
    {
      feature: "Framtida Pro-mallar",
      free: "Ingår inte",
      pro: "Ingår",
    },
  ],
  audienceTitle: "Vem köper Pro",
  audienceItems: [
    {
      title: "Streamers",
      body:
        "En starting-soon-nedräkning för OBS som går hela förshowen i stället för fem minuter.",
    },
    {
      title: "Videoredigerare",
      body:
        "Arbeta med de 12 exklusiva mallarna så att nedräkningen matchar resten av din klippning, och exportera i 60 fps när klippet kräver det.",
    },
    {
      title: "Tal och evenemang",
      body:
        "Långa sessionsklockor och talartimers som går att läsa på en stor skärm.",
    },
  ],
  faqTitle: "Frågor",
  faqItems: [
    {
      question: "Är detta ett abonnemang?",
      answer:
        "Nej. Du betalar $9 en gång och upplåsningen förnyas inte. Pro-mallar som läggs till senare ingår utan extra kostnad.",
    },
    {
      question: "Jag bytte webbläsare eller har en ny laptop. Måste jag betala igen?",
      answer:
        "Nej. Använd återställningsvalet med e-postadressen du betalade med, så låses Pro upp igen i den webbläsaren.",
    },
    {
      question: "Kan jag få pengarna tillbaka?",
      answer:
        "Ja. Om Pro inte fungerar som beskrivet, kontakta oss inom 7 dagar efter köpet och du får hela beloppet tillbaka.",
    },
    {
      question: "Hur betalar jag?",
      answer:
        "Via Stripe Checkout. Kortuppgifterna hanteras av Stripe, och priset som visas här inkluderar redan eventuell regional rabatt.",
    },
  ],
  buyButton: "Köp Pro för $9",
  buyNote: "Säker betalning via Stripe · 7 dagars full återbetalning",
  restoreHint: "Har du redan köpt Pro? Återställ det med e-postadressen från köpet.",
  footerLinkLabel: "Tillbaka till generatorn",
};

export default svProPageContent;
