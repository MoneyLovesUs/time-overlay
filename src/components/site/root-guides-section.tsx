import Link from "next/link";

import type { RootPageContent } from "@/content/root";
import { buildLocalizedPath, type EnabledLocale } from "@/lib/i18n";

type GuidesSectionData = NonNullable<RootPageContent["guidesSection"]>;

type RootGuidesSectionProps = {
  locale: EnabledLocale;
  guidesSection: GuidesSectionData;
};

export function RootGuidesSection({
  locale,
  guidesSection,
}: RootGuidesSectionProps) {
  return (
    <section id="guides" className="relative border-t border-border/70 bg-background">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 sm:py-14">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
            {guidesSection.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            {guidesSection.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            {guidesSection.intro}
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {guidesSection.links.map((link) => (
            <li key={link.slug}>
              <Link
                href={buildLocalizedPath(`/guides/${link.slug}`, locale)}
                className="cyber-panel-muted cyber-chamfer flex items-center justify-between gap-4 px-5 py-4 text-sm leading-6 text-foreground transition-colors hover:text-primary"
              >
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-muted-foreground"
                >
                  &gt;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
