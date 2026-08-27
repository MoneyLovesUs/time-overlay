import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { CSP_NONCE_HEADER } from "@/lib/content-security-policy";
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

  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <AppDocument lang={locale} nonce={nonce}>
      {children}
    </AppDocument>
  );
}
