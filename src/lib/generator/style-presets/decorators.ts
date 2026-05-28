import type {
  RenderThemePresetId,
  StylePresetDecorator,
} from "@/lib/generator/types";

const scanlineOverlay: StylePresetDecorator = (context, { surface }) => {
  context.save();
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "rgba(0, 0, 0, 0.18)";
  const stride = 3;
  for (let y = 0; y < surface.height; y += stride) {
    context.fillRect(0, y, surface.width, 1);
  }
  context.restore();
};

const glassBackdrop: StylePresetDecorator = (context, { surface }) => {
  context.save();
  const pillWidth = Math.min(surface.width * 0.6, 720);
  const pillHeight = Math.min(surface.height * 0.32, 220);
  const pillX = (surface.width - pillWidth) / 2;
  const pillY = (surface.height - pillHeight) / 2;
  const radius = Math.min(pillHeight / 2, 48);

  context.beginPath();
  context.moveTo(pillX + radius, pillY);
  context.lineTo(pillX + pillWidth - radius, pillY);
  context.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + radius);
  context.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
  context.quadraticCurveTo(
    pillX + pillWidth,
    pillY + pillHeight,
    pillX + pillWidth - radius,
    pillY + pillHeight,
  );
  context.lineTo(pillX + radius, pillY + pillHeight);
  context.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - radius);
  context.lineTo(pillX, pillY + radius);
  context.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
  context.closePath();

  context.fillStyle = "rgba(255, 255, 255, 0.08)";
  context.fill();
  context.lineWidth = 1.5;
  context.strokeStyle = "rgba(255, 255, 255, 0.22)";
  context.stroke();
  context.restore();
};

const neumorphicBackdrop: StylePresetDecorator = (context, { surface }) => {
  context.save();
  const pillWidth = Math.min(surface.width * 0.55, 640);
  const pillHeight = Math.min(surface.height * 0.3, 200);
  const pillX = (surface.width - pillWidth) / 2;
  const pillY = (surface.height - pillHeight) / 2;
  const radius = 32;

  context.beginPath();
  context.moveTo(pillX + radius, pillY);
  context.arcTo(
    pillX + pillWidth,
    pillY,
    pillX + pillWidth,
    pillY + radius,
    radius,
  );
  context.arcTo(
    pillX + pillWidth,
    pillY + pillHeight,
    pillX + pillWidth - radius,
    pillY + pillHeight,
    radius,
  );
  context.arcTo(
    pillX,
    pillY + pillHeight,
    pillX,
    pillY + pillHeight - radius,
    radius,
  );
  context.arcTo(pillX, pillY, pillX + radius, pillY, radius);
  context.closePath();

  context.shadowBlur = 24;
  context.shadowOffsetX = 12;
  context.shadowOffsetY = 12;
  context.shadowColor = "rgba(5, 8, 14, 0.65)";
  context.fillStyle = "#262B38";
  context.fill();

  context.shadowOffsetX = -10;
  context.shadowOffsetY = -10;
  context.shadowColor = "rgba(255, 255, 255, 0.08)";
  context.fill();

  context.restore();
};

const DECORATORS: Partial<
  Record<
    RenderThemePresetId,
    {
      drawBackdrop?: StylePresetDecorator;
      drawOverlay?: StylePresetDecorator;
    }
  >
> = {
  scanline: { drawOverlay: scanlineOverlay },
  glass: { drawBackdrop: glassBackdrop },
  neumorphic: { drawBackdrop: neumorphicBackdrop },
};

export function getStylePresetDecorators(presetId: RenderThemePresetId) {
  return DECORATORS[presetId] ?? {};
}
