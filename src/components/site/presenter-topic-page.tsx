import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { ScreenMock, SectionHeading } from "@/components/site/presenter-timer-page";
import { PresenterWaitlistForm } from "@/components/site/presenter-waitlist-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  PRESENTER_TIMER_PATH,
  presenterTimerContent,
} from "@/content/presenter-timer";
import {
  buildPresenterTopicPath,
  getPresenterTopic,
  type PresenterTopic,
} from "@/content/presenter-topics";
import type { RootPageContent } from "@/content/root/types";
import { defaultLocale } from "@/lib/i18n";
import { secondaryContentLocales, siteConfig } from "@/lib/site";
import {
  buildFooterNavigation,
  buildPrimaryNavigation,
} from "@/lib/site-navigation";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/jsonld";

type PresenterTopicPageProps = {
  chrome: RootPageContent;
  topic: PresenterTopic;
};

const linkClassName =
  "text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary";

export function PresenterTopicPage({ chrome, topic }: PresenterTopicPageProps) {
  const locale = defaultLocale;
  const path = buildPresenterTopicPath(topic.slug);
  const pageUrl = new URL(path, siteConfig.url).toString();
  const hubUrl = new URL(PRESENTER_TIMER_PATH, siteConfig.url).toString();
  const headerNavItems = buildPrimaryNavigation(locale, chrome);
  const footerNavigation = buildFooterNavigation(locale, chrome);
  const related = topic.relatedSlugs.map((slug) => getPresenterTopic(slug));

  const jsonLd = [
    buildWebPageJsonLd({
      name: topic.heading,
      description: topic.metadata.description,
      url: pageUrl,
      pageType: "WebPage",
      locale,
      dateModified: topic.reviewedAt,
    }),
    buildFaqJsonLd(topic.faqItems),
    buildBreadcrumbJsonLd([
      { name: "Home", url: new URL("/", siteConfig.url).toString() },
      { name: presenterTimerContent.metadata.title, url: hubUrl },
      { name: topic.heading, url: pageUrl },
    ]),
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />
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
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="min-w-0">
              <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                <Link href={PRESENTER_TIMER_PATH} className="hover:text-primary">
                  Presenter timer
                </Link>
                <span aria-hidden="true"> / </span>
                <span>{topic.breadcrumbLabel}</span>
              </nav>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
                {topic.heading}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {topic.lead}
              </p>
              <a
                href="#waitlist"
                className="mt-8 inline-flex min-h-11 items-center border border-primary/60 bg-primary/10 px-5 font-mono text-[11px] uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary/20"
              >
                {presenterTimerContent.heroCta}
              </a>
              <p className="mt-4 text-xs text-muted-foreground">{presenterTimerContent.heroNote}</p>
            </div>

            <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <ScreenMock
                label={presenterTimerContent.diagram.yourScreenLabel}
                slideTitle={topic.diagramSlideTitle}
                timer={presenterTimerContent.diagram.timer}
              />
              <ScreenMock
                label={presenterTimerContent.diagram.theirScreenLabel}
                slideTitle={topic.diagramSlideTitle}
              />
            </div>
          </div>
        </section>

        <div className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto w-full max-w-3xl">
            <section className="py-9 first:pt-0">
              <SectionHeading index={1}>{topic.answer.heading}</SectionHeading>
              <div className="cyber-panel-muted mt-5 px-5 py-5">
                <p className="text-[15px] leading-8 text-foreground">{topic.answer.body}</p>
              </div>
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={2}>{topic.native.heading}</SectionHeading>
              <p className="mt-4 text-[15px] leading-8 text-muted-foreground">{topic.native.intro}</p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/80 font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
                      <th scope="col" className="py-3 pr-4 font-normal">Option</th>
                      <th scope="col" className="py-3 pr-4 font-normal">Who sees it</th>
                      <th scope="col" className="py-3 font-normal">Catch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topic.native.rows.map((row) => (
                      <tr key={row.option} className="border-b border-border/50 align-top">
                        <th scope="row" className="py-3 pr-4 font-semibold text-foreground">
                          {row.option}
                        </th>
                        <td className="py-3 pr-4 leading-6 text-muted-foreground">{row.visibility}</td>
                        <td className="py-3 leading-6 text-muted-foreground">{row.limit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={3}>{topic.workarounds.heading}</SectionHeading>
              <ul className="mt-5 grid gap-4">
                {topic.workarounds.items.map((item) => (
                  <li key={item.title} className="border-l border-tertiary/35 pl-4">
                    <p className="text-[15px] font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-[15px] leading-7 text-muted-foreground">{item.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={4}>{topic.desktop.heading}</SectionHeading>
              {topic.desktop.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[15px] leading-8 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
                Platforms, planned features and honest limits are on the{" "}
                <Link href={PRESENTER_TIMER_PATH} className={linkClassName}>
                  Time Overlay Desktop overview
                </Link>
                .
              </p>
            </section>

            <section id="waitlist" className="scroll-mt-6 border-t border-border/70 py-9">
              <SectionHeading index={5}>{presenterTimerContent.form.heading}</SectionHeading>
              <p className="mb-6 mt-4 text-[15px] leading-8 text-muted-foreground">
                {presenterTimerContent.form.lead}
              </p>
              <PresenterWaitlistForm
                copy={presenterTimerContent.form}
                privacyHref="/privacy"
                source={topic.slug}
                defaultUseCase={topic.defaultUseCase}
              />
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={6}>{topic.faqTitle}</SectionHeading>
              <dl className="mt-6 grid gap-6">
                {topic.faqItems.map((item) => (
                  <div key={item.question}>
                    <dt className="text-base font-semibold text-foreground">{item.question}</dt>
                    <dd className="mt-2 text-[15px] leading-7 text-muted-foreground">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={7}>Sources</SectionHeading>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Checked against official documentation on {topic.reviewedAt}. Meeting apps change often, so
                confirm in your own version.
              </p>
              <ul className="mt-4 grid gap-2 text-sm">
                {topic.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} rel="noopener" className={linkClassName}>
                      {source.label}
                    </a>
                    <span className="text-muted-foreground"> · {source.publisher}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={8}>Related</SectionHeading>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildPresenterTopicPath(item.slug)}
                    className="cyber-panel-muted group px-5 py-5 transition-colors hover:border-primary/60"
                  >
                    <h3 className="text-base font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">
                      {item.heading}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {item.metadata.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
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
