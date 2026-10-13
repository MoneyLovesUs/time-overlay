# BLOCKED.md — lane A (feat/mobile-mp4-export)

## Blockers / awaiting-user

无。No account-resource dialog (quota reset / upgrade / purchase / payment /
subscription / billing change / payment-method / account-level OAuth or login
choice) was encountered; nothing is awaiting user input.

## Pending dependency (recorded at task 0) — RESOLVED

At task 0, origin/main lacked fd3ddf3 (B alone owns the baseline main push, so
this lane did not push main). Re-fetched before delivery:
origin/main = fd3ddf349dd7af70c8af63247dcc90c15b6a03, which is an ancestor of
this branch, so `git diff origin/main...HEAD --stat` is whitelist-only.
No dependency remains.

## Interpretation notes (not blockers)

- "手机上自动切 mp4"（规格 4.1 第 6 条）implemented as
  `deviceType === "mobile"` only; tablets keep the png-sequence default, so
  their behavior is never worse than main. The decision lives in the pure
  function `resolveDefaultExportFormat`, so widening it later is a one-line
  change plus tests.
- `LocalExportSupport.supportsMp4` is optional (`undefined` while the async
  probe is in flight) because the existing test
  "returns a stable SSR-safe fallback snapshot" pins
  `getInitialLocalExportSupport()` with an exact `toEqual`, and existing test
  assertions must not be modified.
- The non-mp4 mobile limit expressions
  (`durationSeconds > 60`, `canvasPixels > 1920 * 1080`,
  `pixelFrames > 1_900_000_000`) are verbatim from main; they only moved one
  indentation level into the non-mp4 branch.
- One transient `next build` worker failure occurred during task-2
  verification; the immediate rerun passed and the final build is green
  (.dispatch/task2-build.log, .dispatch/task3-build.log).

## Out-of-scope ideas spotted but NOT done (per task book)

无 — no unrelated fixes attempted (no PNG memory work, no webm changes).
