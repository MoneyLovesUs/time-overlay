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

export function buildOrganizationJsonLd({
  operatorName = siteConfig.name,
  contactEmail,
}: {
  operatorName?: string;
  contactEmail?: string;
} = {}): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: operatorName,
    url: siteConfig.url,
    logo: new URL("/icon.svg", siteConfig.url).toString(),
    ...(contactEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            email: contactEmail,
            contactType: "customer support",
            availableLanguage: ["English", "Chinese"],
          },
        }
      : {}),
  };
}

export function buildWebSiteJsonLd(): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: [...enabledLocales],
  };
}

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

export function buildArticleJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  image?: string;
  locale?: EnabledLocale;
}): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "TechArticle",
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: input.locale ?? defaultLocale,
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    image: input.image ?? new URL(siteOgImage.url, siteConfig.url).toString(),
  };
}

export function buildWebPageJsonLd(input: {
  name: string;
  description: string;
  url: string;
  pageType?: "AboutPage" | "ContactPage" | "WebPage";
  locale?: EnabledLocale;
  dateModified?: string;
}): JsonLdObject {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": input.pageType ?? "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.locale ?? defaultLocale,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
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
