import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const proStatus = vi.hoisted(() => ({ value: "unknown" as "unknown" | "free" | "pro" }));

vi.mock("posthog-js", () => ({ default: { capture: vi.fn() } }));

vi.mock("@/lib/pro/client", () => ({
  subscribeProStatus: () => () => undefined,
  getProStatusSnapshot: () => proStatus.value,
  getProStatusServerSnapshot: () => proStatus.value,
  getProUpsellSource: () => null,
}));

import { ProHeaderLink } from "@/components/site/pro-header-link";
import { getProCtaCopy } from "@/content/pro-cta";

function render(locale: "en" | "de" | "zh-hans" = "en") {
  return renderToStaticMarkup(
    React.createElement(ProHeaderLink, { locale }),
  );
}

describe("header Pro slot", () => {
  beforeEach(() => {
    proStatus.value = "unknown";
  });

  it("renders nothing before the Pro status resolves", () => {
    expect(render()).toBe("");
  });

  it("offers the upgrade link to free users", () => {
    proStatus.value = "free";

    const markup = render("en");
    expect(markup).toContain(getProCtaCopy("en").headerUpgradeLabel);
    expect(markup).toContain('href="/pro"');
  });

  it("links every locale to its own /pro page", () => {
    proStatus.value = "free";

    expect(render("de")).toContain('href="/de/pro"');
    expect(render("zh-hans")).toContain('href="/zh-hans/pro"');
  });

  it("stops selling to paying users and shows the badge instead", () => {
    proStatus.value = "pro";

    const markup = render("en");
    expect(markup).toContain(getProCtaCopy("en").proBadgeLabel);
    expect(markup).not.toContain(getProCtaCopy("en").headerUpgradeLabel);
    expect(markup).not.toContain('href="/pro"');
  });
});
