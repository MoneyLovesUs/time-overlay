# Time Overlay Pro Monetization Design

## Summary

This document defines the path from the current free, client-only generator to a sustainable paid product. The strategy is to keep the existing local-first architecture (Vercel serves static assets only, no server-side rendering), add the features that video editors and streamers actually pay for, and gate them behind a one-time $9 Pro license validated entirely on the client.

The headline format upgrade is **WebM VP9 with alpha channel via WebCodecs**, which is what professional editors really import as a transparent overlay. ProRes 4444 stays out of the product as a paid feature, but ships as a free DIY bundle (PNG sequence plus a one-line ffmpeg script) for the long-tail SEO surface.

## Goals

- Ship a Pro tier that has a real reason to exist (alpha video, 4K, longer durations, style presets, custom colors and fonts, audio cues).
- Keep 100% of rendering on the user's device. Vercel does no encoding work.
- Add at least one new indexable SEO surface per style preset to compound long-tail traffic.
- Integrate payments without writing a backend: hosted checkout plus client-side license validation.
- Be honest about license cracking: do not over-engineer DRM at this price point.

## Non-Goals

- No server-side rendering, no S3/R2 storage, no queues, no email pipelines.
- No subscription model. Pro is a one-time buyout for this iteration.
- No accounts, no team licenses, no cloud-saved projects.
- No mobile or iPad-specific UX.
- No A/B testing infrastructure. Decisions in this iteration are driven by qualitative signal.
- No ProRes encoding inside the browser. ProRes ships as a DIY ffmpeg recipe.

## Business Model

### Tier comparison

| Capability | Free | Pro ($9 one-time) |
|---|---|---|
| Resolution | up to 1080p | up to 4K (3840×2160) |
| Duration | 3–60s | 3–300s |
| Export: PNG sequence | yes | yes |
| Export: WebM (no alpha, MediaRecorder fallback) | yes | yes |
| Export: WebM VP9 with alpha (WebCodecs) | no | yes |
| Export: HEVC with alpha (Safari/macOS only) | no | yes |
| Watermark | small corner watermark on all exports | none |
| Style presets | 3 built-in | 10+ |
| Color customization | preset palettes only | full hex + HSL picker |
| Font upload | built-in 2 fonts | upload any .ttf / .otf / .woff2 |
| Audio cues (tick, beep) | none | bundled in WebM/MP4 audio track |
| ProRes 4444 DIY bundle | yes (free as marketing) | yes |

The ProRes DIY bundle is intentionally free. It costs nothing to ship and earns long-tail SEO traffic for "PNG sequence to ProRes" type queries.

### Why $9 one-time, not a subscription

- Audience: hobby streamers, indie editors, freelance video creators. Subscription fatigue is real in this group.
- One-time buyout reduces churn handling to zero. Lemon Squeezy's hosted license validation makes lifetime activation trivial.
- $9 is the highest price point that does not trigger "let me check competitors" behavior for an overlay tool.
- A subscription experiment can be added later behind the same paywall component without re-architecting.

### Why Lemon Squeezy over Stripe

| Concern | Stripe | Lemon Squeezy |
|---|---|---|
| Fee on $9 | 2.9% + $0.30 → net $8.44 | 5% + $0.50 → net $8.05 |
| Global VAT/GST | not handled, requires self-collection | merchant of record, handled |
| License key issuance | DIY (sign JWT, manage store) | native, included in checkout |
| Hosted checkout | requires custom page or Stripe Checkout | hosted page included |
| Refund handling | manual webhook + own DB | merchant handles, license auto-revoked via API |

The $0.39 difference per sale is the cost of not having to write VAT reporting code, license key signing, or a webhook handler. Worth it.

## Architecture Principles

1. **Client-only render.** All encoding happens in `OffscreenCanvas` + Web Worker. No new Vercel functions for export.
2. **Vercel stays as static host.** The only conceivable server-side surface is a thin proxy for license validation if CORS later becomes a problem, and even that is deferred.
3. **WebCodecs first, MediaRecorder fallback.** WebCodecs gives alpha and is the path forward. MediaRecorder keeps a non-alpha WebM working on older browsers as graceful degradation.
4. **No user data leaves the device.** Uploaded fonts, custom colors, and rendered output never round-trip through any server.
5. **License is client-validated and cached.** Validate against Lemon Squeezy API on activation, cache the verified state in `localStorage` for 7 days, re-validate on cache expiry.
6. **Honest free tier.** Free is fully usable for small projects so users actually try the tool. Pro upgrade unlocks output quality, not basic functionality.

## Feature Spec

Each subsection covers: motivation, UX surface, technical approach, files affected, edge cases.

### 7.1 WebM VP9 with alpha (WebCodecs)

**Motivation.** Current WebM via `MediaRecorder` cannot carry alpha (see [feature-detection.ts:38](src/lib/generator/feature-detection.ts:38)). Editors importing the current WebM lose the transparent background. VP9 alpha is the actual professional alpha-video format that Premiere 2023+, DaVinci Resolve 18.5+, Final Cut Pro 10.7+, and CapCut all import as transparent footage.

**UX.** New radio option in [export-panel.tsx](src/components/generator/export-panel.tsx): "WebM (VP9 + alpha) — recommended for editors". Default Pro selection. Free users see it greyed with a "Pro" badge and a tooltip linking to the paywall.

**Technical approach.**

```ts
// src/lib/generator/encode/vp9-alpha-encoder.ts
import { Muxer, ArrayBufferTarget } from 'webm-muxer'

export async function encodeVp9Alpha(params: {
  width: number
  height: number
  fps: number
  totalFrames: number
  drawFrame: (canvas: OffscreenCanvas, frameIndex: number) => void
  onProgress?: (completed: number, total: number) => void
}): Promise<Blob> {
  const { width, height, fps, totalFrames, drawFrame, onProgress } = params

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: 'V_VP9', width, height, frameRate: fps, alpha: true },
    firstTimestampBehavior: 'offset',
  })

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (err) => { throw err },
  })

  encoder.configure({
    codec: 'vp09.00.10.08',
    width,
    height,
    bitrate: 4_000_000,
    framerate: fps,
    alpha: 'keep',
  })

  const canvas = new OffscreenCanvas(width, height)

  for (let i = 0; i < totalFrames; i++) {
    drawFrame(canvas, i)
    const frame = new VideoFrame(canvas, {
      timestamp: (i * 1_000_000) / fps,
      duration: 1_000_000 / fps,
    })
    encoder.encode(frame, { keyFrame: i % (fps * 2) === 0 })
    frame.close()
    onProgress?.(i + 1, totalFrames)
  }

  await encoder.flush()
  muxer.finalize()
  return new Blob([muxer.target.buffer], { type: 'video/webm' })
}
```

**Browser support.** Chrome 94+, Edge 94+, Firefox 130+, Safari 17.4+. Fallback to PNG sequence if `typeof VideoEncoder === 'undefined'` or `VideoEncoder.isConfigSupported({ codec: 'vp09.00.10.08', alpha: 'keep' })` returns `supported: false`.

**Files affected.**
- New: `src/lib/generator/encode/vp9-alpha-encoder.ts`
- New: `src/workers/generator-export-vp9-alpha.worker.ts` (or extend [generator-export.worker.ts](src/workers/generator-export.worker.ts) with a new message kind)
- Modify: [feature-detection.ts](src/lib/generator/feature-detection.ts) to add `supportsVp9Alpha`
- Modify: [types.ts](src/lib/generator/types.ts) to add `'webm-vp9-alpha'` to `GeneratorFormat`
- Modify: [export-panel.tsx](src/components/generator/export-panel.tsx) for the new radio option
- New dependency: `webm-muxer` (~30KB gzipped)

**Edge cases.**
- Safari 17.4+ VP9 alpha encoding has spotty hardware support. Detection runs `VideoEncoder.isConfigSupported` before showing the option.
- 4K @ 30fps @ 60s = 1800 frames, ~600MB encoded. Memory budget: stream chunks to muxer, do not retain `VideoFrame` instances after `.encode()`.
- Background tab throttling can stall encoding. Show a "keep this tab in foreground" advisory during long jobs.

### 7.2 HEVC with alpha (Safari/macOS only)

**Motivation.** Final Cut Pro users on macOS import HEVC alpha natively. Adding this widens the Pro pitch for the Mac-heavy creator audience.

**UX.** Hidden unless `VideoEncoder.isConfigSupported({ codec: 'hvc1.2.4.L120.B0', alpha: 'keep' })` returns supported. Labelled "MOV (HEVC + alpha) — Apple devices". No badge other than "Pro".

**Technical approach.** Same WebCodecs flow as VP9 alpha, with `mp4-muxer` instead of `webm-muxer`, codec string `hvc1.*`.

**Files affected.**
- New: `src/lib/generator/encode/hevc-alpha-encoder.ts`
- Reuse same worker scaffold as VP9 alpha
- New dependency: `mp4-muxer` (~25KB gzipped)

**Edge cases.** HEVC encoding outside Safari/macOS is rare. Treat detection failure as silent unavailability, not error.

### 7.3 4K resolution

**Motivation.** Current canvas preset tops out at 1080p. 4K is a natural Pro upsell, especially for YouTube creators recording in 4K masters.

**UX.** Add `resolution-preset-4k` option in [control-panel.tsx](src/components/generator/control-panel.tsx) resolution dropdown, with a Pro badge for free users.

**Technical approach.** `OffscreenCanvas` handles 4K natively. PNG sequence path stays the same but emits a memory advisory: 4K @ 30fps @ 60s = 1800 frames × ~8MB each PNG = ~14GB peak if we hold all frames in memory. The existing zip-on-the-fly approach in [generator-export.worker.ts](src/workers/generator-export.worker.ts) needs to switch from `zipSync` to streaming `Zip` from `fflate` so frames are released as they encode.

**Files affected.**
- Modify: [defaults.ts](src/lib/generator/defaults.ts) to add 4K preset
- Modify: [generator-export.worker.ts](src/workers/generator-export.worker.ts) to stream zip
- Modify: [feature-detection.ts](src/lib/generator/feature-detection.ts) — the `megapixels >= 2 && projectedFrames >= 1500` heavy-export warning at line 88 needs a tighter 4K-specific advisory
- Modify: [control-panel.tsx](src/components/generator/control-panel.tsx)

**Edge cases.**
- 4K + PNG sequence on a 4GB-RAM Chromebook crashes the tab. Streaming zip mitigates but does not eliminate the risk. Pre-flight estimate shown in UI: "Estimated output size: ~X MB. This may take Y seconds."
- 4K + WebM VP9 alpha is safer (continuous encoding, low peak memory).

### 7.4 Duration extension 60s → 300s

**Motivation.** Stream countdowns, tutorial intros, and BRB screens regularly run beyond 60s. Current cap at [control-panel.tsx:58](src/components/generator/control-panel.tsx:58) is `max={60}`.

**UX.** Slider/input goes up to 300s. Free locked at 60s with a soft cap message "Upgrade to Pro for durations up to 5 minutes".

**Technical approach.** Change the upper bound in [control-panel.tsx](src/components/generator/control-panel.tsx). Free tier enforcement happens client-side based on Pro state. Streaming zip from 7.3 must be in place before this lands.

**Files affected.**
- Modify: [control-panel.tsx](src/components/generator/control-panel.tsx)
- Modify: [defaults.ts](src/lib/generator/defaults.ts) to expose `MAX_DURATION_FREE = 60`, `MAX_DURATION_PRO = 300`
- Modify: [feature-detection.ts](src/lib/generator/feature-detection.ts) heavy-export thresholds

### 7.5 Watermark

**Motivation.** Free tier must have a visible reason to upgrade. A subtle bottom-right "timeoverlay.co" wordmark on Free exports is the standard pattern.

**UX.** Free exports include a 12% opacity wordmark in the corner, 6% of canvas width, with a small "Made with Time Overlay" suffix. Pro exports have no watermark.

**Technical approach.** Last-pass overlay in the render pipeline. Drawn inside [render-frame.ts](src/lib/generator/render-frame.ts) after all user-configurable layers. A boolean `applyWatermark` is passed in from the export job, derived from Pro state.

**Files affected.**
- New: `src/lib/generator/watermark.ts` — pure function that draws the wordmark given canvas dimensions and context
- Modify: [render-frame.ts](src/lib/generator/render-frame.ts) to call `watermark` as final layer
- Modify: [generator-export.worker.ts](src/workers/generator-export.worker.ts) to pass `applyWatermark` from job payload
- Modify: [export/job.ts](src/lib/generator/export/job.ts) to thread Pro state into the worker request

**Edge cases.**
- Wordmark must remain legible on both transparent and solid backgrounds. Use a soft drop shadow.
- Some users try to overlay their own logo at the same position to hide the watermark. This is fine — we still get the SEO recall when they share screenshots from the editor.

### 7.6 Style preset system

**Motivation.** This is the single highest-leverage feature in the spec. Style presets do double duty: each preset is a Pro lock AND a `/styles/[preset]` SEO landing page that ranks for "cyberpunk countdown overlay", "neon countdown overlay", "minimal countdown timer", etc.

**Initial preset roster (10).**

| Preset | Slug | Free / Pro | SEO target |
|---|---|---|---|
| Cyber (current default) | `cyber` | Free | "cyberpunk countdown overlay" |
| Minimal | `minimal` | Free | "minimal countdown timer" |
| Mono | `mono` | Free | "monospace countdown timer" |
| Neon | `neon` | Pro | "neon countdown overlay" |
| Glow | `glow` | Pro | "glowing countdown timer" |
| Scanline | `scanline` | Pro | "retro scanline countdown" |
| Classic | `classic` | Pro | "classic countdown timer overlay" |
| Retro | `retro` | Pro | "80s retro countdown overlay" |
| Glass | `glass` | Pro | "glassmorphism countdown overlay" |
| Neumorphic | `neumorphic` | Pro | "neumorphic countdown timer" |

**Technical approach.**

```
src/lib/generator/style-presets/
  index.ts         registry, exports getPresetById(), listPresets()
  types.ts         StylePresetDefinition
  cyber.ts
  minimal.ts
  mono.ts
  neon.ts
  ...
```

Each `StylePresetDefinition` exports the full `TextStyle` config plus optional `customRender(context, frameState)` hook for non-trivial effects (scanlines, glass blur).

**UX.** Replace current [theme-preset-picker.tsx](src/components/generator/theme-preset-picker.tsx) with a tile grid showing all 10 presets. Pro tiles show a small lock badge for free users; clicking a locked preset opens the paywall modal but pre-fills the preview with the locked style so the user sees what they would get.

**Files affected.**
- New: `src/lib/generator/style-presets/*`
- Modify: [theme-preset-picker.tsx](src/components/generator/theme-preset-picker.tsx)
- Modify: [render-frame.ts](src/lib/generator/render-frame.ts) to dispatch to preset `customRender` when present
- New routes: see section 9 (SEO surface expansion)

**Edge cases.**
- Some preset effects (glass blur, scanlines) cost significant per-frame CPU. Pre-flight check warns the user when preset + 4K + 60s combo will be slow.

### 7.7 Color customization

**Motivation.** Free presets give 3 styles. Pro should let users hit any brand color.

**UX.** New "Colors" section in [control-panel.tsx](src/components/generator/control-panel.tsx) with HSL sliders + hex input + 8 preset swatches. Free users see only the swatches.

**Technical approach.** All color values already flow through `settings.textStyle.textColor`, `strokeColor`, `glowColor`, `shadowColor` in [types.ts](src/lib/generator/types.ts). No engine changes needed; only a UI surface and a Pro gate on the manual entry.

**Files affected.**
- New: `src/components/generator/color-picker.tsx`
- Modify: [control-panel.tsx](src/components/generator/control-panel.tsx)

### 7.8 Font upload

**Motivation.** Brand fonts are a real workflow blocker for studios and creator businesses. Letting users drop a `.ttf` / `.otf` / `.woff2` is a strong Pro hook.

**UX.** Pro-only "Upload font" button in the style section. File picker accepts `.ttf, .otf, .woff2`. Uploaded font appears in the font dropdown and persists for the session via `IndexedDB`.

**Technical approach.**

```ts
const arrayBuffer = await file.arrayBuffer()
const fontFace = new FontFace(family, arrayBuffer)
await fontFace.load()
self.fonts.add(fontFace)  // inside Web Worker; also do in main doc
```

`OffscreenCanvas` requires the font to be loaded into the worker's `FontFaceSet` before `measureText` and `fillText` see it. The font is also added to the main document's `document.fonts` so the live preview matches.

**Files affected.**
- New: `src/lib/generator/font-loader.ts`
- Modify: [generator-export.worker.ts](src/workers/generator-export.worker.ts) to accept a transferable font ArrayBuffer in the export request
- Modify: [control-panel.tsx](src/components/generator/control-panel.tsx) for the upload UI

**Edge cases.**
- Bad font files: wrap `FontFace.load()` in try/catch and surface a clear error.
- Font name collisions with existing presets: prefix uploaded fonts with `user-` internally.
- Font data is never sent to any server. Make this explicit in the upload UI copy.

### 7.9 Audio cues

**Motivation.** Stream countdowns and tutorial intros often want a tick or a final beep. Editors will pay for "it just works" audio embedded in the WebM/MP4 instead of layering a separate audio file.

**UX.** New "Audio" section in [control-panel.tsx](src/components/generator/control-panel.tsx). Toggle "Add audio". Dropdown: `None`, `Tick (subtle)`, `Tick (sharp)`, `Final beep only`, `Tick + final beep`. Pro-only.

**Technical approach.**
- Bundle 5 short audio clips (Royalty-free, sub-100ms each) in `/public/audio/`.
- Decode via `AudioContext.decodeAudioData`.
- Use `OfflineAudioContext` to mix tick events at each second mark into a single audio buffer of length `durationSeconds`.
- Encode to Opus via `AudioEncoder` (WebCodecs) and add to muxer.
- PNG sequence export ignores audio (since PNG sequences are silent).

**Files affected.**
- New: `src/lib/generator/encode/audio-track.ts`
- Modify: VP9/HEVC encoder modules to accept an optional audio track
- New: `public/audio/tick-subtle.mp3`, etc.
- Modify: [control-panel.tsx](src/components/generator/control-panel.tsx)

**Edge cases.**
- Audio-encoded WebM requires `AudioEncoder` support. Firefox lags here. Detect and hide the option if unsupported.

### 7.10 ProRes 4444 DIY bundle

**Motivation.** "Why can't I export ProRes?" will be a recurring question. Rather than building it (and going to a heavy backend), ship the ffmpeg recipe and bundle a one-click script with every PNG sequence export.

**UX.** When PNG sequence is the export format and Pro is active, the downloaded `.zip` includes:
- `frames/frame_0001.png` ... (existing)
- `convert-to-prores.sh` (macOS/Linux)
- `convert-to-prores.bat` (Windows)
- `README-prores.txt` with the one-line ffmpeg command and a link to `/guides/png-to-prores`

```bash
#!/bin/bash
ffmpeg -framerate 30 -i frames/frame_%04d.png \
  -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le \
  output.mov
```

**Technical approach.** Pure packaging logic in the worker. Two text files added to the zip alongside frames.

**Files affected.**
- Modify: [generator-export.worker.ts](src/workers/generator-export.worker.ts) to append `convert-to-prores.sh`, `.bat`, and `README-prores.txt` for Pro PNG sequence exports
- New route: `src/app/(localized)/[locale]/guides/png-to-prores/page.tsx` (see section 9)

**Edge cases.**
- Free PNG sequence exports include only the frames, not the scripts. This keeps Pro buyers feeling they got something tangible.

## 8. Pricing Integration

### 8.1 Lemon Squeezy setup (one-time)

1. Create a Lemon Squeezy store.
2. Create a "Time Overlay Pro" product, variant priced at $9 USD.
3. Enable "License keys" on the variant.
4. Note the variant ID and store ID for the checkout URL.
5. Generate a `LEMONSQUEEZY_STORE_ID` env var (public is fine, not a secret).

### 8.2 Checkout flow

```
[Paywall modal in app]
  → user clicks "Upgrade to Pro $9"
  → window.location.href = `https://timeoverlay.lemonsqueezy.com/buy/{variant-id}?embed=0&checkout[email]=` 
  → user pays on Lemon Squeezy hosted checkout
  → Lemon Squeezy redirects to https://timeoverlay.co/success?license_key=XXXX-XXXX-XXXX-XXXX
  → /success page calls validateLicense(licenseKey)
  → on success: store encrypted token in localStorage, navigate to /
```

The `/success` route is the only new app route Lemon Squeezy needs. It is still static — only client-side fetch happens.

### 8.3 License validation

```ts
// src/lib/license/validate.ts
export async function validateLicense(licenseKey: string): Promise<LicenseStatus> {
  const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({ license_key: licenseKey }),
  })

  const data = await response.json()

  if (data.valid && data.license_key.status === 'active') {
    return {
      kind: 'valid',
      key: licenseKey,
      checkedAt: Date.now(),
    }
  }

  return { kind: 'invalid', reason: data.error ?? 'unknown' }
}
```

Lemon Squeezy's `/licenses/validate` endpoint has permissive CORS — no proxy needed.

### 8.4 Pro state management

```ts
// src/lib/license/state.ts
const CACHE_KEY = 'time-overlay-license'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function getProState(): ProState {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return { kind: 'free' }

  const parsed = JSON.parse(raw)
  if (Date.now() - parsed.checkedAt < CACHE_TTL_MS) {
    return { kind: 'pro', licenseKey: parsed.key }
  }

  // expired; schedule re-validation but allow Pro features during this session
  scheduleRevalidation(parsed.key)
  return { kind: 'pro', licenseKey: parsed.key, stale: true }
}
```

A `useProState()` React hook wraps this and exposes it to all Pro-gated components.

### 8.5 Refund handling

Lemon Squeezy automatically marks a license `disabled` after refund. The 7-day re-validation pass catches this. Worst case: a refunded user gets up to 7 days of continued Pro access. Acceptable at this scale.

### 8.6 Anti-piracy posture

Explicit position: we do not invest engineering effort in preventing license sharing or cracking at this price point. The license is validated against Lemon Squeezy, but a determined user can patch the client. We accept that. Engineering time spent on DRM has a worse ROI than the same time spent on new presets.

## 9. SEO Surface Expansion

### 9.1 Style preset landing pages

New route: `/styles/[preset]` (and localized equivalents under `(localized)/[locale]/styles/[preset]`).

Per-preset page includes:
- H1: `<Preset name> Countdown Timer Overlay`
- Live preview embed (lazy-loaded, points at root generator with `?preset=<slug>` deep link)
- 5-paragraph body covering: use case, recommended editor pairings, color recommendations, export format choice, alternative presets
- "Open in Generator" CTA
- Internal links to 3 related presets and 2 tutorial guides

Sitemap impact: 10 presets × 16 locales = **160 new indexable URLs**. Compounds the SEO investment from commits `0735093` and `1044491`.

### 9.2 Tutorial / how-to long-tail pages

Six initial guides at `/guides/[slug]`:

| Slug | Target query |
|---|---|
| `add-countdown-to-obs` | "add countdown timer to OBS" |
| `add-countdown-to-premiere` | "transparent countdown overlay premiere pro" |
| `add-countdown-to-davinci-resolve` | "countdown overlay davinci resolve" |
| `add-countdown-to-final-cut-pro` | "countdown overlay final cut pro" |
| `png-to-prores` | "convert png sequence to prores" (cross-links Pro DIY bundle) |
| `transparent-overlay-for-twitch` | "transparent countdown for twitch stream" |

Each guide: H1, 6 sections, screenshots from the target editor, CTA back to generator. Optionally localized — start English only, localize after traffic confirms intent.

### 9.3 Sitemap and i18n

[sitemap.ts](src/app/sitemap.ts) generates from [publicRouteDefinitions](src/lib/site.ts:86). New route definitions need to be added there:
- One entry per preset slug (10 presets)
- One entry per guide slug (6 guides)
- Both with full hreflang alternates for enabled locales

[buildSitemapEntries](src/lib/site.ts:189) needs no logic change, only new entries in `publicRouteDefinitions`.

### 9.4 Internal linking

Homepage [root-seo-section.tsx](src/components/site/root-seo-section.tsx) gets a new section "Pick a style" linking to all 10 preset pages. Each preset page links back to the homepage and to 3 sibling presets. Each guide page links to the homepage and to the 2 most relevant presets.

## 10. i18n Considerations

- All new UI strings go through [content/root/*.ts](src/content/root/) and the existing translation harness.
- All 16 locales must have translated strings before Pro features ship — no English fallback in paid UX.
- Preset names are not translated (they are proper nouns: "Cyber", "Neon", etc.).
- Tutorial guides start English-only and are localized later based on which locales drive paid conversions.

## 11. Implementation Phases

Ten working days, sequenced so each phase produces a shippable state.

| Day | Deliverable | Files |
|---|---|---|
| D1 | WebCodecs VP9 alpha encoder + worker plumbing | `encode/vp9-alpha-encoder.ts`, new worker |
| D2 | UI surface for VP9 alpha + feature detection + fallback path | `export-panel.tsx`, `feature-detection.ts`, `types.ts` |
| D3 | 4K preset + streaming zip + 300s duration | `defaults.ts`, `generator-export.worker.ts`, `control-panel.tsx` |
| D4 | Watermark layer + free/Pro gating scaffold | `watermark.ts`, `render-frame.ts`, `license/state.ts` |
| D5 | Style preset registry + 5 of 10 presets | `style-presets/*` |
| D6 | Remaining 5 presets + color picker + font upload | `style-presets/*`, `color-picker.tsx`, `font-loader.ts` |
| D7 | Audio cues + ProRes DIY bundle | `encode/audio-track.ts`, worker bundle logic |
| D8 | Lemon Squeezy integration: paywall modal, `/success` route, license validation | `license/*`, new modal, `app/success/page.tsx` |
| D9 | Style preset landing pages (10 presets × 1 locale to start) + sitemap updates | `app/(localized)/[locale]/styles/[preset]/page.tsx`, `site.ts` |
| D10 | Tutorial guide pages (6 guides) + analytics events + smoke tests | `app/(localized)/[locale]/guides/[slug]/page.tsx`, GA events |

Localization of the 9 new presets and 6 guides to remaining 15 locales is a follow-up batch after launch.

## 12. Testing Strategy

### Unit (Vitest)
- `license/validate.ts`: mocked API responses for valid, invalid, expired, network error.
- `style-presets/*.ts`: each preset definition validated against `StylePresetDefinition` schema.
- `feature-detection.ts`: extended with VP9 alpha, HEVC alpha, AudioEncoder probes.
- `watermark.ts`: deterministic output for a known canvas size.

### Manual browser matrix
- Chrome / Edge (current and prior major) — full feature set.
- Firefox 130+ — VP9 alpha, no HEVC, no AudioEncoder (degraded gracefully).
- Safari 17.4+ — VP9 alpha + HEVC alpha.
- Safari 17.0–17.3 — fallback to PNG sequence.
- Mobile Safari — should advise desktop, but generator must not crash.

### Editor import validation
At least one round-trip test per release:
- Premiere Pro 2024 imports WebM VP9 alpha as transparent footage.
- DaVinci Resolve 19 imports WebM VP9 alpha as transparent footage.
- Final Cut Pro 10.7+ imports HEVC alpha as transparent footage.
- CapCut Web imports WebM VP9 alpha.

### License flow
- Lemon Squeezy test mode purchase end-to-end.
- License revocation (manual API call) — verify Pro lock re-engages within 7 days.
- Page reload after activation — Pro state persists.
- localStorage cleared — degrades to Free cleanly with no errors.

## 13. Telemetry

GA events to instrument (event names final):

| Event | Properties | Why |
|---|---|---|
| `export_started` | format, fps, durationSeconds, resolution, isPro | conversion funnel input |
| `export_completed` | format, durationSeconds, totalTimeMs | success rate by format |
| `export_failed` | format, errorCode | quality signal |
| `paywall_shown` | trigger (preset / duration / 4K / format) | which feature drives upgrades |
| `checkout_started` | trigger | conversion drop-off |
| `license_activated` | source (success page / manual entry) | confirm activation pipeline |
| `preset_selected` | presetId, isLocked, isPro | preset popularity, locked-tile interest |

Dashboard target: weekly funnel of UV → export attempt → paywall view → checkout start → license activation.

## 14. Risks and Open Questions

| Risk | Mitigation |
|---|---|
| WebCodecs Safari support is spottier than spec | Detection + graceful fallback to PNG sequence |
| Editors silently degrade VP9 alpha to opaque | Verify with real import tests before launch |
| 4K + long duration crashes low-end devices | Pre-flight memory estimate + warning |
| Free tier is too generous, no one upgrades | 7-day post-launch review: if conversion < 0.3%, tighten free limits |
| Free tier is too stingy, no one tries | Same review window: if export completion rate < 30%, loosen |
| ProductHunt / Reddit launch fizzles | Have 3 backup distribution levers ready: YouTube tutorial, Twitter/X creator outreach, indie hackers post |

Open questions to resolve before D8:
- Final pricing: $9 confirmed, or try $12 / $7? Recommend ship at $9 and revisit after 50 paid units.
- Localized pricing (e.g. lower in India / Brazil)? Defer — Lemon Squeezy supports PPP but it adds complexity.

## 15. Out of Scope (Explicit)

- ProRes 4444 in-browser encoding (DIY ffmpeg only).
- MP4 H.264 without alpha (no professional demand once VP9 alpha is shipped).
- Background video upload / chroma key.
- Account system, cloud sync, multi-device license activation.
- Subscription pricing.
- Mobile-first UX.
- Team licenses or volume pricing.
- Webhook-driven email pipelines.
- Custom domain license keys / white-label.
- Any new Vercel function.

## 16. Success Criteria

The spec is considered successful if, 30 days after public launch:

- At least one paid sale per day on average (≥30 units/month, ~$240 net).
- Export completion rate ≥ 60% across all formats.
- VP9 alpha is the most-used Pro export format.
- At least one style preset landing page ranks in Google top 20 for its target query.
- Zero Vercel function invocations attributable to export workflows.

If after 30 days fewer than 5 paid units have sold, the next iteration revisits distribution (not the spec). The product hypothesis fails on traffic and audience, not on the feature set described here.

## Appendix A: Dependency Additions

| Package | Size (gzip) | Purpose |
|---|---|---|
| `webm-muxer` | ~30KB | VP9 alpha WebM muxing |
| `mp4-muxer` | ~25KB | HEVC alpha MP4 muxing |

Both are pure JS, MIT licensed, browser-compatible. No native dependencies.

## Appendix B: Pre-launch Checklist

- [ ] All 10 presets render identically in worker and main-thread preview
- [ ] VP9 alpha import verified in Premiere, DaVinci, FCP, CapCut
- [ ] Lemon Squeezy test purchase → activate → export with no watermark → reload → still Pro
- [ ] Lemon Squeezy refund → Pro disables within 7 days
- [ ] PNG sequence 4K @ 30fps @ 60s completes without tab crash on a 4GB RAM device
- [ ] All 16 locales have translations for new paywall and export UI strings
- [ ] Sitemap includes new preset and guide URLs with hreflang
- [ ] GA events fire on the full funnel
- [ ] README and AGENTS.md updated to reflect Pro tier and Lemon Squeezy integration
