export type TimerDisplayFormat = "ss" | "mm:ss" | "hh:mm:ss";

export type GeneratorFormat = "png-sequence" | "webm" | "gif";

export type BackgroundMode = "transparent" | "solid";

export type PlacementAnchor =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type FontFamilyPreset = "geist-mono" | "geist-sans";

export type ExportQualityPreset = "standard" | "high";

export type RenderThemePresetId = "minimal-neon" | "broadcast-alert" | "calm-studio";

export type ExportStage =
  | "idle"
  | "validating"
  | "rendering-frames"
  | "encoding"
  | "packaging"
  | "complete"
  | "error";

export type ResolutionPresetId =
  | "landscape-720"
  | "landscape-1080"
  | "portrait-720"
  | "portrait-1080"
  | "square-1080";

export type CanvasPreset = {
  id: ResolutionPresetId;
  label: string;
  width: number;
  height: number;
};

export type TimerContentSettings = {
  durationSeconds: number;
  displayFormat: TimerDisplayFormat;
};

export type CanvasSettings = {
  resolutionPresetId: ResolutionPresetId;
  width: number;
  height: number;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  showSafeArea: boolean;
};

export type TextStyleSettings = {
  fontFamily: FontFamilyPreset;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textColor: string;
  strokeWidth: number;
  strokeColor: string;
  glowBlur: number;
  glowColor: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
};

export type PlacementSettings = {
  anchor: PlacementAnchor;
  offsetX: number;
  offsetY: number;
};

export type ExportSettings = {
  format: GeneratorFormat;
  fps: number;
  quality: ExportQualityPreset;
};

export type GeneratorSettings = {
  timer: TimerContentSettings;
  canvas: CanvasSettings;
  textStyle: TextStyleSettings;
  placement: PlacementSettings;
  export: ExportSettings;
  themePresetId: RenderThemePresetId;
};

export type ThemePreset = {
  id: RenderThemePresetId;
  label: string;
  description: string;
  textStyle: Partial<TextStyleSettings>;
  placement?: Partial<PlacementSettings>;
  canvas?: Partial<Pick<CanvasSettings, "backgroundMode" | "backgroundColor">>;
};

export type ExportProgressState = {
  stage: ExportStage;
  completedFrames: number;
  totalFrames: number;
  message: string;
};
