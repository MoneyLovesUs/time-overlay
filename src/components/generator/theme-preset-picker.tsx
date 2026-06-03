import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { RootPageContent } from "@/content/root/types";
import type { RenderThemePresetId, ThemePreset } from "@/lib/generator/types";

type ThemePresetPickerProps = {
  presets: readonly ThemePreset[];
  activePresetId: RenderThemePresetId;
  onSelectPreset: (presetId: RenderThemePresetId) => void;
  ui: RootPageContent["generatorUi"]["themePresetPicker"];
};

export function ThemePresetPicker({
  presets,
  activePresetId,
  onSelectPreset,
  ui,
}: ThemePresetPickerProps) {
  return (
    <section className="rounded-none border border-border/70 bg-background/40 px-4 py-4">
      <div className="flex flex-col gap-1 border-b border-border/40 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
          {ui.title}
        </p>
        <p className="text-sm text-muted-foreground">{ui.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {presets.map((preset) => {
          const isActive = preset.id === activePresetId;
          const ts = preset.textStyle;
          const previewStyle: CSSProperties = {
            color: ts.textColor,
            fontFamily: ts.fontFamily === "geist-mono" ? "monospace" : "sans-serif",
            textShadow:
              [
                ts.glowBlur && ts.glowColor
                  ? `0 0 ${Math.min(ts.glowBlur, 14)}px ${ts.glowColor}`
                  : null,
                ts.shadowBlur && ts.shadowColor
                  ? `${ts.shadowOffsetX ?? 0}px ${ts.shadowOffsetY ?? 0}px ${Math.min(ts.shadowBlur, 10)}px ${ts.shadowColor}`
                  : null,
              ]
                .filter(Boolean)
                .join(", ") || undefined,
            WebkitTextStroke:
              ts.strokeWidth && ts.strokeColor ? `1px ${ts.strokeColor}` : undefined,
          };

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={cn(
                "group relative flex flex-col items-start gap-1 rounded-none border px-3 py-3 text-left font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200",
                isActive
                  ? "border-primary/55 bg-primary/12 text-primary shadow-[0_0_0_1px_rgba(0,255,136,0.16)]"
                  : "border-border/80 bg-background/60 text-muted-foreground hover:border-tertiary/50 hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className="mb-1.5 flex h-11 w-full items-center justify-center rounded-sm border border-border/40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),rgba(0,0,0,0.4))] text-xl font-bold normal-case tracking-normal tabular-nums"
                style={previewStyle}
              >
                0:30
              </span>
              <span className="flex w-full items-center justify-between gap-2">
                <span className="truncate">{ui.presetLabels[preset.id]}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
