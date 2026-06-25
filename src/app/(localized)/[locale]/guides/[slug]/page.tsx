import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRootPageContent } from "@/content/root";
import { GuidePage } from "@/components/site/guide-page";
import {
  getGuidePageContent,
  guideContentLocales,
  isGuideContentLocale,
  type GuideSlug,
} from "@/content/guides";
import { defaultLocale, isEnabledLocale } from "@/lib/i18n";
import { GUIDE_SLUGS, createPageMetadata } from "@/lib/site";

type LocalizedGuideRouteProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guideContentLocales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) => GUIDE_SLUGS.map((slug) => ({ locale, slug })));
}

function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

function assertLocalizedGuideParams(locale: string, slug: string) {
  if (
    !isEnabledLocale(locale) ||
    locale === defaultLocale ||
    !isGuideContentLocale(locale) ||
    !isGuideSlug(slug)
  ) {
    notFound();
  }

  return { locale, slug };
}

export async function generateMetadata({
  params,
}: LocalizedGuideRouteProps): Promise<Metadata> {
  const routeParams = await params;
  const { locale, slug } = assertLocalizedGuideParams(
    routeParams.locale,
    routeParams.slug,
  );
  const { guide } = getGuidePageContent(locale, slug);

  return createPageMetadata({
    locale,
    path: `/guides/${slug}`,
    title: `${guide.title} — Time Overlay`,
    description: guide.description,
    alternateLocales: guideContentLocales,
  });
}

export default async function LocalizedGuideRoute({
  params,
}: LocalizedGuideRouteProps) {
  const routeParams = await params;
  const { locale, slug } = assertLocalizedGuideParams(
    routeParams.locale,
    routeParams.slug,
  );
  const content = await getRootPageContent(locale);
  const { guide, chrome } = getGuidePageContent(locale, slug);

  return (
    <GuidePage
      guide={guide}
      guideChrome={chrome}
      content={content}
      locale={locale}
      slug={slug}
    />
  );
}
