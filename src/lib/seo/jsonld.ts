import { defaultLocale, enabledLocales, type EnabledLocale } from "@/lib/i18n";
import { siteConfig, siteOgImage } from "@/lib/site";

/**
 * Centralised Schema.org JSON-LD builders.
 *
 * Every page that emits structured data goes through these pure builders so the
 * shape stays consistent and AI answer engines (and Rich Results) parse a single
 * canonical structure. Builders return plain objects; rendering is handled by the
 * <JsonLd> component.
 */
export type JsonLdObject = Record<string, unknown>;

const SCHEMA_CONTEXT = "https://schema.org";

export function buildWebApplicationJsonLd({
  browserRequirements,
  description = siteConfig.description,
  locale = defaultLocale,
}: {
  browserRequirements?: string;
  description?: string;
  locale?: EnabledLocale;
} = {}): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    browserRequirements:
      browserRequirements ??
      "Requires JavaScript and a modern browser with Canvas + WebM support.",
    inLanguage: locale === defaultLocale ? [...enabledLocales] : locale,
    image: new URL(siteOgImage.url, siteConfig.url).toString(),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildFaqJsonLd(
  items: readonly { question: string; answer: string }[],
): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildHowToJsonLd(input: {
  name: string;
  description: string;
  steps: readonly { title: string; body: string }[];
}): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };
}

export function buildBreadcrumbJsonLd(
  crumbs: readonly { name: string; url: string }[],
): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function buildItemListJsonLd(input: {
  name: string;
  description?: string;
  items: readonly { name: string; url?: string; description?: string }[];
}): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ItemList",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { url: item.url } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
