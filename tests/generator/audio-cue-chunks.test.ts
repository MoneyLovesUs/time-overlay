import { describe, expect, it } from "vitest";

import {
  AUDIO_CUE_SAMPLE_RATE,
  getAudioCueTotalSamples,
  renderAudioCueChunk,
} from "@/lib/generator/encode/audio-cues";

describe("renderAudioCueChunk", () => {
  const options = { durationSeconds: 5, variant: "tick-and-beep" as const };
  const total = getAudioCueTotalSamples(options.durationSeconds);
  const whole = renderAudioCueChunk(options, 0, total);

  it("produces the same track when rendered in chunks that split cues", () => {
    // 0.53s chunks land mid-tick and mid-beep, so boundary handling matters.
    const chunkSize = Math.floor(AUDIO_CUE_SAMPLE_RATE * 0.53);
    const stitched = new Float32Array(total);
    for (let start = 0; start < total; start += chunkSize) {
      const length = Math.min(chunkSize, total - start);
      stitched.set(renderAudioCueChunk(options, start, length), start);
    }
    expect(stitched).toEqual(whole);
  });

  it("places ticks on whole seconds and the beep at the end", () => {
    const tickAt = (second: number) =>
      whole
        .subarray(second * AUDIO_CUE_SAMPLE_RATE, (second + 0.06) * AUDIO_CUE_SAMPLE_RATE)
        .some((value) => value !== 0);
    expect(tickAt(1)).toBe(true);
    expect(tickAt(3)).toBe(true);
    expect(whole.subarray(0, AUDIO_CUE_SAMPLE_RATE).every((value) => value === 0)).toBe(true);
    expect(whole.subarray(total - 1000).some((value) => value !== 0)).toBe(true);
  });

  it("is silent for the none variant", () => {
    const silent = renderAudioCueChunk({ durationSeconds: 5, variant: "none" }, 0, total);
    expect(silent.every((value) => value === 0)).toBe(true);
  });
});
