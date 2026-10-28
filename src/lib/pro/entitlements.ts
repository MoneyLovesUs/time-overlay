export const PRO_PRICE_LABEL = "$9";
export const FREE_MAX_DURATION_SECONDS = 300;
export const PRO_MAX_DURATION_SECONDS = 3600;
export const PRO_PNG_SEQUENCE_MAX_SECONDS = 600;
export type ProTrigger =
  | "duration"
  | "fps"
  | "template"
  | "resolution"
  | "format"
  | "direct";

/**
 * Where a paywall impression came from. `auto` is the duration-cap auto-open,
 * `inline` is the small CTA under the duration input, `feature` is any option
 * that is blocked for free users (60 fps, 4K, alpha video, signature export),
 * and the rest name the active sales surface.
 */
export const PRO_UPSELL_SOURCES = [
  "auto",
  "inline",
  "header",
  "export_complete",
  "pro_page",
  "feature",
] as const;
export type ProUpsellSource = (typeof PRO_UPSELL_SOURCES)[number];

/**
 * Anything at or above UHD on either axis is Pro-only. A 4K edit is the one
 * thing the free tier cannot work around: a 1080p export would have to be
 * upscaled, which is exactly what a professional user is paying to avoid.
 */
export const PRO_RESOLUTION_MIN_EDGE = 2160;

export function isProResolution(width: number, height: number): boolean {
  return width >= PRO_RESOLUTION_MIN_EDGE || height >= PRO_RESOLUTION_MIN_EDGE;
}

/**
 * Single-file transparent video is Pro-only. PNG sequence stays free so a free
 * user who needs transparency still has a working path (it is also the more
 * editor-compatible route), and MP4/WebM/GIF stay free at every resolution.
 */
export const PRO_ALPHA_VIDEO_FORMATS = [
  "webm-vp9-alpha",
  "mov-hevc-alpha",
] as const;

export function isProFormat(format: string): boolean {
  return (PRO_ALPHA_VIDEO_FORMATS as readonly string[]).includes(format);
}
