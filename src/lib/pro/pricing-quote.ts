import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { PRICING_POLICY, regionalPrice, type PriceQuote } from "./regional-pricing";

export const QUOTE_SECONDS = 15 * 60;
export type QuotePayload = Omit<PriceQuote, "quoteToken" | "expiresAt"> & {
  expiresAt: number;
  purpose: "pro-price-quote";
  version: 1;
  quoteId: string;
  issuedAt: number;
  priceId: string;
  mode: "live" | "test";
};
function signature(body: string, secret: string) {
  return createHmac("sha256", secret).update("pro-price-quote.v1." + body).digest();
}
export function signPriceQuote(
  country: string | null, priceId: string, mode: "live" | "test", secret: string,
  now = Math.floor(Date.now() / 1000),
): PriceQuote {
  const quote = { ...regionalPrice(country), policyVersion: PRICING_POLICY, expiresAt: now + QUOTE_SECONDS };
  const payload: QuotePayload = {
    ...quote, purpose: "pro-price-quote", version: 1, quoteId: randomUUID(), issuedAt: now, priceId, mode,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const quoteToken = "q1." + body + "." + signature(body, secret).toString("base64url");
  // Keep the key server-side; the signed payload binds the provider identity.
  return { ...quote, quoteToken };
}
export function verifyPriceQuote(
  token: unknown, secret: string, now = Math.floor(Date.now() / 1000),
): { quote: QuotePayload | null; error: "quote_changed" | "quote_expired" | null } {
  const invalid = { quote: null, error: "quote_changed" as const };
  if (typeof token !== "string" || token.length > 4096) return invalid;
  const [version, body, mac, extra] = token.split(".");
  if (version !== "q1" || !body || !mac || extra !== undefined ||
    !/^[A-Za-z0-9_-]+$/.test(body) || !/^[A-Za-z0-9_-]{43}$/.test(mac)) return invalid;
  const actual = Buffer.from(mac, "base64url");
  const expected = signature(body, secret);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return invalid;
  try {
    const q = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as QuotePayload;
    if (q.purpose !== "pro-price-quote" || q.version !== 1 || !/^[a-f0-9-]{36}$/.test(q.quoteId) ||
      typeof q.priceId !== "string" || !q.priceId || !["live", "test"].includes(q.mode) ||
      !Number.isSafeInteger(q.issuedAt) || !Number.isSafeInteger(q.expiresAt) ||
      q.expiresAt !== q.issuedAt + QUOTE_SECONDS || q.issuedAt > now + 30 ||
      (q.country !== null && (typeof q.country !== "string" || !/^[A-Z]{2}$/.test(q.country)))) return invalid;
    if (q.expiresAt <= now) return { quote: null, error: "quote_expired" };
    const price = regionalPrice(q.country);
    if (q.policyVersion !== PRICING_POLICY || q.tier !== price.tier || q.amount !== price.amount ||
      q.discountPercent !== price.discountPercent || q.currency !== "usd" || q.baseAmount !== 900) return invalid;
    return { quote: q, error: null };
  } catch { return invalid; }
}

