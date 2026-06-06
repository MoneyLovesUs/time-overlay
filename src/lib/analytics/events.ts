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
  | "export_completed"
  | "export_failed"
  | "export_abandoned"
  | "export_unsupported"
  | "preset_selected";

export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsEventPayload = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  // PostHog (initialised in instrumentation-client.ts). Forwarding the funnel
  // events here lets us analyse them alongside autocaptured pageviews. Safe to
  // call before init — posthog-js queues events until it is ready.
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
