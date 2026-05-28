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
import { drawWatermark } from "@/lib/generator/watermark";

function postMessageToHost(message: ExportWorkerMessage) {
  self.postMessage(message);
}

type DrawFrameOptions = {
  context: OffscreenCanvasRenderingContext2D;
  settings: GeneratorSettings;
  frameIndex: number;
  fps: number;
  applyWatermark: boolean;
};

function drawFrameToContext({
  context,
  settings,
  frameIndex,
  fps,
  applyWatermark,
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

  renderStyledFrame(context, frameState, settings.themePresetId);

  if (applyWatermark) {
    drawWatermark(context, {
      canvasWidth: settings.canvas.width,
      canvasHeight: settings.canvas.height,
    });
  }
}

type PngSequenceRequest = Extract<ExportWorkerRequest, { kind: "export-png-sequence" }>;
type AlphaVideoRequest = Extract<ExportWorkerRequest, { kind: "export-alpha-video" }>;

async function handlePngSequence(request: PngSequenceRequest) {
  const { settings, applyWatermark, includeProResBundle, uploadedFont } = request.payload;

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

  const chunks: Uint8Array[] = [];
  let totalSize = 0;

  const zip = new Zip((err, chunk, final) => {
    if (err) {
      throw err;
    }
    chunks.push(chunk);
    totalSize += chunk.byteLength;
    if (final) {
      const merged = new Uint8Array(totalSize);
      let offset = 0;
      for (const segment of chunks) {
        merged.set(segment, offset);
        offset += segment.byteLength;
      }
      postMessageToHost({
        kind: "complete",
        payload: {
          blob: new Blob([merged.buffer], { type: "application/zip" }),
          fileName: plan.outputFileName,
          mimeType: "application/zip",
        },
      });
    }
  });

  for (let frameIndex = 0; frameIndex < plan.totalFrames; frameIndex += 1) {
    drawFrameToContext({
      context,
      settings,
      frameIndex,
      fps: settings.export.fps,
      applyWatermark,
    });

    const blob = await canvas.convertToBlob({ type: "image/png" });
    const arrayBuffer = await blob.arrayBuffer();
    const frameBytes = new Uint8Array(arrayBuffer);

    const entry = new ZipPassThrough(plan.getFrameFileName(frameIndex));
    zip.add(entry);
    entry.push(frameBytes, true);

    if (
      frameIndex === 0 ||
      frameIndex === plan.totalFrames - 1 ||
      (frameIndex + 1) % 5 === 0
    ) {
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
  }

  if (includeProResBundle) {
    const bundle = buildProResBundle({
      fps: settings.export.fps,
      framePattern: "frame-%04d.png",
    });
    for (const file of PRORES_BUNDLE_FILES) {
      const entry = new ZipPassThrough(file);
      zip.add(entry);
      entry.push(strToU8(bundle[file]), true);
    }
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
}

async function handleAlphaVideo(request: AlphaVideoRequest) {
  const { settings, target, applyWatermark, uploadedFont } = request.payload;

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
      drawFrameToContext({
        context,
        settings,
        frameIndex,
        fps: settings.export.fps,
        applyWatermark,
      });
    },
    onProgress(progress) {
      postMessageToHost({
        kind: "progress",
        payload: progress,
      });
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
