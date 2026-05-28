import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRootPageContent } from "@/content/root";
import { GuidePage } from "@/components/site/guide-page";
import { GUIDES, type GuideSlug } from "@/content/guides";
import { defaultLocale, enabledLocales, isEnabledLocale } from "@/lib/i18n";
import { GUIDE_SLUGS, createPageMetadata } from "@/lib/site";

type LocalizedGuideRouteProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return enabledLocales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) => GUIDE_SLUGS.map((slug) => ({ locale, slug })));
}

function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: LocalizedGuideRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }
  if (!isGuideSlug(slug)) {
    notFound();
  }

  const guide = GUIDES[slug];
  return createPageMetadata({
    locale,
    path: `/guides/${slug}`,
    title: `${guide.title} — Time Overlay`,
    description: guide.description,
  });
}

export default async function LocalizedGuideRoute({
  params,
}: LocalizedGuideRouteProps) {
  const { locale, slug } = await params;
  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }
  if (!isGuideSlug(slug)) {
    notFound();
  }

  const content = await getRootPageContent(locale);
  return <GuidePage guide={GUIDES[slug]} content={content} locale={locale} />;
}
