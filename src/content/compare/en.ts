import { CONTENT_YEAR } from "@/lib/site";

import type { ComparePageContent } from "./types";

const compareContent = {
  metadata: {
    title: `Best transparent timer overlay export format for video editors (${CONTENT_YEAR})`,
    description:
      "Compare transparent timer overlay export formats — PNG sequence, WebM/MOV with alpha, and ProRes 4444 — by editor support, browser support, and quality.",
  },
  breadcrumbLabel: "Format comparison",
  eyebrow: "Format comparison",
  h1: `Best transparent overlay export format for each editor in ${CONTENT_YEAR}`,
  leadAnswer:
    "For most editors, export a PNG sequence — it is the most reliable transparent timer-overlay format and imports losslessly into Premiere Pro, DaVinci Resolve, Final Cut Pro, and CapCut. Use WebM (VP9 + alpha) when you want a single transparent video file for Chrome or Firefox workflows and OBS, and MOV (HEVC + alpha) on Safari and macOS, where it is the native pick for Final Cut Pro. Convert the PNG sequence to ProRes 4444 only when you need a lossless master inside a professional editor. The table below compares every Time Overlay export format by editor support, browser support, and transparency quality.",
  tableCaption: `Transparent timer overlay export formats compared by editor and browser support (${CONTENT_YEAR}).`,
  columns: {
    format: "Format",
    transparency: "Transparency",
    browsers: "Exports in",
    bestFor: "Best for",
  },
  transparencyLabels: {
    lossless: "Lossless",
    high: "High",
    compressed: "Compressed",
  },
  supportLabels: {
    native: "Native",
    works: "Works",
    unreliable: "Unreliable",
    unsupported: "No",
    "n/a": "—",
  },
  editorLabels: {
    premiere: "Premiere Pro",
    davinci: "DaVinci Resolve",
    finalcut: "Final Cut Pro",
    capcut: "CapCut",
    obs: "OBS / Streamlabs",
  },
  browserLabels: {
    chrome: "Chrome",
    edge: "Edge",
    firefox: "Firefox",
    safari: "Safari",
  },
  formats: {
    "png-sequence": {
      name: "PNG sequence",
      bestFor:
        "The default for any editor. Master-grade, lossless transparency that Premiere, DaVinci, and Final Cut import natively as an image sequence.",
      weakness:
        "Largest on disk and a folder of frames rather than a single file. Silent — no embedded audio.",
      verdict:
        "Pick this first unless you specifically need a single video file. It is the most reliable transparent handoff and works in every browser.",
    },
    "webm-vp8": {
      name: "WebM (VP8 + alpha)",
      bestFor:
        "Quick streaming overlays. Drops into OBS and Streamlabs as a Media Source with the background already cut out, and plays back cheaply.",
      weakness:
        "More compressed alpha edges than VP9, and unreliable in Safari before 17 and inside Final Cut Pro on macOS.",
      verdict:
        "The fast single-file path for streaming. For editing, prefer VP9 or a PNG sequence.",
    },
    "webm-vp9": {
      name: "WebM (VP9 + alpha)",
      bestFor:
        "A single transparent video file for Chrome, Edge, and Firefox 130+ workflows, OBS, CapCut, and Premiere or DaVinci.",
      weakness:
        "Cannot be exported in Safari, and Final Cut Pro playback on macOS is unreliable.",
      verdict:
        "The best single-file transparent format on non-Apple platforms. On macOS, reach for HEVC or PNG instead.",
    },
    "mov-hevc": {
      name: "MOV (HEVC + alpha)",
      bestFor:
        "Apple workflows. The native transparent video pick for Final Cut Pro, and clean inside Premiere and DaVinci on macOS.",
      weakness:
        "Can only be exported from Safari 17.4+ on macOS — not available in Chrome, Edge, or Firefox.",
      verdict:
        "The right single-file format if you are on a Mac in Safari. Off Apple, use VP9.",
    },
    "prores-4444": {
      name: "ProRes 4444 (via ffmpeg)",
      bestFor:
        "A lossless alpha master inside Premiere, DaVinci, or Final Cut, converted from a PNG sequence with the bundled script.",
      weakness:
        "Not a direct browser export and very large on disk. Not meant for CapCut or live streaming software.",
      verdict:
        "Use only when you need a true lossless master in a pro editor. Otherwise the PNG sequence is enough.",
    },
  },
  benchmarkPendingNote:
    "File-size and export-time benchmarks are measured per release and published here once recorded.",
  ctaGeneratorLabel: "Open the Time Overlay generator",
  ctaGuidesLabel: "See the editor guides",
  faqTitle: "Format FAQ",
  faqItems: [
    {
      question:
        "What is the best transparent timer overlay format for video editing?",
      answer:
        "A PNG sequence is the most reliable transparent timer-overlay format for editing. Premiere Pro, DaVinci Resolve, and Final Cut Pro import it natively with lossless, unambiguous alpha. Use WebM (VP9 + alpha) or MOV (HEVC + alpha) when you specifically want a single video file instead of a folder of frames.",
    },
    {
      question: "Which transparent video format works in Final Cut Pro?",
      answer:
        "On macOS, use a PNG sequence or MOV (HEVC + alpha) for Final Cut Pro. WebM playback inside Final Cut is historically unreliable, so avoid VP8/VP9 WebM there. HEVC + alpha exports from Safari 17.4+ and imports as native transparent media.",
    },
    {
      question: "What transparent overlay format should I use for OBS?",
      answer:
        "Export WebM (with alpha) for OBS or Streamlabs — it drops in as a Media Source with the background already cut out. If playback is heavy, fall back to a PNG sequence routed through an Image Slideshow Source; the transparency is identical.",
    },
    {
      question: "Do I need ProRes 4444 for a transparent timer overlay?",
      answer:
        "Only when you need a lossless alpha master inside a professional editor. ProRes 4444 is converted from the PNG sequence with the bundled ffmpeg script. For most edits, the PNG sequence itself is already lossless and sufficient.",
    },
  ],
} satisfies ComparePageContent;

export default compareContent;
