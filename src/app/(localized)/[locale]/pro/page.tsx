import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProPage } from "@/components/site/pro-page";
import { getProPageContent } from "@/content/pro-page";
import { getRootPageContent } from "@/content/root";
import {
  defaultLocale,
  enabledLocales,
  isEnabledLocale,
} from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

type LocalizedProRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return enabledLocales
    .filter((locale) => locale !== defaultLocale)
    .map((locale) => ({ locale }));
}

function assertLocalizedProLocale(locale: string) {
  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({
  params,
}: LocalizedProRouteProps): Promise<Metadata> {
  const locale = assertLocalizedProLocale((await params).locale);
  const content = await getProPageContent(locale);

  return createPageMetadata({
    locale,
    path: "/pro",
    title: content.metadata.title,
    description: content.metadata.description,
  });
}

export default async function LocalizedProRoute({
  params,
}: LocalizedProRouteProps) {
  const locale = assertLocalizedProLocale((await params).locale);
  const content = await getProPageContent(locale);
  const chrome = await getRootPageContent(locale);

  return <ProPage content={content} chrome={chrome} locale={locale} />;
}
