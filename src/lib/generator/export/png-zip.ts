import { Zip, ZipPassThrough } from "fflate";

import type { PngPartDescriptor } from "@/lib/generator/export/png-contract";
import { PngExportError } from "@/lib/generator/export/png-error";
import {
  PNG_PART_MAX_BYTES,
  PNG_PART_MAX_PNG_COUNT,
} from "@/lib/generator/export/png-limits";
import { getPngFrameFileName } from "@/lib/generator/export/png-naming";
import type { PngPartSink } from "@/lib/generator/export/png-sinks";

/**
 * Exact ZIP size accounting and a backpressured part writer.
 *
 * fflate's output callback is synchronous, so a Promise-returning `ondata`
 * would not make the ZIP wait. This writer instead collects only the chunks one
 * `add`/`push` produced, awaits the sink, then clears them. At most the current
 * frame and the current central directory are ever held.
 *
 * Byte layout for each entry (fflate uses a data descriptor, stored entries):
 *   30 local header + name + data + 16 descriptor
 *   46 central directory header + name
 * plus one 22-byte EOCD for the archive.
 */

const LOCAL_HEADER_BYTES = 30;
const DATA_DESCRIPTOR_BYTES = 16;
const CENTRAL_HEADER_BYTES = 46;
const EOCD_BYTES = 22;

const textEncoder = new TextEncoder();

/** Bytes an entry writes immediately (local header, data, descriptor). */
export function getZipLocalEntryBytes(
  name: string,
  dataLength: number,
): number {
  const nameBytes = textEncoder.encode(name).byteLength;
  return (
    LOCAL_HEADER_BYTES + nameBytes + dataLength + DATA_DESCRIPTOR_BYTES
  );
}

/** Bytes an entry contributes to the central directory written at close. */
export function getZipCentralEntryBytes(name: string): number {
  return CENTRAL_HEADER_BYTES + textEncoder.encode(name).byteLength;
}

/** Bytes one complete entry adds to a part, including its CD header. */
export function getZipEntryBytes(name: string, dataLength: number): number {
  return (
    getZipLocalEntryBytes(name, dataLength) + getZipCentralEntryBytes(name)
  );
}

export function getHelperEntryBytes(
  helperFiles: readonly PngZipHelperFile[],
): number {
  return helperFiles.reduce(
    (total, file) => total + getZipEntryBytes(file.name, file.bytes.byteLength),
    0,
  );
}

export function getHelperBytesSplit(
  helperFiles: readonly PngZipHelperFile[],
): { localBytes: number; centralBytes: number } {
  return helperFiles.reduce(
    (total, file) => ({
      localBytes:
        total.localBytes +
        getZipLocalEntryBytes(file.name, file.bytes.byteLength),
      centralBytes:
        total.centralBytes + getZipCentralEntryBytes(file.name),
    }),
    { localBytes: 0, centralBytes: 0 },
  );
}

/**
 * Exact complete part size after adding one frame. The sink has only written
 * local entries so far; every previous entry's central-directory bytes are
 * still pending until close, so they must be counted explicitly. Helpers are
 * split the same way. Missing those bytes made a part exceed 512 MiB.
 */
export function getPngPartProjectedBytes({
  sinkBytes,
  centralDirectoryBytes,
  frameName,
  dataLength,
  helperLocalBytes,
  helperCentralBytes,
}: {
  sinkBytes: number;
  centralDirectoryBytes: number;
  frameName: string;
  dataLength: number;
  helperLocalBytes: number;
  helperCentralBytes: number;
}): number {
  return (
    sinkBytes +
    centralDirectoryBytes +
    getZipLocalEntryBytes(frameName, dataLength) +
    getZipCentralEntryBytes(frameName) +
    helperLocalBytes +
    helperCentralBytes +
    EOCD_BYTES
  );
}

/** Complete size of a ZIP made only of these entries. */
export function getZipArchiveBytes(
  entries: readonly { name: string; dataLength: number }[],
): number {
  return (
    entries.reduce(
      (total, entry) => total + getZipEntryBytes(entry.name, entry.dataLength),
      0,
    ) + EOCD_BYTES
  );
}

export type PngZipHelperFile = { name: string; bytes: Uint8Array<ArrayBuffer> };

export type PngPartWriterResult = {
  descriptor: PngPartDescriptor;
  file?: File;
  blob?: Blob;
};

export async function sha256Hex(bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function throwArchiveError(error: unknown): never {
  throw new PngExportError(
    "pngZipValidationFailed",
    error instanceof Error ? error.message : "The ZIP writer failed.",
  );
}

export class PngZipPartWriter {
  readonly partNumber: number;
  readonly fileName: string;
  private readonly sink: PngPartSink;
  private readonly helperFiles: PngZipHelperFile[];
  private readonly helperLocalBytes: number;
  private readonly helperCentralBytes: number;
  private readonly zip: Zip;
  private pending: Uint8Array<ArrayBuffer>[] = [];
  private archiveError: unknown = null;
  private directoryChunk: Uint8Array<ArrayBuffer> | null = null;
  private directoryOffset = 0;
  private frameCount = 0;
  private entryCount = 0;
  private centralDirectoryBytes = 0;
  private firstFrameIndex = -1;
  private nextFrameIndex = -1;

  constructor({
    partNumber,
    fileName,
    sink,
    helperFiles,
  }: {
    partNumber: number;
    fileName: string;
    sink: PngPartSink;
    helperFiles: PngZipHelperFile[];
  }) {
    this.partNumber = partNumber;
    this.fileName = fileName;
    this.sink = sink;
    this.helperFiles = helperFiles;
    const helperSplit = getHelperBytesSplit(helperFiles);
    this.helperLocalBytes = helperSplit.localBytes;
    this.helperCentralBytes = helperSplit.centralBytes;
    this.zip = new Zip((error, chunk, final) => {
      if (error) {
        this.archiveError = error;
        return;
      }
      if (!chunk) {
        return;
      }
      const owned = chunk as Uint8Array<ArrayBuffer>;
      this.pending.push(owned);
      if (final) {
        // Central directory + EOCD is emitted as one chunk. It is bounded by
        // the entry cap (~10k entries), so keeping a copy for the digest and
        // the tail validation cannot grow with output size.
        this.directoryChunk = owned.slice();
      }
    });
  }

  get framesInPart(): number {
    return this.frameCount;
  }

  get writtenBytes(): number {
    return this.sink.bytesWritten;
  }

  get frameRange(): { firstFrameIndex: number; nextFrameIndex: number } {
    return {
      firstFrameIndex: this.firstFrameIndex,
      nextFrameIndex: this.nextFrameIndex,
    };
  }

  /**
   * Extend the part's declared frame range to the last processed frame. A
   * de-duplicated export skips the tail of the last displayed second, so the
   * writer stops advancing while the part still owns those frames.
   */
  setRangeEnd(nextFrameIndex: number) {
    if (nextFrameIndex > this.nextFrameIndex) {
      this.nextFrameIndex = nextFrameIndex;
    }
  }

  /** Whether the next frame still fits this part, using the exact final size. */
  canAddFrame(frameName: string, dataLength: number): boolean {
    if (this.frameCount >= PNG_PART_MAX_PNG_COUNT) {
      return false;
    }
    const projected = getPngPartProjectedBytes({
      sinkBytes: this.sink.bytesWritten,
      centralDirectoryBytes: this.centralDirectoryBytes,
      frameName,
      dataLength,
      helperLocalBytes: this.helperLocalBytes,
      helperCentralBytes: this.helperCentralBytes,
    });
    if (projected > PNG_PART_MAX_BYTES) {
      if (this.frameCount === 0) {
        throw new PngExportError(
          "pngFrameTooLarge",
          "A single PNG frame is larger than the per-part ZIP limit.",
        );
      }
      return false;
    }
    return true;
  }

  private async flush() {
    if (this.archiveError) {
      throwArchiveError(this.archiveError);
    }
    while (this.pending.length > 0) {
      const chunk = this.pending.shift()!;
      await this.sink.write(chunk);
      if (this.archiveError) {
        throwArchiveError(this.archiveError);
      }
    }
  }

  async addFrame(
    globalFrameIndex: number,
    frameName: string,
    data: Uint8Array<ArrayBuffer>,
  ) {
    if (!this.canAddFrame(frameName, data.byteLength)) {
      throw new PngExportError(
        "pngFrameTooLarge",
        "The frame does not fit in an empty ZIP part.",
      );
    }
    if (this.firstFrameIndex < 0) {
      this.firstFrameIndex = globalFrameIndex;
    }
    const entry = new ZipPassThrough(frameName);
    this.zip.add(entry);
    entry.push(data, true);
    await this.flush();
    this.centralDirectoryBytes += getZipCentralEntryBytes(frameName);
    this.frameCount += 1;
    this.entryCount += 1;
    this.nextFrameIndex = globalFrameIndex + 1;
  }

  async finish(
    frameNameWidth: number,
    helperFiles: PngZipHelperFile[] = this.helperFiles,
  ): Promise<PngPartWriterResult> {
    if (this.frameCount === 0) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "Refusing to write an empty PNG part.",
      );
    }

    const helperSplit = getHelperBytesSplit(helperFiles);
    if (
      helperSplit.localBytes !== this.helperLocalBytes ||
      helperSplit.centralBytes !== this.helperCentralBytes
    ) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "The part helper files changed size after the budget was reserved.",
      );
    }
    for (const file of helperFiles) {
      const entry = new ZipPassThrough(file.name);
      this.zip.add(entry);
      entry.push(file.bytes, true);
      await this.flush();
      this.centralDirectoryBytes += getZipCentralEntryBytes(file.name);
      this.entryCount += 1;
    }

    this.zip.end();
    await this.flush();

    if (this.archiveError) {
      throwArchiveError(this.archiveError);
    }
    if (!this.directoryChunk) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "The ZIP closed without a central directory.",
      );
    }

    const directorySize = this.directoryChunk.byteLength;
    this.directoryOffset = this.sink.bytesWritten - directorySize;
    if (this.sink.bytesWritten > PNG_PART_MAX_BYTES) {
      // Admission accounting and reality must agree. Refuse a closed archive
      // that crossed the cap instead of publishing an invalid part.
      throw new PngExportError(
        "pngFrameTooLarge",
        "The closed PNG part exceeded the per-part ZIP limit.",
      );
    }
    const directoryDigest = await sha256Hex(this.directoryChunk);

    const committed = await this.sink.close();
    if (committed.size !== this.sink.bytesWritten) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "The saved ZIP size does not match the written archive.",
        true,
      );
    }

    const descriptor: PngPartDescriptor = {
      partNumber: this.partNumber,
      fileName: this.fileName,
      firstFrameIndex: this.firstFrameIndex,
      nextFrameIndex: this.nextFrameIndex,
      frameCount: this.frameCount,
      bytes: committed.size,
      entryCount: this.entryCount,
      directoryDigest,
      directoryOffset: this.directoryOffset,
      directorySize,
      frameNameWidth,
    };

    if (committed.file) {
      await verifyPngPartFile(committed.file, descriptor);
    }

    return { descriptor, file: committed.file, blob: committed.blob };
  }

  async discard() {
    this.pending.length = 0;
    await this.sink.discard();
  }
}

type ParsedCentralEntry = {
  name: string;
  uncompressedSize: number;
  compressedSize: number;
};

function readUint16(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUint32(bytes: Uint8Array, offset: number): number {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  );
}

/**
 * Bounded central-directory parse. Throws if the bytes are not a well-formed
 * non-ZIP64 archive with the expected entry count and safe names.
 */
export function parseZipCentralDirectory(
  directoryBytes: Uint8Array,
  fileSize: number,
  directoryOffset: number,
): { entries: ParsedCentralEntry[]; entryCount: number } {
  if (directoryBytes.byteLength < EOCD_BYTES) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP end-of-directory is missing.",
    );
  }
  const eocdOffset = directoryBytes.byteLength - EOCD_BYTES;
  if (readUint32(directoryBytes, eocdOffset) !== 0x06054b50) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP end-of-directory signature is invalid.",
    );
  }
  const entryCount = readUint16(directoryBytes, eocdOffset + 10);
  if (entryCount !== readUint16(directoryBytes, eocdOffset + 8)) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP central directory spans multiple disks.",
    );
  }
  if (entryCount === 0xffff || entryCount === 0) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP entry count is outside the supported range.",
    );
  }
  const centralDirectorySize = readUint32(directoryBytes, eocdOffset + 12);
  const centralDirectoryOffset = readUint32(directoryBytes, eocdOffset + 16);
  if (
    centralDirectoryOffset !== directoryOffset ||
    directoryOffset + centralDirectorySize + EOCD_BYTES !== fileSize ||
    centralDirectorySize + EOCD_BYTES !== directoryBytes.byteLength
  ) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP central directory offsets do not match the saved file.",
    );
  }

  const entries: ParsedCentralEntry[] = [];
  let cursor = 0;
  for (let index = 0; index < entryCount; index += 1) {
    if (
      cursor + CENTRAL_HEADER_BYTES > directoryBytes.byteLength ||
      readUint32(directoryBytes, cursor) !== 0x02014b50
    ) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "A ZIP central directory entry is invalid.",
      );
    }
    const compressedSize = readUint32(directoryBytes, cursor + 20);
    const uncompressedSize = readUint32(directoryBytes, cursor + 24);
    const nameLength = readUint16(directoryBytes, cursor + 28);
    const extraLength = readUint16(directoryBytes, cursor + 30);
    const commentLength = readUint16(directoryBytes, cursor + 32);
    const nameStart = cursor + CENTRAL_HEADER_BYTES;
    const nameEnd = nameStart + nameLength;
    if (nameEnd > directoryBytes.byteLength) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "A ZIP entry name is truncated.",
      );
    }
    const name = new TextDecoder().decode(
      directoryBytes.subarray(nameStart, nameEnd),
    );
    if (
      name.length === 0 ||
      name.length > 255 ||
      name.includes("..") ||
      name.includes("/") ||
      name.includes("\\") ||
      name.startsWith(".")
    ) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "A ZIP entry name is not a safe relative file name.",
      );
    }
    entries.push({ name, compressedSize, uncompressedSize });
    cursor = nameEnd + extraLength + commentLength;
  }

  if (cursor !== centralDirectorySize) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP central directory length is inconsistent.",
    );
  }

  return { entries, entryCount };
}

export const PNG_HELPER_FILE_NAMES = [
  "convert-to-prores.sh",
  "convert-to-prores.bat",
  "README-prores.txt",
  "EXPORT-INSTRUCTIONS.txt",
  "expand-sequence.sh",
  "expand-sequence.ps1",
] as const;

export function isPngPartNoteName(name: string): boolean {
  return /^PART-\d{3,6}-README\.txt$/.test(name);
}

function isKnownHelperName(name: string): boolean {
  return (
    (PNG_HELPER_FILE_NAMES as readonly string[]).includes(name) ||
    isPngPartNoteName(name)
  );
}

/**
 * Validate a saved part with bounded reads: size, EOCD, central-directory
 * digest, entry count, safe names, first/last frame, and frame continuity.
 */
export async function verifyPngPartFile(
  file: File,
  descriptor: PngPartDescriptor,
): Promise<void> {
  if (file.size !== descriptor.bytes) {
    throw new PngExportError(
      "pngResumeFileMissing",
      "The saved ZIP part size changed.",
      true,
    );
  }
  const slice = file.slice(
    descriptor.directoryOffset,
    descriptor.directoryOffset + descriptor.directorySize,
  );
  const directoryBytes = new Uint8Array(await slice.arrayBuffer());
  if (directoryBytes.byteLength !== descriptor.directorySize) {
    throw new PngExportError(
      "pngResumeFileMissing",
      "The saved ZIP directory could not be read back.",
      true,
    );
  }
  const digest = await sha256Hex(directoryBytes);
  if (digest !== descriptor.directoryDigest) {
    throw new PngExportError(
      "pngResumeFileMissing",
      "The saved ZIP directory digest does not match the checkpoint.",
      true,
    );
  }

  const { entries, entryCount } = parseZipCentralDirectory(
    directoryBytes,
    file.size,
    descriptor.directoryOffset,
  );
  if (entryCount !== descriptor.entryCount) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP entry count does not match the checkpoint.",
      true,
    );
  }

  const frameEntries = entries.filter((entry) => entry.name.endsWith(".png"));
  const expectedFrames = descriptor.frameCount;
  if (
    frameEntries.length !== expectedFrames ||
    descriptor.firstFrameIndex < 0 ||
    descriptor.nextFrameIndex <= descriptor.firstFrameIndex
  ) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP frame range does not match the checkpoint.",
      true,
    );
  }
  const expectedFirst = getPngFrameFileName(
    descriptor.firstFrameIndex,
    descriptor.frameNameWidth,
  );
  // A de-duplicated part skips frames, so only the first entry is pinned to the
  // part start; every other name must still be inside the part's range.
  const expectedLast = getPngFrameFileName(
    descriptor.nextFrameIndex - 1,
    descriptor.frameNameWidth,
  );
  const lastEntryName = frameEntries[frameEntries.length - 1]?.name;
  if (
    frameEntries[0]?.name !== expectedFirst ||
    !lastEntryName ||
    (descriptor.frameCount ===
      descriptor.nextFrameIndex - descriptor.firstFrameIndex &&
      lastEntryName !== expectedLast)
  ) {
    throw new PngExportError(
      "pngZipValidationFailed",
      "The ZIP frame names do not match the global numbering.",
      true,
    );
  }
  const seen = new Set<string>();
  for (const entry of frameEntries) {
    if (seen.has(entry.name)) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "The ZIP contains a duplicate frame name.",
        true,
      );
    }
    seen.add(entry.name);
  }
  for (const entry of entries) {
    if (!entry.name.endsWith(".png") && !isKnownHelperName(entry.name)) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "The ZIP contains an unexpected entry.",
        true,
      );
    }
    if (
      entry.name.endsWith(".png") &&
      entry.compressedSize !== entry.uncompressedSize
    ) {
      throw new PngExportError(
        "pngZipValidationFailed",
        "A stored ZIP frame was unexpectedly compressed.",
        true,
      );
    }
  }
}
