export type WebmTimelineTick = {
  elapsedSeconds: number;
  completedFrames: number;
  shouldRender: boolean;
};

type RunWebmTimelineOptions = {
  durationSeconds: number;
  fps: number;
  signal: AbortSignal;
  onTick: (tick: WebmTimelineTick) => void;
  now?: () => number;
  waitUntil?: (deadlineMs: number, signal: AbortSignal) => Promise<void>;
};

function abortReason(signal: AbortSignal): unknown {
  return signal.reason ?? new DOMException("The export was cancelled.", "AbortError");
}

export function waitUntilWebmDeadline(
  deadlineMs: number,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(abortReason(signal));
      return;
    }

    const onAbort = () => {
      globalThis.clearTimeout(timerId);
      reject(abortReason(signal));
    };
    const timerId = globalThis.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, Math.max(0, deadlineMs - performance.now()));

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Drive MediaRecorder from absolute wall-clock deadlines. The overlay only
 * changes on whole-second countdown boundaries, so drawing 24/30 identical
 * canvases per second wastes main-thread time and makes timer drift cumulative.
 */
export async function runWebmTimeline({
  durationSeconds,
  fps,
  signal,
  onTick,
  now = () => performance.now(),
  waitUntil = waitUntilWebmDeadline,
}: RunWebmTimelineOptions): Promise<void> {
  const startedAt = now();
  const durationMs = Math.max(0, durationSeconds * 1_000);
  const finishAt = startedAt + durationMs;
  const totalFrames = Math.max(1, Math.round(durationSeconds * fps));
  const finalFrameAt = Math.max(startedAt, finishAt - 1_000 / fps);
  let lastRenderedSecond = -1;
  let finalFrameRendered = false;

  while (true) {
    if (signal.aborted) {
      throw abortReason(signal);
    }

    const currentTime = now();
    const elapsedMs = Math.max(0, currentTime - startedAt);

    if (elapsedMs >= durationMs) {
      if (!finalFrameRendered) {
        // If a long main-thread task jumped over the planned final-frame
        // deadline, submit the same 00:01 frame now before MediaRecorder stops.
        // No 00:00 tail is introduced.
        onTick({
          elapsedSeconds: Math.max(0, durationSeconds - 1 / fps),
          completedFrames: totalFrames,
          shouldRender: true,
        });
      }
      break;
    }

    const elapsedSeconds = elapsedMs / 1_000;
    const elapsedWholeSecond = Math.floor(elapsedSeconds);
    const isFinalFrame = currentTime >= finalFrameAt;
    onTick({
      elapsedSeconds,
      completedFrames: isFinalFrame
        ? totalFrames
        : Math.min(totalFrames, Math.floor(elapsedSeconds * fps) + 1),
      shouldRender:
        elapsedWholeSecond !== lastRenderedSecond ||
        (isFinalFrame && !finalFrameRendered),
    });
    lastRenderedSecond = elapsedWholeSecond;
    finalFrameRendered ||= isFinalFrame;

    const nextSecondAt = startedAt + (elapsedWholeSecond + 1) * 1_000;
    const nextDeadline =
      !finalFrameRendered && finalFrameAt > currentTime
        ? Math.min(nextSecondAt, finalFrameAt, finishAt)
        : Math.min(nextSecondAt, finishAt);
    await waitUntil(nextDeadline, signal);
  }

  if (signal.aborted) {
    throw abortReason(signal);
  }
}
