import Link from "next/link";

import { SiteFooter } from "@/components/site/site-footer";
import { AdsterraNativeBanner } from "@/components/site/adsterra-ads";
import { SiteHeader } from "@/components/site/site-header";
import { JsonLd } from "@/components/site/json-ld";
import { GuideWorkflowDiagram } from "@/components/site/guide-workflow-diagram";
import {
  getGuidePageContent,
  isGuideContentLocale,
  renderGuideStepLabel,
  type GuideChromeContent,
  type GuideContent,
  type GuideSlug,
} from "@/content/guides";
import type { RootPageContent } from "@/content/root/types";
import { buildLocalizedPath, type EnabledLocale } from "@/lib/i18n";
import { publicationConfig } from "@/lib/publication";
import { secondaryContentLocales, siteConfig } from "@/lib/site";
import {
  buildFooterNavigation,
  buildPrimaryNavigation,
} from "@/lib/site-navigation";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/jsonld";

type GuidePageProps = {
  guide: GuideContent;
  guideChrome: GuideChromeContent;
  content: RootPageContent;
  locale: EnabledLocale;
  slug: GuideSlug;
};

const comparisonPath = "/compare/transparent-overlay-formats";

export function GuidePage({
  guide,
  guideChrome,
  content,
  locale,
  slug,
}: GuidePageProps) {
  const homePath = buildLocalizedPath("/", locale);
  const generatorPath =
    homePath === "/" ? "/#tool" : `${homePath}#tool`;

  const guidePath = buildLocalizedPath(`/guides/${slug}`, locale);
  const guideUrl = new URL(guidePath, siteConfig.url).toString();
  const articleJsonLd = buildArticleJsonLd({
    headline: guide.title,
    description: guide.description,
    url: guideUrl,
    datePublished: guide.publishedAt,
    dateModified: guide.reviewedAt,
    authorName: publicationConfig.authorName,
    locale,
  });
  const faqItems = guide.faqItems ?? [];
  const faqJsonLd = faqItems.length > 0 ? buildFaqJsonLd(faqItems) : null;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: siteConfig.name, url: new URL("/", siteConfig.url).toString() },
    {
      name: locale === "zh-hans" ? "指南" : "Guides",
      url: new URL(buildLocalizedPath("/guides", locale), siteConfig.url).toString(),
    },
    { name: guide.title, url: guideUrl },
  ]);

  const headerNavItems = buildPrimaryNavigation(locale, content);
  const footerNavigation = buildFooterNavigation(locale, content);
  const guideLocale = isGuideContentLocale(locale) ? locale : "en";
  const relatedGuides = guide.relatedSlugs.map((relatedSlug) => ({
    slug: relatedSlug,
    guide: getGuidePageContent(guideLocale, relatedSlug).guide,
  }));
  const labels =
    locale === "zh-hans"
      ? {
          by: "作者",
          published: "发布",
          reviewed: "复核",
          symptom: "现象",
          resolution: "处理",
          sourceChecked: "已核验来源",
          caseLabel: "案例",
        }
      : {
          by: "By",
          published: "Published",
          reviewed: "Reviewed",
          symptom: "Symptom",
          resolution: "Resolution",
          sourceChecked: "Source checked",
          caseLabel: "Case",
        };

  return (
    <div>
      <JsonLd data={articleJsonLd} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={content.siteChrome.header.shellLabel}
        siteName={content.siteChrome.siteName}
        languagePickerLabel={content.siteChrome.header.languagePickerLabel}
        primaryNavAriaLabel={content.siteChrome.header.primaryNavAriaLabel}
        currentPath={`/guides/${slug}`}
        localizedLocales={secondaryContentLocales}
      />
      <main className="bg-background text-foreground">
        <article>
          <section className="border-b border-border/70 px-6 py-16">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
              {guideChrome.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {guide.title}
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              {guide.intro}
            </p>
            <p className="text-sm font-mono uppercase tracking-[0.22em] text-secondary">
              {guideChrome.recommendedExportPrefix} {guide.recommendedFormat}
            </p>
            <dl className="flex flex-wrap gap-x-5 gap-y-2 border-y border-border/60 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <div className="flex gap-2">
                <dt>{labels.by}</dt>
                <dd className="text-foreground">{publicationConfig.authorName}</dd>
              </div>
              <div className="flex gap-2">
                <dt>{labels.published}</dt>
                <dd>
                  <time dateTime={guide.publishedAt}>{guide.publishedAt}</time>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt>{labels.reviewed}</dt>
                <dd className="text-primary">
                  <time dateTime={guide.reviewedAt}>{guide.reviewedAt}</time>
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <Link
                href={generatorPath}
                className="inline-flex items-center gap-2 border border-primary/60 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary/20"
              >
                {guideChrome.openGeneratorLabel}
              </Link>
            </div>
          </div>
          </section>

          <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto grid w-full max-w-4xl gap-6">
            <GuideWorkflowDiagram
              title={guide.workflowTitle}
              caption={guide.workflowCaption}
              stages={guide.workflowStages}
              locale={guideLocale}
            />

            <div className="cyber-panel-muted border-l-2 border-l-tertiary/65 px-5 py-5">
              <h2 className="text-xl font-semibold tracking-tight">
                {guide.verificationHeading}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {guide.reviewNote}
              </p>
              <ul className="mt-5 grid gap-3">
                {guide.verificationItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-7 text-muted-foreground"
                  >
                    <span aria-hidden="true" className="font-mono text-primary">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </section>

          <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
            {guide.steps.map((step, index) => (
              <div key={step.title} className="border-l border-tertiary/35 pl-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
                  {renderGuideStepLabel(guideChrome, index)}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  {step.title}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
          </section>

          <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className="text-xl font-semibold tracking-tight">
              {guide.troubleshootingHeading}
            </h2>
            <div className="mt-6 grid gap-4">
              {guide.troubleshootingItems.map((item, index) => (
                <div
                  key={item.symptom}
                  className="grid gap-4 border border-border/70 bg-background/55 p-5 sm:grid-cols-[9rem_minmax(0,1fr)]"
                >
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-tertiary">
                      {labels.caseLabel} {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      {labels.symptom}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {item.symptom}
                    </h3>
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                      {labels.resolution}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.resolution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>

        {faqItems.length > 0 ? (
            <section className="border-b border-border/70 px-6 py-12">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
              <h2 className="text-xl font-semibold tracking-tight">
                {guide.faqTitle ?? "Common questions"}
              </h2>
              <div className="grid gap-5">
                {faqItems.map((item) => (
                  <article key={item.question} className="border-l border-tertiary/35 pl-5">
                    <h3 className="text-base font-semibold tracking-tight">
                      {item.question}
                    </h3>
                    <p className="mt-2 leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            </section>
        ) : null}

          <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto grid w-full max-w-4xl gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {guide.sourcesHeading}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {guide.sourcesIntro}
              </p>
            </div>
            <ul className="grid gap-3">
              {guide.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="cyber-panel-muted flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:border-tertiary/60"
                  >
                    <span>
                      <span className="block text-sm font-medium text-foreground">
                        {source.label}
                      </span>
                      <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        {labels.sourceChecked} · {source.publisher}
                      </span>
                    </span>
                    <span aria-hidden="true" className="font-mono text-tertiary">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </section>

          <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="text-xl font-semibold tracking-tight">
              {guideChrome.tipsHeading}
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">{guide.closer}</p>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              {guideChrome.compareCtaBefore}
              <Link
                href={buildLocalizedPath(comparisonPath, locale)}
                className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              >
                {guideChrome.compareCtaLabel}
              </Link>
              {guideChrome.compareCtaAfter}
            </p>
          </div>
          </section>
          <section className="px-6 py-12">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className="text-xl font-semibold tracking-tight">
              {guide.relatedHeading}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {relatedGuides.map(({ slug: relatedSlug, guide: relatedGuide }) => (
                <Link
                  key={relatedSlug}
                  href={buildLocalizedPath(`/guides/${relatedSlug}`, locale)}
                  className="cyber-panel-muted group px-5 py-5 transition-colors hover:border-primary/60"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-tertiary">
                    {locale === "zh-hans" ? "相关指南" : "Related guide"}
                  </p>
                  <h3 className="mt-3 text-base font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">
                    {relatedGuide.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {relatedGuide.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          </section>
        </article>
        <AdsterraNativeBanner />
      </main>
      <SiteFooter
        navItems={footerNavigation.jumpItems}
        resourceItems={footerNavigation.resourceItems}
        trustItems={footerNavigation.trustItems}
        siteDescription={content.siteChrome.siteDescription}
        siteName={content.siteChrome.siteName}
        systemRailLabel={content.siteChrome.footer.systemRailLabel}
        publicStatusLabel={content.siteChrome.footer.publicStatusLabel}
        identityTitle={content.siteChrome.footer.identityTitle}
        jumpTitle={content.siteChrome.footer.jumpTitle}
        navAriaLabel={content.siteChrome.footer.navAriaLabel}
        productTitle={content.siteChrome.footer.productTitle}
        productDescription={content.siteChrome.footer.productDescription}
        resourceTitle={footerNavigation.resourceTitle}
        trustTitle={footerNavigation.trustTitle}
      />
    </div>
  );
}
