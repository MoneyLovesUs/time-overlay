import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { sanitizeReturnPath } from "@/lib/pro/return-path";

describe("sanitizeReturnPath", () => {
  it("keeps ordinary on-site paths", () => {
    assert.equal(sanitizeReturnPath("/"), "/");
    assert.equal(sanitizeReturnPath("/guides/add-countdown-to-obs"), "/guides/add-countdown-to-obs");
  });

  it("rewrites protocol-relative off-site paths to /", () => {
    assert.equal(sanitizeReturnPath("//evil.com"), "/");
  });

  it("rewrites backslash escape hatches to /", () => {
    assert.equal(sanitizeReturnPath("/" + String.fromCharCode(92) + "evil.com"), "/");
  });

  it("rewrites non-path values to /", () => {
    assert.equal(sanitizeReturnPath("https://evil.com"), "/");
    assert.equal(sanitizeReturnPath("relative"), "/");
    assert.equal(sanitizeReturnPath(undefined), "/");
    assert.equal(sanitizeReturnPath(42), "/");
  });
});
