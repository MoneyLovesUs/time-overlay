# Homepage SEO Metadata Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the overly short homepage title with descriptive, search-intent-driven localized metadata and ensure the root route no longer collapses to the brand name only.

**Architecture:** Keep the current single-page multilingual homepage structure and locale content model. Update locale-owned metadata strings in `src/content/root/*.ts`, then fix the root layout title inheritance so `/` uses the descriptive English homepage title while non-default locales continue to inherit the global title template.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Vitest

---

## File Structure

### Create

- `docs/superpowers/plans/2026-04-18-homepage-seo-metadata-refresh.md`
  - Execution plan for this metadata refresh.

### Modify

- `tests/lib/seo-metadata.test.ts`
  - Add failing coverage for the root layout title default and selected localized metadata values.
- `src/app/layout.tsx`
  - Preserve the localized homepage title as the root default instead of falling back to the brand-only title.
- `src/lib/site.ts`
  - Align the shared site description with the refreshed homepage positioning.
- `src/content/root/*.ts`
  - Refresh locale-specific homepage metadata titles and descriptions.

## Task 1: Add Failing Coverage for Homepage Metadata

**Files:**
- Modify: `tests/lib/seo-metadata.test.ts`

- [ ] **Step 1: Write the failing tests**

Add coverage for:

- the root layout metadata default title matching the descriptive English homepage title
- selected locale metadata strings matching the refreshed SEO copy

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/lib/seo-metadata.test.ts`

Expected:
- FAIL because the root layout currently falls back to `Time Overlay`
- FAIL because locale metadata still uses the previous shorter copy

## Task 2: Refresh Locale Metadata Copy

**Files:**
- Modify: `src/content/root/en.ts`
- Modify: `src/content/root/es.ts`
- Modify: `src/content/root/pt.ts`
- Modify: `src/content/root/ru.ts`
- Modify: `src/content/root/fr.ts`
- Modify: `src/content/root/de.ts`
- Modify: `src/content/root/ko.ts`
- Modify: `src/content/root/ja.ts`
- Modify: `src/content/root/fi.ts`
- Modify: `src/content/root/zh-hant.ts`
- Modify: `src/content/root/ar.ts`
- Modify: `src/content/root/th.ts`
- Modify: `src/content/root/cs.ts`
- Modify: `src/content/root/hi.ts`
- Modify: `src/content/root/nl.ts`
- Modify: `src/content/root/sv.ts`
- Modify: `src/lib/site.ts`

- [ ] **Step 1: Update the metadata strings**

Refresh each locale's `metadata.title` and `metadata.description` so they describe the tool as a browser-based countdown timer overlay generator for videos, live streams, and adjacent creator workflows.

- [ ] **Step 2: Keep shared copy aligned**

Update `siteConfig.description` to match the new homepage positioning closely enough that the manifest and other shared metadata are not stale.

## Task 3: Fix Root Title Inheritance

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Preserve the localized root title**

Keep the title template for child routes, but set the root layout `title.default` from the generated default-locale homepage metadata instead of hard-coding `siteConfig.name`.

- [ ] **Step 2: Leave locale routes intact**

Do not change the locale layout metadata flow unless the tests show it is necessary. The goal is to fix `/` without regressing `/%locale`.

## Task 4: Verify the Result

**Files:**
- None

- [ ] **Step 1: Run focused tests**

Run: `pnpm test tests/lib/seo-metadata.test.ts tests/content/root-content.test.ts`

Expected:
- PASS

- [ ] **Step 2: Run the broader relevant suite**

Run: `pnpm test tests/i18n-foundation.test.ts tests/app/localized-home-routes.test.ts`

Expected:
- PASS

- [ ] **Step 3: Run the production build**

Run: `pnpm build`

Expected:
- Build succeeds with the localized routes and metadata intact.
