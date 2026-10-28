export const PRO_PRICE_LABEL = "$9";
export const FREE_MAX_DURATION_SECONDS = 300;
export const PRO_MAX_DURATION_SECONDS = 3600;
export const PRO_PNG_SEQUENCE_MAX_SECONDS = 600;
export type ProTrigger = "duration" | "fps" | "template" | "direct";

/**
 * Where a paywall impression came from. `auto` is the duration-cap auto-open,
 * `inline` is the small CTA under the duration input, `feature` is any option
 * that is blocked for free users (60 fps, signature export), and the rest name
 * the active sales surface.
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
