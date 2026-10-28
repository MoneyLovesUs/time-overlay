"use client";

import { useEffect, useRef, useState } from "react";
import { fetchProQuote } from "@/lib/pro/client";
import type { PriceQuote } from "@/lib/pro/regional-pricing";
import { Check, Clock, Gauge, LayoutTemplate, Lock, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RootPageContent } from "@/content/root/types";
import {
  defaultLocale,
  isEnabledLocale,
} from "@/lib/i18n";
import type { ProTrigger } from "@/lib/pro/entitlements";

export type ProPaywallCopy = NonNullable<
  RootPageContent["generatorUi"]["pro"]
>["paywall"];

export const DEFAULT_PAYWALL_COPY: ProPaywallCopy = {
  title: "Unlock Time Overlay Pro",
  titleDuration: "Export timers up to 60 minutes",
  titleFps: "Export smooth 60 FPS timers",
  titleTemplate: "Export with this Pro template",
  benefitDuration: "Timers up to 60 minutes",
  benefitFps: "60 FPS exports",
  benefitTemplates: "12 extra Pro templates",
  benefitFutureTemplates: "Future Pro templates included",
  priceNote: "$9 one-time payment · lifetime access, no subscription.",
  priceTemplate: "{price} one-time payment · lifetime access, no subscription.",
  regionalPriceNote: "Regional pricing applied.",
  trustNote: "Secure checkout by Stripe · 7-day full refund",
  quoteLoading: "Loading price…",
  quoteRetry: "Retry price",
  quoteChanged: "Price updated. Please review it and click unlock again.",
  unlockButton: "Unlock Pro",
  unlockButtonTemplate: "Unlock for {price}",
  unavailableMessage:
    "Payments are temporarily unavailable. Please try again later.",
  errorMessage: "Something went wrong starting checkout. Please retry.",
  restoreHeading: "Already purchased? Restore purchase",
  restoreEmailLabel: "Email used for purchase",
  restoreEmailPlaceholder: "you@example.com",
  restoreButton: "Restore purchase",
  restoreSuccessMessage: "Pro unlocked on this device.",
  restoreNotFoundMessage: "No Pro purchase found for that email address.",
  closeLabel: "Close",
};

export type CheckoutStartResult =
  | "redirected"
  | "quote_changed"
  | "unavailable"
  | "error";

export type RestoreStartResult =
  | "restored"
  | "not_found"
  | "unavailable"
  | "error";

type ProPaywallModalProps = {
  open: boolean;
  trigger: ProTrigger | null;
  copy?: Partial<ProPaywallCopy>;
  onClose: () => void;
  onCheckout: (trigger: ProTrigger, quote: PriceQuote) => Promise<CheckoutStartResult>;
  onRestore: (email: string) => Promise<RestoreStartResult>;
};

type RestoreFeedback = "success" | "not_found" | "failed" | null;

/**
 * The checkout API needs the UI locale plus an in-site return path. The
 * generator shell is rendered under both "/" (English) and "/{locale}", and
 * locale never crosses the server/client boundary here, so derive both from
 * the current location at click time.
 */
export function resolveGeneratorCheckoutContext(
  pathname: string,
  search: string,
): { locale: string; returnPath: string } {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale =
    firstSegment && isEnabledLocale(firstSegment) ? firstSegment : defaultLocale;
  const returnPath = `${pathname}${search}` || "/";
  return { locale, returnPath };
}

export function ProPaywallModal(props: ProPaywallModalProps) {
  if (!props.open || props.trigger === null) return null;
  return <PaywallContent key={props.trigger} {...props} />;
}

export function resolvePaywallTitle(trigger: ProTrigger, copy: ProPaywallCopy): string {
  switch (trigger) {
    case "duration": return copy.titleDuration;
    case "fps": return copy.titleFps;
    case "template": return copy.titleTemplate;
    default: return copy.title;
  }
}

function formatQuotePrice(quote: PriceQuote, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(quote.amount / 100);
}

function currentLocale(): string {
  return typeof window === "undefined" ? defaultLocale : resolveGeneratorCheckoutContext(window.location.pathname, "").locale;
}

export function ProPriceSummary({ quote, copy, locale }: {
  quote: PriceQuote; copy: ProPaywallCopy; locale: string;
}) {
  const price = formatQuotePrice(quote, locale);
  return <>
    <p className="mt-3 text-sm font-medium text-foreground">
      {copy.priceTemplate.replace("{price}", price)}
    </p>
    {quote.discountPercent > 0 ? <p className="mt-1 text-xs text-muted-foreground">{copy.regionalPriceNote}</p> : null}
  </>;
}

function PaywallContent({ trigger, copy, onClose, onCheckout, onRestore }: ProPaywallModalProps) {
  const mergedCopy = { ...DEFAULT_PAYWALL_COPY, ...copy };
  const [checkoutState, setCheckoutState] = useState<"idle" | "pending" | "unavailable" | "error" | "quote_changed">("idle");
  const [quoteState, setQuoteState] = useState<{ quote: PriceQuote | null; loading: boolean }>({ quote: null, loading: true });
  const [restoreState, setRestoreState] = useState<"idle" | "pending" | RestoreFeedback>("idle");
  const [restoreEmail, setRestoreEmail] = useState("");
  // Restore stays collapsed so it never competes with the purchase CTA.
  const [restoreOpen, setRestoreOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const checkoutPending = useRef(false);
  const dialog = useRef<HTMLDivElement>(null);

  const loadQuote = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const quote = await fetchProQuote(controller.signal);
    if (!controller.signal.aborted) setQuoteState({ quote, loading: false });
  };
  useEffect(() => {
    void loadQuote();
    const previousFocus = document.activeElement as HTMLElement | null;
    const panel = dialog.current;
    panel?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel) return;
      const elements = [...panel.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)")];
      if (!elements.length) return;
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      abortRef.current?.abort();
      document.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
    // Mount once per opening; an inline callback must not refetch prices.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retryQuote = () => {
    setQuoteState({ quote: null, loading: true });
    void loadQuote();
  };
  const handleCheckout = async () => {
    const quote = quoteState.quote;
    if (!quote || quoteState.loading || trigger === null || checkoutPending.current) return;
    if (quote.expiresAt !== null && quote.expiresAt <= Math.floor(Date.now() / 1000)) {
      setCheckoutState("quote_changed");
      retryQuote();
      return;
    }
    checkoutPending.current = true;
    setCheckoutState("pending");
    try {
      const result = await onCheckout(trigger, quote);
      if (result === "quote_changed") {
        setCheckoutState("quote_changed");
        retryQuote();
      } else if (result === "unavailable" || result === "error") {
        setCheckoutState(result);
      }
    } catch { setCheckoutState("error"); }
    finally { checkoutPending.current = false; }
  };

  const handleRestore = () => {
    const email = restoreEmail.trim();
    if (!email) {
      return;
    }
    setRestoreState("pending");
    onRestore(email).then((result) => {
      if (result === "restored") {
        setRestoreState("success");
        return;
      }
      if (result === "not_found") {
        setRestoreState("not_found");
        return;
      }
      setRestoreState("failed");
    });
  };

  const benefits = [
    { icon: Clock, label: mergedCopy.benefitDuration },
    { icon: Gauge, label: mergedCopy.benefitFps },
    { icon: LayoutTemplate, label: mergedCopy.benefitTemplates },
    { icon: Sparkles, label: mergedCopy.benefitFutureTemplates },
  ];
  const title = trigger === null ? mergedCopy.title : resolvePaywallTitle(trigger, mergedCopy);
  const locale = currentLocale();
  const unlockLabel = quoteState.quote
    ? mergedCopy.unlockButtonTemplate.replace("{price}", formatQuotePrice(quoteState.quote, locale))
    : mergedCopy.unlockButton;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      ref={dialog}
    >
      <div className="cyber-panel cyber-chamfer relative w-full max-w-md px-6 py-6">
        <button
          aria-label={mergedCopy.closeLabel}
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        <ul className="mt-4 space-y-2">
          {benefits.map((benefit) => (
            <li className="flex items-center gap-2 text-sm text-foreground" key={benefit.label}>
              <benefit.icon className="size-4 text-primary" />
              <span>{benefit.label}</span>
              <Check className="ml-auto size-4 text-tertiary" />
            </li>
          ))}
        </ul>
        <div aria-live="polite">
          {quoteState.quote ? <ProPriceSummary quote={quoteState.quote} copy={mergedCopy} locale={locale} />
            : <p className="mt-3 text-sm" role={quoteState.loading ? "status" : "alert"}>
              {quoteState.loading ? mergedCopy.quoteLoading : mergedCopy.unavailableMessage}
            </p>}
          {!quoteState.loading && !quoteState.quote ? <Button type="button" variant="outline"
            className="mt-2" onClick={retryQuote}>{mergedCopy.quoteRetry}</Button> : null}
        </div>

        <Button
          className="mt-4 h-11 w-full rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
          disabled={checkoutState === "pending" || quoteState.loading || !quoteState.quote}
          onClick={handleCheckout}
          type="button"
        >
          {checkoutState === "pending"
            ? "..."
            : unlockLabel}
        </Button>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" />
          <span>{mergedCopy.trustNote}</span>
        </p>
        {checkoutState === "quote_changed" ? <p className="mt-2 text-sm" role="status">
          {mergedCopy.quoteChanged}
        </p> : null}
        {checkoutState === "unavailable" ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {mergedCopy.unavailableMessage}
          </p>
        ) : null}
        {checkoutState === "error" ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {mergedCopy.errorMessage}
          </p>
        ) : null}

        <div className="mt-5 border-t border-border/70 pt-3">
          {!restoreOpen ? (
            <button
              className="w-full text-center text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              onClick={() => setRestoreOpen(true)}
              type="button"
            >
              {mergedCopy.restoreHeading}
            </button>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                {mergedCopy.restoreHeading}
              </p>
              <label className="mt-3 block text-sm text-muted-foreground">
                {mergedCopy.restoreEmailLabel}
                <input
                  autoFocus
                  className="mt-2 h-10 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary"
                  onChange={(event) => setRestoreEmail(event.target.value)}
                  placeholder={mergedCopy.restoreEmailPlaceholder}
                  type="email"
                  value={restoreEmail}
                />
              </label>
              <Button
                className="mt-3 h-10 w-full justify-between rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
                disabled={
                  restoreState === "pending" || restoreEmail.trim().length === 0
                }
                onClick={handleRestore}
                type="button"
                variant="outline"
              >
                <span>{mergedCopy.restoreButton}</span>
                <Check className="size-4" />
              </Button>
            </>
          )}
          {restoreState === "success" ? (
            <p className="mt-2 text-sm text-primary" role="status">
              {mergedCopy.restoreSuccessMessage}
            </p>
          ) : null}
          {restoreState === "not_found" ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {mergedCopy.restoreNotFoundMessage}
            </p>
          ) : null}
          {restoreState === "failed" ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {mergedCopy.errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
