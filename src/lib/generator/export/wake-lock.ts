type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
};

type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
};

/**
 * Keeps the screen on while a long export runs: phones suspend the page (and
 * its worker) when the screen locks. Browsers drop the lock whenever the page
 * is hidden, so it is re-requested on return. Returns a release function;
 * unsupported browsers get a no-op.
 */
export function holdScreenWakeLock(): () => void {
  const wakeLock =
    typeof navigator === "undefined"
      ? undefined
      : (navigator as WakeLockNavigator).wakeLock;
  if (!wakeLock || typeof document === "undefined") {
    return () => undefined;
  }

  let sentinel: WakeLockSentinelLike | null = null;
  let active = true;

  const acquire = () => {
    if (!active || document.visibilityState !== "visible") {
      return;
    }
    if (sentinel && !sentinel.released) {
      return;
    }
    wakeLock
      .request("screen")
      .then((next) => {
        if (active) {
          sentinel = next;
        } else {
          void next.release().catch(() => undefined);
        }
      })
      .catch(() => undefined);
  };

  acquire();
  document.addEventListener("visibilitychange", acquire);

  return () => {
    active = false;
    document.removeEventListener("visibilitychange", acquire);
    void sentinel?.release().catch(() => undefined);
    sentinel = null;
  };
}
