"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics/events";
import { useProState } from "@/lib/license/state";
import { validateLicenseKey } from "@/lib/license/validate";

type ActivationState =
  | { kind: "validating" }
  | { kind: "active" }
  | { kind: "error"; reason: string };

const MISSING_KEY_STATE: ActivationState = {
  kind: "error",
  reason:
    "No license key was found in the URL. If you just completed checkout, refresh this page or contact support.",
};

export function SuccessShell() {
  const searchParams = useSearchParams();
  const licenseKey = searchParams.get("license_key");
  const { activate } = useProState();
  const [state, setState] = useState<ActivationState>(() =>
    licenseKey ? { kind: "validating" } : MISSING_KEY_STATE,
  );

  useEffect(() => {
    if (!licenseKey) {
      return;
    }

    let cancelled = false;
    validateLicenseKey(licenseKey).then((result) => {
      if (cancelled) {
        return;
      }
      if (result.kind === "valid") {
        activate(result.licenseKey);
        trackEvent("license_activated", { source: "success-page" });
        setState({ kind: "active" });
        return;
      }
      setState({ kind: "error", reason: result.reason });
    });

    return () => {
      cancelled = true;
    };
  }, [activate, licenseKey]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-start gap-6 px-6 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-secondary">
        Time Overlay Pro
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {state.kind === "validating"
          ? "Activating your license"
          : state.kind === "active"
            ? "Pro is unlocked on this device"
            : state.kind === "error"
              ? "We could not activate your license"
              : "Preparing activation"}
      </h1>
      {state.kind === "active" ? (
        <p className="leading-7 text-muted-foreground">
          You can close this tab or return to the generator. Pro features are
          unlocked on this browser. You can re-enter your license key on another
          device to activate it there too.
        </p>
      ) : null}
      {state.kind === "error" ? (
        <p className="leading-7 text-destructive">{state.reason}</p>
      ) : null}
      {state.kind === "validating" ? (
        <p className="leading-7 text-muted-foreground">
          Checking your license with Lemon Squeezy. This usually takes a few
          seconds.
        </p>
      ) : null}

      <Link
        href="/"
        className="inline-flex items-center gap-2 border border-primary/60 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary/20"
      >
        Return to the generator
      </Link>
    </main>
  );
}
