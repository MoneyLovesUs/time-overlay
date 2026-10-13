import type { GeneratorSettings } from "@/lib/generator/types";
import type { ClientDeviceType } from "@/lib/analytics/environment";
import {
  ALPHA_WEBM_VIDEO_MIME_TYPES,
  getPreferredAlphaWebmMimeType as selectAlphaWebmMimeType,
} from "@/lib/generator/export/webm-mime";
import { canEncodeVideo } from "mediabunny";

export type LocalExportSupport = {
  hasWorkerSupport: boolean | null;
  supportsPngSequence: boolean;
  supportsWebm: boolean | null;
  supportsWebmAudio: boolean | null;
  supportsVp9Alpha: boolean | null;
  supportsHevcAlpha: boolean | null;
  /**
   * Populated asynchronously by probeMp4ExportSupport; stays undefined while
   * the probe is in flight so mp4 is neither offered nor disabled yet.
   */
  supportsMp4?: boolean | null;
};

export type ExportAdvisory = {
  disabledFormats: GeneratorSettings["export"]["format"][];
  code:
    | "workerSupportError"
    | "webmUnavailableError"
    | "webmAudioUnavailableError"
    | "vp9AlphaUnavailableError"
    | "hevcAlphaUnavailableError"
    | "mobileExportLimitError"
    | "webmRealtimeWarning"
    | "heavyExportWarning"
    | "pngSequenceInfo"
    | "vp9AlphaInfo"
    | "hevcAlphaInfo"
    | null;
  severity: "info" | "warning" | "error" | null;
};

export const WEBM_MIME_TYPES = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

/**
 * VP8 is preferred when we need alpha because Chromium's MediaRecorder pipeline
 * preserves the canvas alpha channel for VP8 but currently strips it for VP9.
 */
export const ALPHA_WEBM_MIME_TYPES = ALPHA_WEBM_VIDEO_MIME_TYPES;

const VP9_ALPHA_CODEC = "vp09.00.10.08";
const HEVC_ALPHA_CODEC = "hvc1.2.4.L120.B0";

export function getInitialLocalExportSupport(): LocalExportSupport {
  return {
    hasWorkerSupport: null,
    supportsPngSequence: true,
    supportsWebm: null,
    supportsWebmAudio: null,
    supportsVp9Alpha: null,
    supportsHevcAlpha: null,
  };
}

function detectMediaRecorderWebm() {
  return selectAlphaWebmMimeType(false) !== null;
}

/**
 * WebM export feeds canvas frames through `canvas.captureStream()`, which iOS
 * Safari and the WebKit-backed iOS Chrome do not implement even when
 * MediaRecorder reports a supported mime type. Probing it up front lets the
 * advisory disable WebM *before* the click, instead of letting the export throw
 * mid-run and surface as a silent export_failed.
 */
export function detectCanvasCaptureStream(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    return typeof canvas.captureStream === "function";
  } catch {
    return false;
  }
}

async function detectAlphaCodec(codec: string) {
  if (typeof VideoEncoder === "undefined") {
    return false;
  }

  try {
    const result = await VideoEncoder.isConfigSupported({
      codec,
      width: 640,
      height: 360,
      bitrate: 1_000_000,
      framerate: 30,
      alpha: "keep",
    });
    return Boolean(result.supported);
  } catch {
    return false;
  }
}

export function getLocalExportSupport(): LocalExportSupport {
  const hasWorkerSupport = typeof Worker !== "undefined";
  const supportsPngSequence =
    hasWorkerSupport && typeof Blob !== "undefined" && typeof URL !== "undefined";
  // Both a usable WebM mime type AND captureStream are required; either missing
  // means the WebM path cannot complete in this browser.
  const supportsWebm = detectMediaRecorderWebm() && detectCanvasCaptureStream();

  return {
    hasWorkerSupport,
    supportsPngSequence,
    supportsWebm,
    supportsWebmAudio:
      supportsWebm &&
      typeof AudioContext !== "undefined" &&
      typeof OfflineAudioContext !== "undefined" &&
      selectAlphaWebmMimeType(true) !== null,
    supportsVp9Alpha: null,
    supportsHevcAlpha: null,
  };
}

export async function probeAlphaExportSupport(): Promise<{
  supportsVp9Alpha: boolean;
  supportsHevcAlpha: boolean;
}> {
  const [supportsVp9Alpha, supportsHevcAlpha] = await Promise.all([
    detectAlphaCodec(VP9_ALPHA_CODEC),
    detectAlphaCodec(HEVC_ALPHA_CODEC),
  ]);

  return { supportsVp9Alpha, supportsHevcAlpha };
}

/**
 * MP4 export relies on the platform H.264 encoder. Probing at a common phone
 * resolution up front lets the advisory disable mp4 before the user commits to
 * an export that would otherwise fail mid-run.
 */
export async function probeMp4ExportSupport(): Promise<boolean> {
  try {
    return await canEncodeVideo("avc", { width: 1280, height: 720 });
  } catch {
    return false;
  }
}

export function getPreferredWebmMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  return WEBM_MIME_TYPES.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  ) ?? null;
}

export function getPreferredAlphaWebmMimeType() {
  return selectAlphaWebmMimeType(false);
}

export function getExportAdvisory(
  settings: GeneratorSettings,
  support: LocalExportSupport,
  deviceType: ClientDeviceType = "desktop",
): ExportAdvisory {
  const disabledFormats: GeneratorSettings["export"]["format"][] = [];

  if (support.hasWorkerSupport === false) {
    disabledFormats.push(
      "mp4",
      "png-sequence",
      "webm-vp9-alpha",
      "mov-hevc-alpha",
      "gif",
    );
  }

  if (support.supportsWebm === false) {
    disabledFormats.push("webm");
  }
  if (support.supportsVp9Alpha === false) {
    disabledFormats.push("webm-vp9-alpha");
  }
  if (support.supportsHevcAlpha === false) {
    disabledFormats.push("mov-hevc-alpha");
  }
  if (support.supportsMp4 === false) {
    disabledFormats.push("mp4");
  }

  if (
    support.hasWorkerSupport === false &&
    settings.export.format !== "webm"
  ) {
    return {
      disabledFormats,
      code: "workerSupportError",
      severity: "error",
    };
  }

  if (settings.export.format === "webm" && support.supportsWebm === false) {
    return {
      disabledFormats,
      code: "webmUnavailableError",
      severity: "error",
    };
  }

  if (
    settings.export.format === "webm" &&
    settings.audio.variant !== "none" &&
    support.supportsWebmAudio === false
  ) {
    return {
      disabledFormats,
      code: "webmAudioUnavailableError",
      severity: "error",
    };
  }

  if (
    settings.export.format === "webm-vp9-alpha" &&
    support.supportsVp9Alpha === false
  ) {
    return {
      disabledFormats,
      code: "vp9AlphaUnavailableError",
      severity: "error",
    };
  }

  if (
    settings.export.format === "mov-hevc-alpha" &&
    support.supportsHevcAlpha === false
  ) {
    return {
      disabledFormats,
      code: "hevcAlphaUnavailableError",
      severity: "error",
    };
  }

  const canvasPixels = settings.canvas.width * settings.canvas.height;
  const projectedFrames = settings.timer.durationSeconds * settings.export.fps;
  const pixelFrames = canvasPixels * projectedFrames;
  const isMobileDevice = deviceType === "mobile" || deviceType === "tablet";

  if (
    isMobileDevice &&
    (settings.timer.durationSeconds > 60 ||
      canvasPixels > 1920 * 1080 ||
      pixelFrames > 1_900_000_000)
  ) {
    return {
      disabledFormats,
      code: "mobileExportLimitError",
      severity: "error",
    };
  }

  if (
    deviceType === "desktop" &&
    settings.export.format === "webm" &&
    settings.timer.durationSeconds > 60
  ) {
    return {
      disabledFormats,
      code: "webmRealtimeWarning",
      severity: "warning",
    };
  }

  if (
    deviceType === "desktop" &&
    (pixelFrames >= 4_000_000_000 || canvasPixels >= 4_000_000)
  ) {
    return {
      disabledFormats,
      code: "heavyExportWarning",
      severity: "warning",
    };
  }

  if (settings.export.format === "png-sequence") {
    return {
      disabledFormats,
      code: "pngSequenceInfo",
      severity: "info",
    };
  }

  if (settings.export.format === "webm-vp9-alpha") {
    return {
      disabledFormats,
      code: "vp9AlphaInfo",
      severity: "info",
    };
  }

  if (settings.export.format === "mov-hevc-alpha") {
    return {
      disabledFormats,
      code: "hevcAlphaInfo",
      severity: "info",
    };
  }

  return {
    disabledFormats,
    code: null,
    severity: null,
  };
}
