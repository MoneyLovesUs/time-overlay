import {
  createRenderFrameState,
  measureRenderTextBox,
  renderStyledFrame,
} from "@/lib/generator/render-frame";
import {
  formatCountdownTime,
  getRemainingDurationSeconds,
} from "@/lib/generator/time";
import type { GeneratorSettings } from "@/lib/generator/types";

export type DrawExportFrameOptions = {
  context: OffscreenCanvasRenderingContext2D;
  settings: GeneratorSettings;
  frameIndex: number;
  fps: number;
};

/**
 * The displayed countdown text is the only input that varies between frames:
 * every other visual input comes from the job settings, so two frames with the
 * same text are pixel-identical. Exports use this to write each distinct image
 * once instead of repeating it for every frame inside the same second.
 */
export function getExportFrameText(
  settings: GeneratorSettings,
  frameIndex: number,
  fps: number,
): string {
  return formatCountdownTime(
    getRemainingDurationSeconds(settings.timer.durationSeconds, frameIndex / fps),
    settings.timer.displayFormat,
  );
}

/**
 * Number of distinct images the job will produce. Equal to `totalFrames` for
 * sub-second countdowns, and to roughly `duration + 1` for whole-second ones.
 */
export function countDistinctFrameTexts(
  settings: GeneratorSettings,
  totalFrames: number,
  fps: number,
): number {
  let count = 0;
  let previous: string | null = null;
  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
    const text = getExportFrameText(settings, frameIndex, fps);
    if (text !== previous) {
      count += 1;
      previous = text;
    }
  }
  return count;
}

/**
 * Shared by every export format so sampling and the real run render the exact
 * same pixels for a given global frame index.
 */
export function drawExportFrame({
  context,
  settings,
  frameIndex,
  fps,
}: DrawExportFrameOptions) {
  const elapsedSeconds = frameIndex / fps;
  const displayText = getExportFrameText(settings, frameIndex, fps);
  const textBox = measureRenderTextBox(context, displayText, {
    fontFamily: settings.textStyle.fontFamily,
    customFontFamily: settings.textStyle.customFontFamily,
    fontSize: settings.textStyle.fontSize,
    fontWeight: settings.textStyle.fontWeight,
    letterSpacing: settings.textStyle.letterSpacing,
    textColor: settings.textStyle.textColor,
    strokeWidth: settings.textStyle.strokeWidth,
    strokeColor: settings.textStyle.strokeColor,
    glowBlur: settings.textStyle.glowBlur,
    glowColor: settings.textStyle.glowColor,
    shadowBlur: settings.textStyle.shadowBlur,
    shadowColor: settings.textStyle.shadowColor,
    shadowOffsetX: settings.textStyle.shadowOffsetX,
    shadowOffsetY: settings.textStyle.shadowOffsetY,
  });
  const frameState = createRenderFrameState({
    settings,
    elapsedSeconds,
    textBox,
    safeAreaInset: 32,
  });

  renderStyledFrame(
    context,
    frameState,
    settings.themePresetId,
    settings.templateId,
  );
}
