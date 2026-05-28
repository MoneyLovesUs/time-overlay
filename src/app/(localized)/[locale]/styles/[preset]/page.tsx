import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRootPageContent } from "@/content/root";
import { StylePresetPage } from "@/components/site/style-preset-page";
import { GENERATOR_THEME_PRESETS } from "@/lib/generator/defaults";
import { defaultLocale, enabledLocales, isEnabledLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

type LocalizedStylePresetRouteProps = {
  params: Promise<{
    locale: string;
    preset: string;
  }>;
};

export function generateStaticParams() {
  return enabledLocales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) =>
      GENERATOR_THEME_PRESETS.map((preset) => ({
        locale,
        preset: preset.id,
      })),
    );
}

function findPreset(slug: string) {
  return GENERATOR_THEME_PRESETS.find((preset) => preset.id === slug) ?? null;
}

export async function generateMetadata({
  params,
}: LocalizedStylePresetRouteProps): Promise<Metadata> {
  const { locale, preset: slug } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  const preset = findPreset(slug);
  if (!preset) {
    notFound();
  }

  const content = await getRootPageContent(locale);
  const label = content.generatorUi.themePresetPicker.presetLabels[preset.id];
  const title = `${label} Time Overlay — ${label} Countdown Timer Overlay Style`;
  const description = `The ${label} Time Overlay preset exports a transparent ${label.toLowerCase()} countdown for Premiere, DaVinci, Final Cut, CapCut, and OBS.`;

  return createPageMetadata({
    locale,
    path: `/styles/${preset.id}`,
    title,
    description,
  });
}

export default async function LocalizedStylePresetRoute({
  params,
}: LocalizedStylePresetRouteProps) {
  const { locale, preset: slug } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  const preset = findPreset(slug);
  if (!preset) {
    notFound();
  }

  const content = await getRootPageContent(locale);
  const label = content.generatorUi.themePresetPicker.presetLabels[preset.id];

  return (
    <StylePresetPage
      preset={preset}
      presetLabel={label}
      content={content}
      locale={locale}
    />
  );
}
