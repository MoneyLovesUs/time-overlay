type ProResBundleOptions = {
  fps: number;
  framePattern: string;
};

export const PRORES_BUNDLE_FILES = [
  "convert-to-prores.sh",
  "convert-to-prores.bat",
  "README-prores.txt",
] as const;

export type ProResBundleFile = (typeof PRORES_BUNDLE_FILES)[number];

export function buildProResBundle(
  options: ProResBundleOptions,
): Record<ProResBundleFile, string> {
  const { fps, framePattern } = options;
  const ffmpegCommand =
    `ffmpeg -framerate ${fps} -i ${framePattern} ` +
    `-c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le ` +
    `output.mov`;

  return {
    "convert-to-prores.sh":
      `#!/usr/bin/env bash\nset -euo pipefail\ncd "$(dirname "$0")"\n${ffmpegCommand}\n`,
    "convert-to-prores.bat":
      `@echo off\r\ncd /d "%~dp0"\r\n${ffmpegCommand}\r\n`,
    "README-prores.txt":
      "ProRes 4444 conversion bundle\n" +
      "============================\n\n" +
      "1. Install ffmpeg from https://ffmpeg.org/download.html\n" +
      "2. Run the script for your platform:\n" +
      "   - macOS / Linux: ./convert-to-prores.sh\n" +
      "   - Windows: double-click convert-to-prores.bat\n" +
      "3. The transparent ProRes 4444 file is written to output.mov\n\n" +
      "Manual one-liner:\n" +
      `   ${ffmpegCommand}\n\n` +
      "Need help? See https://timeoverlay.co/guides/png-to-prores\n",
  };
}
