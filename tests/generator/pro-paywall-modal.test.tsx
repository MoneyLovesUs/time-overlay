import React from "react";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  ProPaywallModal,
  resolveGeneratorCheckoutContext,
} from "@/components/generator/pro-paywall-modal";

describe("resolveGeneratorCheckoutContext", () => {
  it("maps the default locale home to en", () => {
    expect(resolveGeneratorCheckoutContext("/", "")).toEqual({
      locale: "en",
      returnPath: "/",
    });
  });

  it("keeps the locale segment and full path as return target", () => {
    expect(
      resolveGeneratorCheckoutContext("/zh-hans", "?template=cyber"),
    ).toEqual({
      locale: "zh-hans",
      returnPath: "/zh-hans?template=cyber",
    });
  });

  it("falls back to en for unknown first segments", () => {
    expect(resolveGeneratorCheckoutContext("/guides", "")).toEqual({
      locale: "en",
      returnPath: "/guides",
    });
  });
});

describe("ProPaywallModal static render", () => {
  const noop = async () => "error" as const;

  it("renders nothing until a user action opens it", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProPaywallModal, {
        open: false,
        trigger: null,
        onClose: () => undefined,
        onCheckout: noop,
        onRestore: noop,
      }),
    );
    assert.equal(markup, "");
  });

  it("shows the three benefits, the one-time price, and restore entry", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProPaywallModal, {
        open: true,
        trigger: "template",
        onClose: () => undefined,
        onCheckout: noop,
        onRestore: noop,
      }),
    );
    assert.match(markup, /Unlock Time Overlay Pro/);
    assert.match(markup, /Timers up to 60 minutes/);
    assert.match(markup, /60 FPS exports/);
    assert.match(markup, /12 extra Pro templates/);
    assert.match(markup, /Loading price/);
    assert.match(markup, /disabled/);
    assert.match(markup, /Restore purchase/);
  });
});
