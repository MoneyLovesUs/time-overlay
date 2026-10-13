const BACKSLASH = "\\";

/**
 * Guarantees an on-site path: must start with "/" and must not start with
 * "//" (protocol-relative URLs would escape the site). A backslash right
 * after the leading slash is treated the same way because browsers resolve
 * "/backslash-host" like a protocol-relative URL for special schemes.
 * Anything else falls back to "/".
 */
export function sanitizeReturnPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/";
  }
  if (value.startsWith("//") || value.startsWith("/" + BACKSLASH)) {
    return "/";
  }
  return value;
}
