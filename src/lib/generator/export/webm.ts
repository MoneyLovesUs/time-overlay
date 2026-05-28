import type { ExportProgressState, GeneratorSettings } from "@/lib/generator/types";
import { synthesizeAudioCues } from "@/lib/generator/encode/audio-cues";
import { createExportJobPlan } from "@/lib/generator/export/job";
import { getPreferredAlphaWebmMimeType } from "@/lib/generator/feature-detection";
import {
  createRenderFrameState,
  measureRenderTextBox,
  renderStyledFrame,
} from "@/lib/generator/render-frame";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";
import { drawWatermark } from "@/lib/generator/watermark";

type WebmExportOptions = {
  applyWatermark: boolean;
  onProgress: (progress: ExportProgressState) => void;
};

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

/**
 * WebM export stays on the main thread because MediaRecorder and captureStream
 * are document-level APIs. The codec is forced to VP8 because Chromium's VP9
 * MediaRecorder pipeline does not currently emit alpha side data, while VP8
 * preserves the canvas alpha channel end-to-end. Editors (Premiere, DaVinci,
 * CapCut) import the result as transparent footage with no further conversion.
 */
export async function exportWebmLocally(
  settings: GeneratorSettings,
  { applyWatermark, onProgress }: WebmExportOptions,
) {
  const mimeType = getPreferredAlphaWebmMimeType();

  if (!mimeType) {
    throw new Error("This browser does not support WebM export.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = settings.canvas.width;
  canvas.height = settings.canvas.height;

  const context = canvas.getContext("2d", { alpha: true });

  if (!context) {
    throw new Error("Could not create a canvas context for WebM export.");
  }

  if (typeof canvas.captureStream !== "function") {
    throw new Error("Canvas stream capture is unavailable in this browser.");
  }

  const stream = canvas.captureStream(settings.export.fps);

  const audioBuffer = await synthesizeAudioCues({
    durationSeconds: settings.timer.durationSeconds,
    variant: settings.audio.variant,
  });
  let audioContext: AudioContext | null = null;
  let audioSourceNode: AudioBufferSourceNode | null = null;
  if (audioBuffer && typeof AudioContext !== "undefined") {
    try {
      audioContext = new AudioContext({ sampleRate: audioBuffer.sampleRate });
      const destination = audioContext.createMediaStreamDestination();
      audioSourceNode = audioContext.createBufferSource();
      audioSourceNode.buffer = audioBuffer;
      audioSourceNode.connect(destination);
      for (const track of destination.stream.getAudioTracks()) {
        stream.addTrack(track);
      }
    } catch {
      audioContext?.close().catch(() => {});
      audioContext = null;
      audioSourceNode = null;
    }
  }

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
  if (audioSourceNode) {
    audioSourceNode.start(0);
  }

  for (let frameIndex = 0; frameIndex < plan.totalFrames; frameIndex += 1) {
    const elapsedSeconds = frameIndex / settings.export.fps;
    const displayText = formatCountdownTime(
      getRemainingDurationSeconds(settings.timer.durationSeconds, elapsedSeconds),
      settings.timer.displayFormat,
    );
    const textBox = measureRenderTextBox(context, displayText, {
      fontFamily: settings.textStyle.fontFamily,
      customFontFamily: settings.textStyle.customFontFamily,
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
  audioSourceNode?.stop();

  const blob = await blobPromise;

  stream.getTracks().forEach((track) => track.stop());
  audioContext?.close().catch(() => {});

  return {
    blob,
    fileName: plan.outputFileName,
    mimeType,
  };
}
