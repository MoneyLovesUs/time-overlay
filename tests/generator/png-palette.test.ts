import { describe, expect, it } from "vitest";

import {
  DEFAULT_MAX_COLORS,
  encodePalettePng,
  quantizeImage,
} from "@/lib/generator/export/png-palette";

function solidFrame(
  width: number,
  height: number,
  rgba: [number, number, number, number],
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgba[0];
    data[i + 1] = rgba[1];
    data[i + 2] = rgba[2];
    data[i + 3] = rgba[3];
  }
  return data;
}

/** A transparent frame with one opaque bar, the shape of a timer overlay. */
function overlayFrame(width: number, height: number): Uint8ClampedArray {
  const data = solidFrame(width, height, [0, 0, 0, 0]);
  const barStart = Math.floor(height * 0.4);
  const barEnd = Math.floor(height * 0.6);
  for (let y = barStart; y < barEnd; y += 1) {
    for (let x = Math.floor(width * 0.25); x < Math.floor(width * 0.75); x += 1) {
      const offset = (y * width + x) * 4;
      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = 255;
    }
  }
  return data;
}

function readUint32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

type Chunk = { type: string; data: Uint8Array };

function readChunks(png: Uint8Array): Chunk[] {
  expect(Array.from(png.subarray(0, 8))).toEqual([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  const chunks: Chunk[] = [];
  let offset = 8;
  while (offset < png.length) {
    const length = readUint32(png, offset);
    const type = String.fromCharCode(...png.subarray(offset + 4, offset + 8));
    chunks.push({ type, data: png.subarray(offset + 8, offset + 8 + length) });
    offset += 12 + length;
  }
  return chunks;
}

describe("palette PNG encoder", () => {
  it("writes a structurally valid indexed PNG", () => {
    const width = 40;
    const height = 20;
    const png = encodePalettePng(overlayFrame(width, height), width, height);
    const chunks = readChunks(png);

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "IHDR",
      "PLTE",
      "tRNS",
      "IDAT",
      "IEND",
    ]);
    const header = chunks[0].data;
    expect(readUint32(header, 0)).toBe(width);
    expect(readUint32(header, 4)).toBe(height);
    expect(header[8]).toBe(8);
    expect(header[9]).toBe(3);
    expect(chunks[1].data.length % 3).toBe(0);
    expect(chunks[2].data.length).toBeLessThanOrEqual(chunks[1].data.length / 3);
  });

  it("round-trips every color when the frame has fewer colors than the palette", () => {
    const width = 16;
    const height = 16;
    const source = overlayFrame(width, height);
    const { indices, palette, colorCount } = quantizeImage(source, width, height);

    expect(colorCount).toBe(2);
    for (let pixel = 0; pixel < width * height; pixel += 1) {
      const entry = indices[pixel] * 4;
      const offset = pixel * 4;
      expect([
        palette[entry],
        palette[entry + 1],
        palette[entry + 2],
        palette[entry + 3],
      ]).toEqual([
        source[offset],
        source[offset + 1],
        source[offset + 2],
        source[offset + 3],
      ]);
    }
  });

  it("keeps a transparent background transparent after quantization", () => {
    const width = 32;
    const height = 32;
    const source = overlayFrame(width, height);
    const { indices, palette } = quantizeImage(source, width, height);

    expect(palette[indices[0] * 4 + 3]).toBe(0);
    const center = (height / 2) * width + width / 2;
    expect(palette[indices[center] * 4 + 3]).toBe(255);
  });

  it("bounds error when the frame has more colors than the palette", () => {
    const width = 64;
    const height = 64;
    const source = solidFrame(width, height, [0, 0, 0, 0]);
    // A smooth alpha ramp: more distinct colors than the palette can hold, which
    // is the case the median cut has to approximate rather than reproduce.
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (y * width + x) * 4;
        source[offset] = 255;
        source[offset + 1] = 255;
        source[offset + 2] = 255;
        source[offset + 3] = Math.round((y / (height - 1)) * 255);
      }
    }

    const { indices, palette, colorCount } = quantizeImage(source, width, height, 16);
    expect(colorCount).toBeGreaterThan(16);
    expect(palette.length / 4).toBeLessThanOrEqual(16);

    let worst = 0;
    for (let pixel = 0; pixel < width * height; pixel += 1) {
      const sourceAlpha = source[pixel * 4 + 3];
      const paletteAlpha = palette[indices[pixel] * 4 + 3];
      worst = Math.max(worst, Math.abs(sourceAlpha - paletteAlpha));
    }
    // Sixteen entries over a 256-step ramp: each bucket spans 16 alpha levels.
    expect(worst).toBeLessThanOrEqual(24);
  });

  it("uses at most the default palette size", () => {
    const width = 64;
    const height = 64;
    const source = solidFrame(width, height, [0, 0, 0, 0]);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (y * width + x) * 4;
        source[offset] = x * 4;
        source[offset + 1] = y * 4;
        source[offset + 2] = 128;
        source[offset + 3] = 255;
      }
    }
    const { palette } = quantizeImage(source, width, height);
    expect(palette.length / 4).toBeLessThanOrEqual(DEFAULT_MAX_COLORS);
    expect(palette.length / 4).toBeGreaterThan(1);
  });

  it("encodes a frame identically across repeated calls", () => {
    const width = 24;
    const height = 24;
    const source = overlayFrame(width, height);
    const first = encodePalettePng(source, width, height);
    const second = encodePalettePng(source, width, height);
    expect(Array.from(first)).toEqual(Array.from(second));
  });
});
