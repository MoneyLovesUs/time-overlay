type Canvas2dContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

type DrawWatermarkOptions = {
  canvasWidth: number;
  canvasHeight: number;
  text?: string;
};

const DEFAULT_TEXT = "timeoverlay.co";

export function drawWatermark(
  context: Canvas2dContext,
  { canvasWidth, canvasHeight, text = DEFAULT_TEXT }: DrawWatermarkOptions,
) {
  const referenceSize = Math.min(canvasWidth, canvasHeight);
  const fontSize = Math.max(12, Math.round(referenceSize * 0.022));
  const padding = Math.max(12, Math.round(referenceSize * 0.018));

  context.save();
  context.font = `500 ${fontSize}px ui-monospace, monospace`;
  context.textBaseline = "alphabetic";
  context.textAlign = "right";
  context.shadowBlur = Math.max(4, fontSize * 0.4);
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 1;
  context.fillStyle = "rgba(248, 250, 252, 0.72)";
  context.fillText(text, canvasWidth - padding, canvasHeight - padding);
  context.restore();
}
