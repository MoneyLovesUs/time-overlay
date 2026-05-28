#!/usr/bin/env node
/**
 * Adds audio-cues content keys to every non-en locale.
 * English fallback values; locale translation can follow.
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

let touched = 0;
for (const file of locales) {
  const path = join(localeDir, file);
  const original = readFileSync(path, "utf8");
  if (original.includes("audioVariantOptions:")) {
    console.warn(`audio keys already present in ${file}`);
    continue;
  }
  const next = original.replace(
    /(solidOptionLabel:\s*"[^"]+",)\n(\s+)\},/,
    (_match, prior, indent) =>
      [
        prior,
        `${indent}audioTitle: "Audio",`,
        `${indent}audioVariantLabel: "Audio cues",`,
        `${indent}audioVariantOptions: {`,
        `${indent}  none: "None",`,
        `${indent}  tick: "Tick every second",`,
        `${indent}  beep: "Final beep only",`,
        `${indent}  "tick-and-beep": "Tick + final beep",`,
        `${indent}},`,
        `${indent}audioNote: "Audio is embedded only in WebM (VP9 + alpha) exports. PNG sequence and standard WebM are silent.",`,
        `${indent.slice(0, -2)}},`,
      ].join("\n"),
  );
  if (next !== original) {
    writeFileSync(path, next);
    touched += 1;
    console.log(`patched: ${file}`);
  } else {
    console.warn(`anchor not matched in ${file}`);
  }
}

console.log(`Done. ${touched}/${locales.length} files patched.`);
