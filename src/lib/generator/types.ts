export type TimerDisplayFormat = "ss" | "mm:ss" | "hh:mm:ss";

export type GeneratorFormat =
  | "png-sequence"
  | "webm"
  | "webm-vp9-alpha"
  | "mov-hevc-alpha"
  | "gif";

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

export type StylePresetId =
  | "cyber"
  | "minimal"
  | "mono"
  | "neon"
  | "glow"
  | "scanline"
  | "classic"
  | "retro"
  | "glass"
  | "neumorphic";

export type RenderThemePresetId = StylePresetId;

export type TemplateId =
  | "clean-corner"
  | "broadcast-lower-third"
  | "center-mono"
  | "high-contrast-classic"
  | "quiet-tutorial"
  | "webinar-slate"
  | "obs-starting-soon"
  | "obs-break-timer"
  | "twitch-neon"
  | "premiere-safe-text"
  | "davinci-clean"
  | "capcut-portrait"
  | "reels-bold-center"
  | "square-social"
  | "simple-workout"
  | "classroom-timer"
  | "event-lobby"
  | "transparent-minimal"
  | "cinematic-warm-glow"
  | "film-leader"
  | "launch-countdown"
  | "glass-center-pill"
  | "retro-80s"
  | "arcade-neon"
  | "crt-scanline"
  | "sports-scoreboard"
  | "hiit-round-timer"
  | "pomodoro-creator"
  | "podcast-break"
  | "livestream-intermission"
  | "youtube-premiere"
  | "webinar-dark-pro"
  | "gaming-hud"
  | "creator-brandable"
  | "lower-corner-glow"
  | "vertical-stream"
  | "prores-master-look"
  | "alpha-smoke-reveal"
  | "kinetic-digits"
  | "audio-tick-sync"
  | "split-shadow-pop"
  | "soft-neumorphic"
  | "minimal-caption-safe"
  | "tactical-hud"
  | "music-visual-timer"
  | "countdown-ring"
  | "luxury-event"
  | "custom-font-showcase";

export type TemplateTier = "free" | "growth" | "signature";

export type TemplateCategory =
  | "editing"
  | "streaming"
  | "social"
  | "events"
  | "fitness"
  | "cinematic"
  | "minimal";

export type TemplateOrientation =
  | "landscape"
  | "portrait"
  | "square"
  | "all";

export type TemplateMotif =
  | "none"
  | "corner-plate"
  | "lower-third"
  | "center-plate"
  | "slate"
  | "stream-frame"
  | "neon-lines"
  | "editor-safe"
  | "portrait-frame"
  | "social-burst"
  | "scoreboard"
  | "film"
  | "glass"
  | "hud"
  | "ring"
  | "scanline"
  | "neumorphic"
  | "waveform"
  | "smoke";

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
  | "landscape-2160"
  | "portrait-720"
  | "portrait-1080"
  | "portrait-2160"
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
  customFontFamily?: string;
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

export type AudioCueVariant = "none" | "tick" | "beep" | "tick-and-beep";

export type AudioSettings = {
  variant: AudioCueVariant;
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
  audio: AudioSettings;
  themePresetId: RenderThemePresetId;
  templateId: TemplateId;
};

export type FrameSurface = {
  width: number;
  height: number;
};

export type StylePresetDecoratorContext = {
  surface: FrameSurface;
};

export type StylePresetDecorator = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  decorator: StylePresetDecoratorContext,
) => void;

export type ThemePreset = {
  id: RenderThemePresetId;
  label: string;
  description: string;
  textStyle: Partial<TextStyleSettings>;
  placement?: Partial<PlacementSettings>;
  canvas?: Partial<Pick<CanvasSettings, "backgroundMode" | "backgroundColor">>;
  drawBackdrop?: StylePresetDecorator;
  drawOverlay?: StylePresetDecorator;
};

export type TemplateSettingsOverrides = {
  timer?: Partial<TimerContentSettings>;
  canvas?: Partial<CanvasSettings>;
  textStyle?: Partial<TextStyleSettings>;
  placement?: Partial<PlacementSettings>;
  audio?: Partial<AudioSettings>;
};

export type GeneratorTemplate = {
  id: TemplateId;
  name: string;
  tier: TemplateTier;
  category: TemplateCategory;
  useCase: string;
  orientation: TemplateOrientation;
  recommendedFormat: GeneratorFormat;
  themePresetId: RenderThemePresetId;
  sampleTime: string;
  visual: {
    motif: TemplateMotif;
    accent: string;
    secondaryAccent: string;
    surfaceColor: string;
    kicker?: string;
  };
  settings: TemplateSettingsOverrides;
};

export type ExportProgressState = {
  stage: ExportStage;
  completedFrames: number;
  totalFrames: number;
  message: string;
};
