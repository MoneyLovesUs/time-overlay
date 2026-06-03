import type { ExportStage } from "@/lib/generator/types";

/**
 * Pure, DOM-free helpers for the export progress UI. Kept separate from the
 * React component so the perceived-wait math (fraction, ETA) can be unit-tested
 * and reused by both the worker-backed and main-thread (WebM) export paths.
 */

export function clampFraction(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}

export function computeProgressFraction(
  completedFrames: number,
  totalFrames: number,
): number {
  if (totalFrames <= 0) {
    return 0;
  }
  return clampFraction(completedFrames / totalFrames);
}

export function progressPercent(fraction: number): number {
  return Math.round(clampFraction(fraction) * 100);
}

/**
 * Linear extrapolation of remaining time from frames rendered so far. Returns
 * null until there is enough signal (at least one frame, some elapsed time, and
 * work still remaining) so the UI can hide the ETA rather than show a wild guess.
 */
export function estimateRemainingMs(
  elapsedMs: number,
  completedFrames: number,
  totalFrames: number,
): number | null {
  if (
    !Number.isFinite(elapsedMs) ||
    elapsedMs <= 0 ||
    completedFrames <= 0 ||
    totalFrames <= completedFrames
  ) {
    return null;
  }
  const msPerFrame = elapsedMs / completedFrames;
  const remaining = msPerFrame * (totalFrames - completedFrames);
  return remaining > 0 ? remaining : null;
}

/**
 * Compact human time, e.g. "8s" or "1m 05s". Returns null for non-positive or
 * unknown inputs so callers can omit the label entirely.
 */
export function formatRemaining(ms: number | null): string | null {
  if (ms === null || !Number.isFinite(ms) || ms <= 0) {
    return null;
  }
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

/**
 * Whether a stage represents active, cancellable work (the bar should animate
 * and the preview should show) versus a terminal/idle state.
 */
export function isActiveExportStage(stage: ExportStage): boolean {
  return (
    stage === "validating" ||
    stage === "rendering-frames" ||
    stage === "encoding" ||
    stage === "packaging"
  );
}
