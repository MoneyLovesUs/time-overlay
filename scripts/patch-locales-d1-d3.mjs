#!/usr/bin/env node
/**
 * Patch all non-en locale files for D1-D3 spec keys:
 *  - resolutionPresetOptions: add landscape-2160 and portrait-2160
 *  - exportPanel: add vp9Alpha/hevcAlpha/Pro keys
 *  - exportPanel.advisoryMessages: add vp9/hevc alpha entries
 *  - exportPanel.runtimeMessages: add alpha video entries
 *
 * All new values default to English fallbacks. Locale-specific translation
 * is a follow-up batch per the spec.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localeDir = join(__dirname, "..", "src", "content", "root");
const locales = readdirSync(localeDir).filter(
  (file) =>
    file.endsWith(".ts") &&
    !["en.ts", "index.ts", "types.ts"].includes(file),
);

const ENGLISH_FALLBACKS = {
  vp9AlphaLabel: "WebM (VP9 + alpha)",
  vp9AlphaDescription:
    "Transparent video for Premiere, DaVinci Resolve, Final Cut, and CapCut.",
  hevcAlphaLabel: "MOV (HEVC + alpha)",
  hevcAlphaDescription:
    "Apple-friendly transparent video. Best on Safari and macOS.",
  proBadge: "Pro",
  proLockedHint: "Pro unlocks this format. Click to upgrade.",
  vp9AlphaUnavailableError:
    "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
  hevcAlphaUnavailableError:
    "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
  vp9AlphaInfo:
    "WebM VP9 + alpha is the recommended transparent video format for modern editors.",
  hevcAlphaInfo:
    "MOV HEVC + alpha is the recommended transparent video format for Final Cut Pro.",
  preparingAlphaVideo: "Preparing transparent video export",
  alphaVideoFailedUnexpectedly:
    "Transparent video export failed unexpectedly.",
};

function patchResolutionPresets(source) {
  return source.replace(
    /(\s*)("landscape-1080":\s*"[^"]+",)(\s*)(?!"landscape-2160")(.+?"portrait-1080":\s*"[^"]+",)(\s*)(?!"portrait-2160")/s,
    (_match, indentA, lineA, _whitespaceA, lineB, indentBefore) => {
      const indent = indentA;
      return `${indent}${lineA}${indent}"landscape-2160": "3840x2160 / 16:9 (4K, Pro)",${indent}${lineB}${indent}"portrait-2160": "2160x3840 / 9:16 (4K, Pro)",${indentBefore}`;
    },
  );
}

function patchExportPanelLabelsMultiline(source) {
  return source.replace(
    /(webmDescription:[\s\S]*?",)\n(\s+)(fpsLabel:)/,
    (_match, prior, indent, fpsLabel) =>
      [
        prior,
        `${indent}vp9AlphaLabel: ${JSON.stringify(ENGLISH_FALLBACKS.vp9AlphaLabel)},`,
        `${indent}vp9AlphaDescription: ${JSON.stringify(ENGLISH_FALLBACKS.vp9AlphaDescription)},`,
        `${indent}hevcAlphaLabel: ${JSON.stringify(ENGLISH_FALLBACKS.hevcAlphaLabel)},`,
        `${indent}hevcAlphaDescription: ${JSON.stringify(ENGLISH_FALLBACKS.hevcAlphaDescription)},`,
        `${indent}proBadge: ${JSON.stringify(ENGLISH_FALLBACKS.proBadge)},`,
        `${indent}proLockedHint: ${JSON.stringify(ENGLISH_FALLBACKS.proLockedHint)},`,
        `${indent}${fpsLabel}`,
      ].join("\n"),
  );
}

function patchAdvisoryMessages(source) {
  return source.replace(
    /(webmUnavailableError:[\s\S]*?",)\n(\s+)(heavyExportWarning:)/,
    (_match, prior, indent, heavyExportWarning) =>
      [
        prior,
        `${indent}vp9AlphaUnavailableError: ${JSON.stringify(ENGLISH_FALLBACKS.vp9AlphaUnavailableError)},`,
        `${indent}hevcAlphaUnavailableError: ${JSON.stringify(ENGLISH_FALLBACKS.hevcAlphaUnavailableError)},`,
        `${indent}${heavyExportWarning}`,
      ].join("\n"),
  ).replace(
    /(pngSequenceInfo:[\s\S]*?",)\n(\s+)(\},\s*runtimeMessages:)/,
    (_match, prior, indent, closer) =>
      [
        prior,
        `${indent}vp9AlphaInfo: ${JSON.stringify(ENGLISH_FALLBACKS.vp9AlphaInfo)},`,
        `${indent}hevcAlphaInfo: ${JSON.stringify(ENGLISH_FALLBACKS.hevcAlphaInfo)},`,
        `${indent}${closer}`,
      ].join("\n"),
  );
}

function patchRuntimeMessages(source) {
  return source.replace(
    /(preparingPngSequence:[\s\S]*?",)\n(\s+)(exportWorkerUnavailable:)/,
    (_match, prior, indent, marker) =>
      [
        prior,
        `${indent}preparingAlphaVideo: ${JSON.stringify(ENGLISH_FALLBACKS.preparingAlphaVideo)},`,
        `${indent}${marker}`,
      ].join("\n"),
  ).replace(
    /(webmFailedUnexpectedly:[\s\S]*?",)\n(\s+)(pngSequenceFailedUnexpectedly:)/,
    (_match, prior, indent, marker) =>
      [
        prior,
        `${indent}alphaVideoFailedUnexpectedly: ${JSON.stringify(ENGLISH_FALLBACKS.alphaVideoFailedUnexpectedly)},`,
        `${indent}${marker}`,
      ].join("\n"),
  );
}

let touched = 0;
for (const file of locales) {
  const path = join(localeDir, file);
  const original = readFileSync(path, "utf8");

  let next = original;
  next = patchResolutionPresets(next);
  next = patchExportPanelLabelsMultiline(next);
  next = patchAdvisoryMessages(next);
  next = patchRuntimeMessages(next);

  if (next !== original) {
    writeFileSync(path, next);
    touched += 1;
    console.log(`patched: ${file}`);
  } else {
    console.warn(`unchanged: ${file}`);
  }
}

console.log(`Done. ${touched}/${locales.length} files patched.`);
