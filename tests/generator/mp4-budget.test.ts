import { describe, expect, it } from "vitest";

import {
  estimateMp4Bytes,
  MP4_IN_MEMORY_BUDGET_BYTES,
  resolveMp4VideoBitrate,
} from "@/lib/generator/encode/mp4-budget";

describe("resolveMp4VideoBitrate", () => {
  it("keeps the full bitrate up to 300s", () => {
    expect(resolveMp4VideoBitrate("standard", 300)).toBe(4_000_000);
    expect(resolveMp4VideoBitrate("high", 120)).toBe(8_000_000);
  });

  it("holds the 300s file size for longer timers until the floor", () => {
    expect(resolveMp4VideoBitrate("standard", 600)).toBe(2_000_000);
    expect(resolveMp4VideoBitrate("high", 600)).toBe(4_000_000);
  });

  it("never drops below the per-quality floor", () => {
    expect(resolveMp4VideoBitrate("standard", 3600)).toBe(1_000_000);
    expect(resolveMp4VideoBitrate("high", 3600)).toBe(2_000_000);
  });
});

describe("estimateMp4Bytes", () => {
  it("fits a standard 300s export with audio inside the in-memory budget", () => {
    expect(
      estimateMp4Bytes({ quality: "standard", durationSeconds: 300, hasAudio: true }),
    ).toBeLessThanOrEqual(MP4_IN_MEMORY_BUDGET_BYTES);
  });

  it("sizes a standard 60-minute export at the 1 Mbps floor", () => {
    expect(
      estimateMp4Bytes({ quality: "standard", durationSeconds: 3600, hasAudio: false }),
    ).toBe(450_000_000);
  });
});
