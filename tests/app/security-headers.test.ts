import { describe, expect, it } from "vitest";

import nextConfig, {
  buildEnglishOnlyPresenterRedirects,
  buildSecurityHeaders,
} from "../../next.config";
import { PRESENTER_TOPIC_SLUGS } from "@/lib/presenter-topic-slugs";

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

describe("english-only presenter redirects", () => {
  it("sends every crawled locale-prefixed presenter URL back to English", async () => {
    const rules = await nextConfig.redirects?.();
    const redirects = buildEnglishOnlyPresenterRedirects();
    const crawled = [
      "/zh-hans/presenter-timer",
      ...PRESENTER_TOPIC_SLUGS.map((slug) => `/zh-hans/presenter-timer/${slug}`),
    ];

    for (const source of crawled) {
      const rule = redirects.find((item) => item.source === source);
      expect(rule?.destination).toBe(source.replace("/zh-hans", ""));
      expect(rule?.permanent).toBe(true);
      expect(rules).toContainEqual(rule);
    }

    expect(redirects.some((item) => item.source === "/zh-hans/guides")).toBe(false);
    expect(redirects.some((item) => item.source.startsWith("/en/"))).toBe(false);
  });
});
