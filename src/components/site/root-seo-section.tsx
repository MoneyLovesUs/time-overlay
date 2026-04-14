import Link from "next/link";

import type { RootPageContent } from "@/content/root";
import type { EnabledLocale } from "@/lib/i18n";
import { buildLocalizedPath } from "@/lib/i18n";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [] as Array<Record<string, unknown>>,
};

type RootSeoSectionProps = {
  locale: EnabledLocale;
  seoSection: RootPageContent["seoSection"];
};

export function RootSeoSection({ locale, seoSection }: RootSeoSectionProps) {
  const toolHref = buildLocalizedPath("/#tool", locale);
  const exportFormatsHref = buildLocalizedPath("/#export-formats", locale);
  const faqHref = buildLocalizedPath("/#faq", locale);
  const faqJsonLdData = {
    ...faqJsonLd,
    mainEntity: seoSection.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-border/70 bg-[linear-gradient(180deg,rgba(8,9,13,1),rgba(10,11,16,1))]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLdData) }}
      />

      <div
        aria-hidden="true"
        className="cyber-grid cyber-scanlines absolute inset-0 opacity-45"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:py-14 lg:gap-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
              {seoSection.notesEyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
              {seoSection.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {seoSection.description}
            </p>
          </div>

          <div
            id="export-formats"
            className="cyber-panel-muted cyber-chamfer px-5 py-5 text-sm leading-7 text-muted-foreground"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
              {seoSection.exportFormatsTitle}
            </p>
            <p className="mt-3">
              {seoSection.exportFormatsPngText}
            </p>
            <p className="mt-3">
              {seoSection.exportFormatsWebmText}
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <article
            id="how-it-works"
            className="cyber-panel-muted cyber-chamfer px-5 py-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
              {seoSection.workflowEyebrow}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              {seoSection.workflowHeading}
            </h3>
            <ol className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              {seoSection.workflowSteps.map((step, index) => (
                <li key={step.title}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-medium text-foreground">{step.title}</p>
                  <p className="mt-2">{step.body}</p>
                </li>
              ))}
            </ol>
          </article>

          <article
            id="how-to-use"
            className="cyber-panel-muted cyber-chamfer px-5 py-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
              {seoSection.usageEyebrow}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              {seoSection.usageHeading}
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              {seoSection.usageNotes.map((note) => (
                <li key={note} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-primary"
                  >
                    &gt;
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {seoSection.usageCta.beforeFirstLink}
              <Link href={toolHref} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary">
                {seoSection.usageCta.firstLinkLabel}
              </Link>{" "}
              {seoSection.usageCta.betweenLinks}
              <Link href={exportFormatsHref} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary">
                {seoSection.usageCta.secondLinkLabel}
              </Link>{" "}
              {seoSection.usageCta.afterSecondLink}
            </p>
          </article>

          <article
            id="about-time-overlay"
            className="cyber-panel-muted cyber-chamfer px-5 py-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
              {seoSection.aboutEyebrow}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              {seoSection.aboutHeading}
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              {seoSection.aboutPoints.map((point) => (
                <p key={point}>{point}</p>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {seoSection.aboutCta.beforeLink}
              <Link href={faqHref} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary">
                {seoSection.aboutCta.linkLabel}
              </Link>
              {seoSection.aboutCta.afterLink}
            </p>
          </article>
        </div>

        <div className="cyber-panel cyber-chamfer overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>{seoSection.faqTitle}</span>
            <span className="text-primary">{seoSection.faqSubtitle}</span>
          </div>

          <div className="divide-y divide-border/70">
            {seoSection.faqItems.map((item, index) => (
              <details
                key={item.question}
                className="group px-5 py-4 open:bg-background/45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-base font-medium tracking-tight text-foreground">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-4xl pl-12 text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
