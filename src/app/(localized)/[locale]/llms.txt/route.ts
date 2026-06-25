import { notFound } from "next/navigation";

import { buildLlmsTxt } from "@/lib/markdown/llms";
import { defaultLocale, isEnabledLocale } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "zh-hans" }];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;

  if (!isEnabledLocale(locale) || locale === defaultLocale) {
    notFound();
  }

  return new Response(buildLlmsTxt(locale), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
