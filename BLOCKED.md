# BLOCKED — lane B (Pro purchase backend)

## Current blockers

None.

## Intentionally not done (recorded per the task book; not implemented)

- Pro marketing/intro page ("/pro" landing page): outside this lane's file
  whitelist; presentation of the offer belongs to the frontend lane.
- Stripe webhook: the approved design verifies payment by querying the
  checkout session (spec 2, "不做 webhook"); no webhook endpoint was built.
- API rate limiting: the baseline repo has no rate-limiting infrastructure and
  the whitelist does not allow adding any; deferred.
- Purchase receipt emails: no email service is authorized for this lane;
  purchase recovery uses the email-based restore endpoint instead.
