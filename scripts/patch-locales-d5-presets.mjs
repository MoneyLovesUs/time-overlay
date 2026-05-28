#!/usr/bin/env node
/**
 * Replace presetLabels block in every non-en locale file with the new 10-preset roster.
 * Preset names stay in English (they're proper nouns by design).
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

const NEW_PRESET_BLOCK = `presetLabels: {
        cyber: "Cyber",
        minimal: "Minimal",
        mono: "Mono",
        neon: "Neon",
        glow: "Glow",
        scanline: "Scanline",
        classic: "Classic",
        retro: "Retro 80s",
        glass: "Glass",
        neumorphic: "Neumorphic",
      }`;

const PRESET_REGEX = /presetLabels:\s*\{[^}]*\}/s;

let touched = 0;
for (const file of locales) {
  const path = join(localeDir, file);
  const original = readFileSync(path, "utf8");
  if (!PRESET_REGEX.test(original)) {
    console.warn(`presetLabels not found in ${file}`);
    continue;
  }
  const next = original.replace(PRESET_REGEX, NEW_PRESET_BLOCK);
  if (next !== original) {
    writeFileSync(path, next);
    touched += 1;
    console.log(`patched: ${file}`);
  }
}

console.log(`Done. ${touched}/${locales.length} files patched.`);
