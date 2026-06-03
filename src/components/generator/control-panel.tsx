import { Upload, X } from "lucide-react";
import { useRef } from "react";

import { ColorPicker } from "@/components/generator/color-picker";
import type {
  AudioCueVariant,
  BackgroundMode,
  CanvasPreset,
  FontFamilyPreset,
  GeneratorSettings,
  PlacementAnchor,
  ResolutionPresetId,
  TimerDisplayFormat,
} from "@/lib/generator/types";
import type { RootPageContent } from "@/content/root/types";
import {
  GENERATOR_DURATION_LIMIT_SECONDS,
  GENERATOR_MIN_DURATION_SECONDS,
} from "@/lib/generator/defaults";

type ControlPanelProps = {
  settings: GeneratorSettings;
  canvasPresets: readonly CanvasPreset[];
  ui: RootPageContent["generatorUi"]["controlPanel"];
  uploadedFontName: string | null;
  onDurationChange: (durationSeconds: number) => void;
  onDisplayFormatChange: (displayFormat: TimerDisplayFormat) => void;
  onResolutionPresetChange: (resolutionPresetId: ResolutionPresetId) => void;
  onBackgroundModeChange: (backgroundMode: BackgroundMode) => void;
  onFontFamilyChange: (fontFamily: FontFamilyPreset) => void;
  onAnchorChange: (anchor: PlacementAnchor) => void;
  onTextColorChange: (textColor: string) => void;
  onUploadFont: (file: File) => void;
  onClearUploadedFont: () => void;
  onAudioVariantChange: (variant: AudioCueVariant) => void;
};

const fieldClassName =
  "mt-2 h-10 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary";

export function ControlPanel({
  settings,
  canvasPresets,
  ui,
  uploadedFontName,
  onDurationChange,
  onDisplayFormatChange,
  onResolutionPresetChange,
  onBackgroundModeChange,
  onFontFamilyChange,
  onAnchorChange,
  onTextColorChange,
  onUploadFont,
  onClearUploadedFont,
  onAudioVariantChange,
}: ControlPanelProps) {
  const fontInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fontInputRef.current?.click();
  };

  const handleFontInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadFont(file);
    }
    event.target.value = "";
  };

  const durationMax = GENERATOR_DURATION_LIMIT_SECONDS;

  return (
    <section className="cyber-panel cyber-chamfer overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{ui.title}</span>
        <span className="text-primary">{ui.subtitle}</span>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.timerSetupTitle}
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.durationLabel}
            <input
              className={fieldClassName}
              onChange={(event) => onDurationChange(Number(event.target.value))}
              value={settings.timer.durationSeconds}
              min={GENERATOR_MIN_DURATION_SECONDS}
              max={durationMax}
              step={1}
              type="number"
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.displayFormatLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onDisplayFormatChange(event.target.value as TimerDisplayFormat)
              }
              value={settings.timer.displayFormat}
            >
              <option value="ss">{ui.displayFormatOptions.ss}</option>
              <option value="mm:ss">{ui.displayFormatOptions["mm:ss"]}</option>
              <option value="hh:mm:ss">{ui.displayFormatOptions["hh:mm:ss"]}</option>
            </select>
          </label>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.canvasTitle}
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.resolutionPresetLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onResolutionPresetChange(event.target.value as ResolutionPresetId)
              }
              value={settings.canvas.resolutionPresetId}
            >
              {canvasPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {ui.resolutionPresetOptions[preset.id]}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.backgroundModeLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onBackgroundModeChange(event.target.value as BackgroundMode)
              }
              value={settings.canvas.backgroundMode}
            >
              <option value="transparent">{ui.transparentOptionLabel}</option>
              <option value="solid">{ui.solidOptionLabel}</option>
            </select>
          </label>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.audioTitle}
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.audioVariantLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onAudioVariantChange(event.target.value as AudioCueVariant)
              }
              value={settings.audio.variant}
            >
              <option value="none">{ui.audioVariantOptions.none}</option>
              <option value="tick">{ui.audioVariantOptions.tick}</option>
              <option value="beep">{ui.audioVariantOptions.beep}</option>
              <option value="tick-and-beep">
                {ui.audioVariantOptions["tick-and-beep"]}
              </option>
            </select>
          </label>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
            {ui.audioNote}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.styleTitle}
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.fontFamilyLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onFontFamilyChange(event.target.value as FontFamilyPreset)
              }
              value={settings.textStyle.fontFamily}
              disabled={Boolean(uploadedFontName)}
            >
              <option value="geist-mono">{ui.fontFamilyOptions["geist-mono"]}</option>
              <option value="geist-sans">{ui.fontFamilyOptions["geist-sans"]}</option>
            </select>
          </label>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="inline-flex h-9 items-center gap-2 rounded-none border border-border/80 bg-background/65 px-3 text-xs font-mono uppercase tracking-[0.22em] text-foreground transition-colors hover:border-tertiary disabled:opacity-60"
            >
              <Upload className="size-3.5" />
              Upload font
            </button>
            {uploadedFontName ? (
              <button
                type="button"
                onClick={onClearUploadedFont}
                aria-label="Clear uploaded font"
                className="inline-flex h-9 items-center gap-2 rounded-none border border-border/80 bg-background/65 px-3 text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" />
                {uploadedFontName.replace(/^user-/, "").slice(0, 14)}
              </button>
            ) : null}
            <input
              ref={fontInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={handleFontInputChange}
              className="hidden"
            />
          </div>

          <div className="mt-4">
            <ColorPicker
              label="Text color"
              value={settings.textStyle.textColor}
              onChange={onTextColorChange}
            />
          </div>

          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.anchorLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onAnchorChange(event.target.value as PlacementAnchor)
              }
              value={settings.placement.anchor}
            >
              <option value="top-left">{ui.anchorOptions["top-left"]}</option>
              <option value="top-center">{ui.anchorOptions["top-center"]}</option>
              <option value="top-right">{ui.anchorOptions["top-right"]}</option>
              <option value="center-left">{ui.anchorOptions["center-left"]}</option>
              <option value="center">{ui.anchorOptions.center}</option>
              <option value="center-right">{ui.anchorOptions["center-right"]}</option>
              <option value="bottom-left">{ui.anchorOptions["bottom-left"]}</option>
              <option value="bottom-center">{ui.anchorOptions["bottom-center"]}</option>
              <option value="bottom-right">{ui.anchorOptions["bottom-right"]}</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
