# Homepage Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce homepage first-load and runtime costs by lazy loading the generator island, deferring export initialization, and isolating preview playback updates.

**Architecture:** Keep the current single-route homepage and SEO structure, but move the interactive generator behind a lazy client boundary. Refactor generator export code so heavy modules and workers are loaded only when export begins, and move animation-time updates closer to the preview layer so the full generator shell does not re-render every frame.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Vitest

---

## File Structure

### Create

- `docs/superpowers/specs/2026-04-18-homepage-performance-optimization-design.md`
  - Written design for this optimization phase.
- `docs/superpowers/plans/2026-04-18-homepage-performance-optimization.md`
  - Execution plan for this work.
- `tests/root-page.test.tsx`
  - Coverage for homepage generator loading behavior.
- `tests/generator/generator-shell.test.tsx`
  - Coverage for deferred export initialization behavior.

### Modify

- `src/components/site/root-page.tsx`
  - Replace direct generator import with a lazy boundary.
- `src/components/generator/generator-shell.tsx`
  - Defer export imports, defer worker creation, and reduce top-level playback churn.
- `src/components/generator/preview-panel.tsx`
  - Separate canvas resize logic from frame drawing and support preview-local playback updates if needed.
- `package.json`
  - Only if test environment needs an additional dependency already used by current tests.

## Task 1: Add Failing Coverage for Homepage Lazy Generator Loading

**Files:**
- Create: `tests/root-page.test.tsx`
- Modify: `src/components/site/root-page.tsx`

- [ ] **Step 1: Write the failing test**

Add a test that renders `RootPage` and asserts the generator is exposed through a lazy boundary fallback instead of immediately requiring the concrete generator shell output.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/root-page.test.tsx`

Expected:
- FAIL because the current page renders `GeneratorShell` directly.

- [ ] **Step 3: Implement the minimal code**

Refactor `RootPage` so it loads the generator through `next/dynamic` with a stable lightweight fallback.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/root-page.test.tsx`

Expected:
- PASS

## Task 2: Add Failing Coverage for Deferred Export Initialization

**Files:**
- Create: `tests/generator/generator-shell.test.tsx`
- Modify: `src/components/generator/generator-shell.tsx`

- [ ] **Step 1: Write the failing tests**

Add tests for two behaviors:

- the PNG export worker is not created on initial render
- the WebM export module is not loaded on initial render

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/generator/generator-shell.test.tsx`

Expected:
- FAIL because the current shell creates a worker during mount and imports export helpers eagerly.

- [ ] **Step 3: Implement the minimal code**

Refactor `GeneratorShell` to:

- remove eager worker creation from mount
- create the worker only when PNG export starts
- dynamically import the WebM exporter only when WebM export starts

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/generator/generator-shell.test.tsx`

Expected:
- PASS

## Task 3: Reduce Playback Re-render Pressure and Canvas Reset Work

**Files:**
- Modify: `src/components/generator/generator-shell.tsx`
- Modify: `src/components/generator/preview-panel.tsx`

- [ ] **Step 1: Add a focused failing test or measurable assertion where practical**

If a robust automated render-count test is too brittle for the current setup, add the smallest stable coverage around preview update responsibilities and keep the primary verification at build/runtime level.

- [ ] **Step 2: Isolate preview-time updates**

Move animation-frequency state closer to the preview path so the top-level generator shell does not re-render unnecessarily during playback.

- [ ] **Step 3: Split canvas size sync from frame drawing**

Ensure canvas width and height are only synchronized when settings dimensions change, not on every animation tick.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- tests/generator/generator-shell.test.tsx tests/root-page.test.tsx`

Expected:
- PASS

## Task 4: Verify the Production Outcome

**Files:**
- None

- [ ] **Step 1: Run the full targeted test set**

Run: `npm test -- tests/root-page.test.tsx tests/generator/generator-shell.test.tsx`

Expected:
- PASS

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected:
- Build succeeds with static routes intact.

- [ ] **Step 3: Compare bundle diagnostics**

Inspect: `.next/diagnostics/route-bundle-stats.json`

Expected:
- `/` first-load JS is lower than the pre-change baseline of `591252` uncompressed bytes.

- [ ] **Step 4: Summarize residual risks**

Document any remaining performance limitations, especially if the homepage still carries heavy static SEO content or third-party script cost.
