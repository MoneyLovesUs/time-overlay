import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { buildExpandBundle } from "@/lib/generator/export/png-expand-bundle";
import { countDistinctFrameTexts } from "@/lib/generator/export/frame-drawer";
import { getPngFrameFileName } from "@/lib/generator/export/png-naming";
import { createGeneratorSettings } from "@/lib/generator/defaults";

function writeSparseFrames(dir: string, totalFrames: number, width: number, keep: number[]) {
  for (const oneBased of keep) {
    writeFileSync(
      path.join(dir, getPngFrameFileName(oneBased - 1, width)),
      `png-${oneBased}`,
    );
  }
  expect(totalFrames).toBeGreaterThan(0);
}

describe("expand-sequence.sh", () => {
  it("fills the gaps with links to the preceding image", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "png-expand-"));
    const bundle = buildExpandBundle({ totalFrames: 90 });
    const script = path.join(dir, "expand-sequence.sh");
    writeFileSync(script, bundle["expand-sequence.sh"]);
    chmodSync(script, 0o755);

    // 30 fps job of three seconds: frames 1, 31 and 61 are the distinct images.
    writeSparseFrames(dir, 90, 4, [1, 31, 61]);

    const result = spawnSync("bash", [script], { cwd: dir, encoding: "utf8" });
    expect(result.status).toBe(0);

    const names = readdirSync(dir).filter((name) => name.endsWith(".png")).sort();
    expect(names).toHaveLength(90);
    for (let oneBased = 1; oneBased <= 90; oneBased += 1) {
      const name = getPngFrameFileName(oneBased - 1, 4);
      const expected =
        oneBased < 31 ? "png-1" : oneBased < 61 ? "png-31" : "png-61";
      expect(readFileSync(path.join(dir, name), "utf8")).toBe(expected);
    }

    // Hard links where the filesystem allows them: no extra disk cost.
    const first = statSync(path.join(dir, getPngFrameFileName(0, 4)));
    const second = statSync(path.join(dir, getPngFrameFileName(1, 4)));
    expect(second.ino).toBe(first.ino);
  });

  it("is idempotent when every frame already exists", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "png-expand-full-"));
    const bundle = buildExpandBundle({ totalFrames: 3 });
    const script = path.join(dir, "expand-sequence.sh");
    writeFileSync(script, bundle["expand-sequence.sh"]);
    chmodSync(script, 0o755);
    writeSparseFrames(dir, 3, 4, [1, 2, 3]);

    const result = spawnSync("bash", [script], { cwd: dir, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(readdirSync(dir).filter((name) => name.endsWith(".png"))).toHaveLength(3);
  });
});

describe("countDistinctFrameTexts", () => {
  it("collapses every frame inside a displayed second", () => {
    const settings = createGeneratorSettings({
      timer: { durationSeconds: 10, displayFormat: "mm:ss" },
      export: { fps: 30 },
    });
    const totalFrames = 10 * 30;
    expect(countDistinctFrameTexts(settings, totalFrames, 30)).toBe(10);
  });

  it("never exceeds the frame count", () => {
    const settings = createGeneratorSettings({
      timer: { durationSeconds: 10, displayFormat: "mm:ss" },
      export: { fps: 30 },
    });
    expect(countDistinctFrameTexts(settings, 1, 30)).toBe(1);
  });
});
