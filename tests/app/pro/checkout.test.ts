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

import { POST } from "@/app/api/pro/checkout/route";

const ORIGIN = "https://timeoverlay.co";

function makeRequest(body: unknown): Request {
  return new Request(ORIGIN + "/api/pro/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/pro/checkout", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "unit-test-stripe-key";
    process.env.STRIPE_PRO_PRICE_ID = "price_pro_unit";
    process.env.PRO_LICENSE_SECRET = "unit-test-license-secret";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("creates a payment-mode session for the Pro price and returns its url", async () => {
    stripeMocks.create.mockResolvedValue({
      id: "cs_unit_1",
      url: "https://checkout.stripe.com/c/pay/unit",
    });

    const response = await POST(
      makeRequest({ trigger: "duration", locale: "en", returnPath: "/" }),
    );

    assert.equal(response.status, 200);
    const payload = (await response.json()) as { url: string };
    assert.equal(payload.url, "https://checkout.stripe.com/c/pay/unit");

    assert.equal(stripeMocks.create.mock.calls.length, 1);
    const params = stripeMocks.create.mock.calls[0][0];
    assert.equal(params.mode, "payment");
    assert.deepEqual(params.line_items, [
      { price: "price_pro_unit", quantity: 1 },
    ]);
    assert.equal(params.customer_creation, "always");
    assert.deepEqual(params.payment_intent_data, { description: "Time Overlay Pro (one-time)" });
    assert.equal(params.allow_promotion_codes, true);
    assert.deepEqual(params.metadata, {
      product: "time-overlay-pro",
      trigger: "duration",
      locale: "en",
    });
    assert.equal(
      params.success_url,
      ORIGIN + "/pro/success?session_id={CHECKOUT_SESSION_ID}&return=%2F",
    );
    assert.equal(params.cancel_url, ORIGIN + "/");
  });

  it("rewrites a protocol-relative returnPath to / so checkout cannot redirect off-site", async () => {
    stripeMocks.create.mockResolvedValue({
      id: "cs_unit_2",
      url: "https://checkout.stripe.com/c/pay/unit",
    });

    const response = await POST(
      makeRequest({ trigger: "direct", locale: "en", returnPath: "//evil.com" }),
    );

    assert.equal(response.status, 200);
    const params = stripeMocks.create.mock.calls[0][0];
    assert.equal(
      params.success_url,
      ORIGIN + "/pro/success?session_id={CHECKOUT_SESSION_ID}&return=%2F",
    );
    assert.equal(params.cancel_url, ORIGIN + "/");
  });

  it("resolves the encoded returnPath /%2F%2Fevil.com to / in both checkout urls", async () => {
    stripeMocks.create.mockResolvedValue({
      id: "cs_unit_3",
      url: "https://checkout.stripe.com/c/pay/unit",
    });

    const response = await POST(
      makeRequest({
        trigger: "direct",
        locale: "en",
        returnPath: "/%2F%2Fevil.com",
      }),
    );

    assert.equal(response.status, 200);
    const params = stripeMocks.create.mock.calls[0][0];
    assert.equal(
      params.success_url,
      ORIGIN + "/pro/success?session_id={CHECKOUT_SESSION_ID}&return=%2F",
    );
    assert.equal(params.cancel_url, ORIGIN + "/");
  });

  it("returns 400 without touching Stripe for invalid parameters", async () => {
    for (const body of [
      { trigger: "hacked", locale: "en", returnPath: "/" },
      { locale: "en", returnPath: "/" },
      { trigger: "fps", returnPath: "/" },
      { trigger: "fps", locale: "en" },
      {},
    ]) {
      const response = await POST(makeRequest(body));
      assert.equal(response.status, 400);
    }
    assert.equal(stripeMocks.create.mock.calls.length, 0);
  });

  it("returns 400 for unparseable JSON", async () => {
    const response = await POST(
      new Request(ORIGIN + "/api/pro/checkout", {
        method: "POST",
        body: "not-json",
      }),
    );
    assert.equal(response.status, 400);
  });

  it("returns 503 not_configured when a required env var is missing", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");

    const response = await POST(
      makeRequest({ trigger: "duration", locale: "en", returnPath: "/" }),
    );

    assert.equal(response.status, 503);
    const payload = (await response.json()) as { error: string };
    assert.deepEqual(payload, { error: "not_configured" });
    assert.equal(stripeMocks.create.mock.calls.length, 0);
  });

  it("returns 502 when Stripe checkout creation fails", async () => {
    stripeMocks.create.mockRejectedValue(new Error("stripe unavailable"));

    const response = await POST(
      makeRequest({ trigger: "duration", locale: "en", returnPath: "/" }),
    );

    assert.equal(response.status, 502);
  });
});
