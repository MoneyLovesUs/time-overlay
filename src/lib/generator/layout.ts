import type { PlacementAnchor } from "@/lib/generator/types";

type FrameSize = {
  width: number;
  height: number;
};

type TextBoxSize = {
  width: number;
  height: number;
};

type TimerBoxPositionInput = {
  frame: FrameSize;
  textBox: TextBoxSize;
  anchor: PlacementAnchor;
  offsetX: number;
  offsetY: number;
  safeAreaInset: number;
};

export function getTimerBoxPosition({
  frame,
  textBox,
  anchor,
  offsetX,
  offsetY,
  safeAreaInset,
}: TimerBoxPositionInput) {
  const horizontalPositions = {
    left: safeAreaInset,
    center: (frame.width - textBox.width) / 2,
    right: frame.width - safeAreaInset - textBox.width,
  };

  const verticalPositions = {
    top: safeAreaInset,
    center: (frame.height - textBox.height) / 2,
    bottom: frame.height - safeAreaInset - textBox.height,
  };

  const [verticalKey, horizontalKey] =
    anchor === "center"
      ? (["center", "center"] as const)
      : (anchor.split("-") as [
          "top" | "center" | "bottom",
          "left" | "center" | "right",
        ]);

  const baseX = horizontalPositions[horizontalKey];
  const baseY = verticalPositions[verticalKey];

  return {
    x: Math.round(baseX + offsetX),
    y: Math.round(baseY + offsetY),
  };
}
