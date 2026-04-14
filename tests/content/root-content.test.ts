import { describe, expect, it } from "vitest";

import { getRootPageContent } from "@/content/root";

describe("root locale content", () => {
  it("loads locale-specific metadata and faq content for sampled enabled locales", async () => {
    const japanese = await getRootPageContent("ja");
    const german = await getRootPageContent("de");

    expect(japanese.metadata.title).not.toBe(german.metadata.title);
    expect(japanese.metadata.description).not.toBe(german.metadata.description);

    expect(german.seoSection.faqItems.length).toBeGreaterThan(0);
    expect(japanese.seoSection.faqItems[0]?.question).not.toBe(
      german.seoSection.faqItems[0]?.question,
    );
    expect(japanese.seoSection.faqItems[0]?.answer).not.toBe(
      german.seoSection.faqItems[0]?.answer,
    );
  });
});
