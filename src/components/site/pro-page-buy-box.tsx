"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_PAYWALL_COPY,
  type ProPaywallCopy,
} from "@/components/generator/pro-paywall-modal";
import type { ProPageContent } from "@/content/pro-page/types";
import { trackEvent } from "@/lib/analytics/events";
import {
  fetchProQuote,
  setProUpsellSource,
  startProCheckout,
  upsellSourcePayload,
  usePro,
} from "@/lib/pro/client";
import { PRO_PRICE_LABEL, type ProTrigger } from "@/lib/pro/entitlements";
import {
  quoteAnalytics,
  type PriceQuote,
} from "@/lib/pro/regional-pricing";
import { buildLocalizedPath, type AppLocale } from "@/lib/i18n";

/**
 * The buy box for /pro. Reuses the generator's quote + checkout calls so there
 * is one checkout implementation, one regional-pricing path, and one set of
 * failure messages.
 */
export function ProPageBuyBox({
  content,
  paywallCopy: paywallCopyOverride,
  locale,
}: {
  content: ProPageContent;
  paywallCopy?: Partial<ProPaywallCopy>;
  locale: AppLocale;
}) {
  const paywallCopy: ProPaywallCopy = {
    ...DEFAULT_PAYWALL_COPY,
    ...paywallCopyOverride,
  };
  const { status } = usePro();
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "pending" | "unavailable" | "error" | "quote_changed"
  >("idle");
  const abortRef = useRef<AbortController | null>(null);
  const checkoutPending = useRef(false);

  const loadQuote = () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setQuoteLoading(true);
    void fetchProQuote(controller.signal).then((next) => {
      if (controller.signal.aborted) {
        return;
      }
      setQuote(next);
      setQuoteLoading(false);
    });
  };

  useEffect(() => {
    // Every quote/checkout fired from this page belongs to the /pro surface.
    setProUpsellSource("pro_page");
    trackEvent("pro_page_viewed", {});
    loadQuote();
    return () => {
      abortRef.current?.abort();
      setProUpsellSource(null);
    };
  }, []);

  const handleCheckout = async () => {
    if (checkoutPending.current) {
      return;
    }
    if (!quote || quoteLoading) {
      return;
    }
    if (
      quote.expiresAt !== null &&
      quote.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      setCheckoutState("quote_changed");
      loadQuote();
      return;
    }
    checkoutPending.current = true;
    setCheckoutState("pending");
    const trigger: ProTrigger = "direct";
    trackEvent("pro_checkout_clicked", {
      trigger,
      source: "pro_page",
      ...quoteAnalytics(quote),
      ...upsellSourcePayload("pro_page"),
    });
    try {
      const result = await startProCheckout(
        trigger,
        locale,
        `${buildLocalizedPath("/pro", locale)}`,
        quote,
      );
      if (result === "quote_changed") {
        setCheckoutState("quote_changed");
        loadQuote();
      } else if (result === "unavailable" || result === "error") {
        setCheckoutState(result);
      }
    } catch {
      setCheckoutState("error");
    } finally {
      checkoutPending.current = false;
    }
  };

  const price = quote
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
      }).format(quote.amount / 100)
    : PRO_PRICE_LABEL;
  const buttonLabel = quote
    ? content.buyButton.replace(PRO_PRICE_LABEL, price)
    : content.buyButton;

  return (
    <div className="cyber-panel cyber-chamfer px-6 py-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
        {content.eyebrow}
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">
        {price}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{content.priceNote}</p>

      {status === "pro" ? (
        <p className="mt-5 flex items-center gap-2 text-sm text-primary" role="status">
          <Check className="size-4" />
          {paywallCopy.restoreSuccessMessage}
        </p>
      ) : (
        <>
          <Button
            className="mt-5 h-11 w-full rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
            disabled={checkoutState === "pending" || quoteLoading || !quote}
            onClick={handleCheckout}
            type="button"
          >
            {checkoutState === "pending" ? "..." : buttonLabel}
          </Button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" />
            <span>{content.buyNote}</span>
          </p>
        </>
      )}

      <div aria-live="polite">
        {!quote && !quoteLoading ? (
          <div className="mt-3 text-sm">
            <p role="alert">{paywallCopy.unavailableMessage}</p>
            <Button
              className="mt-2"
              onClick={loadQuote}
              type="button"
              variant="outline"
            >
              {paywallCopy.quoteRetry}
            </Button>
          </div>
        ) : null}
        {checkoutState === "quote_changed" ? (
          <p className="mt-2 text-sm" role="status">
            {paywallCopy.quoteChanged}
          </p>
        ) : null}
        {checkoutState === "unavailable" ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {paywallCopy.unavailableMessage}
          </p>
        ) : null}
        {checkoutState === "error" ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {paywallCopy.errorMessage}
          </p>
        ) : null}
      </div>

      <p className="mt-5 border-t border-border/70 pt-3 text-xs leading-5 text-muted-foreground">
        {content.restoreHint}
      </p>
      <Link
        href={buildLocalizedPath("/", locale)}
        className="mt-3 inline-flex min-h-10 items-center gap-2 border border-border/70 px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
      >
        <span aria-hidden="true">←</span>
        {content.footerLinkLabel}
      </Link>
    </div>
  );
}
