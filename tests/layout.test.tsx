import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist-sans" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

vi.mock("next/script", () => ({
  default: ({
    id,
    src,
    strategy,
    dangerouslySetInnerHTML,
    children,
  }: {
    id?: string;
    src?: string;
    strategy?: string;
    dangerouslySetInnerHTML?: { __html: string };
    children?: React.ReactNode;
  }) =>
    dangerouslySetInnerHTML
      ? React.createElement("script", {
          id,
          src,
          "data-strategy": strategy,
          dangerouslySetInnerHTML,
        })
      : React.createElement(
          "script",
          {
            id,
            src,
            "data-strategy": strategy,
          },
          children,
        ),
}));

vi.mock("@/components/site/site-header", () => ({
  SiteHeader: () => React.createElement("header", null, "header"),
}));

vi.mock("@/components/site/site-footer", () => ({
  SiteFooter: () => React.createElement("footer", null, "footer"),
}));

import RootLayout from "@/app/layout";

test("root layout injects the Microsoft Clarity bootstrap script", async () => {
  const markup = renderToStaticMarkup(
    await RootLayout({
      children: React.createElement("main", null, "content"),
    }),
  );

  assert.match(markup, /microsoft-clarity/i);
  assert.match(markup, /wbgnxnkr0m/);
  assert.match(markup, /c\[a\]=c\[a\]\|\|function/);
  assert.match(markup, /https:\/\/www\.clarity\.ms\/tag/);
});
