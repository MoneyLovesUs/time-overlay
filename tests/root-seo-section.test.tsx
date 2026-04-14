import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import enRootPageContent from "@/content/root/en";
import { RootSeoSection } from "@/components/site/root-seo-section";

test("root seo section exposes crawlable homepage support sections", () => {
  const markup = renderToStaticMarkup(
    React.createElement(RootSeoSection, {
      locale: "en",
      seoSection: enRootPageContent.seoSection,
    }),
  );

  assert.match(markup, /How overlay timer export works/i);
  assert.match(markup, /How to use Time Overlay/i);
  assert.match(markup, /About Time Overlay/i);
  assert.match(markup, /id="how-it-works"/);
  assert.match(markup, /id="how-to-use"/);
  assert.match(markup, /id="about-time-overlay"/);
  assert.match(markup, /href="\/#tool"/);
  assert.match(markup, /href="\/#faq"/);
});
