import type { NextConfig } from "next";

const productionContentSecurityPolicy = [
  "default-src 'self'",
  // This application is statically rendered. Next.js' generated bootstrap and
  // the existing analytics guards use inline scripts, so a request nonce would
  // force every page into dynamic rendering. Keep inline event handlers blocked
  // separately with script-src-attr.
  [
    "script-src 'self' 'unsafe-inline'",
    "https://www.googletagmanager.com",
    "https://analytics.ahrefs.com",
    "https://www.clarity.ms",
    "https://*.clarity.ms",
    "https://us-assets.i.posthog.com",
  ].join(" "),
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  [
    "img-src 'self' data: blob:",
    "https://*.google-analytics.com",
    "https://analytics.ahrefs.com",
    "https://*.clarity.ms",
    "https://*.bing.com",
  ].join(" "),
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://analytics.ahrefs.com",
    "https://*.clarity.ms",
    "https://*.bing.com",
    "https://us.i.posthog.com",
    "https://us-assets.i.posthog.com",
    "wss://us.i.posthog.com",
  ].join(" "),
  "media-src 'self' data: blob:",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

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

  // Do not apply CSP or HSTS in `next dev`: React's development runtime needs
  // eval and local QA runs over plain HTTP. The production policy intentionally
  // omits unsafe-eval and upgrades any accidentally insecure subresources.
  if (environment === "production") {
    headers.push(
      {
        key: "Content-Security-Policy",
        value: productionContentSecurityPolicy,
      },
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
