import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import enProPageContent from "@/content/pro-page/en";
import zhHansProPageContent from "@/content/pro-page/zh-hans";
import enRootPageContent from "@/content/root/en";
import zhHansRootPageContent from "@/content/root/zh-hans";
import { getProCtaCopy } from "@/content/pro-cta";
import { ProPage } from "@/components/site/pro-page";
import {
  getProPageContent,
  proPageContentLoaders,
} from "@/content/pro-page";
import { enabledLocales } from "@/lib/i18n";

describe("pro page content", () => {
  it("ships a translated page for every enabled locale", async () => {
    assert.deepEqual(
      Object.keys(proPageContentLoaders).sort(),
      [...enabledLocales].sort(),
    );

    const english = await getProPageContent("en");
    for (const locale of enabledLocales) {
      const content = await getProPageContent(locale);
      assert.ok(content.metadata.title.trim().length > 0, locale);
      assert.ok(content.heading.trim().length > 0, locale);
      assert.equal(content.comparisonRows.length, 7, locale);
      assert.equal(content.audienceItems.length, 3, locale);
      assert.equal(content.faqItems.length, 4, locale);

      if (locale !== "en") {
        assert.notEqual(content.metadata.title, english.metadata.title, locale);
        assert.notEqual(content.heading, english.heading, locale);
      }
    }
  });

  it("throws instead of silently falling back for unknown locales", async () => {
    await expect(getProPageContent("xx" as "en")).rejects.toThrow(
      "Unsupported locale: xx",
    );
  });

  it("keeps the price and the Pro-only capability promises in every locale", async () => {
    for (const locale of enabledLocales) {
      const content = await getProPageContent(locale);
      assert.match(content.buyButton, /\$9/, `buyButton: ${locale}`);
      assert.match(
        content.metadata.description,
        /\$9/,
        `metadata.description: ${locale}`,
      );
      // Since PR 3 the page must actually advertise the gated capabilities.
      const copy = JSON.stringify(content);
      assert.match(copy, /4K/, `4K promise missing from ${locale}`);
    }
  });

  it("states that 4K and one-file transparent video are Pro, not free", async () => {
    const english = await getProPageContent("en");
    const resolution = english.comparisonRows.find((row) =>
      /resolution/i.test(row.feature),
    );
    const transparency = english.comparisonRows.find((row) =>
      /transparent/i.test(row.feature),
    );

    expect(resolution).toBeDefined();
    expect(resolution?.free).not.toMatch(/4K/i);
    expect(resolution?.pro).toMatch(/4K/i);

    expect(transparency).toBeDefined();
    // PNG sequence stays free so free users keep a transparent export path.
    expect(transparency?.free).toMatch(/PNG/i);
    expect(transparency?.pro).toMatch(/VP9|HEVC/i);
  });

  it("renders the comparison table, FAQ, and buy box", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProPage, {
        content: enProPageContent,
        chrome: enRootPageContent,
        locale: "en",
      }),
    );

    assert.match(markup, /Up to 5 minutes/);
    assert.match(markup, /Up to 60 minutes/);
    assert.match(markup, /48 templates \+ 12 signature/);
    assert.match(markup, /Get Pro for \$9/);
    assert.match(markup, /Stripe/);
    assert.match(markup, /Can I get a refund\?/);
    assert.match(markup, /60 fps/);
  });

  it("renders localized copy on a non-English route", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProPage, {
        content: zhHansProPageContent,
        chrome: zhHansRootPageContent,
        locale: "zh-hans",
      }),
    );

    assert.match(markup, /最长 60 分钟/);
    assert.match(markup, /\$9/);
  });
});

describe("pro cta copy", () => {
  it("covers every enabled locale with all five labels", () => {
    for (const locale of enabledLocales) {
      const copy = getProCtaCopy(locale);
      assert.ok(copy.headerUpgradeLabel.trim().length > 0, locale);
      assert.ok(copy.proBadgeLabel.trim().length > 0, locale);
      assert.ok(copy.exportCtaTitle.trim().length > 0, locale);
      assert.ok(copy.exportCtaBody.trim().length > 0, locale);
      assert.match(copy.exportCtaButton, /\$9/, locale);
    }
  });

  it("falls back to English for an unknown locale", () => {
    expect(getProCtaCopy("xx")).toEqual(getProCtaCopy("en"));
  });
});
