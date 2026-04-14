export const enabledLocales = ["en", "es", "pt", "ru", "fr", "de", "ko", "ja", "fi"] as const;
export type EnabledLocale = (typeof enabledLocales)[number];

export const knownLocales = enabledLocales;
export type AppLocale = (typeof knownLocales)[number];

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

const loadEnglishDictionary = () =>
  import("./dictionaries/en.ts").then((module) => module.default);

const dictionaryLoaders = enabledLocales.reduce<Record<EnabledLocale, () => Promise<SiteDictionary>>>(
  (acc, locale) => {
    acc[locale] = loadEnglishDictionary;
    return acc;
  },
  {} as Record<EnabledLocale, () => Promise<SiteDictionary>>,
);

function normalizePublicPath(path: string): string {
  const trimmed = path.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function splitHashFragment(path: string) {
  const [base, ...hashParts] = path.split("#");
  return {
    base: base ?? "",
    hash: hashParts.length ? hashParts.join("#") : undefined,
  };
}

export function isEnabledLocale(locale: unknown): locale is EnabledLocale {
  return typeof locale === "string" && enabledLocales.includes(locale as EnabledLocale);
}

export function buildLocalizedPath(path: string, locale: AppLocale = defaultLocale): string {
  const { base, hash } = splitHashFragment(path);
  const normalizedPath = normalizePublicPath(base);

  const localizedBase =
    locale === defaultLocale
      ? normalizedPath
      : normalizedPath === "/"
        ? `/${locale}`
        : `/${locale}${normalizedPath}`;

  return hash ? `${localizedBase}#${hash}` : localizedBase;
}

export function buildLanguageAlternates(
  path: string,
  locales: readonly AppLocale[] = enabledLocales,
): Record<AppLocale, string> {
  const alternates = {} as Record<AppLocale, string>;
  for (const locale of locales) {
    alternates[locale] = buildLocalizedPath(path, locale);
  }
  return alternates;
}

export async function getDictionary(locale: EnabledLocale = defaultLocale): Promise<SiteDictionary> {
  return dictionaryLoaders[locale]();
}
