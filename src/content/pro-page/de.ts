import type { ProPageContent } from "./types";

const deProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro: Timer bis 60 Minuten, 60 fps und Signature-Vorlagen für $9",
    description:
      "Einmal $9 zahlen, kein Abo. Pro hebt das Limit von 5 auf 60 Minuten an, ergänzt 60 fps und enthält die 12 Signature-Vorlagen sowie Pro-Vorlagen in Live-Links für OBS.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Einmal zahlen und die Pro-Timer-Tools dauerhaft behalten",
  lead:
    "Der kostenlose Generator deckt schnelle 5-Minuten-Timer ab. Pro ist für die Jobs gedacht, die gut aussehen sollen: einstündige Streams, flüssige Bewegung mit 60 fps und die Signature-Vorlagen für OBS, Premiere und DaVinci.",
  priceNote: "$9 einmalig · lebenslanger Zugriff · kein Abo",
  compareTitle: "Das bekommst du mit Pro",
  compareColumns: {
    feature: "Funktion",
    free: "Kostenlos",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Timer-Länge",
      free: "Bis zu 5 Minuten",
      pro: "Bis zu 60 Minuten",
    },
    {
      feature: "Bildrate",
      free: "24 oder 30 fps",
      pro: "Bis zu 60 fps",
    },
    {
      feature: "Vorlagen",
      free: "48 Vorlagen",
      pro: "48 Vorlagen + 12 Signature",
    },
    {
      feature: "Live-Link für OBS",
      free: "Kostenlose Vorlagen",
      pro: "Kostenlose + Signature-Vorlagen",
    },
    {
      feature: "Künftige Pro-Vorlagen",
      free: "Nicht enthalten",
      pro: "Enthalten",
    },
  ],
  audienceTitle: "Wer Pro kauft",
  audienceItems: [
    {
      title: "Streamer",
      body:
        "Ein Countdown für den Start, der in OBS den ganzen Pre-Show läuft statt nur fünf Minuten.",
    },
    {
      title: "Video-Editoren",
      body:
        "Arbeite mit den 12 Signature-Vorlagen, damit der Countdown zum Rest deines Schnitts passt, und exportiere mit 60 fps, wenn der Cut es braucht.",
    },
    {
      title: "Talks und Events",
      body:
        "Lange Session-Uhren und Sprecher-Timer, die auch auf einer großen Leinwand lesbar bleiben.",
    },
  ],
  faqTitle: "Fragen",
  faqItems: [
    {
      question: "Ist das ein Abo?",
      answer:
        "Nein. Du zahlst einmal $9 und die Freischaltung verlängert sich nicht. Später ergänzte Pro-Vorlagen sind ohne Aufpreis dabei.",
    },
    {
      question: "Ich habe den Browser gewechselt oder einen neuen Laptop. Zahle ich nochmal?",
      answer:
        "Nein. Nutze die Wiederherstellung mit der E-Mail, mit der du bezahlt hast, dann ist Pro in diesem Browser wieder freigeschaltet.",
    },
    {
      question: "Bekomme ich eine Rückerstattung?",
      answer:
        "Ja. Wenn Pro nicht wie beschrieben funktioniert, melde dich innerhalb von 7 Tagen nach dem Kauf und du bekommst den vollen Betrag zurück.",
    },
    {
      question: "Wie bezahle ich?",
      answer:
        "Über Stripe Checkout. Die Kartendaten werden von Stripe verarbeitet; der hier gezeigte Preis enthält bereits einen möglichen regionalen Rabatt.",
    },
  ],
  buyButton: "Hol dir Pro für $9",
  buyNote: "Sichere Zahlung über Stripe · volle Rückerstattung innerhalb von 7 Tagen",
  restoreHint: "Pro schon gekauft? Stelle es mit der E-Mail deines Kaufs wieder her.",
  footerLinkLabel: "Zurück zum Generator",
};

export default deProPageContent;
