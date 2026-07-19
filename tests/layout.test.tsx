import assert from "node:assert/strict";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test, vi } from "vitest";

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
import { AppDocument } from "@/app/app-shell";

type ScriptLikeProps = {
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: {
    __html?: string;
  };
  id?: string;
  src?: string;
  strategy?: string;
};

function collectScriptLikeProps(node: React.ReactNode): ScriptLikeProps[] {
  const scriptProps: ScriptLikeProps[] = [];

  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    const props = child.props as ScriptLikeProps;

    if (child.type === "script" || props.id || props.src) {
      scriptProps.push(props);
    }

    scriptProps.push(...collectScriptLikeProps(props.children));
  });

  return scriptProps;
}

test("app document schedules an idle-loaded Microsoft Clarity bootstrap after hydration", () => {
  const document = AppDocument({
    children: React.createElement("main", null, "content"),
    lang: "en",
  });
  const clarityScript = collectScriptLikeProps(document).find(
    ({ id }) => id === "microsoft-clarity",
  );
  const bootstrap = clarityScript?.dangerouslySetInnerHTML?.__html ?? "";

  assert.ok(clarityScript);
  assert.equal(clarityScript.strategy, "afterInteractive");
  assert.match(bootstrap, /wbgnxnkr0m/);
  assert.match(bootstrap, /c\[a\]=c\[a\]\|\|function/);
  assert.match(bootstrap, /requestIdleCallback/);
  assert.match(bootstrap, /https:\/\/www\.clarity\.ms\/tag/);
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

test("app document mounts the Google Analytics gtag snippet", () => {
  const document = AppDocument({
    children: React.createElement("main", null, "content"),
    lang: "en",
  });
  const scriptProps = collectScriptLikeProps(document);
  const googleLoaderScript = scriptProps.find(
    ({ src }) =>
      src === "https://www.googletagmanager.com/gtag/js?id=G-1FB0KM19XV",
  );
  const googleBootstrapScript = scriptProps.find(
    ({ id }) => id === "google-analytics",
  );

  assert.ok(googleLoaderScript);
  assert.ok(googleBootstrapScript?.dangerouslySetInnerHTML);
  assert.match(
    googleBootstrapScript.dangerouslySetInnerHTML.__html ?? "",
    /window\.dataLayer = window\.dataLayer \|\| \[\];/,
  );
  assert.match(
    googleBootstrapScript.dangerouslySetInnerHTML.__html ?? "",
    /gtag\('config', 'G-1FB0KM19XV'\);/,
  );
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
