const BACKSLASH = "\\";
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const MAX_DECODE_PASSES = 5;

/**
 * Resolves percent-encoding before validation so an encoded bypass such as
 * "/%2F%2Fevil.com" (which a browser normalizes to "//evil.com") cannot slip
 * through. Decodes repeatedly until stable (bounded), because attackers can
 * double- or triple-encode. Returns null for malformed sequences or values
 * that keep changing up to the pass limit.
 */
function decodeUntilStable(value: string): string | null {
  let current = value;
  for (let pass = 0; pass < MAX_DECODE_PASSES; pass += 1) {
    let decoded: string;
    try {
      decoded = decodeURIComponent(current);
    } catch {
      return null;
    }
    if (decoded === current) {
      return current;
    }
    current = decoded;
  }
  return null;
}

/**
 * Guarantees an on-site path: must start with "/" and must not start with
 * "//" (protocol-relative URLs would escape the site). A backslash right
 * after the leading slash is treated the same way because browsers resolve
 * "/backslash-host" like a protocol-relative URL for special schemes.
 * Percent-encoding is resolved first, so "//evil.com", "/\evil.com" and
 * encoded variants like "/%2F%2Fevil.com" are all rejected, and the returned
 * path is the decoded form (no encoded slash can survive into success_url or
 * cancel_url).
 * Anything else falls back to "/".
 */
export function sanitizeReturnPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/";
  }

  const decoded = decodeUntilStable(value);
  if (
    decoded === null ||
    decoded.startsWith("//") ||
    decoded.startsWith("/" + BACKSLASH) ||
    CONTROL_CHARACTERS.test(decoded)
  ) {
    return "/";
  }
  return decoded;
}
