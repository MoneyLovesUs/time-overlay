import type { Metadata, MetadataRoute } from "next";

import {
  buildLanguageAlternates,
  buildLocalizedPath,
  defaultLocale,
  enabledLocales,
  type EnabledLocale,
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
    "A local-first overlay timer tool for videos, live streams, and tutorials with clean countdown visuals and fast browser-based setup.",
} as const;

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

export const publicRouteDefinitions: readonly HomepageRouteDefinition[] = [
  {
    href: "/",
    changeFrequency: "weekly",
    priority: 1,
    anchors: homepageAnchorModel,
  },
] as const;

function buildCompleteLanguageAlternates(path: string): Record<EnabledLocale, string> {
  const alternates = buildLanguageAlternates(path, enabledLocales);
  const completeAlternates = {} as Record<EnabledLocale, string>;

  for (const locale of enabledLocales) {
    const localizedPath = alternates[locale];
    if (!localizedPath) {
      throw new Error(`Missing localized alternate for locale: ${locale}`);
    }

    completeAlternates[locale] = localizedPath;
  }

  return completeAlternates;
}

export function getLocalizedNavItems(locale: AppLocale, dictionary: SiteDictionary) {
  return homepageAnchorModel.map((item) => ({
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
      const localized = buildCompleteLanguageAlternates(route.href);
      const languageUrls = Object.fromEntries(
        enabledLocales.map((alternateLocale) => [
          alternateLocale,
          new URL(localized[alternateLocale], siteConfig.url).toString(),
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
