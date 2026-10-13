import { createProStripeConfig } from "@/lib/pro/config";
import { verifyProToken } from "@/lib/pro/token";

function notConfigured(): Response {
  return Response.json({ error: "not_configured" }, { status: 503 });
}

export async function POST(request: Request): Promise<Response> {
  const config = createProStripeConfig();
  if (!config) {
    return notConfigured();
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const token = (body as { token?: unknown } | null)?.token;
  if (typeof token !== "string") {
    return Response.json({ valid: false });
  }

  const valid = verifyProToken(token, config.licenseSecret) !== null;
  return Response.json({ valid });
}
