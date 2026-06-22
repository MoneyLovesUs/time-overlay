import { getComparePageContent } from "@/content/compare";
import { GUIDES } from "@/content/guides";
import { COMPARE_SLUGS, GUIDE_SLUGS, siteConfig } from "@/lib/site";

/**
 * Builds the `/llms.txt` index — a plain-text map of the most useful pages for
 * AI crawlers, each with a one-line description and a link to its clean Markdown
 * mirror. Driven by the same route registry and content as the site.
 */
export function buildLlmsTxt(): string {
  const base = siteConfig.url;
  const abs = (path: string) => `${base}${path}`;

  const compare = getComparePageContent();
  const compareSlug = COMPARE_SLUGS[0];

  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Core pages",
    `- [${siteConfig.name} generator](${abs("/")}): Free in-browser transparent countdown timer overlay generator. Markdown: ${abs("/md/home")}`,
    `- [${compare.metadata.title}](${abs(`/compare/${compareSlug}`)}): ${compare.metadata.description} Markdown: ${abs(`/md/compare/${compareSlug}`)}`,
    "",
    "## Editor guides",
    ...GUIDE_SLUGS.map((slug) => {
      const guide = GUIDES[slug];
      return `- [${guide.title}](${abs(`/guides/${slug}`)}): ${guide.description} Markdown: ${abs(`/md/guides/${slug}`)}`;
    }),
    "",
  ];

  return lines.join("\n");
}
