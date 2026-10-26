"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ExternalLink, Lock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLiveLinkCopy } from "@/content/live-link";
import { trackEvent } from "@/lib/analytics/events";
import { getGeneratorTemplateById, isProTemplateId } from "@/lib/generator/templates";
import type { GeneratorSettings } from "@/lib/generator/types";
import {
  buildLiveTimerUrl,
  LIVE_TIMER_MAX_SECONDS,
  liveConfigFromGeneratorSettings,
  type LiveTimerEndBehavior,
  type LiveTimerMode,
} from "@/lib/live/live-timer-config";
import { getStoredProToken } from "@/lib/pro/client";

type LiveLinkDialogProps = {
  open: boolean;
  settings: GeneratorSettings;
  isPro: boolean;
  locale: string;
  onClose: () => void;
  onUnlockPro: () => void;
};

const labelClassName =
  "font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground";

const fieldClassName =
  "mt-2 h-10 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDateTimeLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultUntilValue(): string {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setSeconds(0, 0);
  date.setMinutes(Math.floor(date.getMinutes() / 5) * 5 + 5);
  return formatDateTimeLocal(date);
}

function parseInputNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function LiveLinkDialog(props: LiveLinkDialogProps) {
  if (!props.open) {
    return null;
  }
  return <LiveLinkDialogContent {...props} />;
}

function LiveLinkDialogContent({
  settings,
  isPro,
  locale,
  onClose,
  onUnlockPro,
}: Omit<LiveLinkDialogProps, "open">) {
  const copy = getLiveLinkCopy(locale);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const copyResetRef = useRef<number | null>(null);
  const openedReportedRef = useRef(false);
  const lockReportedRef = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const [mode, setMode] = useState<LiveTimerMode>("countdown");
  const [minutesInput, setMinutesInput] = useState(() =>
    String(Math.floor(settings.timer.durationSeconds / 60)),
  );
  const [secondsInput, setSecondsInput] = useState(() =>
    String(settings.timer.durationSeconds % 60),
  );
  const [untilValue, setUntilValue] = useState(defaultUntilValue);
  const [endBehavior, setEndBehavior] = useState<LiveTimerEndBehavior>("hold");
  const [message, setMessage] = useState("LIVE NOW");
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState(false);
  const [licenseToken] = useState(() => getStoredProToken());

  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );
  const proTemplate = isProTemplateId(settings.templateId);
  const locked = proTemplate && !(isPro && licenseToken !== null);
  const templateName = getGeneratorTemplateById(settings.templateId).name;

  const minutes = parseInputNumber(minutesInput);
  const seconds = parseInputNumber(secondsInput);
  const durationSeconds = minutes * 60 + seconds;
  const durationInvalid =
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    seconds < 0 ||
    seconds > 59 ||
    durationSeconds < 1 ||
    durationSeconds > LIVE_TIMER_MAX_SECONDS;

  const untilMs = untilValue ? new Date(untilValue).getTime() : Number.NaN;
  const nowMs = Date.now();
  const untilPast = !Number.isFinite(untilMs) || untilMs <= nowMs;
  const untilTooFar =
    Number.isFinite(untilMs) && untilMs > nowMs + 99 * 60 * 60 * 1000;
  const untilInvalid = mode === "until" && (untilPast || untilTooFar);

  const disabled =
    (mode === "countdown" && durationInvalid) || untilInvalid || locked;

  const origin =
    typeof window === "undefined"
      ? "https://timeoverlay.co"
      : window.location.origin;
  const link = buildLiveTimerUrl(
    origin,
    liveConfigFromGeneratorSettings(settings, {
      mode,
      durationSeconds,
      untilEpochMs:
        mode === "until" && Number.isFinite(untilMs) ? untilMs : null,
      endBehavior,
      message,
      licenseToken: proTemplate && isPro ? licenseToken : null,
    }),
  );

  const copiedPayload = () => ({
    mode,
    templateId: settings.templateId,
    endBehavior,
    resolution: settings.canvas.resolutionPresetId,
    isPro,
    proTemplate,
  });

  const handleCopy = async () => {
    if (disabled) {
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("clipboard_unavailable");
      }
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setCopyFallback(false);
      if (copyResetRef.current !== null) {
        window.clearTimeout(copyResetRef.current);
      }
      copyResetRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      linkInputRef.current?.select();
      setCopied(false);
      setCopyFallback(true);
    }
    trackEvent("live_link_copied", copiedPayload());
  };

  const handlePreview = () => {
    if (disabled) {
      return;
    }
    const previewUrl = new URL(link);
    previewUrl.searchParams.set("preview", "1");
    window.open(previewUrl.toString(), "_blank", "noopener,noreferrer");
    trackEvent("live_link_preview_opened", {
      mode,
      templateId: settings.templateId,
    });
  };

  useEffect(() => {
    if (openedReportedRef.current) {
      return;
    }
    openedReportedRef.current = true;
    trackEvent("live_link_dialog_opened", {
      templateId: settings.templateId,
      isPro,
    });
  }, [isPro, settings.templateId]);

  useEffect(() => {
    if (!locked || lockReportedRef.current) {
      return;
    }
    lockReportedRef.current = true;
    trackEvent("live_link_pro_locked", { templateId: settings.templateId });
  }, [locked, settings.templateId]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current
      ?.querySelector<HTMLButtonElement>("[data-live-mode]")
      ?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }
      const elements = [
        ...panelRef.current.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input:not(:disabled), select:not(:disabled)",
        ),
      ];
      if (elements.length === 0) {
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (copyResetRef.current !== null) {
        window.clearTimeout(copyResetRef.current);
      }
      previousFocusRef.current?.focus();
    };
  }, []);

  const selectMode = (nextMode: LiveTimerMode) => {
    setMode(nextMode);
    if (nextMode === "until") {
      setUntilValue(defaultUntilValue());
    }
    if (
      nextMode === "countup" ||
      (nextMode !== "countdown" && endBehavior === "loop")
    ) {
      setEndBehavior("hold");
    }
  };

  const modeButtonClass = (active: boolean) =>
    `min-h-10 border px-2 text-xs transition-colors ${
      active
        ? "border-primary/70 bg-primary/10 text-primary"
        : "border-border/80 text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div
      aria-label={copy.title}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
    >
      <div
        className="cyber-panel cyber-chamfer relative max-h-[90vh] w-full max-w-lg overflow-y-auto px-6 py-6"
        ref={panelRef}
      >
        <button
          aria-label={copy.close}
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>

        <p className={`${labelClassName} mt-6`}>{copy.modeLabel}</p>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {(
            [
              ["countdown", copy.modeCountdown],
              ["until", copy.modeUntil],
              ["countup", copy.modeCountup],
            ] as const
          ).map(([value, label]) => (
            <button
              aria-pressed={mode === value}
              className={modeButtonClass(mode === value)}
              data-live-mode="true"
              key={value}
              onClick={() => selectMode(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "countdown" ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block text-xs text-muted-foreground">
              {copy.minutesLabel}
              <input
                className={fieldClassName}
                max={5999}
                min={0}
                onChange={(event) => setMinutesInput(event.target.value)}
                type="number"
                value={minutesInput}
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              {copy.secondsLabel}
              <input
                className={fieldClassName}
                max={59}
                min={0}
                onChange={(event) => setSecondsInput(event.target.value)}
                type="number"
                value={secondsInput}
              />
            </label>
            {durationInvalid ? (
              <p className="col-span-2 mt-2 text-sm text-destructive" role="alert">
                {copy.errorDuration}
              </p>
            ) : null}
          </div>
        ) : null}

        {mode === "until" ? (
          <div className="mt-4">
            <label className="block text-xs text-muted-foreground">
              {copy.untilLabel}
              <input
                className={fieldClassName}
                onChange={(event) => setUntilValue(event.target.value)}
                type="datetime-local"
                value={untilValue}
              />
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              {copy.timeZoneLabel.replace("{zone}", timeZone)}
            </p>
            {untilPast ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {copy.errorUntilPast}
              </p>
            ) : untilTooFar ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {copy.errorUntilTooFar}
              </p>
            ) : null}
          </div>
        ) : null}

        {mode === "countup" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {copy.countupHint}
          </p>
        ) : null}

        {mode === "countup" ? null : (
          <>
            <p className={`${labelClassName} mt-6`}>{copy.endLabel}</p>
            <div className="flex items-start gap-2">
              <select
                className={`${fieldClassName} flex-1`}
                onChange={(event) =>
                  setEndBehavior(event.target.value as LiveTimerEndBehavior)
                }
                value={endBehavior}
              >
                <option value="hold">{copy.endHold}</option>
                <option value="hide">{copy.endHide}</option>
                <option value="message">{copy.endMessage}</option>
                {mode === "countdown" ? (
                  <option value="loop">{copy.endLoop}</option>
                ) : null}
              </select>
              {endBehavior === "message" ? (
                <input
                  className={`${fieldClassName} flex-1`}
                  maxLength={40}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={copy.messagePlaceholder}
                  type="text"
                  value={message}
                />
              ) : null}
            </div>
          </>
        )}

        {locked ? (
          <div className="mt-6 border border-primary/40 bg-primary/5 px-4 py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Lock className="size-4 text-primary" />
              <span>
                {copy.proLockedTitle.replace("{template}", templateName)}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.proLockedBody}
            </p>
            <Button className="mt-3" onClick={onUnlockPro} type="button">
              {copy.proLockedCta}
            </Button>
          </div>
        ) : (
          <>
            <p className={`${labelClassName} mt-6`}>{copy.linkLabel}</p>
            <div className="flex gap-2">
              <input
                className={`${fieldClassName} font-mono text-xs`}
                onFocus={(event) => event.currentTarget.select()}
                readOnly
                ref={linkInputRef}
                type="text"
                value={link}
              />
              <Button
                className="h-10 shrink-0 rounded-none px-4 font-mono text-[11px] uppercase tracking-[0.24em]"
                disabled={disabled}
                onClick={handleCopy}
                type="button"
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <Check className="size-4" />
                    {copy.copied}
                  </span>
                ) : (
                  copy.copy
                )}
              </Button>
            </div>
            {copyFallback ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {copy.copyFallback}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              {copy.styleNote}
            </p>

            <p className={`${labelClassName} mt-6`}>{copy.obsLabel}</p>
            <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>
                <span className="mr-2 font-mono text-tertiary">01</span>
                {copy.obsStep1}
              </li>
              <li>
                <span className="mr-2 font-mono text-tertiary">02</span>
                {copy.obsStep2}
              </li>
              <li>
                <span className="mr-2 font-mono text-tertiary">03</span>
                {copy.obsStep3
                  .split(/(\{w\}|\{h\})/)
                  .map((part, index) => {
                    if (part === "{w}") {
                      return (
                        <span className="font-mono text-foreground" key={index}>
                          {settings.canvas.width}
                        </span>
                      );
                    }
                    if (part === "{h}") {
                      return (
                        <span className="font-mono text-foreground" key={index}>
                          {settings.canvas.height}
                        </span>
                      );
                    }
                    return <span key={index}>{part}</span>;
                  })}
              </li>
              {mode === "until" ? null : (
                <li>
                  <span className="mr-2 font-mono text-tertiary">04</span>
                  {copy.obsStep4}
                </li>
              )}
            </ol>

            <Button
              className="mt-6 h-10 w-full justify-between rounded-none font-mono text-[11px] uppercase tracking-[0.24em]"
              disabled={disabled}
              onClick={handlePreview}
              type="button"
              variant="outline"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="size-4" />
                {copy.preview}
              </span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
