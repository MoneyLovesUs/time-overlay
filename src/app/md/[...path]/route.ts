import enRootPageContent from "@/content/root/en";
import { getComparePageContent } from "@/content/compare";
import { GUIDES, type GuideSlug } from "@/content/guides";
import { GUIDE_SLUGS, COMPARE_SLUGS } from "@/lib/site";
import {
  renderComparisonMarkdown,
  renderGuideMarkdown,
  renderHomeMarkdown,
} from "@/lib/markdown/render";

// Markdown mirrors are pure functions of build-time content — render them once
// at build and 404 anything not explicitly generated.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: ["home"] },
    ...COMPARE_SLUGS.map((slug) => ({ path: ["compare", slug] })),
    ...GUIDE_SLUGS.map((slug) => ({ path: ["guides", slug] })),
  ];
}

function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

function resolveMarkdown(path: readonly string[]): string | null {
  if (path.length === 1 && path[0] === "home") {
    return renderHomeMarkdown(enRootPageContent);
  }

  if (
    path.length === 2 &&
    path[0] === "compare" &&
    (COMPARE_SLUGS as readonly string[]).includes(path[1])
  ) {
    return renderComparisonMarkdown(getComparePageContent());
  }

  if (path.length === 2 && path[0] === "guides" && isGuideSlug(path[1])) {
    return renderGuideMarkdown(GUIDES[path[1]]);
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const markdown = resolveMarkdown(path);

  if (markdown === null) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(`${markdown}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
