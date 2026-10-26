import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PresenterTopicPage } from "@/components/site/presenter-topic-page";
import {
  buildPresenterTopicPath,
  getPresenterTopic,
  isPresenterTopicSlug,
  PRESENTER_TOPIC_SLUGS,
} from "@/content/presenter-topics";
import { getRootPageContent } from "@/content/root";
import { defaultLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

type PresenterTopicRouteProps = {
  params: Promise<{
    topic: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return PRESENTER_TOPIC_SLUGS.map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: PresenterTopicRouteProps): Promise<Metadata> {
  const { topic } = await params;
  if (!isPresenterTopicSlug(topic)) {
    notFound();
  }

  const content = getPresenterTopic(topic);
  return createPageMetadata({
    locale: defaultLocale,
    path: buildPresenterTopicPath(topic),
    title: content.metadata.title,
    description: content.metadata.description,
    localized: false,
    alternateLocales: [defaultLocale],
  });
}

export default async function PresenterTopicRoute({ params }: PresenterTopicRouteProps) {
  const { topic } = await params;
  if (!isPresenterTopicSlug(topic)) {
    notFound();
  }

  const chrome = await getRootPageContent(defaultLocale);
  return <PresenterTopicPage chrome={chrome} topic={getPresenterTopic(topic)} />;
}
