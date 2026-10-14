import { createProStripeConfig } from "@/lib/pro/config";
import { regionalPrice } from "@/lib/pro/regional-pricing";
import { signPriceQuote } from "@/lib/pro/pricing-quote";
import { allowedOrigin, pricingResponse, regionalConfig, regionalEnabled, requestCountry, validateRegionalCatalog } from "@/lib/pro/pricing-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!allowedOrigin(request)) return pricingResponse({ error: "invalid_origin" }, 403);
  const base = createProStripeConfig();
  if (!base) return pricingResponse({ error: "not_configured" }, 503);
  if (!regionalEnabled()) return pricingResponse({
    ...regionalPrice(null), policyVersion: "standard-v1", expiresAt: null, quoteToken: null,
  });
  const config = regionalConfig();
  if (!config) return pricingResponse({ error: "pricing_unavailable" }, 503);
  try {
    await validateRegionalCatalog(base, config);
    return pricingResponse(signPriceQuote(requestCountry(request), base.priceId, config.mode, config.secret));
  } catch {
    return pricingResponse({ error: "pricing_unavailable" }, 503);
  }
}

