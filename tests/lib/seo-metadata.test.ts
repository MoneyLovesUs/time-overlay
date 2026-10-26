import { describe, expect, it, vi } from "vitest";

import enRootPageContent from "@/content/root/en";
import esRootPageContent from "@/content/root/es";
import jaRootPageContent from "@/content/root/ja";
import zhHansRootPageContent from "@/content/root/zh-hans";
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
      "zh-hans": "/zh-hans",
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
    expect(metadata.other).toMatchObject({
      "saashub-verification": "2zilwxy48gfz",
      "toolfound-verify": "20ff79feceb0cb408baf53eea277b1d5a351c72cbaa47fe4",
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

    expect(zhHansRootPageContent.metadata.title).toContain("透明");
    expect(zhHansRootPageContent.metadata.description.length).toBeLessThanOrEqual(160);
  });

  it("emits localized homepage, trust, guide, and comparison entries", () => {
    const entries = buildSitemapEntries();
    // homepage × 17 locales + (5 supporting + 6 guides + 1 comparison) × 2 locales
    // + 1 English-only product page (/presenter-timer).
    expect(entries.length).toBe(17 + (5 + 6 + 1) * 2 + 1);

    const homepageRoots = entries.filter((entry) => {
      const path = entry.url.replace(/^https?:\/\/[^/]+/, "");
      return (
        path === "/" ||
        /^\/(?:en|es|pt|ru|fr|de|ko|ja|fi|zh-hans|zh-hant|ar|th|cs|hi|nl|sv)$/.test(path)
      );
    });
    expect(homepageRoots.length).toBe(17);
    // Every homepage entry carries hreflang alternates.
    expect(homepageRoots.every((entry) => entry.alternates?.languages)).toBe(true);

    const guideEntries = entries.filter((entry) =>
      entry.url.includes("/guides/"),
    );
    expect(guideEntries.length).toBe(12);
    expect(
      guideEntries.every(
        (entry) =>
          entry.alternates?.languages?.en &&
          entry.alternates.languages["zh-hans"] &&
          entry.alternates.languages["x-default"],
      ),
    ).toBe(true);
    expect(
      guideEntries.some((entry) =>
        entry.url.includes("/zh-hans/guides/add-countdown-to-obs"),
      ),
    ).toBe(true);

    const compareEntries = entries.filter((entry) =>
      entry.url.includes("/compare/"),
    );
    expect(compareEntries.length).toBe(2);
    expect(
      compareEntries.every(
        (entry) =>
          entry.alternates?.languages?.en &&
          entry.alternates.languages["zh-hans"] &&
          entry.alternates.languages["x-default"],
      ),
    ).toBe(true);
    expect(compareEntries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://timeoverlay.co/compare/transparent-overlay-formats",
        "https://timeoverlay.co/zh-hans/compare/transparent-overlay-formats",
      ]),
    );

    const supportingEntries = entries.filter((entry) =>
      ["/guides", "/about", "/privacy", "/contact", "/terms"].some(
        (path) => new URL(entry.url).pathname.endsWith(path),
      ),
    );
    expect(supportingEntries.length).toBe(10);
    expect(
      supportingEntries.every(
        (entry) =>
          entry.alternates?.languages?.en &&
          entry.alternates.languages["zh-hans"] &&
          entry.alternates.languages["x-default"],
      ),
    ).toBe(true);
  });

  it("omits hreflang language alternates for English-only pages", () => {
    const metadata = createPageMetadata({
      path: "/compare/transparent-overlay-formats",
      title: "Compare formats",
      description: "Compare",
      localized: false,
    });

    expect(metadata.alternates?.canonical).toBe(
      "/compare/transparent-overlay-formats",
    );
    expect(metadata.alternates?.languages).toBeUndefined();
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
