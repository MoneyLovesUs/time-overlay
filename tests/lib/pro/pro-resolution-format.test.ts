import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  createGeneratorSettings,
  GENERATOR_CANVAS_PRESETS,
  getFreeExportFormat,
  getFreeResolutionPresetId,
  getProFallbackReasons,
  normalizeGeneratorSettings,
} from "@/lib/generator/defaults";
import {
  isProFormat,
  isProResolution,
  PRO_ALPHA_VIDEO_FORMATS,
  PRO_RESOLUTION_MIN_EDGE,
  type ProTrigger,
} from "@/lib/pro/entitlements";

describe("pro resolution predicate", () => {
  it("marks anything 2160 or larger on either axis as Pro", () => {
    assert.equal(PRO_RESOLUTION_MIN_EDGE, 2160);
    assert.equal(isProResolution(3840, 2160), true);
    assert.equal(isProResolution(2160, 3840), true);
    assert.equal(isProResolution(2160, 2160), true);
    assert.equal(isProResolution(4096, 2160), true);
  });

  it("keeps every 1080p-class canvas free", () => {
    assert.equal(isProResolution(1920, 1080), false);
    assert.equal(isProResolution(1080, 1920), false);
    assert.equal(isProResolution(1080, 1080), false);
    assert.equal(isProResolution(1280, 720), false);
  });

  it("agrees with the canvas preset catalog", () => {
    const gated = GENERATOR_CANVAS_PRESETS.filter((preset) =>
      isProResolution(preset.width, preset.height),
    ).map((preset) => preset.id);

    assert.deepEqual(gated.sort(), ["landscape-2160", "portrait-2160"]);
  });
});

describe("pro format predicate", () => {
  it("gates exactly the single-file alpha video formats", () => {
    assert.deepEqual([...PRO_ALPHA_VIDEO_FORMATS], [
      "webm-vp9-alpha",
      "mov-hevc-alpha",
    ]);
    assert.equal(isProFormat("webm-vp9-alpha"), true);
    assert.equal(isProFormat("mov-hevc-alpha"), true);
  });

  it("keeps mp4, webm, gif and png-sequence free", () => {
    for (const format of ["mp4", "webm", "gif", "png-sequence"]) {
      assert.equal(isProFormat(format), false, format);
    }
  });
});

describe("free-tier fallback", () => {
  it("maps 4K presets to the same-orientation 1080p preset", () => {
    assert.equal(getFreeResolutionPresetId("landscape-2160"), "landscape-1080");
    assert.equal(getFreeResolutionPresetId("portrait-2160"), "portrait-1080");
  });

  it("leaves free presets untouched", () => {
    for (const preset of GENERATOR_CANVAS_PRESETS) {
      if (!isProResolution(preset.width, preset.height)) {
        assert.equal(getFreeResolutionPresetId(preset.id), preset.id, preset.id);
      }
    }
  });

  it("maps alpha video to the PNG sequence, not to a lossy format", () => {
    assert.equal(getFreeExportFormat("webm-vp9-alpha"), "png-sequence");
    assert.equal(getFreeExportFormat("mov-hevc-alpha"), "png-sequence");
    assert.equal(getFreeExportFormat("mp4"), "mp4");
    assert.equal(getFreeExportFormat("png-sequence"), "png-sequence");
  });

  it("normalizes a leftover 4K + hevc-alpha setting down for free users", () => {
    const stale = createGeneratorSettings(
      {
        canvas: { resolutionPresetId: "landscape-2160" },
        export: { format: "mov-hevc-alpha", fps: 60 },
      },
      { isPro: true },
    );
    assert.equal(stale.canvas.resolutionPresetId, "landscape-2160");
    assert.equal(stale.export.format, "mov-hevc-alpha");

    const free = normalizeGeneratorSettings(stale, { isPro: false });

    assert.equal(free.canvas.resolutionPresetId, "landscape-1080");
    assert.equal(free.canvas.width, 1920);
    assert.equal(free.canvas.height, 1080);
    assert.equal(free.export.format, "png-sequence");
    assert.equal(free.export.fps, 30);
  });

  it("keeps a Pro user's 4K and alpha settings intact", () => {
    const pro = normalizeGeneratorSettings(
      createGeneratorSettings(
        {
          canvas: { resolutionPresetId: "portrait-2160" },
          export: { format: "webm-vp9-alpha" },
        },
        { isPro: true },
      ),
      { isPro: true },
    );

    assert.equal(pro.canvas.resolutionPresetId, "portrait-2160");
    assert.equal(pro.canvas.height, 3840);
    assert.equal(pro.export.format, "webm-vp9-alpha");
  });
});

describe("fallback notice reasons", () => {
  it("names only the gated parts a free session would lose", () => {
    const stale = createGeneratorSettings(
      {
        canvas: { resolutionPresetId: "landscape-2160" },
        export: { format: "mov-hevc-alpha" },
      },
      { isPro: true },
    );

    assert.deepEqual(getProFallbackReasons(stale), ["resolution", "format"]);
  });

  it("reports nothing for settings a free session may keep", () => {
    const free = createGeneratorSettings({
      canvas: { resolutionPresetId: "portrait-1080" },
      export: { format: "png-sequence" },
    });

    assert.deepEqual(getProFallbackReasons(free), []);
  });

  it("reports each gate independently", () => {
    const only4k = createGeneratorSettings(
      { canvas: { resolutionPresetId: "portrait-2160" } },
      { isPro: true },
    );
    assert.deepEqual(getProFallbackReasons(only4k), ["resolution"]);

    const onlyAlpha = createGeneratorSettings(
      { export: { format: "webm-vp9-alpha" } },
      { isPro: true },
    );
    assert.deepEqual(getProFallbackReasons(onlyAlpha), ["format"]);
  });

  it("matches what normalizeGeneratorSettings actually changes", () => {
    const stale = createGeneratorSettings(
      {
        canvas: { resolutionPresetId: "landscape-2160" },
        export: { format: "webm-vp9-alpha" },
      },
      { isPro: true },
    );
    const free = normalizeGeneratorSettings(stale, { isPro: false });

    assert.deepEqual(getProFallbackReasons(stale), ["resolution", "format"]);
    assert.deepEqual(getProFallbackReasons(free), []);
    assert.notEqual(free.canvas.resolutionPresetId, stale.canvas.resolutionPresetId);
    assert.notEqual(free.export.format, stale.export.format);
  });
});

describe("paywall triggers", () => {
  it("includes the two new feature triggers", () => {
    const triggers: ProTrigger[] = [
      "duration",
      "fps",
      "template",
      "resolution",
      "format",
      "direct",
    ];
    assert.equal(triggers.length, 6);
  });
});
