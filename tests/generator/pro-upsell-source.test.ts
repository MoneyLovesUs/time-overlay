import assert from "node:assert/strict";
import { describe, expect, it, vi } from "vitest";

vi.mock("posthog-js", () => ({ default: { capture: vi.fn() } }));

import {
  getProUpsellSource,
  setProUpsellSource,
  upsellSourcePayload,
} from "@/lib/pro/client";
import {
  PRO_UPSELL_SOURCES,
  type ProUpsellSource,
} from "@/lib/pro/entitlements";

describe("paywall source attribution", () => {
  it("exposes exactly the six documented sources", () => {
    const sources: readonly ProUpsellSource[] = [
      "auto",
      "inline",
      "header",
      "export_complete",
      "pro_page",
      "feature",
    ];
    expect(PRO_UPSELL_SOURCES).toEqual(sources);
  });

  it("remembers which surface opened the paywall", () => {
    setProUpsellSource("auto");
    assert.equal(getProUpsellSource(), "auto");
    assert.deepEqual(upsellSourcePayload(), { source: "auto" });

    setProUpsellSource("pro_page");
    assert.deepEqual(upsellSourcePayload(), { source: "pro_page" });

    // Closing the paywall must not leave a stale source on later events.
    setProUpsellSource(null);
    assert.equal(getProUpsellSource(), null);
    assert.deepEqual(upsellSourcePayload(), {});
  });

  it("accepts an explicit override without touching the stored source", () => {
    setProUpsellSource("header");
    assert.deepEqual(upsellSourcePayload("export_complete"), {
      source: "export_complete",
    });
    assert.equal(getProUpsellSource(), "header");
    setProUpsellSource(null);
  });
});
