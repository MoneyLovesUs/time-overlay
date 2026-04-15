import { describe, expect, it } from "vitest";

import { createExportJobPlan } from "@/lib/generator/export/job";

describe("createExportJobPlan", () => {
  it("computes the total frame count from duration and fps", () => {
    const plan = createExportJobPlan({
      durationSeconds: 10,
      fps: 24,
      format: "png-sequence",
    });

    expect(plan.totalFrames).toBe(240);
  });

  it("uses frame-numbered png filenames for png sequence exports", () => {
    const plan = createExportJobPlan({
      durationSeconds: 2,
      fps: 30,
      format: "png-sequence",
    });

    expect(plan.getFrameFileName(0)).toBe("frame-0001.png");
    expect(plan.getFrameFileName(59)).toBe("frame-0060.png");
  });

  it("uses a single webm filename for video export", () => {
    const plan = createExportJobPlan({
      durationSeconds: 2,
      fps: 30,
      format: "webm",
    });

    expect(plan.outputFileName).toBe("time-overlay.webm");
  });
});
