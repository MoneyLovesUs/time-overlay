/**
 * Stable numbering for PNG-sequence exports.
 *
 * Frame indices are 0-based internally and one-based in file names. The width
 * is fixed for the whole job so every part shares the same names: 30 fps for an
 * hour needs six digits (frame-108000.png), while a short job keeps four.
 */

export function getPngTotalFrames(durationSeconds: number, fps: number): number {
  return Math.max(1, Math.round(durationSeconds * fps));
}

export function getPngFrameNameWidth(totalFrames: number): number {
  return Math.max(4, String(Math.max(1, totalFrames)).length);
}

export function getPngFrameFileName(
  frameIndex: number,
  frameNameWidth: number,
): string {
  return `frame-${String(frameIndex + 1).padStart(frameNameWidth, "0")}.png`;
}

/** ffmpeg-style %0Nd pattern, built from the frozen width. */
export function getPngFramePattern(frameNameWidth: number): string {
  return `frame-%0${frameNameWidth}d.png`;
}

/** timer-part-001.zip; 10,000 PNGs per part cannot exceed three digits. */
export function getPngPartFileName(partNumber: number): string {
  return `timer-part-${String(partNumber).padStart(3, "0")}.zip`;
}

export const PNG_PART_FILE_NAME_PATTERN = /^timer-part-\d{3,6}\.zip$/;

export function getPngJobDirectoryName(jobId: string): string {
  return `time-overlay-${jobId}`;
}

export const PNG_JOB_DIRECTORY_PATTERN = /^time-overlay-[A-Za-z0-9-]{8,64}$/;

export function getPngOpfsNamespace(): string {
  return "time-overlay-png";
}

export function getPngPartFrameRange(
  frameIndex: number,
  totalFrames: number,
  frameNameWidth: number,
): { firstName: string; lastName: string } {
  const lastFrameIndex = Math.min(totalFrames - 1, frameIndex);
  return {
    firstName: getPngFrameFileName(0, frameNameWidth),
    lastName: getPngFrameFileName(lastFrameIndex, frameNameWidth),
  };
}
