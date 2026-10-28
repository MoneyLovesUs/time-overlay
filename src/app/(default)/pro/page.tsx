import type { Metadata } from "next";

import { ProPage } from "@/components/site/pro-page";
import { getProPageContent } from "@/content/pro-page";
import { getRootPageContent } from "@/content/root";
import { defaultLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getProPageContent(defaultLocale);
  return createPageMetadata({
    locale: defaultLocale,
    path: "/pro",
    title: content.metadata.title,
    description: content.metadata.description,
  });
}

export default async function ProRoute() {
  const content = await getProPageContent(defaultLocale);
  const chrome = await getRootPageContent(defaultLocale);

  return <ProPage content={content} chrome={chrome} locale={defaultLocale} />;
}
