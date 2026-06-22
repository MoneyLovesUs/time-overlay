import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRootPageContent } from "@/content/root";
import { GuidePage } from "@/components/site/guide-page";
import { GUIDES, type GuideSlug } from "@/content/guides";
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

  const guide = GUIDES[slug];
  return createPageMetadata({
    locale: defaultLocale,
    path: `/guides/${slug}`,
    title: `${guide.title} — Time Overlay`,
    description: guide.description,
    localized: false,
  });
}

export default async function GuideRoute({ params }: GuideRouteProps) {
  const { slug } = await params;
  if (!isGuideSlug(slug)) {
    notFound();
  }

  const content = await getRootPageContent(defaultLocale);
  return (
    <GuidePage
      guide={GUIDES[slug]}
      content={content}
      locale={defaultLocale}
      slug={slug}
    />
  );
}
