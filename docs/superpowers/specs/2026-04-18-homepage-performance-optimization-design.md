# Homepage Performance Optimization Design

**Date:** 2026-04-18

## Goal

Reduce homepage performance costs on the Time Overlay landing page without changing the current information architecture or weakening SEO coverage.

This optimization phase focuses on three concrete issues:

- too much client JavaScript on first load
- export-related code initializing before the user needs it
- preview playback causing more React work than necessary

## Current State

The current homepage combines three concerns in one route:

- static marketing and SEO content
- a fully interactive generator UI
- local export capabilities for PNG sequence and WebM

The route is statically generated, so server response time is not the primary problem. The main problems are client-side:

- the homepage eagerly hydrates the generator
- export code is imported and partially initialized on page load
- playback updates are driven from top-level React state, which makes too much of the generator tree participate in frequent updates

The observed production build evidence before this work:

- `/` first-load uncompressed JS: about `591 KB`
- `/` first-load gzip JS: about `171 KB`
- homepage HTML: about `90 KB`

## Product Constraints

- keep the homepage as the main SEO landing page
- keep the generator on the homepage rather than moving it to a separate route in this phase
- preserve current visual design and localized content
- keep local-first export behavior intact
- avoid speculative refactors unrelated to performance

## Options Considered

### Option 1: Optimize the existing homepage architecture

Keep the current single-route landing page, but reduce work on first load and during playback.

Changes:

- lazy load the interactive generator island
- lazy initialize export modules and worker setup
- localize playback updates so they do not force the full generator shell to re-render every frame

Pros:

- highest impact for the least product risk
- preserves current SEO structure
- avoids route, nav, and analytics churn

Cons:

- homepage still carries both marketing and tool concerns
- some residual client cost remains because the tool still exists on the page

### Option 2: Split marketing page and tool page into separate routes

Pros:

- strongest possible homepage payload reduction
- cleaner separation between acquisition and tool usage

Cons:

- changes current product strategy
- creates new UX and SEO decisions around landing page vs tool page
- larger scope than needed for this optimization pass

### Option 3: Only trim third-party and static page weight

Pros:

- smallest implementation
- low risk

Cons:

- does not address the biggest runtime cost
- leaves generator hydration and playback inefficiency mostly intact

## Chosen Approach

Use Option 1.

This phase should target the largest avoidable costs while preserving the current homepage structure. That means reducing both:

- the amount of code required before a user can see meaningful content
- the amount of React work performed once the preview starts animating

## Design

### 1. Generator Loading Boundary

The page-level server component should stop directly importing the concrete generator implementation.

Instead:

- `RootPage` should render a lazy client boundary for the generator
- the boundary should provide a lightweight fallback that preserves layout stability and keeps the SEO content visible immediately

This reduces the amount of homepage code that must be part of the first interactive path. The rest of the page remains statically rendered and crawlable.

### 2. Export Capability Loading

The current generator imports export helpers eagerly and creates the PNG worker during component mount.

This should change so that:

- export modules are imported only when export is triggered
- the PNG sequence worker is created only when the user actually exports PNG sequence
- WebM export code is imported only when the user exports WebM

This keeps export-specific code off the hot path for users who only preview or browse the homepage.

### 3. Preview Playback Isolation

Playback should no longer depend on top-level elapsed-time state that re-renders the whole generator shell at animation frequency.

Instead:

- preview animation state should live closer to the preview surface
- the preview canvas should update independently
- the rest of the generator shell should stay stable unless settings or export state change

This isolates the high-frequency rendering path to the preview area.

### 4. Canvas Resize Behavior

The preview panel should not reset canvas width and height on every frame tick.

Resize work should happen only when actual canvas dimensions change. Frame drawing should run separately from size synchronization.

### 5. Validation and Success Criteria

Success for this phase means:

- homepage build still succeeds
- existing SEO structure remains intact
- first-load JS for `/` drops measurably from the current baseline
- preview playback no longer forces full generator shell re-renders on each animation frame
- export flows still work after lazy initialization

## Testing Strategy

Use focused automated tests for the behavior changes that are practical to verify at unit/component level:

- route/root-page tests that prove the generator is loaded through a lazy boundary rather than directly rendered
- generator tests that prove worker creation is deferred until PNG export starts
- generator tests that prove WebM export module loading is deferred until WebM export starts

Then verify with production build output:

- `npm run build`
- inspect `.next/diagnostics/route-bundle-stats.json`

## Out of Scope

- splitting the homepage into separate product routes
- redesigning the SEO section
- changing locale strategy
- replacing Microsoft Clarity or broader analytics policy
- major visual refactors
