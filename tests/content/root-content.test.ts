import { describe, expect, it } from "vitest";

import { getRootPageContent } from "@/content/root";

describe("root locale content", () => {
  it("loads locale-specific metadata and faq content for every enabled locale", async () => {
    const japanese = await getRootPageContent("ja");
    const german = await getRootPageContent("de");

    expect(japanese.metadata.title.length).toBeGreaterThan(0);
    expect(german.seoSection.faqItems.length).toBeGreaterThan(0);
    expect(japanese.generatorUi.preview.playButton).not.toBe(
      german.generatorUi.preview.playButton,
    );
  });
});
