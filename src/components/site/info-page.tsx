import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type {
  InfoPageContent,
  InfoPageKey,
} from "@/content/info-pages";
import type { RootPageContent } from "@/content/root/types";
import { buildLocalizedPath, type EnabledLocale } from "@/lib/i18n";
import { publicationConfig } from "@/lib/publication";
import { secondaryContentLocales, siteConfig } from "@/lib/site";
import {
  buildFooterNavigation,
  buildPrimaryNavigation,
} from "@/lib/site-navigation";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/jsonld";

type InfoPageProps = {
  chrome: RootPageContent;
  content: InfoPageContent;
  locale: EnabledLocale;
  pageKey: InfoPageKey;
};

function getSchemaPageType(pageKey: InfoPageKey) {
  if (pageKey === "about") return "AboutPage" as const;
  if (pageKey === "contact") return "ContactPage" as const;
  return "WebPage" as const;
}

export function InfoPage({
  chrome,
  content,
  locale,
  pageKey,
}: InfoPageProps) {
  const path = `/${pageKey}`;
  const localizedPath = buildLocalizedPath(path, locale);
  const pageUrl = new URL(localizedPath, siteConfig.url).toString();
  const headerNavItems = buildPrimaryNavigation(locale, chrome);
  const footerNavigation = buildFooterNavigation(locale, chrome);
  const contactLabel = locale === "zh-hans" ? "发送邮件" : "Send an email";
  const breadcrumbLabel = locale === "zh-hans" ? "首页" : "Home";

  const pageJsonLd = buildWebPageJsonLd({
    name: content.heading,
    description: content.metadata.description,
    url: pageUrl,
    pageType: getSchemaPageType(pageKey),
    locale,
    dateModified: content.updatedAt,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: breadcrumbLabel, url: new URL("/", siteConfig.url).toString() },
    { name: content.heading, url: pageUrl },
  ]);

  return (
    <div>
      <JsonLd data={[pageJsonLd, breadcrumbJsonLd]} />
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={chrome.siteChrome.header.shellLabel}
        siteName={chrome.siteChrome.siteName}
        languagePickerLabel={chrome.siteChrome.header.languagePickerLabel}
        primaryNavAriaLabel={chrome.siteChrome.header.primaryNavAriaLabel}
        currentPath={path}
        localizedLocales={secondaryContentLocales}
      />

      <main className="bg-background text-foreground">
        <section className="border-b border-border/70 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
            <div className="max-w-4xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                {content.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
                {content.heading}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {content.lead}
              </p>
            </div>

            <div className="cyber-panel-muted cyber-chamfer border-l-2 border-l-primary/60 px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/65">
                {content.updatedLabel}
              </p>
              <time
                dateTime={content.updatedAt}
                className="mt-2 block font-mono text-sm text-primary"
              >
                {content.updatedAt}
              </time>
              {pageKey === "contact" && publicationConfig.contactEmail ? (
                <a
                  href={`mailto:${publicationConfig.contactEmail}`}
                  className="mt-4 inline-flex min-h-10 items-center border border-primary/55 bg-primary/10 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/20"
                >
                  {contactLabel}
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <article className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-x-12 gap-y-12 lg:grid-cols-[12rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-6 border-l border-border/70 pl-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/55">
                  {locale === "zh-hans" ? "页面索引" : "Page index"}
                </p>
                <ol className="mt-4 space-y-3">
                  {content.sections.map((section, index) => (
                    <li key={section.heading}>
                      <a
                        href={`#section-${index + 1}`}
                        className="text-xs leading-5 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="mr-2 font-mono text-tertiary/75">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="min-w-0 max-w-3xl">
              {content.sections.map((section, index) => (
                <section
                  id={`section-${index + 1}`}
                  key={section.heading}
                  className="scroll-mt-6 border-t border-border/70 py-9 first:border-t-0 first:pt-0"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-tertiary/80">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {section.heading}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 text-[15px] leading-8 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets ? (
                    <ul className="mt-5 grid gap-3">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 border-l border-tertiary/35 pl-4 text-[15px] leading-7 text-muted-foreground"
                        >
                          <span aria-hidden="true" className="font-mono text-tertiary">
                            +
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.links ? (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="cyber-panel-muted flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:border-tertiary/60 hover:text-primary"
                          >
                            <span>{link.label}</span>
                            <span aria-hidden="true" className="font-mono text-tertiary">
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <div className="mt-6 border-t border-border/70 pt-8">
                <Link
                  href={buildLocalizedPath("/", locale)}
                  className="inline-flex min-h-10 items-center gap-2 border border-border/70 px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  <span aria-hidden="true">←</span>
                  {locale === "zh-hans" ? "返回生成器" : "Back to generator"}
                </Link>
              </div>
            </div>
          </div>
        </article>
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
