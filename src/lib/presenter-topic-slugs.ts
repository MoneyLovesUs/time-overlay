// Slugs for the /presenter-timer/<slug> search-intent pages. Lives in lib (not
// content) so the sitemap and waitlist validation can import it without pulling
// in page copy.
export const PRESENTER_TOPIC_SLUGS = [
  "microsoft-teams",
  "zoom",
  "google-meet",
  "presenter-view-screen-share",
] as const;

export type PresenterTopicSlug = (typeof PRESENTER_TOPIC_SLUGS)[number];

// Date the topic pages' platform claims were last checked against the cited
// help pages. Used for the sitemap and the pages' dateModified.
export const PRESENTER_TOPICS_REVIEWED_AT = "2026-10-26";
