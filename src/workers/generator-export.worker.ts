/// <reference lib="webworker" />

import { Zip, ZipPassThrough, strToU8 } from "fflate";

import { encodeAlphaVideo } from "@/lib/generator/encode/alpha-video-encoder";
import { synthesizeAudioCues } from "@/lib/generator/encode/audio-cues";
import {
  createExportJobPlan,
  type ExportWorkerMessage,
  type ExportWorkerRequest,
} from "@/lib/generator/export/job";
import {
  PRORES_BUNDLE_FILES,
  buildProResBundle,
} from "@/lib/generator/export/prores-bundle";
import { loadFontIntoWorker } from "@/lib/generator/font-loader";
import {
  createRenderFrameState,
  measureRenderTextBox,
  renderStyledFrame,
} from "@/lib/generator/render-frame";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";
import type { GeneratorSettings } from "@/lib/generator/types";

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

// Cadence for streaming progress back to the host. Posting every frame floods
// the message channel on long exports; throttling by wall-clock keeps the bar
// smooth (the host interpolates between updates) without the overhead.
const PROGRESS_INTERVAL_MS = 90;
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

type DrawFrameOptions = {
  context: OffscreenCanvasRenderingContext2D;
  settings: GeneratorSettings;
  frameIndex: number;
  fps: number;
};

function drawFrameToContext({
  context,
  settings,
  frameIndex,
  fps,
}: DrawFrameOptions) {
  const elapsedSeconds = frameIndex / fps;
  const displayText = formatCountdownTime(
    getRemainingDurationSeconds(settings.timer.durationSeconds, elapsedSeconds),
    settings.timer.displayFormat,
  );
  const textBox = measureRenderTextBox(context, displayText, {
    fontFamily: settings.textStyle.fontFamily,
    fontSize: settings.textStyle.fontSize,
    fontWeight: settings.textStyle.fontWeight,
    letterSpacing: settings.textStyle.letterSpacing,
    textColor: settings.textStyle.textColor,
    strokeWidth: settings.textStyle.strokeWidth,
    strokeColor: settings.textStyle.strokeColor,
    glowBlur: settings.textStyle.glowBlur,
    glowColor: settings.textStyle.glowColor,
    shadowBlur: settings.textStyle.shadowBlur,
    shadowColor: settings.textStyle.shadowColor,
    shadowOffsetX: settings.textStyle.shadowOffsetX,
    shadowOffsetY: settings.textStyle.shadowOffsetY,
  });
  const frameState = createRenderFrameState({
    settings,
    elapsedSeconds,
    textBox,
    safeAreaInset: 32,
  });

  renderStyledFrame(
    context,
    frameState,
    settings.themePresetId,
    settings.templateId,
  );
}

type PngSequenceRequest = Extract<ExportWorkerRequest, { kind: "export-png-sequence" }>;
type AlphaVideoRequest = Extract<ExportWorkerRequest, { kind: "export-alpha-video" }>;

async function handlePngSequence(request: PngSequenceRequest) {
  const { settings, uploadedFont, enablePreview = true } = request.payload;

  if (uploadedFont) {
    await loadFontIntoWorker(uploadedFont);
  }
  const plan = createExportJobPlan({
    durationSeconds: settings.timer.durationSeconds,
    fps: settings.export.fps,
    format: "png-sequence",
  });

  const canvas = new OffscreenCanvas(settings.canvas.width, settings.canvas.height);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create an offscreen canvas context.");
  }

  const chunks: BlobPart[] = [];
  let lastProgressAt = 0;
  let lastPreviewAt = 0;

  let zip!: Zip;
  let archiveError: unknown = null;
  const archivePromise = new Promise<Blob>((resolve, reject) => {
    zip = new Zip((error, chunk, final) => {
      if (error) {
        archiveError = error;
        reject(error);
        return;
      }
      // fflate emits ordinary ArrayBuffer-backed chunks in browsers. Narrowing
      // the generic buffer type here avoids an unnecessary copy solely for the
      // wider SharedArrayBuffer possibility in TypeScript's Uint8Array type.
      chunks.push(chunk as Uint8Array<ArrayBuffer>);
      if (final) {
        // Blob accepts the existing ZIP chunks directly. The old path first
        // allocated another full-size Uint8Array and copied the entire archive,
        // causing a deterministic peak-memory spike on Safari/mobile.
        resolve(new Blob(chunks, { type: "application/zip" }));
      }
    });
  });
  // Attach a rejection handler immediately: fflate can report an error while a
  // frame is being pushed, before control reaches the final await below.
  void archivePromise.catch(() => {});

  for (let frameIndex = 0; frameIndex < plan.totalFrames; frameIndex += 1) {
    drawFrameToContext({
      context,
      settings,
      frameIndex,
      fps: settings.export.fps,
    });

    const blob = await canvas.convertToBlob({ type: "image/png" });
    const arrayBuffer = await blob.arrayBuffer();
    const frameBytes = new Uint8Array(arrayBuffer);

    const entry = new ZipPassThrough(plan.getFrameFileName(frameIndex));
    zip.add(entry);
    entry.push(frameBytes, true);
    if (archiveError) {
      throw archiveError;
    }

    const now = performance.now();
    const isBoundaryFrame =
      frameIndex === 0 || frameIndex === plan.totalFrames - 1;

    if (isBoundaryFrame || now - lastProgressAt >= PROGRESS_INTERVAL_MS) {
      lastProgressAt = now;
      postMessageToHost({
        kind: "progress",
        payload: {
          stage: "rendering-frames",
          completedFrames: frameIndex + 1,
          totalFrames: plan.totalFrames,
          message: "",
        },
      });
    }

    if (
      enablePreview &&
      (isBoundaryFrame || now - lastPreviewAt >= PREVIEW_INTERVAL_MS)
    ) {
      lastPreviewAt = now;
      await emitPreview(canvas, frameIndex + 1);
    }
  }

  const bundle = buildProResBundle({
    fps: settings.export.fps,
    framePattern: "frame-%04d.png",
  });
  for (const file of PRORES_BUNDLE_FILES) {
    const entry = new ZipPassThrough(file);
    zip.add(entry);
    entry.push(strToU8(bundle[file]), true);
  }

  postMessageToHost({
    kind: "progress",
    payload: {
      stage: "packaging",
      completedFrames: plan.totalFrames,
      totalFrames: plan.totalFrames,
      message: "",
    },
  });

  zip.end();
  const archive = await archivePromise;
  if (archive.size === 0) {
    throw new Error("The PNG archive is empty.");
  }
  postMessageToHost({
    kind: "complete",
    payload: {
      blob: archive,
      fileName: plan.outputFileName,
      mimeType: "application/zip",
    },
  });
}

async function handleAlphaVideo(request: AlphaVideoRequest) {
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
      drawFrameToContext({
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

self.onmessage = async (event: MessageEvent<ExportWorkerRequest>) => {
  try {
    if (event.data.kind === "export-png-sequence") {
      await handlePngSequence(event.data);
      return;
    }

    if (event.data.kind === "export-alpha-video") {
      await handleAlphaVideo(event.data);
      return;
    }
  } catch (error) {
    const code =
      event.data.kind === "export-alpha-video"
        ? "alphaVideoFailedUnexpectedly"
        : "pngSequenceFailedUnexpectedly";
    postMessageToHost({
      kind: "error",
      payload: {
        code,
        message: error instanceof Error ? error.message : undefined,
      },
    });
  }
};
