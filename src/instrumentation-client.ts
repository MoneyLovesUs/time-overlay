import posthog from "posthog-js";

import { posthogConfig } from "@/lib/analytics/posthog";

// `instrumentation-client` runs after the HTML document loads but before React
// hydration (Next.js 15.3+ convention). That is the point PostHog recommends
// for initialising the browser SDK so the first pageview is captured.
posthog.init(posthogConfig.key, {
  api_host: posthogConfig.apiHost,
  ui_host: posthogConfig.uiHost,
  // Opt into PostHog's latest recommended defaults: autocapture plus automatic
  // pageview + pageleave tracking via the History API, which covers App Router
  // client-side navigations without any manual route listeners.
  defaults: "2025-05-24",
});
