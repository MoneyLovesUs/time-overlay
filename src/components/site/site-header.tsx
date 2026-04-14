import Link from "next/link";

import type { AppLocale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: AppLocale;
  navItems: readonly {
    href: string;
    label: string;
  }[];
  shellLabel: string;
  siteName: string;
};

export function SiteHeader({
  locale,
  shellLabel,
  siteName,
}: SiteHeaderProps) {
  const localizedHomeHref = locale === "en" ? "/" : `/${locale}`;
  const toolLinks = [
    { href: `${localizedHomeHref}#tool`, label: "Tool" },
    { href: `${localizedHomeHref}#faq`, label: "FAQ" },
  ] as const;

  return (
    <header className="relative z-20 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="cyber-panel cyber-chamfer flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
            <Link
              href={localizedHomeHref}
              className="inline-flex min-w-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-foreground transition-colors hover:text-primary"
            >
              <span
                aria-hidden="true"
                className="flex items-center gap-2 text-primary"
              >
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-primary/25 blur-[6px]" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="h-px w-6 bg-gradient-to-r from-primary via-tertiary to-transparent" />
              </span>
              <span className="truncate">{siteName}</span>
            </Link>

            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
              {shellLabel}
            </span>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:justify-end"
          >
            {toolLinks.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="mx-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-border"
                  >
                    {"//"}
                  </span>
                ) : null}
                <Link
                  href={item.href}
                  className="group relative px-1.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-1.5 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-tertiary to-transparent transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
