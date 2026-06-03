import type { UploadedFont } from "@/lib/generator/font-loader";
import type {
  ExportProgressState,
  GeneratorFormat,
  GeneratorSettings,
} from "@/lib/generator/types";

export type ExportJobPlan = {
  format: GeneratorFormat;
  fps: number;
  totalFrames: number;
  outputFileName: string;
  getFrameFileName: (frameIndex: number) => string;
};

const FORMAT_EXTENSIONS: Record<GeneratorFormat, string> = {
  "png-sequence": "zip",
  webm: "webm",
  "webm-vp9-alpha": "webm",
  "mov-hevc-alpha": "mov",
  gif: "gif",
};

export type ExportWorkerRequest =
  | {
      kind: "export-png-sequence";
      payload: {
        settings: GeneratorSettings;
        uploadedFont?: UploadedFont;
      };
    }
  | {
      kind: "export-alpha-video";
      payload: {
        settings: GeneratorSettings;
        target: "webm-vp9" | "mov-hevc";
        uploadedFont?: UploadedFont;
      };
    };

export type ExportWorkerMessage =
  | {
      kind: "progress";
      payload: ExportProgressState;
    }
  | {
      kind: "complete";
      payload: {
        blob: Blob;
        fileName: string;
        mimeType: string;
      };
    }
  | {
      kind: "error";
      payload: {
        code?:
          | "pngSequenceFailedUnexpectedly"
          | "alphaVideoFailedUnexpectedly";
        message?: string;
      };
    };

export function createExportJobPlan({
  durationSeconds,
  fps,
  format,
}: Pick<GeneratorSettings["timer"], "durationSeconds"> &
  Pick<GeneratorSettings["export"], "fps" | "format">): ExportJobPlan {
  const totalFrames = Math.max(1, Math.round(durationSeconds * fps));
  const extension = FORMAT_EXTENSIONS[format];

  return {
    format,
    fps,
    totalFrames,
    outputFileName: `time-overlay.${extension}`,
    getFrameFileName(frameIndex) {
      return `frame-${String(frameIndex + 1).padStart(4, "0")}.png`;
    },
  };
}
