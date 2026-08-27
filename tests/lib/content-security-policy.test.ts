import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy } from "@/lib/content-security-policy";

describe("AdSense content security policy", () => {
  it("uses a strict per-request nonce while allowing dynamic HTTPS ad resources", () => {
    const csp = buildContentSecurityPolicy("test-nonce");

    expect(csp).not.toContain("\n");
    expect(csp).toContain("script-src 'nonce-test-nonce'");
    expect(csp).toContain("'strict-dynamic'");
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("frame-src https: data: blob:");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("rejects an empty or unsafe nonce", () => {
    expect(() => buildContentSecurityPolicy(" ")).toThrow();
    expect(() => buildContentSecurityPolicy("bad nonce;'self'")).toThrow();
  });
});
