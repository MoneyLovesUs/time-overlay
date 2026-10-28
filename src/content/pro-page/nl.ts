import type { ProPageContent } from "./types";

const nlProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro - timers van 60 minuten, 60 fps en exclusieve sjablonen voor $9",
    description:
      "Eén betaling van $9, geen abonnement. Pro verhoogt de limiet van 5 minuten naar 60 minuten, voegt 60 fps toe en bevat de 12 exclusieve sjablonen en Pro-sjablonen in live-links voor OBS.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Betaal één keer en houd de pro-timertools voor altijd",
  lead:
    "De gratis generator dekt korte timers van 5 minuten. Pro is voor klussen die er goed uit moeten zien: streams van een uur, vloeiende beweging in 60 fps en de exclusieve sjablonen voor OBS, Premiere en DaVinci.",
  priceNote: "$9 eenmalig · levenslange toegang · geen abonnement",
  compareTitle: "Wat je krijgt met Pro",
  compareColumns: {
    feature: "Functie",
    free: "Gratis",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Lengte van de timer",
      free: "Tot 5 minuten",
      pro: "Tot 60 minuten",
    },
    {
      feature: "Framesnelheid",
      free: "24 of 30 fps",
      pro: "Tot 60 fps",
    },
    {
      feature: "Sjablonen",
      free: "48 sjablonen",
      pro: "48 sjablonen + 12 exclusieve",
    },
    {
      feature: "Live-link voor OBS",
      free: "Gratis sjablonen",
      pro: "Gratis + exclusieve sjablonen",
    },
    {
      feature: "Toekomstige Pro-sjablonen",
      free: "Niet inbegrepen",
      pro: "Inbegrepen",
    },
  ],
  audienceTitle: "Wie koopt Pro",
  audienceItems: [
    {
      title: "Streamers",
      body:
        "Een starting-soon-countdown voor OBS die de hele preshow loopt in plaats van vijf minuten.",
    },
    {
      title: "Video-editors",
      body:
        "Werk met de 12 exclusieve sjablonen zodat de countdown bij de rest van je montage past, en exporteer in 60 fps wanneer de cut dat nodig heeft.",
    },
    {
      title: "Lezingen en evenementen",
      body:
        "Lange sessieklokken en sprekerstimers die leesbaar blijven op een groot scherm.",
    },
  ],
  faqTitle: "Vragen",
  faqItems: [
    {
      question: "Is dit een abonnement?",
      answer:
        "Nee. Je betaalt één keer $9 en de unlock wordt niet verlengd. Pro-sjablonen die later bijkomen, zijn zonder extra kosten inbegrepen.",
    },
    {
      question: "Ik ben van browser gewisseld of heb een nieuwe laptop. Betaal ik opnieuw?",
      answer:
        "Nee. Gebruik de hersteloptie met het e-mailadres waarmee je hebt betaald, en Pro wordt in die browser weer ontgrendeld.",
    },
    {
      question: "Kan ik mijn geld terugkrijgen?",
      answer:
        "Ja. Als Pro niet werkt zoals beschreven, neem dan binnen 7 dagen na de aankoop contact op en je krijgt het volledige bedrag terug.",
    },
    {
      question: "Hoe betaal ik?",
      answer:
        "Via Stripe Checkout. Kaartgegevens worden door Stripe verwerkt; de prijs die je hier ziet is al inclusief een eventuele regionale korting.",
    },
  ],
  buyButton: "Koop Pro voor $9",
  buyNote: "Veilig afrekenen via Stripe · 7 dagen volledige terugbetaling",
  restoreHint: "Pro al gekocht? Herstel het met het e-mailadres van je aankoop.",
  footerLinkLabel: "Terug naar de generator",
};

export default nlProPageContent;
