/// <reference lib="webworker" />

import { encodeAlphaVideo } from "@/lib/generator/encode/alpha-video-encoder";
import { synthesizeAudioCues } from "@/lib/generator/encode/audio-cues";
import {
  encodeMp4Video,
  resolveMp4FrameBackground,
} from "@/lib/generator/encode/mp4-encoder";
import {
  estimateMp4Bytes,
  MP4_IN_MEMORY_BUDGET_BYTES,
} from "@/lib/generator/encode/mp4-budget";
import {
  createMemoryMp4Sink,
  createOpfsMp4Sink,
  Mp4SinkError,
  type Mp4Sink,
} from "@/lib/generator/encode/mp4-sink";
import {
  createExportJobPlan,
  type ExportWorkerMessage,
  type ExportWorkerRequest,
} from "@/lib/generator/export/job";
import { drawExportFrame } from "@/lib/generator/export/frame-drawer";
import type { PngPartDescriptor } from "@/lib/generator/export/png-contract";
import { PngExportError } from "@/lib/generator/export/png-error";
import {
  type PngEngineContext,
  runPngExport,
  runPngPreflight,
} from "@/lib/generator/export/png-engine";
import { ensureExportFontsLoaded } from "@/lib/generator/export/font-assets";
import { loadFontIntoWorker } from "@/lib/generator/font-loader";

function postMessageToHost(
  message: ExportWorkerMessage,
  transfer?: Transferable[],
) {
  if (transfer && transfer.length > 0) {
    self.postMessage(message, transfer);
    return;
  }
  self.postMessage(message);
}

// Live preview snapshots are heavier (createImageBitmap + structured transfer),
// so they run on a slower beat than the numeric progress.
const PREVIEW_INTERVAL_MS = 250;
const PREVIEW_MAX_WIDTH = 320;

const canCreateImageBitmap = typeof createImageBitmap === "function";

/**
 * Post a downscaled snapshot of the current canvas as a transferable bitmap.
 * Best-effort: any failure (unsupported API, detached canvas) is swallowed so a
 * preview hiccup can never abort the export itself.
 */
async function emitPreview(canvas: OffscreenCanvas, frameIndex: number) {
  if (!canCreateImageBitmap || canvas.width === 0 || canvas.height === 0) {
    return;
  }
  try {
    const scale = Math.min(1, PREVIEW_MAX_WIDTH / canvas.width);
    const bitmap = await createImageBitmap(canvas, {
      resizeWidth: Math.max(1, Math.round(canvas.width * scale)),
      resizeHeight: Math.max(1, Math.round(canvas.height * scale)),
      resizeQuality: "low",
    });
    postMessageToHost({ kind: "preview", payload: { bitmap, frameIndex } }, [
      bitmap,
    ]);
  } catch {
    // Preview is decorative; ignore.
  }
}

type AlphaVideoRequest = Extract<
  ExportWorkerRequest,
  { kind: "export-alpha-video" }
>;
type Mp4Request = Extract<ExportWorkerRequest, { kind: "export-mp4" }>;
type PngPreflightRequest = Extract<
  ExportWorkerRequest,
  { kind: "png-preflight" }
>;
type PngStartRequest = Extract<
  ExportWorkerRequest,
  { kind: "png-start" | "png-resume" }
>;

type ActivePngRun = {
  jobId: string;
  attemptId: string;
  cancelled: boolean;
  previewPending: boolean;
};

let activePng: ActivePngRun | null = null;

/**
 * PNG commands run one at a time. Video exports keep their existing handlers,
 * and the chain also prevents a second export from starting while a PNG job is
 * still encoding. Cancel and preview-ack bypass the chain because they must act
 * on the run that is already in flight.
 */
let commandChain: Promise<void> = Promise.resolve();

function enqueueCommand(run: () => Promise<void>) {
  commandChain = commandChain.then(run, run).catch(() => undefined);
}

function postPngError(
  jobId: string,
  attemptId: string,
  error: unknown,
  committedParts: PngPartDescriptor[] = [],
) {
  const pngError =
    error instanceof PngExportError
      ? error
      : new PngExportError(
          "pngFailedUnexpectedly",
          error instanceof Error
            ? error.message
            : "The PNG export failed unexpectedly.",
        );
  postMessageToHost({
    kind: "png-error",
    jobId,
    attemptId,
    payload: {
      errorCode: pngError.code,
      recoverable: pngError.recoverable && committedParts.length > 0,
      committedParts,
      message: pngError.message,
    },
  });
}

function createPngContext(jobId: string, attemptId: string): PngEngineContext {
  return {
    jobId,
    attemptId,
    post: postMessageToHost,
    isCancelled: () => activePng?.cancelled === true,
    isPreviewAllowed: () =>
      activePng !== null && !activePng.previewPending,
    onPreviewPosted: () => {
      if (activePng) {
        activePng.previewPending = true;
      }
    },
  };
}

async function handlePngPreflight(request: PngPreflightRequest) {
  await ensureExportFontsLoaded();
  if (activePng) {
    postPngError(
      request.jobId,
      request.attemptId,
      new PngExportError(
        "pngLocked",
        "Another PNG export is already running in this tab.",
      ),
    );
    return;
  }
  activePng = {
    jobId: request.jobId,
    attemptId: request.attemptId,
    cancelled: false,
    previewPending: false,
  };
  try {
    await runPngPreflight(
      createPngContext(request.jobId, request.attemptId),
      request.payload,
    );
  } catch (error) {
    postPngError(request.jobId, request.attemptId, error);
  } finally {
    activePng = null;
  }
}

async function handlePngExport(request: PngStartRequest, resume: boolean) {
  await ensureExportFontsLoaded();
  const { jobId, attemptId } = request.payload;
  if (activePng) {
    postPngError(
      jobId,
      attemptId,
      new PngExportError(
        "pngLocked",
        "Another PNG export is already running in this tab.",
      ),
    );
    return;
  }
  activePng = {
    jobId,
    attemptId,
    cancelled: false,
    previewPending: false,
  };
  try {
    await runPngExport(createPngContext(jobId, attemptId), request.payload, resume);
  } catch (error) {
    postPngError(jobId, attemptId, error);
  } finally {
    activePng = null;
  }
}

async function handleAlphaVideo(request: AlphaVideoRequest) {
  await ensureExportFontsLoaded();
  const { settings, target, uploadedFont, enablePreview = true } = request.payload;

  if (uploadedFont) {
    await loadFontIntoWorker(uploadedFont);
  }

  const audioBuffer = await synthesizeAudioCues({
    durationSeconds: settings.timer.durationSeconds,
    variant: settings.audio.variant,
  });
  const plan = createExportJobPlan({
    durationSeconds: settings.timer.durationSeconds,
    fps: settings.export.fps,
    format: target === "webm-vp9" ? "webm-vp9-alpha" : "mov-hevc-alpha",
  });

  const baseBitrate = settings.export.quality === "high" ? 12_000_000 : 6_000_000;

  let previewCanvas: OffscreenCanvas | null = null;
  let lastPreviewAt = 0;

  const result = await encodeAlphaVideo({
    target,
    width: settings.canvas.width,
    height: settings.canvas.height,
    fps: settings.export.fps,
    totalFrames: plan.totalFrames,
    bitrate: baseBitrate,
    audioBuffer,
    drawFrame(canvas, frameIndex) {
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not create encoder canvas context.");
      }
      previewCanvas = canvas;
      drawExportFrame({
        context,
        settings,
        frameIndex,
        fps: settings.export.fps,
      });
    },
    onProgress(progress) {
      postMessageToHost({
        kind: "progress",
        payload: progress,
      });
      const now = performance.now();
      if (
        enablePreview &&
        previewCanvas &&
        now - lastPreviewAt >= PREVIEW_INTERVAL_MS
      ) {
        lastPreviewAt = now;
        void emitPreview(previewCanvas, progress.completedFrames);
      }
    },
  });

  postMessageToHost({
    kind: "complete",
    payload: {
      blob: result.blob,
      fileName: plan.outputFileName,
      mimeType: result.mimeType,
    },
  });
}

/**
 * Exports that fit the original in-memory budget keep that proven path. Longer
 * ones stream to OPFS; if OPFS is unavailable, desktop falls back to memory
 * while phones fail fast instead of risking an out-of-memory tab crash.
 */
async function openMp4Sink(
  estimatedBytes: number,
  allowInMemoryFallback: boolean,
): Promise<Mp4Sink> {
  if (estimatedBytes <= MP4_IN_MEMORY_BUDGET_BYTES) {
    return createMemoryMp4Sink();
  }
  try {
    return await createOpfsMp4Sink(estimatedBytes);
  } catch (error) {
    if (
      allowInMemoryFallback &&
      error instanceof Mp4SinkError &&
      error.code === "mp4StorageUnavailable"
    ) {
      return createMemoryMp4Sink();
    }
    throw error;
  }
}

async function handleMp4Export(request: Mp4Request) {
  await ensureExportFontsLoaded();
  const {
    settings,
    uploadedFont,
    enablePreview = true,
    allowInMemoryFallback = true,
  } = request.payload;

  if (uploadedFont) {
    await loadFontIntoWorker(uploadedFont);
  }

  const audioCues = {
    durationSeconds: settings.timer.durationSeconds,
    variant: settings.audio.variant,
  };
  const sink = await openMp4Sink(
    estimateMp4Bytes({
      quality: settings.export.quality,
      durationSeconds: settings.timer.durationSeconds,
      hasAudio: settings.audio.variant !== "none",
    }),
    allowInMemoryFallback,
  );
  const plan = createExportJobPlan({
    durationSeconds: settings.timer.durationSeconds,
    fps: settings.export.fps,
    format: "mp4",
  });

  let previewCanvas: OffscreenCanvas | null = null;
  let lastPreviewAt = 0;

  const result = await encodeMp4Video({
    width: settings.canvas.width,
    height: settings.canvas.height,
    fps: settings.export.fps,
    totalFrames: plan.totalFrames,
    durationSeconds: settings.timer.durationSeconds,
    quality: settings.export.quality,
    audioCues,
    sink,
    drawFrame(canvas, frameIndex) {
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not create encoder canvas context.");
      }
      // MP4 has no alpha channel: composite the timer over the chroma-key
      // green (or the user's solid color) before drawing the frame.
      context.fillStyle = resolveMp4FrameBackground(settings.canvas);
      context.fillRect(0, 0, canvas.width, canvas.height);
      previewCanvas = canvas;
      drawExportFrame({
        context,
        settings,
        frameIndex,
        fps: settings.export.fps,
      });
    },
    onProgress(progress) {
      postMessageToHost({
        kind: "progress",
        payload: progress,
      });
      const now = performance.now();
      if (
        enablePreview &&
        previewCanvas &&
        now - lastPreviewAt >= PREVIEW_INTERVAL_MS
      ) {
        lastPreviewAt = now;
        void emitPreview(previewCanvas, progress.completedFrames);
      }
    },
  });

  postMessageToHost({
    kind: "complete",
    payload: {
      blob: result.blob,
      fileName: plan.outputFileName,
      mimeType: result.mimeType,
    },
  });
}

function postVideoError(error: unknown, kind: ExportWorkerRequest["kind"]) {
  const code =
    error instanceof Mp4SinkError
      ? error.code
      : kind === "export-mp4"
        ? "mp4FailedUnexpectedly"
        : "alphaVideoFailedUnexpectedly";
  postMessageToHost({
    kind: "error",
    payload: {
      code,
      message: error instanceof Error ? error.message : undefined,
    },
  });
}

async function runVideoExport(request: Mp4Request | AlphaVideoRequest) {
  try {
    if (request.kind === "export-mp4") {
      await handleMp4Export(request);
    } else {
      await handleAlphaVideo(request);
    }
  } catch (error) {
    postVideoError(error, request.kind);
  }
}

const workerHost = self as unknown as {
  onmessage: ((event: MessageEvent<ExportWorkerRequest>) => void) | null;
};

workerHost.onmessage = (event: MessageEvent<ExportWorkerRequest>) => {
  const request = event.data;

  if (request.kind === "cancel-png") {
    if (
      activePng?.jobId === request.jobId &&
      activePng.attemptId === request.attemptId
    ) {
      activePng.cancelled = true;
    }
    return;
  }

  if (request.kind === "png-preview-ack") {
    if (
      activePng?.jobId === request.jobId &&
      activePng.attemptId === request.attemptId
    ) {
      activePng.previewPending = false;
    }
    return;
  }

  if (request.kind === "png-preflight") {
    enqueueCommand(() => handlePngPreflight(request));
    return;
  }

  if (request.kind === "png-start" || request.kind === "png-resume") {
    enqueueCommand(() => handlePngExport(request, request.kind === "png-resume"));
    return;
  }

  enqueueCommand(() => runVideoExport(request));
};
