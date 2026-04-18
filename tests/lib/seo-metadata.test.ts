import { describe, expect, it } from "vitest";

import {
  buildManifestDefinition,
  buildRobotsDefinition,
  buildSitemapEntries,
  createPageMetadata,
  siteConfig,
} from "@/lib/site";

describe("localized SEO helpers", () => {
  it("creates locale-aware canonical and hreflang metadata", () => {
    const metadata = createPageMetadata({
      locale: "fr",
      path: "/",
      title: "Minuteur overlay",
      description: "Description FR",
    });

    expect(metadata.alternates?.canonical).toBe("/fr");
    expect(metadata.alternates?.languages).toMatchObject({
      en: "/",
      fr: "/fr",
      ja: "/ja",
    });
    expect(metadata.icons).toMatchObject({
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      shortcut: ["/favicon.ico"],
    });
    expect(metadata.applicationName).toBe(siteConfig.name);
    expect(metadata.category).toBe("video");
    expect(metadata.keywords).toContain("overlay timer");
    expect(metadata.openGraph).toMatchObject({
      locale: "fr",
      images: ["/icon.svg"],
    });
  });

  it("emits all localized homepage entries in the sitemap", () => {
    const entries = buildSitemapEntries();
    expect(entries).toHaveLength(16);
  });

  it("emits a crawlable robots definition with sitemap and host", () => {
    const robots = buildRobotsDefinition();

    expect(robots).toMatchObject({
      host: "https://timeoverlay.co",
      sitemap: "https://timeoverlay.co/sitemap.xml",
      rules: {
        userAgent: "*",
        allow: "/",
      },
    });
  });

  it("emits a web manifest definition anchored to the site icon", () => {
    const manifest = buildManifestDefinition();

    expect(manifest).toMatchObject({
      name: siteConfig.name,
      short_name: siteConfig.name,
      description: siteConfig.description,
      start_url: "/",
      display: "standalone",
      background_color: "#05060a",
      theme_color: "#05060a",
    });
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        {
          src: "/icon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
      ]),
    );
  });
});
