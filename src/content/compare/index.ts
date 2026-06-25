import compareContent from "./en";
import zhHansCompareContent from "./zh-hans";

import type { EnabledLocale } from "@/lib/i18n";
import type { ComparePageContent } from "./types";

export const compareContentLocales = ["en", "zh-hans"] as const satisfies readonly EnabledLocale[];
export type CompareContentLocale = (typeof compareContentLocales)[number];

const compareContentByLocale = {
  en: compareContent,
  "zh-hans": zhHansCompareContent,
} satisfies Record<CompareContentLocale, ComparePageContent>;

export function isCompareContentLocale(
  locale: EnabledLocale,
): locale is CompareContentLocale {
  return (compareContentLocales as readonly EnabledLocale[]).includes(locale);
}

export function getComparePageContent(
  locale: CompareContentLocale = "en",
): ComparePageContent {
  return compareContentByLocale[locale];
}

export type { ComparePageContent } from "./types";
