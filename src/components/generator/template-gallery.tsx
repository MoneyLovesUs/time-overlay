"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Check,
  Grid2X2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  GENERATOR_QUICK_TEMPLATE_IDS,
  GENERATOR_TEMPLATE_CATEGORIES,
} from "@/lib/generator/templates";
import type {
  GeneratorFormat,
  GeneratorTemplate,
  PlacementAnchor,
  TemplateCategory,
  TemplateId,
  TemplateMotif,
} from "@/lib/generator/types";

export type TemplateGalleryCopy = {
  title: string;
  description: string;
  browseLabel: string;
  searchPlaceholder: string;
  categoryLabels: Record<"all" | TemplateCategory, string>;
  selectedLabel: string;
  editedLabel: string;
  resultTemplate: string;
  noResults: string;
  closeLabel: string;
};

type TemplateGalleryProps = {
  templates: readonly GeneratorTemplate[];
  activeTemplateId: TemplateId;
  isCustomized: boolean;
  copy?: Partial<TemplateGalleryCopy>;
  onSelectTemplate: (templateId: TemplateId) => void;
  onGalleryOpened: () => void;
  onFilterChanged: (filter: string) => void;
};

const DEFAULT_COPY: TemplateGalleryCopy = {
  title: "Template library",
  description: "Start with a proven layout. Your duration and export choices stay put.",
  browseLabel: "Browse all 48",
  searchPlaceholder: "Search templates or use cases",
  categoryLabels: {
    all: "All",
    editing: "Editing",
    streaming: "Streaming",
    social: "Social",
    events: "Events",
    fitness: "Fitness",
    cinematic: "Cinematic",
    minimal: "Minimal",
  },
  selectedLabel: "Selected",
  editedLabel: "Edited",
  resultTemplate: "{count} templates",
  noResults: "No templates match this filter.",
  closeLabel: "Close template library",
};

const FORMAT_LABELS: Record<GeneratorFormat, string> = {
  "png-sequence": "PNG",
  webm: "WebM",
  "webm-vp9-alpha": "WebM alpha",
  "mov-hevc-alpha": "MOV alpha",
  gif: "GIF",
};

const ANCHOR_CLASSES: Record<PlacementAnchor, string> = {
  "top-left": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-right": "items-start justify-end",
  "center-left": "items-center justify-start",
  center: "items-center justify-center",
  "center-right": "items-center justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-center": "items-end justify-center",
  "bottom-right": "items-end justify-end",
};

const THEME_TEXT_COLORS: Record<GeneratorTemplate["themePresetId"], string> = {
  cyber: "#F8FAFC",
  minimal: "#E2E8F0",
  mono: "#F8FAFC",
  neon: "#FFE2F3",
  glow: "#FFF5E6",
  scanline: "#7CFFB2",
  classic: "#F8FAFC",
  retro: "#FFD166",
  glass: "#F8FAFC",
  neumorphic: "#D9DEE6",
};

function TemplateMotifDecoration({
  motif,
  accent,
  secondaryAccent,
}: {
  motif: TemplateMotif;
  accent: string;
  secondaryAccent: string;
}) {
  if (motif === "none") {
    return null;
  }

  if (motif === "corner-plate") {
    return (
      <span
        className="absolute right-[8%] top-[12%] h-[34%] w-[42%] border bg-black/45"
        style={{ borderColor: accent }}
      />
    );
  }

  if (motif === "lower-third") {
    return (
      <>
        <span
          className="absolute inset-x-[7%] bottom-[10%] h-[30%] border bg-black/55"
          style={{ borderColor: accent }}
        />
        <span
          className="absolute bottom-[15%] left-[12%] h-0.5 w-[24%]"
          style={{ backgroundColor: accent }}
        />
      </>
    );
  }

  if (motif === "center-plate" || motif === "glass" || motif === "neumorphic") {
    return (
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-[42%] w-[62%] -translate-x-1/2 -translate-y-1/2 border",
          motif === "glass" && "bg-white/10",
          motif === "center-plate" && "bg-black/45",
          motif === "neumorphic" &&
            "border-white/10 bg-[#262b38] shadow-[5px_5px_10px_rgba(0,0,0,0.55),-4px_-4px_10px_rgba(255,255,255,0.06)]",
        )}
        style={{
          borderColor: motif === "neumorphic" ? undefined : accent,
          borderRadius: motif === "center-plate" ? 4 : 999,
        }}
      />
    );
  }

  if (motif === "slate" || motif === "scoreboard") {
    return (
      <span
        className="absolute inset-x-[12%] top-1/2 h-[62%] -translate-y-1/2 border bg-black/55"
        style={{ borderColor: accent }}
      >
        <span
          className="absolute inset-x-0 top-0 h-[20%] opacity-25"
          style={{ backgroundColor: accent }}
        />
      </span>
    );
  }

  if (motif === "stream-frame" || motif === "editor-safe" || motif === "hud") {
    return (
      <span
        className={cn(
          "absolute inset-[7%] border",
          motif === "editor-safe" && "border-dashed opacity-60",
          motif === "hud" && "opacity-70",
        )}
        style={{ borderColor: accent }}
      >
        {motif === "stream-frame" ? (
          <span
            className="absolute inset-x-0 top-0 h-[12%] opacity-25"
            style={{ backgroundColor: accent }}
          />
        ) : null}
        {motif === "hud" ? (
          <>
            <span className="absolute inset-x-0 top-1/3 border-t border-current opacity-25" />
            <span className="absolute inset-x-0 top-2/3 border-t border-current opacity-25" />
          </>
        ) : null}
      </span>
    );
  }

  if (motif === "portrait-frame") {
    return (
      <span
        className="absolute bottom-[5%] left-1/2 top-[5%] w-[38%] -translate-x-1/2 border bg-black/25"
        style={{ borderColor: accent, borderRadius: 8 }}
      />
    );
  }

  if (motif === "neon-lines" || motif === "social-burst") {
    return (
      <>
        <span
          className="absolute left-[8%] top-1/2 h-px w-[84%] -rotate-[24deg] opacity-60"
          style={{ backgroundColor: accent }}
        />
        <span
          className="absolute left-[14%] top-1/2 h-px w-[72%] rotate-[18deg] opacity-45"
          style={{ backgroundColor: secondaryAccent }}
        />
        {motif === "social-burst" ? (
          <span
            className="absolute left-1/2 top-[8%] h-[84%] w-px -translate-x-1/2 opacity-35"
            style={{ backgroundColor: accent }}
          />
        ) : null}
      </>
    );
  }

  if (motif === "film") {
    return (
      <>
        <span
          className="absolute left-1/2 top-1/2 aspect-square h-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-50"
          style={{ borderColor: accent }}
        />
        <span
          className="absolute inset-x-0 top-[8%] border-t border-dashed opacity-35"
          style={{ borderColor: accent }}
        />
        <span
          className="absolute inset-x-0 bottom-[8%] border-t border-dashed opacity-35"
          style={{ borderColor: accent }}
        />
      </>
    );
  }

  if (motif === "ring" || motif === "waveform") {
    return (
      <>
        <span
          className="absolute left-1/2 top-1/2 aspect-square h-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-70"
          style={{ borderColor: accent }}
        />
        {motif === "waveform" ? (
          <span
            className="absolute inset-x-[18%] bottom-[13%] h-[10%] opacity-65"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${secondaryAccent} 0 2px, transparent 2px 7px)`,
            }}
          />
        ) : null}
      </>
    );
  }

  if (motif === "scanline") {
    return (
      <span
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 3px, rgba(0,0,0,0.55) 3px 4px)",
        }}
      />
    );
  }

  if (motif === "smoke") {
    return (
      <span
        className="absolute -left-[10%] top-[42%] h-[26%] w-[120%] -rotate-6 opacity-40 blur-md"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, ${secondaryAccent}, transparent)`,
        }}
      />
    );
  }

  return null;
}

function TemplatePreview({
  template,
  compact = false,
}: {
  template: GeneratorTemplate;
  compact?: boolean;
}) {
  const anchor = template.settings.placement?.anchor ?? "center";
  const textStyle = template.settings.textStyle;
  const color =
    textStyle?.textColor ?? THEME_TEXT_COLORS[template.themePresetId];
  const isMono = ["cyber", "mono", "scanline"].includes(
    template.themePresetId,
  );
  const textShadow =
    template.themePresetId === "retro"
      ? `3px 3px 0 ${template.visual.secondaryAccent}`
      : `0 0 10px ${template.visual.accent}`;
  const canvasStyle: CSSProperties = {
    backgroundColor: template.visual.surfaceColor,
    backgroundImage:
      "linear-gradient(135deg, rgba(255,255,255,0.035), transparent 42%, rgba(0,0,0,0.22))",
  };
  const timerStyle: CSSProperties = {
    color,
    fontFamily: isMono ? "ui-monospace, monospace" : "ui-sans-serif, sans-serif",
    textShadow,
    WebkitTextStroke:
      template.themePresetId === "classic" ? "1px rgba(0,0,0,0.75)" : undefined,
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block aspect-video w-full overflow-hidden border border-white/10",
        compact ? "min-h-14" : "min-h-20",
      )}
      style={canvasStyle}
    >
      <TemplateMotifDecoration
        motif={template.visual.motif}
        accent={template.visual.accent}
        secondaryAccent={template.visual.secondaryAccent}
      />
      <span
        className={cn(
          "absolute inset-[10%] z-10 flex",
          ANCHOR_CLASSES[anchor],
        )}
      >
        <span
          className={cn(
            "font-bold tabular-nums",
            compact ? "text-base" : "text-lg sm:text-xl",
          )}
          style={timerStyle}
        >
          {template.sampleTime}
        </span>
      </span>
    </span>
  );
}

function TemplateCard({
  template,
  active,
  onSelect,
}: {
  template: GeneratorTemplate;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "group relative flex min-w-0 flex-col border bg-background/75 p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary/70",
        active
          ? "border-primary/70 shadow-[0_0_0_1px_rgba(0,255,136,0.18)]"
          : "border-border/80 hover:border-tertiary/55",
      )}
    >
      <TemplatePreview template={template} />
      <span className="mt-2 flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold text-foreground">
            {template.name}
          </span>
          <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
            {template.useCase}
          </span>
        </span>
        {active ? (
          <span className="grid size-5 shrink-0 place-items-center bg-primary text-primary-foreground">
            <Check className="size-3" />
          </span>
        ) : null}
      </span>
      <span className="mt-2 flex items-center justify-between gap-2 font-mono text-[9px] uppercase text-muted-foreground">
        <span>{template.orientation}</span>
        <span>{FORMAT_LABELS[template.recommendedFormat]}</span>
      </span>
    </button>
  );
}

export function TemplateGallery({
  templates,
  activeTemplateId,
  isCustomized,
  copy,
  onSelectTemplate,
  onGalleryOpened,
  onFilterChanged,
}: TemplateGalleryProps) {
  const ui = { ...DEFAULT_COPY, ...copy };
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | TemplateCategory>("all");
  const activeTemplate =
    templates.find((template) => template.id === activeTemplateId) ??
    templates[0];
  const quickTemplates = useMemo(() => {
    const ids = [
      activeTemplateId,
      ...GENERATOR_QUICK_TEMPLATE_IDS.filter((id) => id !== activeTemplateId),
    ].slice(0, 6);
    return ids
      .map((id) => templates.find((template) => template.id === id))
      .filter((template): template is GeneratorTemplate => Boolean(template));
  }, [activeTemplateId, templates]);
  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesCategory =
        category === "all" || template.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          template.name,
          template.useCase,
          template.category,
          template.orientation,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, templates]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const openGallery = () => {
    setIsOpen(true);
    onGalleryOpened();
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const selectTemplate = (templateId: TemplateId, closeAfter = false) => {
    onSelectTemplate(templateId);
    if (closeAfter) {
      closeGallery();
    }
  };

  const selectCategory = (nextCategory: "all" | TemplateCategory) => {
    setCategory(nextCategory);
    onFilterChanged(`category:${nextCategory}`);
  };

  return (
    <section className="border-y border-border/70 bg-background/45 py-4">
      <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
              {ui.title}
            </p>
            <span className="border border-primary/35 bg-primary/8 px-1.5 py-0.5 font-mono text-[9px] uppercase text-primary">
              {templates.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{ui.description}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-foreground">
            <span className="text-muted-foreground">{ui.selectedLabel}:</span>
            <span className="font-medium">{activeTemplate.name}</span>
            {isCustomized ? (
              <span className="border border-secondary/35 bg-secondary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-secondary">
                {ui.editedLabel}
              </span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          onClick={openGallery}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 border border-tertiary/45 bg-tertiary/8 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-tertiary hover:bg-tertiary/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary/70"
        >
          <Grid2X2 className="size-4 text-tertiary" />
          {ui.browseLabel}
        </button>
      </div>

      <div className="mt-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
        {quickTemplates.map((template) => {
          const active = template.id === activeTemplateId;
          return (
            <button
              key={template.id}
              type="button"
              aria-pressed={active}
              onClick={() => selectTemplate(template.id)}
              className={cn(
                "w-[8.75rem] shrink-0 snap-start border p-2 text-left transition-colors sm:w-auto",
                active
                  ? "border-primary/70 bg-primary/7"
                  : "border-border/80 bg-background/60 hover:border-tertiary/50",
              )}
            >
              <TemplatePreview template={template} compact />
              <span className="mt-1.5 flex min-w-0 items-center justify-between gap-1">
                <span className="truncate text-[11px] font-medium text-foreground">
                  {template.name}
                </span>
                {active ? <Check className="size-3 shrink-0 text-primary" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={ui.title}
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.currentTarget === event.target) {
            closeGallery();
          }
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 h-[86dvh] max-h-[860px] w-full max-w-none overflow-hidden rounded-t-md border border-border bg-[#0a0a0f] p-0 text-foreground shadow-2xl backdrop:bg-black/75 sm:inset-0 sm:m-auto sm:h-[min(86dvh,800px)] sm:w-[min(94vw,1120px)] sm:rounded-md"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-tertiary">
                {ui.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {ui.description}
              </p>
            </div>
            <button
              type="button"
              aria-label={ui.closeLabel}
              title={ui.closeLabel}
              onClick={closeGallery}
              className="grid size-9 shrink-0 place-items-center border border-border text-muted-foreground transition-colors hover:border-tertiary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary/70"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="border-b border-border/80 px-4 py-3 sm:px-5">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                aria-label={ui.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui.searchPlaceholder}
                className="h-10 w-full border border-border bg-background/70 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-tertiary"
              />
            </label>

            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
              {GENERATOR_TEMPLATE_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={category === item.id}
                  onClick={() => selectCategory(item.id)}
                  className={cn(
                    "h-8 shrink-0 border px-2.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                    category === item.id
                      ? "border-primary/65 bg-primary/10 text-primary"
                      : "border-border bg-background/55 text-muted-foreground hover:border-tertiary/50 hover:text-foreground",
                  )}
                >
                  {ui.categoryLabels[item.id]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:px-5">
              <span>
                {ui.resultTemplate.replace(
                  "{count}",
                  String(filteredTemplates.length),
                )}
              </span>
              <span>{activeTemplate.name}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      active={template.id === activeTemplateId}
                      onSelect={() => selectTemplate(template.id, true)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid min-h-48 place-items-center border border-dashed border-border text-sm text-muted-foreground">
                  {ui.noResults}
                </div>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
