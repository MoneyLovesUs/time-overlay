import type { Metadata, MetadataRoute } from "next";

import {
  buildLanguageAlternates,
  buildLocalizedPath,
  defaultLocale,
  enabledLocales,
  type AppLocale,
  type SiteDictionary,
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
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL),
  description:
    "A local-first overlay timer generator for building countdown assets and exporting PNG sequence or WebM from one tool page.",
} as const;

const homepageAnchorMatrix = [
  { path: "/#tool", key: "overview" },
  { path: "/#faq", key: "qa" },
  { path: "/#export-formats", key: "howItWorks" },
] as const;

type HomepageRouteDefinition = {
  readonly href: "/";
  readonly changeFrequency: "weekly";
  readonly priority: 1;
  readonly anchors: typeof homepageAnchorMatrix;
};

export const publicRouteDefinitions: readonly HomepageRouteDefinition[] = [
  {
    href: "/",
    changeFrequency: "weekly",
    priority: 1,
    anchors: homepageAnchorMatrix,
  },
] as const;

export function getLocalizedNavItems(locale: AppLocale, dictionary: SiteDictionary) {
  return homepageAnchorMatrix.map((item) => ({
    href: buildLocalizedPath(item.path, locale),
    label: dictionary.nav[item.key],
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

  return publicRouteDefinitions.map((route) => {
    const localized = buildLanguageAlternates(route.href);
    const languageUrls = Object.fromEntries(
      enabledLocales.map((locale) => [
        locale,
        new URL(localized[locale], siteConfig.url).toString(),
      ]),
    );

    return {
      url: new URL(buildLocalizedPath(route.href), siteConfig.url).toString(),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: languageUrls,
      },
    };
  });
}
