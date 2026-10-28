"use client";

import type { ProCtaCopy } from "@/content/pro-cta";
import { trackEvent } from "@/lib/analytics/events";

type ExportCompleteProCtaProps = {
  copy: ProCtaCopy;
  onUnlockPro: () => void;
};

/**
 * Secondary offer under the finished download. Deliberately weaker than the
 * download button: no modal, no overlay, muted border, small type. Only shown
 * to free users once an export has actually completed.
 */
export function ExportCompleteProCta({
  copy,
  onUnlockPro,
}: ExportCompleteProCtaProps) {
  return (
    <div className="mt-3 border border-border/60 bg-background/50 px-4 py-3">
      <p className="text-[12px] font-medium text-foreground">
        {copy.exportCtaTitle}
      </p>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
        {copy.exportCtaBody}
      </p>
      <button
        className="mt-2 inline-flex min-h-9 items-center border border-border/70 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
        onClick={() => {
          trackEvent("pro_cta_clicked", { placement: "export_complete" });
          onUnlockPro();
        }}
        type="button"
      >
        {copy.exportCtaButton}
      </button>
    </div>
  );
}
