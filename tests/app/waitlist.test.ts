import assert from "node:assert/strict";
import { afterEach, describe, it, vi } from "vitest";

import { POST } from "@/app/api/waitlist/route";
import { buildSitemapEntries } from "@/lib/site";
import { parseWaitlistSubmission, WAITLIST_EVENT } from "@/lib/waitlist";

const validBody = {
  email: "  Speaker@Example.com ",
  platform: "mac",
  useCase: "webinar-speaker",
  price: "19",
  company: "",
  browserDistinctId: "anon-123",
};

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://timeoverlay.co/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("parseWaitlistSubmission", () => {
  it("normalizes the email and keeps the survey answers", () => {
    const result = parseWaitlistSubmission(validBody);
    assert.equal(result.kind, "valid");
    if (result.kind !== "valid") return;
    assert.equal(result.value.email, "speaker@example.com");
    assert.equal(result.value.platform, "mac");
    assert.equal(result.value.useCase, "webinar-speaker");
    assert.equal(result.value.price, "19");
  });

  it("rejects malformed emails and unknown options", () => {
    assert.deepEqual(parseWaitlistSubmission({ ...validBody, email: "nope" }), { kind: "invalid", field: "email" });
    assert.deepEqual(parseWaitlistSubmission({ ...validBody, platform: "linux" }), { kind: "invalid", field: "platform" });
    assert.deepEqual(parseWaitlistSubmission({ ...validBody, useCase: "x" }), { kind: "invalid", field: "useCase" });
    assert.deepEqual(parseWaitlistSubmission({ ...validBody, price: "5" }), { kind: "invalid", field: "price" });
    assert.deepEqual(parseWaitlistSubmission(null), { kind: "invalid", field: "body" });
  });

  it("flags a filled honeypot as spam", () => {
    assert.deepEqual(parseWaitlistSubmission({ ...validBody, company: "Acme" }), { kind: "spam" });
  });
});

describe("POST /api/waitlist", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("forwards a valid signup to PostHog keyed by email", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest(validBody, { "x-vercel-ip-country": "DE" }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });

    assert.equal(fetchMock.mock.calls.length, 1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    assert.equal(url, "https://us.i.posthog.com/i/v0/e/");
    const capture = JSON.parse(String(init.body));
    assert.equal(capture.event, WAITLIST_EVENT);
    assert.equal(capture.distinct_id, "speaker@example.com");
    assert.equal(capture.properties.country, "DE");
    assert.equal(capture.properties.price_willing_usd, "19");
    assert.equal(capture.properties.$set.email, "speaker@example.com");
    assert.equal(capture.properties.$set.presenter_timer_waitlist, true);
  });

  it("returns 400 with the failing field and does not call PostHog", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({ ...validBody, email: "bad" }));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "invalid_field", field: "email" });
    assert.equal(fetchMock.mock.calls.length, 0);
  });

  it("pretends success for honeypot submissions without storing them", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({ ...validBody, company: "bot" }));
    assert.equal(response.status, 200);
    assert.equal(fetchMock.mock.calls.length, 0);
  });

  it("rejects cross-site and oversized requests", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const crossSite = await POST(makeRequest(validBody, { "sec-fetch-site": "cross-site" }));
    assert.equal(crossSite.status, 403);

    const oversized = await POST(makeRequest(JSON.stringify({ ...validBody, pad: "x".repeat(4_000) })));
    assert.equal(oversized.status, 413);

    const malformed = await POST(makeRequest("{not json"));
    assert.equal(malformed.status, 400);
  });

  it("reports 502 when PostHog is unavailable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 503 })));

    const response = await POST(makeRequest(validBody));
    assert.equal(response.status, 502);
  });
});

describe("presenter timer route", () => {
  it("is listed once in the sitemap without hreflang alternates", () => {
    const entries = buildSitemapEntries().filter((entry) => entry.url.endsWith("/presenter-timer"));
    assert.equal(entries.length, 1);
    assert.equal(entries[0]?.url, "https://timeoverlay.co/presenter-timer");
    assert.equal(entries[0]?.alternates, undefined);
  });
});
