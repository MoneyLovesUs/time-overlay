import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

const stripeMocks = vi.hoisted(() => ({
  create: vi.fn(),
  retrieve: vi.fn(),
  list: vi.fn(),
}));

vi.mock("stripe", () => {
  class StripeMock {
    checkout = {
      sessions: {
        create: stripeMocks.create,
        retrieve: stripeMocks.retrieve,
        list: stripeMocks.list,
      },
    };
  }
  return { default: StripeMock };
});

import { GET } from "@/app/api/pro/verify/route";
import { verifyProToken } from "@/lib/pro/token";

function makeRequest(sessionId?: string): Request {
  const url = new URL("https://timeoverlay.co/api/pro/verify");
  if (sessionId) {
    url.searchParams.set("session_id", sessionId);
  }
  return new Request(url);
}

function paidSessionFixture(overrides: Record<string, unknown> = {}) {
  return {
    id: "cs_unit_paid",
    payment_status: "paid",
    metadata: {
      product: "time-overlay-pro",
      trigger: "template",
      locale: "en",
    },
    customer_details: { email: "unit-buyer@example.com" },
    line_items: { data: [{ price: { id: "price_pro_unit" } }] },
    ...overrides,
  };
}

describe("GET /api/pro/verify", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "unit-test-stripe-key";
    process.env.STRIPE_PRO_PRICE_ID = "price_pro_unit";
    process.env.PRO_LICENSE_SECRET = "unit-test-license-secret";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("issues a signed token with the buyer email for a paid Pro session", async () => {
    stripeMocks.retrieve.mockResolvedValue(paidSessionFixture());

    const response = await GET(makeRequest("cs_unit_paid"));

    assert.equal(response.status, 200);
    const payload = (await response.json()) as {
      token: string;
      email: string;
      trigger: string;
    };
    assert.equal(payload.email, "unit-buyer@example.com");
    assert.equal(payload.trigger, "template");
    const verified = verifyProToken(payload.token, "unit-test-license-secret");
    assert.equal(verified?.sid, "cs_unit_paid");
    assert.equal(typeof verified?.iat, "number");
    assert.equal(
      stripeMocks.retrieve.mock.calls[0][1].expand[0],
      "line_items",
    );
  });

  it.each([900,720,540,360])("unlocks a paid %i-cent order with the original Price ID", async (amount) => {
    stripeMocks.retrieve.mockResolvedValue(paidSessionFixture({ amount_total: amount, currency: "usd",
      metadata: { product: "time-overlay-pro", pricing_policy: "regional-v1", pricing_base_amount: "900",
        pricing_amount: String(amount), pricing_country: "IN",
        pricing_tier: amount === 900 ? "standard" : amount === 720 ? "regional_80" : amount === 540 ? "regional_60" : "regional_40" } }));
    const response = await GET(makeRequest("cs_unit_paid"));
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(verifyProToken(payload.token, "unit-test-license-secret")?.sid, "cs_unit_paid");
    assert.equal(payload.pricing.paid_amount, amount);
  });

  it("returns 402 unpaid when the session is not paid yet", async () => {
    stripeMocks.retrieve.mockResolvedValue(
      paidSessionFixture({ payment_status: "unpaid" }),
    );

    const response = await GET(makeRequest("cs_unit_paid"));

    assert.equal(response.status, 402);
    const payload = (await response.json()) as { error: string };
    assert.deepEqual(payload, { error: "unpaid" });
  });

  it("returns 404 when the session belongs to a different product", async () => {
    stripeMocks.retrieve.mockResolvedValue(
      paidSessionFixture({
        metadata: { product: "creator-pack", trigger: "direct" },
      }),
    );

    const response = await GET(makeRequest("cs_unit_paid"));

    assert.equal(response.status, 404);
  });

  it("returns 404 when the session price is not the Pro price", async () => {
    stripeMocks.retrieve.mockResolvedValue({
      ...paidSessionFixture(),
      line_items: { data: [{ price: { id: "price_other_unit" } }] },
    });

    const response = await GET(makeRequest("cs_unit_paid"));

    assert.equal(response.status, 404);
  });

  it("returns 404 when Stripe does not know the session", async () => {
    stripeMocks.retrieve.mockRejectedValue(new Error("no such session"));

    const response = await GET(makeRequest("cs_missing"));

    assert.equal(response.status, 404);
  });

  it("returns 400 without session_id", async () => {
    const response = await GET(makeRequest());
    assert.equal(response.status, 400);
  });

  it("returns 503 not_configured when a required env var is missing", async () => {
    vi.stubEnv("STRIPE_PRO_PRICE_ID", "");

    const response = await GET(makeRequest("cs_unit_paid"));

    assert.equal(response.status, 503);
    const payload = (await response.json()) as { error: string };
    assert.deepEqual(payload, { error: "not_configured" });
    assert.equal(stripeMocks.retrieve.mock.calls.length, 0);
  });
});
