import {
  createProStripeConfig,
  PRO_PRODUCT,
} from "@/lib/pro/config";
import { signProToken } from "@/lib/pro/token";

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
  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (!email || !email.includes("@")) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  let result;
  try {
    result = await config.stripe.checkout.sessions.list({
      customer_details: { email },
      status: "complete",
      limit: 100,
    });
  } catch {
    return Response.json({ error: "restore_failed" }, { status: 502 });
  }

  const match = result.data.find(
    (session) =>
      session.payment_status === "paid" &&
      session.metadata?.product === PRO_PRODUCT,
  );

  if (!match) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const token = signProToken(
    { sid: match.id, iat: Math.floor(Date.now() / 1000) },
    config.licenseSecret,
  );
  return Response.json({ token });
}
