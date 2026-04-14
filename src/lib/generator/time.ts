import type { TimerDisplayFormat } from "@/lib/generator/types";

export function getRemainingDurationSeconds(
  durationSeconds: number,
  elapsedSeconds: number,
) {
  return Math.max(0, Math.ceil(durationSeconds - elapsedSeconds));
}

function padTimeUnit(value: number) {
  return value.toString().padStart(2, "0");
}

export function formatCountdownTime(
  totalSeconds: number,
  displayFormat: TimerDisplayFormat,
) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  if (displayFormat === "ss") {
    return padTimeUnit(safeSeconds);
  }

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (displayFormat === "hh:mm:ss") {
    return `${padTimeUnit(hours)}:${padTimeUnit(minutes)}:${padTimeUnit(seconds)}`;
  }

  const totalMinutes = Math.floor(safeSeconds / 60);
  return `${padTimeUnit(totalMinutes)}:${padTimeUnit(seconds)}`;
}
