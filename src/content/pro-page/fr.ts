import type { ProPageContent } from "./types";

const frProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro : des timers de 60 minutes, du 60 fps et les modèles signature pour $9",
    description:
      "Un seul paiement de $9, sans abonnement. Pro fait passer la limite de 5 minutes à 60 minutes, ajoute le 60 fps et inclut les 12 modèles signature ainsi que les modèles Pro dans les liens live pour OBS.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Payez une fois et gardez les outils pro pour de bon",
  lead:
    "Le générateur gratuit couvre les timers rapides de 5 minutes. Pro est fait pour les projets que vous voulez soignés : des lives d'une heure, un mouvement fluide à 60 fps et les modèles signature pour OBS, Premiere et DaVinci.",
  priceNote: "$9 une fois · accès à vie · sans abonnement",
  compareTitle: "Ce que vous obtenez avec Pro",
  compareColumns: {
    feature: "Fonction",
    free: "Gratuit",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Durée du timer",
      free: "Jusqu'à 5 minutes",
      pro: "Jusqu'à 60 minutes",
    },
    {
      feature: "Fréquence d'images",
      free: "24 ou 30 fps",
      pro: "Jusqu'à 60 fps",
    },
    {
      feature: "Modèles",
      free: "48 modèles",
      pro: "48 modèles + 12 signature",
    },
    {
      feature: "Lien live pour OBS",
      free: "Modèles gratuits",
      pro: "Gratuits + modèles signature",
    },
    {
      feature: "Futurs modèles Pro",
      free: "Non inclus",
      pro: "Inclus",
    },
  ],
  audienceTitle: "Qui achète Pro",
  audienceItems: [
    {
      title: "Streamers",
      body:
        "Un compte à rebours de début pour OBS qui tourne pendant tout le pré-show au lieu de cinq minutes.",
    },
    {
      title: "Monteurs vidéo",
      body:
        "Travaillez avec les 12 modèles signature pour que le compte à rebours s'accorde au reste de votre montage, et exportez en 60 fps quand le cut le demande.",
    },
    {
      title: "Conférences et événements",
      body:
        "Des horloges de session longues et des timers d'intervenant qui restent lisibles sur un grand écran.",
    },
  ],
  faqTitle: "Questions",
  faqItems: [
    {
      question: "Est-ce un abonnement ?",
      answer:
        "Non. Vous payez $9 une fois et le déblocage ne se renouvelle pas. Les modèles Pro ajoutés plus tard sont inclus sans frais supplémentaires.",
    },
    {
      question: "J'ai changé de navigateur ou pris un nouvel ordinateur. Je paie encore ?",
      answer:
        "Non. Utilisez l'option de restauration avec l'email utilisé pour le paiement et Pro se débloque à nouveau dans ce navigateur.",
    },
    {
      question: "Puis-je obtenir un remboursement ?",
      answer:
        "Oui. Si Pro ne fonctionne pas comme annoncé, contactez-nous dans les 7 jours suivant l'achat pour un remboursement complet.",
    },
    {
      question: "Comment je paie ?",
      answer:
        "Via Stripe Checkout. Les données de carte sont gérées par Stripe ; le prix affiché ici inclut déjà une éventuelle réduction régionale.",
    },
  ],
  buyButton: "Prenez Pro pour $9",
  buyNote: "Paiement sécurisé par Stripe · remboursement complet sous 7 jours",
  restoreHint: "Vous avez déjà acheté Pro ? Restaurez-le avec l'email de votre achat.",
  footerLinkLabel: "Retour au générateur",
};

export default frProPageContent;
