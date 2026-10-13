import {
  AudioBufferSource,
  BufferTarget,
  canEncodeAudio,
  CanvasSource,
  Mp4OutputFormat,
  Output,
} from "mediabunny";

import type {
  CanvasSettings,
  ExportProgressState,
  ExportQualityPreset,
} from "@/lib/generator/types";

/**
 * MP4 cannot store alpha, so transparent canvases are composited over a pure
 * chroma-key green that phone editors (CapCut, InShot) can key out.
 */
export const MP4_CHROMA_KEY_BACKGROUND_COLOR = "#00FF00";

export const MP4_VIDEO_BITRATE_BY_QUALITY: Record<
  ExportQualityPreset,
  number
> = {
  standard: 4_000_000,
  high: 8_000_000,
};

export function resolveMp4FrameBackground(
  canvas: Pick<CanvasSettings, "backgroundMode" | "backgroundColor">,
): string {
  return canvas.backgroundMode === "transparent"
    ? MP4_CHROMA_KEY_BACKGROUND_COLOR
    : canvas.backgroundColor;
}

export type Mp4VideoEncoderOptions = {
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  quality: ExportQualityPreset;
  drawFrame: (canvas: OffscreenCanvas, frameIndex: number) => void;
  onProgress?: (progress: ExportProgressState) => void;
  audioBuffer?: AudioBuffer | null;
};

export type Mp4VideoEncoderResult = {
  blob: Blob;
  mimeType: string;
  fileExtension: string;
};

function emitProgress(
  onProgress: Mp4VideoEncoderOptions["onProgress"],
  completed: number,
  total: number,
  stage: ExportProgressState["stage"],
) {
  if (!onProgress) {
    return;
  }

  onProgress({
    stage,
    completedFrames: completed,
    totalFrames: total,
    message: "",
  });
}

function shouldEmitTick(frameIndex: number, totalFrames: number) {
  return (
    frameIndex === 0 ||
    frameIndex === totalFrames - 1 ||
    (frameIndex + 1) % 5 === 0
  );
}

export async function encodeMp4Video(
  options: Mp4VideoEncoderOptions,
): Promise<Mp4VideoEncoderResult> {
  const canvas = new OffscreenCanvas(options.width, options.height);
  const target = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat(),
    target,
  });

  const videoSource = new CanvasSource(canvas, {
    codec: "avc",
    bitrate: MP4_VIDEO_BITRATE_BY_QUALITY[options.quality],
    keyFrameInterval: 2,
  });
  output.addVideoTrack(videoSource, { frameRate: options.fps });

  // Audio cues ride along as AAC when the browser can encode it; otherwise the
  // MP4 ships silent instead of failing the export.
  let audioSource: AudioBufferSource | null = null;
  if (options.audioBuffer) {
    try {
      if (await canEncodeAudio("aac")) {
        audioSource = new AudioBufferSource({
          codec: "aac",
          bitrate: 96_000,
        });
        output.addAudioTrack(audioSource);
      }
    } catch {
      audioSource = null;
    }
  }

  await output.start();

  const audioWritePromise =
    audioSource && options.audioBuffer
      ? audioSource.add(options.audioBuffer)
      : Promise.resolve();

  const frameDuration = 1 / options.fps;

  for (let frameIndex = 0; frameIndex < options.totalFrames; frameIndex += 1) {
    options.drawFrame(canvas, frameIndex);
    const timestamp = frameIndex / options.fps;

    await videoSource.add(timestamp, frameDuration);

    if (shouldEmitTick(frameIndex, options.totalFrames)) {
      emitProgress(
        options.onProgress,
        frameIndex + 1,
        options.totalFrames,
        "encoding",
      );
    }
  }

  await audioWritePromise;

  emitProgress(
    options.onProgress,
    options.totalFrames,
    options.totalFrames,
    "packaging",
  );

  await output.finalize();

  const buffer = target.buffer;
  if (!buffer) {
    throw new Error("Encoder finalized without producing a buffer.");
  }

  return {
    blob: new Blob([buffer], { type: "video/mp4" }),
    mimeType: "video/mp4",
    fileExtension: "mp4",
  };
}
