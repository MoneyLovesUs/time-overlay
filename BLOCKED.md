# BLOCKED.md — merged delivery notes (task A: mobile MP4 export; task B: Pro purchase backend)

---

## Task A — lane A (feat/mobile-mp4-export)

### Blockers / awaiting-user

无。No account-resource dialog (quota reset / upgrade / purchase / payment /
subscription / billing change / payment-method / account-level OAuth or login
choice) was encountered; nothing is awaiting user input.

### Pending dependency (recorded at task 0) — RESOLVED

At task 0, origin/main lacked fd3ddf3 (B alone owns the baseline main push, so
this lane did not push main). Re-fetched before delivery:
origin/main = fd3ddf349dd7af70c8af63247dcc90c15b6a03, which is an ancestor of
this branch, so the delivery diff was whitelist-only.

### Interpretation notes (not blockers)

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
  verification; the immediate rerun passed and the final build is green.

### Out-of-scope ideas spotted but NOT done (per task book)

无 — no unrelated fixes attempted (no PNG memory work, no webm changes).

---

## Task B — lane B (Pro purchase backend)

### Current blockers

None.

### Intentionally not done (recorded per the task book; not implemented)

- Pro marketing/intro page ("/pro" landing page): outside this lane's file
  whitelist; presentation of the offer belongs to the frontend lane.
- Stripe webhook: the approved design verifies payment by querying the
  checkout session (spec 2, "不做 webhook"); no webhook endpoint was built.
- API rate limiting: the baseline repo has no rate-limiting infrastructure and
  the whitelist does not allow adding any; deferred.
- Purchase receipt emails: no email service is authorized for this lane;
  purchase recovery uses the email-based restore endpoint instead.
