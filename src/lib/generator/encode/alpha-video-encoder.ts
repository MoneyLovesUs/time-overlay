import {
  AudioBufferSource,
  BufferTarget,
  CanvasSource,
  MovOutputFormat,
  Output,
  WebMOutputFormat,
  type VideoCodec,
  type VideoEncodingConfig,
} from "mediabunny";

import type { ExportProgressState } from "@/lib/generator/types";

export type AlphaVideoTarget = "webm-vp9" | "mov-hevc";

export type AlphaVideoEncoderOptions = {
  target: AlphaVideoTarget;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  bitrate: number;
  drawFrame: (canvas: OffscreenCanvas, frameIndex: number) => void;
  onProgress?: (progress: ExportProgressState) => void;
  audioBuffer?: AudioBuffer | null;
};

export type AlphaVideoEncoderResult = {
  blob: Blob;
  mimeType: string;
  fileExtension: string;
};

type EncoderPlanEntry = {
  codec: VideoCodec;
  mimeType: string;
  fileExtension: string;
  createFormat: () => WebMOutputFormat | MovOutputFormat;
  supportsOpusAudio: boolean;
};

const ENCODER_PLANS: Record<AlphaVideoTarget, EncoderPlanEntry> = {
  "webm-vp9": {
    codec: "vp9",
    mimeType: "video/webm",
    fileExtension: "webm",
    createFormat: () => new WebMOutputFormat(),
    supportsOpusAudio: true,
  },
  "mov-hevc": {
    codec: "hevc",
    mimeType: "video/quicktime",
    fileExtension: "mov",
    createFormat: () => new MovOutputFormat(),
    supportsOpusAudio: false,
  },
};

function emitProgress(
  onProgress: AlphaVideoEncoderOptions["onProgress"],
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

export async function encodeAlphaVideo(
  options: AlphaVideoEncoderOptions,
): Promise<AlphaVideoEncoderResult> {
  const plan = ENCODER_PLANS[options.target];
  const canvas = new OffscreenCanvas(options.width, options.height);
  const target = new BufferTarget();
  const output = new Output({
    format: plan.createFormat(),
    target,
  });

  const encodingConfig: VideoEncodingConfig = {
    codec: plan.codec,
    bitrate: options.bitrate,
    alpha: "keep",
    keyFrameInterval: 2,
  };

  const videoSource = new CanvasSource(canvas, encodingConfig);
  output.addVideoTrack(videoSource, { frameRate: options.fps });

  let audioSource: AudioBufferSource | null = null;
  if (options.audioBuffer && plan.supportsOpusAudio) {
    try {
      audioSource = new AudioBufferSource({
        codec: "opus",
        bitrate: 96_000,
      });
      output.addAudioTrack(audioSource);
    } catch {
      audioSource = null;
    }
  }

  await output.start();

  const audioWritePromise = audioSource && options.audioBuffer
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

  emitProgress(options.onProgress, options.totalFrames, options.totalFrames, "packaging");

  await output.finalize();

  const buffer = target.buffer;
  if (!buffer) {
    throw new Error("Encoder finalized without producing a buffer.");
  }

  return {
    blob: new Blob([buffer], { type: plan.mimeType }),
    mimeType: plan.mimeType,
    fileExtension: plan.fileExtension,
  };
}
