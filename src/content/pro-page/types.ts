export type ProPageComparisonRow = {
  feature: string;
  free: string;
  pro: string;
};

export type ProPageFaqItem = {
  question: string;
  answer: string;
};

export type ProPageContent = {
  metadata: {
    title: string;
    description: string;
  };
  eyebrow: string;
  heading: string;
  lead: string;
  priceNote: string;
  compareTitle: string;
  compareColumns: {
    feature: string;
    free: string;
    pro: string;
  };
  comparisonRows: readonly ProPageComparisonRow[];
  audienceTitle: string;
  audienceItems: readonly {
    title: string;
    body: string;
  }[];
  faqTitle: string;
  faqItems: readonly ProPageFaqItem[];
  buyButton: string;
  buyNote: string;
  restoreHint: string;
  footerLinkLabel: string;
};
