import {
  GENERATOR_ALLOWED_ANCHORS,
  GENERATOR_CANVAS_PRESETS,
  createGeneratorSettings,
} from "@/lib/generator/defaults";
import {
  DEFAULT_GENERATOR_TEMPLATE_ID,
  GENERATOR_TEMPLATES,
} from "@/lib/generator/templates";
import type {
  GeneratorSettings,
  PlacementAnchor,
  ResolutionPresetId,
  TemplateId,
  TimerDisplayFormat,
} from "@/lib/generator/types";

export const LIVE_TIMER_MAX_SECONDS = 359_999; // 99:59:59
export const LIVE_MESSAGE_MAX_LENGTH = 40;
export const LIVE_DEFAULT_DURATION_SECONDS = 300;
export const LIVE_DEFAULT_MESSAGE = "LIVE";

export type LiveTimerMode = "countdown" | "until" | "countup";
export type LiveTimerEndBehavior = "hold" | "hide" | "message" | "loop";

export type LiveTimerConfig = {
  mode: LiveTimerMode;
  durationSeconds: number;
  untilEpochMs: number | null;
  templateId: TemplateId;
  resolutionPresetId: ResolutionPresetId | null;
  displayFormat: TimerDisplayFormat | null;
  anchor: PlacementAnchor | null;
  offsetX: number;
  offsetY: number;
  textColor: string | null;
  fontSize: number | null;
  background: "transparent" | string | null;
  endBehavior: LiveTimerEndBehavior;
  message: string;
  licenseToken: string | null;
};

export type LiveTimerParseResult = {
  config: LiveTimerConfig;
  preview: boolean;
  debug: boolean;
  warnings: string[];
};

const LIVE_MODES: readonly LiveTimerMode[] = ["countdown", "until", "countup"];
const LIVE_END_BEHAVIORS: readonly LiveTimerEndBehavior[] = [
  "hold",
  "hide",
  "message",
  "loop",
];

const DISPLAY_FORMAT_FROM_PARAM: Record<string, TimerDisplayFormat> = {
  ss: "ss",
  mmss: "mm:ss",
  hhmmss: "hh:mm:ss",
};

const DISPLAY_FORMAT_TO_PARAM: Record<TimerDisplayFormat, string> = {
  ss: "ss",
  "mm:ss": "mmss",
  "hh:mm:ss": "hhmmss",
};

const UNTIL_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;

function sanitizeMessage(value: string): string {
  return value.replace(CONTROL_CHARACTERS, "").trim().slice(0, LIVE_MESSAGE_MAX_LENGTH);
}

function normalizeHexColor(value: string): string | null {
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return null;
  }
  return `#${value.toUpperCase()}`;
}

function stripHash(value: string): string {
  return value.replace(/^#/, "").toUpperCase();
}

function normalizeGeneratorColor(value: string): string | null {
  if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
    return null;
  }
  return value.toUpperCase();
}

function isLiveTimerMode(value: string): value is LiveTimerMode {
  return (LIVE_MODES as readonly string[]).includes(value);
}

function isLiveEndBehavior(value: string): value is LiveTimerEndBehavior {
  return (LIVE_END_BEHAVIORS as readonly string[]).includes(value);
}

function isTemplateId(value: string): value is TemplateId {
  return GENERATOR_TEMPLATES.some((template) => template.id === value);
}

function isResolutionPresetId(value: string): value is ResolutionPresetId {
  return GENERATOR_CANVAS_PRESETS.some((preset) => preset.id === value);
}

function isPlacementAnchor(value: string): value is PlacementAnchor {
  return (GENERATOR_ALLOWED_ANCHORS as readonly string[]).includes(value);
}

function parseInteger(
  raw: string,
  min: number,
  max: number,
): number | null {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    return null;
  }
  return value;
}

function parseUntil(value: string): number | null {
  // Browsers decode a literal "+" in a typed URL as a space. Restore it so
  // until=2026-10-26T20:00:00 08:00 still parses as a +08:00 offset.
  const normalized = value.replace(/ /g, "+");
  if (!UNTIL_PATTERN.test(normalized)) {
    return null;
  }
  const epochMs = Date.parse(normalized);
  return Number.isFinite(epochMs) ? epochMs : null;
}

export function parseLiveTimerParams(params: URLSearchParams): LiveTimerParseResult {
  const warnings: string[] = [];

  const version = params.get("v");
  if (version !== null && version !== "1") {
    warnings.push(`Unsupported live timer version "${version}"; parsed as version 1.`);
  }

  let mode: LiveTimerMode = "countdown";
  const rawMode = params.get("mode");
  if (rawMode !== null) {
    if (isLiveTimerMode(rawMode)) {
      mode = rawMode;
    } else {
      warnings.push(`Unknown mode "${rawMode}"; using countdown.`);
    }
  }

  let durationSeconds = LIVE_DEFAULT_DURATION_SECONDS;
  const rawDuration = params.get("duration");
  if (rawDuration !== null) {
    const parsed = parseInteger(rawDuration, 1, LIVE_TIMER_MAX_SECONDS);
    if (parsed === null) {
      warnings.push(
        `Invalid duration "${rawDuration}"; using ${LIVE_DEFAULT_DURATION_SECONDS} seconds.`,
      );
    } else {
      durationSeconds = parsed;
    }
  }

  let untilEpochMs: number | null = null;
  if (mode === "until") {
    const rawUntil = params.get("until");
    const parsedUntil = rawUntil === null ? null : parseUntil(rawUntil);
    if (parsedUntil === null) {
      mode = "countdown";
      durationSeconds = LIVE_DEFAULT_DURATION_SECONDS;
      warnings.push(
        "Invalid until time; using a 300 second countdown instead.",
      );
    } else {
      untilEpochMs = parsedUntil;
    }
  }

  let templateId: TemplateId = DEFAULT_GENERATOR_TEMPLATE_ID;
  const rawTemplate = params.get("template");
  if (rawTemplate !== null) {
    if (isTemplateId(rawTemplate)) {
      templateId = rawTemplate;
    } else {
      warnings.push(
        `Unknown template "${rawTemplate}"; using ${DEFAULT_GENERATOR_TEMPLATE_ID}.`,
      );
    }
  }

  let resolutionPresetId: ResolutionPresetId | null = null;
  const rawSize = params.get("size");
  if (rawSize !== null) {
    if (isResolutionPresetId(rawSize)) {
      resolutionPresetId = rawSize;
    } else {
      warnings.push(`Unknown size "${rawSize}"; using the template default.`);
    }
  }

  let displayFormat: TimerDisplayFormat | null = null;
  const rawFormat = params.get("format");
  if (rawFormat !== null) {
    const parsedFormat = DISPLAY_FORMAT_FROM_PARAM[rawFormat];
    if (parsedFormat) {
      displayFormat = parsedFormat;
    } else {
      warnings.push(`Unknown format "${rawFormat}"; using the template default.`);
    }
  }

  let anchor: PlacementAnchor | null = null;
  const rawAnchor = params.get("anchor");
  if (rawAnchor !== null) {
    if (isPlacementAnchor(rawAnchor)) {
      anchor = rawAnchor;
    } else {
      warnings.push(`Unknown anchor "${rawAnchor}"; using the template default.`);
    }
  }

  const parseOffset = (key: string): number => {
    const raw = params.get(key);
    if (raw === null) {
      return 0;
    }
    const parsed = parseInteger(raw, -240, 240);
    if (parsed === null) {
      warnings.push(`Invalid ${key} "${raw}"; using 0.`);
      return 0;
    }
    return parsed;
  };

  const offsetX = parseOffset("ox");
  const offsetY = parseOffset("oy");

  let textColor: string | null = null;
  const rawColor = params.get("color");
  if (rawColor !== null) {
    textColor = normalizeHexColor(rawColor);
    if (textColor === null) {
      warnings.push(`Invalid color "${rawColor}"; using the template default.`);
    }
  }

  let fontSize: number | null = null;
  const rawFontSize = params.get("fontSize");
  if (rawFontSize !== null) {
    const parsedFontSize = parseInteger(rawFontSize, 36, 180);
    if (parsedFontSize === null) {
      warnings.push(`Invalid fontSize "${rawFontSize}"; using the template default.`);
    } else {
      fontSize = parsedFontSize;
    }
  }

  let background: "transparent" | string | null = null;
  const rawBackground = params.get("bg");
  if (rawBackground !== null) {
    if (rawBackground === "transparent") {
      background = "transparent";
    } else {
      background = normalizeHexColor(rawBackground);
      if (background === null) {
        warnings.push(`Invalid bg "${rawBackground}"; using the template default.`);
      }
    }
  }

  let endBehavior: LiveTimerEndBehavior = "hold";
  const rawEnd = params.get("end");
  if (rawEnd !== null) {
    if (isLiveEndBehavior(rawEnd)) {
      endBehavior = rawEnd;
    } else {
      warnings.push(`Unknown end behavior "${rawEnd}"; using hold.`);
    }
  }
  if (endBehavior === "loop" && mode !== "countdown") {
    endBehavior = "hold";
    warnings.push("End behavior loop is only available in countdown mode; using hold.");
  }

  const rawMessage = params.get("message");
  const message =
    rawMessage === null
      ? LIVE_DEFAULT_MESSAGE
      : sanitizeMessage(rawMessage) || LIVE_DEFAULT_MESSAGE;

  const rawLicense = params.get("license");
  const licenseToken = rawLicense ? rawLicense : null;

  const rawPreview = params.get("preview");
  const preview = rawPreview === "1";
  if (rawPreview !== null && !preview) {
    warnings.push(`Invalid preview "${rawPreview}"; preview mode is off.`);
  }

  const rawDebug = params.get("debug");
  const debug = rawDebug === "1";
  if (rawDebug !== null && !debug) {
    warnings.push(`Invalid debug "${rawDebug}"; debug mode is off.`);
  }

  return {
    config: {
      mode,
      durationSeconds,
      untilEpochMs,
      templateId,
      resolutionPresetId,
      displayFormat,
      anchor,
      offsetX,
      offsetY,
      textColor,
      fontSize,
      background,
      endBehavior,
      message,
      licenseToken,
    },
    preview,
    debug,
    warnings,
  };
}

export function buildLiveTimerUrl(origin: string, config: LiveTimerConfig): string {
  const url = new URL("/live", origin);
  const params = url.searchParams;
  const templateDefaults = createGeneratorSettings({
    templateId: config.templateId,
  });
  const resolutionPresetId =
    config.resolutionPresetId ?? templateDefaults.canvas.resolutionPresetId;
  const displayFormat =
    config.displayFormat ?? templateDefaults.timer.displayFormat;
  const anchor = config.anchor ?? templateDefaults.placement.anchor;
  const textColor = config.textColor ?? templateDefaults.textStyle.textColor;
  const fontSize = config.fontSize ?? templateDefaults.textStyle.fontSize;
  const background =
    config.background ??
    (templateDefaults.canvas.backgroundMode === "transparent"
      ? "transparent"
      : templateDefaults.canvas.backgroundColor);

  params.set("v", "1");
  params.set("mode", config.mode);
  if (config.mode === "countdown") {
    params.set("duration", String(config.durationSeconds));
  }
  if (config.mode === "until" && config.untilEpochMs !== null) {
    params.set("until", new Date(config.untilEpochMs).toISOString());
  }
  params.set("template", config.templateId);
  params.set("size", resolutionPresetId);
  params.set("format", DISPLAY_FORMAT_TO_PARAM[displayFormat]);
  params.set("anchor", anchor);
  params.set("ox", String(config.offsetX));
  params.set("oy", String(config.offsetY));
  params.set("color", stripHash(textColor));
  params.set("fontSize", String(fontSize));
  params.set(
    "bg",
    background === "transparent" ? "transparent" : stripHash(background),
  );
  params.set("end", config.endBehavior);
  if (config.endBehavior === "message") {
    params.set("message", sanitizeMessage(config.message) || LIVE_DEFAULT_MESSAGE);
  }
  if (config.licenseToken !== null) {
    params.set("license", config.licenseToken);
  }

  return url.toString();
}

export function liveConfigFromGeneratorSettings(
  settings: GeneratorSettings,
  options: {
    mode: LiveTimerMode;
    durationSeconds: number;
    untilEpochMs: number | null;
    endBehavior: LiveTimerEndBehavior;
    message: string;
    licenseToken: string | null;
  },
): LiveTimerConfig {
  return {
    mode: options.mode,
    durationSeconds: options.durationSeconds,
    untilEpochMs: options.untilEpochMs,
    templateId: settings.templateId,
    resolutionPresetId: settings.canvas.resolutionPresetId,
    displayFormat: settings.timer.displayFormat,
    anchor: settings.placement.anchor,
    offsetX: settings.placement.offsetX,
    offsetY: settings.placement.offsetY,
    textColor: normalizeGeneratorColor(settings.textStyle.textColor),
    fontSize: settings.textStyle.fontSize,
    background:
      settings.canvas.backgroundMode === "transparent"
        ? "transparent"
        : normalizeGeneratorColor(settings.canvas.backgroundColor),
    endBehavior: options.endBehavior,
    message: sanitizeMessage(options.message) || LIVE_DEFAULT_MESSAGE,
    licenseToken: options.licenseToken,
  };
}

export function generatorSettingsFromLiveConfig(
  config: LiveTimerConfig,
): GeneratorSettings {
  const canvasOverrides: Partial<GeneratorSettings["canvas"]> = {};
  if (config.resolutionPresetId !== null) {
    canvasOverrides.resolutionPresetId = config.resolutionPresetId;
  }
  if (config.background === "transparent") {
    canvasOverrides.backgroundMode = "transparent";
  } else if (config.background !== null) {
    canvasOverrides.backgroundMode = "solid";
    canvasOverrides.backgroundColor = config.background;
  }

  const textStyleOverrides: Partial<GeneratorSettings["textStyle"]> = {};
  if (config.textColor !== null) {
    textStyleOverrides.textColor = config.textColor;
  }
  if (config.fontSize !== null) {
    textStyleOverrides.fontSize = config.fontSize;
  }

  return createGeneratorSettings(
    {
      templateId: config.templateId,
      canvas: canvasOverrides,
      timer: config.displayFormat === null ? {} : { displayFormat: config.displayFormat },
      placement: {
        offsetX: config.offsetX,
        offsetY: config.offsetY,
        ...(config.anchor === null ? {} : { anchor: config.anchor }),
      },
      textStyle: textStyleOverrides,
    },
    { isPro: true },
  );
}
