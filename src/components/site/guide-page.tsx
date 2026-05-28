import Link from "next/link";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { GuideContent } from "@/content/guides";
import type { RootPageContent } from "@/content/root/types";
import { buildLocalizedPath, type EnabledLocale } from "@/lib/i18n";

type GuidePageProps = {
  guide: GuideContent;
  content: RootPageContent;
  locale: EnabledLocale;
};

export function GuidePage({ guide, content, locale }: GuidePageProps) {
  const homePath = buildLocalizedPath("/", locale);
  const generatorPath =
    homePath === "/" ? "/#tool" : `${homePath}#tool`;

  const headerNavItems = [
    {
      href: buildLocalizedPath("/#tool", locale),
      label: content.siteChrome.header.toolLinkLabel,
    },
    {
      href: buildLocalizedPath("/#faq", locale),
      label: content.siteChrome.header.faqLinkLabel,
    },
  ];
  const footerNavItems = content.siteChrome.footer.jumpLinks.map((item) => ({
    href: buildLocalizedPath(`/#${item.anchorId}`, locale),
    label: item.label,
  }));

  return (
    <div>
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={content.siteChrome.header.shellLabel}
        siteName={content.siteChrome.siteName}
      />
      <main className="bg-background text-foreground">
        <section className="border-b border-border/70 px-6 py-16">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
              Time Overlay guide
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {guide.title}
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              {guide.intro}
            </p>
            <p className="text-sm font-mono uppercase tracking-[0.22em] text-secondary">
              Recommended Time Overlay export: {guide.recommendedFormat}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={generatorPath}
                className="inline-flex items-center gap-2 border border-primary/60 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary/20"
              >
                Open the Time Overlay generator
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
            {guide.steps.map((step, index) => (
              <div key={step.title} className="border-l border-tertiary/35 pl-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  {step.title}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="text-xl font-semibold tracking-tight">
              Time Overlay tips
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">{guide.closer}</p>
          </div>
        </section>
      </main>
      <SiteFooter
        navItems={footerNavItems}
        siteDescription={content.siteChrome.siteDescription}
        siteName={content.siteChrome.siteName}
        systemRailLabel={content.siteChrome.footer.systemRailLabel}
        publicStatusLabel={content.siteChrome.footer.publicStatusLabel}
        identityTitle={content.siteChrome.footer.identityTitle}
        jumpTitle={content.siteChrome.footer.jumpTitle}
        productTitle={content.siteChrome.footer.productTitle}
        productDescription={content.siteChrome.footer.productDescription}
      />
    </div>
  );
}
