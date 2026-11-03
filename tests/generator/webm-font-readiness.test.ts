// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";

const fontState = vi.hoisted(() => ({
  promise: null as Promise<void> | null,
}));
vi.mock("@/lib/generator/export/font-assets", () => ({
  ensurePreviewFontsLoaded: () => fontState.promise ?? Promise.resolve(),
}));

import {
  exportWebmLocally,
  WebmExportError,
} from "@/lib/generator/export/webm";

const stopTrack = vi.fn();

describe("WebM font readiness cleanup", () => {
  beforeEach(() => {
    fontState.promise = null;
    stopTrack.mockReset();
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      {} as unknown as CanvasRenderingContext2D,
    );
    Object.defineProperty(HTMLCanvasElement.prototype, "captureStream", {
      configurable: true,
      value: vi.fn(() => ({ getTracks: () => [{ stop: stopTrack }] })),
    });
    vi.stubGlobal(
      "MediaRecorder",
      class {
        static isTypeSupported() {
          return true;
        }
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const settings = () =>
    createGeneratorSettings({
      timer: { durationSeconds: 3 },
      export: { format: "webm", fps: 30 },
    });

  it("removes listeners and tracks when the font promise rejects", async () => {
    fontState.promise = Promise.reject(new Error("font unavailable"));
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");

    await expect(
      exportWebmLocally(settings(), { onProgress: () => undefined }),
    ).rejects.toMatchObject({ code: "webmUnavailable" });

    const handler = add.mock.calls.find(
      ([type]) => type === "visibilitychange",
    )?.[1];
    expect(handler).toBeDefined();
    expect(remove).toHaveBeenCalledWith("visibilitychange", handler);
    expect(stopTrack).toHaveBeenCalledOnce();
  });

  it("rejects promptly when cancelled while the font promise is unresolved", async () => {
    const deferred = Promise.withResolvers<void>();
    fontState.promise = deferred.promise;
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");
    const external = new AbortController();
    const run = exportWebmLocally(settings(), {
      onProgress: () => undefined,
      signal: external.signal,
    });

    // Let setup reach the font wait, then cancel it.
    await Promise.resolve();
    external.abort(new WebmExportError("exportCancelled", "Export cancelled."));

    await expect(run).rejects.toMatchObject({ code: "exportCancelled" });
    const handler = add.mock.calls.find(
      ([type]) => type === "visibilitychange",
    )?.[1];
    expect(remove).toHaveBeenCalledWith("visibilitychange", handler);
    expect(stopTrack).toHaveBeenCalledOnce();
    deferred.resolve();
  });
});
