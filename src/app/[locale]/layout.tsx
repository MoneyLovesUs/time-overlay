import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { defaultLocale, getDictionary, isEnabledLocale } from "@/lib/i18n";
import { createRootPageMetadata, getLocalizedNavItems, siteConfig } from "@/lib/site";

type LocalizedLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

type LocalizedLayoutMetadataProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LocalizedLayoutMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  return createRootPageMetadata(locale);
}

export default async function LocalizedLayout({ children, params }: LocalizedLayoutProps) {
  const { locale } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const navItems = getLocalizedNavItems(locale, dictionary);

  return (
    <div className="relative flex min-h-full flex-1 flex-col" lang={locale}>
      <SiteHeader
        locale={locale}
        navItems={navItems}
        shellLabel={dictionary.header.shellLabel}
        siteName={siteConfig.name}
      />
      <div className="relative z-10 flex-1">{children}</div>
      <SiteFooter
        navItems={navItems}
        siteDescription={dictionary.site.description}
        siteName={siteConfig.name}
        systemRailLabel={dictionary.footer.systemRail}
        publicStatusLabel={dictionary.footer.publicStatus}
        identityTitle={dictionary.footer.identityTitle}
        exploreTitle={dictionary.footer.exploreTitle}
        legalTitle={dictionary.footer.legalTitle}
        legalNotice={dictionary.footer.legalNotice}
      />
    </div>
  );
}
