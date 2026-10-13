import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = "v1";

export type ProTokenPayload = {
  sid: string;
  iat: number;
};

function signPayload(payload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

/**
 * Issues v1.<base64url(JSON{sid, iat})>.<base64url(HMAC-SHA256(secret, body))>.
 * The signature always covers the exact body string, so a tampered body or a
 * tampered signature fails verification.
 */
export function signProToken(
  payload: ProTokenPayload,
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = signPayload(body, secret).toString("base64url");
  return TOKEN_VERSION + "." + body + "." + signature;
}

/**
 * Verifies the token format and signature. Signature comparison uses
 * timingSafeEqual so a forged signature cannot be probed byte by byte.
 * Returns the payload for a valid token, or null for any malformed,
 * tampered, or wrongly signed token.
 */
export function verifyProToken(
  token: string,
  secret: string,
): ProTokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [version, body, signature] = parts;
  if (version !== TOKEN_VERSION || !body || !signature) {
    return null;
  }

  const expected = signPayload(body, secret);
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Partial<ProTokenPayload>;
    if (typeof parsed.sid !== "string" || !parsed.sid) {
      return null;
    }
    if (typeof parsed.iat !== "number" || !Number.isFinite(parsed.iat)) {
      return null;
    }
    return { sid: parsed.sid, iat: parsed.iat };
  } catch {
    return null;
  }
}
