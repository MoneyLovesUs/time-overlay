import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  enabledLocales,
  knownLocales,
  buildLocalizedPath,
  buildLanguageAlternates,
  getDictionary,
} from "@/lib/i18n";
import { buildSitemapEntries, getLocalizedNavItems, siteConfig } from "@/lib/site";

describe("i18n config", () => {
  it("supports the approved locale matrix with english unprefixed", () => {
    expect(defaultLocale).toBe("en");
    expect(enabledLocales).toEqual([
      "en",
      "es",
      "pt",
      "ru",
      "fr",
      "de",
      "ko",
      "ja",
      "fi",
      "zh-hant",
      "ar",
      "th",
      "cs",
      "hi",
      "nl",
      "sv",
    ]);
    expect(knownLocales).toEqual(enabledLocales);
    expect(buildLocalizedPath("/", "en")).toBe("/");
    expect(buildLocalizedPath("/", "ja")).toBe("/ja");
    expect(buildLocalizedPath("/#faq", "pt")).toBe("/pt#faq");
    expect(buildLanguageAlternates("/")).toMatchObject({
      en: "/",
      es: "/es",
      pt: "/pt",
      ru: "/ru",
      fr: "/fr",
      de: "/de",
      ko: "/ko",
      ja: "/ja",
      fi: "/fi",
      "zh-hant": "/zh-hant",
      ar: "/ar",
      th: "/th",
      cs: "/cs",
      hi: "/hi",
      nl: "/nl",
      sv: "/sv",
    });
  });
});

describe("site helpers", () => {
  it("exposes homepage anchor nav items derived from the dictionary", async () => {
    const dictionary = await getDictionary(defaultLocale);
    const navItems = getLocalizedNavItems(defaultLocale, dictionary);

    expect(navItems.map((item) => item.href)).toEqual(["/#tool", "/#faq", "/#export-formats"]);
  });

  it("emits localized sitemap entries with hreflang alternates", () => {
    const entries = buildSitemapEntries();
    expect(entries).toHaveLength(16);

    const languages = entries[0].alternates?.languages;
    expect(languages).toBeDefined();
    expect(Object.keys(languages!)).toEqual(enabledLocales);
    expect(languages![defaultLocale]).toBe(
      new URL(buildLocalizedPath("/", defaultLocale), siteConfig.url).toString(),
    );
    expect(languages!["ja"]).toBe(
      new URL(buildLocalizedPath("/", "ja"), siteConfig.url).toString(),
    );
  });
});
