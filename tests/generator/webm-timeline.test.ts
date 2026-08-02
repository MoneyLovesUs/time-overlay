import { describe, expect, it } from "vitest";

import {
  runWebmTimeline,
  waitUntilWebmDeadline,
} from "@/lib/generator/export/webm-timeline";

describe("runWebmTimeline", () => {
  it("renders on countdown changes plus one timestamp-preserving final frame", async () => {
    let now = 0;
    const deadlines: number[] = [];
    const ticks: Array<{
      elapsedSeconds: number;
      completedFrames: number;
      shouldRender: boolean;
    }> = [];

    await runWebmTimeline({
      durationSeconds: 3,
      fps: 30,
      signal: new AbortController().signal,
      now: () => now,
      waitUntil: async (deadline) => {
        deadlines.push(deadline);
        now = deadline;
      },
      onTick: (tick) => ticks.push(tick),
    });

    expect(ticks.filter((tick) => tick.shouldRender)).toHaveLength(4);
    expect(
      ticks.map((tick) => Number(tick.elapsedSeconds.toFixed(3))),
    ).toEqual([0, 1, 2, 2.967]);
    expect(ticks.map((tick) => tick.completedFrames)).toEqual([1, 31, 61, 90]);
    expect(deadlines.map((deadline) => Number(deadline.toFixed(3)))).toEqual([
      1_000, 2_000, 2_966.667, 3_000,
    ]);
  });

  it("skips missed seconds and remains aligned to the absolute finish time", async () => {
    let now = 0;
    const deadlines: number[] = [];
    const elapsed: number[] = [];

    await runWebmTimeline({
      durationSeconds: 3,
      fps: 30,
      signal: new AbortController().signal,
      now: () => now,
      waitUntil: async (deadline) => {
        deadlines.push(deadline);
        now = deadlines.length === 1 ? 2_500 : deadline;
      },
      onTick: (tick) => elapsed.push(tick.elapsedSeconds),
    });

    expect(elapsed.map((value) => Number(value.toFixed(3)))).toEqual([
      0, 2.5, 2.967,
    ]);
    expect(deadlines.map((deadline) => Number(deadline.toFixed(3)))).toEqual([
      1_000, 2_966.667, 3_000,
    ]);
    expect(now).toBe(3_000);
  });

  it("rejects immediately when the export is already cancelled", async () => {
    const controller = new AbortController();
    const reason = new Error("cancelled by user");
    controller.abort(reason);

    await expect(
      runWebmTimeline({
        durationSeconds: 300,
        fps: 30,
        signal: controller.signal,
        onTick: () => {},
      }),
    ).rejects.toBe(reason);
  });
});

describe("waitUntilWebmDeadline", () => {
  it("is interrupted by AbortSignal instead of waiting for the timer", async () => {
    const controller = new AbortController();
    const reason = new Error("tab hidden");
    const pending = waitUntilWebmDeadline(
      performance.now() + 60_000,
      controller.signal,
    );

    controller.abort(reason);

    await expect(pending).rejects.toBe(reason);
  });
});
