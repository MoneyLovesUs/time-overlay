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
  "zh-hans",
  "zh-hant",
  "ar",
  "th",
  "cs",
  "hi",
  "nl",
  "sv",
] as const;
export type EnabledLocale = (typeof enabledLocales)[number];

export type AppLocale = EnabledLocale;

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
  "zh-hans": "简体中文",
  "zh-hant": "繁體中文",
  ar: "العربية",
  th: "ไทย",
  cs: "Čeština",
  hi: "हिन्दी",
  nl: "Nederlands",
  sv: "Svenska",
};

const rtlLocales = new Set<EnabledLocale>(["ar"]);

export function getLocaleDirection(locale: EnabledLocale): "ltr" | "rtl" {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}

export const localeOgFormats: Record<EnabledLocale, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
  ru: "ru_RU",
  fr: "fr_FR",
  de: "de_DE",
  ko: "ko_KR",
  ja: "ja_JP",
  fi: "fi_FI",
  "zh-hans": "zh_CN",
  "zh-hant": "zh_TW",
  ar: "ar_AR",
  th: "th_TH",
  cs: "cs_CZ",
  hi: "hi_IN",
  nl: "nl_NL",
  sv: "sv_SE",
};

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

export type LanguageAlternateKey = AppLocale | "x-default";

export function buildLanguageAlternates(
  path: string,
  locales: readonly AppLocale[] = enabledLocales,
): Partial<Record<LanguageAlternateKey, string>> {
  const alternates: Partial<Record<LanguageAlternateKey, string>> = {};
  for (const locale of locales) {
    alternates[locale] = buildLocalizedPath(path, locale);
  }
  alternates["x-default"] = buildLocalizedPath(path, defaultLocale);
  return alternates;
}
