import type { EnabledLocale } from "@/lib/i18n";
import type { RootPageContent } from "@/content/root";
import { LazyGeneratorShell } from "@/components/site/lazy-generator-shell";
import { AdsterraNativeBanner } from "@/components/site/adsterra-ads";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { RootSeoSection } from "@/components/site/root-seo-section";
import { RootGuidesSection } from "@/components/site/root-guides-section";
import { JsonLd } from "@/components/site/json-ld";
import {
  buildFooterNavigation,
  buildPrimaryNavigation,
} from "@/lib/site-navigation";
import { buildWebApplicationJsonLd } from "@/lib/seo/jsonld";

type RootPageProps = {
  locale: EnabledLocale;
  content: RootPageContent;
};

export function RootPage({ locale, content }: RootPageProps) {
  const headerNavItems = buildPrimaryNavigation(locale, content);
  const footerNavigation = buildFooterNavigation(locale, content);

  return (
    <div>
      <JsonLd
        data={buildWebApplicationJsonLd({
          description: content.metadata.description,
          locale,
        })}
      />
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={content.siteChrome.header.shellLabel}
        siteName={content.siteChrome.siteName}
        languagePickerLabel={content.siteChrome.header.languagePickerLabel}
        primaryNavAriaLabel={content.siteChrome.header.primaryNavAriaLabel}
      />
      <LazyGeneratorShell hero={content.generatorHero} ui={content.generatorUi} />
      <AdsterraNativeBanner />
      <RootSeoSection locale={locale} seoSection={content.seoSection} />
      {content.guidesSection ? (
        <RootGuidesSection locale={locale} guidesSection={content.guidesSection} />
      ) : null}
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
