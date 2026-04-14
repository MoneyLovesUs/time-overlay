import { describe, expect, it } from "vitest";

import { buildSitemapEntries, createPageMetadata } from "@/lib/site";

describe("localized SEO helpers", () => {
  it("creates locale-aware canonical and hreflang metadata", () => {
    const metadata = createPageMetadata({
      locale: "fr",
      path: "/",
      title: "Minuteur overlay",
      description: "Description FR",
    });

    expect(metadata.alternates?.canonical).toBe("/fr");
    expect(metadata.alternates?.languages).toMatchObject({
      en: "/",
      fr: "/fr",
      ja: "/ja",
    });
  });

  it("emits all localized homepage entries in the sitemap", () => {
    const entries = buildSitemapEntries();
    expect(entries).toHaveLength(9);
  });
});
