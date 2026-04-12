# Cyberpunk Q&A and How-It-Works Redesign

## Summary

The public shell and homepage have already been moved to the balanced cyberpunk system. The next phase is to bring `/qa` and `/how-it-works` into the same visual world without collapsing their readability.

These two pages should not become copies of the homepage. They need distinct roles:

- `/qa` becomes a knowledge terminal / signal archive
- `/how-it-works` becomes an operator manual / process console

Both pages should inherit the shell’s dark-neon language, chamfered panels, scanline/grid atmosphere, and monospace instrumentation, while keeping content hierarchy extremely clear.

## Scope

### In scope

- `/qa` page visual redesign
- `/how-it-works` page visual redesign
- supporting content/presentation components under `src/components/site`
- minimal shared helper changes if needed for style consistency or anchor/link reuse

### Out of scope

- homepage redesign further than what is already shipped
- new product functionality
- SEO metadata architecture changes beyond page-specific tuning if needed
- major shell refactors

## Goals

### Experience goal

Make the remaining public pages feel like they belong to the same cyberpunk system as the homepage, not like older pages still waiting to be migrated.

### Content goal

Preserve the pages’ usefulness as search destinations:

- Q&A must stay easy to skim
- How it works must stay procedural and trustworthy

### System goal

Reuse the new token and utility layer from `globals.css` instead of inventing page-local effect stacks.

## Design Direction

### Q&A page

This page should feel like a terminal-based knowledge relay:

- grouped knowledge blocks
- narrow, bright labels
- feed-like question cards
- section jumps that feel like indexed terminal commands

It should not feel like:

- a blog FAQ page
- a support-center accordion
- a stack of identical marketing cards

### How-it-works page

This page should feel like a process console:

- clear route marker at the top
- operational summary panel
- step flow that feels sequential and procedural
- editing workflow section that reads like deployment targets or route modules

It should not feel like:

- generic product documentation
- a card grid with process text pasted onto it

## Current System Constraints

- `globals.css` already defines the balanced cyberpunk palette and reusable utilities
- shell is already in the new style
- page metadata and canonical handling already use `createPageMetadata()`
- anchor/link wiring already exists through `home-links.ts`

The redesign should work with those systems, not bypass them.

## Page-Specific Design

### `/qa`: Knowledge Terminal

#### Top section

The opening block should feel like a system intro panel:

- compact page kicker
- strong H1
- short explanation of what this page helps resolve
- side panel for quick route choices back to home/workflow

#### Section navigation

The existing group jump links should be redesigned as indexed terminal tabs or route selectors, not soft bordered pills.

#### Group sections

Each Q&A group should feel like a topic channel:

- section intro on the left
- question feed on the right
- question cards feel like terminal records or intercepted nodes

The question cards should use:

- chamfered or technical framing
- restrained hover/focus emphasis
- dense but readable text rhythm

#### Key design rule

Each question card should still be primarily text. Do not let ornament beat comprehension.

### `/how-it-works`: Process Console

#### Top section

The top section should behave like an operator briefing:

- intro summary
- quick route buttons
- compact “at a glance” module that looks like a command console

#### Section jumps

The three top jump links should become process tabs / route selectors, more technical than the current neutral pills.

#### `ProcessSteps`

The main process section should be one of the clearest, strongest-looking parts of the site. It already has strong information architecture; the redesign should make it feel more like a rail or control surface than a white card grid.

#### Editing workflow section

This section should become a deployment target board:

- app links feel like target selectors
- app cards feel like destination modules
- clearer distinction between editors and publishing platforms remains important

## Shared Visual Rules

### Typography

- keep headings strong and display-oriented
- keep body text highly readable
- use monospace mostly for labels, ids, commands, and support rails

### Panels

- use `.cyber-panel` and `.cyber-panel-muted` as the first choice
- use chamfering where it sharpens the aesthetic
- avoid identical panels repeated with no hierarchy shift

### Motion

- very restrained
- hover/focus emphasis only where it helps scanning
- no glitch on body paragraphs

### Color

- use green as primary action/signal
- use cyan for informational rails and secondary technical emphasis
- use magenta sparingly for contrast or atmospheric accents

## Risks

### Risk: content pages become too decorative

Mitigation:

- keep body copy calm
- let labels/borders/panels carry the style

### Risk: Q&A loses scanability

Mitigation:

- question cards must remain text-first
- maintain strong H2/H3 progression
- avoid heavy nested decoration inside every answer block

### Risk: How-it-works becomes visually repetitive

Mitigation:

- top briefing, process rail, and app targets must each have different composition logic

## Success Criteria

This redesign is successful if:

- `/qa` and `/how-it-works` now clearly belong to the same world as the homepage
- both pages remain easier to read than the homepage, not harder
- shell/homepage utility classes are reused rather than copied
- the final site feels coherent across all three public routes
