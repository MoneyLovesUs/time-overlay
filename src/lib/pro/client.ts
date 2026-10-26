"use client";

import { useSyncExternalStore } from "react";

import { trackEvent } from "@/lib/analytics/events";
import type { ProTrigger } from "@/lib/pro/entitlements";
import { isPriceQuote, quoteAnalytics, type PriceQuote } from "@/lib/pro/regional-pricing";

export type ProStatus = "unknown" | "free" | "pro";

const STORAGE_KEY = "timeoverlay.pro.v1";
const VALIDATE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredProState = {
  token: string;
  savedAt: number;
};

let cachedStatus: ProStatus = "unknown";
let hydrationStarted = false;
let storageListenerBound = false;
const listeners = new Set<() => void>();

function hasLocalStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage?.getItem === "function"
  );
}

function readStoredState(): StoredProState | null {
  if (!hasLocalStorage()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredProState>;
    if (typeof parsed.token !== "string" || !parsed.token) {
      return null;
    }
    return {
      token: parsed.token,
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : 0,
    };
  } catch {
    return null;
  }
}

export function getStoredProToken(): string | null {
  return readStoredState()?.token ?? null;
}

function setStatus(next: ProStatus): void {
  if (cachedStatus === next) {
    return;
  }
  cachedStatus = next;
  for (const listener of listeners) {
    listener();
  }
}

function refreshFromStorage(): void {
  setStatus(readStoredState() ? "pro" : "free");
}

export function saveProToken(token: string): void {
  if (!hasLocalStorage()) {
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ token, savedAt: Date.now() } satisfies StoredProState),
  );
  setStatus("pro");
}

export function clearProToken(): void {
  if (hasLocalStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  setStatus("free");
}

async function validateIfDue(): Promise<void> {
  const stored = readStoredState();
  if (!stored) {
    return;
  }
  if (stored.savedAt > 0 && Date.now() - stored.savedAt < VALIDATE_INTERVAL_MS) {
    return;
  }
  try {
    const response = await fetch("/api/pro/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: stored.token }),
    });
    if (!response.ok) {
      // Transient server trouble: keep the stored token.
      return;
    }
    const payload = (await response.json()) as { valid?: boolean };
    if (payload.valid === true) {
      saveProToken(stored.token);
    } else {
      clearProToken();
    }
  } catch {
    // Network trouble: keep the stored token.
  }
}

function ensureClientSideInit(): void {
  if (hydrationStarted) {
    return;
  }
  hydrationStarted = true;
  refreshFromStorage();
  void validateIfDue();

  if (!storageListenerBound && typeof window !== "undefined") {
    if (typeof window.addEventListener === "function") {
      storageListenerBound = true;
      window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY || event.key === null) {
          refreshFromStorage();
        }
      });
    }
  }
}

/**
 * useSyncExternalStore callbacks, exported for testing the exact functions the
 * hook is composed of (no DOM renderer is available in the test environment).
 */
export function subscribeProStatus(listener: () => void): () => void {
  ensureClientSideInit();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProStatusSnapshot(): ProStatus {
  return cachedStatus;
}

export function getProStatusServerSnapshot(): ProStatus {
  return "unknown";
}

export function usePro(): { status: ProStatus } {
  const status = useSyncExternalStore(
    subscribeProStatus,
    getProStatusSnapshot,
    getProStatusServerSnapshot,
  );
  return { status };
}

export async function fetchProQuote(signal?: AbortSignal): Promise<PriceQuote | null> {
  try {
    const response = await fetch("/api/pro/quote", { cache: "no-store", signal });
    const payload: unknown = await response.json();
    if (!response.ok || !isPriceQuote(payload)) throw new Error("invalid_quote");
    if (!signal?.aborted) trackEvent("pro_price_quoted", quoteAnalytics(payload));
    return payload;
  } catch {
    if (!signal?.aborted) trackEvent("pro_price_quote_failed", { reason: "unavailable" });
    return null;
  }
}

export async function startProCheckout(
  trigger: ProTrigger,
  locale: string,
  returnPath: string,
  quote?: PriceQuote,
): Promise<"redirected" | "unavailable" | "error" | "quote_changed"> {
  if (typeof window === "undefined") {
    return "error";
  }
  try {
    const response = await fetch("/api/pro/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ trigger, locale, returnPath, ...(quote ? { quoteToken: quote.quoteToken } : {}) }),
      cache: "no-store",
    });
    if (response.status === 503) {
      return "unavailable";
    }
    if (response.status === 409) return "quote_changed";
    if (!response.ok) {
      return "error";
    }
    const payload = (await response.json()) as { url?: unknown };
    if (typeof payload.url !== "string" || !payload.url) {
      return "error";
    }
    trackEvent("pro_checkout_redirected", { trigger, ...(quote ? quoteAnalytics(quote) : {}) });
    window.location.assign(payload.url);
    return "redirected";
  } catch {
    return "error";
  }
}

export async function restorePro(
  email: string,
): Promise<"restored" | "not_found" | "unavailable" | "error"> {
  if (typeof window === "undefined") {
    return "error";
  }
  try {
    const response = await fetch("/api/pro/restore", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (response.status === 503) {
      return "unavailable";
    }
    if (response.status === 404) {
      trackEvent("pro_restore_failed", { reason: "not_found" });
      return "not_found";
    }
    if (!response.ok) {
      trackEvent("pro_restore_failed", { reason: "error" });
      return "error";
    }
    const payload = (await response.json()) as { token?: unknown };
    if (typeof payload.token !== "string" || !payload.token) {
      trackEvent("pro_restore_failed", { reason: "error" });
      return "error";
    }
    saveProToken(payload.token);
    trackEvent("pro_restore_succeeded", {});
    return "restored";
  } catch {
    trackEvent("pro_restore_failed", { reason: "error" });
    return "error";
  }
}
