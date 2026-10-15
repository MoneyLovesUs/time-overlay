import { describe, expect, it } from "vitest";
import { signPriceQuote, verifyPriceQuote } from "@/lib/pro/pricing-quote";
import { signProToken } from "@/lib/pro/token";
const secret = "a".repeat(64);
describe("signed pricing quotes", () => {
  it("covers price identity/mode and expires after 15 minutes", () => {
    const q = signPriceQuote("IN","price_1","test",secret,1000);
    expect(q.amount).toBe(360);
    expect(verifyPriceQuote(q.quoteToken,secret,1001).quote).toMatchObject({ priceId: "price_1", mode: "test", country: "IN" });
    expect(verifyPriceQuote(q.quoteToken,secret,1900).error).toBe("quote_expired");
  });
  it("rejects tampering, wrong key, oversized token and license tokens", () => {
    const q = signPriceQuote("CN","price_1","live",secret,1000);
    const parts = q.quoteToken!.split(".");
    parts[1] = Buffer.from(JSON.stringify({ amount: 360 })).toString("base64url");
    for (const token of [parts.join("."), "x".repeat(5000), signProToken({sid:"cs_1",iat:1000},secret), q.quoteToken! + ".extra"]) {
      expect(verifyPriceQuote(token,secret,1001).quote).toBeNull();
    }
    expect(verifyPriceQuote(q.quoteToken,"b".repeat(64),1001).quote).toBeNull();
    expect(verifyPriceQuote(q.quoteToken,secret,900).quote).toBeNull();
  });
});

