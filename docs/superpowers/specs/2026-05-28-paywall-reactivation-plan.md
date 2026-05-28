# Paywall Reactivation Plan

## Summary

The launch ships with **every Pro feature unlocked**. Watermark, VP9/HEVC alpha exports, 4K, 300-second durations, all 10 style presets, custom colors, font upload, and audio cues are free for every visitor. The strategy is to maximize usage and SEO velocity first, then introduce a paywall once organic traffic and engagement data justify it.

This document is the playbook for re-enabling the paywall later. Most of the underlying machinery (license validation, Pro state hook, gating checks, paywall modal, success route, GA funnel events) is already in the codebase as inert scaffolding. Re-activation is intended to be a small, well-scoped change rather than a re-build.

## The single switch

The master flag lives at [src/lib/license/state.ts](../../../src/lib/license/state.ts):

```ts
export const PAYWALL_ENABLED = false;
```

When this is `false`:

- `useProState()` always returns `{ kind: "pro", licenseKey: "open-access", checkedAt: 0, stale: false }`.
- Every `!isPro` branch becomes dead code; no gating fires.
- Every Pro/Lock visual chip is hidden because they read from either `!isPro` or `PAYWALL_ENABLED`.
- The PaywallModal is mounted but its `trigger` prop stays `null`, so it never renders.

To re-enable the paywall, flip this constant to `true`. Then complete the items below to close the loop on payments, content, analytics, and QA.

## Pre-flip checklist

### 1. Lemon Squeezy account setup

1. Create a Lemon Squeezy store and verify the merchant.
2. Create a product named "Time Overlay Pro" with a single variant priced at $9 USD (or revisit pricing — see "Pricing reconsideration" below).
3. Enable **License keys** on the variant.
4. Set the **Success redirect URL** to `https://timeoverlay.co/success`. Lemon Squeezy auto-appends `?license_key=<KEY>`, which the success page already consumes.
5. Note the public checkout URL (looks like `https://timeoverlay.lemonsqueezy.com/buy/<variant-uuid>`).

### 2. Environment variables

Add to the Vercel project environment:

```
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL=https://timeoverlay.lemonsqueezy.com/buy/<variant-uuid>
```

The paywall modal at [src/components/generator/paywall-modal.tsx](../../../src/components/generator/paywall-modal.tsx) reads this variable and falls back to the bare buy URL if it is missing.

### 3. Flip the switch

```ts
// src/lib/license/state.ts
export const PAYWALL_ENABLED = true;
```

### 4. Verify the gating UI re-appears

After the flip, the following surfaces will start displaying Pro/Lock affordances again automatically. No further code changes are required:

| Surface | Behavior when `PAYWALL_ENABLED=true` and the visitor is on Free |
|---|---|
| [theme-preset-picker.tsx](../../../src/components/generator/theme-preset-picker.tsx) | Pro presets render a Lock icon + "Pro" label tile chip |
| [export-panel.tsx](../../../src/components/generator/export-panel.tsx) | VP9 alpha and HEVC alpha format options show a Lock chip with `proBadge` and `proLockedHint` |
| [control-panel.tsx](../../../src/components/generator/control-panel.tsx) | Duration hint shows "max 60s · Pro 300s", 4K row shows "4K resolutions require Pro", font upload button shows a Lock icon |
| [color-picker.tsx](../../../src/components/generator/color-picker.tsx) | Color inputs disable and the label shows a Lock + "Pro" chip |
| [generator-shell.tsx](../../../src/components/generator/generator-shell.tsx) | Selecting any Pro feature fires `trackEvent("paywall_shown", ...)` and opens the PaywallModal with the right trigger |
| [paywall-modal.tsx](../../../src/components/generator/paywall-modal.tsx) | Modal opens, exposes the buy CTA and the "I already have a license key" entry |
| [/success page](../../../src/app/(default)/success/page.tsx) + [success-shell.tsx](../../../src/components/license/success-shell.tsx) | Lemon Squeezy redirect lands here, validates against the API, activates Pro on success |

### 5. Reinstate Pro labels in copy

The 4K resolution presets were stripped of their `(Pro)` suffix when the paywall was disabled to avoid confusing copy. Restore the label suffix in every locale when re-enabling:

```diff
- "landscape-2160": "3840x2160 / 16:9 (4K)",
- "portrait-2160":  "2160x3840 / 9:16 (4K)",
+ "landscape-2160": "3840x2160 / 16:9 (4K, Pro)",
+ "portrait-2160":  "2160x3840 / 9:16 (4K, Pro)",
```

Affected files: [src/content/root/en.ts](../../../src/content/root/en.ts) and every locale under [src/content/root/](../../../src/content/root/).

A reusable script at [scripts/patch-locales-d1-d3.mjs](../../../scripts/patch-locales-d1-d3.mjs) was used for the initial patch; a small variant can re-add `(Pro)` if you want to do it programmatically.

### 6. Verify GA funnel

The following events are already wired through [src/lib/analytics/events.ts](../../../src/lib/analytics/events.ts). After the flip, confirm the funnel fires in Google Analytics:

- `export_started`, `export_completed`, `export_failed`
- `paywall_shown` (with `trigger` property: `format-vp9-alpha`, `format-hevc-alpha`, `resolution-4k`, `duration-over-60s`, `preset-locked`)
- `checkout_started`
- `license_activated` (with `source` property: `modal` or `success-page`)
- `preset_selected`

## Pro classification (already in the data model)

These constants already classify presets and features as "Pro tier" even while the paywall is off. They drive the gating logic when `PAYWALL_ENABLED=true` flips on:

| Constant | Location | Purpose |
|---|---|---|
| `GENERATOR_PRO_FORMATS` | [src/lib/generator/defaults.ts](../../../src/lib/generator/defaults.ts) | `webm-vp9-alpha`, `mov-hevc-alpha` |
| `GENERATOR_PRO_RESOLUTION_PRESETS` | [src/lib/generator/defaults.ts](../../../src/lib/generator/defaults.ts) | `landscape-2160`, `portrait-2160` |
| `GENERATOR_PRO_THEME_PRESETS` | [src/lib/generator/defaults.ts](../../../src/lib/generator/defaults.ts) | 7 of 10 presets are flagged `isPro: true` |
| `GENERATOR_FREE_DURATION_LIMIT_SECONDS` (60) | [src/lib/generator/defaults.ts](../../../src/lib/generator/defaults.ts) | Free duration cap when paywall is on |
| `GENERATOR_PRO_DURATION_LIMIT_SECONDS` (300) | [src/lib/generator/defaults.ts](../../../src/lib/generator/defaults.ts) | Pro duration cap |

If you decide to change tier composition (e.g. promote `neon` to Free, move `mono` to Pro) before re-enabling, edit `isPro` on the relevant entry in `GENERATOR_THEME_PRESETS`. The derived sets recompute automatically.

## Reconsidering scope before re-enabling

Before flipping the switch, revisit:

1. **Pricing**. $9 one-time was the launch hypothesis. After 30-90 days of usage you may have a better signal on whether to bump to $12 / $15, or whether a $5/month subscription would convert better.
2. **What stays Free**. The current Pro tier is generous (alpha video, 4K, 300s, 7 presets, color customization, font upload, audio cues, ProRes bundle). Consider what to release from Pro after launch to keep the funnel healthy.
3. **Watermark intensity**. The current watermark is subtle. If conversion is weak, increase prominence in [src/lib/generator/watermark.ts](../../../src/lib/generator/watermark.ts) before re-enabling.

## Post-flip QA checklist

After flipping `PAYWALL_ENABLED` to `true`:

- [ ] On a private window, the homepage shows Pro/Lock badges on the right preset tiles
- [ ] Clicking a Pro preset opens the paywall modal
- [ ] Selecting "WebM (VP9 + alpha)" format opens the paywall modal
- [ ] Picking a 4K resolution opens the paywall modal
- [ ] Entering 90 seconds duration clamps to 60 and opens the paywall modal
- [ ] Color picker is disabled with a Lock chip
- [ ] Font upload button shows a Lock chip and opens paywall on click
- [ ] Modal "Buy Pro for $9" opens Lemon Squeezy hosted checkout in a new tab
- [ ] A successful test checkout redirects to `/success?license_key=...`
- [ ] The success page validates the key and shows "Pro is unlocked on this device"
- [ ] Returning to the homepage, the badges are gone and Pro features work
- [ ] Refunding the test purchase deactivates Pro within the 7-day re-validation window
- [ ] Hard-clearing `localStorage` reverts to Free state cleanly
- [ ] GA Realtime view shows `paywall_shown`, `checkout_started`, `license_activated` events firing

## Things explicitly left out of the launch (deferred Pro work)

These features are not in the codebase yet and would be follow-ups after the paywall comes back:

- **MP4 / non-alpha H.264 export** — not added; alpha video is the primary Pro draw.
- **Localized pricing (PPP)** — Lemon Squeezy supports it but it adds checkout config complexity.
- **Account system / multi-device sync** — the license key is the only identifier today.
- **Email notifications** — no transactional pipeline; the success page is the only acknowledgement.
- **Subscription pricing** — current model is one-time only.
- **Team licenses / volume pricing** — single-user only.

## Files to revisit (not delete)

Even with the paywall disabled, these files stay in the bundle because they will be useful again:

- [src/lib/license/state.ts](../../../src/lib/license/state.ts)
- [src/lib/license/validate.ts](../../../src/lib/license/validate.ts)
- [src/components/generator/paywall-modal.tsx](../../../src/components/generator/paywall-modal.tsx)
- [src/components/license/success-shell.tsx](../../../src/components/license/success-shell.tsx)
- [src/app/(default)/success/page.tsx](../../../src/app/(default)/success/page.tsx)

The `/success` route is still publicly addressable. If someone hits it without a `license_key` query parameter, they see a polite "no license key found" message and a link back to the homepage. This is harmless and avoids breaking any Lemon Squeezy webhook flow if the paywall later flips back on.
