// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import en from "@/content/root/en";
import { getProGateCopy } from "@/content/pro-gate";

// jsdom has no Worker, no MediaRecorder and no canvas codecs, so the real
// capability probes would disable every video format before the gates run.
// Report a capable desktop browser instead; the gate logic under test is
// independent of encoder support.
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

const PRO_STORAGE_KEY = "timeoverlay.pro.v1";

type ShellComponent = typeof import("@/components/generator/generator-shell")["GeneratorShell"];

let root: Root;
let container: HTMLDivElement;
let GeneratorShell: ShellComponent;

/**
 * The Pro store caches its status at module scope, so each case imports a fresh
 * copy of the shell after setting storage.
 */
async function mountShell(pro = false) {
  vi.resetModules();
  if (pro) {
    window.localStorage.setItem(
      PRO_STORAGE_KEY,
      JSON.stringify({ token: "test-token", savedAt: Date.now() }),
    );
  }
  ({ GeneratorShell } = await import("@/components/generator/generator-shell"));

  await act(async () => {
    root.render(
      React.createElement(GeneratorShell, {
        hero: en.generatorHero,
        ui: en.generatorUi,
      }),
    );
  });
}

function labelledSelect(labelText: string) {
  const label = [...container.querySelectorAll("label")].find((item) =>
    item.textContent?.startsWith(labelText),
  );
  return label?.querySelector<HTMLSelectElement>("select") ?? null;
}

function resolutionSelect() {
  return labelledSelect(en.generatorUi.controlPanel.resolutionPresetLabel);
}

function formatRadio(labelText: string) {
  const label = [...container.querySelectorAll("label")].find((item) =>
    item.textContent?.includes(labelText),
  );
  return label?.querySelector<HTMLInputElement>('input[type="radio"]') ?? null;
}

function paywallHeading() {
  return container.querySelector('[role="dialog"] h2')?.textContent ?? null;
}

async function choose(select: HTMLSelectElement, value: string) {
  await act(async () => {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

describe("generator Pro gates", () => {
  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    window.localStorage.clear();
  });

  it("blocks 4K for a free session and opens the resolution paywall", async () => {
    await mountShell();
    await choose(resolutionSelect()!, "landscape-2160");

    expect(paywallHeading()).toBe(getProGateCopy("en").titleResolution);
    // The blocked option is never applied; the canvas stays where it was.
    expect(resolutionSelect()?.value).toBe("landscape-720");
  });

  it("blocks one-file alpha video and opens the format paywall", async () => {
    await mountShell();
    const radio = formatRadio(en.generatorUi.exportPanel.vp9AlphaLabel);

    expect(radio).not.toBeNull();
    await act(async () => radio!.click());

    expect(paywallHeading()).toBe(getProGateCopy("en").titleFormat);
    expect(formatRadio(en.generatorUi.exportPanel.vp9AlphaLabel)?.checked).toBe(
      false,
    );
  });

  it("lets a Pro session pick 4K", async () => {
    await mountShell(true);
    await choose(resolutionSelect()!, "landscape-2160");

    expect(paywallHeading()).toBeNull();
    expect(resolutionSelect()?.value).toBe("landscape-2160");
  });

  it("downgrades a Pro canvas when the entitlement goes away, and says so", async () => {
    await mountShell(true);
    await choose(resolutionSelect()!, "landscape-2160");
    expect(resolutionSelect()?.value).toBe("landscape-2160");

    const { clearProToken } = await import("@/lib/pro/client");
    await act(async () => clearProToken());

    // The canvas is back to its free equivalent, and the export panel explains
    // the downgrade instead of hiding it.
    expect(resolutionSelect()?.value).toBe("landscape-1080");
    expect(container.textContent).toContain(
      getProGateCopy("en").fallbackResolution,
    );
    expect(paywallHeading()).toBeNull();
  });
});
