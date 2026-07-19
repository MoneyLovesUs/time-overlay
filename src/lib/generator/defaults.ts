import type {
  CanvasPreset,
  ExportProgressState,
  GeneratorFormat,
  GeneratorSettings,
  PlacementAnchor,
  ThemePreset,
} from "@/lib/generator/types";
import {
  DEFAULT_GENERATOR_TEMPLATE_ID,
  getDefaultTemplateForPreset,
  getGeneratorTemplateById,
} from "@/lib/generator/templates";

export const GENERATOR_DURATION_LIMIT_SECONDS = 300;

export const GENERATOR_MIN_DURATION_SECONDS = 3;

export const GENERATOR_SUPPORTED_FORMATS: readonly GeneratorFormat[] = [
  "png-sequence",
  "webm",
  "webm-vp9-alpha",
  "mov-hevc-alpha",
  "gif",
];

export const GENERATOR_ALLOWED_FPS = [24, 30] as const;

export const GENERATOR_ALLOWED_AUDIO_VARIANTS = [
  "none",
  "tick",
  "beep",
  "tick-and-beep",
] as const;

export const GENERATOR_ALLOWED_FONT_WEIGHTS = [500, 600, 700] as const;

export const GENERATOR_ALLOWED_ANCHORS: readonly PlacementAnchor[] = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export const GENERATOR_CANVAS_PRESETS: readonly CanvasPreset[] = [
  { id: "landscape-720", label: "Landscape 1280x720", width: 1280, height: 720 },
  { id: "landscape-1080", label: "Landscape 1920x1080", width: 1920, height: 1080 },
  { id: "landscape-2160", label: "Landscape 3840x2160 (4K)", width: 3840, height: 2160 },
  { id: "portrait-720", label: "Portrait 720x1280", width: 720, height: 1280 },
  { id: "portrait-1080", label: "Portrait 1080x1920", width: 1080, height: 1920 },
  { id: "portrait-2160", label: "Portrait 2160x3840 (4K)", width: 2160, height: 3840 },
  { id: "square-1080", label: "Square 1080x1080", width: 1080, height: 1080 },
] as const;

export const GENERATOR_THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: "cyber",
    label: "Cyber",
    description: "Sharp mono numerals with a restrained cyan glow.",
    textStyle: {
      fontFamily: "geist-mono",
      fontSize: 88,
      fontWeight: 700,
      letterSpacing: 0.08,
      textColor: "#F8FAFC",
      strokeWidth: 0,
      strokeColor: "#00D4FF",
      glowBlur: 16,
      glowColor: "rgba(0, 212, 255, 0.34)",
      shadowBlur: 10,
      shadowColor: "rgba(0, 0, 0, 0.38)",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
    placement: { anchor: "center", offsetX: 0, offsetY: 0 },
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Quiet sans numerals tuned for tutorials and screen recordings.",
    textStyle: {
      fontFamily: "geist-sans",
      fontSize: 80,
      fontWeight: 600,
      letterSpacing: 0.02,
      textColor: "#E2E8F0",
      strokeWidth: 2,
      strokeColor: "rgba(15, 23, 42, 0.72)",
      glowBlur: 0,
      glowColor: "rgba(0, 0, 0, 0)",
      shadowBlur: 12,
      shadowColor: "rgba(15, 23, 42, 0.28)",
      shadowOffsetX: 0,
      shadowOffsetY: 2,
    },
    placement: { anchor: "top-right", offsetX: -28, offsetY: 28 },
  },
  {
    id: "mono",
    label: "Mono",
    description: "Plain monospace numerals. No glow, no fuss.",
    textStyle: {
      fontFamily: "geist-mono",
      fontSize: 84,
      fontWeight: 700,
      letterSpacing: 0.06,
      textColor: "#F8FAFC",
      strokeWidth: 0,
      strokeColor: "#000000",
      glowBlur: 0,
      glowColor: "rgba(0,0,0,0)",
      shadowBlur: 8,
      shadowColor: "rgba(0, 0, 0, 0.32)",
      shadowOffsetX: 0,
      shadowOffsetY: 2,
    },
    placement: { anchor: "bottom-right", offsetX: -32, offsetY: -32 },
  },
  {
    id: "neon",
    label: "Neon",
    description: "Bright magenta glow for nightlife streams and party countdowns.",
    textStyle: {
      fontFamily: "geist-mono",
      fontSize: 92,
      fontWeight: 700,
      letterSpacing: 0.1,
      textColor: "#FFE2F3",
      strokeWidth: 0,
      strokeColor: "#FF00C8",
      glowBlur: 32,
      glowColor: "rgba(255, 0, 200, 0.85)",
      shadowBlur: 18,
      shadowColor: "rgba(255, 0, 200, 0.45)",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
    placement: { anchor: "center", offsetX: 0, offsetY: 0 },
  },
  {
    id: "glow",
    label: "Glow",
    description: "Soft warm glow for cinematic intros and lifestyle content.",
    textStyle: {
      fontFamily: "geist-sans",
      fontSize: 88,
      fontWeight: 600,
      letterSpacing: 0.02,
      textColor: "#FFF5E6",
      strokeWidth: 0,
      strokeColor: "rgba(255,255,255,0)",
      glowBlur: 28,
      glowColor: "rgba(255, 220, 170, 0.6)",
      shadowBlur: 14,
      shadowColor: "rgba(150, 90, 30, 0.35)",
      shadowOffsetX: 0,
      shadowOffsetY: 4,
    },
    placement: { anchor: "center", offsetX: 0, offsetY: 0 },
  },
  {
    id: "scanline",
    label: "Scanline",
    description: "CRT phosphor green with horizontal scanline overlay.",
    textStyle: {
      fontFamily: "geist-mono",
      fontSize: 90,
      fontWeight: 700,
      letterSpacing: 0.1,
      textColor: "#7CFFB2",
      strokeWidth: 0,
      strokeColor: "#000",
      glowBlur: 12,
      glowColor: "rgba(0, 255, 136, 0.6)",
      shadowBlur: 8,
      shadowColor: "rgba(0, 80, 40, 0.5)",
      shadowOffsetX: 0,
      shadowOffsetY: 1,
    },
    placement: { anchor: "center", offsetX: 0, offsetY: 0 },
  },
  {
    id: "classic",
    label: "Classic",
    description: "Bold broadcast numerals with a heavy stroke for noisy footage.",
    textStyle: {
      fontFamily: "geist-sans",
      fontSize: 96,
      fontWeight: 700,
      letterSpacing: 0.04,
      textColor: "#F8FAFC",
      strokeWidth: 6,
      strokeColor: "#091018",
      glowBlur: 0,
      glowColor: "rgba(0, 0, 0, 0)",
      shadowBlur: 18,
      shadowColor: "rgba(0, 0, 0, 0.4)",
      shadowOffsetX: 0,
      shadowOffsetY: 6,
    },
    placement: { anchor: "bottom-center", offsetX: 0, offsetY: -32 },
  },
  {
    id: "retro",
    label: "Retro 80s",
    description: "Yellow and magenta shadow split for a synthwave countdown.",
    textStyle: {
      fontFamily: "geist-sans",
      fontSize: 92,
      fontWeight: 700,
      letterSpacing: 0.06,
      textColor: "#FFD166",
      strokeWidth: 2,
      strokeColor: "#3C096C",
      glowBlur: 0,
      glowColor: "rgba(0,0,0,0)",
      shadowBlur: 0,
      shadowColor: "#FF1F8F",
      shadowOffsetX: 6,
      shadowOffsetY: 6,
    },
    placement: { anchor: "center", offsetX: 0, offsetY: 0 },
  },
  {
    id: "glass",
    label: "Glass",
    description: "Frosted glassmorphism pill behind clean numerals.",
    textStyle: {
      fontFamily: "geist-sans",
      fontSize: 84,
      fontWeight: 600,
      letterSpacing: 0.03,
      textColor: "#F8FAFC",
      strokeWidth: 0,
      strokeColor: "rgba(0,0,0,0)",
      glowBlur: 12,
      glowColor: "rgba(255,255,255,0.18)",
      shadowBlur: 16,
      shadowColor: "rgba(15, 23, 42, 0.5)",
      shadowOffsetX: 0,
      shadowOffsetY: 6,
    },
    placement: { anchor: "center", offsetX: 0, offsetY: 0 },
  },
  {
    id: "neumorphic",
    label: "Neumorphic",
    description: "Soft mono-tone numerals with paired light and shadow.",
    textStyle: {
      fontFamily: "geist-sans",
      fontSize: 82,
      fontWeight: 600,
      letterSpacing: 0.02,
      textColor: "#D9DEE6",
      strokeWidth: 0,
      strokeColor: "rgba(0,0,0,0)",
      glowBlur: 18,
      glowColor: "rgba(255, 255, 255, 0.18)",
      shadowBlur: 18,
      shadowColor: "rgba(8, 11, 17, 0.55)",
      shadowOffsetX: 6,
      shadowOffsetY: 6,
    },
    placement: { anchor: "center", offsetX: 0, offsetY: 0 },
    canvas: { backgroundMode: "solid", backgroundColor: "#1F2330" },
  },
] as const;

export const DEFAULT_GENERATOR_SETTINGS: GeneratorSettings = {
  timer: {
    durationSeconds: 30,
    displayFormat: "mm:ss",
  },
  canvas: {
    resolutionPresetId: "landscape-720",
    width: 1280,
    height: 720,
    backgroundMode: "transparent",
    backgroundColor: "#090B10",
    showSafeArea: true,
  },
  textStyle: {
    fontFamily: "geist-mono",
    fontSize: 88,
    fontWeight: 700,
    letterSpacing: 0.08,
    textColor: "#F8FAFC",
    strokeWidth: 0,
    strokeColor: "#00D4FF",
    glowBlur: 16,
    glowColor: "rgba(0, 212, 255, 0.34)",
    shadowBlur: 10,
    shadowColor: "rgba(0, 0, 0, 0.38)",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  },
  placement: {
    anchor: "center",
    offsetX: 0,
    offsetY: 0,
  },
  export: {
    format: "png-sequence",
    fps: 30,
    quality: "standard",
  },
  audio: {
    variant: "none",
  },
  themePresetId: "cyber",
  templateId: DEFAULT_GENERATOR_TEMPLATE_ID,
};

export const DEFAULT_EXPORT_PROGRESS_STATE: ExportProgressState = {
  stage: "idle",
  completedFrames: 0,
  totalFrames: 0,
  message: "",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCanvasPresetById(
  presetId: GeneratorSettings["canvas"]["resolutionPresetId"],
) {
  return (
    GENERATOR_CANVAS_PRESETS.find((preset) => preset.id === presetId) ??
    GENERATOR_CANVAS_PRESETS[0]
  );
}

function getThemePresetById(themePresetId: GeneratorSettings["themePresetId"]) {
  return (
    GENERATOR_THEME_PRESETS.find((preset) => preset.id === themePresetId) ??
    GENERATOR_THEME_PRESETS[0]
  );
}

export function normalizeGeneratorSettings(
  settings: GeneratorSettings,
): GeneratorSettings {
  const canvasPreset = getCanvasPresetById(settings.canvas.resolutionPresetId);
  const themePreset = getThemePresetById(settings.themePresetId);
  const template = getGeneratorTemplateById(settings.templateId);
  const allowedFormat = GENERATOR_SUPPORTED_FORMATS.includes(settings.export.format)
    ? settings.export.format
    : DEFAULT_GENERATOR_SETTINGS.export.format;
  const allowedFps = GENERATOR_ALLOWED_FPS.includes(
    settings.export.fps as (typeof GENERATOR_ALLOWED_FPS)[number],
  )
    ? settings.export.fps
    : DEFAULT_GENERATOR_SETTINGS.export.fps;
  const allowedFontWeight = GENERATOR_ALLOWED_FONT_WEIGHTS.includes(
    settings.textStyle.fontWeight as (typeof GENERATOR_ALLOWED_FONT_WEIGHTS)[number],
  )
    ? settings.textStyle.fontWeight
    : DEFAULT_GENERATOR_SETTINGS.textStyle.fontWeight;
  const allowedAnchor = GENERATOR_ALLOWED_ANCHORS.includes(settings.placement.anchor)
    ? settings.placement.anchor
    : DEFAULT_GENERATOR_SETTINGS.placement.anchor;

  return {
    ...settings,
    themePresetId: themePreset.id,
    templateId: template.id,
    timer: {
      ...settings.timer,
      durationSeconds: clamp(
        Math.round(settings.timer.durationSeconds),
        GENERATOR_MIN_DURATION_SECONDS,
        GENERATOR_DURATION_LIMIT_SECONDS,
      ),
    },
    canvas: {
      ...settings.canvas,
      resolutionPresetId: canvasPreset.id,
      width: canvasPreset.width,
      height: canvasPreset.height,
    },
    textStyle: {
      ...settings.textStyle,
      fontSize: clamp(settings.textStyle.fontSize, 36, 180),
      fontWeight: allowedFontWeight,
      letterSpacing: clamp(settings.textStyle.letterSpacing, -0.02, 0.2),
      strokeWidth: clamp(settings.textStyle.strokeWidth, 0, 12),
      glowBlur: clamp(settings.textStyle.glowBlur, 0, 40),
      shadowBlur: clamp(settings.textStyle.shadowBlur, 0, 36),
      shadowOffsetX: clamp(settings.textStyle.shadowOffsetX, -24, 24),
      shadowOffsetY: clamp(settings.textStyle.shadowOffsetY, -24, 24),
    },
    placement: {
      ...settings.placement,
      anchor: allowedAnchor,
      offsetX: clamp(settings.placement.offsetX, -240, 240),
      offsetY: clamp(settings.placement.offsetY, -240, 240),
    },
    export: {
      ...settings.export,
      format: allowedFormat,
      fps: allowedFps,
    },
    audio: {
      ...settings.audio,
      variant: GENERATOR_ALLOWED_AUDIO_VARIANTS.includes(
        settings.audio.variant as (typeof GENERATOR_ALLOWED_AUDIO_VARIANTS)[number],
      )
        ? settings.audio.variant
        : DEFAULT_GENERATOR_SETTINGS.audio.variant,
    },
  };
}

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export function createGeneratorSettings(
  overrides: DeepPartial<GeneratorSettings> = {},
): GeneratorSettings {
  const hasExplicitTemplate = overrides.templateId !== undefined;
  const hasExplicitTheme = overrides.themePresetId !== undefined;
  const template = hasExplicitTemplate
    ? getGeneratorTemplateById(overrides.templateId)
    : hasExplicitTheme
      ? getDefaultTemplateForPreset(overrides.themePresetId ?? "")
      : getGeneratorTemplateById(DEFAULT_GENERATOR_TEMPLATE_ID);
  const templateSettings =
    hasExplicitTheme && !hasExplicitTemplate ? {} : template.settings;
  const themePreset = getThemePresetById(
    overrides.themePresetId ??
      template.themePresetId ??
      DEFAULT_GENERATOR_SETTINGS.themePresetId,
  );
  const canvasPreset = getCanvasPresetById(
    overrides.canvas?.resolutionPresetId ??
      templateSettings.canvas?.resolutionPresetId ??
      DEFAULT_GENERATOR_SETTINGS.canvas.resolutionPresetId,
  );

  return normalizeGeneratorSettings({
    ...DEFAULT_GENERATOR_SETTINGS,
    ...overrides,
    timer: {
      ...DEFAULT_GENERATOR_SETTINGS.timer,
      ...templateSettings.timer,
      ...overrides.timer,
    },
    canvas: {
      ...DEFAULT_GENERATOR_SETTINGS.canvas,
      ...themePreset.canvas,
      ...templateSettings.canvas,
      ...overrides.canvas,
      resolutionPresetId: canvasPreset.id,
      width: canvasPreset.width,
      height: canvasPreset.height,
    },
    textStyle: {
      ...DEFAULT_GENERATOR_SETTINGS.textStyle,
      ...themePreset.textStyle,
      ...templateSettings.textStyle,
      ...overrides.textStyle,
    },
    placement: {
      ...DEFAULT_GENERATOR_SETTINGS.placement,
      ...themePreset.placement,
      ...templateSettings.placement,
      ...overrides.placement,
    },
    export: {
      ...DEFAULT_GENERATOR_SETTINGS.export,
      ...overrides.export,
    },
    audio: {
      ...DEFAULT_GENERATOR_SETTINGS.audio,
      ...templateSettings.audio,
      ...overrides.audio,
    },
    themePresetId: themePreset.id,
    templateId: template.id,
  });
}

export function applyGeneratorTemplate(
  current: GeneratorSettings,
  templateId: GeneratorSettings["templateId"],
): GeneratorSettings {
  const template = getGeneratorTemplateById(templateId);
  const templateSettings = createGeneratorSettings({ templateId: template.id });

  return normalizeGeneratorSettings({
    ...current,
    timer: {
      ...templateSettings.timer,
      durationSeconds: current.timer.durationSeconds,
    },
    canvas: {
      ...templateSettings.canvas,
      showSafeArea: current.canvas.showSafeArea,
    },
    textStyle: {
      ...templateSettings.textStyle,
      customFontFamily: current.textStyle.customFontFamily,
    },
    placement: templateSettings.placement,
    export: current.export,
    audio: template.settings.audio ? templateSettings.audio : current.audio,
    themePresetId: templateSettings.themePresetId,
    templateId: template.id,
  });
}
