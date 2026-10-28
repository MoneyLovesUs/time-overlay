"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { getProCtaCopy } from "@/content/pro-cta";
import { trackEvent } from "@/lib/analytics/events";
import {
  getProStatusServerSnapshot,
  getProStatusSnapshot,
  getProUpsellSource,
  subscribeProStatus,
} from "@/lib/pro/client";
import { buildLocalizedPath, type AppLocale } from "@/lib/i18n";

type ProHeaderLinkProps = {
  locale: AppLocale;
};

/**
 * The header stays a server component for SEO; only this slot is client-side
 * because it depends on the locally stored Pro unlock.
 */
export function ProHeaderLink({ locale }: ProHeaderLinkProps) {
  const status = useSyncExternalStore(
    subscribeProStatus,
    getProStatusSnapshot,
    getProStatusServerSnapshot,
  );

  // "unknown" is the pre-hydration paint: selling to a paying customer for one
  // frame is worse than showing nothing, so stay silent until it resolves.
  if (status === "unknown") {
    return null;
  }

  const copy = getProCtaCopy(locale);

  if (status === "pro") {
    return (
      <span className="inline-flex items-center border border-primary/60 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        {copy.proBadgeLabel}
      </span>
    );
  }

  return (
    <Link
      href={buildLocalizedPath("/pro", locale)}
      onClick={() =>
        trackEvent("pro_cta_clicked", {
          placement: "header",
          source: getProUpsellSource() ?? "header",
        })
      }
      className="inline-flex min-h-8 items-center border border-primary/60 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/20"
    >
      {copy.headerUpgradeLabel}
    </Link>
  );
}
