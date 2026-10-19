import type { ExportQualityPreset } from "@/lib/generator/types";

export const MP4_VIDEO_BITRATE_BY_QUALITY: Record<
  ExportQualityPreset,
  number
> = {
  standard: 4_000_000,
  high: 8_000_000,
};

/**
 * Timer overlays are flat color plus changing digits, so they stay legible at
 * far lower bitrates than camera footage. Long timers scale the bitrate down
 * to these floors instead of growing the file linearly.
 */
export const MP4_MIN_VIDEO_BITRATE_BY_QUALITY: Record<
  ExportQualityPreset,
  number
> = {
  standard: 1_000_000,
  high: 2_000_000,
};

export const MP4_AUDIO_BITRATE = 96_000;

// Durations up to this keep the full bitrate; longer ones hold the 300s file
// size until the bitrate floor is reached.
const MP4_FULL_BITRATE_SECONDS = 300;

/**
 * Largest MP4 the in-memory path may build: a standard-quality 300s export
 * (~154 MB) plus headroom. Above this the worker streams to OPFS instead.
 */
export const MP4_IN_MEMORY_BUDGET_BYTES = 160_000_000;

/** Encode-time guard for phones: 60 minutes at 30 fps. */
export const MP4_MOBILE_MAX_FRAMES = 108_000;

export function resolveMp4VideoBitrate(
  quality: ExportQualityPreset,
  durationSeconds: number,
): number {
  const base = MP4_VIDEO_BITRATE_BY_QUALITY[quality];
  if (durationSeconds <= MP4_FULL_BITRATE_SECONDS) {
    return base;
  }
  return Math.max(
    MP4_MIN_VIDEO_BITRATE_BY_QUALITY[quality],
    Math.round((base * MP4_FULL_BITRATE_SECONDS) / durationSeconds),
  );
}

export function estimateMp4Bytes({
  quality,
  durationSeconds,
  hasAudio,
}: {
  quality: ExportQualityPreset;
  durationSeconds: number;
  hasAudio: boolean;
}): number {
  const bitsPerSecond =
    resolveMp4VideoBitrate(quality, durationSeconds) +
    (hasAudio ? MP4_AUDIO_BITRATE : 0);
  return Math.ceil((bitsPerSecond * durationSeconds) / 8);
}
