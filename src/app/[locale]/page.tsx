import { notFound } from "next/navigation";

import { getRootPageContent } from "@/content/root";
import { RootPage } from "@/components/site/root-page";
import { defaultLocale, enabledLocales, isEnabledLocale } from "@/lib/i18n";

type LocalizedHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateStaticParams() {
  return enabledLocales
    .filter((locale) => locale !== defaultLocale)
    .map((locale) => ({ locale }));
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { locale } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  const content = await getRootPageContent(locale);

  return <RootPage locale={locale} content={content} />;
}
