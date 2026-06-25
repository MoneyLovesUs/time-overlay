import type { EnabledLocale } from "@/lib/i18n";
import { buildLocalizedPath } from "@/lib/i18n";
import type { RootPageContent } from "@/content/root";
import { LazyGeneratorShell } from "@/components/site/lazy-generator-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { RootSeoSection } from "@/components/site/root-seo-section";
import { RootGuidesSection } from "@/components/site/root-guides-section";

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
        languagePickerLabel={content.siteChrome.header.languagePickerLabel}
        primaryNavAriaLabel={content.siteChrome.header.primaryNavAriaLabel}
      />
      <LazyGeneratorShell hero={content.generatorHero} ui={content.generatorUi} />
      <RootSeoSection locale={locale} seoSection={content.seoSection} />
      {content.guidesSection ? (
        <RootGuidesSection locale={locale} guidesSection={content.guidesSection} />
      ) : null}
      <SiteFooter
        navItems={footerNavItems}
        siteDescription={content.siteChrome.siteDescription}
        siteName={content.siteChrome.siteName}
        systemRailLabel={content.siteChrome.footer.systemRailLabel}
        publicStatusLabel={content.siteChrome.footer.publicStatusLabel}
        identityTitle={content.siteChrome.footer.identityTitle}
        jumpTitle={content.siteChrome.footer.jumpTitle}
        navAriaLabel={content.siteChrome.footer.navAriaLabel}
        productTitle={content.siteChrome.footer.productTitle}
        productDescription={content.siteChrome.footer.productDescription}
      />
    </div>
  );
}
