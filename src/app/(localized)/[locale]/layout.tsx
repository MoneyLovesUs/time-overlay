import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { defaultLocale, isEnabledLocale } from "@/lib/i18n";
import { createRootPageMetadata } from "@/lib/site";
import { AppDocument, siteViewport } from "@/app/app-shell";

import "../../globals.css";

type LocalizedLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

type LocalizedLayoutMetadataProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LocalizedLayoutMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  return createRootPageMetadata(locale);
}

export const viewport: Viewport = siteViewport;

export default async function LocalizedLayout({ children, params }: LocalizedLayoutProps) {
  const { locale } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  return <AppDocument lang={locale}>{children}</AppDocument>;
}
