// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("posthog-js", () => ({
  default: { capture: vi.fn() },
}));
vi.mock("@/lib/generator/export/font-assets", () => ({
  ensurePreviewFontsLoaded: () => Promise.resolve(),
}));

import { LiveTimerOverlay } from "@/components/live/live-timer-overlay";

let root: Root;
let container: HTMLDivElement;
let rafQueue: FrameRequestCallback[];
let now: number;
let painted: string[];

function installCanvas() {
  const gradient = { addColorStop: () => undefined };
  const context = {
    canvas: null,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    lineWidth: 1,
    font: "",
    fillStyle: "",
    strokeStyle: "",
    shadowBlur: 0,
    shadowColor: "",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    textAlign: "center",
    textBaseline: "middle",
    measureText: (text: string) => ({ width: text.length * 10 }),
    fillText: (text: string) => {
      painted.push(text);
    },
    strokeText: () => undefined,
    clearRect: () => undefined,
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fill: () => undefined,
    stroke: () => undefined,
    beginPath: () => undefined,
    closePath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    arc: () => undefined,
    arcTo: () => undefined,
    quadraticCurveTo: () => undefined,
    save: () => undefined,
    restore: () => undefined,
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => context as unknown as CanvasRenderingContext2D,
  );
}

describe("LiveTimerOverlay clock", () => {
  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    rafQueue = [];
    now = 0;
    painted = [];
    vi.spyOn(performance, "now").mockImplementation(() => now);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      rafQueue.push(callback);
      return rafQueue.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    installCanvas();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("counts down across animation frames instead of resetting its start time", async () => {
    await act(async () => {
      root.render(<LiveTimerOverlay />);
    });
    // Let one-time font readiness settle and schedule the first frame.
    await act(async () => {
      await Promise.resolve();
    });
    expect(rafQueue).toHaveLength(1);

    for (let frame = 1; frame <= 80; frame += 1) {
      now = frame * 16;
      const callback = rafQueue.shift();
      expect(callback).toBeDefined();
      await act(async () => {
        callback?.(now);
        await Promise.resolve();
      });
    }

    expect(painted[0]).toBe("05:00");
    expect(painted).toContain("04:59");
    expect(new Set(painted).size).toBeGreaterThan(1);
  });
});
