import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  FREE_MAX_DURATION_SECONDS,
  PRO_MAX_DURATION_SECONDS,
  PRO_PRICE_LABEL,
  type ProTrigger,
} from "@/lib/pro/entitlements";

describe("pro entitlements", () => {
  it("exposes the contract constants from spec 5.3", () => {
    assert.equal(PRO_PRICE_LABEL, "$9");
    assert.equal(FREE_MAX_DURATION_SECONDS, 300);
    assert.equal(PRO_MAX_DURATION_SECONDS, 3600);
  });

  it("defines the four checkout triggers", () => {
    const triggers: ProTrigger[] = ["duration", "fps", "template", "direct"];
    assert.equal(triggers.length, 4);
  });
});
