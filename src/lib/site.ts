import type { Metadata, MetadataRoute } from "next";

import { GENERATOR_THEME_PRESETS } from "./generator/defaults.ts";
import {
  buildLanguageAlternates,
  buildLocalizedPath,
  defaultLocale,
  enabledLocales,
  localeOgFormats,
  type EnabledLocale,
  type AppLocale,
} from "./i18n.ts";

const defaultSiteUrl = "https://timeoverlay.co";

function normalizeSiteUrl(value: string | undefined): string {
  if (!value) {
    return defaultSiteUrl;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return defaultSiteUrl;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return defaultSiteUrl;
  }
}

export const siteConfig = {
  name: "Time Overlay",
  shortName: "Time Overlay",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL),
  description:
    "Time Overlay generates transparent countdown timer overlays in your browser. Preview a Time Overlay live, export PNG sequence or WebM with alpha for editors.",
} as const;

export const siteThemeColor = "#05060a";

export const siteOgImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Time Overlay — countdown timer overlays for video and live streams",
  type: "image/png",
} as const;

export function buildSiteIconMetadata(): NonNullable<Metadata["icons"]> {
  return {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
  };
}

export const homepageAnchorModel = [
  { path: "/#tool", key: "overview" },
  { path: "/#faq", key: "qa" },
  { path: "/#export-formats", key: "howItWorks" },
] as const;

type HomepageRouteDefinition = {
  readonly href: "/";
  readonly changeFrequency: "weekly";
  readonly priority: 1;
  readonly anchors: typeof homepageAnchorModel;
};

type StylePresetRouteDefinition = {
  readonly href: `/styles/${string}`;
  readonly changeFrequency: "monthly";
  readonly priority: 0.7;
};

type GuideRouteDefinition = {
  readonly href: `/guides/${string}`;
  readonly changeFrequency: "monthly";
  readonly priority: 0.6;
};

type PublicRouteDefinition =
  | HomepageRouteDefinition
  | StylePresetRouteDefinition
  | GuideRouteDefinition;

const homepageRoute: HomepageRouteDefinition = {
  href: "/",
  changeFrequency: "weekly",
  priority: 1,
  anchors: homepageAnchorModel,
} as const;

const stylePresetRoutes: readonly StylePresetRouteDefinition[] =
  GENERATOR_THEME_PRESETS.map((preset) => ({
    href: `/styles/${preset.id}` as const,
    changeFrequency: "monthly" as const,
    priority: 0.7 as const,
  }));

export const GUIDE_SLUGS = [
  "add-countdown-to-obs",
  "add-countdown-to-premiere",
  "add-countdown-to-davinci-resolve",
  "add-countdown-to-final-cut-pro",
  "png-to-prores",
  "transparent-overlay-for-twitch",
] as const;

const guideRoutes: readonly GuideRouteDefinition[] = GUIDE_SLUGS.map((slug) => ({
  href: `/guides/${slug}` as const,
  changeFrequency: "monthly" as const,
  priority: 0.6 as const,
}));

export const publicRouteDefinitions: readonly PublicRouteDefinition[] = [
  homepageRoute,
  ...stylePresetRoutes,
  ...guideRoutes,
] as const;

type SitemapAlternateKey = EnabledLocale | "x-default";

function buildCompleteSitemapAlternates(path: string): Record<SitemapAlternateKey, string> {
  const alternates = buildLanguageAlternates(path, enabledLocales);
  const complete = {} as Record<SitemapAlternateKey, string>;

  for (const locale of enabledLocales) {
    const localizedPath = alternates[locale];
    if (!localizedPath) {
      throw new Error(`Missing localized alternate for locale: ${locale}`);
    }
    complete[locale] = localizedPath;
  }

  const defaultPath = alternates["x-default"];
  if (!defaultPath) {
    throw new Error("Missing x-default alternate");
  }
  complete["x-default"] = defaultPath;

  return complete;
}

function buildOpenGraphAlternateLocales(locale: AppLocale): string[] {
  return enabledLocales
    .filter((alternate) => alternate !== locale)
    .map((alternate) => localeOgFormats[alternate]);
}

export function createPageMetadata({
  title,
  description,
  path,
  locale = defaultLocale,
}: {
  title: string;
  description: string;
  path: string;
  locale?: AppLocale;
}): Metadata {
  const canonicalPath = buildLocalizedPath(path, locale);
  const ogImage = {
    url: siteOgImage.url,
    width: siteOgImage.width,
    height: siteOgImage.height,
    alt: siteOgImage.alt,
    type: siteOgImage.type,
  };

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    applicationName: siteConfig.name,
    category: "video",
    icons: buildSiteIconMetadata(),
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: siteConfig.name,
      type: "website",
      locale: localeOgFormats[locale],
      alternateLocale: buildOpenGraphAlternateLocales(locale),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteOgImage.url],
    },
  };
}

export async function createRootPageMetadata(
  locale: EnabledLocale = defaultLocale,
): Promise<Metadata> {
  const { getRootPageContent } = await import("@/content/root");
  const content = await getRootPageContent(locale);

  return createPageMetadata({
    locale,
    path: "/",
    title: content.metadata.title,
    description: content.metadata.description,
  });
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return enabledLocales.flatMap((locale) =>
    publicRouteDefinitions.map((route) => {
      const localizedRoutePath = buildLocalizedPath(route.href, locale);
      const localized = buildCompleteSitemapAlternates(route.href);
      const languageUrls = Object.fromEntries(
        (Object.keys(localized) as SitemapAlternateKey[]).map((key) => [
          key,
          new URL(localized[key], siteConfig.url).toString(),
        ]),
      );

      return {
        url: new URL(localizedRoutePath, siteConfig.url).toString(),
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: languageUrls,
        },
      };
    }),
  );
}

export function buildRobotsDefinition(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}

export function buildManifestDefinition(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: siteThemeColor,
    theme_color: siteThemeColor,
    icons: [
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
    ],
  };
}
