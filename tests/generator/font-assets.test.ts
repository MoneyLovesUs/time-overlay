// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { ensurePreviewFontsLoaded } from "@/lib/generator/export/font-assets";

describe("ensurePreviewFontsLoaded", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads already-registered faces instead of treating registration as ready", async () => {
    const mono = {
      family: "TimeOverlay Geist Mono",
      load: vi.fn(async () => {
        mono.status = "loaded";
        return mono;
      }),
      status: "unloaded",
    };
    const sans = {
      family: "TimeOverlay Geist Sans",
      load: vi.fn(async () => {
        sans.status = "loaded";
        return sans;
      }),
      status: "unloaded",
    };
    const fonts = Object.assign([mono, sans], {
      add: vi.fn(),
      ready: Promise.resolve(),
    });
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: fonts,
    });
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await ensurePreviewFontsLoaded();

    expect(mono.load).toHaveBeenCalledOnce();
    expect(sans.load).toHaveBeenCalledOnce();
    expect(mono.status).toBe("loaded");
    expect(sans.status).toBe("loaded");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
