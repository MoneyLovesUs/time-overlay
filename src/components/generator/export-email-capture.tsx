"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";

import type { ExportCaptureCopy } from "@/content/export-capture";
import { trackEvent } from "@/lib/analytics/events";
import {
  getEmailCaptureServerSnapshot,
  getEmailCaptureSnapshot,
  rememberCapturedEmail,
  subscribeEmailCapture,
} from "@/lib/email-capture";

type SubmitState = "idle" | "pending" | "joined" | "invalid_email" | "error";

/**
 * Lightweight newsletter signup under a finished export. It is an addition to
 * the download confirmation, not a gate: no dialog, no pre-checked consent, and
 * it disappears for good once this browser has joined.
 */
export function ExportEmailCapture({
  copy,
  privacyHref,
}: {
  copy: ExportCaptureCopy;
  privacyHref: string;
}) {
  const ids = useId();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  // Storage is the truth across reloads; `joined` covers this page session, where
  // the snapshot may not have refreshed yet.
  const storedCapture = useSyncExternalStore(
    subscribeEmailCapture,
    getEmailCaptureSnapshot,
    getEmailCaptureServerSnapshot,
  );
  const [joined, setJoined] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "pending") return;
    setState("pending");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          list: "time-overlay-updates",
          placement: "export_complete",
          email,
          company,
        }),
      });
      if (response.ok) {
        rememberCapturedEmail();
        setJoined(true);
        setState("joined");
        trackEvent("email_captured", { placement: "export_complete" });
        return;
      }
      const body = (await response.json().catch(() => null)) as { field?: string } | null;
      setState(body?.field === "email" ? "invalid_email" : "error");
    } catch {
      setState("error");
    }
  }

  if (storedCapture || joined) return null;

  return (
    <div className="mt-3 border border-border/60 bg-background/50 px-4 py-3">
      <p className="text-[12px] font-medium text-foreground">{copy.heading}</p>
      <form onSubmit={handleSubmit} noValidate className="mt-2 flex gap-2">
        <label htmlFor={`${ids}-email`} className="sr-only">
          {copy.heading}
        </label>
        <input
          id={`${ids}-email`}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.emailPlaceholder}
          aria-invalid={state === "invalid_email" || undefined}
          aria-describedby={state === "invalid_email" ? `${ids}-email-error` : undefined}
          className="h-9 min-w-0 flex-1 rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary"
        />
        {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor={`${ids}-company`}>Company</label>
          <input
            id={`${ids}-company`}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={state === "pending"}
          className="inline-flex min-h-9 shrink-0 items-center border border-border/70 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground disabled:opacity-60"
        >
          {state === "pending" ? copy.submitting : copy.submit}
        </button>
      </form>
      {state === "invalid_email" ? (
        <p id={`${ids}-email-error`} role="alert" className="mt-2 text-[11px] text-destructive">
          {copy.errorEmail}
        </p>
      ) : null}
      {state === "error" ? (
        <p role="alert" className="mt-2 text-[11px] text-destructive">
          {copy.errorGeneric}
        </p>
      ) : null}
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
        {copy.privacyNote}{" "}
        <a href={privacyHref} className="underline underline-offset-4 hover:text-foreground">
          {copy.privacyLink}
        </a>
        .
      </p>
    </div>
  );
}
