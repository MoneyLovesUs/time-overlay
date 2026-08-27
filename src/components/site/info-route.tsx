import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InfoPage } from "@/components/site/info-page";
import {
  getInfoPageContent,
  isInfoPageLocale,
  type InfoPageKey,
  type InfoPageLocale,
} from "@/content/info-pages";
import { getRootPageContent } from "@/content/root";
import {
  defaultLocale,
  isEnabledLocale,
  type EnabledLocale,
} from "@/lib/i18n";
import { createPageMetadata, secondaryContentLocales } from "@/lib/site";

export function createInfoPageMetadata(
  pageKey: InfoPageKey,
  locale: InfoPageLocale = "en",
): Metadata {
  const content = getInfoPageContent(locale, pageKey);
  return createPageMetadata({
    locale,
    path: `/${pageKey}`,
    title: content.metadata.title,
    description: content.metadata.description,
    alternateLocales: secondaryContentLocales,
  });
}

export async function renderInfoPage(
  pageKey: InfoPageKey,
  locale: InfoPageLocale = "en",
) {
  const chrome = await getRootPageContent(locale);
  const content = getInfoPageContent(locale, pageKey);
  return (
    <InfoPage
      chrome={chrome}
      content={content}
      locale={locale}
      pageKey={pageKey}
    />
  );
}

export function assertLocalizedInfoLocale(rawLocale: string): InfoPageLocale {
  if (
    !isEnabledLocale(rawLocale) ||
    rawLocale === defaultLocale ||
    !isInfoPageLocale(rawLocale as EnabledLocale)
  ) {
    notFound();
  }

  return rawLocale as InfoPageLocale;
}

export function generateInfoStaticParams() {
  return [{ locale: "zh-hans" }];
}
