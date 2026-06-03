import { describe, expect, it } from "vitest";

import {
  clampFraction,
  computeProgressFraction,
  estimateRemainingMs,
  formatRemaining,
  isActiveExportStage,
  progressPercent,
} from "@/lib/generator/export/progress";

describe("export progress helpers", () => {
  describe("clampFraction", () => {
    it("keeps values within 0..1 and treats non-finite input as 0", () => {
      expect(clampFraction(-0.5)).toBe(0);
      expect(clampFraction(0.42)).toBe(0.42);
      expect(clampFraction(1.7)).toBe(1);
      expect(clampFraction(Number.NaN)).toBe(0);
    });
  });

  describe("computeProgressFraction", () => {
    it("returns the completed/total ratio, guarding against zero totals", () => {
      expect(computeProgressFraction(0, 0)).toBe(0);
      expect(computeProgressFraction(450, 900)).toBe(0.5);
      expect(computeProgressFraction(900, 900)).toBe(1);
      expect(computeProgressFraction(1000, 900)).toBe(1);
    });
  });

  describe("progressPercent", () => {
    it("rounds a fraction to a whole percent", () => {
      expect(progressPercent(0)).toBe(0);
      expect(progressPercent(0.625)).toBe(63);
      expect(progressPercent(1)).toBe(100);
    });
  });

  describe("estimateRemainingMs", () => {
    it("extrapolates remaining time linearly from rendered frames", () => {
      // 2s for 100 of 900 frames -> 20ms/frame -> 800 frames left -> 16000ms
      expect(estimateRemainingMs(2000, 100, 900)).toBe(16000);
    });

    it("returns null when there is not enough signal", () => {
      expect(estimateRemainingMs(0, 100, 900)).toBeNull();
      expect(estimateRemainingMs(2000, 0, 900)).toBeNull();
      expect(estimateRemainingMs(2000, 900, 900)).toBeNull();
      expect(estimateRemainingMs(2000, 1000, 900)).toBeNull();
    });
  });

  describe("formatRemaining", () => {
    it("formats sub-minute durations in seconds", () => {
      expect(formatRemaining(8000)).toBe("8s");
      expect(formatRemaining(500)).toBe("1s");
    });

    it("formats longer durations as minutes and zero-padded seconds", () => {
      expect(formatRemaining(65000)).toBe("1m 05s");
      expect(formatRemaining(125000)).toBe("2m 05s");
    });

    it("returns null for unknown or non-positive durations", () => {
      expect(formatRemaining(null)).toBeNull();
      expect(formatRemaining(0)).toBeNull();
      expect(formatRemaining(-100)).toBeNull();
    });
  });

  describe("isActiveExportStage", () => {
    it("treats working stages as active and terminal stages as inactive", () => {
      expect(isActiveExportStage("validating")).toBe(true);
      expect(isActiveExportStage("rendering-frames")).toBe(true);
      expect(isActiveExportStage("encoding")).toBe(true);
      expect(isActiveExportStage("packaging")).toBe(true);
      expect(isActiveExportStage("idle")).toBe(false);
      expect(isActiveExportStage("complete")).toBe(false);
      expect(isActiveExportStage("error")).toBe(false);
    });
  });
});
