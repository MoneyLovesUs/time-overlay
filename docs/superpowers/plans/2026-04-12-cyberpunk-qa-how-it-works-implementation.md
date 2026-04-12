# Cyberpunk Q&A and How-It-Works Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `/qa` and `/how-it-works` into the same balanced cyberpunk system as the public shell and homepage while preserving search-friendly readability.

**Architecture:** Reuse the existing token layer and shell language from the homepage redesign, then restyle the Q&A page as a knowledge terminal and the How-it-works page as a process console. Keep metadata, route structure, and anchor helpers intact unless a small consistency adjustment is clearly needed.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, `shadcn/ui` base-nova, shared cyberpunk utilities in `globals.css`

---

### Task 1: Redesign the Q&A route shell and entry section

**Files:**
- Modify: `src/app/qa/page.tsx`

- [ ] **Step 1: Refactor the top section into a knowledge-terminal intro**

Keep the current H1 and metadata intent, but redesign the opening section so it feels like a system intro panel rather than a light marketing block.

- [ ] **Step 2: Redesign the jump-link navigation**

Turn the existing group links into indexed terminal-style route selectors while preserving plain `Link` navigation and anchor behavior.

- [ ] **Step 3: Refactor the closing CTA block**

Bring the bottom section into the same cyberpunk language and keep the route choices clear.

- [ ] **Step 4: Verify route shell**

Run: `pnpm lint`
Expected: Q&A page shell changes compile cleanly.

### Task 2: Redesign Q&A content panels

**Files:**
- Modify: `src/components/site/qa-section.tsx`
- Modify: `src/components/site/qa-content.ts` only if presentation-specific support data is needed

- [ ] **Step 1: Turn group sections into topic channels**

Update the group layout so the intro side and question feed feel like a terminal knowledge channel rather than a neutral two-column doc section.

- [ ] **Step 2: Restyle question cards**

Question cards should use the cyber panel language, sharper hierarchy, and slightly denser terminal framing without harming readability.

- [ ] **Step 3: Verify text-first readability**

Ensure the page still reads as a Q&A destination, not as decorative chrome with text inside.

- [ ] **Step 4: Verify**

Run: `pnpm lint`
Expected: Q&A content still compiles cleanly.

### Task 3: Redesign the How-It-Works route shell

**Files:**
- Modify: `src/app/how-it-works/page.tsx`

- [ ] **Step 1: Refactor the top section into an operator briefing**

Keep the H1 and metadata intent, but redesign the opening section into a stronger process-console introduction.

- [ ] **Step 2: Restyle top jump links**

Turn the section jump links into more technical process selectors.

- [ ] **Step 3: Refactor the closing route block**

Make the final route choices consistent with the redesigned system.

- [ ] **Step 4: Verify route shell**

Run: `pnpm lint`
Expected: page shell changes compile cleanly.

### Task 4: Redesign process and app-target sections

**Files:**
- Modify: `src/components/site/process-steps.tsx`
- Modify: `src/components/site/how-it-works-content.ts` only if presentation support data is needed
- Modify: `src/app/how-it-works/page.tsx`

- [ ] **Step 1: Turn `ProcessSteps` into a process console**

Preserve the process content, but make the component feel more like an execution/control rail than a neutral white-card grid.

- [ ] **Step 2: Turn the editing workflow section into destination modules**

Restyle the app-target links and cards so they feel like deployment targets / route modules rather than plain chips and cards.

- [ ] **Step 3: Preserve clarity about editors vs publishing platforms**

Keep the existing distinction between import targets and publishing workflows explicit.

- [ ] **Step 4: Verify**

Run: `pnpm lint`
Expected: process/app-target changes compile cleanly.

### Task 5: Final verification across all public pages

**Files:**
- Modify: `README.md` only if new durable conventions are introduced

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: `/`, `/qa`, and `/how-it-works` build successfully.

- [ ] **Step 2: Run dev server**

Run: `pnpm dev`
Expected: local server starts on an available port.

- [ ] **Step 3: Verify public-page coherence**

Check that:

- shell matches all three pages
- homepage, Q&A, and How-it-works feel like one system
- Q&A remains highly readable
- How-it-works still reads as an operational guide

- [ ] **Step 4: Update README only if needed**

Document any new reusable patterns only if the implementation introduced them.

- [ ] **Step 5: Final lint pass**

Run: `pnpm lint`
Expected: pass.
