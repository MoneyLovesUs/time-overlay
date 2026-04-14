# Single-Page I18n SEO Design

**Date:** 2026-04-14

## Goal

Add production-grade multilingual SEO support to the current single-page Time Overlay site without reintroducing redundant secondary routes.

Supported locales for this phase:

- `en` (default, unprefixed)
- `es`
- `pt`
- `ru`
- `fr`
- `de`
- `ko`
- `ja`
- `fi`

The English homepage remains `/`. All other locales get their own prefixed homepage:

- `/es`
- `/pt`
- `/ru`
- `/fr`
- `/de`
- `/ko`
- `/ja`
- `/fi`

## Current State

The latest `main` branch is now a single-page product site:

- `/` is the only public content route
- `/generator`, `/qa`, and `/how-it-works` are not meant to return as standalone content pages
- the tool UI and SEO copy live together on the homepage
- the SEO surface currently comes from:
  - `src/app/page.tsx`
  - `src/components/generator/generator-shell.tsx`
  - `src/components/site/root-seo-section.tsx`
  - `src/lib/site.ts`
  - `src/lib/i18n.ts`

This means the multilingual strategy should localize the single homepage deeply rather than recreate a multi-page content site.

## Product Decision

This project will use a **single-page multilingual SEO model**:

- every supported locale gets one fully localized homepage
- every localized homepage is statically generated
- every localized homepage has its own metadata, FAQ copy, and JSON-LD
- English stays as the canonical default route without `/en`
- no locale-specific `/qa`, `/how-it-works`, or `/generator` pages will be introduced in this phase

This keeps the site aligned with the current product structure and avoids restoring routes that were intentionally removed as redundant.

## URL and SEO Policy

### URL policy

- English: `/`
- Non-default locales: `/{locale}`

Examples:

- `/` -> English
- `/es` -> Spanish
- `/pt` -> Portuguese
- `/ja` -> Japanese

### SEO policy

Each locale homepage must provide:

- locale-specific `title`
- locale-specific `description`
- locale-specific Open Graph and Twitter title/description
- locale-specific `html lang`
- canonical URL for that locale
- `alternates.languages` entries for all other enabled locales
- locale-specific FAQ structured data

### Indexing policy

All locale homepages are first-class indexed pages. They are not client-side translations, overlays, or alternate render states of the English page.

## Content Architecture

The project should move from a thin dictionary model to a **typed locale content model**.

Current `src/lib/dictionaries/en.ts` is only sufficient for shared chrome text. It is not enough for per-locale SEO rewriting.

### Recommended structure

```text
src/content/root/
  en.ts
  es.ts
  pt.ts
  ru.ts
  fr.ts
  de.ts
  ko.ts
  ja.ts
  fi.ts
```

Each locale file should export one strongly typed object with these top-level sections:

```ts
type RootPageContent = {
  metadata: {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
  };
  siteChrome: {
    shellLabel: string;
    footerSystemRail: string;
    footerPublicStatus: string;
    footerIdentityTitle: string;
    footerJumpTitle: string;
    footerProductTitle: string;
    footerProductBody: string;
    navToolLabel: string;
    navFaqLabel: string;
    navFormatsLabel: string;
  };
  generatorUi: {
    labels: Record<string, string>;
    help: Record<string, string>;
  };
  seoSection: {
    eyebrow: string;
    heading: string;
    intro: string;
    exportFormatsTitle: string;
    exportFormatsBody: string[];
    faqTitle: string;
    faqEyebrow: string;
    faqItems: Array<{
      question: string;
      answer: string;
    }>;
  };
};
```

The exact nested shape can change during implementation, but the core principle should not:

- metadata is owned by the locale content
- homepage SEO copy is owned by the locale content
- FAQ structured data is derived from the locale content
- the generator UI can be localized separately from long-form SEO copy

## Component Strategy

### Components that should become locale-aware

- `src/app/page.tsx`
- `src/components/site/root-seo-section.tsx`
- `src/components/site/site-header.tsx`
- `src/components/site/site-footer.tsx`
- `src/components/generator/generator-shell.tsx`
- child generator components that contain visible English strings

### Refactor rule

Components should not keep hard-coded English copy when that copy is user-facing.

Instead:

- route or page loaders resolve the locale content object
- components receive already-localized data as props
- components stay presentation-focused

This is especially important for:

- FAQ headings
- FAQ body copy
- export format explanations
- generator control labels
- button labels
- feature support messages
- warnings and advisory copy

## Routing Architecture

### Required routes

Keep:

- `src/app/page.tsx`

Add:

- `src/app/[locale]/page.tsx`

The locale route should only accept enabled non-default locales.

### Static generation

Use `generateStaticParams` to generate:

- `es`
- `pt`
- `ru`
- `fr`
- `de`
- `ko`
- `ja`
- `fi`

English should continue to use the root route and should not duplicate as `/en`.

### Locale validation

The locale layer should have:

- `knownLocales`
- `enabledLocales`
- `defaultLocale`
- helper validation such as `isEnabledLocale()`

Any unsupported locale under `[locale]` should return `notFound()`.

## Metadata and Sitemap Design

### Metadata

`createPageMetadata()` should evolve from simple path-based metadata into locale-aware metadata generation.

It should accept at least:

- `locale`
- `path`
- `title`
- `description`

and generate:

- canonical
- `alternates.languages`
- Open Graph title/description
- Twitter title/description

### Sitemap

`src/app/sitemap.ts` should emit one entry per locale homepage.

Expected entries:

- `/`
- `/es`
- `/pt`
- `/ru`
- `/fr`
- `/de`
- `/ko`
- `/ja`
- `/fi`

Each sitemap entry should include localized alternates for every enabled locale.

## JSON-LD Strategy

The FAQ JSON-LD should remain on the homepage, but it must be derived from locale content instead of a hard-coded English array.

This means:

- each locale gets its own `FAQPage` structured data
- the `name` and `acceptedAnswer.text` strings are locale-specific
- JSON-LD stays aligned with the visible FAQ on the page

## Non-Goals

This phase should not:

- recreate `/generator`, `/qa`, or `/how-it-works` as standalone pages
- introduce domain-based locale routing
- introduce automatic locale detection redirects
- add CMS authoring
- add translation workflow automation

This phase is about shipping a clean static multilingual architecture on the current single-page product surface.

## Risks

### 1. Generator UI string sprawl

The generator likely contains many embedded English labels. If these stay scattered across components, locale work will become slow and error-prone.

Mitigation:

- centralize generator-facing strings into a dedicated locale object
- pass them through props instead of ad hoc imports

### 2. SEO inconsistency across locales

If metadata and visible body copy come from different sources, structured data and page content can drift.

Mitigation:

- derive metadata and FAQ JSON-LD from the same locale content file

### 3. Overusing the old dictionary shape

The current dictionary is too shallow for this job.

Mitigation:

- keep lightweight shared chrome text in dictionary-style helpers only if useful
- move homepage SEO content into page-scoped typed content modules

## Recommended Implementation Order

1. Remove hard-coded assumptions that multiple public content pages exist.
2. Expand locale configuration from `en/zh` to the 9-locale set.
3. Introduce typed homepage locale content modules under `src/content/root/`.
4. Move English homepage content into the new model first.
5. Add `src/app/[locale]/page.tsx` and static generation for non-default locales.
6. Make `createPageMetadata()` and sitemap generation output locale-aware SEO tags.
7. Refactor `RootSeoSection` to render from locale content.
8. Refactor `GeneratorShell` and related components to consume locale UI strings.
9. Add the eight non-English locale content files.
10. Verify:
   - static generation
   - `hreflang`
   - sitemap alternates
   - JSON-LD correctness
   - no `/en` route

## Success Criteria

The work is successful when:

- the site builds to 9 static localized homepage routes
- English remains at `/`
- all non-English locales have prefixed homepage URLs
- each locale homepage can independently rewrite SEO copy
- the generator UI is localized
- sitemap and `hreflang` are complete and internally consistent
- no redundant legacy routes are reintroduced
