import { describe, expect, it } from "vitest";
import { COUNTRY_TIERS, regionalPrice, isPriceQuote } from "@/lib/pro/regional-pricing";
describe("regional pricing policy", () => {
  it("has no overlapping countries and prices every whitelisted country", () => {
    const all = Object.values(COUNTRY_TIERS).flat();
    expect(new Set(all).size).toBe(all.length);
    for (const [tier, countries] of Object.entries(COUNTRY_TIERS)) {
      for (const country of countries) expect(regionalPrice(country).tier).toBe(tier);
    }
  });
  it.each([["US",900],["TW",900],["JP",900],["HK",900],["MY",720],["CN",540],["BR",540],["IN",360],["VN",360]])("%s = %i cents", (country, amount) => {
    expect(regionalPrice(country).amount).toBe(amount);
  });
  it("normalizes country but fails closed on unknown/multivalue inputs", () => {
    expect(regionalPrice(" cn ").amount).toBe(540);
    for (const country of [null, "", "XX", "IN,US", "India", "USA"]) expect(regionalPrice(country).amount).toBe(900);
  });
  it("rejects malformed frontend quotes instead of displaying an invented price", () => {
    const standard = { ...regionalPrice(null), policyVersion: "standard-v1", quoteToken: null, expiresAt: null };
    expect(isPriceQuote(standard)).toBe(true);
    expect(isPriceQuote({ ...standard, amount: 1 })).toBe(false);
    expect(isPriceQuote({ ...standard, tier: "toString" })).toBe(false);
  });
});

