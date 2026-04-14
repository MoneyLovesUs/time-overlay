import { getTimerBoxPosition } from "@/lib/generator/layout";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";
import type { GeneratorSettings, TextStyleSettings } from "@/lib/generator/types";

type TextBoxSize = {
  width: number;
  height: number;
};

type RenderFrameStateInput = {
  settings: GeneratorSettings;
  elapsedSeconds: number;
  textBox: TextBoxSize;
  safeAreaInset: number;
};

type FrameTextStyle = Pick<
  TextStyleSettings,
  | "fontFamily"
  | "fontSize"
  | "fontWeight"
  | "letterSpacing"
  | "textColor"
  | "strokeWidth"
  | "strokeColor"
  | "glowBlur"
  | "glowColor"
  | "shadowBlur"
  | "shadowColor"
  | "shadowOffsetX"
  | "shadowOffsetY"
>;

export type RenderFrameState = {
  text: string;
  backgroundFill: string | null;
  position: {
    x: number;
    y: number;
  };
  style: FrameTextStyle;
  frame: {
    width: number;
    height: number;
  };
};

export function resolveCanvasFontFamily(fontFamily: FrameTextStyle["fontFamily"]) {
  return fontFamily === "geist-sans" ? "ui-sans-serif, sans-serif" : "ui-monospace, monospace";
}

export function createRenderFrameState({
  settings,
  elapsedSeconds,
  textBox,
  safeAreaInset,
}: RenderFrameStateInput): RenderFrameState {
  const remainingSeconds = getRemainingDurationSeconds(
    settings.timer.durationSeconds,
    elapsedSeconds,
  );
  const text = formatCountdownTime(remainingSeconds, settings.timer.displayFormat);
  const position = getTimerBoxPosition({
    frame: {
      width: settings.canvas.width,
      height: settings.canvas.height,
    },
    textBox,
    anchor: settings.placement.anchor,
    offsetX: settings.placement.offsetX,
    offsetY: settings.placement.offsetY,
    safeAreaInset,
  });

  return {
    text,
    backgroundFill:
      settings.canvas.backgroundMode === "solid"
        ? settings.canvas.backgroundColor
        : null,
    position,
    style: {
      fontFamily: settings.textStyle.fontFamily,
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
    },
    frame: {
      width: settings.canvas.width,
      height: settings.canvas.height,
    },
  };
}

export function measureRenderTextBox(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string,
  style: FrameTextStyle,
): TextBoxSize {
  context.font = `${style.fontWeight} ${style.fontSize}px ${resolveCanvasFontFamily(style.fontFamily)}`;
  const textMetrics = context.measureText(text);

  return {
    width: Math.max(1, Math.ceil(textMetrics.width)),
    height: Math.ceil(style.fontSize * 1.1),
  };
}

export function renderFrameToCanvas(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  frameState: RenderFrameState,
) {
  const { frame, backgroundFill, position, style, text } = frameState;

  context.clearRect(0, 0, frame.width, frame.height);

  if (backgroundFill) {
    context.fillStyle = backgroundFill;
    context.fillRect(0, 0, frame.width, frame.height);
  }

  context.font = `${style.fontWeight} ${style.fontSize}px ${resolveCanvasFontFamily(style.fontFamily)}`;
  context.textBaseline = "top";
  context.shadowBlur = style.shadowBlur;
  context.shadowColor = style.shadowColor;
  context.shadowOffsetX = style.shadowOffsetX;
  context.shadowOffsetY = style.shadowOffsetY;

  if (style.strokeWidth > 0) {
    context.lineWidth = style.strokeWidth;
    context.strokeStyle = style.strokeColor;
    context.strokeText(text, position.x, position.y);
  }

  context.shadowBlur = Math.max(style.shadowBlur, style.glowBlur);
  context.shadowColor = style.glowColor || style.shadowColor;
  context.fillStyle = style.textColor;
  context.fillText(text, position.x, position.y);
}
