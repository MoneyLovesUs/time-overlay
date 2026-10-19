import {
  AudioSample,
  AudioSampleSource,
  canEncodeAudio,
  CanvasSource,
  Mp4OutputFormat,
  Output,
} from "mediabunny";

import {
  AUDIO_CUE_SAMPLE_RATE,
  getAudioCueTotalSamples,
  renderAudioCueChunk,
  type SynthesizeAudioCuesOptions,
} from "@/lib/generator/encode/audio-cues";
import {
  MP4_AUDIO_BITRATE,
  resolveMp4VideoBitrate,
} from "@/lib/generator/encode/mp4-budget";
import {
  createMemoryMp4Sink,
  type Mp4Sink,
} from "@/lib/generator/encode/mp4-sink";
import type {
  CanvasSettings,
  ExportProgressState,
  ExportQualityPreset,
} from "@/lib/generator/types";

export { MP4_VIDEO_BITRATE_BY_QUALITY } from "@/lib/generator/encode/mp4-budget";

/**
 * MP4 cannot store alpha, so transparent canvases are composited over a pure
 * chroma-key green that phone editors (CapCut, InShot) can key out.
 */
export const MP4_CHROMA_KEY_BACKGROUND_COLOR = "#00FF00";

// Audio is fed in one-second chunks alongside the video frames, so neither the
// raw cue track nor the encoded packets pile up in memory on long timers.
const AUDIO_CHUNK_SECONDS = 1;

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
  durationSeconds: number;
  quality: ExportQualityPreset;
  drawFrame: (canvas: OffscreenCanvas, frameIndex: number) => void;
  onProgress?: (progress: ExportProgressState) => void;
  audioCues?: SynthesizeAudioCuesOptions | null;
  sink?: Mp4Sink;
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
  const sink = options.sink ?? createMemoryMp4Sink();
  const output = new Output({
    format: new Mp4OutputFormat(),
    target: sink.target,
  });

  const videoSource = new CanvasSource(canvas, {
    codec: "avc",
    bitrate: resolveMp4VideoBitrate(options.quality, options.durationSeconds),
    keyFrameInterval: 2,
  });
  output.addVideoTrack(videoSource, { frameRate: options.fps });

  // Audio cues ride along as AAC when the browser can encode it; otherwise the
  // MP4 ships silent instead of failing the export.
  const audioCues =
    options.audioCues && options.audioCues.variant !== "none"
      ? options.audioCues
      : null;
  let audioSource: AudioSampleSource | null = null;
  if (audioCues) {
    try {
      if (await canEncodeAudio("aac")) {
        audioSource = new AudioSampleSource({
          codec: "aac",
          bitrate: MP4_AUDIO_BITRATE,
        });
        output.addAudioTrack(audioSource);
      }
    } catch {
      audioSource = null;
    }
  }

  const totalAudioSamples = audioCues
    ? getAudioCueTotalSamples(audioCues.durationSeconds)
    : 0;
  const audioChunkSamples = AUDIO_CHUNK_SECONDS * AUDIO_CUE_SAMPLE_RATE;
  let nextAudioSample = 0;
  const addAudioUntil = async (seconds: number) => {
    if (!audioSource || !audioCues) {
      return;
    }
    const untilSample = Math.min(
      totalAudioSamples,
      Math.ceil(seconds * AUDIO_CUE_SAMPLE_RATE),
    );
    while (nextAudioSample < untilSample) {
      const length = Math.min(
        audioChunkSamples,
        totalAudioSamples - nextAudioSample,
      );
      const sample = new AudioSample({
        data: renderAudioCueChunk(audioCues, nextAudioSample, length),
        format: "f32-planar",
        numberOfChannels: 1,
        sampleRate: AUDIO_CUE_SAMPLE_RATE,
        timestamp: nextAudioSample / AUDIO_CUE_SAMPLE_RATE,
      });
      try {
        await audioSource.add(sample);
      } finally {
        sample.close();
      }
      nextAudioSample += length;
    }
  };

  const frameDuration = 1 / options.fps;

  try {
    await output.start();

    for (let frameIndex = 0; frameIndex < options.totalFrames; frameIndex += 1) {
      options.drawFrame(canvas, frameIndex);
      const timestamp = frameIndex / options.fps;

      await videoSource.add(timestamp, frameDuration);
      await addAudioUntil(timestamp + frameDuration + AUDIO_CHUNK_SECONDS);

      if (shouldEmitTick(frameIndex, options.totalFrames)) {
        emitProgress(
          options.onProgress,
          frameIndex + 1,
          options.totalFrames,
          "encoding",
        );
      }
    }

    await addAudioUntil(Number.POSITIVE_INFINITY);

    emitProgress(
      options.onProgress,
      options.totalFrames,
      options.totalFrames,
      "packaging",
    );

    await output.finalize();
  } catch (error) {
    await output.cancel().catch(() => undefined);
    await sink.abort();
    throw sink.writeError ?? error;
  }

  const blob = await sink.finish();

  return {
    blob,
    mimeType: "video/mp4",
    fileExtension: "mp4",
  };
}
