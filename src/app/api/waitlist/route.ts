import { posthogConfig } from "@/lib/analytics/posthog";
import { allowedOrigin } from "@/lib/pro/pricing-server";
import {
  buildWaitlistCapture,
  parseWaitlistSubmission,
  WAITLIST_MAX_BODY_BYTES,
} from "@/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function waitlistResponse(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!allowedOrigin(request)) return waitlistResponse({ error: "invalid_origin" }, 403);

  const raw = await request.text();
  if (raw.length > WAITLIST_MAX_BODY_BYTES) return waitlistResponse({ error: "invalid_body" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return waitlistResponse({ error: "invalid_body" }, 400);
  }

  const parsed = parseWaitlistSubmission(body);
  // Bots get the same success response so the honeypot is not revealed.
  if (parsed.kind === "spam") return waitlistResponse({ ok: true });
  if (parsed.kind === "invalid") return waitlistResponse({ error: "invalid_field", field: parsed.field }, 400);

  const capture = buildWaitlistCapture(parsed.value, {
    apiKey: posthogConfig.key,
    country: request.headers.get("x-vercel-ip-country"),
    joinedAt: new Date().toISOString(),
  });

  try {
    const response = await fetch(`${posthogConfig.apiHost}/i/v0/e/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(capture),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`PostHog capture failed: ${response.status}`);
  } catch (error) {
    console.error("[waitlist] capture failed", error instanceof Error ? error.message : error);
    return waitlistResponse({ error: "unavailable" }, 502);
  }

  return waitlistResponse({ ok: true });
}
