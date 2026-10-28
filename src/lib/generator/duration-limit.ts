/**
 * `duration_limit_hit` used to fire on every edit above the free cap, so one
 * person nudging 300 → 600 → 900 produced three events (1,522 events from 337
 * people in two weeks). The metric only means something as an intent signal:
 * report the moment the field crosses the cap, not every keystroke after it.
 */
export type DurationLimitState = {
  aboveLimit: boolean;
};

export function resolveDurationLimitState(
  previous: DurationLimitState,
  requestedSeconds: number,
  limitSeconds: number,
): { state: DurationLimitState; crossedUp: boolean } {
  const aboveLimit = requestedSeconds > limitSeconds;
  return {
    state: { aboveLimit },
    crossedUp: aboveLimit && !previous.aboveLimit,
  };
}
