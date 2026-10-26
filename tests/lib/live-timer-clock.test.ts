import { describe, expect, it } from "vitest";

import {
  computeLiveFrame,
  liveFrameKey,
  type LiveFrame,
} from "@/lib/live/live-timer-clock";
import {
  LIVE_TIMER_MAX_SECONDS,
  type LiveTimerConfig,
  type LiveTimerEndBehavior,
} from "@/lib/live/live-timer-config";

const baseConfig: LiveTimerConfig = {
  mode: "countdown",
  durationSeconds: 300,
  untilEpochMs: null,
  templateId: "center-mono",
  resolutionPresetId: null,
  displayFormat: null,
  anchor: null,
  offsetX: 0,
  offsetY: 0,
  textColor: null,
  fontSize: null,
  background: null,
  endBehavior: "hold",
  message: "LIVE",
  licenseToken: null,
};

function frameAt(
  config: LiveTimerConfig,
  elapsedMs: number,
  baseFormat: "ss" | "mm:ss" | "hh:mm:ss" = "mm:ss",
): LiveFrame {
  return computeLiveFrame(config, baseFormat, {
    nowEpochMs: 1_000_000,
    elapsedMs,
  });
}

function secondsOf(frame: LiveFrame): number | null {
  return frame.kind === "digits" ? frame.seconds : null;
}

describe("computeLiveFrame countdown", () => {
  it("rounds the remaining seconds up for the whole duration", () => {
    expect(secondsOf(frameAt(baseConfig, 0))).toBe(300);
    expect(secondsOf(frameAt(baseConfig, 200))).toBe(300);
    expect(secondsOf(frameAt(baseConfig, 1000))).toBe(299);
    expect(secondsOf(frameAt(baseConfig, 299_500))).toBe(1);
    expect(secondsOf(frameAt(baseConfig, 300_000))).toBe(0);
  });

  it("applies each end behavior at zero", () => {
    const configs: LiveTimerEndBehavior[] = ["hold", "hide", "message"];
    expect(secondsOf(frameAt(baseConfig, 300_000))).toBe(0);

    const hidden = frameAt({ ...baseConfig, endBehavior: configs[1] }, 300_000);
    expect(hidden).toEqual({ kind: "hidden" });

    const message = frameAt({ ...baseConfig, endBehavior: configs[2] }, 300_000);
    expect(message).toEqual({ kind: "message", text: "LIVE" });
  });

  it("restarts a looping countdown with the full duration", () => {
    const looping: LiveTimerConfig = { ...baseConfig, endBehavior: "loop" };

    expect(secondsOf(frameAt(looping, 300_000))).toBe(300);
    expect(secondsOf(frameAt(looping, 300_500))).toBe(300);
  });
});

describe("computeLiveFrame until", () => {
  it("counts down to an absolute time", () => {
    const config: LiveTimerConfig = {
      ...baseConfig,
      mode: "until",
      untilEpochMs: 1_010_000,
    };

    expect(secondsOf(computeLiveFrame(config, "mm:ss", { nowEpochMs: 1_000_000, elapsedMs: 0 }))).toBe(10);
  });

  it("ends immediately when the target has passed", () => {
    const config: LiveTimerConfig = {
      ...baseConfig,
      mode: "until",
      untilEpochMs: 999_000,
      endBehavior: "message",
    };

    expect(
      computeLiveFrame(config, "mm:ss", { nowEpochMs: 1_000_000, elapsedMs: 0 }),
    ).toEqual({ kind: "message", text: "LIVE" });
  });
});

describe("computeLiveFrame countup", () => {
  it("floors elapsed seconds and never ends", () => {
    const config: LiveTimerConfig = { ...baseConfig, mode: "countup" };

    expect(secondsOf(frameAt(config, 59_900))).toBe(59);
    expect(secondsOf(frameAt(config, 1_000_000_000))).toBe(
      LIVE_TIMER_MAX_SECONDS,
    );
  });
});

describe("live display format", () => {
  it("upgrades ss to mm:ss at 100 seconds", () => {
    const config: LiveTimerConfig = {
      ...baseConfig,
      durationSeconds: 99,
    };
    expect(frameAt(config, 0, "ss")).toEqual({
      kind: "digits",
      seconds: 99,
      displayFormat: "ss",
    });

    const longer = { ...config, durationSeconds: 100 };
    expect(frameAt(longer, 0, "ss")).toEqual({
      kind: "digits",
      seconds: 100,
      displayFormat: "mm:ss",
    });
  });

  it("upgrades mm:ss to hh:mm:ss at 100 minutes", () => {
    const config: LiveTimerConfig = {
      ...baseConfig,
      durationSeconds: 5999,
    };
    expect(frameAt(config, 0, "mm:ss")).toMatchObject({
      displayFormat: "mm:ss",
    });

    const longer = { ...config, durationSeconds: 6000 };
    expect(frameAt(longer, 0, "mm:ss")).toMatchObject({
      displayFormat: "hh:mm:ss",
    });
  });

  it("caps an until countdown at 99:59:59", () => {
    const config: LiveTimerConfig = {
      ...baseConfig,
      mode: "until",
      untilEpochMs: 1_000_000 + 200 * 60 * 60 * 1000,
    };

    const frame = computeLiveFrame(config, "hh:mm:ss", {
      nowEpochMs: 1_000_000,
      elapsedMs: 0,
    });
    expect(secondsOf(frame)).toBe(LIVE_TIMER_MAX_SECONDS);
  });
});

describe("liveFrameKey", () => {
  it("stays stable within a second and changes across seconds", () => {
    const a = frameAt(baseConfig, 0);
    const b = frameAt(baseConfig, 200);
    const c = frameAt(baseConfig, 1000);

    expect(liveFrameKey(a)).toBe(liveFrameKey(b));
    expect(liveFrameKey(a)).not.toBe(liveFrameKey(c));
    expect(liveFrameKey({ kind: "hidden" })).toBe("h");
    expect(liveFrameKey({ kind: "message", text: "LIVE" })).toBe("m:LIVE");
  });
});
