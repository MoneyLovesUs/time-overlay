"use client";

import { useState } from "react";
import { Check, Clock, Gauge, LayoutTemplate, X } from "lucide-react";

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

const DEFAULT_PAYWALL_COPY: ProPaywallCopy = {
  title: "Unlock Time Overlay Pro",
  benefitDuration: "Timers up to 60 minutes",
  benefitFps: "60 FPS exports",
  benefitTemplates: "12 extra Pro templates",
  priceNote: "$9 one-time payment — not a subscription.",
  unlockButton: "Unlock Pro",
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
  onCheckout: (trigger: ProTrigger) => Promise<CheckoutStartResult>;
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

export function ProPaywallModal({
  open,
  trigger,
  copy,
  onClose,
  onCheckout,
  onRestore,
}: ProPaywallModalProps) {
  const mergedCopy = { ...DEFAULT_PAYWALL_COPY, ...copy };
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "pending" | "unavailable" | "error"
  >("idle");
  const [restoreState, setRestoreState] = useState<
    "idle" | "pending" | RestoreFeedback
  >("idle");
  const [restoreEmail, setRestoreEmail] = useState("");

  if (!open || trigger === null) {
    return null;
  }

  const handleCheckout = () => {
    setCheckoutState("pending");
    onCheckout(trigger).then((result) => {
      // "redirected" navigates away; only the failure modes stay on-page.
      if (result === "unavailable" || result === "error") {
        setCheckoutState(result);
      }
    });
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
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={mergedCopy.title}
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
          {mergedCopy.title}
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
        <p className="mt-3 text-sm font-medium text-foreground">
          {mergedCopy.priceNote}
        </p>

        <Button
          className="mt-4 h-11 w-full rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
          disabled={checkoutState === "pending"}
          onClick={handleCheckout}
          type="button"
        >
          {checkoutState === "pending"
            ? "..."
            : mergedCopy.unlockButton}
        </Button>
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

        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="text-sm font-medium text-foreground">
            {mergedCopy.restoreHeading}
          </p>
          <label className="mt-3 block text-sm text-muted-foreground">
            {mergedCopy.restoreEmailLabel}
            <input
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
