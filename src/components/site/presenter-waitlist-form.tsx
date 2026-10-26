"use client";

import posthog from "posthog-js";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import type { PresenterTimerContent } from "@/content/presenter-timer";
import { trackEvent } from "@/lib/analytics/events";
import type { WaitlistPlatform, WaitlistPrice, WaitlistUseCase } from "@/lib/waitlist";

type FormCopy = PresenterTimerContent["form"];
type SubmitState = "idle" | "pending" | "joined" | "invalid_email" | "error";

const fieldClassName =
  "mt-2 h-11 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary";

function readBrowserDistinctId(): string | undefined {
  try {
    return posthog.get_distinct_id?.() || undefined;
  } catch {
    return undefined;
  }
}

function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm text-foreground">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex min-h-10 cursor-pointer items-center border border-border/80 bg-background/65 px-3 text-sm text-muted-foreground transition-colors has-[:checked]:border-primary/70 has-[:checked]:bg-primary/10 has-[:checked]:text-primary has-[:focus-visible]:border-tertiary"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function PresenterWaitlistForm({
  copy,
  privacyHref,
}: {
  copy: FormCopy;
  privacyHref: string;
}) {
  const ids = useId();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [platform, setPlatform] = useState<WaitlistPlatform>(copy.platformOptions[0].value);
  const [useCase, setUseCase] = useState<WaitlistUseCase>(copy.useCaseOptions[0].value);
  const [price, setPrice] = useState<WaitlistPrice>(copy.priceOptions[2].value);
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "pending") return;
    setState("pending");
    const payload = { platform, use_case: useCase, price_willing_usd: price };
    trackEvent("presenter_waitlist_submitted", payload);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          platform,
          useCase,
          price,
          company,
          browserDistinctId: readBrowserDistinctId(),
        }),
      });
      if (response.ok) {
        trackEvent("presenter_waitlist_joined", payload);
        setState("joined");
        return;
      }
      const body = (await response.json().catch(() => null)) as { field?: string } | null;
      const nextState = body?.field === "email" ? "invalid_email" : "error";
      trackEvent("presenter_waitlist_failed", { ...payload, reason: body?.field ?? String(response.status) });
      setState(nextState);
    } catch {
      trackEvent("presenter_waitlist_failed", { ...payload, reason: "network" });
      setState("error");
    }
  }

  if (state === "joined") {
    return (
      <div role="status" className="cyber-panel-muted px-6 py-8">
        <p className="text-xl font-semibold text-primary">{copy.successHeading}</p>
        <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="cyber-panel-muted px-5 py-6 sm:px-7 sm:py-8">
      <label htmlFor={`${ids}-email`} className="text-sm text-foreground">
        {copy.emailLabel}
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
        className={fieldClassName}
      />
      {state === "invalid_email" ? (
        <p id={`${ids}-email-error`} role="alert" className="mt-2 text-sm text-destructive">
          {copy.errorEmail}
        </p>
      ) : null}

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

      <ChoiceGroup
        name="platform"
        legend={copy.platformLabel}
        options={copy.platformOptions}
        value={platform}
        onChange={setPlatform}
      />

      <div className="mt-6">
        <label htmlFor={`${ids}-use-case`} className="text-sm text-foreground">
          {copy.useCaseLabel}
        </label>
        <select
          id={`${ids}-use-case`}
          name="useCase"
          value={useCase}
          onChange={(event) => setUseCase(event.target.value as WaitlistUseCase)}
          className={fieldClassName}
        >
          {copy.useCaseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ChoiceGroup
        name="price"
        legend={copy.priceLabel}
        options={copy.priceOptions}
        value={price}
        onChange={setPrice}
      />

      <Button
        type="submit"
        disabled={state === "pending"}
        className="mt-8 h-11 w-full rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
      >
        {state === "pending" ? copy.submittingLabel : copy.submitLabel}
      </Button>
      {state === "error" ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {copy.errorGeneric}
        </p>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {copy.privacyNote}{" "}
        <a href={privacyHref} className="underline underline-offset-4 hover:text-foreground">
          {copy.privacyLinkLabel}
        </a>
        .
      </p>
    </form>
  );
}
