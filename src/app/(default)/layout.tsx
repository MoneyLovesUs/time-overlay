import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/content-security-policy";
import { defaultLocale } from "@/lib/i18n";
import {
  AppDocument,
  generateDefaultLayoutMetadata,
  siteViewport,
} from "@/app/app-shell";

import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return generateDefaultLayoutMetadata();
}

export const viewport: Viewport = siteViewport;

export default async function DefaultRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <AppDocument lang={defaultLocale} nonce={nonce}>
      {children}
    </AppDocument>
  );
}
