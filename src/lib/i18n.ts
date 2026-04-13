export const knownLocales = ["en", "zh"] as const;
export type AppLocale = (typeof knownLocales)[number];

export const enabledLocales = ["en"] as const;
export type EnabledLocale = (typeof enabledLocales)[number];

export const defaultLocale: EnabledLocale = "en";

export type SiteDictionary = {
  site: {
    description: string;
  };
  nav: {
    overview: string;
    qa: string;
    howItWorks: string;
  };
  header: {
    shellLabel: string;
  };
  footer: {
    systemRail: string;
    publicStatus: string;
    identityTitle: string;
    exploreTitle: string;
    legalTitle: string;
    legalNotice: string;
  };
};

const dictionaryLoaders = {
  en: () => import("./dictionaries/en.ts").then((module) => module.default),
} satisfies Record<EnabledLocale, () => Promise<SiteDictionary>>;

function normalizePublicPath(path: string): string {
  const trimmed = path.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

export function buildLocalizedPath(
  path: string,
  locale: AppLocale = defaultLocale,
): string {
  const normalizedPath = normalizePublicPath(path);

  if (locale === defaultLocale) {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function buildLanguageAlternates(
  path: string,
  locales: readonly AppLocale[] = enabledLocales,
): Partial<Record<AppLocale, string>> | undefined {
  if (locales.length <= 1) {
    return undefined;
  }

  return Object.fromEntries(
    locales.map((locale) => [locale, buildLocalizedPath(path, locale)]),
  ) as Partial<Record<AppLocale, string>>;
}

export async function getDictionary(
  locale: EnabledLocale = defaultLocale,
): Promise<SiteDictionary> {
  return dictionaryLoaders[locale]();
}
