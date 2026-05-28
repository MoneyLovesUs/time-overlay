import type { GeneratorSettings } from "@/lib/generator/types";

export type LocalExportSupport = {
  hasWorkerSupport: boolean | null;
  supportsPngSequence: boolean;
  supportsWebm: boolean | null;
  supportsVp9Alpha: boolean | null;
  supportsHevcAlpha: boolean | null;
};

export type ExportAdvisory = {
  disabledFormats: GeneratorSettings["export"]["format"][];
  code:
    | "workerSupportError"
    | "webmUnavailableError"
    | "vp9AlphaUnavailableError"
    | "hevcAlphaUnavailableError"
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
export const ALPHA_WEBM_MIME_TYPES = [
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

const VP9_ALPHA_CODEC = "vp09.00.10.08";
const HEVC_ALPHA_CODEC = "hvc1.2.4.L120.B0";

export function getInitialLocalExportSupport(): LocalExportSupport {
  return {
    hasWorkerSupport: null,
    supportsPngSequence: true,
    supportsWebm: null,
    supportsVp9Alpha: null,
    supportsHevcAlpha: null,
  };
}

function detectMediaRecorderWebm() {
  if (typeof MediaRecorder === "undefined") {
    return false;
  }

  return WEBM_MIME_TYPES.some((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );
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
    typeof Blob !== "undefined" && typeof URL !== "undefined";
  const supportsWebm = detectMediaRecorderWebm();

  return {
    hasWorkerSupport,
    supportsPngSequence,
    supportsWebm,
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

export function getPreferredWebmMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  return WEBM_MIME_TYPES.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  ) ?? null;
}

export function getPreferredAlphaWebmMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  return ALPHA_WEBM_MIME_TYPES.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  ) ?? null;
}

export function getExportAdvisory(
  settings: GeneratorSettings,
  support: LocalExportSupport,
): ExportAdvisory {
  const disabledFormats: GeneratorSettings["export"]["format"][] = [];

  if (support.supportsWebm === false) {
    disabledFormats.push("webm");
  }
  if (support.supportsVp9Alpha === false) {
    disabledFormats.push("webm-vp9-alpha");
  }
  if (support.supportsHevcAlpha === false) {
    disabledFormats.push("mov-hevc-alpha");
  }

  if (support.hasWorkerSupport === false) {
    return {
      disabledFormats: ["webm", "webm-vp9-alpha", "mov-hevc-alpha", "gif"],
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

  const megapixels = (settings.canvas.width * settings.canvas.height) / 1_000_000;
  const projectedFrames = settings.timer.durationSeconds * settings.export.fps;

  if (megapixels >= 4 || (megapixels >= 2 && projectedFrames >= 1500)) {
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
