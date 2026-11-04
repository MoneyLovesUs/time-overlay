import { getPngFramePattern } from "@/lib/generator/export/png-naming";

export const PRORES_BUNDLE_FILES = [
  "convert-to-prores.sh",
  "convert-to-prores.bat",
  "README-prores.txt",
] as const;

export const EXPORT_INSTRUCTIONS_FILE = "EXPORT-INSTRUCTIONS.txt";

export type ProResBundleFile = (typeof PRORES_BUNDLE_FILES)[number];

export type ProResBundleOptions = {
  fps: number;
  totalFrames: number;
  frameNameWidth: number;
  /**
   * "zipped": scripts sit next to the PNGs in the merged frames folder.
   * "directory": a copy at the task-directory root reads ./frames.
   */
  layout: "zipped" | "directory";
};

function buildShellScript({
  fps,
  totalFrames,
  frameNameWidth,
  layout,
}: ProResBundleOptions): string {
  const framePattern = getPngFramePattern(frameNameWidth);
  const defaultFramesDir = layout === "directory" ? "frames" : ".";
  return `#!/usr/bin/env bash
set -euo pipefail
# Run from this script's folder so relative paths are predictable.
cd "$(dirname "$0")"
FRAMES_DIR="\${1:-${defaultFramesDir}}"
TOTAL=${totalFrames}
WIDTH=${frameNameWidth}
FPS=${fps}

# Refuse to silently produce a shortened video from an incomplete merge.
for ((i = 1; i <= TOTAL; i++)); do
  n=$(printf "%0\${WIDTH}d" "$i")
  if [[ ! -f "$FRAMES_DIR/frame-$n.png" ]]; then
    echo "Missing frame: $FRAMES_DIR/frame-$n.png" >&2
    echo "Unzip every timer-part-*.zip and merge all frame-*.png files into one folder before converting." >&2
    exit 1
  fi
done

ffmpeg -framerate "$FPS" -start_number 1 -i "$FRAMES_DIR/${framePattern}" \\
  -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le output.mov
echo "Wrote output.mov (${framePattern}, ${fps} fps, ${totalFrames} frames)."
`;
}

function buildBatchScript({
  fps,
  totalFrames,
  frameNameWidth,
  layout,
}: ProResBundleOptions): string {
  const framePattern = getPngFramePattern(frameNameWidth);
  // A batch file expands %0, so ffmpeg's %0Nd pattern must be doubled.
  const batchFramePattern = framePattern.replaceAll("%", "%%");
  const framesDir = layout === "directory" ? "%~dp0frames\\" : "%~dp0";
  const zeroPadding = "0".repeat(frameNameWidth);
  return `@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
set "FRAMES=${framesDir}"
set "TOTAL=${totalFrames}"
set "WIDTH=${frameNameWidth}"

rem Refuse to silently produce a shortened video from an incomplete merge.
for /L %%i in (1,1,%TOTAL%) do (
  set "n=%%i"
  set "pad=${zeroPadding}!n!"
  set "padded=!pad:~-${frameNameWidth}!"
  if not exist "%FRAMES%frame-!padded!.png" (
    echo Missing frame: %FRAMES%frame-!padded!.png 1>&2
    echo Unzip every timer-part-*.zip and merge all frame-*.png files into one folder before converting. 1>&2
    exit /b 1
  )
)

ffmpeg -framerate ${fps} -start_number 1 -i "%FRAMES%${batchFramePattern}" -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le output.mov
if errorlevel 1 exit /b 1
echo Wrote output.mov (${framePattern}, ${fps} fps, ${totalFrames} frames).
`;
}

function buildReadme({
  fps,
  totalFrames,
  frameNameWidth,
}: ProResBundleOptions): string {
  const framePattern = getPngFramePattern(frameNameWidth);
  const exampleName = `frame-${"1".padStart(frameNameWidth, "0")}.png`;
  return `ProRes 4444 conversion bundle
============================

This bundle converts the complete PNG sequence to one transparent ProRes 4444
file. Keep the PNGs: they are the lossless source for any future re-encode.

Before converting
-----------------
- Unzip every timer-part-*.zip from this export.
- Move every frame-*.png file into ONE folder. Some extractors create a folder
  per ZIP; move the images out of those folders and merge them.
- Do not import each part as its own countdown and do not start each part at
  00:00. There is one continuous sequence: ${totalFrames} frames at ${fps} fps.
- The numbering runs one-based from ${exampleName} to
  frame-${String(totalFrames).padStart(frameNameWidth, "0")}.png with no gaps.
- Put this script and README in the same merged folder as the PNGs. The
  directory-level copy at the task root reads ./frames instead.

Run
---
1. Install ffmpeg from https://ffmpeg.org/download.html
2. macOS / Linux: run ./convert-to-prores.sh in a terminal.
   Windows: double-click convert-to-prores.bat.
3. The script checks every frame from 1 to ${totalFrames} before calling
   ffmpeg and exits with an error if any frame is missing. That prevents a
   silently shortened video.
4. The transparent ProRes 4444 file is written to output.mov (${framePattern}).

Manual command
--------------
ffmpeg -framerate ${fps} -start_number 1 -i ${framePattern} -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le output.mov

Import
------
Import output.mov at ${fps} fps. Its duration should be ${totalFrames} frames
(${(totalFrames / fps).toFixed(3)} seconds). Verify the zero point and alpha
over a non-black background before delivery.

Need help? See https://timeoverlay.co/guides/png-to-prores
`;
}

export function buildProResBundle(
  options: ProResBundleOptions,
): Record<ProResBundleFile, string> {
  return {
    "convert-to-prores.sh": buildShellScript(options),
    "convert-to-prores.bat": buildBatchScript(options),
    "README-prores.txt": buildReadme(options),
  };
}

export type PngInstructionsOptions = ProResBundleOptions & {
  jobId: string;
  /**
   * Frames inside one displayed second are identical, so the export wrote each
   * image once. expand-sequence.* has to run before anything imports the folder.
   */
  skipDuplicateFrames?: boolean;
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
  skipDuplicateFrames = false,
}: PngInstructionsOptions): string {
  const pattern = getPngFramePattern(frameNameWidth);
  const lastFrame = `frame-${String(totalFrames).padStart(frameNameWidth, "0")}.png`;
  const expandStep = skipDuplicateFrames
    ? `3. RUN expand-sequence.sh (macOS/Linux) or expand-sequence.ps1 (Windows)
   inside that folder FIRST. The export stored each distinct image only once,
   so consecutive frames are missing until this fills them in with links.
4. Import the whole sequence in your editor at ${fps} fps. Do not import each
   part separately and do not restart the timeline at 00:00 for later parts.
5. To create ProRes 4444, place convert-to-prores.sh / convert-to-prores.bat
   in the merged frames folder and run it after step 3. It checks all
   ${totalFrames} frames before converting and refuses to run if one is missing.
6. Keep the PNG sequence. It is the lossless source if the edit changes.`
    : `3. Import the whole sequence in your editor at ${fps} fps. Do not import each
   part separately and do not restart the timeline at 00:00 for later parts.
4. To create ProRes 4444, place the first part's convert-to-prores.sh /
   convert-to-prores.bat in the merged frames folder and run it. It checks all
   ${totalFrames} frames before converting and refuses to run if one is missing.
   The copy at this task root reads ./frames instead.
5. Keep the PNG sequence. It is the lossless source if the edit changes.`;
  const expandStepZh = skipDuplicateFrames
    ? `3. 先在该文件夹内运行 expand-sequence.sh（macOS/Linux）或
   expand-sequence.ps1（Windows）。本次导出每张不同画面只存了一份，
   补齐之前相邻帧号是缺失的。
4. 在剪辑软件中按 ${fps} fps 导入整条序列。不要把每卷分别导入，也不要让后
   面的卷从 00:00 重新开始。
5. 如需 ProRes 4444，把 convert-to-prores.sh / convert-to-prores.bat 放进
   合并后的 frames 文件夹，在第 3 步之后运行。脚本会先检查全部 ${totalFrames}
   帧，缺任何一帧都会报错并拒绝转换，避免生成悄悄截短的视频。
6. 保留 PNG 序列，它是后续修改的无损源文件。`
    : `3. 在剪辑软件中按 ${fps} fps 导入整条序列。不要把每卷分别导入，也不要让后
   面的卷从 00:00 重新开始。
4. 如需 ProRes 4444，把第一卷中的 convert-to-prores.sh /
   convert-to-prores.bat 放进合并后的 frames 文件夹后运行。脚本会先检查全部
   ${totalFrames} 帧，缺任何一帧都会报错并拒绝转换，避免生成悄悄截短的视频。
   任务根目录下的脚本副本读取 ./frames。
5. 保留 PNG 序列，它是后续修改的无损源文件。`;
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
${expandStep}

中文
----
本次导出包含 ${totalFrames} 帧透明 PNG，${fps} fps，总时长
${(totalFrames / fps).toFixed(3)} 秒，分为一个或多个普通 ZIP 分卷：
timer-part-001.zip、timer-part-002.zip……

1. 必须解压全部卷。任何一卷都不是完整倒计时。
2. 部分解压工具会为每个 ZIP 单独建目录。请把所有 frame-*.png 合并到同一个
   文件夹（例如 frames）。编号是全局连续的，从 frame-${"1".padStart(frameNameWidth, "0")}.png
   到 ${lastFrame}，文件名不会冲突。
${expandStepZh}

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
