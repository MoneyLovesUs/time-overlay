import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparePage } from "@/components/site/compare-page";
import {
  compareContentLocales,
  getComparePageContent,
  isCompareContentLocale,
} from "@/content/compare";
import { getRootPageContent } from "@/content/root";
import { defaultLocale, isEnabledLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

const COMPARE_PATH = "/compare/transparent-overlay-formats";

type LocalizedCompareRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return compareContentLocales
    .filter((locale) => locale !== defaultLocale)
    .map((locale) => ({ locale }));
}

function assertLocalizedCompareLocale(locale: string) {
  if (
    !isEnabledLocale(locale) ||
    locale === defaultLocale ||
    !isCompareContentLocale(locale)
  ) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({
  params,
}: LocalizedCompareRouteProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = assertLocalizedCompareLocale(rawLocale);
  const content = getComparePageContent(locale);

  return createPageMetadata({
    locale,
    path: COMPARE_PATH,
    title: content.metadata.title,
    description: content.metadata.description,
    alternateLocales: compareContentLocales,
  });
}

export default async function LocalizedCompareRoute({
  params,
}: LocalizedCompareRouteProps) {
  const { locale: rawLocale } = await params;
  const locale = assertLocalizedCompareLocale(rawLocale);
  const content = getComparePageContent(locale);
  const chrome = await getRootPageContent(locale);

  return (
    <ComparePage
      content={content}
      chrome={chrome}
      locale={locale}
      path={COMPARE_PATH}
    />
  );
}
