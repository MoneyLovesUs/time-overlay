import { describe, expect, it } from "vitest";

import { getRootPageContent } from "@/content/root";
import enRootPageContent from "@/content/root/en";
import { enabledLocales } from "@/lib/i18n";
import { siteKeywords } from "@/lib/site";

function collectContentText(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectContentText);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectContentText);
  }

  return [];
}

function countExactPhrase(source: string, phrase: string): number {
  const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = source.match(new RegExp(`\\b${escapedPhrase}\\b`, "gi"));

  return matches?.length ?? 0;
}

describe("root locale content", () => {
  it("loads all enabled locale modules with non-empty metadata, hero copy, and FAQ content", async () => {
    const allContent = await Promise.all(
      enabledLocales.map(async (locale) => [locale, await getRootPageContent(locale)] as const),
    );
    const englishContent = allContent.find(([locale]) => locale === "en")?.[1];

    expect(englishContent).toBeDefined();

    for (const [locale, content] of allContent) {
      expect(content.metadata.title.trim().length).toBeGreaterThan(0);
      expect(content.metadata.description.trim().length).toBeGreaterThan(0);
      expect(content.generatorHero.eyebrow.trim().length).toBeGreaterThan(0);
      expect(content.generatorHero.heading.trim().length).toBeGreaterThan(0);
      expect(content.generatorHero.intro.trim().length).toBeGreaterThan(0);

      expect(content.seoSection.faqItems.length).toBeGreaterThan(0);
      expect(content.seoSection.faqItems[0]?.question.trim().length).toBeGreaterThan(0);
      expect(content.seoSection.faqItems[0]?.answer.trim().length).toBeGreaterThan(0);

      if (locale !== "en") {
        expect(content.metadata.title).not.toBe(englishContent?.metadata.title);
        expect(content.seoSection.faqItems[0]?.question).not.toBe(
          englishContent?.seoSection.faqItems[0]?.question,
        );
      }
    }

    const uniqueTitles = new Set(allContent.map(([, content]) => content.metadata.title));
    expect(uniqueTitles.size).toBe(enabledLocales.length);
  });

  it("throws for unsupported locales instead of silently falling back", async () => {
    await expect(
      getRootPageContent("xx" as unknown as (typeof enabledLocales)[number]),
    ).rejects.toThrow("Unsupported locale: xx");
  });

  it("keeps Time Overlay as the densest English SEO keyword without repetition stuffing", () => {
    const englishCopy = collectContentText(enRootPageContent).join(" ");
    const timeOverlayCount = countExactPhrase(englishCopy, "time overlay");
    const competingKeywordCounts = siteKeywords
      .filter((keyword) => keyword !== "time overlay")
      .map((keyword) => [keyword, countExactPhrase(englishCopy, keyword)] as const);
    const repeatedTimeOverlayText = /time overlay(?:[\s,.;:!?-]+time overlay){2,}/i;

    expect(siteKeywords[0]).toBe("time overlay");
    expect(timeOverlayCount).toBeGreaterThan(0);
    expect(englishCopy).not.toMatch(repeatedTimeOverlayText);

    for (const [, count] of competingKeywordCounts) {
      expect(timeOverlayCount).toBeGreaterThan(count);
    }
  });
});
