#!/usr/bin/env node
/**
 * Rewrites webmLabel + webmDescription + webmUnavailableError copy to match the
 * new reality: WebM is now an alpha-preserving VP8 export, not a generic video.
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

const NEW_WEBM_LABEL = `"WebM (with alpha)"`;
const NEW_WEBM_DESCRIPTION = `"Transparent VP8 video. Drops into OBS, Premiere, DaVinci, CapCut, and Streamlabs as a video layer with the background already cut out."`;
const NEW_WEBM_UNAVAILABLE = `"WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here."`;

let touched = 0;
for (const file of locales) {
  const path = join(localeDir, file);
  const original = readFileSync(path, "utf8");
  let next = original;

  next = next.replace(
    /webmLabel:\s*"[^"]*",/,
    `webmLabel: ${NEW_WEBM_LABEL},`,
  );
  next = next.replace(
    /webmDescription:\s*\n?\s*"[^"]*",/s,
    `webmDescription:\n        ${NEW_WEBM_DESCRIPTION},`,
  );
  next = next.replace(
    /webmUnavailableError:\s*\n?\s*"[^"]*",/s,
    `webmUnavailableError:\n          ${NEW_WEBM_UNAVAILABLE},`,
  );

  if (next !== original) {
    writeFileSync(path, next);
    touched += 1;
    console.log(`patched: ${file}`);
  } else {
    console.warn(`no anchor matched in ${file}`);
  }
}

console.log(`Done. ${touched}/${locales.length} files patched.`);
