import {
  createProStripeConfig,
  PRO_PRODUCT,
} from "@/lib/pro/config";
import type { ProTrigger } from "@/lib/pro/entitlements";
import { sanitizeReturnPath } from "@/lib/pro/return-path";

const PRO_TRIGGERS: readonly ProTrigger[] = [
  "duration",
  "fps",
  "template",
  "direct",
];

function notConfigured(): Response {
  return Response.json({ error: "not_configured" }, { status: 503 });
}

export async function POST(request: Request): Promise<Response> {
  const config = createProStripeConfig();
  if (!config) {
    return notConfigured();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const input = (body ?? {}) as Record<string, unknown>;
  const trigger = input.trigger;
  const locale = input.locale;
  const returnPath = input.returnPath;

  const triggerValid =
    typeof trigger === "string" && PRO_TRIGGERS.includes(trigger as ProTrigger);
  const localeValid = typeof locale === "string" && locale.length > 0;
  const returnPathValid =
    typeof returnPath === "string" && returnPath.length > 0;

  if (!triggerValid || !localeValid || !returnPathValid) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  // On-site path guard: anything off-site (for example a protocol-relative
  // host) is rewritten to "/" so neither success_url nor cancel_url can be
  // turned into a redirect away from the site.
  const safeReturnPath = sanitizeReturnPath(returnPath);
  const origin = new URL(request.url).origin;

  try {
    const session = await config.stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: config.priceId, quantity: 1 }],
      customer_creation: "always",
      allow_promotion_codes: true,
      metadata: {
        product: PRO_PRODUCT,
        trigger,
        locale,
      },
      success_url:
        origin +
        "/pro/success?session_id={CHECKOUT_SESSION_ID}&return=" +
        encodeURIComponent(safeReturnPath),
      cancel_url: origin + safeReturnPath,
    });

    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "checkout_failed" }, { status: 502 });
  }
}
