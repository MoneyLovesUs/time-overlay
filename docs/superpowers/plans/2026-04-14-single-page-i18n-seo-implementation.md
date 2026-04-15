# Single-Page I18n SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship nine static localized homepage routes for the current single-page Time Overlay site, with English staying at `/` and the other locales living at `/{locale}`.

**Architecture:** Keep the current single-page product structure and localize it deeply instead of restoring secondary content routes. Introduce typed homepage locale content modules, a locale-aware route loader, locale-aware metadata and sitemap generation, and generator/site components that render supplied locale text rather than hard-coded English strings.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, Vitest, existing generator worker/export pipeline.

---

### Task 1: Expand Locale Configuration and Root Route Contracts

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/lib/site.ts`
- Create: `tests/lib/i18n.test.ts`

- [ ] **Step 1: Write the failing locale configuration test**

```ts
import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  enabledLocales,
  knownLocales,
  buildLocalizedPath,
  buildLanguageAlternates,
} from "@/lib/i18n";

describe("i18n config", () => {
  it("supports the approved locale matrix with english unprefixed", () => {
    expect(defaultLocale).toBe("en");
    expect(enabledLocales).toEqual(["en", "es", "pt", "ru", "fr", "de", "ko", "ja", "fi"]);
    expect(knownLocales).toEqual(enabledLocales);
    expect(buildLocalizedPath("/", "en")).toBe("/");
    expect(buildLocalizedPath("/", "ja")).toBe("/ja");
    expect(buildLocalizedPath("/#faq", "pt")).toBe("/pt#faq");
    expect(buildLanguageAlternates("/")).toMatchObject({
      en: "/",
      es: "/es",
      pt: "/pt",
      ru: "/ru",
      fr: "/fr",
      de: "/de",
      ko: "/ko",
      ja: "/ja",
      fi: "/fi",
    });
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test tests/lib/i18n.test.ts`

Expected: FAIL because `src/lib/i18n.ts` still exposes `en/zh` and does not handle the final locale matrix.

- [ ] **Step 3: Implement the locale matrix and helper behavior**

Update `src/lib/i18n.ts` to:

- replace the old `en/zh` config with `en/es/pt/ru/fr/de/ko/ja/fi`
- keep `en` as `defaultLocale`
- add an `isEnabledLocale()` helper for route validation
- make `buildLocalizedPath()` preserve hash fragments and keep English unprefixed
- make `buildLanguageAlternates()` return the full locale map

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `pnpm test tests/lib/i18n.test.ts`

Expected: PASS.

- [ ] **Step 5: Refactor site route helpers to match the single-page model**

Update `src/lib/site.ts` so that:

- `publicRouteDefinitions` becomes a single-entry homepage matrix
- the site nav model no longer assumes legacy public pages exist
- future locale-aware nav entries derive from homepage anchors only

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n.ts src/lib/site.ts tests/lib/i18n.test.ts
git commit -m "feat: expand locale configuration"
```

### Task 2: Introduce Typed Homepage Locale Content Modules

**Files:**
- Create: `src/content/root/types.ts`
- Create: `src/content/root/en.ts`
- Create: `src/content/root/es.ts`
- Create: `src/content/root/pt.ts`
- Create: `src/content/root/ru.ts`
- Create: `src/content/root/fr.ts`
- Create: `src/content/root/de.ts`
- Create: `src/content/root/ko.ts`
- Create: `src/content/root/ja.ts`
- Create: `src/content/root/fi.ts`
- Create: `src/content/root/index.ts`
- Create: `tests/content/root-content.test.ts`

- [ ] **Step 1: Write the failing content-loader test**

```ts
import { describe, expect, it } from "vitest";

import { getRootPageContent } from "@/content/root";

describe("root locale content", () => {
  it("loads locale-specific metadata and faq content for every enabled locale", async () => {
    const japanese = await getRootPageContent("ja");
    const german = await getRootPageContent("de");

    expect(japanese.metadata.title.length).toBeGreaterThan(0);
    expect(german.seoSection.faqItems.length).toBeGreaterThan(0);
    expect(japanese.generatorUi.preview.playButton).not.toBe(
      german.generatorUi.preview.playButton,
    );
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test tests/content/root-content.test.ts`

Expected: FAIL because the root content module layer does not exist yet.

- [ ] **Step 3: Define the typed homepage content contract**

Create `src/content/root/types.ts` with a `RootPageContent` type that includes:

- `metadata`
- `siteChrome`
- `generatorUi`
- `seoSection`

The `generatorUi` section should be shaped around the actual component boundaries:

- `themePresetPicker`
- `controlPanel`
- `previewPanel`
- `exportPanel`

- [ ] **Step 4: Move English homepage copy into `src/content/root/en.ts`**

Use the current source of truth from:

- `src/app/page.tsx`
- `src/components/site/root-seo-section.tsx`
- `src/components/site/site-header.tsx`
- `src/components/site/site-footer.tsx`
- generator component labels in the control/export/preview/theme components

- [ ] **Step 5: Add the eight non-English locale files**

Each locale file should:

- map to the same route structure
- provide its own `title`, `description`, H1/section copy, and FAQ answers
- avoid placeholder English strings

Use these locale ids exactly:

- `es`
- `pt`
- `ru`
- `fr`
- `de`
- `ko`
- `ja`
- `fi`

- [ ] **Step 6: Create the content loader**

In `src/content/root/index.ts`, export:

- `getRootPageContent(locale)`
- `rootContentLoaders`

The loader should validate against `EnabledLocale`.

- [ ] **Step 7: Run the targeted test to verify it passes**

Run: `pnpm test tests/content/root-content.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/content/root tests/content/root-content.test.ts
git commit -m "feat: add localized root content modules"
```

### Task 3: Add the Localized Homepage Route and Page Loader

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `tests/app/localized-home-routes.test.ts`

- [ ] **Step 1: Write the failing localized route test**

```ts
import { describe, expect, it } from "vitest";

import { generateStaticParams } from "@/app/[locale]/page";

describe("localized root routes", () => {
  it("statically generates every non-default locale", async () => {
    expect(await generateStaticParams()).toEqual([
      { locale: "es" },
      { locale: "pt" },
      { locale: "ru" },
      { locale: "fr" },
      { locale: "de" },
      { locale: "ko" },
      { locale: "ja" },
      { locale: "fi" },
    ]);
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test tests/app/localized-home-routes.test.ts`

Expected: FAIL because `src/app/[locale]/page.tsx` does not exist yet.

- [ ] **Step 3: Refactor the English homepage into a shared localized page renderer**

Extract the common page renderer logic from `src/app/page.tsx` into a shared server component or helper, for example:

- `src/components/site/root-page.tsx`

That shared renderer should accept:

- `locale`
- `content`

- [ ] **Step 4: Implement `src/app/[locale]/page.tsx`**

It should:

- validate `locale` with `isEnabledLocale()`
- reject `en` under the prefixed route to avoid `/en`
- load `getRootPageContent(locale)`
- return the shared root page renderer
- export `generateStaticParams()` for the 8 non-default locales

- [ ] **Step 5: Update `src/app/page.tsx`**

The root page should load English content explicitly and render the same shared page renderer.

- [ ] **Step 6: Run the targeted test to verify it passes**

Run: `pnpm test tests/app/localized-home-routes.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/app/[locale]/page.tsx src/components/site/root-page.tsx tests/app/localized-home-routes.test.ts
git commit -m "feat: add localized homepage routes"
```

### Task 4: Make Metadata, HTML Lang, and Sitemap Locale-Aware

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/lib/site.ts`
- Modify: `src/app/sitemap.ts`
- Create: `tests/lib/seo-metadata.test.ts`

- [ ] **Step 1: Write the failing SEO metadata test**

```ts
import { describe, expect, it } from "vitest";

import { buildSitemapEntries, createPageMetadata } from "@/lib/site";

describe("localized SEO helpers", () => {
  it("creates locale-aware canonical and hreflang metadata", () => {
    const metadata = createPageMetadata({
      locale: "fr",
      path: "/",
      title: "Minuteur overlay",
      description: "Description FR",
    });

    expect(metadata.alternates?.canonical).toBe("/fr");
    expect(metadata.alternates?.languages).toMatchObject({
      en: "/",
      fr: "/fr",
      ja: "/ja",
    });
  });

  it("emits all localized homepage entries in the sitemap", () => {
    const entries = buildSitemapEntries();
    expect(entries).toHaveLength(9);
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test tests/lib/seo-metadata.test.ts`

Expected: FAIL because the current sitemap and metadata only model the English root.

- [ ] **Step 3: Implement locale-aware metadata generation**

Update `src/lib/site.ts` to:

- build localized canonical URLs
- expose a homepage-anchor nav model if needed
- emit `alternates.languages` across all 9 locales
- derive page metadata from locale-specific content

- [ ] **Step 4: Add locale-aware layouts**

Update:

- `src/app/layout.tsx` for English `lang="en"`
- `src/app/[locale]/layout.tsx` for non-default locales

Each layout should load the appropriate localized chrome content and set the correct `html lang`.

- [ ] **Step 5: Update the sitemap**

`src/app/sitemap.ts` should now emit:

- `/`
- `/es`
- `/pt`
- `/ru`
- `/fr`
- `/de`
- `/ko`
- `/ja`
- `/fi`

and include `alternates.languages` on each entry.

- [ ] **Step 6: Run the targeted test to verify it passes**

Run: `pnpm test tests/lib/seo-metadata.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/[locale]/layout.tsx src/lib/site.ts src/app/sitemap.ts tests/lib/seo-metadata.test.ts
git commit -m "feat: add localized metadata and sitemap"
```

### Task 5: Localize Shared Chrome and SEO Section Content

**Files:**
- Modify: `src/components/site/site-header.tsx`
- Modify: `src/components/site/site-footer.tsx`
- Modify: `src/components/site/root-seo-section.tsx`
- Create: `tests/content/root-seo-section.test.ts`

- [ ] **Step 1: Write the failing SEO-section content test**

```ts
import { describe, expect, it } from "vitest";

import { getRootPageContent } from "@/content/root";

describe("localized seo section content", () => {
  it("exposes locale-specific faq and export copy", async () => {
    const spanish = await getRootPageContent("es");

    expect(spanish.seoSection.exportFormatsTitle.length).toBeGreaterThan(0);
    expect(spanish.seoSection.faqItems.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test tests/content/root-seo-section.test.ts`

Expected: FAIL because the component still hard-codes English FAQ/export copy.

- [ ] **Step 3: Refactor `RootSeoSection` to render from props**

The component should accept:

- `seoSection`

and build its FAQ JSON-LD from the locale-specific FAQ items rather than from a hard-coded English array.

- [ ] **Step 4: Refactor `SiteHeader` and `SiteFooter`**

Move all visible strings and anchor labels to locale content:

- shell label
- tool/FAQ/formats nav labels
- footer labels
- footer product copy

- [ ] **Step 5: Run the targeted test to verify it passes**

Run: `pnpm test tests/content/root-seo-section.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/site/site-header.tsx src/components/site/site-footer.tsx src/components/site/root-seo-section.tsx tests/content/root-seo-section.test.ts
git commit -m "feat: localize site chrome and seo section"
```

### Task 6: Localize Generator UI Strings Without Changing Export Behavior

**Files:**
- Modify: `src/components/generator/generator-shell.tsx`
- Modify: `src/components/generator/control-panel.tsx`
- Modify: `src/components/generator/export-panel.tsx`
- Modify: `src/components/generator/preview-panel.tsx`
- Modify: `src/components/generator/theme-preset-picker.tsx`
- Create: `tests/content/generator-ui-content.test.ts`

- [ ] **Step 1: Write the failing generator-ui content test**

```ts
import { describe, expect, it } from "vitest";

import { getRootPageContent } from "@/content/root";

describe("localized generator ui content", () => {
  it("provides translated labels for the generator shell", async () => {
    const finnish = await getRootPageContent("fi");

    expect(finnish.generatorUi.controlPanel.title.length).toBeGreaterThan(0);
    expect(finnish.generatorUi.exportPanel.exportButtonLabel.length).toBeGreaterThan(0);
    expect(finnish.generatorUi.previewPanel.playButtonLabel.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test tests/content/generator-ui-content.test.ts`

Expected: FAIL because the generator UI content shape or strings are not fully implemented yet.

- [ ] **Step 3: Pass localized UI copy through `GeneratorShell`**

`GeneratorShell` should accept a `generatorUi` prop and pass locale-specific strings to:

- `ThemePresetPicker`
- `ControlPanel`
- `PreviewPanel`
- `ExportPanel`

Do not change export logic, worker behavior, or generator state shape in this step.

- [ ] **Step 4: Refactor the child components to consume props**

Replace visible hard-coded English labels with the supplied locale strings, including:

- section headings
- field labels
- radio descriptions
- advisory fallback copy
- play/pause/reset/safe-area labels

- [ ] **Step 5: Run the targeted test to verify it passes**

Run: `pnpm test tests/content/generator-ui-content.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/generator/generator-shell.tsx src/components/generator/control-panel.tsx src/components/generator/export-panel.tsx src/components/generator/preview-panel.tsx src/components/generator/theme-preset-picker.tsx tests/content/generator-ui-content.test.ts
git commit -m "feat: localize generator ui strings"
```

### Task 7: Final Verification and Cleanup

**Files:**
- Verify: `src/app/page.tsx`
- Verify: `src/app/[locale]/page.tsx`
- Verify: `src/app/layout.tsx`
- Verify: `src/app/[locale]/layout.tsx`
- Verify: `src/app/sitemap.ts`
- Verify: `src/content/root/*`

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`

Expected: PASS.

- [ ] **Step 2: Run lint**

Run: `pnpm lint`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `pnpm build`

Expected: PASS and generate all 9 static homepage routes plus `/sitemap.xml`.

- [ ] **Step 4: Sanity-check the route output**

Confirm the build output includes:

- `/`
- `/es`
- `/pt`
- `/ru`
- `/fr`
- `/de`
- `/ko`
- `/ja`
- `/fi`
- `/sitemap.xml`

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: finalize single-page i18n seo rollout"
```
