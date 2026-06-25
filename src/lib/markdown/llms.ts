import { getComparePageContent } from "@/content/compare";
import { getGuideLocaleContent } from "@/content/guides";
import enRootPageContent from "@/content/root/en";
import zhHansRootPageContent from "@/content/root/zh-hans";
import {
  buildLocalizedPath,
  defaultLocale,
  type EnabledLocale,
} from "@/lib/i18n";
import { COMPARE_SLUGS, GUIDE_SLUGS, siteConfig } from "@/lib/site";

const llmsRootContent = {
  en: enRootPageContent,
  "zh-hans": zhHansRootPageContent,
} as const;

type LlmsLocale = keyof typeof llmsRootContent;

function isLlmsLocale(locale: EnabledLocale): locale is LlmsLocale {
  return locale in llmsRootContent;
}

/**
 * Builds the `/llms.txt` index — a plain-text map of the most useful pages for
 * AI crawlers, each with a one-line description and a link to its clean Markdown
 * mirror. Driven by the same route registry and content as the site.
 */
export function buildLlmsTxt(locale: EnabledLocale = defaultLocale): string {
  if (!isLlmsLocale(locale)) {
    throw new Error(`Unsupported llms locale: ${locale}`);
  }

  const base = siteConfig.url;
  const abs = (path: string) => `${base}${path}`;
  const localized = (path: string) => buildLocalizedPath(path, locale);
  const localizedMarkdown = (path: string) =>
    locale === defaultLocale ? `/md${path}` : `/${locale}/md${path}`;
  const root = llmsRootContent[locale];

  const compare = getComparePageContent(locale);
  const compareSlug = COMPARE_SLUGS[0];
  const guideContent = getGuideLocaleContent(locale);

  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${root.metadata.description}`,
    "",
    locale === "zh-hans" ? "## 核心页面" : "## Core pages",
    `- [${siteConfig.name} generator](${abs(localized("/"))}): ${root.metadata.description} Markdown: ${abs(localizedMarkdown("/home"))}`,
    `- [${compare.metadata.title}](${abs(localized(`/compare/${compareSlug}`))}): ${compare.metadata.description} Markdown: ${abs(localizedMarkdown(`/compare/${compareSlug}`))}`,
    "",
    locale === "zh-hans" ? "## 剪辑软件指南" : "## Editor guides",
    ...GUIDE_SLUGS.map((slug) => {
      const guide = guideContent.guides[slug];
      return `- [${guide.title}](${abs(localized(`/guides/${slug}`))}): ${guide.description} Markdown: ${abs(localizedMarkdown(`/guides/${slug}`))}`;
    }),
    "",
  ];

  return lines.join("\n");
}
