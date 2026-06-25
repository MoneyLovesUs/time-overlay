import type {
  BrowserId,
  EditorId,
  FormatId,
  FormatTransparency,
  SupportLevel,
} from "@/lib/formats/matrix";

export type CompareFaqItem = {
  question: string;
  answer: string;
};

export type CompareFormatProse = {
  /** Display name for the format, e.g. "WebM (VP9 + alpha)". */
  name: string;
  /** Who/what this format is the right pick for. */
  bestFor: string;
  /** The honest downside. */
  weakness: string;
  /** One-line opinionated verdict. */
  verdict: string;
};

export type ComparePageContent = {
  metadata: {
    title: string;
    description: string;
  };
  breadcrumbLabel: string;
  eyebrow: string;
  h1: string;
  /** The answer-first paragraph engines can lift verbatim. */
  leadAnswer: string;
  tableCaption: string;
  /** Column header labels for the decision table. */
  columns: {
    format: string;
    transparency: string;
    browsers: string;
    bestFor: string;
  };
  transparencyLabels: Record<FormatTransparency, string>;
  supportLabels: Record<SupportLevel | "n/a", string>;
  editorLabels: Record<EditorId, string>;
  browserLabels: Record<BrowserId, string>;
  /** Opinionated prose per format, keyed by the matrix format id. */
  formats: Record<FormatId, CompareFormatProse>;
  benchmarkPendingNote: string;
  benchmarkTestedTemplate: string;
  bestForLabel: string;
  watchOutLabel: string;
  markdownComparisonHeading: string;
  markdownFormatNotesHeading: string;
  ctaGeneratorLabel: string;
  ctaGuidesLabel: string;
  faqTitle: string;
  faqItems: readonly CompareFaqItem[];
};
