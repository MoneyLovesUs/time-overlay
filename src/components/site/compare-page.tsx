import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { CompareTable } from "@/components/site/compare-table";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { ComparePageContent } from "@/content/compare/types";
import type { RootPageContent } from "@/content/root/types";
import { FORMAT_MATRIX } from "@/lib/formats/matrix";
import { buildLocalizedPath, type EnabledLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildItemListJsonLd,
} from "@/lib/seo/jsonld";

type ComparePageProps = {
  content: ComparePageContent;
  chrome: RootPageContent;
  locale: EnabledLocale;
  path: string;
};

export function ComparePage({ content, chrome, locale, path }: ComparePageProps) {
  const localizedPath = buildLocalizedPath(path, locale);
  const pageUrl = new URL(localizedPath, siteConfig.url).toString();
  const generatorPath = buildLocalizedPath("/#tool", locale);
  const guidesPath = buildLocalizedPath("/#guides", locale);

  const headerNavItems = [
    { href: buildLocalizedPath("/#tool", locale), label: chrome.siteChrome.header.toolLinkLabel },
    { href: buildLocalizedPath("/#faq", locale), label: chrome.siteChrome.header.faqLinkLabel },
  ];
  const footerNavItems = chrome.siteChrome.footer.jumpLinks.map((item) => ({
    href: buildLocalizedPath(`/#${item.anchorId}`, locale),
    label: item.label,
  }));

  const itemListJsonLd = buildItemListJsonLd({
    name: content.h1,
    description: content.metadata.description,
    items: FORMAT_MATRIX.map((row) => ({
      name: content.formats[row.id].name,
      description: content.formats[row.id].verdict,
    })),
  });
  const faqJsonLd = buildFaqJsonLd(content.faqItems);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: siteConfig.name, url: new URL("/", siteConfig.url).toString() },
    { name: content.breadcrumbLabel, url: pageUrl },
  ]);

  return (
    <div>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={chrome.siteChrome.header.shellLabel}
        siteName={chrome.siteChrome.siteName}
        languagePickerLabel={chrome.siteChrome.header.languagePickerLabel}
        primaryNavAriaLabel={chrome.siteChrome.header.primaryNavAriaLabel}
      />
      <main className="bg-background text-foreground">
        <section className="border-b border-border/70 px-6 py-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
              {content.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {content.h1}
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              {content.leadAnswer}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={generatorPath}
                className="inline-flex items-center gap-2 border border-primary/60 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary/20"
              >
                {content.ctaGeneratorLabel}
              </Link>
              <Link
                href={guidesPath}
                className="inline-flex items-center gap-2 border border-border/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {content.ctaGuidesLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto w-full max-w-6xl">
            <CompareTable content={content} />
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-2">
            {FORMAT_MATRIX.map((row) => {
              const prose = content.formats[row.id];
              return (
                <article
                  key={row.id}
                  className="cyber-panel-muted cyber-chamfer px-5 py-5"
                >
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {prose.name}
                  </h2>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                    {prose.verdict}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    <span className="text-foreground">{content.bestForLabel} </span>
                    {prose.bestFor}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    <span className="text-foreground">{content.watchOutLabel} </span>
                    {prose.weakness}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border/70 px-6 py-12">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {content.faqTitle}
            </h2>
            <div className="mt-5 divide-y divide-border/70">
              {content.faqItems.map((item) => (
                <details key={item.question} className="group py-4">
                  <summary className="cursor-pointer list-none text-base font-medium text-foreground">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        navItems={footerNavItems}
        siteDescription={chrome.siteChrome.siteDescription}
        siteName={chrome.siteChrome.siteName}
        systemRailLabel={chrome.siteChrome.footer.systemRailLabel}
        publicStatusLabel={chrome.siteChrome.footer.publicStatusLabel}
        identityTitle={chrome.siteChrome.footer.identityTitle}
        jumpTitle={chrome.siteChrome.footer.jumpTitle}
        navAriaLabel={chrome.siteChrome.footer.navAriaLabel}
        productTitle={chrome.siteChrome.footer.productTitle}
        productDescription={chrome.siteChrome.footer.productDescription}
      />
    </div>
  );
}
