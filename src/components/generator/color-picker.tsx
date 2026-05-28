import { Lock } from "lucide-react";

type ColorPickerProps = {
  label: string;
  value: string;
  isPro: boolean;
  swatches?: readonly string[];
  onChange: (value: string) => void;
  onLockedClick: () => void;
};

const DEFAULT_SWATCHES = [
  "#F8FAFC",
  "#00D4FF",
  "#FF00C8",
  "#7CFFB2",
  "#FFD166",
  "#FF6B6B",
  "#A78BFA",
  "#FFF5E6",
] as const;

export function ColorPicker({
  label,
  value,
  isPro,
  swatches = DEFAULT_SWATCHES,
  onChange,
  onLockedClick,
}: ColorPickerProps) {
  const handleChange = (next: string) => {
    if (!isPro) {
      onLockedClick();
      return;
    }
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground">
        <span className="flex items-center gap-2">
          {label}
          {!isPro ? (
            <span className="inline-flex items-center gap-1 rounded-none border border-secondary/45 bg-secondary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-secondary">
              <Lock className="size-3" />
              Pro
            </span>
          ) : null}
        </span>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            disabled={!isPro}
            className="h-9 w-9 cursor-pointer rounded-none border border-border/80 bg-background/65 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <input
            type="text"
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            disabled={!isPro}
            placeholder="#F8FAFC"
            className="h-9 w-full rounded-none border border-border/80 bg-background/65 px-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-tertiary disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            onClick={() => handleChange(swatch)}
            disabled={!isPro}
            aria-label={`Use color ${swatch}`}
            style={{ backgroundColor: swatch }}
            className="size-6 rounded-none border border-border/80 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
          />
        ))}
      </div>
    </div>
  );
}
