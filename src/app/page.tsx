import type { Metadata } from "next";

import { getRootPageContent } from "@/content/root";
import { RootPage } from "@/components/site/root-page";
import { defaultLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Overlay Timer Generator for PNG Sequence and WebM Export",
  description:
    "Build an overlay timer directly in the browser, preview it live, and export PNG sequence or WebM assets from one local-first tool page.",
  path: "/",
});

export default async function Home() {
  const content = await getRootPageContent(defaultLocale);

  return <RootPage locale={defaultLocale} content={content} />;
}
