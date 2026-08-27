function readPublicValue(value: string | undefined, fallback = ""): string {
  const normalized = value?.trim();
  return normalized || fallback;
}

export function normalizeAdsenseAccount(value: string | undefined): string {
  const normalized = value?.trim() ?? "";
  return /^ca-pub-\d{10,20}$/.test(normalized) ? normalized : "";
}

export function buildAdsTxtRecord(account: string): string {
  const normalized = normalizeAdsenseAccount(account);
  if (!normalized) {
    return "";
  }

  return `google.com, ${normalized.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
}

/**
 * Public, non-secret publication details. Environment variables make preview
 * builds configurable while the checked-in fallbacks keep static generation
 * deterministic. Do not put account credentials or private contact data here.
 */
export const publicationConfig = {
  operatorName: readPublicValue(
    process.env.NEXT_PUBLIC_SITE_OPERATOR_NAME,
    "TimeOverlay",
  ),
  authorName: readPublicValue(
    process.env.NEXT_PUBLIC_SITE_AUTHOR_NAME,
    "yansoul",
  ),
  contactEmail: readPublicValue(
    process.env.NEXT_PUBLIC_SITE_CONTACT_EMAIL,
    "hi@timeoverlay.co",
  ),
  jurisdiction: readPublicValue(
    process.env.NEXT_PUBLIC_SITE_JURISDICTION,
    "Hong Kong",
  ),
  adsenseAccount: normalizeAdsenseAccount(
    readPublicValue(
      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT,
      "ca-pub-1565960034992068",
    ),
  ),
} as const;
