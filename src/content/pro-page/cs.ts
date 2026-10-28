import type { ProPageContent } from "./types";

const csProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro - 60minutové časovače, 60 fps a exkluzivní šablony za $9",
    description:
      "Jedna platba $9, žádné předplatné. Pro zvedá limit 5 minut na 60 minut, přidává 60 fps a zahrnuje 12 exkluzivních šablon a Pro šablony v živých odkazech pro OBS.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Zaplaťte jednou a nástroje pro časovač vám zůstanou napořád",
  lead:
    "Bezplatný generátor zvládne rychlé pětiminutové časovače. Pro je pro práci, která má vypadat dobře: hodinové streamy, plynulý pohyb v 60 fps a exkluzivní šablony pro OBS, Premiere a DaVinci.",
  priceNote: "$9 jednou · doživotní přístup · žádné předplatné",
  compareTitle: "Co dostanete s Pro",
  compareColumns: {
    feature: "Funkce",
    free: "Zdarma",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Délka časovače",
      free: "Až 5 minut",
      pro: "Až 60 minut",
    },
    {
      feature: "Snímková frekvence",
      free: "24 nebo 30 fps",
      pro: "Až 60 fps",
    },
    {
      feature: "Šablony",
      free: "48 šablon",
      pro: "48 šablon + 12 exkluzivních",
    },
    {
      feature: "Živý odkaz pro OBS",
      free: "Bezplatné šablony",
      pro: "Bezplatné + exkluzivní šablony",
    },
    {
      feature: "Budoucí Pro šablony",
      free: "Nejsou zahrnuté",
      pro: "Zahrnuté",
    },
  ],
  audienceTitle: "Kdo si Pro kupuje",
  audienceItems: [
    {
      title: "Streameři",
      body:
        "Odpočet spuštění pro OBS, který vydrží celou předshow místo pěti minut.",
    },
    {
      title: "Střihači videa",
      body:
        "Pracujte s 12 exkluzivními šablonami, aby odpočet ladil se zbytkem vašeho střihu, a exportujte v 60 fps, když to střih vyžaduje.",
    },
    {
      title: "Přednášky a akce",
      body:
        "Dlouhé hodiny sezení a časovače pro řečníky, které zůstanou čitelné i na velkém plátně.",
    },
  ],
  faqTitle: "Otázky",
  faqItems: [
    {
      question: "Je to předplatné?",
      answer:
        "Ne. Zaplatíte $9 jednou a odemčení se už neobnovuje. Pro šablony, které přibudou později, jsou zahrnuté bez dalších nákladů.",
    },
    {
      question: "Přešel jsem na jiný prohlížeč nebo mám nový notebook. Platím znovu?",
      answer:
        "Ne. Použijte obnovení s e-mailem, kterým jste platili, a Pro se v tom prohlížeči zase odemkne.",
    },
    {
      question: "Můžu dostat peníze zpět?",
      answer:
        "Ano. Pokud Pro nefunguje tak, jak je popsané, napište nám do 7 dnů od nákupu a vrátíme vám celou částku.",
    },
    {
      question: "Jak zaplatím?",
      answer:
        "Přes Stripe Checkout. Údaje o kartě zpracovává Stripe, cena uvedená tady už zahrnuje případnou regionální slevu.",
    },
  ],
  buyButton: "Koupit Pro za $9",
  buyNote: "Bezpečná platba přes Stripe · 7denní záruka vrácení peněz",
  restoreHint: "Už jste Pro koupili? Obnovte ho pomocí e-mailu z nákupu.",
  footerLinkLabel: "Zpět do generátoru",
};

export default csProPageContent;
