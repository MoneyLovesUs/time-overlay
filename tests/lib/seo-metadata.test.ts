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
    expect(metadata.metadataBase?.toString()).toBe(`${siteConfig.url}/`);
    expect(metadata.openGraph).toMatchObject({
      locale: "fr",
      title: "Minuteur overlay",
      description: "Description FR",
      images: ["/icon.svg"],
    });
    expect(metadata.twitter).toMatchObject({
      title: "Minuteur overlay",
      description: "Description FR",
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
      },
    });
  });

  it("stores search-intent-driven localized homepage metadata", () => {
    expect(enRootPageContent.metadata).toEqual({
      title: "Countdown Timer Overlay Generator for Videos and Live Streams",
      description:
        "Create clean countdown timer overlays in your browser. Preview instantly and export transparent PNG sequences or WebM for video editing, streams, and tutorials.",
    });
    expect(esRootPageContent.metadata).toEqual({
      title: "Generador de temporizador overlay con cuenta regresiva para videos y directos",
      description:
        "Crea temporizadores overlay limpios en tu navegador. Previsualiza al instante y exporta secuencias PNG transparentes o WebM para edición de video, directos y tutoriales.",
    });
    expect(jaRootPageContent.metadata).toEqual({
      title: "動画・配信向けカウントダウンタイマーオーバーレイ作成ツール",
      description:
        "ブラウザで見やすいカウントダウンオーバーレイをすぐ作成。すぐにプレビューでき、動画編集・配信・チュートリアル向けに透過PNG連番やWebMを書き出せます。",
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
