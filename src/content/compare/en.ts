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
    "For Premiere Pro and DaVinci Resolve, start with a PNG sequence; both document image-sequence workflows and preserve the exported alpha channel. For Final Cut Pro, use MOV with HEVC alpha (Pro) or convert the PNG frames to ProRes 4444. For OBS and Streamlabs, WebM with alpha is the practical single-file choice. The one-file alpha formats need Pro; the PNG sequence is free and still carries transparency. CapCut support varies by platform and version, so test a short PNG or WebM export before committing to a long render. The table below separates documented paths from formats that need verification in your exact setup.",
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
        "The safest browser export for professional editing. Premiere Pro and DaVinci Resolve document image-sequence import, and PNG preserves lossless transparency.",
      weakness:
        "It is a folder of frames rather than a single clip. Final Cut and CapCut may require a different still-image or conversion workflow, so verify timing before a deadline.",
      verdict:
        "Pick this first for Premiere or Resolve. For Final Cut, convert it to ProRes 4444 when you want one timeline-ready file.",
    },
    "webm-vp8": {
      name: "WebM (VP8 + alpha)",
      bestFor:
        "Quick streaming overlays. Drops into OBS and Streamlabs as a Media Source with the background already cut out, and plays back cheaply.",
      weakness:
        "More compressed alpha edges than VP9. Adobe, Blackmagic, and Apple documentation do not establish this WebM-alpha file as a dependable native editing path.",
      verdict:
        "The fast single-file path for streaming. For editing, use PNG or a documented professional codec.",
    },
    "webm-vp9": {
      name: "WebM (VP9 + alpha) · Pro",
      bestFor:
        "A smaller single transparent video file for OBS and browser-based workflows where VP9 alpha has been tested.",
      weakness:
        "Cannot be exported in Safari, and single-file alpha video needs Pro. Native alpha import is not documented as a dependable route in Premiere Pro, DaVinci Resolve, or Final Cut Pro.",
      verdict:
        "Use it for OBS when file size matters. Free users get the same transparency from a PNG sequence.",
    },
    "mov-hevc": {
      name: "MOV (HEVC + alpha) · Pro",
      bestFor:
        "Apple workflows. Apple documents HEVC with alpha as a transparent media path for Final Cut Pro.",
      weakness:
        "Needs Pro, and can only be exported from Safari 17.4+ on macOS. Treat Premiere, Resolve, and CapCut compatibility as version-dependent until tested locally.",
      verdict:
        "The right direct single-file format for Final Cut on a supported Mac. On the free plan, export PNG and convert to ProRes 4444 instead.",
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
  benchmarkTestedTemplate: "Tested · {config}",
  bestForLabel: "Best for:",
  watchOutLabel: "Watch out:",
  markdownComparisonHeading: "Comparison",
  markdownFormatNotesHeading: "Format notes",
  ctaGeneratorLabel: "Open the Time Overlay generator",
  ctaGuidesLabel: "See the editor guides",
  faqTitle: "Format FAQ",
  faqItems: [
    {
      question: "What is the best transparent timer overlay format for video editing?",
      answer:
        "A PNG sequence is the safest direct browser export for editing, and it is free. Premiere Pro and DaVinci Resolve document image-sequence workflows. For a single professional editing file, convert the frames to ProRes 4444. Final Cut users on supported Macs can also choose MOV with HEVC alpha, which needs Pro.",
    },
    {
      question: "Which transparent video format works in Final Cut Pro?",
      answer:
        "On a supported Mac, use MOV with HEVC alpha (Pro) or convert the PNG sequence to ProRes 4444 for Final Cut Pro. Apple documents both codecs as supporting alpha. Do not depend on a WebM-alpha editing workflow unless you have tested it in your exact version.",
    },
    {
      question: "What transparent overlay format should I use for OBS?",
      answer:
        "Export WebM (with alpha) for OBS or Streamlabs and add it as a Media Source. The original VP8 export is free; the smaller VP9 single-file variant needs Pro. If playback is heavy, make a shorter overlay or reduce resolution and frame rate, then verify looping and transparency in a test scene.",
    },
    {
      question: "Do I need ProRes 4444 for a transparent timer overlay?",
      answer:
        "Only when you need a lossless alpha master inside a professional editor. ProRes 4444 is converted from the PNG sequence with the bundled ffmpeg script. For most edits, the PNG sequence itself is already lossless and sufficient.",
    },
  ],
} satisfies ComparePageContent;

export default compareContent;
