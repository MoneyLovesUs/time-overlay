import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuidesIndexPage } from "@/components/site/guides-index-page";
import { getRootPageContent } from "@/content/root";
import { createPageMetadata, secondaryContentLocales } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

function assertLocale(locale: string): "zh-hans" {
  if (locale !== "zh-hans") notFound();
  return "zh-hans";
}

export function generateStaticParams() {
  return [{ locale: "zh-hans" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  return createPageMetadata({
    locale,
    path: "/guides",
    title: "透明计时器叠加指南",
    description:
      "经过复核的透明倒计时工作流：OBS、Premiere Pro、DaVinci Resolve、Final Cut Pro、Twitch 和 ProRes 转换。",
    alternateLocales: secondaryContentLocales,
  });
}

export default async function GuidesPage({ params }: Props) {
  const locale = assertLocale((await params).locale);
  const chrome = await getRootPageContent(locale);
  return <GuidesIndexPage chrome={chrome} locale={locale} />;
}
