import { cn } from "@/lib/utils";
import type { RenderThemePresetId, ThemePreset } from "@/lib/generator/types";

type ThemePresetPickerProps = {
  presets: readonly ThemePreset[];
  activePresetId: RenderThemePresetId;
  onSelectPreset: (presetId: RenderThemePresetId) => void;
};

export function ThemePresetPicker({
  presets,
  activePresetId,
  onSelectPreset,
}: ThemePresetPickerProps) {
  return (
    <section className="flex flex-col gap-3 rounded-none border border-border/70 bg-background/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
          Theme preset
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a starting look, then adjust controls only if needed.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isActive = preset.id === activePresetId;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={cn(
                "rounded-none border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
                isActive
                  ? "border-primary/45 bg-primary/12 text-primary shadow-[0_0_0_1px_rgba(0,255,136,0.12)]"
                  : "border-border/80 bg-background/60 text-muted-foreground hover:border-tertiary/50 hover:text-foreground",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
