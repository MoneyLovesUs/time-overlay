import type {
  CanvasPreset,
  ExportProgressState,
  GeneratorFormat,
  GeneratorSettings,
  PlacementAnchor,
  ThemePreset,
} from "@/lib/generator/types";

export const GENERATOR_DURATION_LIMIT_SECONDS = 60;

export const GENERATOR_MIN_DURATION_SECONDS = 3;

export const GENERATOR_SUPPORTED_FORMATS: readonly GeneratorFormat[] = [
  "png-sequence",
  "webm",
  "gif",
];

export const GENERATOR_ALLOWED_FPS = [24, 30] as const;

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
  { id: "portrait-720", label: "Portrait 720x1280", width: 720, height: 1280 },
  { id: "portrait-1080", label: "Portrait 1080x1920", width: 1080, height: 1920 },
  { id: "square-1080", label: "Square 1080x1080", width: 1080, height: 1080 },
] as const;

export const GENERATOR_THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: "minimal-neon",
    label: "Minimal Neon",
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
    placement: {
      anchor: "center",
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: "broadcast-alert",
    label: "Broadcast Alert",
    description: "Bold timer with a heavy stroke for noisy footage.",
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
    placement: {
      anchor: "bottom-center",
      offsetX: 0,
      offsetY: -32,
    },
  },
  {
    id: "calm-studio",
    label: "Calm Studio",
    description: "Clean timer tuned for tutorials and understated overlays.",
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
    placement: {
      anchor: "top-right",
      offsetX: -28,
      offsetY: 28,
    },
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
  themePresetId: "minimal-neon",
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
  };
}

export function createGeneratorSettings(
  overrides: Partial<GeneratorSettings> = {},
): GeneratorSettings {
  const themePreset = getThemePresetById(
    overrides.themePresetId ?? DEFAULT_GENERATOR_SETTINGS.themePresetId,
  );
  const canvasPreset = getCanvasPresetById(
    overrides.canvas?.resolutionPresetId ??
      DEFAULT_GENERATOR_SETTINGS.canvas.resolutionPresetId,
  );

  return normalizeGeneratorSettings({
    ...DEFAULT_GENERATOR_SETTINGS,
    ...overrides,
    timer: {
      ...DEFAULT_GENERATOR_SETTINGS.timer,
      ...overrides.timer,
    },
    canvas: {
      ...DEFAULT_GENERATOR_SETTINGS.canvas,
      ...themePreset.canvas,
      ...overrides.canvas,
      resolutionPresetId: canvasPreset.id,
      width: canvasPreset.width,
      height: canvasPreset.height,
    },
    textStyle: {
      ...DEFAULT_GENERATOR_SETTINGS.textStyle,
      ...themePreset.textStyle,
      ...overrides.textStyle,
    },
    placement: {
      ...DEFAULT_GENERATOR_SETTINGS.placement,
      ...themePreset.placement,
      ...overrides.placement,
    },
    export: {
      ...DEFAULT_GENERATOR_SETTINGS.export,
      ...overrides.export,
    },
    themePresetId: themePreset.id,
  });
}
