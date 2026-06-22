import posthog from "posthog-js";

import { posthogConfig } from "@/lib/analytics/posthog";
import { detectAiReferrerSource } from "@/lib/analytics/ai-referrer";

// `instrumentation-client` runs after the HTML document loads but before React
// hydration (Next.js 15.3+ convention). That is the point PostHog recommends
// for initialising the browser SDK so the first pageview is captured. Wrapped
// in try/catch per the Next.js docs so a tracking failure can never break
// hydration.
try {
  posthog.init(posthogConfig.key, {
    api_host: posthogConfig.apiHost,
    ui_host: posthogConfig.uiHost,
    // Opt into PostHog's latest recommended defaults: autocapture plus automatic
    // pageview + pageleave tracking via the History API, which covers App Router
    // client-side navigations without any manual route listeners.
    defaults: "2025-05-24",
  });

  // Tag sessions that arrived from an AI answer engine so AI citations can be
  // segmented in PostHog. Registered as a super property on every event.
  const aiReferrerSource = detectAiReferrerSource(
    typeof document !== "undefined" ? document.referrer : null,
  );
  if (aiReferrerSource) {
    posthog.register({ ai_referrer_source: aiReferrerSource });
  }
} catch (error) {
  console.error("PostHog init failed:", error);
}
