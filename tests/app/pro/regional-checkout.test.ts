import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ create: vi.fn(), expire: vi.fn(), price: vi.fn(), product: vi.fn(), coupon: vi.fn() }));
vi.mock("stripe", () => ({ default: class {
  prices = { retrieve: mocks.price };
  products = { retrieve: mocks.product };
  coupons = { retrieve: mocks.coupon };
  checkout = { sessions: { create: mocks.create, expire: mocks.expire } };
} }));
import { GET } from "@/app/api/pro/quote/route";
import { POST } from "@/app/api/pro/checkout/route";
import { checkoutIdempotency, logPricingFailure, requestCountry } from "@/lib/pro/pricing-server";
import { verifyPriceQuote, signPriceQuote } from "@/lib/pro/pricing-quote";
const secret = "q".repeat(64);
function request(path: string, country = "IN", body?: unknown, origin?: string) {
  return new Request("https://timeoverlay.co/api/pro/" + path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "x-vercel-ip-country": country, ...(body === undefined ? {} : {"content-type":"application/json"}),
      ...(origin ? {origin} : {}) },
    ...(body === undefined ? {} : {body: JSON.stringify(body)}),
  });
}
const body = { trigger: "duration", locale: "en", returnPath: "/" };
async function quote(country = "IN") {
  const response = await GET(request("quote",country));
  expect(response.status).toBe(200);
  return response.json();
}
describe("regional quote and checkout boundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("STRIPE_SECRET_KEY","sk_test_unit");
    vi.stubEnv("STRIPE_PRO_PRICE_ID","price_pro");
    vi.stubEnv("PRO_LICENSE_SECRET","license");
    vi.stubEnv("PRO_REGIONAL_PRICING_ENABLED","true");
    vi.stubEnv("PRO_PRICING_QUOTE_SECRET",secret);
    vi.stubEnv("STRIPE_PRO_REGIONAL_COUPON_20","off20");
    vi.stubEnv("STRIPE_PRO_REGIONAL_COUPON_40","off40");
    vi.stubEnv("STRIPE_PRO_REGIONAL_COUPON_60","off60");
    vi.stubEnv("VERCEL","1");
    mocks.price.mockResolvedValue({ id:"price_pro", active:true, livemode:false, currency:"usd", unit_amount:900, type:"one_time", product:"prod_pro" });
    mocks.product.mockResolvedValue({ id:"prod_pro", active:true, livemode:false, metadata:{product:"time-overlay-pro"} });
    mocks.coupon.mockImplementation(async (id, params) => {
      expect(params).toEqual({expand:["applies_to"]});
      const percent_off = Number(id.slice(3));
      return { id, valid:true, livemode:false, percent_off, amount_off:null, duration:"once", max_redemptions:null, redeem_by:null,
        applies_to:{products:["prod_pro"]}, metadata:{product:"time-overlay-pro",purpose:"regional-pricing",policy_version:"regional-v1",
          tier: percent_off === 20 ? "regional_80" : percent_off === 40 ? "regional_60" : "regional_40"} };
    });
    mocks.create.mockImplementation(async (params) => {
      const discount = params.discounts ? Number(params.discounts[0].coupon.slice(3))*9 : 0;
      return { id:"cs_1", url:"https://checkout.stripe.com/c/pay/unit", currency:"usd",livemode:false,
        status:"open", payment_status:"unpaid",amount_subtotal:900,amount_total:900-discount,total_details:{amount_discount:discount,amount_tax:0} };
    });
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); vi.restoreAllMocks(); vi.useRealTimers(); });
  it("logs only whitelisted error fields, not provider response, tokens or secrets", () => {
    logPricingFailure("catalog", { message: "sk_live_private", code: "bad_secret",
      requestId: "req_unit", raw: { secret: "quote_token_private" } });
    expect(console.error).toHaveBeenCalledWith("[pro-pricing]", { stage: "catalog", code: "provider_failure", requestId: "req_unit" });
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain("private");
  });
  it.each([["US",900,undefined],["MY",720,"off20"],["CN",540,"off40"],["IN",360,"off60"]])("quotes %s and creates the exact discounted USD session", async (country, amount, coupon) => {
    const q = await quote(country);
    expect(q.amount).toBe(amount);
    const response = await POST(request("checkout",country,{...body,quoteToken:q.quoteToken,country:"US",amount:1,coupon:"evil"}));
    expect(response.status).toBe(200);
    const params = mocks.create.mock.calls[0][0];
    expect(params.currency).toBe("usd");
    expect(params.adaptive_pricing).toEqual({enabled:false});
    if (coupon) {
      expect(params.discounts).toEqual([{coupon}]);
      expect(params).not.toHaveProperty("allow_promotion_codes");
    } else {
      expect(params.allow_promotion_codes).toBe(true);
      expect(params).not.toHaveProperty("discounts");
    }
    expect(params.metadata.pricing_amount).toBe(String(amount));
    expect(params.line_items).toEqual([{price:"price_pro",quantity:1}]);
  });
  it("is not cached and only reads Vercel geography", async () => {
    const r = await GET(request("quote","CN"));
    expect(r.headers.get("cache-control")).toBe("private, no-store");
    expect(r.headers.get("vercel-cdn-cache-control")).toBe("no-store");
    vi.stubEnv("VERCEL","");
    expect(requestCountry(request("quote","CN"))).toBeNull();
    expect((await quote("CN")).amount).toBe(900);
  });
  it("rejects cross-origin requests before accessing Stripe", async () => {
    expect((await GET(request("quote","IN",undefined,"https://evil.com"))).status).toBe(403);
    expect((await POST(request("checkout","IN",body,"https://evil.com"))).status).toBe(403);
    expect(mocks.price).not.toHaveBeenCalled();
  });
  it("fails closed when enabled config is missing, but preserves standard checkout when disabled", async () => {
    vi.stubEnv("PRO_PRICING_QUOTE_SECRET","");
    expect((await GET(request("quote"))).status).toBe(503);
    expect((await POST(request("checkout","IN",body))).status).toBe(503);
    vi.stubEnv("PRO_REGIONAL_PRICING_ENABLED","false");
    const q = await quote();
    expect(q).toMatchObject({amount:900,quoteToken:null,policyVersion:"standard-v1"});
    expect((await POST(request("checkout","IN",body))).status).toBe(200);
    expect(mocks.price).not.toHaveBeenCalled();
  });
  it("demands a signed quote and reconfirmation after geo/flag/mode/price changes", async () => {
    const q = await quote("IN");
    expect((await POST(request("checkout","IN",body))).status).toBe(409);
    for (const token of [q.quoteToken+"x", signPriceQuote("IN","price_other","test",secret).quoteToken,
      signPriceQuote("IN","price_pro","live",secret).quoteToken]) {
      expect((await POST(request("checkout","IN",{...body,quoteToken:token}))).status).toBe(409);
    }
    expect((await POST(request("checkout","US",{...body,quoteToken:q.quoteToken}))).status).toBe(409);
    vi.stubEnv("PRO_REGIONAL_PRICING_ENABLED","false");
    expect((await POST(request("checkout","IN",{...body,quoteToken:q.quoteToken}))).status).toBe(409);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("expires stale quotes without charging", async () => {
    const q=await quote();
    vi.useFakeTimers();
    vi.setSystemTime(new Date((q.expiresAt+1)*1000));
    const response=await POST(request("checkout","IN",{...body,quoteToken:q.quoteToken}));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({error:"quote_expired"});
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it.each([
    {valid:false}, {livemode:true}, {percent_off:1}, {applies_to:{products:["other"]}},
    {max_redemptions:1}, {metadata:{product:"other"}},
  ])("refuses an invalid coupon instead of falling back to full price: %j", async (change) => {
    const q=await quote();
    const get=mocks.coupon.getMockImplementation()!;
    mocks.coupon.mockImplementation(async (id, params)=>({...await get(id, params),...change}));
    expect((await POST(request("checkout","IN",{...body,quoteToken:q.quoteToken}))).status).toBe(503);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("stops on provider failure and protects return paths", async () => {
    const q=await quote();
    await POST(request("checkout","IN",{...body,returnPath:"/%2F%2Fevil.com",quoteToken:q.quoteToken}));
    expect(mocks.create.mock.calls[0][0].cancel_url).toBe("https://timeoverlay.co/");
    mocks.price.mockRejectedValue(new Error("secret provider details"));
    expect((await GET(request("quote"))).status).toBe(503);
  });
  it("retries the same quote with stable parameters and idempotency, not relative expiry", async () => {
    const q=await quote();
    await POST(request("checkout","IN",{...body,quoteToken:q.quoteToken}));
    await POST(request("checkout","IN",{...body,quoteToken:q.quoteToken}));
    expect(mocks.create.mock.calls[0]).toEqual(mocks.create.mock.calls[1]);
    expect(mocks.create.mock.calls[0][0]).not.toHaveProperty("expires_at");
    const payload=verifyPriceQuote(q.quoteToken,secret).quote!;
    expect(checkoutIdempotency(payload,"https://timeoverlay.co","/","duration","en"))
      .not.toBe(checkoutIdempotency(payload,"https://preview.vercel.app","/","duration","en"));
  });
  it("expires only an open unpaid session when Stripe returns an unexpected amount", async () => {
    const q=await quote();
    mocks.create.mockResolvedValue({id:"cs_bad",url:"https://checkout.stripe.com/c/pay/bad",status:"open",payment_status:"unpaid",amount_total:900});
    expect((await POST(request("checkout","IN",{...body,quoteToken:q.quoteToken}))).status).toBe(502);
    expect(mocks.expire).toHaveBeenCalledWith("cs_bad");
    mocks.expire.mockClear();
    mocks.create.mockResolvedValue({id:"cs_paid",status:"complete",payment_status:"paid"});
    expect((await POST(request("checkout","IN",{...body,quoteToken:q.quoteToken}))).status).toBe(502);
    expect(mocks.expire).not.toHaveBeenCalled();
  });
});

