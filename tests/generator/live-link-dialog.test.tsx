// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LiveLinkDialog } from "@/components/generator/live-link-dialog";
import { createGeneratorSettings } from "@/lib/generator/defaults";
import type { GeneratorSettings } from "@/lib/generator/types";

let root: Root;
let container: HTMLDivElement;
const onClose = vi.fn();
const onUnlockPro = vi.fn();
const writeText = vi.fn();

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

async function renderDialog({
  open = true,
  settings = createGeneratorSettings(),
  isPro = false,
  locale = "en",
}: {
  open?: boolean;
  settings?: GeneratorSettings;
  isPro?: boolean;
  locale?: string;
} = {}) {
  await act(async () => {
    root.render(
      <LiveLinkDialog
        open={open}
        settings={settings}
        isPro={isPro}
        locale={locale}
        onClose={onClose}
        onUnlockPro={onUnlockPro}
      />,
    );
  });
}

function button(label: string): HTMLButtonElement {
  const match = [...container.querySelectorAll("button")].find(
    (element) => element.textContent?.trim() === label,
  );
  if (!match) {
    throw new Error(`Button not found: ${label}`);
  }
  return match;
}

function linkInput(): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>("input[readonly]");
  if (!input) {
    throw new Error("Link input not found");
  }
  return input;
}

describe("LiveLinkDialog", () => {
  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    writeText.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("renders nothing while closed", async () => {
    await renderDialog({ open: false });

    expect(container.innerHTML).toBe("");
  });

  it("opens on countdown with the generator duration in the link", async () => {
    await renderDialog({
      settings: createGeneratorSettings({ timer: { durationSeconds: 45 } }),
    });

    expect(linkInput().value).toContain("/live?v=1&mode=countdown&duration=45&");
    expect(container.textContent).toContain("Live timer for OBS");
  });

  it("blocks an until time in the past and disables copy", async () => {
    await renderDialog();

    await act(async () => button("Count down to a time").click());
    const until = container.querySelector<HTMLInputElement>(
      'input[type="datetime-local"]',
    );
    if (!until) {
      throw new Error("Until input not found");
    }
    await act(async () => setInputValue(until, "2020-01-01T00:00"));

    expect(container.textContent).toContain("Pick a time in the future.");
    expect(button("Copy").disabled).toBe(true);
    expect(button("Preview in a new tab").disabled).toBe(true);
  });

  it("resets an ending message to hold when switching to count up", async () => {
    await renderDialog();

    const endSelect = container.querySelector<HTMLSelectElement>("select");
    if (!endSelect) {
      throw new Error("End behavior select not found");
    }
    await act(async () => {
      endSelect.value = "message";
      endSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await act(async () => button("Count up").click());

    expect(new URL(linkInput().value).searchParams.get("end")).toBe("hold");
    expect(new URL(linkInput().value).searchParams.get("message")).toBeNull();
  });

  it("locks a Pro template for a free user and calls onUnlockPro", async () => {
    await renderDialog({
      settings: createGeneratorSettings({
        templateId: "editor-amber-timecode",
      }),
      isPro: false,
    });

    expect(container.textContent).toContain("is a Pro template");
    expect(container.querySelector("input[readonly]")).toBeNull();
    await act(async () => button("Unlock Pro").click());
    expect(onUnlockPro).toHaveBeenCalledTimes(1);
  });

  it("adds the license for a Pro user with a stored token", async () => {
    window.localStorage.setItem(
      "timeoverlay.pro.v1",
      JSON.stringify({ token: "v1.test.token", savedAt: Date.now() }),
    );
    await renderDialog({
      settings: createGeneratorSettings({
        templateId: "editor-amber-timecode",
      }),
      isPro: true,
    });

    expect(linkInput().value).toContain("license=v1.test.token");
  });

  it("uses the Simplified Chinese copy for zh-hans", async () => {
    await renderDialog({ locale: "zh-hans" });

    expect(container.textContent).toContain("OBS 实时计时器");
    expect(container.textContent).toContain("你的链接");
    expect(container.textContent).toContain("复制");
  });

  it("copies the link and shows the copied state", async () => {
    await renderDialog();

    await act(async () => button("Copy").click());

    expect(writeText).toHaveBeenCalledWith(linkInput().value);
    expect(container.textContent).toContain("Copied");
  });
});
