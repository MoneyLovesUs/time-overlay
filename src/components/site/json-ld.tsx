import type { JsonLdObject } from "@/lib/seo/jsonld";

type JsonLdProps = {
  data: JsonLdObject | readonly JsonLdObject[];
  nonce?: string;
};

/**
 * Renders one or more Schema.org JSON-LD blocks as a script tag. Centralised so
 * every page emits structured data the same way instead of hand-writing the
 * `application/ld+json` script element each time.
 */
export function JsonLd({ data, nonce }: JsonLdProps) {
  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      // Browsers mask the nonce attribute after parsing, so React always sees
      // "" during hydration — suppress the false mismatch warning.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
