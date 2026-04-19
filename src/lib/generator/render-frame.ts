import { getTimerBoxPosition } from "@/lib/generator/layout";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";
import type { GeneratorSettings, TextStyleSettings } from "@/lib/generator/types";

type TextBoxSize = {
  width: number;
  height: number;
};

type FrameSize = {
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

const TEXT_REGION_FILL_RATIO = 0.84;
const MAX_TEXT_SCALE = 3;

function getAnchorRegionSize(
  frame: FrameSize,
  anchor: GeneratorSettings["placement"]["anchor"],
  safeAreaInset: number,
) {
  const contentWidth = Math.max(1, frame.width - safeAreaInset * 2);
  const contentHeight = Math.max(1, frame.height - safeAreaInset * 2);

  const [verticalKey, horizontalKey] =
    anchor === "center"
      ? (["center", "center"] as const)
      : (anchor.split("-") as [
          "top" | "center" | "bottom",
          "left" | "center" | "right",
        ]);

  return {
    width:
      horizontalKey === "center" ? contentWidth : Math.max(1, Math.floor(contentWidth / 2)),
    height:
      verticalKey === "center" ? contentHeight : Math.max(1, Math.floor(contentHeight / 2)),
  };
}

function resolveTextScale(
  frame: FrameSize,
  textBox: TextBoxSize,
  anchor: GeneratorSettings["placement"]["anchor"],
  safeAreaInset: number,
) {
  const anchorRegion = getAnchorRegionSize(frame, anchor, safeAreaInset);
  const widthScale = (anchorRegion.width * TEXT_REGION_FILL_RATIO) / textBox.width;
  const heightScale = (anchorRegion.height * TEXT_REGION_FILL_RATIO) / textBox.height;

  return Math.max(0.5, Math.min(widthScale, heightScale, MAX_TEXT_SCALE));
}

function scaleFrameTextStyle(style: FrameTextStyle, scale: number): FrameTextStyle {
  return {
    ...style,
    fontSize: Math.max(1, Math.round(style.fontSize * scale)),
    strokeWidth: Number((style.strokeWidth * scale).toFixed(2)),
    glowBlur: Number((style.glowBlur * scale).toFixed(2)),
    shadowBlur: Number((style.shadowBlur * scale).toFixed(2)),
    shadowOffsetX: Number((style.shadowOffsetX * scale).toFixed(2)),
    shadowOffsetY: Number((style.shadowOffsetY * scale).toFixed(2)),
  };
}

export function createRenderFrameState({
  settings,
  elapsedSeconds,
  textBox,
  safeAreaInset,
}: RenderFrameStateInput): RenderFrameState {
  const frame = {
    width: settings.canvas.width,
    height: settings.canvas.height,
  };
  const remainingSeconds = getRemainingDurationSeconds(
    settings.timer.durationSeconds,
    elapsedSeconds,
  );
  const text = formatCountdownTime(remainingSeconds, settings.timer.displayFormat);
  const baseStyle: FrameTextStyle = {
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
  };
  const textScale = resolveTextScale(
    frame,
    textBox,
    settings.placement.anchor,
    safeAreaInset,
  );
  const scaledTextBox = {
    width: Math.max(1, Math.ceil(textBox.width * textScale)),
    height: Math.max(1, Math.ceil(textBox.height * textScale)),
  };
  const style = scaleFrameTextStyle(baseStyle, textScale);
  const position = getTimerBoxPosition({
    frame,
    textBox: scaledTextBox,
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
    style,
    frame,
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
