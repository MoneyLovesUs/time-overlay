import { Lock, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RootPageContent } from "@/content/root/types";
import { PAYWALL_ENABLED } from "@/lib/license/state";
import type { RenderThemePresetId, ThemePreset } from "@/lib/generator/types";

type ThemePresetPickerProps = {
  presets: readonly ThemePreset[];
  activePresetId: RenderThemePresetId;
  isPro: boolean;
  onSelectPreset: (presetId: RenderThemePresetId) => void;
  ui: RootPageContent["generatorUi"]["themePresetPicker"];
};

export function ThemePresetPicker({
  presets,
  activePresetId,
  isPro,
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
          const locked = preset.isPro && !isPro;

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
              <span className="flex w-full items-center justify-between gap-2">
                <span className="truncate">{ui.presetLabels[preset.id]}</span>
                {PAYWALL_ENABLED && preset.isPro ? (
                  locked ? (
                    <Lock className="size-3 shrink-0 text-secondary" />
                  ) : (
                    <Sparkles className="size-3 shrink-0 text-secondary" />
                  )
                ) : null}
              </span>
              {PAYWALL_ENABLED && preset.isPro ? (
                <span className="text-[9px] tracking-[0.24em] text-secondary">
                  Pro
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
