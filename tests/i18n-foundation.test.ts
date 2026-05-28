import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLanguageAlternates,
  buildLocalizedPath,
  defaultLocale,
  enabledLocales,
  getLocaleDirection,
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
});

test("buildLocalizedPath leaves the default locale unprefixed", () => {
  assert.equal(buildLocalizedPath("/", "en"), "/");
  assert.equal(buildLocalizedPath("/faq", "en"), "/faq");
});

test("buildLocalizedPath prefixes non-default locales", () => {
  assert.equal(buildLocalizedPath("/", "ja"), "/ja");
  assert.equal(buildLocalizedPath("/faq", "ja"), "/ja/faq");
});

test("buildLanguageAlternates can generate localized hreflang paths with x-default", () => {
  assert.deepEqual(buildLanguageAlternates("/faq", ["en", "ja"]), {
    en: "/faq",
    ja: "/ja/faq",
    "x-default": "/faq",
  });
});

test("getLocaleDirection flags RTL locales", () => {
  assert.equal(getLocaleDirection("ar"), "rtl");
  assert.equal(getLocaleDirection("en"), "ltr");
  assert.equal(getLocaleDirection("ja"), "ltr");
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
  assert.equal(
    homeEntry?.alternates?.languages?.["x-default"],
    "https://timeoverlay.co/",
  );
});
