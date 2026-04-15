import type { GeneratorSettings } from "@/lib/generator/types";

export type LocalExportSupport = {
  hasWorkerSupport: boolean | null;
  supportsPngSequence: boolean;
  supportsWebm: boolean | null;
};

export type ExportAdvisory = {
  disabledFormats: GeneratorSettings["export"]["format"][];
  code:
    | "workerSupportError"
    | "webmUnavailableError"
    | "heavyExportWarning"
    | "pngSequenceInfo"
    | null;
  severity: "info" | "warning" | "error" | null;
};

export const WEBM_MIME_TYPES = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

export function getInitialLocalExportSupport(): LocalExportSupport {
  return {
    hasWorkerSupport: null,
    supportsPngSequence: true,
    supportsWebm: null,
  };
}

export function getLocalExportSupport(): LocalExportSupport {
  const hasWorkerSupport = typeof Worker !== "undefined";
  const supportsPngSequence =
    typeof Blob !== "undefined" && typeof URL !== "undefined";
  const supportsWebm =
    typeof MediaRecorder !== "undefined" &&
    WEBM_MIME_TYPES.some((mimeType) => MediaRecorder.isTypeSupported(mimeType));

  return {
    hasWorkerSupport,
    supportsPngSequence,
    supportsWebm,
  };
}

export function getPreferredWebmMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  return WEBM_MIME_TYPES.find((mimeType) =>
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

  if (support.hasWorkerSupport === false) {
    return {
      disabledFormats: ["webm", "gif"],
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

  const megapixels = (settings.canvas.width * settings.canvas.height) / 1_000_000;
  const projectedFrames = settings.timer.durationSeconds * settings.export.fps;

  if (megapixels >= 2 && projectedFrames >= 1500) {
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

  return {
    disabledFormats,
    code: null,
    severity: null,
  };
}
