import { describe, expect, it } from "vitest";

import { createGeneratorSettings } from "@/lib/generator/defaults";
import { DEFAULT_GENERATOR_TEMPLATE_ID } from "@/lib/generator/templates";
import {
  buildLiveTimerUrl,
  generatorSettingsFromLiveConfig,
  liveConfigFromGeneratorSettings,
  LIVE_DEFAULT_DURATION_SECONDS,
  LIVE_DEFAULT_MESSAGE,
  type LiveTimerConfig,
  type LiveTimerEndBehavior,
  type LiveTimerMode,
  parseLiveTimerParams,
} from "@/lib/live/live-timer-config";

const origin = "https://timeoverlay.co";

const fullConfig: LiveTimerConfig = {
  mode: "countdown",
  durationSeconds: 300,
  untilEpochMs: null,
  templateId: "obs-break-timer",
  resolutionPresetId: "landscape-1080",
  displayFormat: "mm:ss",
  anchor: "bottom-right",
  offsetX: 12,
  offsetY: -8,
  textColor: "#F8FAFC",
  fontSize: 88,
  background: "transparent",
  endBehavior: "hide",
  message: LIVE_DEFAULT_MESSAGE,
  licenseToken: null,
};

describe("parseLiveTimerParams", () => {
  it("defaults to a five-minute countdown with no warnings when params are empty", () => {
    const result = parseLiveTimerParams(new URLSearchParams());

    expect(result.warnings).toEqual([]);
    expect(result.preview).toBe(false);
    expect(result.debug).toBe(false);
    expect(result.config.mode).toBe("countdown");
    expect(result.config.durationSeconds).toBe(LIVE_DEFAULT_DURATION_SECONDS);
    expect(result.config.templateId).toBe(DEFAULT_GENERATOR_TEMPLATE_ID);
    expect(result.config.resolutionPresetId).toBeNull();
    expect(result.config.displayFormat).toBeNull();
    expect(result.config.anchor).toBeNull();
    expect(result.config.textColor).toBeNull();
    expect(result.config.fontSize).toBeNull();
    expect(result.config.background).toBeNull();
    expect(result.config.endBehavior).toBe("hold");
    expect(result.config.message).toBe(LIVE_DEFAULT_MESSAGE);
    expect(result.config.licenseToken).toBeNull();
  });

  it("parses every supported field from a full link", () => {
    const params = new URLSearchParams(
      "v=1&mode=countdown&duration=300&template=obs-break-timer&size=landscape-1080&format=mmss&anchor=bottom-right&ox=12&oy=-8&color=f8fafc&fontSize=88&bg=transparent&end=hide&license=v1.abc.def&preview=1&debug=1",
    );
    const result = parseLiveTimerParams(params);

    expect(result.warnings).toEqual([]);
    expect(result.preview).toBe(true);
    expect(result.debug).toBe(true);
    expect(result.config).toEqual({
      ...fullConfig,
      licenseToken: "v1.abc.def",
    });
  });

  it("falls back from until to a five-minute countdown with one warning", () => {
    const result = parseLiveTimerParams(new URLSearchParams("mode=until"));

    expect(result.config.mode).toBe("countdown");
    expect(result.config.durationSeconds).toBe(LIVE_DEFAULT_DURATION_SECONDS);
    expect(result.warnings).toHaveLength(1);
  });

  it("restores a plus offset that the browser decoded as a space", () => {
    const result = parseLiveTimerParams(
      new URLSearchParams("mode=until&until=2026-10-26T20:00:00+08:00"),
    );

    expect(result.warnings).toEqual([]);
    expect(result.config.mode).toBe("until");
    expect(result.config.untilEpochMs).toBe(
      Date.parse("2026-10-26T20:00:00+08:00"),
    );
  });

  it("rejects an until value without a timezone", () => {
    const result = parseLiveTimerParams(
      new URLSearchParams("mode=until&until=2026-10-26T20:00"),
    );

    expect(result.config.mode).toBe("countdown");
    expect(result.warnings).toHaveLength(1);
  });

  it.each(["0", "360000", "abc", "12.5"]) (
    "rejects invalid duration %s",
    (duration) => {
      const result = parseLiveTimerParams(
        new URLSearchParams(`duration=${duration}`),
      );

      expect(result.config.durationSeconds).toBe(LIVE_DEFAULT_DURATION_SECONDS);
      expect(result.warnings.length).toBeGreaterThan(0);
    },
  );

  it("normalizes a valid lowercase color and rejects malformed colors", () => {
    expect(
      parseLiveTimerParams(new URLSearchParams("color=f8fafc")).config.textColor,
    ).toBe("#F8FAFC");

    for (const color of ["#F8FAFC", "F8FA", "GGGGGG"]) {
      const result = parseLiveTimerParams(new URLSearchParams(`color=${color}`));
      expect(result.config.textColor).toBeNull();
      expect(result.warnings.length).toBeGreaterThan(0);
    }
  });

  it("warns and uses the default template for an unknown template", () => {
    const result = parseLiveTimerParams(
      new URLSearchParams("template=not-a-template"),
    );

    expect(result.config.templateId).toBe(DEFAULT_GENERATOR_TEMPLATE_ID);
    expect(result.warnings).toHaveLength(1);
  });

  it("forces hold when loop is used outside countdown mode", () => {
    const result = parseLiveTimerParams(
      new URLSearchParams(
        "mode=until&until=2026-10-27T20:00:00.000Z&end=loop",
      ),
    );

    expect(result.config.endBehavior).toBe("hold");
    expect(result.warnings).toHaveLength(1);
  });

  it("strips control characters and truncates a long message", () => {
    const raw = `\u0000\u0007  ${"A".repeat(50)}  \u007F`;
    const result = parseLiveTimerParams(
      new URLSearchParams(`end=message&message=${encodeURIComponent(raw)}`),
    );

    expect(result.config.message).toBe("A".repeat(40));
  });

  it("ignores unknown parameters without warnings", () => {
    const result = parseLiveTimerParams(new URLSearchParams("room=abc"));

    expect(result.warnings).toEqual([]);
  });

  it("warns and disables invalid preview and debug flags", () => {
    const result = parseLiveTimerParams(
      new URLSearchParams("preview=yes&debug=2"),
    );

    expect(result.preview).toBe(false);
    expect(result.debug).toBe(false);
    expect(result.warnings).toEqual([
      'Invalid preview "yes"; preview mode is off.',
      'Invalid debug "2"; debug mode is off.',
    ]);
  });
});

describe("buildLiveTimerUrl", () => {
  it("round-trips every valid mode and end combination", () => {
    const combos: Array<{
      mode: LiveTimerMode;
      endBehavior: LiveTimerEndBehavior;
    }> = [
      { mode: "countdown", endBehavior: "hold" },
      { mode: "countdown", endBehavior: "hide" },
      { mode: "countdown", endBehavior: "message" },
      { mode: "countdown", endBehavior: "loop" },
      { mode: "until", endBehavior: "hold" },
      { mode: "until", endBehavior: "hide" },
      { mode: "until", endBehavior: "message" },
      { mode: "countup", endBehavior: "hold" },
      { mode: "countup", endBehavior: "hide" },
      { mode: "countup", endBehavior: "message" },
    ];

    for (const { mode, endBehavior } of combos) {
      const config: LiveTimerConfig = {
        ...fullConfig,
        mode,
        endBehavior,
        message: endBehavior === "message" ? "LIVE NOW" : LIVE_DEFAULT_MESSAGE,
        untilEpochMs:
          mode === "until" ? Date.parse("2026-10-27T12:00:00.000Z") : null,
      };
      const url = buildLiveTimerUrl(origin, config);
      const parsed = parseLiveTimerParams(new URL(url).searchParams);

      expect(parsed.config).toEqual(config);
    }
  });

  it("writes v first and omits mode-specific and preview parameters", () => {
    const url = new URL(
      buildLiveTimerUrl(origin, {
        ...fullConfig,
        mode: "countup",
        licenseToken: null,
      }),
    );

    expect([...url.searchParams.keys()][0]).toBe("v");
    expect(url.searchParams.get("v")).toBe("1");
    expect(url.searchParams.get("duration")).toBeNull();
    expect(url.searchParams.get("until")).toBeNull();
    expect(url.searchParams.get("license")).toBeNull();
    expect(url.searchParams.get("preview")).toBeNull();
    expect(url.searchParams.get("debug")).toBeNull();
  });

  it("writes the message only for message endings", () => {
    const holdUrl = new URL(
      buildLiveTimerUrl(origin, { ...fullConfig, endBehavior: "hold" }),
    );
    const messageUrl = new URL(
      buildLiveTimerUrl(origin, {
        ...fullConfig,
        endBehavior: "message",
        message: "LIVE NOW",
      }),
    );

    expect(holdUrl.searchParams.get("message")).toBeNull();
    expect(messageUrl.searchParams.get("message")).toBe("LIVE NOW");
  });

  it("always writes style parameters using template defaults for null fields", () => {
    const config: LiveTimerConfig = {
      ...fullConfig,
      templateId: DEFAULT_GENERATOR_TEMPLATE_ID,
      resolutionPresetId: null,
      displayFormat: null,
      anchor: null,
      textColor: null,
      fontSize: null,
      background: null,
    };
    const defaults = createGeneratorSettings({
      templateId: DEFAULT_GENERATOR_TEMPLATE_ID,
    });
    const url = new URL(buildLiveTimerUrl(origin, config));

    expect(url.searchParams.get("size")).toBe(
      defaults.canvas.resolutionPresetId,
    );
    expect(url.searchParams.get("format")).toBe("mmss");
    expect(url.searchParams.get("anchor")).toBe(defaults.placement.anchor);
    expect(url.searchParams.get("color")).toBe(
      defaults.textStyle.textColor.replace(/^#/, ""),
    );
    expect(url.searchParams.get("fontSize")).toBe(
      String(defaults.textStyle.fontSize),
    );
    expect(url.searchParams.get("bg")).toBe(
      defaults.canvas.backgroundMode === "transparent"
        ? "transparent"
        : defaults.canvas.backgroundColor.replace(/^#/, ""),
    );
  });
});

describe("liveConfigFromGeneratorSettings", () => {
  const options = {
    mode: "countdown" as const,
    durationSeconds: 90,
    untilEpochMs: null,
    endBehavior: "hold" as const,
    message: "LIVE NOW",
    licenseToken: null,
  };

  it("maps a transparent canvas", () => {
    const config = liveConfigFromGeneratorSettings(
      createGeneratorSettings({ canvas: { backgroundMode: "transparent" } }),
      options,
    );

    expect(config.background).toBe("transparent");
  });

  it("maps a solid canvas color in uppercase hex", () => {
    const config = liveConfigFromGeneratorSettings(
      createGeneratorSettings({
        canvas: { backgroundMode: "solid", backgroundColor: "#1f2330" },
      }),
      options,
    );

    expect(config.background).toBe("#1F2330");
  });

  it("drops colors that are not six-digit hex values with a leading hash", () => {
    const config = liveConfigFromGeneratorSettings(
      createGeneratorSettings({
        canvas: { backgroundMode: "solid", backgroundColor: "1f2330" },
        textStyle: { textColor: "f8fafc" },
      }),
      options,
    );

    expect(config.background).toBeNull();
    expect(config.textColor).toBeNull();
  });
});

describe("generatorSettingsFromLiveConfig", () => {
  it("uses template defaults for null fields", () => {
    const base = parseLiveTimerParams(
      new URLSearchParams("template=obs-break-timer"),
    ).config;
    const settings = generatorSettingsFromLiveConfig(base);
    const templateSettings = createGeneratorSettings({
      templateId: "obs-break-timer",
    });

    expect(settings.templateId).toBe("obs-break-timer");
    expect(settings.canvas.resolutionPresetId).toBe(
      templateSettings.canvas.resolutionPresetId,
    );
    expect(settings.timer.displayFormat).toBe(
      templateSettings.timer.displayFormat,
    );
    expect(settings.textStyle.textColor).toBe(
      templateSettings.textStyle.textColor,
    );
  });

  it("overrides the template defaults with explicit link fields", () => {
    const config: LiveTimerConfig = {
      ...fullConfig,
      templateId: "obs-break-timer",
      resolutionPresetId: "portrait-1080",
      displayFormat: "hh:mm:ss",
      anchor: "top-left",
      offsetX: -30,
      offsetY: 16,
      textColor: "#00FF88",
      fontSize: 120,
      background: "#101828",
    };
    const settings = generatorSettingsFromLiveConfig(config);

    expect(settings.canvas.resolutionPresetId).toBe("portrait-1080");
    expect(settings.canvas.width).toBe(1080);
    expect(settings.canvas.height).toBe(1920);
    expect(settings.timer.displayFormat).toBe("hh:mm:ss");
    expect(settings.placement.anchor).toBe("top-left");
    expect(settings.placement.offsetX).toBe(-30);
    expect(settings.placement.offsetY).toBe(16);
    expect(settings.textStyle.textColor).toBe("#00FF88");
    expect(settings.textStyle.fontSize).toBe(120);
    expect(settings.canvas.backgroundMode).toBe("solid");
    expect(settings.canvas.backgroundColor).toBe("#101828");
  });
});
