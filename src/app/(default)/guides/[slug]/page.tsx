import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRootPageContent } from "@/content/root";
import { GuidePage } from "@/components/site/guide-page";
import {
  getGuidePageContent,
  guideContentLocales,
  type GuideSlug,
} from "@/content/guides";
import { defaultLocale } from "@/lib/i18n";
import { GUIDE_SLUGS, createPageMetadata } from "@/lib/site";

type GuideRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: GuideRouteProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isGuideSlug(slug)) {
    notFound();
  }

  const { guide } = getGuidePageContent("en", slug);
  return createPageMetadata({
    locale: defaultLocale,
    path: `/guides/${slug}`,
    title: `${guide.title} — Time Overlay`,
    description: guide.description,
    alternateLocales: guideContentLocales,
  });
}

export default async function GuideRoute({ params }: GuideRouteProps) {
  const { slug } = await params;
  if (!isGuideSlug(slug)) {
    notFound();
  }

  const content = await getRootPageContent(defaultLocale);
  const { guide, chrome } = getGuidePageContent("en", slug);
  return (
    <GuidePage
      guide={guide}
      guideChrome={chrome}
      content={content}
      locale={defaultLocale}
      slug={slug}
    />
  );
}
