import type { NextConfig } from "next";

export function buildSecurityHeaders(
  environment: string | undefined = process.env.NODE_ENV,
) {
  const headers = [
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "Permissions-Policy",
      value:
        "browsing-topics=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    },
  ];

  // CSP is generated per request in `src/proxy.ts`, where a fresh nonce can be
  // passed into Next.js rendering and the AdSense loader. HSTS remains a static
  // production response header.
  if (environment === "production") {
    headers.push(
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    );
  }

  return headers;
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders(),
      },
    ];
  },
  async redirects() {
    return [
      {
        // Canonicalize the www host to the apex domain. Google Search Console
        // shows both www.timeoverlay.co and timeoverlay.co indexed for the same
        // pages, splitting impressions. This 308 (treated as a permanent 301 by
        // crawlers) collapses them onto the apex. The `host` matcher means it
        // only fires in production on the www host — never on localhost or
        // Vercel preview domains.
        source: "/:path*",
        has: [{ type: "host", value: "www.timeoverlay.co" }],
        destination: "https://timeoverlay.co/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
