# Time Overlay Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first `/generator` route that lets users configure a countdown timer, preview it live in the browser, and export at least `PNG sequence` and `WebM` assets without server-side rendering.

**Architecture:** Add a dedicated generator surface to the existing Next.js site. Keep UI state in React, move deterministic frame rendering into shared TypeScript modules, and run export jobs in a Web Worker so heavy client-side generation does not freeze the page. The first release keeps format support narrow and uses conservative defaults to stay usable on common devices.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, browser Canvas APIs, Web Workers, browser download APIs

---

## File Structure

### New files

- `vitest.config.ts`
  - Test runner configuration for generator unit tests.
- `tests/setup.ts`
  - Shared test setup for generator utilities as needed.
- `src/app/generator/page.tsx`
  - Product route entry for the generator page.
- `src/components/generator/generator-shell.tsx`
  - Top-level desktop/mobile layout for controls, preview, and export.
- `src/components/generator/control-panel.tsx`
  - Editor control groups and field wiring.
- `src/components/generator/preview-panel.tsx`
  - Canvas host, playback controls, and safe-area overlay controls.
- `src/components/generator/export-panel.tsx`
  - Export format selection, progress UI, warnings, and CTA.
- `src/components/generator/theme-preset-picker.tsx`
  - Small preset selector for approved styles.
- `src/lib/generator/types.ts`
  - Shared editor, preview, and export types.
- `src/lib/generator/defaults.ts`
  - Default settings, caps, and preset definitions.
- `src/lib/generator/time.ts`
  - Time formatting helpers.
- `src/lib/generator/layout.ts`
  - Placement and anchor calculations.
- `src/lib/generator/render-frame.ts`
  - Deterministic frame rendering logic shared by preview and export.
- `src/lib/generator/feature-detection.ts`
  - Browser support checks for formats and APIs.
- `src/lib/generator/export/png-sequence.ts`
  - PNG sequence export adapter.
- `src/lib/generator/export/webm.ts`
  - WebM export adapter.
- `src/lib/generator/export/job.ts`
  - Shared export job orchestration helpers and progress events.
- `src/workers/generator-export.worker.ts`
  - Worker entry for long-running export tasks.
- `tests/generator/time.test.ts`
  - Unit tests for formatting helpers.
- `tests/generator/layout.test.ts`
  - Unit tests for placement calculations.
- `tests/generator/render-frame.test.ts`
  - Unit tests for deterministic frame rendering inputs/outputs.

### Existing files to modify

- `package.json`
  - Add test dependencies and scripts needed for generator unit coverage.
- `src/lib/site.ts`
  - Add `/generator` to site navigation metadata as appropriate.
- `src/components/site/site-header.tsx`
  - Surface generator route in navigation using the existing shell style.
- `src/app/page.tsx`
  - Add a clear route into the generator from the homepage.
- `src/components/site/home-hero.tsx`
  - Update primary CTA from guidance-only to tool access.
- `src/components/site/home-final-cta.tsx`
  - Add generator route as the product-first next step.
- `README.md`
  - Document the new route and local-first export positioning.

## Task 0: Add Minimal Test Infrastructure for Generator Utilities

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Add a lightweight test runner**

Introduce only the minimal dependencies and scripts needed to support generator utility tests.

- [ ] **Step 2: Add a test script to `package.json`**

Expose one project-level command for focused generator tests.

- [ ] **Step 3: Add a tiny config file**

Keep configuration intentionally small and limited to the utility-level tests this plan requires.

- [ ] **Step 4: Verify the runner boots**

Run: `pnpm test -- --run`

Expected:
- The command starts cleanly, even before the first meaningful tests exist.

## Task 1: Add Shared Generator Domain Types and Defaults

**Files:**
- Create: `src/lib/generator/types.ts`
- Create: `src/lib/generator/defaults.ts`
- Test: `tests/generator/time.test.ts`

- [ ] **Step 1: Define the core settings model**

Add explicit types for:

- timer content settings
- canvas settings
- text styling settings
- placement settings
- export settings
- preset definitions
- export progress state

- [ ] **Step 2: Create default settings and caps**

Add:

- one conservative default configuration
- allowed duration cap
- allowed resolutions
- allowed output formats
- 2-3 built-in visual presets

- [ ] **Step 3: Add a tiny validation / normalization layer**

Implement helpers that clamp invalid settings back into allowed ranges instead of letting the UI and renderer diverge.

- [ ] **Step 4: Verify lint/types locally**

Run: `pnpm lint`

Expected:
- No lint errors introduced by the new generator domain files.

## Task 2: Build Time Formatting and Placement Utilities

**Files:**
- Create: `src/lib/generator/time.ts`
- Create: `src/lib/generator/layout.ts`
- Create: `tests/generator/time.test.ts`
- Create: `tests/generator/layout.test.ts`

- [ ] **Step 1: Write failing tests for supported time formats**

Cover:

- `SS`
- `MM:SS`
- `HH:MM:SS`
- start / midpoint / end values

- [ ] **Step 2: Implement formatting helpers**

Add minimal helpers for:

- seconds-to-display conversion
- zero-padding
- safe handling of negative / overshoot input

- [ ] **Step 3: Write failing tests for anchor placement**

Cover:

- corner anchors
- center anchor
- x/y offsets
- safe-area constrained placement

- [ ] **Step 4: Implement layout helpers**

Return a deterministic text origin / box position based on canvas size and placement settings.

- [ ] **Step 5: Run focused tests**

Run: `pnpm test -- tests/generator/time.test.ts tests/generator/layout.test.ts`

Expected:
- All new helper tests pass.

## Task 3: Implement the Shared Frame Renderer

**Files:**
- Create: `src/lib/generator/render-frame.ts`
- Create: `tests/generator/render-frame.test.ts`
- Modify: `src/lib/generator/types.ts`

- [ ] **Step 1: Write failing render-frame tests**

Test:

- formatted text selection
- transparent vs solid background behavior
- preset style application
- anchor calculation usage

- [ ] **Step 2: Implement render input normalization**

Make the renderer take normalized settings and a frame/time input so it can be reused from preview and export.

- [ ] **Step 3: Implement minimal canvas drawing**

Support:

- optional background fill
- timer text draw
- optional stroke
- optional shadow / glow

- [ ] **Step 4: Keep React out of the renderer**

Ensure the file only depends on generator utilities and canvas-compatible inputs.

- [ ] **Step 5: Run the renderer tests**

Run: `pnpm test -- tests/generator/render-frame.test.ts`

Expected:
- Shared renderer tests pass.

## Task 4: Add the Generator Route and Shell Layout

**Files:**
- Create: `src/app/generator/page.tsx`
- Create: `src/components/generator/generator-shell.tsx`
- Create: `src/components/generator/control-panel.tsx`
- Create: `src/components/generator/preview-panel.tsx`
- Create: `src/components/generator/export-panel.tsx`
- Create: `src/components/generator/theme-preset-picker.tsx`

- [ ] **Step 1: Create the route entry and metadata**

Use the existing metadata conventions from `src/lib/site.ts`.

- [ ] **Step 2: Build the generator shell layout**

Implement:

- desktop three-column structure
- mobile stacked structure
- section labels that fit the existing visual language

- [ ] **Step 3: Build control groups**

Add controls for:

- duration
- display format
- resolution preset
- preset/theme
- placement
- transparency / solid background

Keep advanced controls collapsed or limited.

- [ ] **Step 4: Build the preview panel scaffold**

Add:

- canvas host
- play
- pause
- reset
- safe-area toggle

- [ ] **Step 5: Build the export panel scaffold**

Add:

- supported format selector
- FPS selector
- quality preset
- disabled states and explanatory copy

- [ ] **Step 6: Run lint**

Run: `pnpm lint`

Expected:
- Route and shell components lint cleanly.

## Task 5: Connect Live Preview to Shared Render Logic

**Files:**
- Modify: `src/components/generator/generator-shell.tsx`
- Modify: `src/components/generator/preview-panel.tsx`
- Modify: `src/lib/generator/render-frame.ts`
- Modify: `src/lib/generator/defaults.ts`

- [ ] **Step 1: Add local editor state management**

Use a single state source in the generator shell and pass only the needed slices down to child panels.

- [ ] **Step 2: Wire preview playback**

Implement:

- current preview time
- play / pause / reset transitions
- timer progression tied to duration

- [ ] **Step 3: Paint the preview canvas**

Use the shared frame renderer so preview output matches export output.

- [ ] **Step 4: Add safe-area overlay rendering**

Keep this UI-only overlay separate from export rendering so it does not leak into output files.

- [ ] **Step 5: Manually verify the preview loop**

Run: `pnpm dev`

Expected:
- `/generator` updates immediately as controls change
- play / pause / reset behave predictably

## Task 6: Add Browser Capability Detection and Export State UX

**Files:**
- Create: `src/lib/generator/feature-detection.ts`
- Modify: `src/components/generator/export-panel.tsx`
- Modify: `src/components/generator/generator-shell.tsx`

- [ ] **Step 1: Implement feature detection helpers**

Detect:

- browser support for `WebM`
- worker availability
- any APIs required by the chosen export path

- [ ] **Step 2: Define export warnings**

Map unsupported or risky states to user-facing messages, such as:

- "This browser does not support WebM export"
- "Current settings may be too expensive; try 720p or PNG sequence"

- [ ] **Step 3: Add disabled-state UX**

Disable formats that are definitely unsupported and explain why.

- [ ] **Step 4: Add settings-cost heuristics**

Estimate export risk using:

- duration
- resolution
- effect intensity
- chosen format

- [ ] **Step 5: Verify warning behavior**

Manually test at least:

- one supported format path
- one intentionally unsupported / downgraded path

## Task 7: Implement PNG Sequence Export

**Files:**
- Create: `src/lib/generator/export/job.ts`
- Create: `src/lib/generator/export/png-sequence.ts`
- Create: `src/workers/generator-export.worker.ts`
- Modify: `src/components/generator/export-panel.tsx`
- Modify: `src/components/generator/generator-shell.tsx`
- Modify: `package.json`

- [ ] **Step 1: Define worker message contracts**

Create typed messages for:

- export request
- progress update
- completion
- failure
- cancellation

- [ ] **Step 2: Implement PNG frame generation inside the worker**

Generate one frame at a time using the shared render pipeline.

- [ ] **Step 3: Package downloadable output**

Create a user-downloadable result that groups the generated PNG files in a predictable structure. If a small zip/archive dependency is needed, add the smallest practical option and document why it was chosen.

- [ ] **Step 4: Surface progress in the UI**

Show:

- current stage
- rough frame count progress
- completion state

- [ ] **Step 5: Manually verify PNG export**

Run: `pnpm dev`

Expected:
- Export completes without blocking the page
- User receives a usable PNG sequence artifact

## Task 8: Implement WebM Export

**Files:**
- Create: `src/lib/generator/export/webm.ts`
- Modify: `src/workers/generator-export.worker.ts`
- Modify: `src/lib/generator/feature-detection.ts`
- Modify: `src/components/generator/export-panel.tsx`

- [ ] **Step 1: Write a narrow support matrix in code comments**

Document exactly which browser capabilities are required so future format work does not guess.

- [ ] **Step 2: Implement WebM export adapter**

Reuse the shared export job orchestration and keep the output path isolated from PNG sequence behavior.

- [ ] **Step 3: Add browser fallback behavior**

If WebM is unsupported:

- keep PNG sequence enabled
- explain the fallback clearly

- [ ] **Step 4: Manually verify WebM export**

Run: `pnpm dev`

Expected:
- On a supported browser, export produces a downloadable WebM file.

## Task 9: Integrate the Generator into the Existing Public Site

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/components/site/site-header.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/site/home-hero.tsx`
- Modify: `src/components/site/home-final-cta.tsx`
- Modify: `README.md`

- [ ] **Step 1: Add the generator to primary navigation**

Keep labels clear and product-facing.

- [ ] **Step 2: Update homepage CTAs**

Route users into the real generator without breaking the Q&A / workflow guidance structure.

- [ ] **Step 3: Update homepage messaging carefully**

Make sure copy reflects:

- the product is now live
- exports are local-first
- supported formats are limited to the MVP set

- [ ] **Step 4: Update docs**

Add README notes for:

- `/generator`
- local-first rendering rationale
- currently supported export formats

- [ ] **Step 5: Run lint**

Run: `pnpm lint`

Expected:
- Site integration changes lint cleanly.

## Task 10: Stabilization, Manual QA, and Launch Guardrails

**Files:**
- Modify: `README.md`
- Modify: any generator files needed for final fixes

- [ ] **Step 1: Add lightweight manual QA checklist to README or project notes**

Include:

- horizontal transparent export
- vertical transparent export
- solid background export
- PNG sequence export
- WebM export

- [ ] **Step 2: Run full lint pass**

Run: `pnpm lint`

Expected:
- Entire project lints cleanly.

- [ ] **Step 3: Run manual browser QA**

Verify:

- responsive layout
- export progress behavior
- useful errors for unsupported settings
- preview remains interactive outside active export work

- [ ] **Step 4: Make final scope cut if needed**

If any format path is unstable, keep:

- `PNG sequence` required
- `WebM` only if stable on the release browser target

- [ ] **Step 5: Prepare focused commit series**

Suggested commit sequence:

- `feat: add generator domain model and renderer`
- `feat: add local-first generator route`
- `feat: add client-side export pipeline`
- `feat: integrate generator into site navigation`

## Notes for Execution

- Do not add server-side rendering jobs unless the requirements change.
- Do not promise `MP4`, `MOV`, or uploaded-video compositing in this plan.
- Keep the renderer independent from React.
- Prefer simple, deterministic presets over an open-ended style system.
- If client-side packaging becomes unstable, keep the release centered on the most reliable local export path rather than widening format support.
