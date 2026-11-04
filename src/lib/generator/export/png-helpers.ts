import { getPngFramePattern } from "@/lib/generator/export/png-naming";

export const EXPORT_INSTRUCTIONS_FILE = "EXPORT-INSTRUCTIONS.txt";

export type PngInstructionsOptions = {
  fps: number;
  totalFrames: number;
  frameNameWidth: number;
  jobId: string;
};

/**
 * Bilingual (English + Simplified Chinese) instructions shown both at the top
 * of the task directory and inside the first ZIP part.
 */
export function buildPngExportInstructions({
  fps,
  totalFrames,
  frameNameWidth,
  jobId,
}: PngInstructionsOptions): string {
  const pattern = getPngFramePattern(frameNameWidth);
  const lastFrame = `frame-${String(totalFrames).padStart(frameNameWidth, "0")}.png`;
  return `Time Overlay PNG sequence / Time Overlay PNG 序列
Job ${jobId}

ENGLISH
-------
This export contains ${totalFrames} transparent PNG frames at ${fps} fps
(${(totalFrames / fps).toFixed(3)} seconds), split into one or more ordinary ZIP
parts: timer-part-001.zip, timer-part-002.zip, ...

1. Unzip EVERY part. No part is a complete countdown on its own.
2. Some tools create one folder per ZIP. Move all frame-*.png files into a
   single folder (for example "frames"). The names do not collide because the
   numbering is global: frame-${"1".padStart(frameNameWidth, "0")}.png through
   ${lastFrame}.
3. Import the whole sequence in your editor at ${fps} fps. Do not import each
   part separately and do not restart the timeline at 00:00 for later parts.
4. Keep the PNG sequence. It is the lossless source if the edit changes.

中文
----
本次导出包含 ${totalFrames} 帧透明 PNG，${fps} fps，总时长
${(totalFrames / fps).toFixed(3)} 秒，分为一个或多个普通 ZIP 分卷：
timer-part-001.zip、timer-part-002.zip……

1. 必须解压全部卷。任何一卷都不是完整倒计时。
2. 部分解压工具会为每个 ZIP 单独建目录。请把所有 frame-*.png 合并到同一个
   文件夹（例如 frames）。编号是全局连续的，从 frame-${"1".padStart(frameNameWidth, "0")}.png
   到 ${lastFrame}，文件名不会冲突。
3. 在剪辑软件中按 ${fps} fps 导入整条序列。不要把每卷分别导入，也不要让后
   面的卷从 00:00 重新开始。
4. 保留 PNG 序列，它是后续修改的无损源文件。

Frame pattern / 帧文件名格式: ${pattern}
`;
}

type PngPartNoteOptions = {
  jobId: string;
  partNumber: number;
  firstFrameIndex: number;
  nextFrameIndex: number;
  fps: number;
  totalFrames: number;
  frameNameWidth: number;
};

/**
 * The part note is built with fixed-width fields so its byte length is known
 * before the part's frame range is final; the ZIP byte budget can therefore
 * reserve its exact size.
 */
export function buildPngPartNote({
  jobId,
  partNumber,
  firstFrameIndex,
  nextFrameIndex,
  fps,
  totalFrames,
  frameNameWidth,
}: PngPartNoteOptions): { name: string; content: string } {
  const firstName = `frame-${String(firstFrameIndex + 1).padStart(
    frameNameWidth,
    "0",
  )}.png`;
  const lastName = `frame-${String(nextFrameIndex).padStart(
    frameNameWidth,
    "0",
  )}.png`;
  return {
    name: `PART-${String(partNumber).padStart(3, "0")}-README.txt`,
    content:
      `Time Overlay PNG sequence - part ${String(partNumber).padStart(3, "0")}\n` +
      `Job: ${jobId}\n` +
      `Frames: ${firstName} to ${lastName} (one-based, global numbering)\n` +
      `FPS: ${String(fps).padStart(2, "0")}  Total frames: ${String(totalFrames).padStart(7, "0")}\n\n` +
      "This is one part of a continuous sequence. Unzip and merge every\n" +
      "timer-part-*.zip before importing or converting to ProRes. The first\n" +
      "part contains EXPORT-INSTRUCTIONS.txt and the conversion scripts.\n",
  };
}

/** Exact byte length the fixed-width part note occupies in every later part. */
export function getPngPartNoteReservedBytes({
  jobId,
  partNumber,
  fps,
  totalFrames,
  frameNameWidth,
}: Pick<
  PngPartNoteOptions,
  "jobId" | "partNumber" | "fps" | "totalFrames" | "frameNameWidth"
>): number {
  return new TextEncoder().encode(
    buildPngPartNote({
      jobId,
      partNumber,
      firstFrameIndex: 0,
      nextFrameIndex: totalFrames,
      fps,
      totalFrames,
      frameNameWidth,
    }).content,
  ).byteLength;
}
