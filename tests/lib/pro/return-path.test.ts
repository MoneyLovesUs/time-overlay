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

  it("rewrites percent-encoded protocol-relative bypasses to /", () => {
    assert.equal(sanitizeReturnPath("/%2F%2Fevil.com"), "/");
    assert.equal(sanitizeReturnPath("/%2f%2fevil.com"), "/");
    assert.equal(sanitizeReturnPath("/%252F%252Fevil.com"), "/");
    assert.equal(sanitizeReturnPath("/%2Fguides"), "/");
  });

  it("rewrites malformed or control-character encodings to /", () => {
    assert.equal(sanitizeReturnPath("/%zz"), "/");
    assert.equal(sanitizeReturnPath("/%00evil.com"), "/");
  });

  it("keeps legitimately encoded on-site paths and returns the decoded form", () => {
    assert.equal(sanitizeReturnPath("/guides%20obs"), "/guides obs");
    assert.equal(sanitizeReturnPath("/docs/a%2Fb"), "/docs/a/b");
  });

  it("rewrites non-path values to /", () => {
    assert.equal(sanitizeReturnPath("https://evil.com"), "/");
    assert.equal(sanitizeReturnPath("relative"), "/");
    assert.equal(sanitizeReturnPath(undefined), "/");
    assert.equal(sanitizeReturnPath(42), "/");
  });
});
