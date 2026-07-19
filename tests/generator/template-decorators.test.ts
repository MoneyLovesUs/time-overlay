import { describe, expect, it } from "vitest";

import {
  drawTemplateBackdrop,
  drawTemplateOverlay,
} from "@/lib/generator/template-decorators";
import { GENERATOR_TEMPLATES } from "@/lib/generator/templates";

function createRenderContextStub() {
  const noop = () => undefined;

  return {
    arc: noop,
    beginPath: noop,
    closePath: noop,
    createRadialGradient: () => ({ addColorStop: noop }),
    fill: noop,
    fillRect: noop,
    fillText: noop,
    lineTo: noop,
    moveTo: noop,
    quadraticCurveTo: noop,
    restore: noop,
    save: noop,
    stroke: noop,
  } as unknown as CanvasRenderingContext2D;
}

describe("template decorators", () => {
  it("renders every catalog template without throwing", () => {
    const frameState = {
      frame: { width: 1280, height: 720 },
      position: { x: 480, y: 280 },
      textBox: { width: 320, height: 120 },
    };

    for (const template of GENERATOR_TEMPLATES) {
      const context = createRenderContextStub();

      expect(() => {
        drawTemplateBackdrop(context, frameState, template.id);
        drawTemplateOverlay(context, frameState, template.id);
      }, template.id).not.toThrow();
    }
  });
});
