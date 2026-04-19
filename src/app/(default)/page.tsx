import { getRootPageContent } from "@/content/root";
import { RootPage } from "@/components/site/root-page";
import { defaultLocale } from "@/lib/i18n";

export default async function Home() {
  const content = await getRootPageContent(defaultLocale);

  return <RootPage locale={defaultLocale} content={content} />;
}
