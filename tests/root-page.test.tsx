import React from "react";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, vi } from "vitest";

import enRootPageContent from "@/content/root/en";

vi.mock("next/dynamic", () => ({
  default: (
    _loader: unknown,
    options?: {
      loading?: () => React.ReactElement;
    },
  ) => {
    const LoadingComponent = options?.loading;

    return function MockDynamicComponent() {
      return LoadingComponent ? LoadingComponent() : null;
    };
  },
}));

vi.mock("@/components/generator/generator-shell", () => ({
  GeneratorShell: () =>
    React.createElement("div", null, "interactive-generator-shell"),
}));

import { RootPage } from "@/components/site/root-page";

describe("RootPage", () => {
  it("server-renders a lightweight generator fallback instead of the interactive shell", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RootPage, {
        locale: "en",
        content: enRootPageContent,
      }),
    );

    assert.match(markup, /generator-loading-shell/i);
    assert.doesNotMatch(markup, /interactive-generator-shell/i);
  });

  it("server-renders crawlable homepage SEO copy and FAQ structured data", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RootPage, {
        locale: "en",
        content: enRootPageContent,
      }),
    );

    assert.match(markup, /About Time Overlay/i);
    assert.match(markup, /Time Overlay is a local-first/i);
    assert.match(markup, /How to use Time Overlay/i);
    assert.match(markup, /"@type":"FAQPage"/);
    assert.match(markup, /Can I export an overlay timer with transparency/i);
  });
});
