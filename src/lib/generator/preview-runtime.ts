type PreviewPlaybackAdvanceInput = {
  timestamp: number;
  previousElapsedSeconds: number;
  durationSeconds: number;
  startedAtTimestamp: number | null;
};

type PreviewPlaybackAdvanceResult = {
  completed: boolean;
  elapsedSeconds: number;
  startedAtTimestamp: number | null;
};

type CanvasSizeTarget = {
  width: number;
  height: number;
};

export function clampPreviewElapsedSeconds(
  elapsedSeconds: number,
  durationSeconds: number,
) {
  return Math.max(0, Math.min(elapsedSeconds, durationSeconds));
}

export function advancePreviewPlayback({
  timestamp,
  previousElapsedSeconds,
  durationSeconds,
  startedAtTimestamp,
}: PreviewPlaybackAdvanceInput): PreviewPlaybackAdvanceResult {
  const baseTimestamp =
    startedAtTimestamp ?? timestamp - previousElapsedSeconds * 1000;
  const nextElapsedSeconds = (timestamp - baseTimestamp) / 1000;

  if (nextElapsedSeconds >= durationSeconds) {
    return {
      completed: true,
      elapsedSeconds: durationSeconds,
      startedAtTimestamp: null,
    };
  }

  return {
    completed: false,
    elapsedSeconds: nextElapsedSeconds,
    startedAtTimestamp: baseTimestamp,
  };
}

export function syncCanvasElementSize(
  canvas: CanvasSizeTarget,
  width: number,
  height: number,
) {
  if (canvas.width === width && canvas.height === height) {
    return false;
  }

  canvas.width = width;
  canvas.height = height;

  return true;
}
