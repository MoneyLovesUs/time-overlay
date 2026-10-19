// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ControlPanel } from "@/components/generator/control-panel";
import en from "@/content/root/en";
import {
  GENERATOR_CANVAS_PRESETS,
  createGeneratorSettings,
} from "@/lib/generator/defaults";

let root: Root, container: HTMLDivElement;
const onDurationCommit = vi.fn();
const noop = () => undefined;

function durationInput() {
  return container.querySelector<HTMLInputElement>("input[type=number]")!;
}

describe("duration commit", () => {
  beforeEach(async () => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => {
      root.render(
        <ControlPanel
          settings={createGeneratorSettings({}, { isPro: false })}
          canvasPresets={GENERATOR_CANVAS_PRESETS}
          ui={en.generatorUi.controlPanel}
          uploadedFontName={null}
          onDurationChange={noop}
          onDurationCommit={onDurationCommit}
          onDisplayFormatChange={noop}
          onResolutionPresetChange={noop}
          onBackgroundModeChange={noop}
          onFontFamilyChange={noop}
          onAnchorChange={noop}
          onTextColorChange={noop}
          onUploadFont={noop}
          onClearUploadedFont={noop}
          onAudioVariantChange={noop}
        />,
      );
    });
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.resetAllMocks();
  });

  it("fires when the duration field loses focus", async () => {
    await act(async () => {
      durationInput().focus();
      durationInput().blur();
    });
    expect(onDurationCommit).toHaveBeenCalledTimes(1);
  });

  it("fires on Enter but not on other keys", async () => {
    await act(async () => {
      durationInput().dispatchEvent(new KeyboardEvent("keydown", { key: "5", bubbles: true }));
      durationInput().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    expect(onDurationCommit).toHaveBeenCalledTimes(1);
  });
});
