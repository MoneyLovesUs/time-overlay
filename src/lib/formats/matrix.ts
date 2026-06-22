/**
 * Single source of truth for the language-neutral facts behind the export-format
 * comparison page. Editor / browser support is derived from the first-party
 * guidance already encoded in the generator export panel and the editor guides;
 * `benchmark` numbers are measured per release (see BENCHMARK_ENV) and left null
 * until a real measurement is published — we never ship fabricated numbers.
 *
 * Localized prose (verdicts, "best for", labels) lives in `src/content/compare`;
 * this module holds only facts that do not change per language.
 */

export type FormatId =
  | "png-sequence"
  | "webm-vp8"
  | "webm-vp9"
  | "mov-hevc"
  | "prores-4444";

export type EditorId =
  | "premiere"
  | "davinci"
  | "finalcut"
  | "capcut"
  | "obs";

export type BrowserId = "chrome" | "edge" | "firefox" | "safari";

/**
 * - native: imports/plays with zero setup, first-class support
 * - works: supported and reliable
 * - unreliable: technically supported but historically flaky (avoid for masters)
 * - unsupported: not a viable path
 */
export type SupportLevel = "native" | "works" | "unreliable" | "unsupported";

/** A browser cell is either an export-capability note or "n/a" for offline-only formats. */
export type BrowserSupport = SupportLevel | "n/a";

export type FormatTransparency = "lossless" | "high" | "compressed";

export type FormatBenchmark = {
  /** Output size in bytes for BENCHMARK_ENV.config. */
  fileSizeBytes: number;
  /** Wall-clock export time in milliseconds for BENCHMARK_ENV.config. */
  exportMs: number;
};

export type FormatRow = {
  id: FormatId;
  /** Language-neutral codec label, e.g. "VP9 + alpha". */
  codecLabel: string;
  transparency: FormatTransparency;
  /** false = produced via the bundled ffmpeg convert script, not a browser export. */
  directExport: boolean;
  editors: Record<EditorId, SupportLevel>;
  /** Which browser can *produce* this export (with min version notes inline). */
  browsers: Record<BrowserId, BrowserSupport>;
  /** Real measured numbers, or null until a release is benchmarked. */
  benchmark: FormatBenchmark | null;
};

/**
 * Benchmark environment. `measuredOn`/`machine` stay null until a real
 * measurement run is recorded; the comparison table hides the size/time columns
 * while they are null rather than show placeholder numbers.
 */
export const BENCHMARK_ENV = {
  config: "1080p landscape · 30 fps · 30 s · quality: high · preset: minimal",
  machine: null as string | null,
  measuredOn: null as string | null,
} as const;

export const FORMAT_MATRIX: readonly FormatRow[] = [
  {
    id: "png-sequence",
    codecLabel: "PNG image sequence (zipped)",
    transparency: "lossless",
    directExport: true,
    editors: {
      premiere: "native",
      davinci: "native",
      finalcut: "native",
      capcut: "works",
      obs: "works",
    },
    browsers: {
      chrome: "works",
      edge: "works",
      firefox: "works",
      safari: "works",
    },
    benchmark: null,
  },
  {
    id: "webm-vp8",
    codecLabel: "WebM · VP8 + alpha",
    transparency: "compressed",
    directExport: true,
    editors: {
      premiere: "works",
      davinci: "works",
      finalcut: "unreliable",
      capcut: "works",
      obs: "native",
    },
    browsers: {
      chrome: "works",
      edge: "works",
      firefox: "works",
      // Safari before 17 has limited/unreliable WebM support.
      safari: "unreliable",
    },
    benchmark: null,
  },
  {
    id: "webm-vp9",
    codecLabel: "WebM · VP9 + alpha",
    transparency: "high",
    directExport: true,
    editors: {
      premiere: "works",
      davinci: "works",
      finalcut: "unreliable",
      capcut: "works",
      obs: "works",
    },
    browsers: {
      chrome: "works",
      edge: "works",
      // Firefox 130+ required for transparent VP9 export.
      firefox: "works",
      safari: "unsupported",
    },
    benchmark: null,
  },
  {
    id: "mov-hevc",
    codecLabel: "MOV · HEVC + alpha",
    transparency: "high",
    directExport: true,
    editors: {
      premiere: "works",
      davinci: "works",
      finalcut: "native",
      capcut: "works",
      obs: "works",
    },
    browsers: {
      chrome: "unsupported",
      edge: "unsupported",
      firefox: "unsupported",
      // HEVC + alpha export requires Safari 17.4+ on macOS.
      safari: "works",
    },
    benchmark: null,
  },
  {
    id: "prores-4444",
    codecLabel: "Apple ProRes 4444 (via ffmpeg)",
    transparency: "lossless",
    directExport: false,
    editors: {
      premiere: "native",
      davinci: "native",
      finalcut: "native",
      capcut: "unsupported",
      obs: "unsupported",
    },
    browsers: {
      chrome: "n/a",
      edge: "n/a",
      firefox: "n/a",
      safari: "n/a",
    },
    benchmark: null,
  },
] as const;

export const EDITOR_IDS: readonly EditorId[] = [
  "premiere",
  "davinci",
  "finalcut",
  "capcut",
  "obs",
];

export const BROWSER_IDS: readonly BrowserId[] = [
  "chrome",
  "edge",
  "firefox",
  "safari",
];

/** True when at least one format has a published benchmark measurement. */
export function hasBenchmarkData(rows: readonly FormatRow[] = FORMAT_MATRIX): boolean {
  return rows.some((row) => row.benchmark !== null);
}
