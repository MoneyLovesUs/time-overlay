"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "time-overlay-license";
const VALIDATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type ProState =
  | { kind: "free" }
  | {
      kind: "pro";
      licenseKey: string;
      checkedAt: number;
      stale: boolean;
    };

/**
 * Master switch for monetization. While this is `false`, every feature flagged
 * as Pro is fully unlocked for every visitor and no paywall UI is shown.
 *
 * The free/Pro tier split (which features count as Pro) is intentionally kept so a
 * future checkout integration can flip this on without re-designing the gating.
 * No payment provider is wired up right now.
 */
export const PAYWALL_ENABLED = false;

const OPEN_ACCESS_PRO_STATE: ProState = {
  kind: "pro",
  licenseKey: "open-access",
  checkedAt: 0,
  stale: false,
};

type StoredLicense = {
  licenseKey: string;
  checkedAt: number;
};

function readStoredLicense(): StoredLicense | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredLicense;
    if (
      typeof parsed.licenseKey !== "string" ||
      typeof parsed.checkedAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredLicense(license: StoredLicense | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (license === null) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
}

export function resolveProState(stored: StoredLicense | null): ProState {
  if (!stored) {
    return { kind: "free" };
  }

  const age = Date.now() - stored.checkedAt;
  return {
    kind: "pro",
    licenseKey: stored.licenseKey,
    checkedAt: stored.checkedAt,
    stale: age >= VALIDATION_TTL_MS,
  };
}

export function isProActive(state: ProState): boolean {
  return state.kind === "pro";
}

const SERVER_SNAPSHOT: ProState = { kind: "free" };

type Listener = () => void;

const subscribers = new Set<Listener>();

function notify() {
  for (const listener of subscribers) {
    listener();
  }
}

function subscribe(listener: Listener) {
  subscribers.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    subscribers.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

let cachedSnapshot: ProState = SERVER_SNAPSHOT;
let cachedKey = "::initial::";

function snapshotKey(stored: StoredLicense | null): string {
  if (!stored) {
    return "free";
  }
  return `${stored.licenseKey}|${stored.checkedAt}`;
}

function getSnapshot(): ProState {
  const stored = readStoredLicense();
  const key = snapshotKey(stored);
  if (key === cachedKey) {
    return cachedSnapshot;
  }
  cachedKey = key;
  cachedSnapshot = resolveProState(stored);
  return cachedSnapshot;
}

function invalidateSnapshotCache() {
  cachedKey = "::dirty::";
}

function getServerSnapshot(): ProState {
  return SERVER_SNAPSHOT;
}

export function useProState() {
  const storedState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const activate = useCallback((licenseKey: string) => {
    const stored: StoredLicense = { licenseKey, checkedAt: Date.now() };
    writeStoredLicense(stored);
    invalidateSnapshotCache();
    notify();
  }, []);

  const deactivate = useCallback(() => {
    writeStoredLicense(null);
    invalidateSnapshotCache();
    notify();
  }, []);

  if (!PAYWALL_ENABLED) {
    return { state: OPEN_ACCESS_PRO_STATE, activate, deactivate };
  }

  return { state: storedState, activate, deactivate };
}
