/**
 * PostHog client configuration for the Yansoul org → "Time Overlay" project.
 *
 * The project API key (`phc_…`) is a public, client-side write key — it is
 * meant to ship in the browser bundle, mirroring how the GA4 / Clarity / Ahrefs
 * IDs are hardcoded in `app-shell.tsx`. Keeping it here (rather than behind an
 * env var) means analytics keep working on Vercel with no extra env setup.
 */
export const posthogConfig = {
  key: "phc_wNuDkAnGW4zoJvHp4a6i54beVuiqskgnAFhVSLqiCM7G",
  // Ingestion endpoint for the US cloud region.
  apiHost: "https://us.i.posthog.com",
  // App endpoint, used for links surfaced by the SDK (e.g. session replay).
  uiHost: "https://us.posthog.com",
} as const;
