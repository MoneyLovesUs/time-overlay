import type { Metadata } from "next";

import { PresenterTimerPage } from "@/components/site/presenter-timer-page";
import {
  PRESENTER_TIMER_PATH,
  presenterTimerContent,
} from "@/content/presenter-timer";
import { getRootPageContent } from "@/content/root";
import { defaultLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  locale: defaultLocale,
  path: PRESENTER_TIMER_PATH,
  title: presenterTimerContent.metadata.title,
  description: presenterTimerContent.metadata.description,
  localized: false,
  alternateLocales: [defaultLocale],
});

export default async function PresenterTimerRoute() {
  const chrome = await getRootPageContent(defaultLocale);
  return <PresenterTimerPage chrome={chrome} content={presenterTimerContent} />;
}
