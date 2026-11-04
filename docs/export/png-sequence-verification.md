# 3600-second PNG sequence export verification

Status: implementation complete; full-size rows verified locally, with the
platform gates listed below still unverified. This document records observed
results, not promises. It does not authorize a production release.

Reference contract: `docs/superpowers/specs/2026-11-03-long-png-sequence-export.md`.

## Environment and build

- Hardware: Apple M3 Max, 36 GiB RAM, macOS arm64.
- Browser for the lane runs: Google Chrome 156 headless (`HeadlessChrome/156.0.0.0`), persistent profile with the browser's real storage quota.
- Supervisor independently ran `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test -- --run` (465 tests across 81 files) and `pnpm build` on source commit `296d330`; all exited 0.
- Full-size lane runs used `127.0.0.1:4317`; the supervisor's final production-build recovery smoke used `127.0.0.1:4319`. No telemetry was sent to production. No upload of frames or fonts occurs.

## Browser/output matrix

| Row | Result | Observed output |
|---|---|---|
| Chrome, 1500 s, 720p, 30 fps, transparent, Center Mono | Pass | 45,000 frames, 15 ZIPs, 7,821,704,765 bytes, 240.4 s; all CRC, continuity, part limit and boundary alpha checks passed |
| Chrome, 3600 s, 720p, 30 fps, simple template (Transparent Minimal, SS) | Pass | 108,000 frames, 14 ZIPs, 7,030,934,719 bytes, 294.0 s; all checks passed |
| Chrome, Windows, 3600 s, high-complexity template | Blocked | Designated LAPTOP-6IC50N8N offline / SSH timeout; not simulated |
| Chrome, 3600 s, 720p, 60 fps | Pass | 216,000 frames, 27 ZIPs, 14,061,863,655 bytes, 567.4 s; all CRC/continuity/limits/boundary alpha passed |
| Chrome, 4K/30 representative short | Pass | 120 s, 3,600 frames, 2 ZIPs, 692,387,262 bytes; real byte split at frame 2,779 |
| Chrome, 1080p/60 representative short | Pass | 300 s, 18,000 frames, 3 ZIPs, 1,386,130,622 bytes; real byte splits at frames 6,363 and 13,585 |
| Chrome, long job interrupted and restarted | Pass | 300 s job killed after two committed parts (6,087 frames) with writes into part 3; resume completed 9,000 continuous frames. Both prior ZIPs kept identical names/bytes; boundary frames 6087/6088 decoded to the same RGBA MD5 (`e4d7d38138edc1b3a744feeba1a2e427`) |
| Chrome, cooperative cancel and resume | Pass | Cancelled after two committed parts (6,087 frames); both ZIPs kept; resume produced 9,000 continuous frames |
| Chrome, short job (earlier font build) | Pass on that build | 30 s produced one 166,960,560-byte ZIP automatically; 900 frames, CRC and alpha OK; byte size is historical |
| Desktop Safari | Blocked | Safari WebDriver remote automation is off; not replaced with WebKit/UA emulation |
| Android Chrome / iOS Safari real devices | Blocked | No Android device attached; paired iPhone has Web Inspector off |

Each part in every completed run is at most 512 MiB and at most 10,000 PNGs.
The closest observed full part on the final build was 536,868,258 bytes (2,654
bytes below 512 MiB); the 216,000-frame run exercised the exact 10,000-PNG part
cap. Frame names are one-based
with one fixed width per job (`frame-00001`–`frame-45000`, `frame-000001`–
`frame-108000`, etc.). Every part's ZIP entries were CRC-tested; first and last
frames were decoded and checked for 1280×720/3840×2160/1920×1080 dimensions and
alpha.

Raw evidence and retained ZIPs: `.dispatch/e2e/png1500`, `png108k`, `png216k`,
`png4k`, `png1080p60`, `png-recovery`, `png-cancel`. The final variable-weight
216,000-frame run contains 27 parts. An earlier, superseded 42-part run hit a
host disk-full error during download; that run's recovery report is historical
evidence, not the final 27-part manifest.

## Memory and process observations

Chrome 156, persistent profile, pages kept open; JS heap from CDP, worker heap
from the dedicated worker target, renderer RSS from `SystemInfo.getProcessInfo`.
Forced GC was used only for endpoint observation.

| Run | Main heap range | Worker heap range | Renderer RSS peak | End after GC |
|---|---:|---:|---:|---:|
| 45,000 frames | 46.7–78.0 MiB | 2.7–6.0 MiB | 1,655.8 MiB | 22.8 MiB main / 1,231.0 MiB renderer |
| 108,000 frames | 39.1–81.6 MiB | 3.1–13.0 MiB | 1,673.1 MiB | 21.3 MiB main / 987.1 MiB renderer |
| 216,000 frames | 24.3–79.5 MiB | 2.1–14.4 MiB | 1,689.9 MiB | 22.0 MiB main / 1,075.4 MiB renderer |
| 4K, 3,600 frames | 42.6–59.6 MiB | 2.3–3.6 MiB | 1,650.2 MiB | 22.4 MiB main / 910.3 MiB renderer |
| 1080p60, 18,000 frames | 41.3–88.8 MiB | 4.4–9.6 MiB | 1,692.7 MiB | 22.4 MiB main / 1,334.9 MiB renderer |

Main and worker heaps stayed bounded while output grew to 14 GB; the renderer
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
- Real browser storage usage, without a quota override (`quotaOverrideGB=0`),
  reached 7,821,941,319 bytes for 45,000 frames and 14,062,453,966 bytes for
  216,000 frames. These usage figures include metadata and are distinct from
  the ZIP byte totals above. The harness records quota before/after each run.
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

- A registered-but-unloaded `@font-face` is explicitly loaded before the helper
  resolves. Real Chrome test: aliases registered as `unloaded`, then the first
  `/live` fillText saw both faces `loaded` and painted `05:00`.
- Main-thread WebM waits for fonts inside its cleanup scope and races the wait
  against abort. Font rejection removes visibility/abort listeners and stops
  capture tracks; cancellation while the font promise is unresolved rejects
  immediately with the provided reason. Both cases have regressions.
- The live overlay initializes its clock once, after font readiness, and only
  schedules the next animation frame inside `tick`. A real Chrome run painted
  `05:00 → 04:59 → 04:58 → …` across 4.5 seconds; a jsdom regression exercises
  80 frames and asserts the same progression.
- Built-in Geist Mono/Sans are bundled under `public/fonts` and loaded into the
  export worker, generator preview, live overlay and main-thread WebM recorder
  with matching `100 900` weight descriptors before rendering; `customFontFamily`
  reaches both measurement and drawing. A failed font fetch now produces a
  visible localized export error and a preview alert instead of a stuck
  preparation or a silent fallback. The preview and an explicitly constructed
  worker face render the same decoded RGBA hash (`fb701fd1`) at 700/100 px.
- Exported `convert-to-prores.sh` checks every frame from 1 to N before ffmpeg
  and refuses a missing middle frame. macOS/Linux script execution and the
  Windows batch escaping are covered by tests; the Windows batch was not run on
  Windows. Engine regressions use a gated disk writable to prove one encoded
  frame at a time, and write/close failures leave committed parts and manifest
  frame counts at zero.
- Independent supervisor evidence: a 900-frame complete export converted to
  ProRes 4444 (`ffprobe`: 900 frames, 30 fps, 30.000 s, 1280×720, alpha 0..255);
  a missing-middle fixture refused conversion and created no video. macOS
  Archive Utility created one folder per ZIP, confirming the merge instructions.
- Independent supervisor evidence: the variable-weight-corrected 45,000 /
  108,000 / 216,000 / 4K / 1080p60 archives all passed entry CRC, PNG
  dimensions/alpha type, global numbering, part bounds and boundary-image
  review. Blender 4.5.15 LTS imported the 45,000- and 108,000-frame outputs at
  30 fps for exactly 1500 s and 3600 s. Supervisor crash/restart proof on the
  corrected source preserved two committed volumes and produced an identical
  RGBA hash across frames 6087/6088. Supervisor real-browser checks confirmed
  the live clock progresses and pre-registered unloaded faces are loaded before
  the first paint. The native macOS directory proof (9,000 frames, real picker
  and permission prompt) predates the font-weight repair; the directory sink
  code is unchanged, but a final-build native rerun is not claimed here.
- Final production-build supervisor smoke also passed: after killing Chrome
  with two volumes committed, both saved files were preserved and rendering
  resumed at frame index 6,087 to produce 9,000 continuous CRC-valid frames.
  Initial preview/exported-first-frame RGBA hashes matched; frames 6087/6088
  across the restart also had identical RGBA hashes. No page errors occurred.
- Independent WebM fault injection showed a visible font error with no retained
  visibility listeners. With the font request left unresolved, cancellation
  returned to the cancelled state within the 0.714-second observation and
  removed its visibility listeners.

## Remaining blockers

1. Windows Chrome 108,000-frame high-complexity row: the designated
   LAPTOP-6IC50N8N was offline / its SSH connection timed out, so the row was
   not executed.
2. Desktop Safari and real Android/iOS rows: Safari WebDriver remote automation
   is off and a native Safari attempt did not hydrate the generator; no Android
   device is attached and the paired iPhone has Web Inspector off. No UA or
   WebKit simulation is accepted as a substitute.
3. The final-build native macOS directory/picker rerun was blocked by System
   Events assistive-access denial (`-25211`). Its owned test browser was closed.
   The earlier real-directory proof predates the font-weight repair; the
   directory sink itself is unchanged, but final-build success is not claimed.
4. Windows batch conversion and Windows ZIP extraction remain unverified.
