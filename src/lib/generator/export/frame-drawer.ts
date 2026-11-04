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
  const displayText = formatCountdownTime(
    getRemainingDurationSeconds(settings.timer.durationSeconds, elapsedSeconds),
    settings.timer.displayFormat,
  );
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
