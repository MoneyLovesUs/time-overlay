import { describe, expect, it } from "vitest";

import {
  resolveDurationLimitState,
  type DurationLimitState,
} from "@/lib/generator/duration-limit";

// Replays a sequence of typed values and returns how many times
// duration_limit_hit would fire for a free user.
function countCrossings(values: number[], limitSeconds = 300): number {
  return values.reduce<{ state: DurationLimitState; hits: number }>(
    (acc, requestedSeconds) => {
      const { state, crossedUp } = resolveDurationLimitState(
        acc.state,
        requestedSeconds,
        limitSeconds,
      );
      return { state, hits: acc.hits + (crossedUp ? 1 : 0) };
    },
    { state: { aboveLimit: false }, hits: 0 },
  ).hits;
}

describe("duration limit crossing", () => {
  it("reports once when a single edit crosses the cap", () => {
    expect(countCrossings([300, 301])).toBe(1);
    expect(countCrossings([1800])).toBe(1);
  });

  it("does not report again while the field stays above the cap", () => {
    expect(countCrossings([301, 600, 900, 1800, 3600])).toBe(1);
  });

  it("reports again only after returning to the cap and crossing once more", () => {
    expect(countCrossings([301, 600, 300])).toBe(1);
    expect(countCrossings([301, 600, 300, 900])).toBe(2);
  });

  it("ignores edits at or below the cap", () => {
    expect(countCrossings([60, 120, 300, 0])).toBe(0);
  });

  it("honours a raised cap for Pro users", () => {
    expect(countCrossings([1800, 3600], 3600)).toBe(0);
    expect(countCrossings([3600, 3601], 3600)).toBe(1);
  });
});
