import type { Metadata, MetadataRoute } from "next";

import {
  buildLanguageAlternates,
  buildLocalizedPath,
  defaultLocale,
  enabledLocales,
  type AppLocale,
  type SiteDictionary,
} from "./i18n.ts";

const defaultSiteUrl = "https://overlaytimer.tools";

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
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL),
  description:
    "A local-first overlay timer generator for building countdown assets and exporting PNG sequence or WebM from one tool page.",
} as const;

export const publicRouteDefinitions = [
  {
    href: "/",
    key: "overview",
    changeFrequency: "weekly",
    priority: 1,
  },
] as const;

export function getLocalizedNavItems(
  locale: AppLocale,
  dictionary: SiteDictionary,
) {
  return publicRouteDefinitions.map((route) => ({
    href: buildLocalizedPath(route.href, locale),
    label: dictionary.nav[route.key],
  }));
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

  return {
    title,
    description,
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRouteDefinitions.map((route) => ({
    url: new URL(buildLocalizedPath(route.href), siteConfig.url).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates:
      enabledLocales.length > 1
        ? {
            languages: Object.fromEntries(
              enabledLocales.map((locale) => [
                locale,
                new URL(buildLocalizedPath(route.href, locale), siteConfig.url).toString(),
              ]),
            ),
          }
        : undefined,
  }));
}
