import {
  createProStripeConfig,
  PRO_PRODUCT,
} from "@/lib/pro/config";
import { signProToken } from "@/lib/pro/token";
import { verifiedPricing } from "@/lib/pro/regional-pricing";

function notConfigured(): Response {
  return Response.json({ error: "not_configured" }, { status: 503 });
}

export async function GET(request: Request): Promise<Response> {
  const config = createProStripeConfig();
  if (!config) {
    return notConfigured();
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  let session;
  try {
    session = await config.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  // Both checks are mandatory: only sessions created for this product and
  // actually paid may mint an unlock token (spec 5.2).
  if (session.metadata?.product !== PRO_PRODUCT) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const lineItems = session.line_items?.data ?? [];
  const hasProPrice = lineItems.some(
    (item) => item.price?.id === config.priceId,
  );
  if (!hasProPrice) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  if (session.payment_status !== "paid") {
    return Response.json({ error: "unpaid" }, { status: 402 });
  }

  const email = session.customer_details?.email ?? null;
  if (!email) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const token = signProToken(
    { sid: session.id, iat: Math.floor(Date.now() / 1000) },
    config.licenseSecret,
  );

  // trigger is additive beyond the {token, email} contract so the success
  // page can attach it to pro_purchase_verified (spec 5.5).
  return Response.json({
    token,
    email,
    trigger: session.metadata.trigger,
    pricing: verifiedPricing(session.metadata, session.amount_total, session.currency),
  });
}
