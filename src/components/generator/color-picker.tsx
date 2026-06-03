type ColorPickerProps = {
  label: string;
  value: string;
  swatches?: readonly string[];
  onChange: (value: string) => void;
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
  swatches = DEFAULT_SWATCHES,
  onChange,
}: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground">
        <span className="flex items-center gap-2">{label}</span>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 w-9 cursor-pointer rounded-none border border-border/80 bg-background/65"
          />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="#F8FAFC"
            className="h-9 w-full rounded-none border border-border/80 bg-background/65 px-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-tertiary"
          />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            onClick={() => onChange(swatch)}
            aria-label={`Use color ${swatch}`}
            style={{ backgroundColor: swatch }}
            className="size-6 rounded-none border border-border/80 transition-transform hover:scale-110"
          />
        ))}
      </div>
    </div>
  );
}
