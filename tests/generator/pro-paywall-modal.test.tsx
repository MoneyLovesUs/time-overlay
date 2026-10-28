import React from "react";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  ProPaywallModal,
  resolveGeneratorCheckoutContext,
  resolvePaywallTitle,
} from "@/components/generator/pro-paywall-modal";
import { getProGateCopy } from "@/content/pro-gate";
import zhHans from "@/content/root/zh-hans";

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

  it("shows the benefits, the trust note, and a collapsed restore entry", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProPaywallModal, {
        open: true,
        trigger: "template",
        onClose: () => undefined,
        onCheckout: noop,
        onRestore: noop,
      }),
    );
    assert.match(markup, /Export with this Pro template/);
    assert.match(markup, /Timers up to 60 minutes/);
    assert.match(markup, /60 FPS exports/);
    assert.match(markup, /12 extra Pro templates/);
    assert.match(markup, /Loading price/);
    assert.match(markup, /disabled/);
    assert.match(markup, /Future Pro templates included/);
    assert.match(markup, /7-day full refund/);
    assert.match(markup, /Already purchased\? Restore purchase/);
    assert.doesNotMatch(markup, /type="email"/);
  });
});

describe("resolvePaywallTitle", () => {
  const copy = zhHans.generatorUi.pro!.paywall;
  const zhGate = getProGateCopy("zh-hans");

  it("matches the headline to the action that opened the paywall", () => {
    expect(resolvePaywallTitle("duration", copy)).toBe("导出最长 60 分钟的计时器");
    expect(resolvePaywallTitle("fps", copy)).toBe("导出丝滑的 60 FPS 计时器");
    expect(resolvePaywallTitle("template", copy)).toBe("用这个 Pro 模板导出");
    expect(resolvePaywallTitle("direct", copy)).toBe("解锁 Time Overlay Pro");
  });

  it("answers the two gate triggers with the localized gate copy", () => {
    expect(resolvePaywallTitle("resolution", copy, zhGate)).toBe(
      zhGate.titleResolution,
    );
    expect(resolvePaywallTitle("format", copy, zhGate)).toBe(
      zhGate.titleFormat,
    );
  });

  it("falls back to the English gate copy when no gate is passed", () => {
    expect(resolvePaywallTitle("resolution", copy)).toBe("Export in 4K");
    expect(resolvePaywallTitle("format", copy)).toBe(
      "Export transparent video as one file",
    );
  });
});

describe("ProPaywallModal gate triggers", () => {
  const noop = async () => "error" as const;

  it("leads the benefits with the transparent-video line for the format gate", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProPaywallModal, {
        open: true,
        trigger: "format",
        onClose: () => undefined,
        onCheckout: noop,
        onRestore: noop,
      }),
    );
    assert.match(markup, /Export transparent video as one file/);
    assert.match(markup, /Transparent VP9 or HEVC video in one file/);
    assert.match(markup, /4K resolution \(2160p and up\)/);
    assert.ok(
      markup.indexOf("Transparent VP9 or HEVC video in one file") <
        markup.indexOf("4K resolution (2160p and up)"),
    );
  });

  it("shows both new benefits even for the older triggers", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProPaywallModal, {
        open: true,
        trigger: "duration",
        onClose: () => undefined,
        onCheckout: noop,
        onRestore: noop,
      }),
    );
    assert.match(markup, /4K resolution \(2160p and up\)/);
    assert.match(markup, /Transparent VP9 or HEVC video in one file/);
    assert.match(markup, /Export timers up to 60 minutes/);
  });
});
