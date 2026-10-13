import Stripe from "stripe";

export const PRO_PRODUCT = "time-overlay-pro";

export type ProStripeConfig = {
  stripe: Stripe;
  priceId: string;
  licenseSecret: string;
};

/**
 * Reads the Pro environment contract (spec 5.1). Returns null when any of
 * STRIPE_SECRET_KEY / STRIPE_PRO_PRICE_ID / PRO_LICENSE_SECRET is missing so
 * every /api/pro route can answer 503 {"error":"not_configured"} instead of
 * crashing. Never logs or echoes any secret value.
 */
export function createProStripeConfig(
  env: NodeJS.ProcessEnv = process.env,
): ProStripeConfig | null {
  const secretKey = env.STRIPE_SECRET_KEY;
  const priceId = env.STRIPE_PRO_PRICE_ID;
  const licenseSecret = env.PRO_LICENSE_SECRET;

  if (!secretKey || !priceId || !licenseSecret) {
    return null;
  }

  return {
    stripe: new Stripe(secretKey),
    priceId,
    licenseSecret,
  };
}
