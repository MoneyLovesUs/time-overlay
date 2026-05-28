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
  | "export_completed"
  | "export_failed"
  | "paywall_shown"
  | "checkout_started"
  | "license_activated"
  | "preset_selected";

export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsEventPayload = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

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
