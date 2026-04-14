import type { ExportProgressState, GeneratorFormat, GeneratorSettings } from "@/lib/generator/types";

export type ExportJobPlan = {
  format: GeneratorFormat;
  fps: number;
  totalFrames: number;
  outputFileName: string;
  getFrameFileName: (frameIndex: number) => string;
};

export type ExportWorkerRequest = {
  kind: "export-png-sequence";
  payload: {
    settings: GeneratorSettings;
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
        message: string;
      };
    };

export function createExportJobPlan({
  durationSeconds,
  fps,
  format,
}: Pick<GeneratorSettings["timer"], "durationSeconds"> &
  Pick<GeneratorSettings["export"], "fps" | "format">): ExportJobPlan {
  const totalFrames = Math.max(1, Math.round(durationSeconds * fps));
  const extension = format === "webm" ? "webm" : "zip";

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

export function getExportProgressMessage(
  completedFrames: number,
  totalFrames: number,
) {
  return `Rendering frame ${completedFrames} of ${totalFrames}`;
}
