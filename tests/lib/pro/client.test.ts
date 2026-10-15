import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("posthog-js", () => ({ default: { capture: vi.fn() } }));

type ClientModule = typeof import("@/lib/pro/client");

const STORAGE_KEY = "timeoverlay.pro.v1";
const DAY_MS = 24 * 60 * 60 * 1000;

class MemoryStorage {
  private entries = new Map<string, string>();

  getItem(key: string): string | null {
    return this.entries.has(key) ? (this.entries.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, String(value));
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }
}

type WindowStub = {
  localStorage: MemoryStorage;
  location: { assign: ReturnType<typeof vi.fn>; search: string };
  addEventListener: ReturnType<typeof vi.fn>;
  dataLayer: unknown[];
};

const originalWindow = (globalThis as { window?: unknown }).window;
const originalFetch = globalThis.fetch;

async function tick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function until(condition: () => boolean): Promise<void> {
  for (let i = 0; i < 100 && !condition(); i += 1) {
    await tick();
  }
}

function HookProbe({ client }: { client: ClientModule }) {
  const { status } = client.usePro();
  return React.createElement("span", null, "status=" + status);
}

describe("pro client", () => {
  let storage: MemoryStorage;
  let windowStub: WindowStub;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    storage = new MemoryStorage();
    windowStub = {
      localStorage: storage,
      location: { assign: vi.fn(), search: "" },
      addEventListener: vi.fn(),
      dataLayer: [],
    };
    fetchMock = vi.fn();
    (globalThis as { window?: unknown }).window = windowStub;
    (globalThis as { fetch?: unknown }).fetch = fetchMock;
  });

  afterEach(() => {
    (globalThis as { window?: unknown }).window = originalWindow;
    (globalThis as { fetch?: unknown }).fetch = originalFetch;
    vi.clearAllMocks();
  });

  async function loadClient(): Promise<ClientModule> {
    vi.resetModules();
    return await import("@/lib/pro/client");
  }

  it("usePro server-renders the unknown status before hydration", async () => {
    const client = await loadClient();

    assert.equal(client.getProStatusServerSnapshot(), "unknown");
    const markup = renderToStaticMarkup(
      React.createElement(HookProbe, { client }),
    );
    assert.match(markup, /status=unknown/);
  });

  it("usePro's client snapshot reads the pro status from localStorage", async () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: "v1.unit.body.sig", savedAt: Date.now() }),
    );
    const client = await loadClient();

    assert.equal(client.getProStatusSnapshot(), "unknown");
    const unsubscribe = client.subscribeProStatus(() => {});
    assert.equal(client.getProStatusSnapshot(), "pro");
    unsubscribe();
  });

  it("reports free when localStorage has no usable token", async () => {
    storage.setItem(STORAGE_KEY, "not-json");
    const client = await loadClient();

    const unsubscribe = client.subscribeProStatus(() => {});
    assert.equal(client.getProStatusSnapshot(), "free");
    unsubscribe();
  });

  it("clears the stored token when the periodic validate reports it invalid", async () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: "v1.old.body.sig",
        savedAt: Date.now() - 8 * DAY_MS,
      }),
    );
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ valid: false }), { status: 200 }),
    );
    const client = await loadClient();

    const unsubscribe = client.subscribeProStatus(() => {});
    await until(() => client.getProStatusSnapshot() === "free");

    assert.equal(client.getProStatusSnapshot(), "free");
    assert.equal(storage.getItem(STORAGE_KEY), null);
    assert.equal(fetchMock.mock.calls[0][0], "/api/pro/validate");
    unsubscribe();
  });

  it("keeps a stored token that still validates", async () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: "v1.ok.body.sig",
        savedAt: Date.now() - 8 * DAY_MS,
      }),
    );
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ valid: true }), { status: 200 }),
    );
    const client = await loadClient();

    const unsubscribe = client.subscribeProStatus(() => {});
    await until(() => fetchMock.mock.calls.length > 0);
    await until(() => {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return false;
      }
      const parsed = JSON.parse(raw) as { savedAt?: number };
      return typeof parsed.savedAt === "number" &&
        parsed.savedAt > Date.now() - 5000;
    });

    assert.equal(client.getProStatusSnapshot(), "pro");
    unsubscribe();
  });

  it("does not call validate when the token was validated recently", async () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: "v1.fresh.body.sig", savedAt: Date.now() }),
    );
    const client = await loadClient();

    const unsubscribe = client.subscribeProStatus(() => {});
    await tick();
    await tick();

    assert.equal(fetchMock.mock.calls.length, 0);
    assert.equal(client.getProStatusSnapshot(), "pro");
    unsubscribe();
  });

  it("startProCheckout redirects to the returned checkout url", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ url: "https://checkout.stripe.com/c/pay/unit" }),
        { status: 200 },
      ),
    );
    const client = await loadClient();

    const result = await client.startProCheckout("duration", "en", "/");

    assert.equal(result, "redirected");
    expect(windowStub.location.assign).toHaveBeenCalledWith(
      "https://checkout.stripe.com/c/pay/unit",
    );
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    assert.deepEqual(JSON.parse(String(init.body)), {
      trigger: "duration",
      locale: "en",
      returnPath: "/",
    });
  });

  it("startProCheckout maps 503 to unavailable and other failures to error", async () => {
    const client = await loadClient();

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "not_configured" }), { status: 503 }),
    );
    assert.equal(await client.startProCheckout("fps", "en", "/"), "unavailable");

    fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
    assert.equal(await client.startProCheckout("fps", "en", "/"), "error");

    fetchMock.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
    assert.equal(await client.startProCheckout("fps", "en", "/"), "error");

    fetchMock.mockRejectedValue(new Error("offline"));
    assert.equal(await client.startProCheckout("fps", "en", "/"), "error");
  });

  it("restorePro stores the restored token", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ token: "v1.restored.body.sig" }), {
        status: 200,
      }),
    );
    const client = await loadClient();

    const result = await client.restorePro("unit-buyer@example.com");

    assert.equal(result, "restored");
    assert.equal(client.getProStatusSnapshot(), "pro");
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    assert.deepEqual(JSON.parse(String(init.body)), {
      email: "unit-buyer@example.com",
    });
  });

  it("restorePro maps 404 to not_found, 503 to unavailable, and failures to error", async () => {
    const client = await loadClient();

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "not_found" }), { status: 404 }),
    );
    assert.equal(
      await client.restorePro("nobody@example.com"),
      "not_found",
    );

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "not_configured" }), { status: 503 }),
    );
    assert.equal(await client.restorePro("nobody@example.com"), "unavailable");

    fetchMock.mockRejectedValue(new Error("offline"));
    assert.equal(await client.restorePro("nobody@example.com"), "error");
  });
  it("fetches an uncached validated quote and excludes its token from analytics", async () => {
    const q = {currency:"usd", baseAmount:900, amount:540, discountPercent:40, tier:"regional_60",
      country:"CN", policyVersion:"regional-v1", expiresAt:Math.floor(Date.now()/1000)+900, quoteToken:"private-quote"};
    fetchMock.mockResolvedValue(new Response(JSON.stringify(q)));
    const client = await loadClient();
    expect(await client.fetchProQuote()).toEqual(q);
    expect(fetchMock.mock.calls[0][1].cache).toBe("no-store");
    expect(JSON.stringify(windowStub.dataLayer)).not.toContain("private-quote");
    expect(windowStub.dataLayer).toContainEqual(expect.objectContaining({event:"pro_price_quoted",quoted_amount:540}));
  });
  it("does not use malformed quotes, and passes signed quotes to checkout without auto-redirecting on 409", async () => {
    const client = await loadClient();
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({amount:1})));
    expect(await client.fetchProQuote()).toBeNull();
    const q = {currency:"usd" as const, baseAmount:900, amount:360, discountPercent:60, tier:"regional_40" as const,
      country:"IN", policyVersion:"regional-v1", expiresAt:1234, quoteToken:"signed"};
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({error:"quote_changed"}),{status:409}));
    expect(await client.startProCheckout("duration","en","/",q)).toBe("quote_changed");
    expect(windowStub.location.assign).not.toHaveBeenCalled();
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).quoteToken).toBe("signed");
  });

});
