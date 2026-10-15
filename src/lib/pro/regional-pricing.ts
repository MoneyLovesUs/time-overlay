// Shared, secret-free policy and public quote types.
export const PRICING_POLICY = "regional-v1";
export const BASE_AMOUNT = 900;
export const COUNTRY_TIERS = {
  regional_80: ["PL", "CZ", "PT", "GR", "MY", "CL"],
  regional_60: ["CN", "BR", "MX", "TH", "TR", "ZA", "CO", "PE"],
  regional_40: ["IN", "ID", "PH", "VN", "PK", "BD", "EG", "NG"],
} as const;
export const TIERS = {
  standard: { amount: 900, discountPercent: 0 },
  regional_80: { amount: 720, discountPercent: 20 },
  regional_60: { amount: 540, discountPercent: 40 },
  regional_40: { amount: 360, discountPercent: 60 },
} as const;
export type PricingTier = keyof typeof TIERS;
export type PriceQuote = {
  currency: "usd";
  baseAmount: number;
  amount: number;
  discountPercent: number;
  tier: PricingTier;
  country: string | null;
  policyVersion: string;
  expiresAt: number | null;
  quoteToken: string | null;
};

export function normalizeCountry(value: string | null): string | null {
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : null;
}

export function regionalPrice(country: string | null) {
  const normalized = normalizeCountry(country);
  const tier: PricingTier = (Object.keys(COUNTRY_TIERS) as Array<keyof typeof COUNTRY_TIERS>)
    .find((key) => (COUNTRY_TIERS[key] as readonly string[]).includes(normalized ?? "")) ?? "standard";
  return { country: normalized, tier, ...TIERS[tier], currency: "usd" as const, baseAmount: BASE_AMOUNT };
}

export function quoteAnalytics(quote: PriceQuote) {
  return {
    tier: quote.tier, policy_version: quote.policyVersion, country: quote.country ?? "unknown",
    base_amount: quote.baseAmount, quoted_amount: quote.amount, currency: quote.currency,
  };
}

export function isPriceQuote(value: unknown): value is PriceQuote {
  if (!value || typeof value !== "object") return false;
  const q = value as PriceQuote;
  if (!Object.hasOwn(TIERS, q.tier)) return false;
  const expected = TIERS[q.tier];
  return q.currency === "usd" && q.baseAmount === BASE_AMOUNT &&
    q.amount === expected.amount && q.discountPercent === expected.discountPercent &&
    (q.country === null || normalizeCountry(q.country) === q.country) &&
    ((q.policyVersion === "standard-v1" && q.tier === "standard" && q.quoteToken === null && q.expiresAt === null) ||
    (q.policyVersion === PRICING_POLICY && typeof q.quoteToken === "string" && q.quoteToken.length > 0 &&
    q.quoteToken.length <= 4096 && Number.isSafeInteger(q.expiresAt)));
}


export type VerifiedPricing = {
  tier: PricingTier; policy_version: string; country: string;
  base_amount: number; quoted_amount: number; paid_amount: number; currency: string;
};
export function verifiedPricing(metadata: Record<string, string> | null, amountTotal: number | null, currency: string | null): VerifiedPricing | undefined {
  if (!metadata || metadata.pricing_policy !== PRICING_POLICY ||
    !Object.hasOwn(TIERS, metadata.pricing_tier) || currency !== "usd" || !Number.isSafeInteger(amountTotal)) return;
  const tier = metadata.pricing_tier as PricingTier;
  if (metadata.pricing_base_amount !== "900" || metadata.pricing_amount !== String(TIERS[tier].amount)) return;
  return {
    tier, policy_version: PRICING_POLICY, country: normalizeCountry(metadata.pricing_country) ?? "unknown",
    base_amount: 900, quoted_amount: TIERS[tier].amount, paid_amount: amountTotal!, currency,
  };
}
