import posthog from "posthog-js";

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEventPayload = Record<
  string,
  string | number | boolean | undefined
>;

export type AnalyticsEventName =
  | "export_started"
  | "export_generated"
  | "export_download_requested"
  | "export_completed"
  | "export_failed"
  | "export_cancelled"
  | "export_abandoned"
  | "export_unsupported"
  | "template_gallery_opened"
  | "template_filter_changed"
  | "template_selected"
  | "preset_selected"
  | "pro_price_quoted"
  | "pro_price_quote_failed"
  | "pro_checkout_redirected"
  | "pro_purchase_verified"
  | "pro_purchase_verify_failed"
  | "pro_restore_succeeded"
  | "pro_restore_failed"
  | "live_link_dialog_opened"
  | "live_link_copied"
  | "live_link_preview_opened"
  | "live_link_pro_locked"
  | "duration_limit_hit"
  | "pro_upsell_viewed"
  | "pro_cta_clicked"
  | "pro_page_viewed"
  | "pro_checkout_clicked"
  | "pro_restore_clicked"
  | "pro_feature_used"
  | "presenter_waitlist_submitted"
  | "presenter_waitlist_joined"
  | "presenter_waitlist_failed"
  | "email_captured";

export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsEventPayload = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  // PostHog (initialised in instrumentation-client.ts before hydration).
  // Forwarding the funnel events here lets us analyse them alongside
  // autocaptured pageviews. Every caller fires on a user interaction, which
  // can only happen after init has run — capture() is a noop before init.
  posthog.capture(event, payload);

  const gtag: GtagFn | undefined =
    typeof window.gtag === "function" ? window.gtag : undefined;

  if (gtag) {
    gtag("event", event, payload);
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  window.dataLayer.push({ event, ...payload });
}
