# Overlay Timer Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first SEO-ready site structure for `time-overlay`, including a homepage, Q&A page, How it works page, and shared metadata/navigation shell.

**Architecture:** Use App Router pages for the three public routes, a small set of reusable site components for header/footer/content sections, and a shared metadata helper so titles, descriptions, and canonicals stay consistent. Keep the homepage product-shaped with a static generator mockup, but avoid implementing real timer export behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, `shadcn/ui` base components

---

### Task 1: Establish shared site metadata and route shell

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/components/site/site-header.tsx`
- Create: `src/components/site/site-footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create site configuration**

Add a shared config object in `src/lib/site.ts` for:

- site name
- site URL from environment fallback
- default description
- nav items for `Home`, `Q&A`, and `How it works`

- [ ] **Step 2: Create a reusable header**

Implement `src/components/site/site-header.tsx` with crawlable links for the three routes and a compact brand area.

- [ ] **Step 3: Create a reusable footer**

Implement `src/components/site/site-footer.tsx` with repeated route links, a short site summary, and placeholder legal links.

- [ ] **Step 4: Update the root layout**

Use the shared site config in `src/app/layout.tsx` to set:

- `metadataBase`
- title template
- default description
- alternates / canonical foundation

Wrap page content with the new header and footer.

- [ ] **Step 5: Verify shell compiles**

Run: `pnpm lint`
Expected: no ESLint errors after shared shell changes.

### Task 2: Build the homepage with a static generator mockup

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/site/home-hero.tsx`
- Create: `src/components/site/home-use-cases.tsx`
- Create: `src/components/site/home-benefits.tsx`
- Create: `src/components/site/home-how-preview.tsx`
- Create: `src/components/site/home-faq-preview.tsx`
- Create: `src/components/site/home-final-cta.tsx`

- [ ] **Step 1: Replace the starter page with homepage composition**

Make `src/app/page.tsx` a page assembler that renders the homepage sections in order instead of keeping all content inline.

- [ ] **Step 2: Implement the hero**

Create `src/components/site/home-hero.tsx` with:

- an H1 containing `overlay timer`
- supporting paragraph covering transparent and video-overlay use cases
- primary CTA and secondary CTA
- a static generator mockup with duration, style, format, and font controls

- [ ] **Step 3: Add use-case and benefits sections**

Create `home-use-cases.tsx` and `home-benefits.tsx` for creator workflows and core product benefits.

- [ ] **Step 4: Add internal-link support sections**

Create `home-how-preview.tsx`, `home-faq-preview.tsx`, and `home-final-cta.tsx` so the homepage links into `/how-it-works` and `/qa` with descriptive anchors.

- [ ] **Step 5: Add homepage metadata**

Set page-specific metadata in `src/app/page.tsx` using the shared site config:

- unique title
- unique description
- canonical for `/`

- [ ] **Step 6: Verify the homepage**

Run: `pnpm lint`
Expected: homepage sections compile cleanly and metadata exports are valid.

### Task 3: Build the Q&A page

**Files:**
- Create: `src/app/qa/page.tsx`
- Create: `src/components/site/qa-section.tsx`

- [ ] **Step 1: Add the route**

Create `src/app/qa/page.tsx` with a complete page, not a placeholder paragraph.

- [ ] **Step 2: Group the Q&A content**

Create `src/components/site/qa-section.tsx` or keep a local helper to render grouped question sections:

- Basics
- Customization
- Export and editing
- TikTok / YouTube use cases

- [ ] **Step 3: Add internal links**

Link back to the homepage and the How it works page using descriptive anchor text.

- [ ] **Step 4: Add page metadata**

Set a unique title, description, and canonical for `/qa`.

- [ ] **Step 5: Verify the Q&A page**

Run: `pnpm lint`
Expected: new route and Q&A content compile without lint issues.

### Task 4: Build the How it works page

**Files:**
- Create: `src/app/how-it-works/page.tsx`
- Create: `src/components/site/process-steps.tsx`

- [ ] **Step 1: Add the route**

Create `src/app/how-it-works/page.tsx` with a strong intro and creator-oriented workflow.

- [ ] **Step 2: Add the process component**

Create `src/components/site/process-steps.tsx` for the three-step flow:

1. Enter duration
2. Choose style and format
3. Download and import into your editor

- [ ] **Step 3: Add editing workflow copy**

Include a short section on using the final overlay in CapCut, Premiere Pro, Final Cut Pro, TikTok, or YouTube workflows.

- [ ] **Step 4: Add internal links and metadata**

Link to `/` and `/qa`, and set unique title, description, and canonical for `/how-it-works`.

- [ ] **Step 5: Verify the page**

Run: `pnpm lint`
Expected: no lint issues and route compiles correctly.

### Task 5: SEO refinement and verification

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/qa/page.tsx`
- Modify: `src/app/how-it-works/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Audit headings and metadata**

Confirm each page has:

- one clear H1
- unique title
- unique description
- canonical path

- [ ] **Step 2: Audit internal links**

Confirm the header, footer, and body links are plain anchor-based navigation and use descriptive anchor text.

- [ ] **Step 3: Update README conventions if needed**

Add a short note about shared SEO metadata patterns and where to add future public pages.

- [ ] **Step 4: Run lint**

Run: `pnpm lint`
Expected: pass.

- [ ] **Step 5: Run production build**

Run: `pnpm build`
Expected: pass, with the three public pages statically generated or otherwise building cleanly.

- [ ] **Step 6: Review output manually**

Run: `pnpm dev`
Expected: local verification of:

- homepage hierarchy
- Q&A readability
- How it works scannability
- shared navigation consistency
