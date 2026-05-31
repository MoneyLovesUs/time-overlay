import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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
