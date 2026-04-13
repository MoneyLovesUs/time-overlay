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
import { createPageMetadata } from "../src/lib/site.ts";

test("locale config keeps english enabled and chinese as a known future locale", () => {
  assert.equal(defaultLocale, "en");
  assert.deepEqual(enabledLocales, ["en"]);
  assert.deepEqual(knownLocales, ["en", "zh"]);
});

test("buildLocalizedPath leaves the default locale unprefixed", () => {
  assert.equal(buildLocalizedPath("/", "en"), "/");
  assert.equal(buildLocalizedPath("/qa", "en"), "/qa");
  assert.equal(buildLocalizedPath("how-it-works", "en"), "/how-it-works");
});

test("buildLocalizedPath prefixes non-default locales", () => {
  assert.equal(buildLocalizedPath("/", "zh"), "/zh");
  assert.equal(buildLocalizedPath("/qa", "zh"), "/zh/qa");
});

test("buildLanguageAlternates can generate future-ready hreflang paths", () => {
  assert.deepEqual(buildLanguageAlternates("/qa", ["en", "zh"]), {
    en: "/qa",
    zh: "/zh/qa",
  });
});

test("createPageMetadata keeps english canonicals unchanged while only one locale is enabled", () => {
  const metadata = createPageMetadata({
    title: "Overlay timer overview",
    description: "English overview page",
    path: "/",
  });

  assert.equal(metadata.alternates?.canonical, "/");
  assert.equal(metadata.alternates?.languages, undefined);
});

test("english dictionary is available for shared site chrome", async () => {
  const dictionary = await getDictionary("en");

  assert.equal(dictionary.site.description.length > 0, true);
  assert.equal(dictionary.nav.overview, "Timer overview");
  assert.equal(dictionary.footer.legalTitle, "Legal");
});
