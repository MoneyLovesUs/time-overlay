import type { TimerDisplayFormat } from "@/lib/generator/types";
import {
  LIVE_TIMER_MAX_SECONDS,
  type LiveTimerConfig,
} from "@/lib/live/live-timer-config";

export type LiveFrame =
  | { kind: "digits"; seconds: number; displayFormat: TimerDisplayFormat }
  | { kind: "message"; text: string }
  | { kind: "hidden" };

function upgradeDisplayFormat(
  baseDisplayFormat: TimerDisplayFormat,
  seconds: number,
): TimerDisplayFormat {
  let displayFormat = baseDisplayFormat;

  if (displayFormat === "ss" && seconds >= 100) {
    displayFormat = "mm:ss";
  }
  if (displayFormat === "mm:ss" && seconds >= 6000) {
    displayFormat = "hh:mm:ss";
  }

  return displayFormat;
}

function digitsFrame(
  seconds: number,
  baseDisplayFormat: TimerDisplayFormat,
): LiveFrame {
  const boundedSeconds = Math.max(
    0,
    Math.min(Math.floor(seconds), LIVE_TIMER_MAX_SECONDS),
  );

  return {
    kind: "digits",
    seconds: boundedSeconds,
    displayFormat: upgradeDisplayFormat(baseDisplayFormat, boundedSeconds),
  };
}

function endedFrame(
  config: LiveTimerConfig,
  baseDisplayFormat: TimerDisplayFormat,
): LiveFrame {
  switch (config.endBehavior) {
    case "hide":
      return { kind: "hidden" };
    case "message":
      return { kind: "message", text: config.message };
    case "hold":
    case "loop":
      return digitsFrame(0, baseDisplayFormat);
  }
}

export function computeLiveFrame(
  config: LiveTimerConfig,
  baseDisplayFormat: TimerDisplayFormat,
  clock: { nowEpochMs: number; elapsedMs: number },
): LiveFrame {
  const elapsedSeconds = Math.max(0, clock.elapsedMs / 1000);

  if (config.mode === "countup") {
    return digitsFrame(elapsedSeconds, baseDisplayFormat);
  }

  if (config.mode === "until") {
    if (config.untilEpochMs === null) {
      return endedFrame(config, baseDisplayFormat);
    }
    const remaining = (config.untilEpochMs - clock.nowEpochMs) / 1000;
    if (remaining <= 0) {
      return endedFrame(config, baseDisplayFormat);
    }
    return digitsFrame(Math.ceil(remaining), baseDisplayFormat);
  }

  const durationSeconds = Math.max(1, config.durationSeconds);
  const effectiveElapsed =
    config.endBehavior === "loop"
      ? elapsedSeconds % durationSeconds
      : elapsedSeconds;
  const remaining = durationSeconds - effectiveElapsed;

  if (remaining <= 0) {
    return endedFrame(config, baseDisplayFormat);
  }

  return digitsFrame(Math.ceil(remaining), baseDisplayFormat);
}

export function liveFrameKey(frame: LiveFrame): string {
  if (frame.kind === "hidden") {
    return "h";
  }
  if (frame.kind === "message") {
    return `m:${frame.text}`;
  }
  return `d:${frame.displayFormat}:${frame.seconds}`;
}
