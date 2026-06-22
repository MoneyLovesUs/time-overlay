import type { Metadata, MetadataRoute } from "next";

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

/**
 * Manually-pinned content year used to stamp freshness-sensitive pages (e.g. the
 * format comparison). Kept as a constant rather than `new Date()` so static
 * generation stays deterministic and the year never silently rolls over — the
 * yearly bump is an intentional content review, enforced by a unit test.
 */
export const CONTENT_YEAR = 2026;

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
  readonly localized: true;
  readonly anchors: typeof homepageAnchorModel;
};

type GuideRouteDefinition = {
  readonly href: `/guides/${string}`;
  readonly changeFrequency: "monthly";
  readonly priority: 0.6;
  // Guides ship English-only. Serving the same English body under a localized
  // prefix while claiming an hreflang alternate is the thin-content / hreflang
  // mismatch we deliberately removed — so they live at the apex path only.
  readonly localized: false;
};

type ComparisonRouteDefinition = {
  readonly href: `/compare/${string}`;
  readonly changeFrequency: "monthly";
  readonly priority: 0.8;
  // English-first for the same reason as guides; promote to localized once the
  // page proves it earns AI citations (then translate the prose, not the matrix).
  readonly localized: false;
};

type PublicRouteDefinition =
  | HomepageRouteDefinition
  | GuideRouteDefinition
  | ComparisonRouteDefinition;

const homepageRoute: HomepageRouteDefinition = {
  href: "/",
  changeFrequency: "weekly",
  priority: 1,
  localized: true,
  anchors: homepageAnchorModel,
} as const;

export const GUIDE_SLUGS = [
  "add-countdown-to-obs",
  "add-countdown-to-premiere",
  "add-countdown-to-davinci-resolve",
  "add-countdown-to-final-cut-pro",
  "png-to-prores",
  "transparent-overlay-for-twitch",
] as const;

export const COMPARE_SLUGS = ["transparent-overlay-formats"] as const;

const guideRoutes: readonly GuideRouteDefinition[] = GUIDE_SLUGS.map((slug) => ({
  href: `/guides/${slug}` as const,
  changeFrequency: "monthly" as const,
  priority: 0.6 as const,
  localized: false as const,
}));

const comparisonRoutes: readonly ComparisonRouteDefinition[] = COMPARE_SLUGS.map(
  (slug) => ({
    href: `/compare/${slug}` as const,
    changeFrequency: "monthly" as const,
    priority: 0.8 as const,
    localized: false as const,
  }),
);

export const publicRouteDefinitions: readonly PublicRouteDefinition[] = [
  homepageRoute,
  ...guideRoutes,
  ...comparisonRoutes,
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
  localized = true,
}: {
  title: string;
  description: string;
  path: string;
  locale?: AppLocale;
  // When false the page is English-only: emit a self canonical but no hreflang
  // language alternates (guides, comparison). Defaults to true for the homepage.
  localized?: boolean;
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
      ...(localized ? { languages: buildLanguageAlternates(path) } : {}),
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

  return publicRouteDefinitions.flatMap((route) => {
    // Localized routes fan out across every locale with hreflang alternates;
    // English-only routes (guides, comparison) emit a single apex entry.
    const locales = route.localized ? enabledLocales : [defaultLocale];

    return locales.map((locale) => {
      const localizedRoutePath = buildLocalizedPath(route.href, locale);
      const entry = {
        url: new URL(localizedRoutePath, siteConfig.url).toString(),
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      };

      if (!route.localized) {
        return entry;
      }

      const localized = buildCompleteSitemapAlternates(route.href);
      const languageUrls = Object.fromEntries(
        (Object.keys(localized) as SitemapAlternateKey[]).map((key) => [
          key,
          new URL(localized[key], siteConfig.url).toString(),
        ]),
      );

      return {
        ...entry,
        alternates: {
          languages: languageUrls,
        },
      };
    });
  });
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
