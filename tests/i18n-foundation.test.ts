import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLanguageAlternates,
  buildLocalizedPath,
  defaultLocale,
  enabledLocales,
  getDictionary,
  knownLocales,
} from "../src/lib/i18n.ts";
import {
  buildSitemapEntries,
  createPageMetadata,
  siteConfig,
} from "../src/lib/site.ts";

test("locale config matches the approved locale matrix", () => {
  assert.equal(defaultLocale, "en");
  assert.deepEqual(enabledLocales, [
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
  assert.deepEqual(knownLocales, enabledLocales);
});

test("buildLocalizedPath leaves the default locale unprefixed", () => {
  assert.equal(buildLocalizedPath("/", "en"), "/");
  assert.equal(buildLocalizedPath("/faq", "en"), "/faq");
});

test("buildLocalizedPath prefixes non-default locales", () => {
  assert.equal(buildLocalizedPath("/", "ja"), "/ja");
  assert.equal(buildLocalizedPath("/faq", "ja"), "/ja/faq");
});

test("buildLanguageAlternates can generate localized hreflang paths", () => {
  assert.deepEqual(buildLanguageAlternates("/faq", ["en", "ja"]), {
    en: "/faq",
    ja: "/ja/faq",
  });
});

test("createPageMetadata exposes all alternates when multiple locales exist", () => {
  const metadata = createPageMetadata({
    title: "Overlay timer overview",
    description: "English overview page",
    path: "/",
  });

  assert.equal(metadata.alternates?.canonical, "/");
  assert.deepEqual(
    metadata.alternates?.languages,
    buildLanguageAlternates("/"),
  );
});

test("default site config and sitemap entries point at the production domain", () => {
  const [homeEntry] = buildSitemapEntries();

  assert.equal(siteConfig.url, "https://timeoverlay.co");
  assert.equal(homeEntry?.url, "https://timeoverlay.co/");
});

test("english dictionary is available for shared site chrome", async () => {
  const dictionary = await getDictionary("en");

  assert.equal(dictionary.site.description.length > 0, true);
  assert.equal(dictionary.nav.overview, "Timer overview");
  assert.equal(dictionary.footer.legalTitle, "Legal");
});
