export type AudioCueVariant = "none" | "tick" | "beep" | "tick-and-beep";

export const AUDIO_CUE_SAMPLE_RATE = 48000;
const SAMPLE_RATE = AUDIO_CUE_SAMPLE_RATE;
const TICK_HZ = 1200;
const TICK_DURATION_SECONDS = 0.06;
const TICK_AMPLITUDE = 0.45;
const BEEP_HZ = 660;
const BEEP_DURATION_SECONDS = 0.45;
const BEEP_AMPLITUDE = 0.55;

// `channel` covers the samples starting at `channelOffset`, so a cue that
// begins before the chunk only writes its overlapping tail.
function writeEnvelopedSine(
  channel: Float32Array,
  startSample: number,
  frequency: number,
  durationSeconds: number,
  amplitude: number,
  channelOffset = 0,
) {
  const numSamples = Math.floor(durationSeconds * SAMPLE_RATE);
  const attackSamples = Math.max(1, Math.floor(numSamples * 0.08));
  const decayStart = Math.floor(numSamples * 0.35);

  for (
    let i = Math.max(0, channelOffset - startSample);
    i < numSamples;
    i += 1
  ) {
    const index = startSample + i - channelOffset;
    if (index >= channel.length) {
      break;
    }
    const time = i / SAMPLE_RATE;
    let envelope: number;
    if (i < attackSamples) {
      envelope = i / attackSamples;
    } else if (i < decayStart) {
      envelope = 1;
    } else {
      const decaySamples = numSamples - decayStart;
      const decayProgress = (i - decayStart) / decaySamples;
      envelope = Math.max(0, 1 - decayProgress);
    }
    const sample = amplitude * envelope * Math.sin(2 * Math.PI * frequency * time);
    channel[index] = clamp(channel[index] + sample, -1, 1);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function variantUsesTick(variant: AudioCueVariant): boolean {
  return variant === "tick" || variant === "tick-and-beep";
}

function variantUsesBeep(variant: AudioCueVariant): boolean {
  return variant === "beep" || variant === "tick-and-beep";
}

export type SynthesizeAudioCuesOptions = {
  durationSeconds: number;
  variant: AudioCueVariant;
};

export function getAudioCueTotalSamples(durationSeconds: number): number {
  return Math.max(1, Math.ceil(durationSeconds * SAMPLE_RATE));
}

/**
 * Renders the mono cue track for samples [startSample, startSample + length).
 * Long MP4 exports call this per chunk so a 60-minute track never has to sit
 * in memory at once (~690 MB as one Float32 buffer).
 */
export function renderAudioCueChunk(
  options: SynthesizeAudioCuesOptions,
  startSample: number,
  length: number,
): Float32Array {
  const channel = new Float32Array(length);
  const totalSamples = getAudioCueTotalSamples(options.durationSeconds);
  const endSample = startSample + length;

  if (variantUsesTick(options.variant)) {
    const tickSamples = Math.floor(TICK_DURATION_SECONDS * SAMPLE_RATE);
    const integerSecondCount = Math.floor(options.durationSeconds);
    const firstSecond = Math.max(
      1,
      Math.floor((startSample - tickSamples) / SAMPLE_RATE),
    );
    const lastSecond = Math.min(
      integerSecondCount - 1,
      Math.floor(endSample / SAMPLE_RATE),
    );
    for (let second = firstSecond; second <= lastSecond; second += 1) {
      writeEnvelopedSine(
        channel,
        Math.floor(second * SAMPLE_RATE),
        TICK_HZ,
        TICK_DURATION_SECONDS,
        TICK_AMPLITUDE,
        startSample,
      );
    }
  }

  if (variantUsesBeep(options.variant)) {
    const beepStart = Math.max(
      0,
      totalSamples - Math.floor(BEEP_DURATION_SECONDS * SAMPLE_RATE),
    );
    if (beepStart < endSample) {
      writeEnvelopedSine(
        channel,
        beepStart,
        BEEP_HZ,
        BEEP_DURATION_SECONDS,
        BEEP_AMPLITUDE,
        startSample,
      );
    }
  }

  return channel;
}

export async function synthesizeAudioCues(
  options: SynthesizeAudioCuesOptions,
): Promise<AudioBuffer | null> {
  if (options.variant === "none" || options.durationSeconds <= 0) {
    return null;
  }

  if (typeof OfflineAudioContext === "undefined") {
    return null;
  }

  const totalSamples = getAudioCueTotalSamples(options.durationSeconds);
  const ctx = new OfflineAudioContext({
    length: totalSamples,
    sampleRate: SAMPLE_RATE,
    numberOfChannels: 1,
  });
  const buffer = ctx.createBuffer(1, totalSamples, SAMPLE_RATE);
  const channel = buffer.getChannelData(0);

  if (variantUsesTick(options.variant)) {
    const integerSecondCount = Math.floor(options.durationSeconds);
    for (let second = 1; second < integerSecondCount; second += 1) {
      writeEnvelopedSine(
        channel,
        Math.floor(second * SAMPLE_RATE),
        TICK_HZ,
        TICK_DURATION_SECONDS,
        TICK_AMPLITUDE,
      );
    }
  }

  if (variantUsesBeep(options.variant)) {
    const beepStart = Math.max(
      0,
      totalSamples - Math.floor(BEEP_DURATION_SECONDS * SAMPLE_RATE),
    );
    writeEnvelopedSine(
      channel,
      beepStart,
      BEEP_HZ,
      BEEP_DURATION_SECONDS,
      BEEP_AMPLITUDE,
    );
  }

  return buffer;
}
