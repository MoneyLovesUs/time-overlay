export type AudioCueVariant = "none" | "tick" | "beep" | "tick-and-beep";

const SAMPLE_RATE = 48000;
const TICK_HZ = 1200;
const TICK_DURATION_SECONDS = 0.06;
const TICK_AMPLITUDE = 0.45;
const BEEP_HZ = 660;
const BEEP_DURATION_SECONDS = 0.45;
const BEEP_AMPLITUDE = 0.55;

function writeEnvelopedSine(
  channel: Float32Array,
  startSample: number,
  frequency: number,
  durationSeconds: number,
  amplitude: number,
) {
  const numSamples = Math.floor(durationSeconds * SAMPLE_RATE);
  const attackSamples = Math.max(1, Math.floor(numSamples * 0.08));
  const decayStart = Math.floor(numSamples * 0.35);

  for (let i = 0; i < numSamples; i += 1) {
    const index = startSample + i;
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

export async function synthesizeAudioCues(
  options: SynthesizeAudioCuesOptions,
): Promise<AudioBuffer | null> {
  if (options.variant === "none" || options.durationSeconds <= 0) {
    return null;
  }

  if (typeof OfflineAudioContext === "undefined") {
    return null;
  }

  const totalSamples = Math.max(
    1,
    Math.ceil(options.durationSeconds * SAMPLE_RATE),
  );
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
