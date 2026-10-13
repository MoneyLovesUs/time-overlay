import {
  Clapperboard,
  Download,
  FileStack,
  Film,
  MonitorSmartphone,
  Sparkles,
  X,
} from "lucide-react";

import { ExportProgressView } from "@/components/generator/export-progress-view";
import { Button } from "@/components/ui/button";
import type { RootPageContent } from "@/content/root/types";
import type { ExportAdvisory, LocalExportSupport } from "@/lib/generator/feature-detection";
import type {
  ExportProgressState,
  ExportQualityPreset,
  GeneratorFormat,
  GeneratorSettings,
} from "@/lib/generator/types";

type ExportPanelProps = {
  settings: GeneratorSettings;
  advisory: ExportAdvisory;
  ui: RootPageContent["generatorUi"]["exportPanel"];
  exportProgress: ExportProgressState;
  isExporting: boolean;
  onExport: () => void;
  onCancel?: () => void;
  onFormatChange: (format: GeneratorFormat) => void;
  onFpsChange: (fps: number) => void;
  onQualityChange: (quality: ExportQualityPreset) => void;
  support: LocalExportSupport;
  etaMs?: number | null;
  previewBitmap?: ImageBitmap | null;
  isMobile?: boolean;
};

const DEFAULT_DESKTOP_NOTE =
  "On phones and tablets, use 720p for up to 60 seconds or keep 1080p near 30 seconds, and keep this page visible while exporting. Use desktop for 4K or longer jobs.";

const DEFAULT_MOBILE_EXPORT_LIMIT_ERROR =
  "This job is too large for a reliable phone or tablet export. Use 720p for up to 60 seconds, keep 1080p near 30 seconds, and move 4K or longer work to desktop.";

const DEFAULT_WEBM_REALTIME_WARNING =
  "WebM records in real time. This export will take at least as long as the timer, and you must keep this tab in the foreground until the download starts.";

const DEFAULT_WEBM_AUDIO_UNAVAILABLE_ERROR =
  "This browser cannot record transparent WebM with audio. Turn Audio Cues off and retry.";

const DEFAULT_MP4_LABEL = "MP4 (green screen)";

const DEFAULT_MP4_DESCRIPTION =
  "MP4 with a solid green background. Works in CapCut, InShot and other phone editors — use Chroma Key to remove the green.";

const DEFAULT_MP4_UNAVAILABLE_MESSAGE =
  "MP4 export is not available in this browser.";

const fieldClassName =
  "mt-2 h-10 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-tertiary";

type FormatOptionProps = {
  active: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  unavailableReason?: string;
  onSelect: () => void;
};

function FormatOption({
  active,
  disabled,
  icon,
  label,
  description,
  unavailableReason,
  onSelect,
}: FormatOptionProps) {
  return (
    <label
      className={`flex items-start gap-3 border px-3 py-3 text-sm transition-colors ${
        active
          ? "border-primary/70 bg-primary/5"
          : "border-border/80 bg-background/65"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <input
        checked={active}
        disabled={disabled}
        name="format"
        onChange={onSelect}
        type="radio"
      />
      <span className="flex-1">
        <span className="flex items-center gap-2 font-medium text-foreground">
          {icon}
          {label}
        </span>
        <span className="mt-1 block text-muted-foreground">{description}</span>
        {disabled && unavailableReason ? (
          <span className="mt-1 block text-[11px] text-destructive">
            {unavailableReason}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function ExportPanel({
  settings,
  advisory,
  ui,
  exportProgress,
  isExporting,
  onExport,
  onCancel,
  onFormatChange,
  onFpsChange,
  onQualityChange,
  support,
  etaMs = null,
  previewBitmap = null,
  isMobile = false,
}: ExportPanelProps) {
  const advisoryClassName =
    advisory.severity === "error"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : advisory.severity === "warning"
        ? "border-secondary/35 bg-secondary/10 text-foreground"
        : "border-tertiary/30 bg-tertiary/8 text-foreground";

  const advisoryMessage =
    advisory.code === "workerSupportError"
      ? ui.advisoryMessages.workerSupportError
      : advisory.code === "webmUnavailableError"
        ? ui.advisoryMessages.webmUnavailableError
        : advisory.code === "webmAudioUnavailableError"
          ? (ui.advisoryMessages.webmAudioUnavailableError ??
            DEFAULT_WEBM_AUDIO_UNAVAILABLE_ERROR)
        : advisory.code === "vp9AlphaUnavailableError"
          ? ui.advisoryMessages.vp9AlphaUnavailableError
          : advisory.code === "hevcAlphaUnavailableError"
            ? ui.advisoryMessages.hevcAlphaUnavailableError
            : advisory.code === "mobileExportLimitError"
              ? (ui.advisoryMessages.mobileExportLimitError ??
                DEFAULT_MOBILE_EXPORT_LIMIT_ERROR)
              : advisory.code === "webmRealtimeWarning"
                ? (ui.advisoryMessages.webmRealtimeWarning ??
                  DEFAULT_WEBM_REALTIME_WARNING)
            : advisory.code === "heavyExportWarning"
              ? ui.advisoryMessages.heavyExportWarning
              : advisory.code === "pngSequenceInfo"
                ? ui.advisoryMessages.pngSequenceInfo
                : advisory.code === "vp9AlphaInfo"
                  ? ui.advisoryMessages.vp9AlphaInfo
                  : advisory.code === "hevcAlphaInfo"
                    ? ui.advisoryMessages.hevcAlphaInfo
                    : null;

  const vp9AlphaDisabled = advisory.disabledFormats.includes("webm-vp9-alpha");
  const hevcAlphaDisabled = advisory.disabledFormats.includes("mov-hevc-alpha");

  return (
    <section className="cyber-panel cyber-chamfer overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{ui.title}</span>
        <span className="text-primary">{ui.subtitle}</span>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.outputFormatTitle}
          </p>
          <div className="mt-4 grid gap-3">
            <FormatOption
              active={settings.export.format === "png-sequence"}
              disabled={!support.supportsPngSequence}
              icon={<FileStack className="size-4 text-primary" />}
              label={ui.pngSequenceLabel}
              description={ui.pngSequenceDescription}
              onSelect={() => onFormatChange("png-sequence")}
            />

            <FormatOption
              active={settings.export.format === "webm"}
              disabled={advisory.disabledFormats.includes("webm")}
              icon={<Film className="size-4 text-tertiary" />}
              label={ui.webmLabel}
              description={ui.webmDescription}
              unavailableReason={ui.advisoryMessages.webmUnavailableError}
              onSelect={() => onFormatChange("webm")}
            />

            {support.supportsMp4 === true ? (
              <FormatOption
                active={settings.export.format === "mp4"}
                disabled={advisory.disabledFormats.includes("mp4")}
                icon={<Clapperboard className="size-4 text-primary" />}
                label={ui.mp4Label ?? DEFAULT_MP4_LABEL}
                description={ui.mp4Description ?? DEFAULT_MP4_DESCRIPTION}
                unavailableReason={DEFAULT_MP4_UNAVAILABLE_MESSAGE}
                onSelect={() => onFormatChange("mp4")}
              />
            ) : null}

            {support.supportsVp9Alpha === true ? (
              <FormatOption
                active={settings.export.format === "webm-vp9-alpha"}
                disabled={vp9AlphaDisabled}
                icon={<Sparkles className="size-4 text-secondary" />}
                label={ui.vp9AlphaLabel}
                description={ui.vp9AlphaDescription}
                onSelect={() => onFormatChange("webm-vp9-alpha")}
              />
            ) : null}

            {support.supportsHevcAlpha === true ? (
              <FormatOption
                active={settings.export.format === "mov-hevc-alpha"}
                disabled={hevcAlphaDisabled}
                icon={<Sparkles className="size-4 text-secondary" />}
                label={ui.hevcAlphaLabel}
                description={ui.hevcAlphaDescription}
                onSelect={() => onFormatChange("mov-hevc-alpha")}
              />
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            {ui.fpsLabel}
            <select
              className={fieldClassName}
              onChange={(event) => onFpsChange(Number(event.target.value))}
              value={settings.export.fps}
            >
              <option value={24}>{ui.fpsOptions[24]}</option>
              <option value={30}>{ui.fpsOptions[30]}</option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-foreground">
            {ui.qualityLabel}
            <select
              className={fieldClassName}
              onChange={(event) =>
                onQualityChange(event.target.value as ExportQualityPreset)
              }
              value={settings.export.quality}
            >
              <option value="standard">{ui.qualityOptions.standard}</option>
              <option value="high">{ui.qualityOptions.high}</option>
            </select>
          </label>
        </div>

        <div className={`rounded-none border px-4 py-4 ${advisoryClassName}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
            {ui.launchNoteTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {advisoryMessage ?? ui.launchNoteFallback}
          </p>
        </div>

        {isMobile && !isExporting ? (
          <div className="flex items-start gap-2 rounded-none border border-secondary/35 bg-secondary/10 px-4 py-3 text-[12px] leading-5 text-foreground">
            <MonitorSmartphone className="mt-0.5 size-4 shrink-0 text-secondary" />
            <span>{ui.progress?.desktopNote ?? DEFAULT_DESKTOP_NOTE}</span>
          </div>
        ) : null}

        {isExporting ? (
          <Button
            className="h-11 w-full justify-between rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
            disabled={!onCancel}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            <span>{ui.cancelButton ?? "Cancel export"}</span>
            <X className="size-4" />
          </Button>
        ) : (
          <Button
            className="h-11 w-full justify-between rounded-none font-mono text-[11px] uppercase tracking-[0.28em]"
            disabled={advisory.severity === "error"}
            onClick={onExport}
            type="button"
          >
            <span>{ui.exportButtonIdle}</span>
            <Download className="size-4" />
          </Button>
        )}

        <ExportProgressView
          exportProgress={exportProgress}
          isExporting={isExporting}
          etaMs={etaMs}
          previewBitmap={previewBitmap}
          statusTitle={ui.exportStatusTitle}
          idleMessage={ui.exportStatusIdle}
          progressCopy={ui.progress}
        />
      </div>
    </section>
  );
}
