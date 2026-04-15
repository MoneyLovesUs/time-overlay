import type { ExportProgressState, GeneratorSettings } from "@/lib/generator/types";
import { createExportJobPlan } from "@/lib/generator/export/job";
import { getPreferredWebmMimeType } from "@/lib/generator/feature-detection";
import {
  createRenderFrameState,
  measureRenderTextBox,
  renderFrameToCanvas,
} from "@/lib/generator/render-frame";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";

type WebmExportOptions = {
  onProgress: (progress: ExportProgressState) => void;
};

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

/**
 * WebM export intentionally stays on the main thread because MediaRecorder and
 * captureStream are browser APIs designed for document contexts. PNG sequence
 * remains the heavy worker-based path; WebM is the convenience path when the
 * browser supports it.
 */
export async function exportWebmLocally(
  settings: GeneratorSettings,
  { onProgress }: WebmExportOptions,
) {
  const mimeType = getPreferredWebmMimeType();

  if (!mimeType) {
    throw new Error("This browser does not support WebM export.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = settings.canvas.width;
  canvas.height = settings.canvas.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a canvas context for WebM export.");
  }

  if (typeof canvas.captureStream !== "function") {
    throw new Error("Canvas stream capture is unavailable in this browser.");
  }

  const stream = canvas.captureStream(settings.export.fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: settings.export.quality === "high" ? 8_000_000 : 4_000_000,
  });
  const plan = createExportJobPlan({
    durationSeconds: settings.timer.durationSeconds,
    fps: settings.export.fps,
    format: "webm",
  });
  const chunks: BlobPart[] = [];
  const frameDelayMs = 1000 / settings.export.fps;

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const blobPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => {
      reject(new Error("MediaRecorder failed while exporting WebM."));
    };
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
  });

  recorder.start();

  for (let frameIndex = 0; frameIndex < plan.totalFrames; frameIndex += 1) {
    const elapsedSeconds = frameIndex / settings.export.fps;
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

    renderFrameToCanvas(context, frameState);

    if (
      frameIndex === 0 ||
      frameIndex === plan.totalFrames - 1 ||
      (frameIndex + 1) % 5 === 0
    ) {
      onProgress({
        stage: "encoding",
        completedFrames: frameIndex + 1,
        totalFrames: plan.totalFrames,
        message: "",
      });
    }

    await wait(frameDelayMs);
  }

  await wait(frameDelayMs);
  recorder.stop();

  const blob = await blobPromise;

  stream.getTracks().forEach((track) => track.stop());

  return {
    blob,
    fileName: plan.outputFileName,
    mimeType,
  };
}
