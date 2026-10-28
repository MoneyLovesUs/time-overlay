import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { ProPageBuyBox } from "@/components/site/pro-page-buy-box";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { ProPageContent } from "@/content/pro-page/types";
import type { RootPageContent } from "@/content/root/types";
import { enabledLocales, buildLocalizedPath, type EnabledLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import {
  buildFooterNavigation,
  buildPrimaryNavigation,
} from "@/lib/site-navigation";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/jsonld";

type ProPageProps = {
  content: ProPageContent;
  chrome: RootPageContent;
  locale: EnabledLocale;
};

const PRO_PATH = "/pro";

export function ProPage({ content, chrome, locale }: ProPageProps) {
  const localizedPath = buildLocalizedPath(PRO_PATH, locale);
  const pageUrl = new URL(localizedPath, siteConfig.url).toString();
  const headerNavItems = buildPrimaryNavigation(locale, chrome);
  const footerNavigation = buildFooterNavigation(locale, chrome);
  const paywallCopy = chrome.generatorUi.pro?.paywall;

  const pageJsonLd = buildWebPageJsonLd({
    name: content.heading,
    description: content.metadata.description,
    url: pageUrl,
    pageType: "WebPage",
    locale,
  });
  const faqJsonLd = buildFaqJsonLd(content.faqItems);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: siteConfig.name, url: new URL("/", siteConfig.url).toString() },
    { name: content.heading, url: pageUrl },
  ]);

  return (
    <div>
      <JsonLd data={[pageJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={chrome.siteChrome.header.shellLabel}
        siteName={chrome.siteChrome.siteName}
        languagePickerLabel={chrome.siteChrome.header.languagePickerLabel}
        primaryNavAriaLabel={chrome.siteChrome.header.primaryNavAriaLabel}
        currentPath={PRO_PATH}
        localizedLocales={enabledLocales}
      />

      <main className="bg-background text-foreground">
        <section className="border-b border-border/70 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div className="max-w-3xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                {content.eyebrow}
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
                {content.heading}
              </h1>
              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                {content.lead}
              </p>
            </div>

            <ProPageBuyBox
              content={content}
              locale={locale}
              paywallCopy={paywallCopy}
            />
          </div>
        </section>

        <section className="border-b border-border/70 px-4 py-12 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {content.compareTitle}
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <th scope="col" className="px-3 py-3 font-medium">
                      {content.compareColumns.feature}
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      {content.compareColumns.free}
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium text-primary">
                      {content.compareColumns.pro}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.comparisonRows.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-border/40 align-top"
                    >
                      <th scope="row" className="px-3 py-4 font-medium text-foreground">
                        {row.feature}
                      </th>
                      <td className="px-3 py-4 text-muted-foreground">{row.free}</td>
                      <td className="px-3 py-4 text-foreground">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 px-4 py-12 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {content.audienceTitle}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {content.audienceItems.map((item) => (
                <article
                  key={item.title}
                  className="cyber-panel-muted cyber-chamfer px-5 py-5"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {content.faqTitle}
            </h2>
            <dl className="mt-6">
              {content.faqItems.map((item) => (
                <div
                  key={item.question}
                  className="border-t border-border/70 py-5 first:border-t-0 first:pt-0"
                >
                  <dt className="text-base font-medium text-foreground">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href={buildLocalizedPath("/", locale)}
              className="mt-4 inline-flex min-h-10 items-center gap-2 border border-border/70 px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <span aria-hidden="true">←</span>
              {content.footerLinkLabel}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter
        navItems={footerNavigation.jumpItems}
        resourceItems={footerNavigation.resourceItems}
        trustItems={footerNavigation.trustItems}
        siteDescription={chrome.siteChrome.siteDescription}
        siteName={chrome.siteChrome.siteName}
        systemRailLabel={chrome.siteChrome.footer.systemRailLabel}
        publicStatusLabel={chrome.siteChrome.footer.publicStatusLabel}
        identityTitle={chrome.siteChrome.footer.identityTitle}
        jumpTitle={chrome.siteChrome.footer.jumpTitle}
        navAriaLabel={chrome.siteChrome.footer.navAriaLabel}
        productTitle={chrome.siteChrome.footer.productTitle}
        productDescription={chrome.siteChrome.footer.productDescription}
        resourceTitle={footerNavigation.resourceTitle}
        trustTitle={footerNavigation.trustTitle}
      />
    </div>
  );
}
