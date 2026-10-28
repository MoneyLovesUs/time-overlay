/**
 * Presenter-timer waitlist and the newsletter list: request validation and the
 * PostHog capture payload.
 *
 * Signups are forwarded server-side to PostHog (not via the browser SDK) so that
 * ad blockers — which already drop a share of GA/PostHog client events — cannot
 * silently lose a waitlist entry.
 */

import { PRESENTER_TOPIC_SLUGS } from "@/lib/presenter-topic-slugs";

export const WAITLIST_PLATFORMS = ["windows", "mac", "both"] as const;
export const WAITLIST_USE_CASES = [
  "single-screen-slides",
  "webinar-speaker",
  "client-sessions",
  "teaching",
  "sales-demos",
  "other",
] as const;
export const WAITLIST_PRICES = ["0", "9", "19", "29", "49+"] as const;
// Which landing page the signup came from, so each search topic's conversion
// can be compared. Unknown or missing values fall back to the main page.
export const WAITLIST_SOURCES = ["presenter-timer", ...PRESENTER_TOPIC_SLUGS] as const;
// Which list the email joins. Missing values keep the original presenter-timer
// behaviour so older clients keep working unchanged.
export const WAITLIST_LISTS = ["presenter-timer", "time-overlay-updates"] as const;
export const UPDATES_PLACEMENTS = ["export_complete"] as const;

export type WaitlistPlatform = (typeof WAITLIST_PLATFORMS)[number];
export type WaitlistUseCase = (typeof WAITLIST_USE_CASES)[number];
export type WaitlistPrice = (typeof WAITLIST_PRICES)[number];
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];
export type WaitlistList = (typeof WAITLIST_LISTS)[number];
export type UpdatesPlacement = (typeof UPDATES_PLACEMENTS)[number];

export type PresenterWaitlistSubmission = {
  list: "presenter-timer";
  email: string;
  platform: WaitlistPlatform;
  useCase: WaitlistUseCase;
  price: WaitlistPrice;
  source: WaitlistSource;
  browserDistinctId?: string;
};

export type UpdatesWaitlistSubmission = {
  list: "time-overlay-updates";
  email: string;
  placement: UpdatesPlacement;
  browserDistinctId?: string;
};

export type WaitlistSubmission =
  | PresenterWaitlistSubmission
  | UpdatesWaitlistSubmission;

export type WaitlistParseResult =
  | { kind: "valid"; value: WaitlistSubmission }
  | { kind: "spam" }
  | { kind: "invalid"; field: "email" | "platform" | "useCase" | "price" | "body" };

export const WAITLIST_EVENT = "presenter_timer_waitlist_joined";
export const UPDATES_EVENT = "time_overlay_updates_joined";
export const WAITLIST_MAX_BODY_BYTES = 2_048;

// Deliberately loose: one "@", a dot in the domain, no whitespace. Deliverability
// is proven by the launch email, not by a regex.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

export function parseWaitlistSubmission(body: unknown): WaitlistParseResult {
  if (!body || typeof body !== "object") return { kind: "invalid", field: "body" };
  const input = body as Record<string, unknown>;

  // Honeypot: real visitors never see or fill the "company" field.
  if (typeof input.company === "string" && input.company.trim() !== "") {
    return { kind: "spam" };
  }

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { kind: "invalid", field: "email" };
  }

  const browserDistinctId =
    typeof input.browserDistinctId === "string" && input.browserDistinctId.length <= 200
      ? input.browserDistinctId
      : undefined;

  // A missing `list` must behave exactly like the original presenter form.
  if (input.list === "time-overlay-updates") {
    const placement = isOneOf(UPDATES_PLACEMENTS, input.placement)
      ? input.placement
      : "export_complete";
    return {
      kind: "valid",
      value: { list: "time-overlay-updates", email, placement, browserDistinctId },
    };
  }

  if (!isOneOf(WAITLIST_PLATFORMS, input.platform)) return { kind: "invalid", field: "platform" };
  if (!isOneOf(WAITLIST_USE_CASES, input.useCase)) return { kind: "invalid", field: "useCase" };
  if (!isOneOf(WAITLIST_PRICES, input.price)) return { kind: "invalid", field: "price" };

  const source = isOneOf(WAITLIST_SOURCES, input.source) ? input.source : "presenter-timer";

  return {
    kind: "valid",
    value: {
      list: "presenter-timer",
      email,
      platform: input.platform,
      useCase: input.useCase,
      price: input.price,
      source,
      browserDistinctId,
    },
  };
}

export function buildWaitlistCapture(
  submission: WaitlistSubmission,
  {
    apiKey,
    country,
    joinedAt,
  }: { apiKey: string; country: string | null; joinedAt: string },
) {
  if (submission.list === "time-overlay-updates") {
    return {
      api_key: apiKey,
      event: UPDATES_EVENT,
      distinct_id: submission.email,
      timestamp: joinedAt,
      properties: {
        placement: submission.placement,
        country: country ?? undefined,
        browser_distinct_id: submission.browserDistinctId,
        $set: {
          email: submission.email,
          time_overlay_updates: true,
        },
        $set_once: {
          time_overlay_updates_joined_at: joinedAt,
          time_overlay_updates_placement: submission.placement,
        },
      },
    };
  }

  return {
    api_key: apiKey,
    event: WAITLIST_EVENT,
    distinct_id: submission.email,
    timestamp: joinedAt,
    properties: {
      platform: submission.platform,
      use_case: submission.useCase,
      price_willing_usd: submission.price,
      source: submission.source,
      country: country ?? undefined,
      browser_distinct_id: submission.browserDistinctId,
      $set: {
        email: submission.email,
        presenter_timer_waitlist: true,
        presenter_timer_platform: submission.platform,
        presenter_timer_use_case: submission.useCase,
        presenter_timer_price_willing_usd: submission.price,
      },
      $set_once: {
        presenter_timer_waitlist_joined_at: joinedAt,
        presenter_timer_waitlist_source: submission.source,
      },
    },
  };
}
