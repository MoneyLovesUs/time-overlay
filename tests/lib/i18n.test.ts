import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  enabledLocales,
  knownLocales,
  buildLocalizedPath,
  buildLanguageAlternates,
} from "@/lib/i18n";

describe("i18n config", () => {
  it("supports the approved locale matrix with english unprefixed", () => {
    expect(defaultLocale).toBe("en");
    expect(enabledLocales).toEqual(["en", "es", "pt", "ru", "fr", "de", "ko", "ja", "fi"]);
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
    });
  });
});
