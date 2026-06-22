import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  enabledLocales,
  getLocaleDirection,
  buildLocalizedPath,
  buildLanguageAlternates,
} from "@/lib/i18n";
import { buildSitemapEntries, siteConfig } from "@/lib/site";

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
      "x-default": "/",
    });
  });

  it("flags RTL locales correctly", () => {
    expect(getLocaleDirection("ar")).toBe("rtl");
    expect(getLocaleDirection("en")).toBe("ltr");
    expect(getLocaleDirection("ja")).toBe("ltr");
  });
});

describe("site helpers", () => {
  it("emits localized sitemap entries with hreflang alternates plus x-default", () => {
    const entries = buildSitemapEntries();
    // homepage + 6 guides = 7 routes × 16 locales = 112
    expect(entries.length).toBeGreaterThanOrEqual(16);

    const homepageEntries = entries.filter(
      (entry) => entry.url.replace(/^https?:\/\/[^/]+/, "") === "/" || /\/(?:en|es|pt|ru|fr|de|ko|ja|fi|zh-hant|ar|th|cs|hi|nl|sv)$/.test(entry.url),
    );
    expect(homepageEntries.length).toBe(16);

    const languages = homepageEntries[0].alternates?.languages;
    expect(languages).toBeDefined();
    expect(Object.keys(languages!)).toEqual([...enabledLocales, "x-default"]);
    expect(languages![defaultLocale]).toBe(
      new URL(buildLocalizedPath("/", defaultLocale), siteConfig.url).toString(),
    );
    expect(languages!["ja"]).toBe(
      new URL(buildLocalizedPath("/", "ja"), siteConfig.url).toString(),
    );
    expect(languages!["x-default"]).toBe(
      new URL(buildLocalizedPath("/", defaultLocale), siteConfig.url).toString(),
    );
  });
});
