"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics/events";
import { saveProToken, usePro } from "@/lib/pro/client";
import { sanitizeReturnPath } from "@/lib/pro/return-path";

type VerifyOutcome = "pending" | "verified" | "unpaid" | "error";

export function ProSuccessClient() {
  const { status } = usePro();
  const [outcome, setOutcome] = useState<VerifyOutcome>("pending");
  const [returnPath, setReturnPath] = useState("/");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      // Defer past the synchronous effect body: query params only exist in
      // the browser, and state updates must not run in the effect itself.
      await Promise.resolve();
      if (cancelled) {
        return;
      }
      const params = new URLSearchParams(window.location.search);
      setReturnPath(sanitizeReturnPath(params.get("return")));

      const sessionId = params.get("session_id");
      if (!sessionId) {
        setOutcome("error");
        trackEvent("pro_purchase_verify_failed", { reason: "missing_session" });
        return;
      }

      try {
        const response = await fetch(
          "/api/pro/verify?session_id=" + encodeURIComponent(sessionId),
        );
        if (cancelled) {
          return;
        }
        if (response.status === 402) {
          setOutcome("unpaid");
          trackEvent("pro_purchase_verify_failed", { reason: "unpaid" });
          return;
        }
        if (!response.ok) {
          setOutcome("error");
          trackEvent("pro_purchase_verify_failed", { reason: "verify_failed" });
          return;
        }
        const payload = (await response.json()) as {
          token?: unknown;
          trigger?: unknown;
          pricing?: import("@/lib/pro/regional-pricing").VerifiedPricing;
        };
        if (typeof payload.token !== "string" || !payload.token) {
          setOutcome("error");
          trackEvent("pro_purchase_verify_failed", { reason: "verify_failed" });
          return;
        }
        saveProToken(payload.token);
        if (!cancelled) {
          setOutcome("verified");
        }
        trackEvent("pro_purchase_verified", {
          ...payload.pricing,
          trigger:
            typeof payload.trigger === "string" ? payload.trigger : undefined,
        });
      } catch {
        if (!cancelled) {
          setOutcome("error");
        }
        trackEvent("pro_purchase_verify_failed", { reason: "network" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
      {outcome === "pending" ? <p>Checking your purchase…</p> : null}
      {outcome === "verified" ? (
        <>
          <h1>Pro is unlocked</h1>
          <p>
            Thanks for buying Time Overlay Pro. This browser now has the one-time
            Pro unlock: up to 60 minutes per export, 60 fps, and the 12
            signature templates. If this page did not unlock Pro in the
            generator, use “Restore purchase” with the email you paid with.
          </p>
        </>
      ) : null}
      {outcome === "unpaid" ? (
        <>
          <h1>Payment not completed yet</h1>
          <p>
            Stripe has not marked this checkout as paid. If you already
            completed the payment, wait a moment and reopen the success link
            from the checkout page.
          </p>
        </>
      ) : null}
      {outcome === "error" ? (
        <>
          <h1>We could not verify this purchase</h1>
          <p>
            The verification link looks invalid or expired. You can restore the
            purchase from the generator with the email you paid with — the
            unlock is tied to that purchase.
          </p>
        </>
      ) : null}
      <p>
        <a href={returnPath}>Back to the generator</a>
      </p>
      <p aria-live="polite">
        {status === "pro"
          ? "Pro is enabled in this browser."
          : "Pro is not enabled in this browser yet."}
      </p>
    </main>
  );
}
