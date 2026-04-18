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
});
