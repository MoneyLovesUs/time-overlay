import type { ProPageContent } from "./types";

const enProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro: 4K timers, 60 fps and 60-minute exports for $9",
    description:
      "One $9 payment, no subscription. Pro lifts the 5-minute cap to 60 minutes, adds 60 fps, 4K export, single-file transparent video and the 12 signature templates.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Pay once, keep the pro timer tools for good",
  lead:
    "The free generator covers quick 5-minute timers at 1080p. Pro is for the jobs you want to look right: hour-long streams, 4K edits, 60 fps motion and one-file transparent overlays for OBS or Premiere.",
  priceNote: "$9 once · lifetime access · no subscription",
  compareTitle: "What you get with Pro",
  compareColumns: {
    feature: "Feature",
    free: "Free",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Timer length",
      free: "Up to 5 minutes",
      pro: "Up to 60 minutes",
    },
    {
      feature: "Frame rate",
      free: "24 or 30 fps",
      pro: "Up to 60 fps",
    },
    {
      feature: "Resolution",
      free: "720p, 1080p, square",
      pro: "Free sizes + 4K (2160p)",
    },
    {
      feature: "Transparent video",
      free: "PNG sequence",
      pro: "PNG sequence + one-file VP9/HEVC",
    },
    {
      feature: "Templates",
      free: "48 templates",
      pro: "48 templates + 12 signature",
    },
    {
      feature: "Live link for OBS",
      free: "Free templates",
      pro: "Free + signature templates",
    },
    {
      feature: "Future Pro templates",
      free: "Not included",
      pro: "Included",
    },
  ],
  audienceTitle: "Who buys Pro",
  audienceItems: [
    {
      title: "Streamers",
      body:
        "A starting-soon countdown for OBS that runs for the whole pre-show instead of five minutes.",
    },
    {
      title: "Video editors",
      body:
        "Drop a transparent overlay straight into Premiere or DaVinci at the resolution of your timeline, no re-render to 1080p.",
    },
    {
      title: "Talks and events",
      body:
        "Long session clocks and speaker timers that stay readable on a big screen.",
    },
  ],
  faqTitle: "Questions",
  faqItems: [
    {
      question: "Is this a subscription?",
      answer:
        "No. You pay $9 once and the unlock does not renew. Pro templates added later are included at no extra cost.",
    },
    {
      question: "I switched browser or got a new laptop. Do I pay again?",
      answer:
        "No. Use the restore option with the email you paid with, and Pro unlocks again in that browser.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Yes. If Pro does not work as described, contact us within 7 days of the purchase for a full refund.",
    },
    {
      question: "How do I pay?",
      answer:
        "Through Stripe Checkout. Card details are handled by Stripe; the price shown here already includes any regional discount.",
    },
  ],
  buyButton: "Get Pro for $9",
  buyNote: "Secure checkout by Stripe · 7-day full refund",
  restoreHint: "Already bought Pro? Restore it with your purchase email.",
  footerLinkLabel: "Back to the generator",
};

export default enProPageContent;
