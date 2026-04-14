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
} satisfies Record<EnabledLocale, () => Promise<RootPageContent>>;

function resolveEnabledLocale(locale: string): EnabledLocale {
  if (isEnabledLocale(locale)) {
    return locale;
  }

  return defaultLocale;
}

export async function getRootPageContent(
  locale: EnabledLocale | string = defaultLocale,
): Promise<RootPageContent> {
  return rootContentLoaders[resolveEnabledLocale(locale)]();
}

export type { RootPageContent } from "./types";
