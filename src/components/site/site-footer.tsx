import Link from "next/link";

import type { NavigationItem } from "@/lib/site-navigation";

type SiteFooterProps = {
  navItems: readonly NavigationItem[];
  resourceItems: readonly NavigationItem[];
  trustItems: readonly NavigationItem[];
  siteDescription: string;
  siteName: string;
  systemRailLabel: string;
  publicStatusLabel: string;
  identityTitle: string;
  jumpTitle: string;
  navAriaLabel?: string;
  productTitle: string;
  productDescription: string;
  resourceTitle: string;
  trustTitle: string;
};

function FooterLinkList({ items }: { items: readonly NavigationItem[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-flex min-h-8 items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            <span
              aria-hidden="true"
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-border"
            >
              &gt;
            </span>
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({
  navItems,
  resourceItems,
  trustItems,
  siteDescription,
  siteName,
  systemRailLabel,
  publicStatusLabel,
  identityTitle,
  jumpTitle,
  navAriaLabel = "Footer",
  productTitle,
  productDescription,
  resourceTitle,
  trustTitle,
}: SiteFooterProps) {
  return (
    <footer className="relative z-20 px-3 pb-4 pt-8 sm:px-4 sm:pb-5">
      <div className="mx-auto max-w-6xl">
        <div className="cyber-panel-muted cyber-chamfer px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border/60 pb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
                {systemRailLabel}
              </p>
              <span
                aria-hidden="true"
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-border"
              >
                {"//"}
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/55">
                {publicStatusLabel}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              <div className="flex flex-col gap-2 border-b border-border/50 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/65">
                  {identityTitle}
                </p>
                <p className="text-sm font-medium text-foreground/92">
                  {siteName}
                </p>
                <p className="max-w-xs text-sm leading-6 text-muted-foreground/80">
                  {siteDescription}
                </p>
                <div className="mt-2 border-t border-border/45 pt-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/55">
                    {productTitle}
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground/70">
                    {productDescription}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:px-1 sm:pr-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/65">
                  {jumpTitle}
                </p>
                <nav aria-label={navAriaLabel}>
                  <FooterLinkList items={navItems} />
                </nav>
              </div>

              <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/65">
                  {resourceTitle}
                </p>
                <nav aria-label={resourceTitle}>
                  <FooterLinkList items={resourceItems} />
                </nav>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/65">
                  {trustTitle}
                </p>
                <nav aria-label={trustTitle}>
                  <FooterLinkList items={trustItems} />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
