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

import { POST } from "@/app/api/pro/validate/route";
import { signProToken } from "@/lib/pro/token";

function makeRequest(body: unknown): Request {
  return new Request("https://timeoverlay.co/api/pro/validate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/pro/validate", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "unit-test-stripe-key";
    process.env.STRIPE_PRO_PRICE_ID = "price_pro_unit";
    process.env.PRO_LICENSE_SECRET = "unit-test-license-secret";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("reports valid:true for a correctly signed token", async () => {
    const token = signProToken(
      { sid: "cs_unit_valid", iat: 1760000000 },
      "unit-test-license-secret",
    );

    const response = await POST(makeRequest({ token }));

    assert.equal(response.status, 200);
    const payload = (await response.json()) as { valid: boolean };
    assert.deepEqual(payload, { valid: true });
  });

  it("reports valid:false for a token tampered by one character", async () => {
    const token = signProToken(
      { sid: "cs_unit_valid", iat: 1760000000 },
      "unit-test-license-secret",
    );
    const parts = token.split(".");
    const tamperedSignature =
      (parts[2][0] === "A" ? "B" : "A") + parts[2].slice(1);
    const tampered = [parts[0], parts[1], tamperedSignature].join(".");

    const response = await POST(makeRequest({ token: tampered }));

    assert.equal(response.status, 200);
    const payload = (await response.json()) as { valid: boolean };
    assert.deepEqual(payload, { valid: false });
  });

  it("reports valid:false for a token signed with a different secret", async () => {
    const token = signProToken(
      { sid: "cs_unit_valid", iat: 1760000000 },
      "another-secret",
    );

    const response = await POST(makeRequest({ token }));

    const payload = (await response.json()) as { valid: boolean };
    assert.deepEqual(payload, { valid: false });
  });

  it("reports valid:false when the token is not a string", async () => {
    for (const body of [{}, { token: 42 }, { token: null }]) {
      const response = await POST(makeRequest(body));
      assert.equal(response.status, 200);
      const payload = (await response.json()) as { valid: boolean };
      assert.deepEqual(payload, { valid: false });
    }
  });

  it("returns 503 not_configured when a required env var is missing", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");

    const response = await POST(makeRequest({ token: "v1.abc.def" }));

    assert.equal(response.status, 503);
    const payload = (await response.json()) as { error: string };
    assert.deepEqual(payload, { error: "not_configured" });
  });
});
