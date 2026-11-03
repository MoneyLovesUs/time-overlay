# 3600-second PNG sequence export verification

Status: implementation complete; full-size rows verified locally, with the
platform gates listed below still unverified. This document records observed
results, not promises. It does not authorize a production release.

Reference contract: `docs/superpowers/specs/2026-11-03-long-png-sequence-export.md`.

## Environment and build

- Hardware: Apple M3 Max, 36 GiB RAM, macOS 25.5.0 arm64.
- Browser for the lane runs: Google Chrome 156 headless (`HeadlessChrome/156.0.0.0`), persistent profile with the browser's real storage quota.
- Build checks: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test -- --run` (458 tests) and `pnpm build` all exit 0 on the commit containing this document.
- All runs bound to the lane's local dev server on `127.0.0.1:4317`; no telemetry was sent to production. No upload of frames or fonts occurs.

## Browser/output matrix

| Row | Result | Observed output |
|---|---|---|
| Chrome, 1500 s, 720p, 30 fps, transparent, Center Mono | Pass | 45,000 frames, 16 ZIPs, 8,205,371,855 bytes, 257.6 s; all CRC, continuity, part limit and boundary alpha checks passed |
| Chrome, 3600 s, 720p, 30 fps, simple template (Transparent Minimal, SS) | Pass | 108,000 frames, 21 ZIPs, 11,020,130,253 bytes, 365.3 s; all checks passed |
| Chrome, Windows, 3600 s, high-complexity template | Blocked | No Windows VM/authorization; not simulated |
| Chrome, 3600 s, 720p, 60 fps | Pass | 216,000 frames, 42 ZIPs, 22,040,255,265 bytes, 746.1 s; all CRC/continuity/limits/boundary alpha passed |
| Chrome, 4K/30 representative short | Pass | 120 s, 3,600 frames, 2 ZIPs, 777,522,312 bytes; real byte split at frame 2,477 |
| Chrome, 1080p/60 representative short | Pass | 300 s, 18,000 frames, 4 ZIPs, 1,865,535,362 bytes; real byte splits at frames 4,542, 9,681 and 15,213 |
| Chrome, long job interrupted and restarted | Pass | 300 s job killed after part 1 (2,915 frames); resume completed 9,000 continuous frames. Boundary frames 2915/2916 decoded to the same RGBA MD5 (`9d0f9bb7cc8d49597598bae76051a7c5`) |
| Chrome, cooperative cancel and resume | Pass | Cancelled after 2,915 committed frames; completed ZIP kept; resume produced 9,000 continuous frames |
| Chrome, short job | Pass | 30 s produced one 166,960,560-byte ZIP automatically; 900 frames, CRC and alpha OK |
| Desktop Safari | Blocked | Safari WebDriver remote automation is off; not replaced with WebKit/UA emulation |
| Android Chrome / iOS Safari real devices | Blocked | No Android device attached; paired iPhone has Web Inspector off |

Each part in every completed run is at most 512 MiB and at most 10,000 PNGs.
The closest observed full part was 536,870,795 bytes (117 bytes below 512 MiB),
and a 216,000-frame run contained a 10,000-frame part. Frame names are one-based
with one fixed width per job (`frame-00001`–`frame-45000`, `frame-000001`–
`frame-108000`, etc.). Every part's ZIP entries were CRC-tested; first and last
frames were decoded and checked for 1280×720/3840×2160/1920×1080 dimensions and
alpha.

Raw evidence and retained ZIPs: `.dispatch/e2e/png1500`, `png108k`, `png216k`,
`png4k`, `png1080p60`, `png-recovery`, `png-cancel`. The 216,000-frame summary
was reconstructed after a disk-full interruption during download; all 42 parts
were later downloaded and CRC-verified (`png216k/archive-verification.json`).

## Memory and process observations

Chrome 156, persistent profile, pages kept open; JS heap from CDP, worker heap
from the dedicated worker target, renderer RSS from `SystemInfo.getProcessInfo`.
Forced GC was used only for endpoint observation.

| Run | Main heap range | Worker heap range | Renderer RSS peak | End after GC |
|---|---:|---:|---:|---:|
| 45,000 frames | 39.3–71.1 MiB | 2.2–5.6 MiB | 1,649.6 MiB | 21.3 MiB main / 984.2 MiB renderer |
| 108,000 frames | 34.7–75.9 MiB | 2.1–9.3 MiB | 1,659.9 MiB | 21.7 MiB main / 1,143.1 MiB renderer |
| 216,000 frames | 25.8–80.0 MiB | 2.4–9.7 MiB | 1,679.5 MiB | 22.9 MiB main / 1,073.9 MiB renderer |
| 4K, 3,600 frames | 55.9–83.9 MiB | 2.1–2.2 MiB | 1,713.8 MiB | 22.2 MiB main / 1,370.3 MiB renderer |
| 1080p60, 18,000 frames | 43.2–70.0 MiB | 2.7–9.7 MiB | 1,438.1 MiB | 22.4 MiB main / 1,255.4 MiB renderer |

Main and worker heaps stayed bounded while output grew to 22 GB; the renderer
RSS is reported separately and does not track total output growth after warm-up.
Process-tree RSS (browser + helpers) peaked around 2.5 GiB. Sampling is periodic,
not an exhaustive microsecond peak.

## Storage, recovery and errors

- PART admission counts local headers, data descriptors, every previously
  pending central-directory record, helper entries and EOCD. Actual-disk smoke:
  exactly 536,870,912 bytes accepted, one byte over rejected; closed oversized
  parts rejected.
- OPFS writes used real temp-file write/flush/close/read/delete probes. A failed
  flush still releases the exclusive handle so cleanup can remove the part.
- The browser's quota grew with real usage: 45,000 frames used 8.2 GB; 216,000
  frames used 22.0 GB without an override (`quotaOverrideGB=0`). The harness
  reports the quota before/after each run.
- Crash recovery: committed parts were preserved byte-for-byte, the unfinished
  part was redone, and the resumed boundary pixels were identical after the
  pinned-font repair. Settings, font, missing/corrupt part and finalization-only
  resume cases have engine regressions that assert rejected resumes do not
  rewrite the manifest/checkpoint.
- Cancel keeps completed parts and exposes resume; memory-mode exports return
  `resumeAvailable=false`.
- Errors carry stable codes; browser AbortError from the picker is treated as a
  cancelled preparation, not an export failure. Directory output failures are
  classified separately from quota failures.

## Font and script consistency

- Built-in Geist Mono/Sans are bundled under `public/fonts` and loaded into the
  export worker before rendering; `customFontFamily` reaches both measurement
  and drawing. This removes OS-generic fallback changes between workers.
- Exported `convert-to-prores.sh` checks every frame from 1 to N before ffmpeg
  and refuses a missing middle frame. macOS/Linux script execution and the
  Windows batch escaping are covered by tests; the Windows batch was not run on
  Windows.
- Independent supervisor evidence: a 900-frame complete export converted to
  ProRes 4444 (`ffprobe`: 900 frames, 30 fps, 30.000 s, 1280×720, alpha 0..255);
  a missing-middle fixture refused conversion and created no video. macOS
  Archive Utility created one folder per ZIP, confirming the merge instructions.
- Independent supervisor evidence: Blender 4.5.15 LTS imported 45,000 and
  108,000 frames at 30 fps for exactly 1500 s and 3600 s before the final font
  repair. Final-build editor re-import and the native macOS directory rerun on
  the final build remain unverified gates.

## Remaining blockers

1. Windows Chrome 108,000-frame high-complexity row: no Windows VM/device or
   authorization to use one.
2. Desktop Safari and real Android/iOS rows: automation/device access disabled
   or absent; no UA emulation is accepted as a substitute.
3. Final-build editor import and final-build native directory/picker proof are
   retained for independent supervisor verification; the earlier import and
   native-directory proofs were captured before the font pinning change.
4. Windows batch conversion and Windows ZIP extraction remain unverified.
