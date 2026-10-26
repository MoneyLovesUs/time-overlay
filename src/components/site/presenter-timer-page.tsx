import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { PresenterWaitlistForm } from "@/components/site/presenter-waitlist-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  PRESENTER_TIMER_PATH,
  type PresenterTimerContent,
} from "@/content/presenter-timer";
import {
  buildPresenterTopicPath,
  getPresenterTopic,
  PRESENTER_TOPIC_SLUGS,
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

type PresenterTimerPageProps = {
  chrome: RootPageContent;
  content: PresenterTimerContent;
};

export function SectionHeading({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <>
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-tertiary/80">
        {String(index).padStart(2, "0")}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>
    </>
  );
}

export function ScreenMock({
  label,
  slideTitle,
  timer,
}: {
  label: string;
  slideTitle: string;
  timer?: string;
}) {
  return (
    <figure className="min-w-0">
      <figcaption className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </figcaption>
      <div className="relative mt-3 aspect-video overflow-hidden border border-border/80 bg-background/70">
        <div className="absolute inset-[8%] flex flex-col justify-between">
          <div>
            <div className="text-sm font-semibold text-foreground sm:text-base">{slideTitle}</div>
            <div className="mt-3 space-y-2">
              <div className="h-1.5 w-4/5 bg-muted-foreground/25" />
              <div className="h-1.5 w-3/5 bg-muted-foreground/25" />
              <div className="h-1.5 w-2/3 bg-muted-foreground/25" />
            </div>
          </div>
          <div className="flex h-1/3 items-end gap-2">
            <div className="h-2/5 w-1/6 bg-tertiary/35" />
            <div className="h-3/5 w-1/6 bg-tertiary/45" />
            <div className="h-4/5 w-1/6 bg-tertiary/55" />
            <div className="h-full w-1/6 bg-primary/55" />
          </div>
        </div>
        {timer ? (
          <div className="absolute right-[5%] top-[7%] border border-primary/60 bg-background/90 px-2 py-1 font-mono text-sm text-primary shadow-[0_0_18px_rgb(0_255_136/0.25)] sm:text-base">
            {timer}
          </div>
        ) : null}
      </div>
    </figure>
  );
}

export function PresenterTimerPage({ chrome, content }: PresenterTimerPageProps) {
  const locale = defaultLocale;
  const pageUrl = new URL(PRESENTER_TIMER_PATH, siteConfig.url).toString();
  const headerNavItems = buildPrimaryNavigation(locale, chrome);
  const footerNavigation = buildFooterNavigation(locale, chrome);

  const jsonLd = [
    buildWebPageJsonLd({
      name: content.heading,
      description: content.metadata.description,
      url: pageUrl,
      pageType: "WebPage",
      locale,
      dateModified: content.updatedAt,
    }),
    buildFaqJsonLd(content.faqItems),
    buildBreadcrumbJsonLd([
      { name: "Home", url: new URL("/", siteConfig.url).toString() },
      { name: content.heading, url: pageUrl },
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
        currentPath={PRESENTER_TIMER_PATH}
        localizedLocales={secondaryContentLocales}
      />

      <main className="bg-background text-foreground">
        <section className="border-b border-border/70 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                {content.eyebrow}
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
                {content.heading}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {content.lead}
              </p>
              <a
                href="#waitlist"
                className="mt-8 inline-flex min-h-11 items-center border border-primary/60 bg-primary/10 px-5 font-mono text-[11px] uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary/20"
              >
                {content.heroCta}
              </a>
              <p className="mt-4 text-xs text-muted-foreground">{content.heroNote}</p>
            </div>

            <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <ScreenMock
                label={content.diagram.yourScreenLabel}
                slideTitle={content.diagram.slideTitle}
                timer={content.diagram.timer}
              />
              <ScreenMock
                label={content.diagram.theirScreenLabel}
                slideTitle={content.diagram.slideTitle}
              />
            </div>
          </div>
        </section>

        <div className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto w-full max-w-3xl">
            <section className="py-9 first:pt-0">
              <SectionHeading index={1}>{content.problem.heading}</SectionHeading>
              {content.problem.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[15px] leading-8 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={2}>{content.steps.heading}</SectionHeading>
              <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                {content.steps.items.map((step, index) => (
                  <li key={step.title} className="cyber-panel-muted px-4 py-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {[content.audiences, content.features].map((list, offset) => (
              <section key={list.heading} className="border-t border-border/70 py-9">
                <SectionHeading index={3 + offset}>{list.heading}</SectionHeading>
                <ul className="mt-5 grid gap-3">
                  {list.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-l border-tertiary/35 pl-4 text-[15px] leading-7 text-muted-foreground"
                    >
                      <span aria-hidden="true" className="font-mono text-tertiary">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={5}>{content.compatibility.heading}</SectionHeading>
              {content.compatibility.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[15px] leading-8 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>

            <section id="waitlist" className="scroll-mt-6 border-t border-border/70 py-9">
              <SectionHeading index={6}>{content.form.heading}</SectionHeading>
              <p className="mb-6 mt-4 text-[15px] leading-8 text-muted-foreground">
                {content.form.lead}
              </p>
              <PresenterWaitlistForm copy={content.form} privacyHref="/privacy" />
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={7}>{content.faqTitle}</SectionHeading>
              <dl className="mt-6 grid gap-6">
                {content.faqItems.map((item) => (
                  <div key={item.question}>
                    <dt className="text-base font-semibold text-foreground">{item.question}</dt>
                    <dd className="mt-2 text-[15px] leading-7 text-muted-foreground">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="border-t border-border/70 py-9">
              <SectionHeading index={8}>{content.topicsHeading}</SectionHeading>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {PRESENTER_TOPIC_SLUGS.map((slug) => {
                  const topic = getPresenterTopic(slug);
                  return (
                    <Link
                      key={slug}
                      href={buildPresenterTopicPath(slug)}
                      className="cyber-panel-muted group px-5 py-5 transition-colors hover:border-primary/60"
                    >
                      <h3 className="text-base font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">
                        {topic.heading}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {topic.metadata.description}
                      </p>
                    </Link>
                  );
                })}
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
