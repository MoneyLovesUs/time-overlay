import type { Metadata, Viewport } from "next";

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

export default function DefaultRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppDocument lang={defaultLocale}>{children}</AppDocument>;
}
