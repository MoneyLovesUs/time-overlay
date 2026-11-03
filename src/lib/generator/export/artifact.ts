export const OUTPUT_VALIDATION_FAILED = "outputValidationFailed" as const;

type ArtifactKind = "mov" | "unknown" | "webm" | "zip";

export class ArtifactValidationError extends Error {
  readonly code = OUTPUT_VALIDATION_FAILED;

  constructor(message: string) {
    super(message);
    this.name = "ArtifactValidationError";
  }
}

function inferArtifactKind(mimeType: string, fileName?: string): ArtifactKind {
  const normalizedMimeType = mimeType.split(";", 1)[0]?.trim().toLowerCase();
  const normalizedFileName = fileName?.trim().toLowerCase();

  if (
    normalizedMimeType === "application/zip" ||
    normalizedMimeType === "application/x-zip-compressed" ||
    normalizedFileName?.endsWith(".zip")
  ) {
    return "zip";
  }

  if (
    normalizedMimeType === "video/webm" ||
    normalizedFileName?.endsWith(".webm")
  ) {
    return "webm";
  }

  if (
    normalizedMimeType === "video/quicktime" ||
    normalizedFileName?.endsWith(".mov")
  ) {
    return "mov";
  }

  return "unknown";
}

function hasBytes(actual: Uint8Array, expected: readonly number[], offset = 0) {
  return expected.every((byte, index) => actual[offset + index] === byte);
}

function isZipSignature(header: Uint8Array) {
  return (
    hasBytes(header, [0x50, 0x4b, 0x03, 0x04]) ||
    hasBytes(header, [0x50, 0x4b, 0x05, 0x06]) ||
    hasBytes(header, [0x50, 0x4b, 0x07, 0x08])
  );
}

const ZIP_EOCD_SIGNATURE = [0x50, 0x4b, 0x05, 0x06] as const;
const ZIP_EOCD_SEARCH_BYTES = 65_557;

/**
 * Bounded tail read: the ZIP comment can be up to 64 KiB, but the whole
 * archive is never loaded. An empty archive or a missing EOCD is rejected.
 */
async function hasZipEndOfCentralDirectory(blob: Blob): Promise<boolean> {
  const start = Math.max(0, blob.size - ZIP_EOCD_SEARCH_BYTES);
  const tail = new Uint8Array(await blob.slice(start).arrayBuffer());
  for (let offset = tail.length - 22; offset >= 0; offset -= 1) {
    if (
      hasBytes(tail, ZIP_EOCD_SIGNATURE, offset) &&
      (tail[offset + 10] | (tail[offset + 11] << 8)) > 0
    ) {
      return true;
    }
  }
  return false;
}

function invalidArtifact(format: string): never {
  throw new ArtifactValidationError(
    `The generated ${format} file is invalid. Please try exporting again.`,
  );
}

export async function validateExportArtifact(
  blob: Blob,
  mimeType: string,
  fileName?: string,
): Promise<void> {
  if (blob.size === 0) {
    throw new ArtifactValidationError(
      "The generated file is empty. Please try exporting again.",
    );
  }

  const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());

  switch (inferArtifactKind(mimeType, fileName)) {
    case "zip":
      if (!isZipSignature(header) || !(await hasZipEndOfCentralDirectory(blob))) {
        invalidArtifact("ZIP");
      }
      return;
    case "webm":
      if (!hasBytes(header, [0x1a, 0x45, 0xdf, 0xa3])) {
        invalidArtifact("WebM");
      }
      return;
    case "mov":
      if (!hasBytes(header, [0x66, 0x74, 0x79, 0x70], 4)) {
        invalidArtifact("MOV");
      }
      return;
    case "unknown":
      return;
  }
}
