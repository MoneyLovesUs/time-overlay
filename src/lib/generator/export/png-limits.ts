import type { ClientDeviceType } from "@/lib/analytics/environment";

/**
 * Frozen thresholds from the 3600s PNG sequence specification. The 600-second
 * value is an interaction threshold, never a product limit: entitlement remains
 * free 300s / Pro 3600s.
 */
export const PNG_LONG_EXPORT_DURATION_SECONDS = 600;
export const PNG_PART_MAX_BYTES = 512 * 1024 * 1024;
export const PNG_PART_MAX_PNG_COUNT = 10_000;
export const PNG_MEMORY_BUDGET_BYTES = 128 * 1024 * 1024;
export const PNG_DESKTOP_HEAVY_PIXEL_FRAMES = 4_000_000_000;
export const PNG_DESKTOP_HEAVY_CANVAS_PIXELS = 4_000_000;
export const PNG_MOBILE_ADVICE_DURATION_SECONDS = 60;
export const PNG_MOBILE_ADVICE_PIXEL_FRAMES = 1_900_000_000;
export const PNG_MOBILE_ADVICE_CANVAS_PIXELS = 1920 * 1080;

export type PngPlatformAdvice = "desktopSafari" | "mobile";

export type PngJobShape = {
  durationSeconds: number;
  fps: number;
  totalFrames: number;
  width: number;
  height: number;
  estimatedArchiveBytes: number | null;
};

export function getPngJobShape(shape: {
  durationSeconds: number;
  fps: number;
  width: number;
  height: number;
  totalFrames?: number;
}): PngJobShape {
  const totalFrames = Math.max(
    1,
    shape.totalFrames ?? Math.round(shape.durationSeconds * shape.fps),
  );
  return {
    durationSeconds: shape.durationSeconds,
    fps: shape.fps,
    totalFrames,
    width: shape.width,
    height: shape.height,
    estimatedArchiveBytes: null,
  };
}

export function isDesktopHeavyPngJob(
  shape: Pick<PngJobShape, "totalFrames" | "width" | "height">,
): boolean {
  const canvasPixels = shape.width * shape.height;
  return (
    canvasPixels * shape.totalFrames >= PNG_DESKTOP_HEAVY_PIXEL_FRAMES ||
    canvasPixels >= PNG_DESKTOP_HEAVY_CANVAS_PIXELS
  );
}

export function isPngLongExport(
  shape: Pick<
    PngJobShape,
    "durationSeconds" | "totalFrames" | "estimatedArchiveBytes"
  >,
): boolean {
  return (
    shape.durationSeconds > PNG_LONG_EXPORT_DURATION_SECONDS ||
    shape.totalFrames > PNG_PART_MAX_PNG_COUNT ||
    (shape.estimatedArchiveBytes !== null &&
      shape.estimatedArchiveBytes > PNG_PART_MAX_BYTES)
  );
}

/**
 * Advises once, from the export click, based on thresholds rather than a
 * browser-name capability claim. A matching advice never disables Export by
 * itself; only a failed local capability probe blocks the safe path.
 */
export function getPngPlatformAdvice({
  shape,
  deviceType,
  browser,
}: {
  shape: PngJobShape;
  deviceType: ClientDeviceType;
  browser: string;
}): PngPlatformAdvice | null {
  if (deviceType === "mobile" || deviceType === "tablet") {
    const canvasPixels = shape.width * shape.height;
    if (
      shape.durationSeconds > PNG_MOBILE_ADVICE_DURATION_SECONDS ||
      canvasPixels > PNG_MOBILE_ADVICE_CANVAS_PIXELS ||
      canvasPixels * shape.totalFrames > PNG_MOBILE_ADVICE_PIXEL_FRAMES
    ) {
      return "mobile";
    }
    return null;
  }

  if (
    browser === "safari" &&
    (isPngLongExport(shape) || isDesktopHeavyPngJob(shape))
  ) {
    return "desktopSafari";
  }

  return null;
}

export function estimatePngArchiveBytes(
  averageFrameBytes: number,
  totalFrames: number,
  helperFilesBytes = 0,
): number {
  const frameEntryBytes = Math.round(averageFrameBytes) + 92 + 24;
  return Math.round(frameEntryBytes * totalFrames + helperFilesBytes + 22);
}

export function estimatePngParts(
  estimatedArchiveBytes: number,
  estimatedEntriesPerPart: number,
): number {
  if (estimatedArchiveBytes <= 0) {
    return 1;
  }
  const byBytes = Math.ceil(estimatedArchiveBytes / PNG_PART_MAX_BYTES);
  const byEntries = Math.ceil(
    Math.max(1, estimatedEntriesPerPart) / PNG_PART_MAX_PNG_COUNT,
  );
  return Math.max(1, byBytes, byEntries);
}

/** Human size for preparation and completion copy. */
export function formatPngBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 MB";
  }
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const digits = value >= 100 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}
