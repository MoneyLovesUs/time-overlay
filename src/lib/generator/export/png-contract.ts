import type { UploadedFont } from "@/lib/generator/font-loader";
import type { GeneratorSettings } from "@/lib/generator/types";

/**
 * Wire contract for PNG-sequence exports.
 *
 * Every PNG request and response carries a jobId plus the attemptId of the run
 * that produced it. A resumed job keeps its jobId but gets a new attemptId, so
 * messages from a terminated worker can be recognised and dropped by the host
 * instead of being mistaken for progress from the current run.
 */

export type PngOutputMode = "directory" | "opfs" | "memory";

export type PngPartDescriptor = {
  /** 1-based part number used by timer-part-NNN.zip. */
  partNumber: number;
  fileName: string;
  /** Inclusive, 0-based global frame index of the first frame in this part. */
  firstFrameIndex: number;
  /** Exclusive, 0-based global frame index after the last frame. */
  nextFrameIndex: number;
  bytes: number;
  entryCount: number;
  /** SHA-256 (hex) of the bounded ZIP central directory + EOCD. */
  directoryDigest: string;
  /** Byte offset of the central directory inside the part. */
  directoryOffset: number;
  /** Length of the central directory + EOCD region. */
  directorySize: number;
  /** Fixed frame-file width used by every entry in this part. */
  frameNameWidth: number;
};

export type PngResumePoint = {
  nextFrameIndex: number;
  nextPartNumber: number;
  parts: PngPartDescriptor[];
};

export type PngStartPayload = {
  jobId: string;
  attemptId: string;
  settings: GeneratorSettings;
  uploadedFont?: UploadedFont;
  rendererVersion: string;
  outputMode: PngOutputMode;
  /**
   * Directory mode: the exclusive task subdirectory (time-overlay-<jobId>),
   * already created inside the directory the user picked.
   */
  outputDirectory?: FileSystemDirectoryHandle;
  /** Directory name inside the picked parent, for the completion copy. */
  outputDirectoryName?: string;
  resumeFrom?: PngResumePoint;
  enablePreview: boolean;
};

export type PngPreflightPayload = {
  settings: GeneratorSettings;
  uploadedFont?: UploadedFont;
  rendererVersion: string;
  enablePreview: boolean;
};

export type PngPreflightResult = {
  totalFrames: number;
  frameNameWidth: number;
  sampleCount: number;
  estimatedArchiveBytes: number | null;
  estimatedElapsedMs: number | null;
  estimatedParts: number | null;
  /** Result of an actual temp-file write/read/delete probe, not API presence. */
  opfsWritable: boolean;
};

export type PngProgressStage =
  | "preparing"
  | "rendering"
  | "writing"
  | "closing"
  | "validating"
  | "checkpointing"
  | "finalizing";

export type PngProgressPayload = {
  stage: PngProgressStage;
  processedFrames: number;
  committedFrames: number;
  currentPart: number;
  bytesWritten: number;
};

export type PngErrorCode =
  | "pngStorageUnavailable"
  | "pngDirectoryPermissionDenied"
  | "pngStorageFull"
  | "pngWriteFailed"
  | "pngZipValidationFailed"
  | "pngFrameTooLarge"
  | "pngMemoryLimitExceeded"
  | "pngResumeVersionMismatch"
  | "pngResumeFileMissing"
  | "pngLocked"
  | "pngCheckpointFailed"
  | "pngFailedUnexpectedly";

export type PngWorkerResponse =
  | {
      kind: "png-preflight-result";
      jobId: string;
      attemptId: string;
      payload: PngPreflightResult;
    }
  | {
      kind: "png-progress";
      jobId: string;
      attemptId: string;
      payload: PngProgressPayload;
    }
  | {
      kind: "png-part-committed";
      jobId: string;
      attemptId: string;
      payload: {
        part: PngPartDescriptor;
        nextFrameIndex: number;
      };
    }
  | {
      kind: "png-complete";
      jobId: string;
      attemptId: string;
      payload: {
        outputMode: PngOutputMode;
        parts: PngPartDescriptor[];
        totalFrames: number;
        totalBytes: number;
        outputDirectoryName?: string;
        /** Memory mode only: the bounded single archive. */
        blob?: Blob;
      };
    }
  | {
      kind: "png-cancelled";
      jobId: string;
      attemptId: string;
      payload: {
        committedParts: PngPartDescriptor[];
        resumeAvailable: boolean;
      };
    }
  | {
      kind: "png-error";
      jobId: string;
      attemptId: string;
      payload: {
        errorCode: PngErrorCode;
        recoverable: boolean;
        committedParts: PngPartDescriptor[];
        message?: string;
      };
    };

export const PNG_RENDERER_VERSION = "time-overlay-png-2";

/** Host copy of the error code list, used to validate worker payloads. */
export const PNG_ERROR_CODES: readonly PngErrorCode[] = [
  "pngStorageUnavailable",
  "pngDirectoryPermissionDenied",
  "pngStorageFull",
  "pngWriteFailed",
  "pngZipValidationFailed",
  "pngFrameTooLarge",
  "pngMemoryLimitExceeded",
  "pngResumeVersionMismatch",
  "pngResumeFileMissing",
  "pngLocked",
  "pngCheckpointFailed",
  "pngFailedUnexpectedly",
];

export function isPngWorkerResponse(
  message: { kind: string },
): message is PngWorkerResponse {
  return (
    message.kind === "png-preflight-result" ||
    message.kind === "png-progress" ||
    message.kind === "png-part-committed" ||
    message.kind === "png-complete" ||
    message.kind === "png-cancelled" ||
    message.kind === "png-error"
  );
}
