import { notFound } from "next/navigation";

import { getComparePageContent, isCompareContentLocale } from "@/content/compare";
import {
  getGuidePageContent,
  isGuideContentLocale,
  type GuideSlug,
} from "@/content/guides";
import { getRootPageContent } from "@/content/root";
import { defaultLocale, isEnabledLocale } from "@/lib/i18n";
import { COMPARE_SLUGS, GUIDE_SLUGS } from "@/lib/site";
import {
  renderComparisonMarkdown,
  renderGuideMarkdown,
  renderHomeMarkdown,
} from "@/lib/markdown/render";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { locale: "zh-hans", path: ["home"] },
    ...COMPARE_SLUGS.map((slug) => ({
      locale: "zh-hans",
      path: ["compare", slug],
    })),
    ...GUIDE_SLUGS.map((slug) => ({
      locale: "zh-hans",
      path: ["guides", slug],
    })),
  ];
}

function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

async function resolveLocalizedMarkdown(
  locale: string,
  path: readonly string[],
): Promise<string | null> {
  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  if (path.length === 1 && path[0] === "home") {
    return renderHomeMarkdown(await getRootPageContent(locale));
  }

  if (
    path.length === 2 &&
    path[0] === "compare" &&
    (COMPARE_SLUGS as readonly string[]).includes(path[1]) &&
    isCompareContentLocale(locale)
  ) {
    return renderComparisonMarkdown(getComparePageContent(locale));
  }

  if (
    path.length === 2 &&
    path[0] === "guides" &&
    isGuideSlug(path[1]) &&
    isGuideContentLocale(locale)
  ) {
    const { guide, chrome } = getGuidePageContent(locale, path[1]);
    return renderGuideMarkdown(guide, chrome);
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; path: string[] }> },
) {
  const { locale, path } = await params;
  const markdown = await resolveLocalizedMarkdown(locale, path);

  if (markdown === null) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(`${markdown}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
