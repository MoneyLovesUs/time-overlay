// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GeneratorShell } from "@/components/generator/generator-shell";
import en from "@/content/root/en";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics/events", () => ({ trackEvent }));

const FULL_SUPPORT = {
  hasWorkerSupport: true,
  supportsPngSequence: true,
  supportsWebm: true,
  supportsWebmAudio: true,
  supportsVp9Alpha: true,
  supportsHevcAlpha: true,
  supportsMp4: true,
  supportsStreamingMp4: false,
};

vi.mock("@/lib/generator/feature-detection", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/generator/feature-detection")>();
  return {
    ...actual,
    getInitialLocalExportSupport: () => FULL_SUPPORT,
    getLocalExportSupport: () => FULL_SUPPORT,
    probeAlphaExportSupport: async () => ({
      supportsVp9Alpha: true,
      supportsHevcAlpha: true,
    }),
    probeMp4ExportSupport: async () => true,
  };
});

let root: Root | null = null;
let container: HTMLDivElement;

function setNumber(input: HTMLInputElement, value: number) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, String(value));
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function durationHits() {
  return trackEvent.mock.calls
    .filter(([name]) => name === "duration_limit_hit")
    .map(([, payload]) => (payload as { requestedSeconds: number }).requestedSeconds);
}

describe("duration_limit_hit crossing", () => {
  beforeEach(async () => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => {
      root?.render(
        <GeneratorShell hero={en.generatorHero} ui={en.generatorUi} />,
      );
    });
  });

  afterEach(async () => {
    await act(async () => root?.unmount());
    root = null;
    container.remove();
    vi.resetAllMocks();
  });

  it("reports one hit per crossing, not one per keystroke", async () => {
    const input = container.querySelector<HTMLInputElement>("input[type=number]");
    expect(input).not.toBeNull();

    for (const value of [320, 600, 900, 1200]) {
      await act(async () => setNumber(input!, value));
    }
    expect(durationHits()).toEqual([320]);

    // Back under the cap, then cross again: one more hit.
    await act(async () => setNumber(input!, 120));
    await act(async () => setNumber(input!, 500));
    expect(durationHits()).toEqual([320, 500]);
  });

  it("does not report while the field stays at or below the cap", async () => {
    const input = container.querySelector<HTMLInputElement>("input[type=number]")!;
    for (const value of [60, 120, 300]) {
      await act(async () => setNumber(input, value));
    }
    expect(durationHits()).toEqual([]);
  });
});
