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

  it("ships a production CSP for the app and its approved analytics providers", () => {
    const headers = asHeaderMap("production");
    const csp = headers.get("Content-Security-Policy");

    expect(csp).toBeDefined();
    expect(csp).not.toContain("\n");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).toContain("https://www.googletagmanager.com");
    expect(csp).toContain("https://analytics.ahrefs.com");
    expect(csp).toContain("https://*.clarity.ms");
    expect(csp).toContain("https://us.i.posthog.com");
    expect(csp).toContain("frame-src 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain("checkout.stripe.com");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("does not ship CSP or HSTS in development", () => {
    const headers = asHeaderMap("development");

    expect(headers.has("Content-Security-Policy")).toBe(false);
    expect(headers.has("Strict-Transport-Security")).toBe(false);
  });
});
