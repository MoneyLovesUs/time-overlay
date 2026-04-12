# Cyberpunk Shell and Homepage Redesign

## Summary

This redesign applies the provided cyberpunk / glitch design system to the public shell and homepage of `time-overlay`, while deliberately leaving `/qa` and `/how-it-works` content layouts for a later pass.

The implementation target is not a maximalist visual stunt page. It is a balanced, readable cyberpunk interface for an SEO-first tools site:

- dark-only visual system
- neon-accented interface language
- restrained glitch treatment
- scanline and grid texture for depth
- chamfered technical panels instead of soft marketing cards
- strong typographic hierarchy that remains readable for search-oriented content

## Scope

### In scope

- global public shell
- homepage visual redesign
- token system update in `globals.css`
- header/footer redesign
- homepage section regrouping and restyling
- reusable shell/panel utilities that can support future page redesigns

### Out of scope

- `/qa` page layout redesign
- `/how-it-works` page layout redesign
- new product functionality
- generator interactivity
- animation-heavy hero experiments that compromise readability

## Goals

### Experience goal

Make the site feel like a hacked creator tool terminal rather than a generic startup landing page.

### Visual goal

Deliver a balanced cyberpunk/glitch presentation:

- strong mood
- memorable silhouette
- real depth
- enough restraint to keep the homepage readable and indexable

### Systems goal

Centralize the visual language in tokens and reusable utilities so later redesigns of `/qa` and `/how-it-works` reuse the same design DNA.

## Design Direction

### Positioning

The site should feel like a black-market interface for creators:

- part editing console
- part neon HUD
- part corrupted signal feed

It should not feel like:

- a game dashboard
- a generic hacker toy
- a fully animated sci-fi concept site

### Intensity

Use the `Balanced` version of the cyberpunk system:

- black background
- electric green primary neon
- cyan and magenta as supporting accents only
- subtle scanlines
- occasional glitch treatment on major headings
- strong technical framing

The page must remain easy to scan on desktop and mobile.

## Current System Model

### Tech stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- `shadcn/ui` with `base-nova` style
- `@base-ui/react` primitives

### Current design system constraints

- tokens already live in `src/app/globals.css`
- page shell already exists in `src/app/layout.tsx`
- homepage is decomposed into reusable site sections under `src/components/site`
- SEO metadata and canonical handling already use shared utilities in `src/lib/site.ts`

### Architectural constraint

The redesign must preserve:

- current metadata model
- internal linking structure
- page-level H1/H2 hierarchy
- server-component-first composition

## Redesign Strategy

The redesign should be implemented in four layers.

### 1. Token Layer

Files:

- `src/app/globals.css`

Responsibilities:

- replace current neutral-light token mood with dark-only cyberpunk tokens
- define the page void background and panel surfaces
- define neon accent tokens and glow tokens
- define scanline and grid texture utilities
- define chamfer and glitch helper classes
- add reduced-motion handling for glitch effects

### 2. Shell Layer

Files:

- `src/app/layout.tsx`
- `src/components/site/site-header.tsx`
- `src/components/site/site-footer.tsx`

Responsibilities:

- turn header into a compact HUD strip
- turn footer into a low-profile terminal rail
- add global background atmosphere at layout level
- keep navigation clear and crawlable

### 3. Homepage Layer

Files:

- `src/app/page.tsx`
- `src/components/site/home-hero.tsx`
- `src/components/site/home-use-cases.tsx`
- `src/components/site/home-benefits.tsx`
- `src/components/site/home-how-preview.tsx`
- `src/components/site/home-faq-preview.tsx`
- `src/components/site/home-final-cta.tsx`

Responsibilities:

- reorganize homepage sections into a stronger visual cadence
- preserve homepage SEO messaging and H1 structure
- shift visual emphasis from “content boxes” to “signal panels”

### 4. Primitive Layer

Primary target:

- use existing `shadcn/ui` primitives where possible
- avoid rewriting the button unless clearly necessary
- prefer reusable utility classes over one-off component-local decoration

## Token System

### Core palette

Adopt the supplied design-system palette with modest adaptation for the current codebase:

- background: `#0a0a0f`
- foreground: `#e0e0e0`
- card: `#12121a`
- muted: `#1c1c2e`
- muted foreground: `#6b7280`
- primary accent: `#00ff88`
- secondary accent: `#ff00ff`
- tertiary accent: `#00d4ff`
- border: `#2a2a3a`
- destructive: `#ff3366`

### Typography

Introduce a two-tier typography system:

- headings: futuristic display stack
- body: monospace-first readable stack

Intent:

- headings feel synthetic and authored
- body still feels like a usable creator tool, not a poster

### Effects

Add reusable variables/utilities for:

- neon glow
- small neon glow
- large neon glow
- chromatic text-shadow
- scanline overlay
- grid background
- chamfered panel clipping

## Shell Design

### Header

The header should become a compact HUD band:

- low height
- technical border treatment
- small glowing brand marker
- narrow, uppercase-ish nav labels
- quiet by default, brighter on hover

It should feel like instrumentation, not a marketing navbar.

### Footer

The footer should become a terminal rail:

- lower contrast than the hero
- compact information density
- route links, site summary, and legal placeholder copy
- subtle separators, not heavy block cards

## Homepage Structure

The homepage should be reorganized into five major beats.

### 1. Hero HUD

This remains the first-screen anchor.

Composition:

- 60/40 split
- left side: headline, short value proposition, CTA cluster, status strip
- right side: generator HUD panel

Visual requirements:

- glitched or chromatically shifted headline
- dark neon panel treatment
- scanline texture inside the preview surface
- believable tool controls

Content rule:

Do not change the core SEO promise. The H1 still needs to work as the keyword landing statement.

### 2. Signal Grid

This combines the current “use cases” and “benefits” into a tighter system.

Layout:

- one larger dominant signal panel
- two or three smaller support panels
- asymmetry in width/height

Purpose:

- answer “who uses this” and “why it matters” together
- avoid the generic feature-card look

### 3. Workflow Terminal

This replaces the current conventional workflow preview with a more system-like presentation.

Characteristics:

- step markers feel like terminal checkpoints
- structure remains highly scannable
- descriptive link to the full workflow guide remains prominent

### 4. FAQ Feed

The FAQ preview should feel like extracted knowledge fragments.

Characteristics:

- compact bordered entries
- log-feed / signal-feed feel
- readable hover states
- no gimmicky distortion on body copy

### 5. Final CTA Beacon

The closing CTA should feel like a lit command strip, not a soft banner card.

Purpose:

- reinforce the product direction
- drive users toward workflow or Q&A
- end the page with a high-contrast action block

## Visual Rules

### Mandatory

- dark-only shell
- scanline treatment at page level or shell level
- visible grid/circuit texture in at least one major background plane
- chamfered panel shapes on major containers
- at least one heading with restrained glitch/chromatic treatment
- real neon glow on key accents

### Forbidden

- generic pastel cards
- soft rounded marketing sections as the dominant shape language
- heavy glitch on paragraph text
- multiple equally loud accent colors in the same block
- over-animated hero

## Accessibility and Performance

### Accessibility

- maintain strong contrast for all body text
- preserve visible focus states
- use `prefers-reduced-motion` to disable aggressive glitch behavior
- keep CTA sizes and tap targets mobile-safe

### Performance

- keep box-shadow stacks limited to meaningful highlights
- use CSS-based effects rather than image textures where practical
- avoid putting expensive animation on many nodes at once

## Responsiveness

### Mobile

- keep hero text readable before the panel
- stack shell content cleanly
- preserve scanline/grid effects at lower intensity
- do not allow decorative framing to compress body copy too much

### Desktop

- use the hero split fully
- allow asymmetry in the signal grid
- keep the page feeling like one cohesive world rather than separate cards

## File-Level Plan

### `src/app/globals.css`

Add:

- dark cyberpunk tokens
- glow variables
- scanline/grid utilities
- chamfer utilities
- glitch utility
- reduced-motion rules

### `src/app/layout.tsx`

Add:

- background atmosphere wrapper
- shell-level decorative layers only

Do not:

- add page-specific content logic

### `src/components/site/site-header.tsx`

Refactor to:

- HUD-style bar
- stronger brand chip
- more technical nav presentation

### `src/components/site/site-footer.tsx`

Refactor to:

- terminal/footer rail
- lower-contrast but still thematic support zone

### `src/app/page.tsx`

Keep:

- page assembly role

Change:

- section ordering and grouping to match the redesigned homepage cadence

### `src/components/site/home-hero.tsx`

Refactor heavily:

- glitch heading
- HUD panel
- stronger CTA presentation

### `src/components/site/home-use-cases.tsx`
### `src/components/site/home-benefits.tsx`

Refactor together so they behave as one signal-grid system.

### `src/components/site/home-how-preview.tsx`

Refactor into workflow-terminal presentation.

### `src/components/site/home-faq-preview.tsx`

Refactor into FAQ feed / signal-list presentation.

### `src/components/site/home-final-cta.tsx`

Refactor into command-strip style closing block.

## Risks

### Risk: readability collapse

If the cyberpunk system is pushed too far, the page becomes a visual demo instead of a usable landing page.

Mitigation:

- apply strongest effects to headers, panels, and CTA edges
- keep paragraphs clean

### Risk: token drift

If panel effects are implemented ad hoc in each section, the system becomes unmaintainable.

Mitigation:

- move shared effects into global utility classes

### Risk: homepage becomes over-segmented

If every block becomes its own decorative device, the page loses rhythm.

Mitigation:

- keep only five major beats
- make each section do one job

## Success Criteria

The redesign is successful if:

- the site immediately reads as cyberpunk/glitch without becoming noisy
- the shell and homepage feel like one coherent interface
- SEO content remains readable
- the implementation leaves reusable tokens/utilities behind for later `/qa` and `/how-it-works` redesign work
- the page looks intentional on both mobile and desktop
