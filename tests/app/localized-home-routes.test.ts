import { describe, expect, it, vi, beforeEach } from "vitest";

import Home from "@/app/page";
import LocalizedHomePage, { generateStaticParams } from "@/app/[locale]/page";
import { notFound } from "next/navigation";
import { getRootPageContent } from "@/content/root";
import { RootPage } from "@/components/site/root-page";
import { defaultLocale } from "@/lib/i18n";
import type { RootPageContent } from "@/content/root/types";

const mockContent = {
  metadata: {
    title: "Mocked Title",
    description: "Mock description",
  },
} as RootPageContent;

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("notFound");
  }),
}));

vi.mock("@/content/root", () => ({
  getRootPageContent: vi.fn(async () => mockContent),
}));

describe("localized root routes", () => {
  const mockedGetRootPageContent = vi.mocked(getRootPageContent);
  const mockedNotFound = vi.mocked(notFound);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("statically generates every non-default locale", async () => {
    expect(await generateStaticParams()).toEqual([
      { locale: "es" },
      { locale: "pt" },
      { locale: "ru" },
      { locale: "fr" },
      { locale: "de" },
      { locale: "ko" },
      { locale: "ja" },
      { locale: "fi" },
      { locale: "zh-hant" },
      { locale: "ar" },
      { locale: "th" },
      { locale: "cs" },
      { locale: "hi" },
      { locale: "nl" },
      { locale: "sv" },
    ]);
  });

  it("routes for an unsupported locale hit notFound", async () => {
    await expect(
      LocalizedHomePage({ params: Promise.resolve({ locale: "xx" }) }),
    ).rejects.toThrow("notFound");

    expect(mockedNotFound).toHaveBeenCalledTimes(1);
    expect(mockedGetRootPageContent).not.toHaveBeenCalled();
  });

  it("default locale under the prefixed route hits notFound", async () => {
    await expect(
      LocalizedHomePage({ params: Promise.resolve({ locale: defaultLocale }) }),
    ).rejects.toThrow("notFound");

    expect(mockedNotFound).toHaveBeenCalledTimes(1);
    expect(mockedGetRootPageContent).not.toHaveBeenCalled();
  });

  it("valid locale loads content and delegates to RootPage", async () => {
    const element = await LocalizedHomePage({ params: Promise.resolve({ locale: "es" }) });

    expect(mockedGetRootPageContent).toHaveBeenCalledWith("es");
    expect(mockedNotFound).not.toHaveBeenCalled();
    expect(element.type).toBe(RootPage);
    expect(element.props).toEqual({ locale: "es", content: mockContent });
  });

  it("root route loads the default locale and delegates to RootPage", async () => {
    const element = await Home();

    expect(mockedGetRootPageContent).toHaveBeenCalledWith(defaultLocale);
    expect(element.type).toBe(RootPage);
    expect(element.props).toEqual({ locale: defaultLocale, content: mockContent });
  });
});
