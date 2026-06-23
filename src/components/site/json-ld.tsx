import type { JsonLdObject } from "@/lib/seo/jsonld";

type JsonLdProps = {
  data: JsonLdObject | readonly JsonLdObject[];
};

/**
 * Renders one or more Schema.org JSON-LD blocks as a script tag. Centralised so
 * every page emits structured data the same way instead of hand-writing the
 * `application/ld+json` script element each time.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
