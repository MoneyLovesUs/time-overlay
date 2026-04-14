/// <reference lib="webworker" />

import { zipSync } from "fflate";

import {
  createExportJobPlan,
  getExportProgressMessage,
  type ExportWorkerMessage,
  type ExportWorkerRequest,
} from "@/lib/generator/export/job";
import {
  createRenderFrameState,
  measureRenderTextBox,
  renderFrameToCanvas,
} from "@/lib/generator/render-frame";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";

function postMessageToHost(message: ExportWorkerMessage) {
  self.postMessage(message);
}

self.onmessage = async (event: MessageEvent<ExportWorkerRequest>) => {
  if (event.data.kind !== "export-png-sequence") {
    return;
  }

  const { settings } = event.data.payload;
  const plan = createExportJobPlan({
    durationSeconds: settings.timer.durationSeconds,
    fps: settings.export.fps,
    format: "png-sequence",
  });

  try {
    const canvas = new OffscreenCanvas(settings.canvas.width, settings.canvas.height);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create an offscreen canvas context.");
    }

    const zipEntries: Record<string, Uint8Array> = {};

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

      const blob = await canvas.convertToBlob({ type: "image/png" });
      const arrayBuffer = await blob.arrayBuffer();

      zipEntries[plan.getFrameFileName(frameIndex)] = new Uint8Array(arrayBuffer);

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
            message: getExportProgressMessage(frameIndex + 1, plan.totalFrames),
          },
        });
      }
    }

    postMessageToHost({
      kind: "progress",
      payload: {
        stage: "packaging",
        completedFrames: plan.totalFrames,
        totalFrames: plan.totalFrames,
        message: "Packaging PNG sequence archive",
      },
    });

    const archive = zipSync(zipEntries, { level: 0 });
    const archiveBytes = new Uint8Array(archive.byteLength);

    archiveBytes.set(archive);

    const blob = new Blob([archiveBytes.buffer], { type: "application/zip" });

    postMessageToHost({
      kind: "complete",
      payload: {
        blob,
        fileName: plan.outputFileName,
        mimeType: "application/zip",
      },
    });
  } catch (error) {
    postMessageToHost({
      kind: "error",
      payload: {
        message:
          error instanceof Error
            ? error.message
            : "PNG sequence export failed unexpectedly.",
      },
    });
  }
};
