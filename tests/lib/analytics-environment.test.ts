import { describe, expect, it } from "vitest";

import { parseUserAgent } from "@/lib/analytics/environment";

const SAMPLES = {
  desktopChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  iphoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.111 Mobile/15E148 Safari/604.1",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  androidTablet:
    "Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  ipad:
    "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  edge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
  firefox:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
} as const;

describe("parseUserAgent", () => {
  it("identifies desktop Chrome on Windows", () => {
    expect(parseUserAgent(SAMPLES.desktopChrome)).toEqual({
      browser: "chrome",
      browserVersion: "124",
      os: "windows",
      deviceType: "desktop",
    });
  });

  it("identifies desktop Safari on macOS", () => {
    expect(parseUserAgent(SAMPLES.macSafari)).toEqual({
      browser: "safari",
      browserVersion: "17",
      os: "macos",
      deviceType: "desktop",
    });
  });

  it("identifies mobile Safari on iPhone (the cohort most likely to fail WebM export)", () => {
    expect(parseUserAgent(SAMPLES.iphoneSafari)).toMatchObject({
      browser: "safari",
      os: "ios",
      deviceType: "mobile",
    });
  });

  it("distinguishes Chrome-on-iOS from desktop Chrome", () => {
    expect(parseUserAgent(SAMPLES.iphoneChrome)).toMatchObject({
      browser: "chrome-ios",
      os: "ios",
      deviceType: "mobile",
    });
  });

  it("identifies Android Chrome as mobile, not desktop", () => {
    expect(parseUserAgent(SAMPLES.androidChrome)).toMatchObject({
      browser: "chrome",
      os: "android",
      deviceType: "mobile",
    });
  });

  it("treats an Android tablet (no Mobile token) as a tablet", () => {
    expect(parseUserAgent(SAMPLES.androidTablet).deviceType).toBe("tablet");
  });

  it("treats an iPad as a tablet", () => {
    expect(parseUserAgent(SAMPLES.ipad).deviceType).toBe("tablet");
  });

  it("detects Edge before falling through to Chrome", () => {
    expect(parseUserAgent(SAMPLES.edge)).toMatchObject({ browser: "edge", os: "windows" });
  });

  it("detects Firefox", () => {
    expect(parseUserAgent(SAMPLES.firefox)).toMatchObject({
      browser: "firefox",
      browserVersion: "125",
    });
  });

  it("returns a stable unknown profile for an empty user agent", () => {
    expect(parseUserAgent("")).toEqual({
      browser: "unknown",
      browserVersion: "unknown",
      os: "unknown",
      deviceType: "desktop",
    });
  });
});
