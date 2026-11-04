import type { UploadedFont } from "@/lib/generator/font-loader";
import type {
  ExportProgressState,
  GeneratorFormat,
  GeneratorSettings,
} from "@/lib/generator/types";
import type {
  PngPreflightPayload,
  PngStartPayload,
  PngWorkerResponse,
} from "@/lib/generator/export/png-contract";

export type ExportJobPlan = {
  format: GeneratorFormat;
  fps: number;
  totalFrames: number;
  outputFileName: string;
  getFrameFileName: (frameIndex: number) => string;
};

const FORMAT_EXTENSIONS: Record<GeneratorFormat, string> = {
  mp4: "mp4",
  "png-sequence": "zip",
  webm: "webm",
  "webm-vp9-alpha": "webm",
  "mov-hevc-alpha": "mov",
  gif: "gif",
};

export type ExportWorkerRequest =
  | {
      kind: "export-mp4";
      payload: {
        settings: GeneratorSettings;
        uploadedFont?: UploadedFont;
        enablePreview?: boolean;
        // When OPFS is unavailable for a long export: desktop may buffer it in
        // memory; phones get mp4StorageUnavailable instead of crashing.
        allowInMemoryFallback?: boolean;
      };
    }
  | {
      kind: "export-alpha-video";
      payload: {
        settings: GeneratorSettings;
        target: "webm-vp9" | "mov-hevc";
        uploadedFont?: UploadedFont;
        enablePreview?: boolean;
      };
    }
  | {
      kind: "png-preflight";
      jobId: string;
      attemptId: string;
      payload: PngPreflightPayload;
    }
  | {
      // The frozen configuration and destination are fixed before this request;
      // editing the UI afterwards cannot change the running job.
      kind: "png-start";
      payload: PngStartPayload;
    }
  | {
      kind: "png-resume";
      payload: PngStartPayload;
    }
  | {
      kind: "cancel-png";
      jobId: string;
      attemptId: string;
    }
  | {
      // One outstanding preview at a time; without an ack the worker skips new
      // snapshots instead of letting bitmaps pile up on the main thread.
      kind: "png-preview-ack";
      jobId: string;
      attemptId: string;
    };

export type ExportWorkerMessage =
  | {
      kind: "progress";
      payload: ExportProgressState;
    }
  | {
      // A downscaled snapshot of the frame currently being encoded. Sent on a
      // throttled cadence so the UI can show the export visibly "growing" during
      // the wait. Best-effort: the worker omits it when createImageBitmap is
      // unavailable, and the host degrades to a bar-only view.
      kind: "preview";
      jobId?: string;
      attemptId?: string;
      payload: {
        bitmap: ImageBitmap;
        frameIndex: number;
      };
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
          | "mp4FailedUnexpectedly"
          | "mp4StorageUnavailable"
          | "mp4StorageFull"
          | "alphaVideoFailedUnexpectedly";
        message?: string;
      };
    }
  | PngWorkerResponse;

export function createExportJobPlan({
  durationSeconds,
  fps,
  format,
}: Pick<GeneratorSettings["timer"], "durationSeconds"> &
  Pick<GeneratorSettings["export"], "fps" | "format">): ExportJobPlan {
  const totalFrames = Math.max(1, Math.round(durationSeconds * fps));
  const extension = FORMAT_EXTENSIONS[format];
  const frameNameWidth = Math.max(4, String(totalFrames).length);

  return {
    format,
    fps,
    totalFrames,
    outputFileName: `time-overlay.${extension}`,
    getFrameFileName(frameIndex) {
      return `frame-${String(frameIndex + 1).padStart(frameNameWidth, "0")}.png`;
    },
  };
}
