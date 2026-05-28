import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRootPageContent } from "@/content/root";
import { StylePresetPage } from "@/components/site/style-preset-page";
import { GENERATOR_THEME_PRESETS } from "@/lib/generator/defaults";
import { defaultLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

type StylePresetRouteProps = {
  params: Promise<{
    preset: string;
  }>;
};

export function generateStaticParams() {
  return GENERATOR_THEME_PRESETS.map((preset) => ({ preset: preset.id }));
}

function findPreset(slug: string) {
  return GENERATOR_THEME_PRESETS.find((preset) => preset.id === slug) ?? null;
}

export async function generateMetadata({
  params,
}: StylePresetRouteProps): Promise<Metadata> {
  const { preset: slug } = await params;
  const preset = findPreset(slug);

  if (!preset) {
    notFound();
  }

  const content = await getRootPageContent(defaultLocale);
  const label = content.generatorUi.themePresetPicker.presetLabels[preset.id];
  const title = `${label} Time Overlay — ${label} Countdown Timer Overlay Style`;
  const description = `The ${label} Time Overlay preset exports a transparent ${label.toLowerCase()} countdown for Premiere, DaVinci, Final Cut, CapCut, and OBS.`;

  return createPageMetadata({
    locale: defaultLocale,
    path: `/styles/${preset.id}`,
    title,
    description,
  });
}

export default async function DefaultStylePresetRoute({
  params,
}: StylePresetRouteProps) {
  const { preset: slug } = await params;
  const preset = findPreset(slug);

  if (!preset) {
    notFound();
  }

  const content = await getRootPageContent(defaultLocale);
  const label = content.generatorUi.themePresetPicker.presetLabels[preset.id];

  return (
    <StylePresetPage
      preset={preset}
      presetLabel={label}
      content={content}
      locale={defaultLocale}
    />
  );
}
