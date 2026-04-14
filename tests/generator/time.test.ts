import { describe, expect, it } from "vitest";

import {
  formatCountdownTime,
  getRemainingDurationSeconds,
} from "@/lib/generator/time";

describe("getRemainingDurationSeconds", () => {
  it("returns the full duration at the start", () => {
    expect(getRemainingDurationSeconds(30, 0)).toBe(30);
  });

  it("returns the midpoint duration during playback", () => {
    expect(getRemainingDurationSeconds(30, 15)).toBe(15);
  });

  it("never goes below zero after the timer ends", () => {
    expect(getRemainingDurationSeconds(30, 45)).toBe(0);
  });
});

describe("formatCountdownTime", () => {
  it("formats seconds-only countdowns", () => {
    expect(formatCountdownTime(7, "ss")).toBe("07");
  });

  it("formats minute-second countdowns", () => {
    expect(formatCountdownTime(90, "mm:ss")).toBe("01:30");
  });

  it("formats hour-minute-second countdowns", () => {
    expect(formatCountdownTime(3671, "hh:mm:ss")).toBe("01:01:11");
  });
});
