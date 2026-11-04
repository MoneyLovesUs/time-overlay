import {
  getPngFrameNameWidth,
  getPngFramePattern,
} from "@/lib/generator/export/png-naming";

/**
 * Scripts that rebuild the full frame sequence after a de-duplicated export.
 *
 * A countdown renders identical pixels for every frame inside one displayed
 * second, so writing 30 copies of each image is pure waste: a 25-minute 30 fps
 * job is 45,000 frames but only ~1,500 distinct images. The export writes the
 * distinct ones at their true frame numbers and ships these scripts to fill the
 * gaps with hard links (falling back to copies where links are unavailable).
 *
 * Everything downstream — editors, convert-to-prores.*, the missing-frame
 * check — keeps working on the expanded folder, so the saving costs the user
 * exactly one command.
 */

export type ExpandBundleOptions = {
  totalFrames: number;
};

export const EXPAND_BUNDLE_FILES = [
  "expand-sequence.sh",
  "expand-sequence.ps1",
] as const;

export type ExpandBundleFile = (typeof EXPAND_BUNDLE_FILES)[number];

function buildShellExpandScript({ totalFrames }: ExpandBundleOptions): string {
  const width = getPngFrameNameWidth(totalFrames);
  const pattern = getPngFramePattern(width);
  return `#!/usr/bin/env bash
set -euo pipefail
# Rebuild the frames omitted from a de-duplicated Time Overlay export.
# Run this BEFORE importing the sequence or converting to ProRes.
cd "$(dirname "$0")"
DIR="\${1:-.}"
TOTAL=${totalFrames}
WIDTH=${width}

first=""
for file in "$DIR"/frame-*.png; do
  first=$file
  break
done
if [ -z "$first" ] || [ ! -e "$first" ]; then
  echo "No frame-*.png files in $DIR" >&2
  exit 1
fi

prev=""
prev_num=0
filled=0
for file in "$DIR"/frame-*.png; do
  base=\$(basename "$file")
  num=\${base#frame-}
  num=\${num%.png}
  num=\$((10#\$num))
  if [ -z "$prev" ]; then
    prev=$base
    prev_num=$num
    continue
  fi
  i=\$((prev_num + 1))
  while [ "$i" -lt "$num" ]; do
    target=\$(printf "frame-%0\${WIDTH}d.png" "$i")
    ln "$DIR/$prev" "$DIR/$target" 2>/dev/null || cp "$DIR/$prev" "$DIR/$target"
    filled=\$((filled + 1))
    i=\$((i + 1))
  done
  prev=$base
  prev_num=$num
done

while [ "$prev_num" -lt "$TOTAL" ]; do
  prev_num=\$((prev_num + 1))
  target=\$(printf "frame-%0\${WIDTH}d.png" "$prev_num")
  ln "$DIR/$prev" "$DIR/$target" 2>/dev/null || cp "$DIR/$prev" "$DIR/$target"
  filled=\$((filled + 1))
done

echo "Filled $filled frame(s); $TOTAL frames ready (${pattern})."
`;
}

function buildPowerShellExpandScript({
  totalFrames,
}: ExpandBundleOptions): string {
  const width = getPngFrameNameWidth(totalFrames);
  return `# Rebuild the frames omitted from a de-duplicated Time Overlay export.
# Run this BEFORE importing the sequence or converting to ProRes.
param([string]$Dir = ".")
Set-Location -LiteralPath $PSScriptRoot

$frames = @(Get-ChildItem -LiteralPath $Dir -Filter "frame-*.png" | Sort-Object Name)
if ($frames.Count -eq 0) {
  Write-Error "No frame-*.png files in $Dir"
  exit 1
}

$total = ${totalFrames}
$width = ${width}
$filled = 0
$prev = $frames[0]
$prevNum = [int]($prev.BaseName -replace "^frame-", "")

function Add-HoldFrame($fromFile, $index) {
  $name = "frame-" + $index.ToString("D" + $script:width) + ".png"
  $target = Join-Path $script:Dir $name
  New-Item -ItemType HardLink -Path $target -Value $fromFile.FullName -ErrorAction SilentlyContinue | Out-Null
  if (-not (Test-Path -LiteralPath $target)) {
    Copy-Item -LiteralPath $fromFile.FullName -Destination $target
  }
  $script:filled++
}

for ($index = 1; $index -lt $frames.Count; $index++) {
  $current = $frames[$index]
  $currentNum = [int]($current.BaseName -replace "^frame-", "")
  for ($n = $prevNum + 1; $n -lt $currentNum; $n++) {
    Add-HoldFrame $prev $n
  }
  $prev = $current
  $prevNum = $currentNum
}

for ($n = $prevNum + 1; $n -le $total; $n++) {
  Add-HoldFrame $prev $n
}

Write-Host "Filled $filled frame(s); $total frames ready."
`;
}

export function buildExpandBundle(
  options: ExpandBundleOptions,
): Record<ExpandBundleFile, string> {
  return {
    "expand-sequence.sh": buildShellExpandScript(options),
    "expand-sequence.ps1": buildPowerShellExpandScript(options),
  };
}
