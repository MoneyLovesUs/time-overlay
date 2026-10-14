import type Stripe from "stripe";
import { createHash } from "node:crypto";
import { normalizeCountry, PRICING_POLICY, TIERS, type PricingTier } from "./regional-pricing";
import type { ProStripeConfig } from "./config";
import type { QuotePayload } from "./pricing-quote";

export type RegionalConfig = {
  secret: string;
  mode: "live" | "test";
  coupons: Record<Exclude<PricingTier, "standard">, string>;
};
export function regionalEnabled(env = process.env) {
  return env.PRO_REGIONAL_PRICING_ENABLED === "true";
}
export function regionalConfig(env = process.env): RegionalConfig | null {
  const secret = env.PRO_PRICING_QUOTE_SECRET;
  const key = env.STRIPE_SECRET_KEY ?? "";
  const mode = /^(sk|rk)_live_/.test(key) ? "live" : /^(sk|rk)_test_/.test(key) ? "test" : null;
  const coupons = {
    regional_80: env.STRIPE_PRO_REGIONAL_COUPON_20 ?? "",
    regional_60: env.STRIPE_PRO_REGIONAL_COUPON_40 ?? "",
    regional_40: env.STRIPE_PRO_REGIONAL_COUPON_60 ?? "",
  };
  if (!secret || Buffer.byteLength(secret) < 32 || !mode ||
    Object.values(coupons).some((id) => !id || id.length > 200) ||
    new Set(Object.values(coupons)).size !== 3) return null;
  return { secret, mode, coupons };
}
export function requestCountry(request: Request, env = process.env) {
  // Only use platform geo when actually running behind Vercel. No local override endpoint.
  return env.VERCEL === "1" ? normalizeCountry(request.headers.get("x-vercel-ip-country")) : null;
}
export function allowedOrigin(request: Request, env = process.env) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // Same-origin GET/navigation and server clients often omit Origin.
  const allowed = new Set(["https://timeoverlay.co", "https://www.timeoverlay.co", "https://time-overlay.vercel.app"]);
  for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host) allowed.add("https://" + host);
  }
  if (env.NODE_ENV !== "production") allowed.add(new URL(request.url).origin);
  return allowed.has(origin);
}
export function pricingResponse(data: unknown, status = 200) {
  return Response.json(data, { status, headers: {
    "Cache-Control": "private, no-store", "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
  } });
}
export function logPricingFailure(stage: "catalog" | "checkout", error: unknown) {
  const value = error && typeof error === "object" ? error as Record<string, unknown> : {};
  const known = new Set(["invalid_regional_price", "invalid_regional_product", "invalid_regional_coupon",
    "resource_missing", "api_key_expired", "rate_limit", "idempotency_key_in_use", "parameter_invalid_integer"]);
  const code = [value.code, value.message].find((v) => typeof v === "string" && known.has(v));
  const requestId = typeof value.requestId === "string" && /^req_[A-Za-z0-9]{1,100}$/.test(value.requestId)
    ? value.requestId : undefined;
  // Never serialize Stripe errors: raw response/params may contain private data.
  console.error("[pro-pricing]", { stage, code: code ?? "provider_failure", requestId });
}
export function checkoutIdempotency(quote: QuotePayload, origin: string, returnPath: string, trigger: string, locale: string) {
  return "pro-quote-" + createHash("sha256")
    .update(JSON.stringify([quote.quoteId, origin, returnPath, trigger, locale, quote.mode])).digest("hex");
}
export async function validateRegionalCatalog(base: ProStripeConfig, regional: RegionalConfig) {
  // Deliberately uncached: provider changes fail closed on the next quote/checkout.
  const price = await base.stripe.prices.retrieve(base.priceId, { expand: ["currency_options"] });
  if (price.deleted || !price.active || price.livemode !== (regional.mode === "live") ||
    price.currency !== "usd" || price.unit_amount !== 900 || price.type !== "one_time" ||
    price.tax_behavior === "exclusive" || Object.keys(price.currency_options ?? {}).some((currency) => currency !== "usd")) {
    throw new Error("invalid_regional_price");
  }
  const productId = typeof price.product === "string" ? price.product : price.product.id;
  const product = await base.stripe.products.retrieve(productId);
  if (product.deleted || !product.active || product.metadata.product !== "time-overlay-pro" ||
    product.livemode !== (regional.mode === "live")) throw new Error("invalid_regional_product");
  const coupons = await Promise.all(Object.entries(regional.coupons).map(async ([tier, id]) => {
    const coupon = await base.stripe.coupons.retrieve(id);
    if (!coupon.valid || coupon.livemode !== (regional.mode === "live") ||
      coupon.percent_off !== TIERS[tier as PricingTier].discountPercent || coupon.amount_off !== null ||
      coupon.duration !== "once" || coupon.max_redemptions !== null || coupon.redeem_by !== null ||
      coupon.applies_to?.products?.length !== 1 || coupon.applies_to.products[0] !== productId ||
      coupon.metadata?.product !== "time-overlay-pro" || coupon.metadata?.purpose !== "regional-pricing" ||
      coupon.metadata?.policy_version !== PRICING_POLICY || coupon.metadata?.tier !== tier) {
      throw new Error("invalid_regional_coupon");
    }
    return coupon;
  }));
  return { productId, coupons };
}
export function validRegionalSession(session: Stripe.Checkout.Session, quote: QuotePayload) {
  let stripeUrl = false;
  try { stripeUrl = typeof session.url === "string" && new URL(session.url).protocol === "https:" &&
    new URL(session.url).hostname === "checkout.stripe.com"; } catch { /* invalid provider URL */ }
  return stripeUrl && session.currency === "usd" && session.amount_subtotal === 900 &&
    session.total_details?.amount_discount === 900 - quote.amount &&
    (session.total_details?.amount_tax ?? 0) === 0 && session.amount_total === quote.amount &&
    session.livemode === (quote.mode === "live") && session.payment_status === "unpaid";
}

