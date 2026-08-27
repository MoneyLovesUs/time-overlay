import type { Metadata } from "next";

import {
  assertLocalizedInfoLocale,
  createInfoPageMetadata,
  generateInfoStaticParams,
  renderInfoPage,
} from "@/components/site/info-route";

type Props = { params: Promise<{ locale: string }> };

export const generateStaticParams = generateInfoStaticParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocalizedInfoLocale((await params).locale);
  return createInfoPageMetadata("privacy", locale);
}

export default async function PrivacyPage({ params }: Props) {
  const locale = assertLocalizedInfoLocale((await params).locale);
  return renderInfoPage("privacy", locale);
}
