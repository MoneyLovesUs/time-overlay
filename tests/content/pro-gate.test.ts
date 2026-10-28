import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { getProGateCopy } from "@/content/pro-gate";
import { enabledLocales } from "@/lib/i18n";

const KEYS = [
  "titleResolution",
  "titleFormat",
  "benefitResolution",
  "benefitFormat",
  "fallbackResolution",
  "fallbackFormat",
] as const;

describe("pro gate copy", () => {
  it("covers every enabled locale with non-empty strings", () => {
    for (const locale of enabledLocales) {
      const copy = getProGateCopy(locale);
      for (const key of KEYS) {
        assert.equal(typeof copy[key], "string", `${locale}.${key}`);
        assert.ok(copy[key].trim().length > 0, `${locale}.${key} is empty`);
      }
    }
  });

  it("is actually translated instead of falling back to English", () => {
    const en = getProGateCopy("en");
    // A handful of non-Latin locales is the meaningful check: copy-paste
    // fallbacks are most obvious there.
    for (const locale of ["zh-hans", "ja", "ko", "ar", "hi", "ru"] as const) {
      const copy = getProGateCopy(locale);
      for (const key of KEYS) {
        assert.notEqual(copy[key], en[key], `${locale}.${key} still English`);
      }
    }
  });

  it("falls back to English for unknown locales", () => {
    assert.deepEqual(getProGateCopy("xx"), getProGateCopy("en"));
  });

  it("names 4K and both alpha video formats in the English copy", () => {
    const en = getProGateCopy("en");
    assert.match(en.titleResolution, /4K/);
    assert.match(en.benefitResolution, /2160p/);
    assert.match(en.benefitFormat, /VP9/);
    assert.match(en.benefitFormat, /HEVC/);
    assert.match(en.fallbackResolution, /1080p/);
    assert.match(en.fallbackFormat, /PNG/);
  });
});
