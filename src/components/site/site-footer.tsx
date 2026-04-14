import Link from "next/link";

type SiteFooterProps = {
  navItems: readonly {
    href: string;
    label: string;
  }[];
  siteDescription: string;
  siteName: string;
  systemRailLabel: string;
  publicStatusLabel: string;
  identityTitle: string;
  jumpTitle: string;
  productTitle: string;
  productDescription: string;
};

export function SiteFooter({
  navItems,
  siteDescription,
  siteName,
  systemRailLabel,
  publicStatusLabel,
  identityTitle,
  jumpTitle,
  productTitle,
  productDescription,
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

            <div className="grid gap-6 sm:grid-cols-3 sm:gap-5">
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
              </div>

              <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:px-1 sm:pr-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/65">
                  {jumpTitle}
                </p>
                <nav aria-label="Footer">
                  <ul className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-foreground"
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
                </nav>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/65">
                  {productTitle}
                </p>
                <p className="text-sm leading-6 text-muted-foreground/78">
                  {productDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
