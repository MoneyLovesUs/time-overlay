// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { holdScreenWakeLock } from "@/lib/generator/export/wake-lock";

function installWakeLock() {
  const sentinels: { released: boolean; release: ReturnType<typeof vi.fn> }[] = [];
  const request = vi.fn(async () => {
    const sentinel = {
      released: false,
      release: vi.fn(async () => {
        sentinel.released = true;
      }),
    };
    sentinels.push(sentinel);
    return sentinel;
  });
  Object.defineProperty(navigator, "wakeLock", {
    configurable: true,
    value: { request },
  });
  return { request, sentinels };
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "wakeLock");
});

describe("holdScreenWakeLock", () => {
  it("is a no-op where the Wake Lock API is missing", () => {
    expect(() => holdScreenWakeLock()()).not.toThrow();
  });

  it("requests a screen lock and releases it", async () => {
    const { request, sentinels } = installWakeLock();
    const release = holdScreenWakeLock();
    await Promise.resolve();
    expect(request).toHaveBeenCalledWith("screen");
    release();
    expect(sentinels[0].release).toHaveBeenCalled();
  });

  it("re-acquires after the browser drops the lock on a hidden page", async () => {
    const { request, sentinels } = installWakeLock();
    const release = holdScreenWakeLock();
    await Promise.resolve();
    sentinels[0].released = true;
    document.dispatchEvent(new Event("visibilitychange"));
    await Promise.resolve();
    expect(request).toHaveBeenCalledTimes(2);
    release();
  });
});
