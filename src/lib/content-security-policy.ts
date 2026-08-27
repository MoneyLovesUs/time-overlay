export const CSP_NONCE_HEADER = "x-nonce";

const validNoncePattern = /^[A-Za-z0-9+/_-]+={0,2}$/;

/**
 * Build the nonce-based strict CSP required by Google AdSense. AdSense loads
 * resources from a changing set of origins, so resource directives permit
 * HTTPS while executable scripts still require the per-request nonce and
 * inherit trust through `strict-dynamic`.
 */
export function buildContentSecurityPolicy(nonce: string): string {
  const normalizedNonce = nonce.trim();

  if (!normalizedNonce || !validNoncePattern.test(normalizedNonce)) {
    throw new Error("A valid CSP nonce is required");
  }

  return [
    "default-src 'self' https: data: blob:",
    [
      "script-src",
      `'nonce-${normalizedNonce}'`,
      "'unsafe-inline'",
      "'unsafe-eval'",
      "'strict-dynamic'",
      "https:",
      "http:",
    ].join(" "),
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' https: data: blob:",
    "font-src 'self' https: data:",
    "connect-src 'self' https: wss:",
    "media-src 'self' https: data: blob:",
    "worker-src 'self' https: blob:",
    "child-src 'self' https: blob:",
    "frame-src https: data: blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self' https:",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}
