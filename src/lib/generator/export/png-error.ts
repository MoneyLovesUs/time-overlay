import type { PngErrorCode } from "@/lib/generator/export/png-contract";

/** Error carrying a stable PNG error code and whether a resume is meaningful. */
export class PngExportError extends Error {
  readonly code: PngErrorCode;
  readonly recoverable: boolean;

  constructor(code: PngErrorCode, message: string, recoverable = false) {
    super(message);
    this.name = "PngExportError";
    this.code = code;
    this.recoverable = recoverable;
  }
}

const STORAGE_FULL_NAMES = [
  "QuotaExceededError",
  "NS_ERROR_DOM_QUOTA_REACHED",
] as const;

/**
 * Browsers report quota exhaustion with several unrelated shapes. Only treat
 * evidence of a full/quota failure as a capacity error; everything else stays a
 * write failure so the user is not told to free space when the disk is fine.
 */
export function isStorageFullError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const record = error as { name?: unknown; code?: unknown; message?: unknown };
  if (
    typeof record.name === "string" &&
    (STORAGE_FULL_NAMES as readonly string[]).includes(record.name)
  ) {
    return true;
  }
  // Legacy numeric quota code (22 in some WebKit builds).
  if (record.code === 22) {
    return true;
  }
  return (
    typeof record.message === "string" &&
    /quota|not enough (?:free )?space|disk (?:is )?full/i.test(record.message)
  );
}

export function toPngStorageError(error: unknown): PngExportError {
  if (error instanceof PngExportError) {
    return error;
  }
  if (isStorageFullError(error)) {
    return new PngExportError(
      "pngStorageFull",
      "Not enough free space to save this PNG export.",
      true,
    );
  }
  return new PngExportError(
    "pngWriteFailed",
    error instanceof Error
      ? error.message
      : "Writing the PNG export failed.",
    true,
  );
}
