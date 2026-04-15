export const enabledLocales = [
  "en",
  "es",
  "pt",
  "ru",
  "fr",
  "de",
  "ko",
  "ja",
  "fi",
  "zh-hant",
  "ar",
  "th",
  "cs",
  "hi",
  "nl",
  "sv",
] as const;
export type EnabledLocale = (typeof enabledLocales)[number];

export const knownLocales = enabledLocales;
export type AppLocale = (typeof knownLocales)[number];

export const defaultLocale: EnabledLocale = "en";

export const localeLabels: Record<EnabledLocale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  ru: "Русский",
  fr: "Français",
  de: "Deutsch",
  ko: "한국어",
  ja: "日本語",
  fi: "Suomi",
  "zh-hant": "繁體中文",
  ar: "العربية",
  th: "ไทย",
  cs: "Čeština",
  hi: "हिन्दी",
  nl: "Nederlands",
  sv: "Svenska",
};

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
): Partial<Record<AppLocale, string>> {
  const alternates: Partial<Record<AppLocale, string>> = {};
  for (const locale of locales) {
    alternates[locale] = buildLocalizedPath(path, locale);
  }
  return alternates;
}

export async function getDictionary(locale: EnabledLocale = defaultLocale): Promise<SiteDictionary> {
  return dictionaryLoaders[locale]();
}
