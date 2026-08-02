import type { ExportProgressState, GeneratorSettings } from "@/lib/generator/types";
import { synthesizeAudioCues } from "@/lib/generator/encode/audio-cues";
import { createExportJobPlan } from "@/lib/generator/export/job";
import { getPreferredAlphaWebmMimeType } from "@/lib/generator/export/webm-mime";
import { runWebmTimeline } from "@/lib/generator/export/webm-timeline";
import {
  createRenderFrameState,
  measureRenderTextBox,
  renderStyledFrame,
} from "@/lib/generator/render-frame";
import { formatCountdownTime, getRemainingDurationSeconds } from "@/lib/generator/time";

export type WebmExportErrorCode =
  | "exportCancelled"
  | "webmAudioUnsupported"
  | "webmBackgrounded"
  | "webmOutputEmpty"
  | "webmRecorderFailed"
  | "webmUnavailable";

export class WebmExportError extends Error {
  readonly code: WebmExportErrorCode;

  constructor(code: WebmExportErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "WebmExportError";
    this.code = code;
  }
}

type WebmExportOptions = {
  onProgress: (progress: ExportProgressState) => void;
  signal?: AbortSignal;
};

function createAbortError(): WebmExportError {
  return new WebmExportError("exportCancelled", "Export cancelled.");
}

function stopMediaRecorder(recorder: MediaRecorder | null) {
  if (recorder?.state !== "inactive") {
    try {
      recorder?.stop();
    } catch {
      // Best-effort cleanup after a recorder failure.
    }
  }
}

function waitForRecorderStop(
  stoppedBlob: Promise<Blob>,
  signal: AbortSignal,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason ?? createAbortError());
      return;
    }

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      signal.removeEventListener("abort", handleAbort);
    };
    const handleAbort = () => {
      cleanup();
      reject(signal.reason ?? createAbortError());
    };
    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      reject(
        new WebmExportError(
          "webmRecorderFailed",
          "The browser did not finish the WebM file. Please retry.",
        ),
      );
    }, 5_000);

    signal.addEventListener("abort", handleAbort, { once: true });
    stoppedBlob.then(
      (blob) => {
        cleanup();
        resolve(blob);
      },
      (error) => {
        cleanup();
        reject(error);
      },
    );
  });
}

/**
 * MediaRecorder must run in real time, but the canvas itself only changes once
 * per countdown second. Absolute deadlines prevent render time and throttled
 * timers from accumulating into multi-minute drift.
 */
export async function exportWebmLocally(
  settings: GeneratorSettings,
  { onProgress, signal: externalSignal }: WebmExportOptions,
) {
  const wantsAudio = settings.audio.variant !== "none";
  const selectedMimeType = getPreferredAlphaWebmMimeType(wantsAudio);

  if (!selectedMimeType) {
    throw new WebmExportError(
      wantsAudio ? "webmAudioUnsupported" : "webmUnavailable",
      wantsAudio
        ? "This browser cannot record transparent WebM with audio. Turn Audio Cues off and retry."
        : "This browser does not support transparent WebM export.",
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = settings.canvas.width;
  canvas.height = settings.canvas.height;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    throw new WebmExportError(
      "webmUnavailable",
      "Could not create a canvas context for WebM export.",
    );
  }
  if (typeof canvas.captureStream !== "function") {
    throw new WebmExportError(
      "webmUnavailable",
      "Canvas stream capture is unavailable in this browser.",
    );
  }

  const controller = new AbortController();
  const forwardExternalAbort = () => {
    if (!controller.signal.aborted) {
      controller.abort(externalSignal?.reason ?? createAbortError());
    }
  };
  if (externalSignal?.aborted) {
    forwardExternalAbort();
  } else {
    externalSignal?.addEventListener("abort", forwardExternalAbort, {
      once: true,
    });
  }

  const backgroundError = () =>
    new WebmExportError(
      "webmBackgrounded",
      "WebM export stopped because this tab was hidden. Keep the tab visible and retry.",
    );
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && !controller.signal.aborted) {
      controller.abort(backgroundError());
    }
  };
  if (document.visibilityState === "hidden") {
    controller.abort(backgroundError());
  }
  document.addEventListener("visibilitychange", handleVisibilityChange);

  const stream = canvas.captureStream(settings.export.fps);
  let audioContext: AudioContext | null = null;
  let audioSourceNode: AudioBufferSourceNode | null = null;
  let audioStarted = false;
  let recorder: MediaRecorder | null = null;

  try {
    if (controller.signal.aborted) {
      throw controller.signal.reason;
    }

    if (wantsAudio) {
      const audioBuffer = await synthesizeAudioCues({
        durationSeconds: settings.timer.durationSeconds,
        variant: settings.audio.variant,
      });
      if (!audioBuffer || typeof AudioContext === "undefined") {
        throw new WebmExportError(
          "webmAudioUnsupported",
          "Audio cues are unavailable in this browser. Turn Audio Cues off and retry.",
        );
      }

      try {
        audioContext = new AudioContext({ sampleRate: audioBuffer.sampleRate });
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
        const destination = audioContext.createMediaStreamDestination();
        audioSourceNode = audioContext.createBufferSource();
        audioSourceNode.buffer = audioBuffer;
        audioSourceNode.connect(destination);
        for (const track of destination.stream.getAudioTracks()) {
          stream.addTrack(track);
        }
      } catch (error) {
        throw new WebmExportError(
          "webmAudioUnsupported",
          "Audio cues could not start. Turn Audio Cues off and retry.",
          { cause: error },
        );
      }
    }

    try {
      recorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond:
          settings.export.quality === "high" ? 8_000_000 : 4_000_000,
      });
    } catch (error) {
      throw new WebmExportError(
        "webmRecorderFailed",
        "MediaRecorder could not start this WebM export.",
        { cause: error },
      );
    }

    const plan = createExportJobPlan({
      durationSeconds: settings.timer.durationSeconds,
      fps: settings.export.fps,
      format: "webm",
    });
    const chunks: BlobPart[] = [];
    let recorderFailure: WebmExportError | null = null;
    let resolveStoppedBlob!: (blob: Blob) => void;
    const stoppedBlob = new Promise<Blob>((resolve) => {
      resolveStoppedBlob = resolve;
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    recorder.onerror = () => {
      recorderFailure = new WebmExportError(
        "webmRecorderFailed",
        "MediaRecorder failed while exporting WebM.",
      );
      if (!controller.signal.aborted) {
        controller.abort(recorderFailure);
      }
    };
    recorder.onstop = () => {
      const actualMimeType = recorder?.mimeType || selectedMimeType;
      resolveStoppedBlob(new Blob(chunks, { type: actualMimeType }));
    };

    try {
      // A one-second timeslice asks the browser to flush encoded data regularly
      // instead of retaining the entire recording in MediaRecorder internals.
      recorder.start(1_000);
    } catch (error) {
      throw new WebmExportError(
        "webmRecorderFailed",
        "MediaRecorder could not start this WebM export.",
        { cause: error },
      );
    }

    if (audioSourceNode) {
      audioSourceNode.start(0);
      audioStarted = true;
    }

    await runWebmTimeline({
      durationSeconds: settings.timer.durationSeconds,
      fps: settings.export.fps,
      signal: controller.signal,
      onTick({ elapsedSeconds, completedFrames, shouldRender }) {
        if (shouldRender) {
          const displayText = formatCountdownTime(
            getRemainingDurationSeconds(
              settings.timer.durationSeconds,
              elapsedSeconds,
            ),
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
          renderStyledFrame(
            context,
            frameState,
            settings.themePresetId,
            settings.templateId,
          );
        }

        onProgress({
          stage: "encoding",
          completedFrames,
          totalFrames: plan.totalFrames,
          message: "",
        });
      },
    });

    if (recorderFailure) {
      throw recorderFailure;
    }

    if (audioStarted) {
      try {
        audioSourceNode?.stop();
      } catch {
        // The source may already have ended exactly at the export boundary.
      }
      audioStarted = false;
    }
    stopMediaRecorder(recorder);
    const blob = await waitForRecorderStop(stoppedBlob, controller.signal);

    if (blob.size === 0) {
      throw new WebmExportError(
        "webmOutputEmpty",
        "The browser produced an empty WebM file. Retry with Audio Cues off or use PNG sequence.",
      );
    }

    onProgress({
      stage: "encoding",
      completedFrames: plan.totalFrames,
      totalFrames: plan.totalFrames,
      message: "",
    });

    return {
      blob,
      fileName: plan.outputFileName,
      mimeType: recorder.mimeType || selectedMimeType,
    };
  } finally {
    externalSignal?.removeEventListener("abort", forwardExternalAbort);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    stopMediaRecorder(recorder);
    if (audioStarted) {
      try {
        audioSourceNode?.stop();
      } catch {
        // Best-effort cleanup.
      }
    }
    audioSourceNode?.disconnect();
    stream.getTracks().forEach((track) => track.stop());
    await audioContext?.close().catch(() => {});
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onerror = null;
      recorder.onstop = null;
    }
  }
}
