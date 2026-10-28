// @vitest-environment jsdom
import React, { act } from "react";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ExportEmailCapture } from "@/components/generator/export-email-capture";
import { ExportPanel } from "@/components/generator/export-panel";
import { getExportCaptureCopy } from "@/content/export-capture";
import en from "@/content/root/en";
import { enabledLocales } from "@/lib/i18n";
import { EMAIL_CAPTURE_STORAGE_KEY } from "@/lib/email-capture";
import {
  createGeneratorSettings,
  DEFAULT_EXPORT_PROGRESS_STATE,
} from "@/lib/generator/defaults";
import {
  getExportAdvisory,
  getInitialLocalExportSupport,
} from "@/lib/generator/feature-detection";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics/events", () => ({ trackEvent }));

const copy = getExportCaptureCopy("en");

function renderPanel(stage: "idle" | "complete", isPro = false) {
  const settings = createGeneratorSettings();
  const support = getInitialLocalExportSupport();
  return renderToStaticMarkup(
    React.createElement(ExportPanel, {
      settings,
      isPro,
      advisory: getExportAdvisory(settings, support),
      exportProgress:
        stage === "complete"
          ? { stage: "complete" as const, completedFrames: 30, totalFrames: 30, message: "done" }
          : DEFAULT_EXPORT_PROGRESS_STATE,
      isExporting: false,
      onExport: () => {},
      onFormatChange: () => {},
      onFpsChange: () => {},
      onQualityChange: () => {},
      support,
      ui: en.generatorUi.exportPanel,
    }),
  );
}

describe("export panel placement", () => {
  it("offers the email form only after an export finishes, free or Pro", () => {
    expect(renderPanel("idle")).not.toContain(copy.heading);
    expect(renderPanel("complete")).toContain(copy.heading);
    expect(renderPanel("complete", true)).toContain(copy.heading);
  });

  it("links the privacy page for the page locale", () => {
    expect(renderPanel("complete")).toContain('href="/privacy"');
  });
});

let root: Root | null = null;
let container: HTMLDivElement;

function typeInto(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

async function mount() {
  await act(async () => {
    root?.render(
      <ExportEmailCapture copy={copy} privacyHref="/privacy" />,
    );
  });
}

describe("export-complete email capture", () => {
  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root?.unmount());
    root = null;
    container.remove();
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("is translated for every enabled locale", () => {
    for (const locale of enabledLocales) {
      const localized = getExportCaptureCopy(locale);
      expect(localized.heading.length, locale).toBeGreaterThan(0);
      expect(localized.submit.length, locale).toBeGreaterThan(0);
      expect(localized.privacyNote.length, locale).toBeGreaterThan(0);
      expect(localized.privacyLink.length, locale).toBeGreaterThan(0);
    }
    expect(getExportCaptureCopy("zh-hans").heading).toBe("通过邮箱获取新模板和更新");
    expect(getExportCaptureCopy("unknown").heading).toBe(copy.heading);
  });

  it("shows one email field, one button, and no pre-checked consent", async () => {
    await mount();

    const form = container.querySelector("form");
    assert.ok(form);
    expect(container.querySelectorAll('input[type="email"]').length).toBe(1);
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(0);
    expect(container.querySelectorAll("button").length).toBe(1);
    expect(container.textContent).toContain(copy.heading);
    expect(container.textContent).toContain(copy.privacyNote);
    expect(container.querySelector('a[href="/privacy"]')).not.toBeNull();
  });

  it("joins the updates list, reports email_captured, and hides for this browser", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await mount();

    const input = container.querySelector<HTMLInputElement>('input[type="email"]')!;
    await act(async () => {
      typeInto(input, "reader@example.com");
    });
    await act(async () => {
      container
        .querySelector("form")!
        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    assert.equal(fetchMock.mock.calls.length, 1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    assert.equal(url, "/api/waitlist");
    assert.deepEqual(JSON.parse(String(init.body)), {
      list: "time-overlay-updates",
      placement: "export_complete",
      email: "reader@example.com",
      company: "",
    });

    expect(trackEvent).toHaveBeenCalledWith("email_captured", {
      placement: "export_complete",
    });
    expect(window.localStorage.getItem(EMAIL_CAPTURE_STORAGE_KEY)).toBe("1");
    expect(container.querySelector("form")).toBeNull();
  });

  it("stays hidden after a reload once this browser has joined", async () => {
    window.localStorage.setItem(EMAIL_CAPTURE_STORAGE_KEY, "1");
    await mount();

    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).toBe("");
  });

  it("reports an invalid email without hiding the form", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({ error: "invalid_field", field: "email" }, { status: 400 }),
      ),
    );
    await mount();

    const input = container.querySelector<HTMLInputElement>('input[type="email"]')!;
    await act(async () => {
      typeInto(input, "not-an-email");
    });
    await act(async () => {
      container
        .querySelector("form")!
        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain(copy.errorEmail);
    expect(container.querySelector("form")).not.toBeNull();
    expect(window.localStorage.getItem(EMAIL_CAPTURE_STORAGE_KEY)).toBeNull();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("keeps the form usable when storage is blocked", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));
    const getItem = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("storage disabled");
      });
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("storage disabled");
      });

    await mount();
    const input = container.querySelector<HTMLInputElement>('input[type="email"]')!;
    await act(async () => {
      typeInto(input, "reader@example.com");
    });
    await act(async () => {
      container
        .querySelector("form")!
        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(container.querySelector("form")).toBeNull();
    getItem.mockRestore();
    setItem.mockRestore();
  });
});
