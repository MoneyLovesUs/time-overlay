import type {
  BackgroundMode,
  CanvasPreset,
  FontFamilyPreset,
  GeneratorSettings,
  PlacementAnchor,
  ResolutionPresetId,
  TimerDisplayFormat,
} from "@/lib/generator/types";

type ControlPanelProps = {
  settings: GeneratorSettings;
  canvasPresets: readonly CanvasPreset[];
  onDurationChange: (durationSeconds: number) => void;
  onDisplayFormatChange: (displayFormat: TimerDisplayFormat) => void;
  onResolutionPresetChange: (resolutionPresetId: ResolutionPresetId) => void;
  onBackgroundModeChange: (backgroundMode: BackgroundMode) => void;
  onFontFamilyChange: (fontFamily: FontFamilyPreset) => void;
  onAnchorChange: (anchor: PlacementAnchor) => void;
};

const fieldClassName =
  "mt-2 h-10 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary";

export function ControlPanel({
  settings,
  canvasPresets,
  onDurationChange,
  onDisplayFormatChange,
  onResolutionPresetChange,
  onBackgroundModeChange,
  onFontFamilyChange,
  onAnchorChange,
}: ControlPanelProps) {
  return (
    <section className="cyber-panel cyber-chamfer overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Controls</span>
        <span className="text-primary">Input stack</span>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            Timer setup
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Duration (seconds)
            <input
              className={fieldClassName}
              onChange={(event) => onDurationChange(Number(event.target.value))}
              value={settings.timer.durationSeconds}
              min={3}
              max={60}
              step={1}
              type="number"
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Display format
            <select
              className={fieldClassName}
              onChange={(event) =>
                onDisplayFormatChange(event.target.value as TimerDisplayFormat)
              }
              value={settings.timer.displayFormat}
            >
              <option value="ss">SS</option>
              <option value="mm:ss">MM:SS</option>
              <option value="hh:mm:ss">HH:MM:SS</option>
            </select>
          </label>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            Canvas
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Resolution preset
            <select
              className={fieldClassName}
              onChange={(event) =>
                onResolutionPresetChange(event.target.value as ResolutionPresetId)
              }
              value={settings.canvas.resolutionPresetId}
            >
              {canvasPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Background mode
            <select
              className={fieldClassName}
              onChange={(event) =>
                onBackgroundModeChange(event.target.value as BackgroundMode)
              }
              value={settings.canvas.backgroundMode}
            >
              <option value="transparent">Transparent</option>
              <option value="solid">Solid</option>
            </select>
          </label>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            Style
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Font family
            <select
              className={fieldClassName}
              onChange={(event) =>
                onFontFamilyChange(event.target.value as FontFamilyPreset)
              }
              value={settings.textStyle.fontFamily}
            >
              <option value="geist-mono">Geist Mono</option>
              <option value="geist-sans">Geist Sans</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Anchor
            <select
              className={fieldClassName}
              onChange={(event) =>
                onAnchorChange(event.target.value as PlacementAnchor)
              }
              value={settings.placement.anchor}
            >
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="center-left">Center Left</option>
              <option value="center">Center</option>
              <option value="center-right">Center Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
