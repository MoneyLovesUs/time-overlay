import { Download, FileWarning, FolderOpen, HardDriveDownload, Loader2 } from "lucide-react";

import type { PngExportCopy } from "@/content/root/types";
import type {
  PngOutputMode,
  PngPartDescriptor,
  PngPreflightResult,
} from "@/lib/generator/export/png-contract";
import { formatPngBytes } from "@/lib/generator/export/png-limits";
import type { PngPlatformAdvice } from "@/lib/generator/export/png-limits";

const panelClassName =
  "cyber-panel cyber-chamfer border border-border/70 bg-background/95 px-5 py-5 text-foreground shadow-2xl";

export type PngPrepViewState = {
  durationSeconds: number;
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  preflight: PngPreflightResult | null;
  advice: PngPlatformAdvice | null;
  isLongJob: boolean;
  canDirectory: boolean;
  opfsWritable: boolean;
  checkpointAvailable: boolean;
  lockAvailable: boolean;
  memoryAllowed: boolean;
};

function formatElapsed(ms: number | null): string | null {
  if (ms === null || !Number.isFinite(ms) || ms <= 0) {
    return null;
  }
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
}

function storageLabel(copy: PngExportCopy, mode: PngOutputMode): string {
  if (mode === "directory") {
    return copy.modeDirectory;
  }
  return mode === "opfs" ? copy.modeBrowserStorage : copy.modeMemory;
}

function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function PngPrepareDialog({
  open,
  copy,
  state,
  isResuming,
  busy,
  error,
  onChooseFolder,
  onUseOpfs,
  onContinueMemory,
  onCancel,
}: {
  open: boolean;
  copy: PngExportCopy;
  state: PngPrepViewState;
  isResuming: boolean;
  busy: boolean;
  error: string | null;
  onChooseFolder: () => void;
  onUseOpfs: () => void;
  onContinueMemory: () => void;
  onCancel: () => void;
}) {
  if (!open) {
    return null;
  }

  const { preflight } = state;
  const diskCapable =
    state.checkpointAvailable &&
    state.lockAvailable &&
    (state.canDirectory || state.opfsWritable);
  const longBlocked = state.isLongJob && !diskCapable;
  const noSafeDestination =
    !state.isLongJob &&
    !state.memoryAllowed &&
    !diskCapable;
  const estimateText = preflight
    ? preflight.estimatedArchiveBytes === null
      ? copy.estimateUnknown
      : fill(copy.estimateTemplate, {
          size: formatPngBytes(preflight.estimatedArchiveBytes),
          parts: preflight.estimatedParts ?? 1,
          time: formatElapsed(preflight.estimatedElapsedMs) ?? "?",
        })
    : null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      role="dialog"
    >
      <div className={`${panelClassName} max-h-full w-full max-w-2xl overflow-y-auto`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-3">
          <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-primary">
            {copy.prepareTitle}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {isResuming ? copy.restoreButton : copy.runTitle}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {copy.prepareIntro}
        </p>

        <p className="mt-3 font-mono text-[12px] leading-6 text-foreground">
          {fill(copy.prepareSummaryTemplate, {
            duration: state.durationSeconds,
            fps: state.fps,
            frames: state.totalFrames,
            width: state.width,
            height: state.height,
          })}
        </p>

        {state.preflight ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {estimateText}
          </p>
        ) : (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {copy.sampleProgress}
          </p>
        )}

        {state.advice === "desktopSafari" ? (
          <div className="mt-3 flex items-start gap-2 border border-secondary/40 bg-secondary/10 px-3 py-2 text-[13px] leading-5">
            <FileWarning className="mt-0.5 size-4 shrink-0 text-secondary" />
            <span>{copy.adviceDesktopSafari}</span>
          </div>
        ) : null}
        {state.advice === "mobile" ? (
          <div className="mt-3 flex items-start gap-2 border border-secondary/40 bg-secondary/10 px-3 py-2 text-[13px] leading-5">
            <FileWarning className="mt-0.5 size-4 shrink-0 text-secondary" />
            <span>{copy.adviceMobile}</span>
          </div>
        ) : null}

        {state.isLongJob ? (
          <div className="mt-3 border border-border/70 bg-background/60 px-3 py-3 text-[13px] leading-5">
            <p className="font-medium text-foreground">{copy.longJobTitle}</p>
            <p className="mt-1 text-muted-foreground">{copy.longJobBody}</p>
          </div>
        ) : null}

        {longBlocked || noSafeDestination ? (
          <p className="mt-3 text-sm leading-6 text-destructive">
            {state.canDirectory || state.opfsWritable
              ? copy.capabilityMissing
              : state.isLongJob
                ? copy.longStorageMissing
                : copy.capabilityMissing}
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 text-sm leading-6 text-destructive">{error}</p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {state.canDirectory && diskCapable ? (
            <button
              className="flex min-h-12 items-center justify-between gap-2 border border-primary/60 bg-primary/10 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary disabled:opacity-50"
              disabled={busy || !state.preflight}
              onClick={onChooseFolder}
              type="button"
            >
              <span className="text-left">{copy.saveFolderButton}</span>
              <FolderOpen className="size-4" />
            </button>
          ) : null}
          {state.opfsWritable && diskCapable ? (
            <button
              className="flex min-h-12 items-center justify-between gap-2 border border-tertiary/50 bg-tertiary/10 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary disabled:opacity-50"
              disabled={busy || !state.preflight}
              onClick={onUseOpfs}
              type="button"
            >
              <span className="text-left">{copy.opfsButton}</span>
              <HardDriveDownload className="size-4" />
            </button>
          ) : null}
          {!state.isLongJob && state.memoryAllowed ? (
            <button
              className="flex min-h-12 items-center justify-between gap-2 border border-border/80 bg-background/70 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground disabled:opacity-50"
              disabled={busy || !state.preflight}
              onClick={onContinueMemory}
              type="button"
            >
              <span className="text-left">{copy.continueButton}</span>
              <Download className="size-4" />
            </button>
          ) : null}
        </div>

        <p className="mt-3 text-[12px] leading-5 text-muted-foreground">
          {state.canDirectory && diskCapable ? copy.saveFolderHint : null}
          {state.canDirectory && diskCapable && state.opfsWritable ? " " : null}
          {state.opfsWritable && diskCapable ? copy.opfsHint : null}
        </p>

        <button
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4"
          onClick={onCancel}
          type="button"
        >
          {copy.cancelPrepButton}
        </button>
      </div>
    </div>
  );
}

export function PngRunCard({
  copy,
  outputMode,
  totalFrames,
  processedFrames,
  committedFrames,
  partCount,
  currentPart,
  bytesWritten,
  cancelling,
}: {
  copy: PngExportCopy;
  outputMode: PngOutputMode;
  totalFrames: number;
  processedFrames: number;
  committedFrames: number;
  partCount: number;
  currentPart: number;
  bytesWritten: number;
  cancelling: boolean;
}) {
  return (
    <section className="border border-border/70 bg-background/50 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-tertiary">
          {cancelling ? copy.stoppingButton : copy.runTitle}
        </p>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          {storageLabel(copy, outputMode)}
        </span>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        <div>
          <dt>{copy.runFramesTemplate}</dt>
          <dd className="text-foreground">
            {processedFrames}/{totalFrames}
          </dd>
        </div>
        <div>
          <dt>{copy.runCommittedTemplate}</dt>
          <dd className="text-foreground">
            {committedFrames}/{totalFrames}
          </dd>
        </div>
        <div>
          <dt>{copy.runPartTemplate}</dt>
          <dd className="text-foreground">
            {currentPart} · {partCount}
          </dd>
        </div>
        <div>
          <dt>{copy.runBytesTemplate}</dt>
          <dd className="text-foreground">{formatPngBytes(bytesWritten)}</dd>
        </div>
      </dl>
    </section>
  );
}

export function PngRecoveryCard({
  copy,
  jobId,
  parts,
  committedFrames,
  totalFrames,
  outputMode,
  needsDirectorySelection,
  needsPermission,
  needsFont,
  busy,
  error,
  onRestore,
  onSelectFolder,
  onSelectFont,
  onRemoveRecord,
  onDownloadPart,
  cleanupAvailable,
  onCleanup,
}: {
  copy: PngExportCopy;
  jobId: string;
  parts: PngPartDescriptor[];
  committedFrames: number;
  totalFrames: number;
  outputMode: Exclude<PngOutputMode, "memory">;
  needsDirectorySelection: boolean;
  needsPermission: boolean;
  needsFont: boolean;
  busy: boolean;
  error: string | null;
  onRestore: () => void;
  onSelectFolder: () => void;
  onSelectFont: () => void;
  onRemoveRecord: () => void;
  onDownloadPart: (part: PngPartDescriptor) => void;
  cleanupAvailable: boolean;
  onCleanup: () => void;
}) {
  return (
    <section className="border border-tertiary/40 bg-tertiary/8 px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-tertiary">
          {copy.recoveryTitle}
        </p>
        <span className="font-mono text-[10px] text-muted-foreground">
          {storageLabel(copy, outputMode)}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-5 text-foreground">
        {fill(copy.recoveryBodyTemplate, {
          frames: committedFrames,
          total: totalFrames,
          parts: parts.length,
        })}
      </p>
      <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
        {jobId}
      </p>
      {parts.length > 0 ? (
        <ul className="mt-2 grid gap-1">
          {parts.map((part) => (
            <li
              className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground"
              key={part.fileName}
            >
              <span>
                {part.fileName} · {formatPngBytes(part.bytes)}
              </span>
              <button
                className="border border-primary/40 px-2 py-0.5 uppercase tracking-[0.16em] text-primary"
                onClick={() => onDownloadPart(part)}
                type="button"
              >
                {copy.partDownloadButton}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {needsFont ? (
        <p className="mt-2 text-[12px] text-secondary">{copy.fontRequired}</p>
      ) : null}
      {error ? (
        <p className="mt-2 text-[12px] leading-5 text-destructive">{error}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {needsDirectorySelection ? (
          <button
            className="border border-primary/60 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary"
            disabled={busy}
            onClick={onSelectFolder}
            type="button"
          >
            {copy.selectFolderButton}
          </button>
        ) : null}
        {needsFont ? (
          <button
            className="border border-secondary/50 bg-secondary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-secondary"
            disabled={busy}
            onClick={onSelectFont}
            type="button"
          >
            {copy.fontButton}
          </button>
        ) : null}
        {!needsDirectorySelection ? (
          <button
            className="border border-tertiary/50 bg-tertiary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary disabled:opacity-50"
            disabled={busy || needsFont}
            onClick={onRestore}
            type="button"
          >
            {needsPermission ? copy.authorizeButton : copy.restoreButton}
          </button>
        ) : null}
        <button
          className="px-2 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4"
          disabled={busy}
          onClick={onRemoveRecord}
          type="button"
        >
          {copy.removeRecordButton}
        </button>
        {cleanupAvailable ? (
          <button
            className="px-2 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4"
            disabled={busy}
            onClick={onCleanup}
            type="button"
          >
            {copy.cleanupButton}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export type PngResultView = {
  jobId: string;
  outputMode: PngOutputMode;
  parts: PngPartDescriptor[];
  totalFrames: number;
  totalBytes: number;
  outputDirectoryName?: string;
  autoDownloaded: boolean;
};

export function PngResultCard({
  copy,
  result,
  cleanupAvailable,
  error,
  onDownloadPart,
  onCleanup,
}: {
  copy: PngExportCopy;
  result: PngResultView;
  cleanupAvailable: boolean;
  error?: string | null;
  onDownloadPart: (part: PngPartDescriptor) => void;
  onCleanup: () => void;
}) {
  return (
    <section className="border border-primary/40 bg-primary/5 px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
        {copy.resultTitle}
      </p>
      {result.outputMode === "directory" ? (
        <>
          <p className="mt-2 break-all text-[13px] leading-5 text-foreground">
            {fill(copy.directorySavedTemplate, {
              folder: result.outputDirectoryName ?? result.jobId,
              parts: result.parts.length,
              frames: result.totalFrames,
              size: formatPngBytes(result.totalBytes),
            })}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
            {copy.openFolderHint}
          </p>
        </>
      ) : null}
      {result.outputMode === "opfs" ? (
        <div className="mt-2">
          <p className="text-[13px] leading-5 text-foreground">
            {fill(copy.opfsPartsTitle, {
              parts: result.parts.length,
              size: formatPngBytes(result.totalBytes),
            })}
          </p>
          <ul className="mt-2 grid gap-2">
            {result.parts.map((part) => (
              <li
                className="flex flex-wrap items-center justify-between gap-2 border border-border/70 bg-background/60 px-3 py-2"
                key={part.fileName}
              >
                <span className="font-mono text-[11px] text-foreground">
                  {part.fileName}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {fill(copy.partRangeTemplate, {
                    first: part.firstFrameIndex + 1,
                    last: part.nextFrameIndex,
                    size: formatPngBytes(part.bytes),
                  })}
                </span>
                <button
                  className="flex items-center gap-1 border border-primary/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-primary"
                  onClick={() => onDownloadPart(part)}
                  type="button"
                >
                  {copy.partDownloadButton}
                  <Download className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {result.autoDownloaded ? (
        <p className="mt-2 text-[12px] text-muted-foreground">
          {copy.autoDownloadNote}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-[12px] leading-5 text-destructive">{error}</p>
      ) : null}
      <div className="mt-3 border-t border-border/60 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
          {copy.mergeInstructionsTitle}
        </p>
        <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
          {copy.mergeInstructionsBody}
        </p>
      </div>
      {cleanupAvailable ? (
        <button
          className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4"
          onClick={onCleanup}
          type="button"
        >
          {copy.cleanupButton}
        </button>
      ) : null}
    </section>
  );
}
