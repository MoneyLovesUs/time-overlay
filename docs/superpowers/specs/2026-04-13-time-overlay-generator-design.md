# Time Overlay Generator MVP Design

## Summary

This document defines the first real product surface for `time-overlay`: a browser-based generator that lets users configure a countdown timer, preview it live, and export usable assets on their own machine without depending on paid server rendering.

The MVP intentionally replaces the current "guidance-only" gap with a local-first production tool. The deployment target remains Vercel, but Vercel only serves the web app and does not participate in heavy rendering work.

## Goals

- Ship a real generator page that users can operate end-to-end.
- Keep rendering and export local to the user's device.
- Support more than one export format from day one.
- Stay within Vercel free-tier constraints by avoiding server-side video rendering.
- Reuse one rendering core for preview and export so output stays consistent.

## Non-Goals

- No server-side media rendering.
- No user video upload or compositing onto uploaded footage.
- No MOV / ProRes / other professional post-production formats in the MVP.
- No template marketplace, account system, saved cloud projects, or team collaboration.
- No advanced motion-graphics timeline editor.

## Product Scope

### New route

- Add a dedicated generator route at `/generator`.
- Keep the current marketing pages, but treat them as supporting entry points into the product.
- Add generator navigation from the public shell so the tool is discoverable.

### User-facing capabilities

The MVP generator should let users configure:

- Duration
- Countdown display format: `SS`, `MM:SS`, `HH:MM:SS`
- Canvas aspect/orientation presets
- Output resolution presets, with a conservative default
- Typography: font family, size, weight, letter spacing
- Color styling: primary text color, optional stroke, optional glow/shadow
- Placement: anchor position plus offset controls
- Background mode: transparent or solid color
- Preview playback controls: play, pause, reset
- Safe-area overlay toggle
- Export settings: format, FPS, quality preset

### Export formats

The MVP must reliably support:

- `PNG sequence`
- `WebM`

Optional stretch format for the first release if implementation remains stable:

- `GIF`

Explicitly excluded from MVP acceptance:

- `MP4` as a guaranteed format
- `MOV / ProRes`

## UX Design

### Desktop information architecture

Use a single-screen generator layout:

- Left column: configuration controls
- Center: live preview canvas
- Right column: export format selection and export actions

This keeps the "configure -> preview -> export" loop visible at all times and matches the approved layout direction from brainstorming.

### Mobile behavior

On small screens, stack the sections vertically:

1. Controls
2. Preview
3. Export

The preview should stay visible near the top of the stacked flow so users do not lose feedback while changing controls.

### Interaction model

- Changes should update preview immediately.
- Preview playback should not trigger an export pipeline.
- Export should run in a background worker and display progress.
- If export becomes too expensive for the selected settings, the UI should explain why and suggest a lower-cost preset.

## Technical Architecture

### Local-first rendering model

All media generation work happens on the client:

- React manages editor state and UI composition.
- A canvas-based preview renderer displays the current timer.
- A pure frame renderer generates deterministic frame instructions for both preview and export.
- A Web Worker runs export jobs to avoid freezing the main thread.
- Format adapters convert rendered frames into downloadable assets.

Vercel remains responsible only for hosting the web application.

### Why canvas-first

Canvas is the best fit for the current constraints:

- It keeps preview and export logic aligned.
- It avoids paying for server rendering.
- It is more predictable than DOM capture for frame-by-frame export.
- It gives the project a simpler path to deterministic rendering tests.

### High-level module boundaries

- `generator page`: route, layout, section wiring
- `editor state`: one source of truth for timer settings and export settings
- `preview renderer`: render current state into a preview canvas
- `frame renderer`: deterministic render logic shared by preview and export
- `export worker`: long-running export orchestration off the main thread
- `format adapters`: `PNG sequence`, `WebM`, and optional `GIF`
- `presets/themes`: curated default looks and canvas presets

The frame renderer should stay independent from React so it can be reused in tests and workers.

## Performance Constraints

### Default constraints

Use conservative defaults for the MVP:

- Default resolution: `720p`
- Optional higher preset: `1080p`
- Default FPS: `30`
- Initial duration cap: `60 seconds`

These defaults aim for "usable on normal laptops" rather than "maximum possible output".

### Performance strategy

- Preview and export should be optimized separately.
- Preview may reduce playback smoothness before export does.
- Export should prioritize deterministic output over perfect UI responsiveness.
- Heavy work must run in a Web Worker.
- Advanced effects should be limited to a small, curated set.

### Graceful degradation

When export settings are too expensive, the app should recommend:

- Lower resolution
- Shorter duration
- Reduced effect intensity
- `PNG sequence` instead of video output

## Error Handling

The export flow must distinguish between:

- Unsupported format in the current browser
- Too-large resolution / duration combination
- Memory pressure or aborted export
- Resource loading failures such as fonts

Each failure mode should map to actionable UI guidance rather than a generic error banner.

## Testing Strategy

### Unit coverage

- Time formatting helpers
- Layout and anchor calculations
- Render parameter normalization
- Theme/style preset mapping

### Integration coverage

- Preview updates when editor state changes
- Export job creation and completion for supported formats
- Worker progress and failure states

### Visual / deterministic coverage

For a few fixed presets, validate:

- First frame
- Midpoint frame
- Final frame

These checks should focus on stable render outputs, not broad screenshot snapshots of the whole page.

### Manual acceptance

Before release, validate:

- Horizontal transparent export
- Vertical transparent export
- Solid background export
- `PNG sequence` flow
- `WebM` flow
- Low-powered or throttled-device behavior does not lock the app irrecoverably

## Release Criteria

The MVP is complete when:

- `/generator` exists and is reachable from site navigation
- Users can configure a timer and see instant preview feedback
- Users can export at least `PNG sequence` and `WebM` locally
- Export work stays off the main UI thread
- The app provides understandable guidance when settings are too expensive or unsupported
- The existing marketing pages continue to work and can route users into the generator

## Risks and Mitigations

### Browser format support

Risk:
- `WebM` support and encoding behavior may vary by browser

Mitigation:
- Detect support explicitly
- Offer `PNG sequence` as the universal fallback

### Export performance on weak devices

Risk:
- Long or high-resolution exports may feel broken on lower-end machines

Mitigation:
- Conservative defaults
- Hard caps in MVP
- Clear warnings and downgrade suggestions

### Scope creep

Risk:
- Supporting too many formats or style permutations will stall the first release

Mitigation:
- Keep format support narrow
- Limit preset count
- Defer `MP4`, `MOV`, and upload/compositing features

## Open Decisions Already Resolved

The following were decided during brainstorming:

- The product must be truly usable, not a demo.
- The rendering model should use the user's local compute.
- Vercel free-tier hosting should remain sufficient.
- The MVP should support selectable export formats, but not promise professional post-production formats.
- The approved layout is a single-screen generator with controls, preview, and export visible together.
