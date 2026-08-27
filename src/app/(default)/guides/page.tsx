import type { Metadata } from "next";

import { GuidesIndexPage } from "@/components/site/guides-index-page";
import { getRootPageContent } from "@/content/root";
import { defaultLocale } from "@/lib/i18n";
import { createPageMetadata, secondaryContentLocales } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  path: "/guides",
  title: "Transparent timer overlay guides",
  description:
    "Reviewed guides for adding transparent countdown overlays to OBS, Premiere Pro, DaVinci Resolve, Final Cut Pro, Twitch, and ProRes workflows.",
  alternateLocales: secondaryContentLocales,
});

export default async function GuidesPage() {
  const chrome = await getRootPageContent(defaultLocale);
  return <GuidesIndexPage chrome={chrome} locale="en" />;
}
