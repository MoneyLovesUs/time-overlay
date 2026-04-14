import type { EnabledLocale } from "@/lib/i18n";
import type { RootPageContent } from "@/content/root";
import { GeneratorShell } from "@/components/generator/generator-shell";
import { RootSeoSection } from "@/components/site/root-seo-section";

type RootPageProps = {
  locale: EnabledLocale;
  content: RootPageContent;
};

export function RootPage({ locale, content }: RootPageProps) {
  return (
    <div>
      <GeneratorShell />
      <RootSeoSection />
    </div>
  );
}
