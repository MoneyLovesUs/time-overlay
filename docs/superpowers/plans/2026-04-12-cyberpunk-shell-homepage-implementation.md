# Cyberpunk Shell and Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the balanced cyberpunk / glitch design system to the public shell and homepage of `time-overlay` while preserving the current SEO structure and content readability.

**Architecture:** Centralize the new visual language in global tokens and reusable utilities first, then refactor the shell and homepage sections to consume those shared styles. Preserve the current App Router structure, metadata helpers, and homepage SEO hierarchy while regrouping homepage sections into a more deliberate visual sequence.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, `shadcn/ui` base-nova, CSS variables in `globals.css`

---

### Task 1: Establish Cyberpunk Tokens and Global Utilities

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace neutral page tokens with the balanced cyberpunk palette**

Update the CSS variables in `src/app/globals.css` for:

- background / foreground
- card / muted surfaces
- primary / secondary / tertiary accents
- border / input / ring

Keep the system driven by CSS variables so the rest of the app can inherit the new theme.

- [ ] **Step 2: Add global effect tokens**

Add CSS custom properties for:

- neon glow shadows
- secondary and tertiary glows
- scanline opacity / texture
- technical grid background

- [ ] **Step 3: Add reusable shell/homepage utility classes**

Add small reusable classes such as:

- `.cyber-panel`
- `.cyber-panel-muted`
- `.cyber-chamfer`
- `.cyber-glitch`
- `.cyber-grid`
- `.cyber-scanlines`

Use utilities that can style multiple homepage sections later, not one-off section selectors.

- [ ] **Step 4: Add reduced-motion handling**

Wrap glitch/scanline movement behavior with `prefers-reduced-motion` fallbacks so visual flair does not become an accessibility regression.

- [ ] **Step 5: Verify the token layer**

Run: `pnpm lint`
Expected: no lint issues after CSS updates.

### Task 2: Refactor the Public Shell

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/site/site-header.tsx`
- Modify: `src/components/site/site-footer.tsx`

- [ ] **Step 1: Add global atmosphere in the layout**

Update `src/app/layout.tsx` so the page frame includes:

- dark background plane
- subtle grid / scanline texture layer
- low-opacity neon radial glows

Keep this decorative infrastructure in the shell, not in each page component.

- [ ] **Step 2: Refactor the header into a HUD bar**

Update `src/components/site/site-header.tsx` to use:

- tighter technical spacing
- stronger brand marker
- uppercase / tracked nav styling
- cyber panel framing instead of neutral borders

Maintain crawlable `Link` navigation and existing route structure.

- [ ] **Step 3: Refactor the footer into a terminal rail**

Update `src/components/site/site-footer.tsx` to feel like a low-profile terminal/status area:

- technical separators
- reduced contrast
- stronger monospace / label styling

Keep the existing content responsibilities intact.

- [ ] **Step 4: Verify the shell**

Run: `pnpm lint`
Expected: shell changes compile cleanly.

### Task 3: Recompose the Homepage Into the New Visual Sequence

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/site/home-hero.tsx`
- Modify: `src/components/site/home-use-cases.tsx`
- Modify: `src/components/site/home-benefits.tsx`
- Modify: `src/components/site/home-how-preview.tsx`
- Modify: `src/components/site/home-faq-preview.tsx`
- Modify: `src/components/site/home-final-cta.tsx`

- [ ] **Step 1: Keep the page as an assembler**

Update `src/app/page.tsx` to preserve the current metadata/H1 structure while reordering the homepage into:

- Hero HUD
- Signal Grid
- Workflow Terminal
- FAQ Feed
- Final CTA Beacon

- [ ] **Step 2: Refactor the hero into the dominant cyberpunk anchor**

Update `src/components/site/home-hero.tsx` to include:

- glitch-treated heading
- stronger left/right split
- command-style CTA treatment
- technical HUD generator panel
- restrained signal/status strip

Keep the page readable and avoid overstating unfinished product behavior.

- [ ] **Step 3: Merge use-cases and benefits into a signal-grid rhythm**

Refactor `home-use-cases.tsx` and `home-benefits.tsx` so together they feel like one asymmetrical signal-grid system rather than two generic stacked sections.

- [ ] **Step 4: Turn the workflow preview into a terminal rail**

Refactor `home-how-preview.tsx` so the three-step teaser feels like execution checkpoints or a process log rather than standard feature cards.

- [ ] **Step 5: Turn the FAQ preview into a signal feed**

Refactor `home-faq-preview.tsx` into a high-contrast but readable feed of intercepted knowledge items.

- [ ] **Step 6: Turn the final CTA into a beacon strip**

Refactor `home-final-cta.tsx` into a command-strip style close with stronger hierarchy and glow emphasis than the current neutral block.

- [ ] **Step 7: Verify homepage assembly**

Run: `pnpm lint`
Expected: homepage changes compile cleanly.

### Task 4: Tune Primitive Usage and Interaction Details

**Files:**
- Modify: `src/components/site/home-hero.tsx`
- Modify: `src/components/site/home-how-preview.tsx`
- Modify: `src/components/site/home-final-cta.tsx`
- Optional modify: `src/components/ui/button.tsx`

- [ ] **Step 1: Audit Button usage against the new design language**

Try to achieve the new look through class composition first.

- [ ] **Step 2: Only if necessary, make minimal button primitive updates**

If the homepage cannot express the required balanced cyberpunk button treatment through section-level composition alone, make the smallest safe update in `src/components/ui/button.tsx`.

- [ ] **Step 3: Add restrained interaction effects**

Apply:

- light glitch/chromatic effect on the hero headline
- hover neon pulse on CTAs
- subtle panel hover lift/glow where it sharpens hierarchy

Avoid noisy motion on body content.

- [ ] **Step 4: Verify component behavior**

Run: `pnpm lint`
Expected: no lint issues after interaction/style refinements.

### Task 5: Final Verification and Documentation Check

**Files:**
- Modify: `README.md` only if implementation changes should update design-system conventions

- [ ] **Step 1: Verify homepage/readability balance**

Run: `pnpm build`
Expected: successful production build with `/`, `/qa`, and `/how-it-works` still generated cleanly.

- [ ] **Step 2: Run the dev server for runtime inspection**

Run: `pnpm dev`
Expected: app starts successfully on an available local port.

- [ ] **Step 3: Manually inspect the shell and homepage**

Confirm:

- headline remains readable
- scanlines and grid feel subtle, not noisy
- navigation/footer stay legible
- homepage sections still support scanning and SEO content consumption
- mobile stacking still looks intentional

- [ ] **Step 4: Update README only if implementation introduced new reusable styling conventions**

If the redesign adds durable shell/homepage utility conventions worth documenting, add a short note. Otherwise leave README unchanged.

- [ ] **Step 5: Final pass**

Run: `pnpm lint`
Expected: pass.
