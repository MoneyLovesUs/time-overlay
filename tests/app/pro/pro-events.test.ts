import assert from "node:assert/strict";
import { describe, it, vi } from "vitest";

vi.mock("posthog-js", () => ({ default: { capture: vi.fn() } }));

import { trackEvent, type AnalyticsEventName } from "@/lib/analytics/events";

// Type-level contract: every B-lane event name (spec 5.5) must be part of
// AnalyticsEventName, otherwise tsc --noEmit fails on this file.
const PRO_EVENT_NAMES = [
  "pro_checkout_redirected",
  "pro_purchase_verified",
  "pro_purchase_verify_failed",
  "pro_restore_succeeded",
  "pro_restore_failed",
] as const satisfies readonly AnalyticsEventName[];

describe("pro analytics events", () => {
  it("declares every spec 5.5 event name in AnalyticsEventName", () => {
    assert.equal(PRO_EVENT_NAMES.length, 5);
    for (const name of PRO_EVENT_NAMES) {
      assert.equal(typeof name, "string");
    }
  });

  it("trackEvent stays a no-op outside the browser", () => {
    for (const name of PRO_EVENT_NAMES) {
      assert.doesNotThrow(() => trackEvent(name, { trigger: "direct" }));
    }
  });
});
