import { describe, expect, it, vi } from "vitest";

import enRootPageContent from "@/content/root/en";
import esRootPageContent from "@/content/root/es";
import jaRootPageContent from "@/content/root/ja";
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-geist-sans" }),
  Geist_Mono: () => ({ variable: "font-geist-mono" }),
}));

import { generateMetadata as generateRootLayoutMetadata } from "@/app/(default)/layout";
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
      "x-default": "/",
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
    expect(metadata.keywords).toBeUndefined();
    expect(metadata.metadataBase?.toString()).toBe(`${siteConfig.url}/`);
    expect(metadata.openGraph).toMatchObject({
      locale: "fr_FR",
      title: "Minuteur overlay",
      description: "Description FR",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    });
    expect(metadata.openGraph?.alternateLocale).toEqual(
      expect.arrayContaining(["en_US", "ja_JP", "ar_AR"]),
    );
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Minuteur overlay",
      description: "Description FR",
      images: ["/og.png"],
    });
  });

  it("uses the descriptive english homepage title as the root default", async () => {
    const metadata = await generateRootLayoutMetadata();

    expect(metadata.title).toEqual({
      default: enRootPageContent.metadata.title,
      template: `%s | ${siteConfig.name}`,
    });
    expect(metadata.description).toBe(enRootPageContent.metadata.description);
    expect(metadata.verification).toEqual({
      other: {
        _foundr: "a2e7581355636cb842aa09283f303628",
        "saashub-verification": "igknz9129ppt",
      },
    });
  });

  it("stores search-intent-driven localized homepage metadata under the 160-char description cap", () => {
    expect(enRootPageContent.metadata.title).toContain("Time Overlay");
    expect(enRootPageContent.metadata.description.length).toBeLessThanOrEqual(160);
    expect(enRootPageContent.metadata.description.toLowerCase()).toContain(
      "time overlay",
    );

    expect(esRootPageContent.metadata.title.length).toBeGreaterThan(0);
    expect(esRootPageContent.metadata.description.length).toBeLessThanOrEqual(160);

    expect(jaRootPageContent.metadata.title.length).toBeGreaterThan(0);
    expect(jaRootPageContent.metadata.description.length).toBeLessThanOrEqual(160);
  });

  it("emits all localized homepage entries in the sitemap", () => {
    const entries = buildSitemapEntries();
    // homepage + 6 guides per locale × 16 locales
    expect(entries.length).toBe(7 * 16);
    const homepageRoots = entries.filter((entry) => {
      const path = entry.url.replace(/^https?:\/\/[^/]+/, "");
      return (
        path === "/" ||
        /^\/(?:en|es|pt|ru|fr|de|ko|ja|fi|zh-hant|ar|th|cs|hi|nl|sv)$/.test(path)
      );
    });
    expect(homepageRoots.length).toBe(16);
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
