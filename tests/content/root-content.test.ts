import { describe, expect, it } from "vitest";

import { getRootPageContent } from "@/content/root";
import { enabledLocales } from "@/lib/i18n";

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
});
