import { defaultLocale, isEnabledLocale, type EnabledLocale } from "@/lib/i18n";

import type { RootPageContent } from "@/content/root/types";

export const rootContentLoaders = {
  en: () => import("./en").then((module) => module.default),
  es: () => import("./es").then((module) => module.default),
  pt: () => import("./pt").then((module) => module.default),
  ru: () => import("./ru").then((module) => module.default),
  fr: () => import("./fr").then((module) => module.default),
  de: () => import("./de").then((module) => module.default),
  ko: () => import("./ko").then((module) => module.default),
  ja: () => import("./ja").then((module) => module.default),
  fi: () => import("./fi").then((module) => module.default),
  "zh-hant": () => import("./zh-hant").then((module) => module.default),
  ar: () => import("./ar").then((module) => module.default),
  th: () => import("./th").then((module) => module.default),
  cs: () => import("./cs").then((module) => module.default),
  hi: () => import("./hi").then((module) => module.default),
  nl: () => import("./nl").then((module) => module.default),
  sv: () => import("./sv").then((module) => module.default),
} satisfies Record<EnabledLocale, () => Promise<RootPageContent>>;

function assertEnabledLocale(locale: string): asserts locale is EnabledLocale {
  if (!isEnabledLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
}

export async function getRootPageContent(
  locale: EnabledLocale = defaultLocale,
): Promise<RootPageContent> {
  assertEnabledLocale(locale);
  return rootContentLoaders[locale]();
}

export type { RootPageContent } from "./types";
