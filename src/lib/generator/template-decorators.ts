import { SIGNATURE_TEMPLATE_IDS, getGeneratorTemplateById } from "@/lib/generator/templates";
import type {
  GeneratorSettings,
  TemplateMotif,
} from "@/lib/generator/types";

type RenderContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

type TemplateFrameState = {
  frame: { width: number; height: number };
  position: { x: number; y: number };
  textBox: { width: number; height: number };
};

function roundedRect(
  context: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.max(
    0,
    Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2),
  );

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height,
  );
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function getScale(frame: TemplateFrameState["frame"]) {
  return Math.max(0.55, Math.min(frame.width / 1280, frame.height / 720));
}

function getPlateBounds(frameState: TemplateFrameState, scale: number) {
  const paddingX = 32 * scale;
  const paddingY = 22 * scale;

  return {
    x: frameState.position.x - paddingX,
    y: frameState.position.y - paddingY,
    width: frameState.textBox.width + paddingX * 2,
    height: frameState.textBox.height + paddingY * 2,
  };
}

function drawKicker(
  context: RenderContext,
  label: string | undefined,
  x: number,
  y: number,
  color: string,
  scale: number,
) {
  if (!label) {
    return;
  }

  context.save();
  context.font = `700 ${Math.max(10, 12 * scale)}px ui-monospace, monospace`;
  context.textBaseline = "top";
  context.fillStyle = color;
  context.globalAlpha = 0.92;
  context.fillText(label, x, y);
  context.restore();
}

function drawCornerBrackets(
  context: RenderContext,
  inset: number,
  frame: TemplateFrameState["frame"],
  color: string,
  scale: number,
) {
  const length = 48 * scale;
  const width = Math.max(1.5, 2 * scale);
  const left = inset;
  const top = inset;
  const right = frame.width - inset;
  const bottom = frame.height - inset;

  context.save();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.globalAlpha = 0.72;
  context.beginPath();
  context.moveTo(left, top + length);
  context.lineTo(left, top);
  context.lineTo(left + length, top);
  context.moveTo(right - length, top);
  context.lineTo(right, top);
  context.lineTo(right, top + length);
  context.moveTo(right, bottom - length);
  context.lineTo(right, bottom);
  context.lineTo(right - length, bottom);
  context.moveTo(left + length, bottom);
  context.lineTo(left, bottom);
  context.lineTo(left, bottom - length);
  context.stroke();
  context.restore();
}

function drawPlate(
  context: RenderContext,
  frameState: TemplateFrameState,
  motif: TemplateMotif,
  accent: string,
  kicker: string | undefined,
  scale: number,
) {
  const plate = getPlateBounds(frameState, scale);
  const isLowerThird = motif === "lower-third";
  const x = isLowerThird
    ? Math.max(24 * scale, plate.x - 24 * scale)
    : plate.x;
  const width = isLowerThird
    ? Math.min(
        frameState.frame.width - x - 24 * scale,
        plate.width + 150 * scale,
      )
    : plate.width;
  const height = plate.height + (kicker ? 18 * scale : 0);
  const y = plate.y - (kicker ? 18 * scale : 0);

  context.save();
  roundedRect(context, x, y, width, height, 12 * scale);
  context.fillStyle = "rgba(4, 7, 12, 0.62)";
  context.fill();
  context.strokeStyle = accent;
  context.globalAlpha = 0.78;
  context.lineWidth = Math.max(1, 1.5 * scale);
  context.stroke();
  context.globalAlpha = 1;
  context.fillStyle = accent;
  context.fillRect(
    x + 16 * scale,
    y + height - 5 * scale,
    Math.min(width * 0.32, 110 * scale),
    3 * scale,
  );
  context.restore();

  drawKicker(
    context,
    kicker,
    x + 18 * scale,
    y + 10 * scale,
    accent,
    scale,
  );
}

function drawSlate(
  context: RenderContext,
  frameState: TemplateFrameState,
  accent: string,
  kicker: string | undefined,
  scale: number,
) {
  const plate = getPlateBounds(frameState, scale);
  const width = Math.min(
    frameState.frame.width - 80 * scale,
    Math.max(plate.width + 120 * scale, 520 * scale),
  );
  const height = Math.max(plate.height + 82 * scale, 180 * scale);
  const x = (frameState.frame.width - width) / 2;
  const y = Math.max(
    28 * scale,
    Math.min(
      frameState.frame.height - height - 28 * scale,
      plate.y - 48 * scale,
    ),
  );

  context.save();
  roundedRect(context, x, y, width, height, 14 * scale);
  context.fillStyle = "rgba(5, 8, 14, 0.74)";
  context.fill();
  context.strokeStyle = accent;
  context.globalAlpha = 0.56;
  context.lineWidth = Math.max(1, 1.5 * scale);
  context.stroke();
  context.globalAlpha = 0.2;
  context.fillStyle = accent;
  context.fillRect(x, y, width, 36 * scale);
  context.globalAlpha = 0.85;
  context.fillRect(x + 22 * scale, y + 52 * scale, 76 * scale, 3 * scale);
  context.restore();

  drawKicker(
    context,
    kicker,
    x + 22 * scale,
    y + 12 * scale,
    accent,
    scale,
  );
}

function drawScoreboard(
  context: RenderContext,
  frameState: TemplateFrameState,
  accent: string,
  kicker: string | undefined,
  scale: number,
) {
  const plate = getPlateBounds(frameState, scale);
  const width = Math.max(plate.width + 100 * scale, 390 * scale);
  const height = plate.height + 70 * scale;
  const x = Math.max(
    24 * scale,
    Math.min(frameState.frame.width - width - 24 * scale, plate.x - 50 * scale),
  );
  const y = Math.max(
    24 * scale,
    Math.min(frameState.frame.height - height - 24 * scale, plate.y - 50 * scale),
  );

  context.save();
  roundedRect(context, x, y, width, height, 10 * scale);
  context.fillStyle = "rgba(3, 5, 8, 0.82)";
  context.fill();
  context.strokeStyle = accent;
  context.lineWidth = Math.max(2, 3 * scale);
  context.globalAlpha = 0.82;
  context.stroke();
  context.globalAlpha = 0.22;
  context.fillStyle = accent;
  context.fillRect(x, y, width, 32 * scale);
  context.restore();

  drawKicker(
    context,
    kicker,
    x + 20 * scale,
    y + 10 * scale,
    accent,
    scale,
  );
}

function drawRing(
  context: RenderContext,
  frameState: TemplateFrameState,
  accent: string,
  secondaryAccent: string,
  scale: number,
) {
  const centerX = frameState.position.x + frameState.textBox.width / 2;
  const centerY = frameState.position.y + frameState.textBox.height / 2;
  const radius =
    Math.max(frameState.textBox.width, frameState.textBox.height) * 0.72 +
    28 * scale;

  context.save();
  context.lineWidth = Math.max(3, 7 * scale);
  context.strokeStyle = accent;
  context.globalAlpha = 0.74;
  context.beginPath();
  context.arc(centerX, centerY, radius, -Math.PI * 0.48, Math.PI * 1.22);
  context.stroke();
  context.strokeStyle = secondaryAccent;
  context.globalAlpha = 0.36;
  context.lineWidth = Math.max(1, 2 * scale);
  context.beginPath();
  context.arc(centerX, centerY, radius + 15 * scale, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawSmallLabel(
  context: RenderContext,
  label: string,
  x: number,
  y: number,
  color: string,
  scale: number,
  align: CanvasTextAlign = "left",
) {
  context.save();
  context.font = `700 ${Math.max(9, 10 * scale)}px ui-monospace, monospace`;
  context.textAlign = align;
  context.textBaseline = "top";
  context.fillStyle = color;
  context.globalAlpha = 0.68;
  context.fillText(label, x, y);
  context.restore();
}

function drawSignatureBackdrop(
  context: RenderContext,
  frameState: TemplateFrameState,
  templateId: GeneratorSettings["templateId"],
  scale: number,
) {
  if (!(SIGNATURE_TEMPLATE_IDS as readonly string[]).includes(templateId)) {
    return false;
  }

  const template = getGeneratorTemplateById(templateId);
  const { frame } = frameState;
  const { accent, secondaryAccent, kicker } = template.visual;
  const plate = getPlateBounds(frameState, scale);

  switch (templateId) {
    case "editor-amber-timecode": {
      drawPlate(context, frameState, "center-plate", accent, kicker, scale);
      const left = frame.width * 0.1;
      const right = frame.width * 0.9;
      const top = frame.height * 0.12;
      const bottom = frame.height * 0.88;
      context.save();
      context.strokeStyle = accent;
      context.globalAlpha = 0.2;
      context.lineWidth = Math.max(1, scale);
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(right, top);
      context.moveTo(left, bottom);
      context.lineTo(right, bottom);
      context.moveTo(frame.width * 0.15, top);
      context.lineTo(frame.width * 0.15, bottom);
      context.moveTo(frame.width * 0.85, top);
      context.lineTo(frame.width * 0.85, bottom);
      context.stroke();
      context.restore();
      drawSmallLabel(
        context,
        "V1 / CUT 08",
        frame.width * 0.15 + 10 * scale,
        bottom - 28 * scale,
        secondaryAccent,
        scale,
      );
      return true;
    }
    case "documentary-date-stamp": {
      context.save();
      context.fillStyle = "rgba(236, 217, 178, 0.035)";
      for (let y = 0; y < frame.height; y += Math.max(4, 5 * scale)) {
        context.fillRect(0, y, frame.width, Math.max(1, scale));
      }
      context.restore();
      drawPlate(context, frameState, "corner-plate", accent, kicker, scale);
      drawSmallLabel(
        context,
        "16MM / A-CAM",
        frame.width - 44 * scale,
        frame.height - 42 * scale,
        secondaryAccent,
        scale,
        "right",
      );
      return true;
    }
    case "studio-tally-clock": {
      drawPlate(context, frameState, "corner-plate", accent, kicker, scale);
      context.save();
      context.fillStyle = accent;
      context.shadowBlur = 14 * scale;
      context.shadowColor = accent;
      context.beginPath();
      context.arc(
        plate.x + 14 * scale,
        plate.y - 18 * scale,
        5 * scale,
        0,
        Math.PI * 2,
      );
      context.fill();
      context.restore();
      drawSmallLabel(
        context,
        "CAM 02     PROGRAM",
        frame.width - 44 * scale,
        34 * scale,
        secondaryAccent,
        scale,
        "right",
      );
      return true;
    }
    case "podcast-chapter-clock": {
      const x = Math.max(30 * scale, plate.x - 220 * scale);
      const y = plate.y - 22 * scale;
      const width = Math.min(
        frame.width - x - 30 * scale,
        plate.width + 250 * scale,
      );
      const height = plate.height + 44 * scale;
      context.save();
      roundedRect(context, x, y, width, height, height / 2);
      context.fillStyle = "rgba(7, 13, 24, 0.72)";
      context.fill();
      context.strokeStyle = accent;
      context.globalAlpha = 0.3;
      context.lineWidth = Math.max(1, 1.5 * scale);
      context.stroke();
      context.globalAlpha = 0.56;
      context.fillStyle = secondaryAccent;
      const baseline = y + height / 2;
      for (let index = 0; index < 14; index += 1) {
        const barHeight = (10 + Math.abs(Math.sin(index * 0.78)) * 28) * scale;
        context.fillRect(
          x + 26 * scale + index * 9 * scale,
          baseline - barHeight / 2,
          3 * scale,
          barHeight,
        );
      }
      context.restore();
      drawSmallLabel(
        context,
        kicker ?? "CHAPTER 04",
        x + width - 22 * scale,
        y + 10 * scale,
        accent,
        scale,
        "right",
      );
      return true;
    }
    case "vertical-live-sale": {
      const width = Math.min(frame.width - 54 * scale, frame.height * 0.52);
      const height = Math.min(frame.height - 54 * scale, width * 1.72);
      const x = (frame.width - width) / 2;
      const y = (frame.height - height) / 2;
      context.save();
      roundedRect(context, x, y, width, height, 18 * scale);
      context.fillStyle = "rgba(14, 6, 14, 0.4)";
      context.fill();
      context.strokeStyle = accent;
      context.globalAlpha = 0.55;
      context.lineWidth = Math.max(1, 2 * scale);
      context.stroke();
      context.globalAlpha = 0.52;
      context.fillStyle = accent;
      context.fillRect(x, y, width, height * 0.3);
      context.globalAlpha = 0.3;
      context.strokeStyle = secondaryAccent;
      context.strokeRect(
        x + width * 0.1,
        y + height * 0.42,
        width * 0.8,
        height * 0.36,
      );
      context.restore();
      drawSmallLabel(
        context,
        "CENTER-SAFE PRODUCT ZONE",
        frame.width / 2,
        y + height - 34 * scale,
        secondaryAccent,
        scale,
        "center",
      );
      return true;
    }
    case "shorts-bold-rail": {
      const left = frame.width * 0.18;
      const right = frame.width * 0.82;
      const top = frame.height * 0.08;
      const bottom = frame.height * 0.92;
      context.save();
      context.lineWidth = Math.max(3, 5 * scale);
      context.shadowBlur = 12 * scale;
      context.strokeStyle = accent;
      context.shadowColor = accent;
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left, bottom);
      context.stroke();
      context.strokeStyle = secondaryAccent;
      context.shadowColor = secondaryAccent;
      context.beginPath();
      context.moveTo(right, top);
      context.lineTo(right, bottom);
      context.stroke();
      context.restore();
      drawSmallLabel(
        context,
        "MAKE THE CUT",
        frame.width / 2,
        frame.height * 0.78,
        secondaryAccent,
        scale,
        "center",
      );
      return true;
    }
    case "speedrun-split-pro": {
      const x = Math.max(frame.width * 0.64, plate.x - 70 * scale);
      const y = frame.height * 0.08;
      const width = frame.width - x - frame.width * 0.05;
      const height = frame.height * 0.84;
      context.save();
      roundedRect(context, x, y, width, height, 8 * scale);
      context.fillStyle = "rgba(3, 8, 18, 0.8)";
      context.fill();
      context.strokeStyle = accent;
      context.globalAlpha = 0.42;
      context.lineWidth = Math.max(1, 1.5 * scale);
      context.stroke();
      context.restore();
      drawSmallLabel(context, "ANY%", x + 18 * scale, y + 16 * scale, accent, scale);
      drawSmallLabel(
        context,
        "PB",
        x + width - 18 * scale,
        y + 16 * scale,
        secondaryAccent,
        scale,
        "right",
      );
      const rows = ["DOCK          -0.8", "CORE          -1.4", "GATE          +0.2"];
      rows.forEach((row, index) => {
        drawSmallLabel(
          context,
          row,
          x + 18 * scale,
          y + (54 + index * 28) * scale,
          index === 2 ? "#FFD580" : accent,
          scale,
        );
      });
      return true;
    }
    case "stream-intermission-pro": {
      const insetX = frame.width * 0.09;
      const insetY = frame.height * 0.13;
      context.save();
      roundedRect(
        context,
        insetX,
        insetY,
        frame.width - insetX * 2,
        frame.height - insetY * 2,
        12 * scale,
      );
      context.fillStyle = "rgba(255, 255, 255, 0.035)";
      context.fill();
      context.strokeStyle = accent;
      context.globalAlpha = 0.35;
      context.stroke();
      context.strokeStyle = secondaryAccent;
      context.lineWidth = Math.max(2, 3 * scale);
      context.beginPath();
      context.moveTo(insetX, insetY + 38 * scale);
      context.lineTo(insetX, insetY);
      context.lineTo(insetX + 38 * scale, insetY);
      context.moveTo(frame.width - insetX - 38 * scale, frame.height - insetY);
      context.lineTo(frame.width - insetX, frame.height - insetY);
      context.lineTo(frame.width - insetX, frame.height - insetY - 38 * scale);
      context.stroke();
      context.restore();
      drawSmallLabel(
        context,
        "BACK IN",
        frame.width / 2,
        plate.y - 42 * scale,
        secondaryAccent,
        scale,
        "center",
      );
      return true;
    }
    case "shot-clock-broadcast":
      drawScoreboard(context, frameState, accent, kicker, scale);
      drawSmallLabel(
        context,
        "BROADCAST SAFE / 16:9",
        48 * scale,
        frame.height - 44 * scale,
        secondaryAccent,
        scale,
      );
      return true;
    case "round-timer-pro": {
      const x = frame.width * 0.07;
      const width = frame.width * 0.86;
      const height = Math.max(plate.height + 74 * scale, frame.height * 0.25);
      const y = frame.height - height - frame.height * 0.08;
      context.save();
      context.fillStyle = "rgba(2, 3, 7, 0.84)";
      context.fillRect(x, y, width, height);
      const accentWidth = width * 0.16;
      const red = context.createLinearGradient(x, y, x + accentWidth, y);
      red.addColorStop(0, accent);
      red.addColorStop(1, "rgba(255, 64, 84, 0.12)");
      context.fillStyle = red;
      context.fillRect(x, y, accentWidth, height);
      const blue = context.createLinearGradient(
        x + width - accentWidth,
        y,
        x + width,
        y,
      );
      blue.addColorStop(0, "rgba(67, 139, 255, 0.12)");
      blue.addColorStop(1, secondaryAccent);
      context.fillStyle = blue;
      context.fillRect(x + width - accentWidth, y, accentWidth, height);
      context.strokeStyle = "rgba(255, 255, 255, 0.18)";
      context.strokeRect(x, y, width, height);
      context.restore();
      drawSmallLabel(
        context,
        "ROUND 03",
        x + width * 0.32,
        y + 18 * scale,
        "#FFFFFF",
        scale,
        "center",
      );
      return true;
    }
    case "luxury-launch-editorial": {
      const inset = frame.width * 0.08;
      context.save();
      context.strokeStyle = accent;
      context.globalAlpha = 0.3;
      context.lineWidth = Math.max(1, scale);
      context.strokeRect(
        inset,
        frame.height * 0.1,
        frame.width - inset * 2,
        frame.height * 0.8,
      );
      context.globalAlpha = 0.16;
      context.strokeRect(
        inset + 24 * scale,
        frame.height * 0.1 + 24 * scale,
        frame.width - inset * 2 - 48 * scale,
        frame.height * 0.8 - 48 * scale,
      );
      context.globalAlpha = 0.8;
      context.fillStyle = accent;
      context.fillRect(frame.width * 0.37, frame.height * 0.1, frame.width * 0.26, scale);
      context.fillRect(frame.width * 0.37, frame.height * 0.9, frame.width * 0.26, scale);
      context.restore();
      drawSmallLabel(
        context,
        "THE REVEAL BEGINS",
        frame.width / 2,
        plate.y + plate.height + 30 * scale,
        secondaryAccent,
        scale,
        "center",
      );
      return true;
    }
    case "cinema-frame-counter":
      return false;
    default:
      return false;
  }
}

export function drawTemplateBackdrop(
  context: RenderContext,
  frameState: TemplateFrameState,
  templateId: GeneratorSettings["templateId"],
) {
  const template = getGeneratorTemplateById(templateId);
  const { motif, accent, secondaryAccent, kicker } = template.visual;
  const { frame } = frameState;
  const scale = getScale(frame);
  const plate = getPlateBounds(frameState, scale);

  if (drawSignatureBackdrop(context, frameState, templateId, scale)) {
    return;
  }

  if (
    motif === "corner-plate" ||
    motif === "center-plate" ||
    motif === "lower-third"
  ) {
    drawPlate(context, frameState, motif, accent, kicker, scale);
    return;
  }

  if (motif === "slate") {
    drawSlate(context, frameState, accent, kicker, scale);
    return;
  }

  if (motif === "scoreboard") {
    drawScoreboard(context, frameState, accent, kicker, scale);
    return;
  }

  if (motif === "stream-frame") {
    const inset = 26 * scale;
    context.save();
    roundedRect(
      context,
      inset,
      inset,
      frame.width - inset * 2,
      frame.height - inset * 2,
      12 * scale,
    );
    context.strokeStyle = accent;
    context.globalAlpha = 0.66;
    context.lineWidth = Math.max(2, 3 * scale);
    context.stroke();
    context.globalAlpha = 0.18;
    context.fillStyle = accent;
    context.fillRect(inset, inset, frame.width - inset * 2, 30 * scale);
    context.restore();
    drawKicker(
      context,
      kicker,
      inset + 18 * scale,
      inset + 9 * scale,
      accent,
      scale,
    );
    return;
  }

  if (motif === "neon-lines") {
    context.save();
    context.lineWidth = Math.max(1, 2 * scale);
    context.globalAlpha = 0.42;
    for (let index = 0; index < 5; index += 1) {
      context.strokeStyle = index % 2 === 0 ? accent : secondaryAccent;
      context.beginPath();
      context.moveTo(44 * scale + index * 46 * scale, frame.height - 30 * scale);
      context.lineTo(
        frame.width - 44 * scale - index * 34 * scale,
        30 * scale,
      );
      context.stroke();
    }
    context.restore();
    return;
  }

  if (motif === "editor-safe") {
    drawCornerBrackets(context, 42 * scale, frame, accent, scale);
    drawKicker(
      context,
      kicker,
      48 * scale,
      frame.height - 70 * scale,
      accent,
      scale,
    );
    return;
  }

  if (motif === "portrait-frame") {
    const width = Math.min(frame.width - 60 * scale, frame.height * 0.48);
    const height = Math.min(frame.height - 60 * scale, width * 1.75);
    const x = (frame.width - width) / 2;
    const y = (frame.height - height) / 2;
    context.save();
    roundedRect(context, x, y, width, height, 24 * scale);
    context.fillStyle = "rgba(4, 6, 10, 0.32)";
    context.fill();
    context.strokeStyle = accent;
    context.globalAlpha = 0.58;
    context.lineWidth = Math.max(1, 2 * scale);
    context.stroke();
    context.restore();
    drawKicker(
      context,
      kicker,
      x + 20 * scale,
      y + 18 * scale,
      accent,
      scale,
    );
    return;
  }

  if (motif === "social-burst") {
    const centerX = frameState.position.x + frameState.textBox.width / 2;
    const centerY = frameState.position.y + frameState.textBox.height / 2;
    const inner = Math.max(frameState.textBox.width, frameState.textBox.height) * 0.72;
    const outer = inner + 110 * scale;
    context.save();
    context.globalAlpha = 0.32;
    context.lineWidth = Math.max(1, 2 * scale);
    for (let index = 0; index < 16; index += 1) {
      const angle = (Math.PI * 2 * index) / 16;
      context.strokeStyle = index % 2 === 0 ? accent : secondaryAccent;
      context.beginPath();
      context.moveTo(
        centerX + Math.cos(angle) * inner,
        centerY + Math.sin(angle) * inner,
      );
      context.lineTo(
        centerX + Math.cos(angle) * outer,
        centerY + Math.sin(angle) * outer,
      );
      context.stroke();
    }
    context.restore();
    return;
  }

  if (motif === "film") {
    const centerX = frameState.position.x + frameState.textBox.width / 2;
    const centerY = frameState.position.y + frameState.textBox.height / 2;
    const radius =
      Math.max(frameState.textBox.width, frameState.textBox.height) * 0.7 +
      34 * scale;
    context.save();
    context.strokeStyle = accent;
    context.globalAlpha = 0.32;
    context.lineWidth = Math.max(1, 2 * scale);
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(centerX - radius - 42 * scale, centerY);
    context.lineTo(centerX + radius + 42 * scale, centerY);
    context.moveTo(centerX, centerY - radius - 42 * scale);
    context.lineTo(centerX, centerY + radius + 42 * scale);
    context.stroke();
    context.globalAlpha = 0.24;
    context.fillStyle = accent;
    for (let x = 20 * scale; x < frame.width; x += 52 * scale) {
      context.fillRect(x, 14 * scale, 24 * scale, 10 * scale);
      context.fillRect(x, frame.height - 24 * scale, 24 * scale, 10 * scale);
    }
    context.restore();
    drawKicker(
      context,
      kicker,
      28 * scale,
      38 * scale,
      accent,
      scale,
    );
    return;
  }

  if (motif === "glass") {
    context.save();
    roundedRect(
      context,
      plate.x - 18 * scale,
      plate.y - 10 * scale,
      plate.width + 36 * scale,
      plate.height + 20 * scale,
      28 * scale,
    );
    context.fillStyle = "rgba(255, 255, 255, 0.09)";
    context.fill();
    context.strokeStyle = "rgba(255, 255, 255, 0.28)";
    context.lineWidth = Math.max(1, 1.5 * scale);
    context.stroke();
    context.restore();
    return;
  }

  if (motif === "hud") {
    drawCornerBrackets(context, 34 * scale, frame, accent, scale);
    context.save();
    context.globalAlpha = 0.16;
    context.strokeStyle = accent;
    context.lineWidth = 1;
    for (let index = 1; index < 5; index += 1) {
      const y = (frame.height * index) / 5;
      context.beginPath();
      context.moveTo(52 * scale, y);
      context.lineTo(frame.width - 52 * scale, y);
      context.stroke();
    }
    context.restore();
    drawKicker(
      context,
      kicker,
      52 * scale,
      48 * scale,
      accent,
      scale,
    );
    return;
  }

  if (motif === "ring") {
    drawRing(context, frameState, accent, secondaryAccent, scale);
    return;
  }

  if (motif === "neumorphic") {
    context.save();
    context.shadowBlur = 24 * scale;
    context.shadowOffsetX = 12 * scale;
    context.shadowOffsetY = 12 * scale;
    context.shadowColor = "rgba(5, 8, 14, 0.65)";
    roundedRect(
      context,
      plate.x - 20 * scale,
      plate.y - 14 * scale,
      plate.width + 40 * scale,
      plate.height + 28 * scale,
      28 * scale,
    );
    context.fillStyle = "#262B38";
    context.fill();
    context.shadowOffsetX = -10 * scale;
    context.shadowOffsetY = -10 * scale;
    context.shadowColor = "rgba(255, 255, 255, 0.08)";
    context.fill();
    context.restore();
    return;
  }

  if (motif === "waveform") {
    drawRing(context, frameState, accent, secondaryAccent, scale);
    const centerX = frameState.position.x + frameState.textBox.width / 2;
    const baseline = frameState.position.y + frameState.textBox.height + 46 * scale;
    context.save();
    context.fillStyle = secondaryAccent;
    context.globalAlpha = 0.52;
    for (let index = -10; index <= 10; index += 1) {
      const barHeight = (10 + Math.abs(Math.sin(index * 0.76)) * 30) * scale;
      context.fillRect(
        centerX + index * 10 * scale,
        baseline - barHeight / 2,
        4 * scale,
        barHeight,
      );
    }
    context.restore();
    return;
  }

  if (motif === "smoke") {
    const centerX = frameState.position.x + frameState.textBox.width / 2;
    const centerY = frameState.position.y + frameState.textBox.height / 2;
    const radius = Math.max(frameState.textBox.width, 260 * scale);
    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius,
    );
    gradient.addColorStop(0, "rgba(122, 82, 244, 0.22)");
    gradient.addColorStop(0.48, "rgba(90, 80, 130, 0.10)");
    gradient.addColorStop(1, "rgba(20, 20, 30, 0)");
    context.save();
    context.fillStyle = gradient;
    context.fillRect(0, 0, frame.width, frame.height);
    context.restore();
  }
}

export function drawTemplateOverlay(
  context: RenderContext,
  frameState: TemplateFrameState,
  templateId: GeneratorSettings["templateId"],
) {
  const template = getGeneratorTemplateById(templateId);

  if (template.visual.motif !== "scanline") {
    return;
  }

  const scale = getScale(frameState.frame);
  context.save();
  context.fillStyle = "rgba(0, 0, 0, 0.18)";
  for (let y = 0; y < frameState.frame.height; y += Math.max(3, 4 * scale)) {
    context.fillRect(0, y, frameState.frame.width, Math.max(1, scale));
  }
  context.restore();
}
