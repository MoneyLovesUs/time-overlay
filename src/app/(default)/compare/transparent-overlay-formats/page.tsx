import type { Metadata } from "next";

import { ComparePage } from "@/components/site/compare-page";
import { getComparePageContent } from "@/content/compare";
import { getRootPageContent } from "@/content/root";
import { defaultLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

const COMPARE_PATH = "/compare/transparent-overlay-formats";

export async function generateMetadata(): Promise<Metadata> {
  const content = getComparePageContent();
  return createPageMetadata({
    locale: defaultLocale,
    path: COMPARE_PATH,
    title: content.metadata.title,
    description: content.metadata.description,
    localized: false,
  });
}

export default async function CompareRoute() {
  const content = getComparePageContent();
  const chrome = await getRootPageContent(defaultLocale);

  return <ComparePage content={content} chrome={chrome} path={COMPARE_PATH} />;
}
