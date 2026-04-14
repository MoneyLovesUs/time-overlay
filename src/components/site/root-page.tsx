import type { EnabledLocale } from "@/lib/i18n";
import { buildLocalizedPath } from "@/lib/i18n";
import type { RootPageContent } from "@/content/root";
import { GeneratorShell } from "@/components/generator/generator-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { RootSeoSection } from "@/components/site/root-seo-section";

type RootPageProps = {
  locale: EnabledLocale;
  content: RootPageContent;
};

export function RootPage({ locale, content }: RootPageProps) {
  const formatsJumpLink = content.siteChrome.footer.jumpLinks.find(
    (item) => item.anchorId === "export-formats",
  );

  if (!formatsJumpLink) {
    throw new Error("Missing export-formats jump link for localized chrome.");
  }

  const headerNavItems = [
    {
      href: buildLocalizedPath("/#tool", locale),
      label: content.siteChrome.header.toolLinkLabel,
    },
    {
      href: buildLocalizedPath("/#faq", locale),
      label: content.siteChrome.header.faqLinkLabel,
    },
    {
      href: buildLocalizedPath("/#export-formats", locale),
      label: formatsJumpLink.label,
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
      <GeneratorShell hero={content.generatorHero} ui={content.generatorUi} />
      <RootSeoSection locale={locale} seoSection={content.seoSection} />
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
