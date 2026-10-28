import { describe, expect, it } from "vitest";

import type { AnalyticsEventName } from "@/lib/analytics/events";
import {
  createGeneratorSettings,
  getProFeatureUsage,
} from "@/lib/generator/defaults";

// Spec 6.5 #7: every new pro event name must exist in the AnalyticsEventName
// union. A missing name breaks this assignment at compile time.
const spec63EventNames: readonly AnalyticsEventName[] = [
  "duration_limit_hit",
  "pro_upsell_viewed",
  "pro_checkout_clicked",
  "pro_restore_clicked",
  "pro_feature_used",
];

describe("spec 6.3 analytics names", () => {
  it("declares every new event name in AnalyticsEventName", () => {
    expect(spec63EventNames).toHaveLength(5);
  });
});

describe("pro_feature_used detection", () => {
  it("reports every pro feature an export uses", () => {
    const usage = getProFeatureUsage(
      createGeneratorSettings(
        {
          timer: { durationSeconds: 1800 },
          canvas: { resolutionPresetId: "landscape-2160" },
          export: { fps: 60, format: "webm-vp9-alpha" },
          templateId: "editor-amber-timecode",
        },
        { isPro: true },
      ),
    );
    expect(usage).toEqual([
      { feature: "duration", value: 1800 },
      { feature: "fps60", value: 60 },
      { feature: "template", value: "editor-amber-timecode" },
      { feature: "resolution", value: "landscape-2160" },
      { feature: "format", value: "webm-vp9-alpha" },
    ]);
  });

  it("reports nothing for a plain free-tier export", () => {
    const usage = getProFeatureUsage(
      createGeneratorSettings(
        {
          timer: { durationSeconds: 300 },
          export: { fps: 30 },
          templateId: "clean-corner",
        },
        { isPro: false },
      ),
    );
    expect(usage).toEqual([]);
  });
});
