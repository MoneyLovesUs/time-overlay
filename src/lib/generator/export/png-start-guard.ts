/**
 * Synchronous claim for the preparation-to-run transition. Two rapid clicks
 * must not both pass the async lock acquisition: the loser would report a
 * false pngLocked failure and terminate the winning worker.
 */
export function createPngStartGuard() {
  let busy = false;
  return {
    claim(): boolean {
      if (busy) {
        return false;
      }
      busy = true;
      return true;
    },
    release(): void {
      busy = false;
    },
    isBusy(): boolean {
      return busy;
    },
  };
}

export type PngStartGuard = ReturnType<typeof createPngStartGuard>;

export function claimPngStart(
  guard: PngStartGuard,
  currentJobId: string | undefined,
  expectedJobId: string,
  onClaim: () => void,
): boolean {
  if (guard.isBusy() || currentJobId !== expectedJobId) {
    return false;
  }
  if (!guard.claim()) {
    return false;
  }
  onClaim();
  return true;
}
