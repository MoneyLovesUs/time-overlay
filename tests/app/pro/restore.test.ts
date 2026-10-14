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

import { POST } from "@/app/api/pro/restore/route";
import { verifyProToken } from "@/lib/pro/token";

function makeRequest(body: unknown): Request {
  return new Request("https://timeoverlay.co/api/pro/restore", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/pro/restore", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "unit-test-stripe-key";
    process.env.STRIPE_PRO_PRICE_ID = "price_pro_unit";
    process.env.PRO_LICENSE_SECRET = "unit-test-license-secret";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("returns a token for a completed paid Pro purchase found by email", async () => {
    stripeMocks.list.mockResolvedValue({
      data: [
        {
          id: "cs_unit_restore",
          payment_status: "paid",
          metadata: { product: "time-overlay-pro" },
        },
      ],
    });

    const response = await POST(makeRequest({ email: "unit-buyer@example.com" }));

    assert.equal(response.status, 200);
    const payload = (await response.json()) as { token: string };
    const verified = verifyProToken(payload.token, "unit-test-license-secret");
    assert.equal(verified?.sid, "cs_unit_restore");
    assert.deepEqual(stripeMocks.list.mock.calls[0][0], {
      customer_details: { email: "unit-buyer@example.com" },
      status: "complete",
      limit: 100,
    });
  });

  it.each([900,720,540,360])("restores a paid %i-cent order without relying on the current pricing policy", async (amount) => {
    stripeMocks.list.mockResolvedValue({ data: [{
      id: "cs_regional_restore", payment_status: "paid", amount_total: amount,
      metadata: { product: "time-overlay-pro", pricing_policy: "old-policy" },
    }] });
    const response = await POST(makeRequest({ email: "unit-buyer@example.com" }));
    assert.equal(response.status, 200);
    assert.equal(verifyProToken((await response.json()).token, "unit-test-license-secret")?.sid, "cs_regional_restore");
  });

  it("returns 404 not_found when no completed purchase matches the email", async () => {
    stripeMocks.list.mockResolvedValue({ data: [] });

    const response = await POST(makeRequest({ email: "nobody@example.com" }));

    assert.equal(response.status, 404);
    const payload = (await response.json()) as { error: string };
    assert.deepEqual(payload, { error: "not_found" });
  });

  it("ignores sessions that are unpaid or for a different product", async () => {
    stripeMocks.list.mockResolvedValue({
      data: [
        {
          id: "cs_unpaid",
          payment_status: "unpaid",
          metadata: { product: "time-overlay-pro" },
        },
        {
          id: "cs_other_product",
          payment_status: "paid",
          metadata: { product: "creator-pack" },
        },
      ],
    });

    const response = await POST(makeRequest({ email: "unit-buyer@example.com" }));

    assert.equal(response.status, 404);
  });

  it("returns 400 for a missing or malformed email", async () => {
    for (const body of [{}, { email: "" }, { email: "not-an-email" }, { email: 42 }]) {
      const response = await POST(makeRequest(body));
      assert.equal(response.status, 400);
    }
    assert.equal(stripeMocks.list.mock.calls.length, 0);
  });

  it("returns 503 not_configured when a required env var is missing", async () => {
    vi.stubEnv("PRO_LICENSE_SECRET", "");

    const response = await POST(makeRequest({ email: "unit-buyer@example.com" }));

    assert.equal(response.status, 503);
    assert.equal(stripeMocks.list.mock.calls.length, 0);
  });

  it("returns 502 when Stripe listing fails", async () => {
    stripeMocks.list.mockRejectedValue(new Error("stripe unavailable"));

    const response = await POST(makeRequest({ email: "unit-buyer@example.com" }));

    assert.equal(response.status, 502);
  });
});
