# Overlay Timer SEO Site Design

## Summary

`time-overlay` should launch as an SEO-first tools site built around the primary keyword `overlay timer`.

The first version should not try to ship the real timer-video generation workflow yet. Instead, it should establish a strong search-friendly site structure with a convincing product-shaped homepage:

- Home page with a static generator mockup
- Q&A page for search-intent capture
- How it works page for process intent and internal linking
- Shared header/footer
- Strong metadata, canonical handling, and crawlable internal links

This gives the project a usable content foundation now and leaves a clean path to add the real generator later without rewriting the information architecture.

## Goals

### Primary business goal

Capture search traffic from creators looking for an overlay timer or countdown overlay asset, then convert that traffic into future tool usage and downloads.

### Primary SEO goal

Own the highest-intent search intent around `overlay timer` while also covering adjacent creator queries:

- `overlay timer`
- `countdown timer overlay`
- `video countdown overlay`
- `transparent countdown timer overlay`
- `overlay timer for TikTok`
- `overlay timer for YouTube videos`

### Product goal for v1

Make the site feel like a real tool, not a thin blog. The homepage should show a believable generator workflow even before the real rendering pipeline exists.

## Non-Goals

The first version should not include:

- Real timer rendering or video export
- Accounts or saved presets
- Payments
- Style marketplace or template library
- Programmatic SEO page explosion

## Search Intent Model

The keyword strategy should map pages to distinct intent instead of forcing one page to rank for everything.

### Home page intent

The homepage should target transactional or tool-seeking intent:

- users looking for an `overlay timer`
- users wanting a downloadable countdown overlay for video editing
- users comparing transparent timer assets or simple overlay tools

### Q&A page intent

The Q&A page should target informational and objection-handling intent:

- what an overlay timer is
- whether it supports transparent backgrounds
- whether it works for TikTok, YouTube, CapCut, Premiere Pro, Final Cut Pro, and similar tools
- what formats, durations, fonts, and styles matter

### How it works page intent

The How it works page should target process intent:

- how to create a countdown overlay
- how to customize timer styles
- how to download and place an overlay timer into video editing software

## Site Architecture

The site structure should stay intentionally small.

### Routes

- `/` — homepage / primary landing page
- `/qa` — Q&A / FAQ content page
- `/how-it-works` — workflow and usage page

### Shared shell

- Global header with logo and the three core page links
- Global footer with page links, concise site explanation, and future legal-link slots

### Internal linking strategy

Every page should link to the other two pages using crawlable `<a href="...">` links with descriptive anchor text.

Examples:

- homepage links to `overlay timer questions and answers`
- homepage links to `how the overlay timer generator works`
- Q&A links back to `overlay timer homepage`
- Q&A links to `how to create a countdown timer overlay`
- How it works links to `overlay timer FAQ`

This follows Google's guidance that internal links should be crawlable and descriptive, not JS-only or vague anchors. Source: Google Search Central link best practices.

## Homepage Design

The homepage should be the strongest commercial page on the site. It needs to satisfy both humans and search engines without reading like keyword spam.

### Homepage core message

The page should position the product as a fast tool for creators who need transparent or ready-to-use countdown overlays for short-form or long-form video.

### Recommended homepage structure

#### 1. Hero

Purpose:

- establish the primary keyword
- communicate the value proposition in one screen
- show the static generator mockup immediately

Required content:

- H1 containing `overlay timer`
- short supporting paragraph that also references countdown video overlays and transparent use cases
- primary CTA for future generator action
- secondary CTA to learn how it works
- static generator mockup with fields for:
  - duration
  - minutes/seconds display format
  - style preset
  - font choice
  - preview state
  - disabled `Download overlay` button

#### 2. Use Cases / Platform fit

Purpose:

- widen intent coverage without fragmenting the page
- reassure users that this tool is for creator workflows

Content themes:

- TikTok videos
- YouTube videos
- Reels / Shorts
- CapCut / Premiere Pro / Final Cut workflows

#### 3. Why this tool section

Purpose:

- explain the outcome users actually want
- tie together transparency, clean styling, and editor-ready assets

Suggested benefit cards:

- Transparent overlay ready for layering
- Fast countdown customization
- Clean export for editing software

#### 4. How it works preview

Purpose:

- preview the `/how-it-works` page
- create internal linking

Suggested three-step summary:

1. Enter the countdown duration
2. Pick style, format, and font
3. Download the overlay and import it into your editor

#### 5. FAQ preview

Purpose:

- introduce long-tail terms and objections on the homepage
- link to `/qa`

Suggested homepage preview questions:

- What is an overlay timer?
- Can I create a transparent countdown overlay?
- Will it work in TikTok or YouTube videos?

#### 6. Final CTA

Purpose:

- repeat intent in plain language
- create a clean conversion endpoint

## Q&A Page Design

The Q&A page should be content-heavy, structured, and useful enough to rank independently.

### Page objective

Answer the practical questions creators ask before trusting a timer-overlay tool.

### Content structure

Use grouped Q&A sections instead of one long undifferentiated FAQ wall.

Suggested section groups:

- Basics
- Customization
- Export and editing
- Use cases for TikTok and YouTube

Suggested questions:

- What is an overlay timer?
- What is the difference between an overlay timer and a countdown timer video?
- Can I make a transparent countdown overlay?
- Can I choose seconds, minutes, and time format?
- Can I change the font and timer style?
- How do I add an overlay timer to a TikTok or YouTube video?
- Will the exported timer work in CapCut, Premiere Pro, or Final Cut Pro?

### UX considerations

- keep each answer short, direct, and scannable
- use descriptive H2 and H3 headings
- include internal links back to the homepage and How it works page

## How It Works Page Design

This page should translate the product promise into a simple creator workflow.

### Page objective

Explain the future tool flow in a way that feels concrete now and remains accurate after the real generator launches.

### Content structure

#### 1. Intro

Short explanation of what users can control:

- duration
- time display
- visual style
- font

#### 2. Step-by-step workflow

Suggested steps:

1. Enter the countdown duration
2. Choose how the timer looks on screen
3. Download the finished overlay for your video editor

#### 3. Editing workflow guidance

Short section explaining how creators will use the export:

- drag into timeline
- place above video footage
- align with scene timing

#### 4. Link back to homepage and Q&A

This page should end with strong internal links instead of becoming a dead-end explanation page.

## UX and Interaction Principles

The site should feel like a useful product immediately, even before the backend exists.

### Principles

- show the generator mockup above the fold
- keep the first CTA clear and singular
- avoid feature overload in navigation
- keep mobile layouts simple and stacked
- make sections easy to scan with strong headings
- avoid fake complexity in the mockup; believable is better than elaborate

### Static mockup rules

The mockup should look interactive but should not pretend the feature is complete. Good patterns:

- editable-looking controls
- a visual preview card
- a disabled download button or a `Coming soon` state

Bad patterns:

- fake progress bars or export states that imply real rendering exists
- placeholder controls with no relation to the future product

## SEO Implementation Strategy

The metadata strategy should follow current Google guidance: make titles descriptive and concise, use unique page descriptions, and use canonical links consistently. Google may treat canonical as a hint rather than a guarantee, so the content and internal linking still matter. Sources: Google Search Central docs on title links, meta descriptions, and canonicalization.

### Metadata architecture

Use Next.js metadata APIs with a shared site URL constant instead of hardcoding tags inline across pages.

Recommended shared values:

- site name
- base URL
- default title template
- default description

### Canonical strategy

Each page should generate its own canonical URL:

- `/`
- `/qa`
- `/how-it-works`

Implementation should rely on one base URL from environment or config so canonical tags do not drift across environments.

### Recommended title direction

Keep titles specific and not bloated.

- Home: `Overlay Timer: Create Countdown Video Overlays`
- Q&A: `Overlay Timer Q&A: Countdown Overlay Questions Answered`
- How it works: `How Overlay Timer Works for Video Creators`

### Recommended description direction

Descriptions should be unique and page-specific.

- Home: describe creating customizable overlay timers for TikTok, YouTube, and video editors
- Q&A: describe answers about timer formats, transparent overlays, and editing workflows
- How it works: describe the simple duration → style → download flow

### Heading strategy

- one H1 per page
- supporting H2/H3 hierarchy based on actual content sections
- homepage H1 should include `overlay timer`
- Q&A and How it works should have intent-aligned H1s, not copies of the homepage title

### Header and footer SEO role

Header and footer should support:

- site-wide discoverability
- consistent navigation
- crawlable page relationships
- repeated but restrained keyword context

Do not stuff exact-match keywords into every nav label. Use clear labels:

- Home
- Q&A
- How it works

## Content Tone

The copy should sound practical and creator-focused.

Good characteristics:

- direct
- outcome-driven
- easy to skim
- tool-like rather than blog-like

Avoid:

- generic marketing claims
- repetitive keyword stuffing
- exaggerated claims about export quality before the feature exists

## Recommended Build Shape

The implementation should separate content structure from shared shell and metadata.

### Suggested code structure

- `src/app/layout.tsx` for global metadata and shell wrapper
- `src/app/page.tsx` for homepage
- `src/app/qa/page.tsx` for Q&A page
- `src/app/how-it-works/page.tsx` for How it works page
- `src/components/site/` for header, footer, and reusable marketing sections
- `src/lib/site.ts` or `src/lib/seo.ts` for base URL and metadata helpers

## Risks and Mitigations

### Risk: thin SEO pages

If the Q&A and How it works pages are too short, they will look like support fragments instead of search destinations.

Mitigation:

Write them as complete pages with strong intros, grouped sections, and internal links.

### Risk: homepage becomes keyword-stuffed

If too many adjacent keywords are jammed into the hero, Google and users will both read it as low quality.

Mitigation:

Keep the homepage message clear and use adjacent intent terms naturally in later sections.

### Risk: mockup looks fake or misleading

If the fake generator behaves like a fake app demo, trust drops immediately.

Mitigation:

Use a clean static mockup with restrained interactions and honest `Coming soon` signaling where needed.

## Launch Recommendation

The best first release is:

- one polished homepage
- one substantive Q&A page
- one substantive How it works page
- one shared header/footer
- centralized metadata/canonical handling

That is enough structure to start indexing and enough product shape to support the future real generator.

## References

- Google Search Central: Title links best practices — https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets
- Google Search Central: Meta description best practices — https://developers.google.com/search/docs/appearance/snippet
- Google Search Central: Canonicalization and `rel="canonical"` — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central: Crawlable links best practices — https://developers.google.com/search/docs/crawling-indexing/links-crawlable
