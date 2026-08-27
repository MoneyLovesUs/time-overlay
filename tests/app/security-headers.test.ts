import { describe, expect, it } from "vitest";

import nextConfig, { buildSecurityHeaders } from "../../next.config";

function asHeaderMap(environment: string) {
  return new Map(
    buildSecurityHeaders(environment).map(({ key, value }) => [key, value]),
  );
}

describe("security response headers", () => {
  it("protects every route with baseline browser security headers", async () => {
    const rules = await nextConfig.headers?.();

    expect(rules).toHaveLength(1);
    expect(rules?.[0]?.source).toBe("/:path*");

    const headers = asHeaderMap("development");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
    expect(headers.get("Permissions-Policy")).toContain("microphone=()");
  });

  it("leaves per-request CSP generation to the production proxy", () => {
    const headers = asHeaderMap("production");

    expect(headers.has("Content-Security-Policy")).toBe(false);
    expect(headers.get("Strict-Transport-Security")).toContain("max-age=63072000");
  });

  it("does not ship CSP or HSTS in development", () => {
    const headers = asHeaderMap("development");

    expect(headers.has("Content-Security-Policy")).toBe(false);
    expect(headers.has("Strict-Transport-Security")).toBe(false);
  });
});
