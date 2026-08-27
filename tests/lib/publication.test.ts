import { describe, expect, it } from "vitest";

import {
  buildAdsTxtRecord,
  normalizeAdsenseAccount,
  publicationConfig,
} from "@/lib/publication";

describe("publication configuration", () => {
  it("ships the approved public operator details", () => {
    expect(publicationConfig).toMatchObject({
      operatorName: "TimeOverlay",
      authorName: "yansoul",
      contactEmail: "hi@timeoverlay.co",
      jurisdiction: "Hong Kong",
      adsenseAccount: "ca-pub-1565960034992068",
    });
  });

  it("accepts only a public AdSense publisher account id", () => {
    expect(normalizeAdsenseAccount(" ca-pub-1234567890123456 ")).toBe(
      "ca-pub-1234567890123456",
    );
    expect(normalizeAdsenseAccount("pub-1234567890123456")).toBe("");
    expect(normalizeAdsenseAccount("ca-pub-not-a-number")).toBe("");
  });

  it("builds the authorized-seller record Google documents", () => {
    expect(buildAdsTxtRecord("ca-pub-1234567890123456")).toBe(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0",
    );
    expect(buildAdsTxtRecord("invalid")).toBe("");
  });
});
