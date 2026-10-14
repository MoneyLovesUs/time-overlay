#!/usr/bin/env node
import Stripe from "stripe";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export const COUPONS = [
  { id: "to_pro_regional_v1_off20", tier: "regional_80", percent_off: 20 },
  { id: "to_pro_regional_v1_off40", tier: "regional_60", percent_off: 40 },
  { id: "to_pro_regional_v1_off60", tier: "regional_40", percent_off: 60 },
];
export function assertCoupon(coupon, definition, productId, live) {
  if (!coupon.valid || coupon.livemode !== live || coupon.percent_off !== definition.percent_off ||
    coupon.duration !== "once" || coupon.amount_off !== null || coupon.max_redemptions !== null ||
    coupon.redeem_by !== null || coupon.applies_to?.products?.length !== 1 ||
    coupon.applies_to.products[0] !== productId || coupon.metadata?.product !== "time-overlay-pro" ||
    coupon.metadata?.purpose !== "regional-pricing" || coupon.metadata?.policy_version !== "regional-v1" ||
    coupon.metadata?.tier !== definition.tier) throw new Error("Coupon conflict: " + definition.id);
}
export async function provisionCoupons(stripe, { apply = false, mode, accountId, productId, priceId }) {
  const live = mode === "live";
  if (!["live", "test"].includes(mode) || !accountId || !productId || !priceId) throw new Error("Explicit mode/account/product/price required.");
  if (live && (accountId !== "acct_1TNWqFPuE0QRKBbW" || productId !== "prod_VQxSWpuY6vYwgD" ||
    priceId !== "price_1UQ5aBPuE0QRKBbWTY6IJnLT")) throw new Error("Unexpected live resource identity.");
  const account = await stripe.accounts.retrieve();
  if (account.id !== accountId) throw new Error("Stripe account mismatch.");
  const [product, price] = await Promise.all([stripe.products.retrieve(productId), stripe.prices.retrieve(priceId, { expand: ["currency_options"] })]);
  if (product.deleted || !product.active || product.livemode !== live ||
    product.metadata?.product !== "time-overlay-pro" ||
    !price.active || price.livemode !== live || price.currency !== "usd" || price.unit_amount !== 900 ||
    price.type !== "one_time" || price.product !== productId || price.tax_behavior === "exclusive" ||
    Object.keys(price.currency_options ?? {}).some((currency) => currency !== "usd")) throw new Error("Unexpected product or USD $9 price.");
  // Check ALL conflicts before any mutation. Never repair/delete an existing object.
  const existing = await Promise.all(COUPONS.map(async (definition) => {
    try {
      const coupon = await stripe.coupons.retrieve(definition.id);
      assertCoupon(coupon, definition, productId, live);
      return coupon;
    } catch (error) {
      if (error.code === "resource_missing" && error.statusCode === 404) return null;
      throw error;
    }
  }));
  const results = [];
  for (let i = 0; i < COUPONS.length; i++) {
    const definition = COUPONS[i];
    let coupon = existing[i];
    let action = coupon ? "reused" : "would_create";
    if (!coupon && apply) {
      try {
        coupon = await stripe.coupons.create({
          id: definition.id, name: "Regional pricing " + definition.percent_off + "% off",
          duration: "once", percent_off: definition.percent_off,
          applies_to: { products: [productId] },
          metadata: { product: "time-overlay-pro", purpose: "regional-pricing",
            policy_version: "regional-v1", tier: definition.tier },
        }, { idempotencyKey: "time-overlay:regional-v1:coupon:" + definition.id });
      } catch {
        // A timeout may have succeeded. Retrieve the SAME id, never retry with a new id.
        coupon = await stripe.coupons.retrieve(definition.id);
      }
      coupon = await stripe.coupons.retrieve(definition.id);
      assertCoupon(coupon, definition, productId, live);
      action = "created_or_recovered";
    }
    results.push({ id: definition.id, tier: definition.tier, percentOff: definition.percent_off,
      productId, livemode: live, action });
  }
  return results;
}
async function main(args) {
  if (args.length === 1 && args[0] === "--help") {
    console.log("pnpm pro:coupons --mode=test|live --account=acct_... --product=prod_... --price=price_... [--apply]");
    console.log("Defaults to read-only validation. STRIPE_SECRET_KEY must be supplied privately; --apply creates only the three fixed product-limited coupons.");
    return;
  }
  const options = { apply: false };
  for (const arg of args) {
    if (arg === "--apply") options.apply = true;
    else {
      const match = /^--(mode|account|product|price)=(.+)$/.exec(arg);
      if (!match) throw new Error("Unknown option.");
      options[match[1] === "mode" ? "mode" : match[1] + "Id"] = match[2];
    }
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !new RegExp("^(sk|rk)_" + options.mode + "_").test(key)) throw new Error("Credential mode mismatch.");
  const result = await provisionCoupons(new Stripe(key), options);
  console.log(JSON.stringify({ mode: options.mode, apply: options.apply, coupons: result }, null, 2));
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main(process.argv.slice(2)).catch(() => {
    // Provider error objects can include request params. Never stringify them.
    console.error("Regional coupon configuration stopped; check resource identity, permissions and conflicts. No existing objects were changed.");
    process.exitCode = 1;
  });
}

