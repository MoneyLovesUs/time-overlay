import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist-sans" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

vi.mock("@/components/site/site-header", () => ({
  SiteHeader: () => React.createElement("header", null, "header"),
}));

vi.mock("@/components/site/site-footer", () => ({
  SiteFooter: () => React.createElement("footer", null, "footer"),
}));

import RootLayout from "@/app/(default)/layout";
import LocalizedLayout from "@/app/(localized)/[locale]/layout";

test("root layout injects an idle-loaded Microsoft Clarity bootstrap script", async () => {
  const markup = renderToStaticMarkup(
    await RootLayout({
      children: React.createElement("main", null, "content"),
    }),
  );

  assert.match(markup, /microsoft-clarity/i);
  assert.match(markup, /wbgnxnkr0m/);
  assert.match(markup, /c\[a\]=c\[a\]\|\|function/);
  assert.match(markup, /requestIdleCallback/);
  assert.match(markup, /https:\/\/www\.clarity\.ms\/tag/);
});

test("root layout injects the Ahrefs analytics script with the site data key", async () => {
  const markup = renderToStaticMarkup(
    await RootLayout({
      children: React.createElement("main", null, "content"),
    }),
  );

  assert.match(markup, /https:\/\/analytics\.ahrefs\.com\/analytics\.js/);
  assert.match(markup, /data-key="NQce666pfXHzSj3WBXaUIQ"/);
});

test("localized layout defines an html lang that matches the active locale", async () => {
  const markup = renderToStaticMarkup(
    await LocalizedLayout({
      children: React.createElement("main", null, "content"),
      params: Promise.resolve({ locale: "ja" }),
    }),
  );

  assert.match(markup, /<html[^>]*lang="ja"/);
});
