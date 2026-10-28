import { createProStripeConfig, PRO_PRODUCT } from "@/lib/pro/config";
import type { ProTrigger } from "@/lib/pro/entitlements";
import { sanitizeReturnPath } from "@/lib/pro/return-path";
import { verifyPriceQuote, type QuotePayload } from "@/lib/pro/pricing-quote";
import { allowedOrigin, logPricingFailure, checkoutIdempotency, pricingResponse, regionalConfig, regionalEnabled,
  requestCountry, validateRegionalCatalog, validRegionalSession } from "@/lib/pro/pricing-server";
import type Stripe from "stripe";

const PRO_TRIGGERS: readonly ProTrigger[] = ["duration", "fps", "template", "resolution", "format", "direct"];
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  if (!allowedOrigin(request)) return pricingResponse({ error: "invalid_origin" }, 403);
  const config = createProStripeConfig();
  if (!config) return pricingResponse({ error: "not_configured" }, 503);
  let body: unknown;
  try { body = await request.json(); } catch {
    return pricingResponse({ error: "invalid_request" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return pricingResponse({ error: "invalid_request" }, 400);
  const input = body as Record<string, unknown>;
  const { trigger, locale, returnPath } = input;
  if (typeof trigger !== "string" || !PRO_TRIGGERS.includes(trigger as ProTrigger) ||
    typeof locale !== "string" || !locale || locale.length > 32 ||
    typeof returnPath !== "string" || !returnPath || returnPath.length > 2048) {
    return pricingResponse({ error: "invalid_request" }, 400);
  }
  const enabled = regionalEnabled();
  let quote: QuotePayload | null = null;
  let couponId: string | undefined;
  if (enabled) {
    const regional = regionalConfig();
    if (!regional) return pricingResponse({ error: "pricing_unavailable" }, 503);
    if (!input.quoteToken) return pricingResponse({ error: "quote_required" }, 409);
    const verified = verifyPriceQuote(input.quoteToken, regional.secret);
    if (!verified.quote) return pricingResponse({ error: verified.error }, 409);
    quote = verified.quote;
    if (quote.priceId !== config.priceId || quote.mode !== regional.mode || quote.country !== requestCountry(request)) {
      return pricingResponse({ error: "quote_changed" }, 409);
    }
    try { await validateRegionalCatalog(config, regional); } catch (error) {
      logPricingFailure("catalog", error);
      return pricingResponse({ error: "pricing_unavailable" }, 503);
    }
    couponId = quote.tier === "standard" ? undefined : regional.coupons[quote.tier];
  } else if (input.quoteToken !== undefined && input.quoteToken !== null) {
    return pricingResponse({ error: "quote_changed" }, 409);
  }

  const safeReturnPath = sanitizeReturnPath(returnPath);
  const origin = new URL(request.url).origin;
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [{ price: config.priceId, quantity: 1 }],
    customer_creation: "always",
    currency: "usd",
    adaptive_pricing: { enabled: false },
    ...(couponId ? { discounts: [{ coupon: couponId }] } : { allow_promotion_codes: true }),
    metadata: {
      product: PRO_PRODUCT, trigger, locale,
      ...(quote ? {
        pricing_policy: quote.policyVersion, pricing_country: quote.country ?? "unknown",
        pricing_tier: quote.tier, pricing_quote_id: quote.quoteId,
        pricing_base_amount: String(quote.baseAmount), pricing_amount: String(quote.amount),
      } : {}),
    },
    success_url: origin + "/pro/success?session_id={CHECKOUT_SESSION_ID}&return=" + encodeURIComponent(safeReturnPath),
    cancel_url: origin + safeReturnPath,
    // Keep Stripe's default expiry: relative expires_at changes on retries
    // and would break idempotency for the same signed quote.
  };
  try {
    const session = await config.stripe.checkout.sessions.create(params, quote ? {
      idempotencyKey: checkoutIdempotency(quote, origin, safeReturnPath, trigger, locale),
    } : undefined);
    if (quote && (!validRegionalSession(session, quote) || session.status !== "open")) {
      if (session.status === "open" && session.payment_status === "unpaid") {
        await config.stripe.checkout.sessions.expire(session.id);
      }
      return pricingResponse({ error: "checkout_failed" }, 502);
    }
    return pricingResponse({ url: session.url });
  } catch (error) {
    logPricingFailure("checkout", error);
    return pricingResponse({ error: "checkout_failed" }, 502);
  }
}
