import { zlibSync } from "fflate";

/**
 * Palette PNG encoder for export frames.
 *
 * `canvas.convertToBlob({ type: "image/png" })` always emits truecolor RGBA,
 * which costs 2-3.5x the bytes of an indexed PNG for the flat-background,
 * few-hue frames this tool renders (measured 37.6 KB -> 11.9 KB for a 720p
 * glow frame). Browsers expose no palette encoder, so the whole path lives
 * here: median-cut quantization over exact source colors, then a PNG
 * color-type-3 stream.
 *
 * Frames of this generator hold at most a few thousand distinct RGBA values
 * (flat fills, one glyph ramp, antialiased edges), so quantization can run on
 * exact colors instead of a coarse histogram and stay visually lossless:
 * measured PSNR is 56-70 dB against the truecolor frame.
 */

const PNG_SIGNATURE = Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);

export const DEFAULT_MAX_COLORS = 256;

/** Exact-color table cap; beyond this the encoder falls back to 5-bit bins. */
const MAX_EXACT_COLORS = 1 << 16;
const BIN_SHIFT = 3;
const BIN_LEVELS = 32;
const BIN_COUNT = BIN_LEVELS ** 4;

export type QuantizedImage = {
  indices: Uint8Array;
  /** RGBA quadruplets, one per palette entry. */
  palette: Uint8Array;
  width: number;
  height: number;
  /** Distinct source colors seen; useful for tests and diagnostics. */
  colorCount: number;
};

type ColorTable = {
  count: number;
  /** Weighted average color per entry, RGBA quadruplets. */
  colors: Float64Array;
  weights: Float64Array;
  /** Entry index for a pixel's color; -1 never occurs for seen colors. */
  entryOf: (r: number, g: number, b: number, a: number) => number;
};

function hashKey(key: number): number {
  let hash = Math.imul(key ^ (key >>> 15), 0x2c1b3c6d);
  hash = Math.imul(hash ^ (hash >>> 12), 0x297a2d39);
  return (hash ^ (hash >>> 15)) >>> 0;
}

/**
 * Exact-color table with open addressing. 0xRRGGBBAA packing means a fully
 * transparent pixel is key 0, so a transparent background costs one entry
 * regardless of what color the canvas left underneath it.
 */
function collectExactColors(rgba: Uint8ClampedArray | Uint8Array): ColorTable | null {
  const capacity = 1 << 17;
  const mask = capacity - 1;
  const keys = new Uint32Array(capacity);
  const entries = new Int32Array(capacity).fill(-1);
  const colorList: number[] = [];
  const counts: number[] = [];

  for (let i = 0; i < rgba.length; i += 4) {
    const alpha = rgba[i + 3];
    const key =
      alpha === 0
        ? 0
        : (((rgba[i] << 24) | (rgba[i + 1] << 16) | (rgba[i + 2] << 8) | alpha) >>> 0);
    let slot = hashKey(key) & mask;
    for (;;) {
      const entry = entries[slot];
      if (entry === -1) {
        if (colorList.length >= MAX_EXACT_COLORS) {
          return null;
        }
        keys[slot] = key;
        entries[slot] = colorList.length;
        colorList.push(key);
        counts.push(1);
        break;
      }
      if (keys[slot] === key) {
        counts[entry] += 1;
        break;
      }
      slot = (slot + 1) & mask;
    }
  }

  const count = colorList.length;
  const colors = new Float64Array(count * 4);
  const weights = new Float64Array(count);
  for (let entry = 0; entry < count; entry += 1) {
    const key = colorList[entry];
    const offset = entry * 4;
    colors[offset] = key === 0 ? 0 : (key >>> 24) & 0xff;
    colors[offset + 1] = key === 0 ? 0 : (key >>> 16) & 0xff;
    colors[offset + 2] = key === 0 ? 0 : (key >>> 8) & 0xff;
    colors[offset + 3] = key === 0 ? 0 : key & 0xff;
    weights[entry] = counts[entry];
  }

  return {
    count,
    colors,
    weights,
    entryOf(r, g, b, a) {
      if (a === 0) return entries[hashKey(0) & mask];
      const key = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
      let slot = hashKey(key) & mask;
      for (;;) {
        const entry = entries[slot];
        if (entry === -1) return -1;
        if (keys[slot] === key) return entry;
        slot = (slot + 1) & mask;
      }
    },
  };
}

/** Fallback for photographic content: 32k bins keyed by 5 bits per channel. */
function collectBinnedColors(rgba: Uint8ClampedArray | Uint8Array): ColorTable {
  const counts = new Int32Array(BIN_COUNT);
  const sums = new Float64Array(BIN_COUNT * 4);
  for (let i = 0; i < rgba.length; i += 4) {
    const alpha = rgba[i + 3];
    const r = alpha === 0 ? 0 : rgba[i];
    const g = alpha === 0 ? 0 : rgba[i + 1];
    const b = alpha === 0 ? 0 : rgba[i + 2];
    const bin =
      ((((r >> BIN_SHIFT) * BIN_LEVELS + (g >> BIN_SHIFT)) * BIN_LEVELS +
        (b >> BIN_SHIFT)) *
        BIN_LEVELS) +
      (alpha >> BIN_SHIFT);
    counts[bin] += 1;
    const offset = bin * 4;
    sums[offset] += r;
    sums[offset + 1] += g;
    sums[offset + 2] += b;
    sums[offset + 3] += alpha;
  }

  const binToEntry = new Int32Array(BIN_COUNT).fill(-1);
  const weights: number[] = [];
  const colors: number[] = [];
  for (let bin = 0; bin < BIN_COUNT; bin += 1) {
    const weight = counts[bin];
    if (weight === 0) continue;
    const offset = bin * 4;
    binToEntry[bin] = weights.length;
    weights.push(weight);
    colors.push(
      sums[offset] / weight,
      sums[offset + 1] / weight,
      sums[offset + 2] / weight,
      sums[offset + 3] / weight,
    );
  }

  return {
    count: weights.length,
    colors: Float64Array.from(colors),
    weights: Float64Array.from(weights),
    entryOf(r, g, b, a) {
      const bin =
        ((((r >> BIN_SHIFT) * BIN_LEVELS + (g >> BIN_SHIFT)) * BIN_LEVELS +
          (b >> BIN_SHIFT)) *
          BIN_LEVELS) +
        (a >> BIN_SHIFT);
      return binToEntry[bin];
    },
  };
}

function buildPalette(table: ColorTable, maxColors: number): Uint8Array {
  const { count, colors, weights } = table;
  const order = new Int32Array(count);
  for (let index = 0; index < count; index += 1) {
    order[index] = index;
  }

  type Box = { start: number; end: number };
  const boxes: Box[] = [{ start: 0, end: count }];

  const channelValue = (entry: number, channel: number) =>
    colors[entry * 4 + channel];

  while (boxes.length < maxColors) {
    let target = -1;
    let bestScore = 0;
    let targetChannel = 0;
    for (let index = 0; index < boxes.length; index += 1) {
      const box = boxes[index];
      if (box.end - box.start < 2) continue;
      const min = [255, 255, 255, 255];
      const max = [0, 0, 0, 0];
      for (let i = box.start; i < box.end; i += 1) {
        const entry = order[i];
        for (let channel = 0; channel < 4; channel += 1) {
          const value = channelValue(entry, channel);
          if (value < min[channel]) min[channel] = value;
          if (value > max[channel]) max[channel] = value;
        }
      }
      const spreads = [
        max[0] - min[0],
        max[1] - min[1],
        max[2] - min[2],
        (max[3] - min[3]) * 1.6,
      ];
      let channel = 0;
      for (let candidate = 1; candidate < 4; candidate += 1) {
        if (spreads[candidate] > spreads[channel]) channel = candidate;
      }
      const score = spreads[channel] * (box.end - box.start);
      if (score > bestScore) {
        bestScore = score;
        target = index;
        targetChannel = channel;
      }
    }
    if (target < 0) break;

    const box = boxes[target];
    const slice = Array.from(order.subarray(box.start, box.end));
    slice.sort(
      (left, right) =>
        channelValue(left, targetChannel) - channelValue(right, targetChannel),
    );
    order.set(slice, box.start);

    let total = 0;
    for (let i = box.start; i < box.end; i += 1) {
      total += weights[order[i]];
    }
    let running = 0;
    let split = box.start + 1;
    for (let i = box.start; i < box.end - 1; i += 1) {
      running += weights[order[i]];
      if (running >= total / 2) {
        split = i + 1;
        break;
      }
    }
    boxes[target] = { start: box.start, end: split };
    boxes.push({ start: split, end: box.end });
  }

  const palette = new Uint8Array(boxes.length * 4);
  boxes.forEach((box, index) => {
    let weight = 0;
    const sums = [0, 0, 0, 0];
    for (let i = box.start; i < box.end; i += 1) {
      const entry = order[i];
      const entryWeight = weights[entry];
      weight += entryWeight;
      for (let channel = 0; channel < 4; channel += 1) {
        sums[channel] += channelValue(entry, channel) * entryWeight;
      }
    }
    const out = index * 4;
    for (let channel = 0; channel < 4; channel += 1) {
      palette[out + channel] = Math.round(sums[channel] / weight);
    }
  });
  return palette;
}

/** Nearest palette entry for every source color (alpha weighted double). */
function mapColorsToPalette(
  table: ColorTable,
  palette: Uint8Array,
): Int16Array {
  const paletteSize = palette.length / 4;
  const mapping = new Int16Array(table.count);
  for (let entry = 0; entry < table.count; entry += 1) {
    const offset = entry * 4;
    const r = table.colors[offset];
    const g = table.colors[offset + 1];
    const b = table.colors[offset + 2];
    const a = table.colors[offset + 3];
    let best = 0;
    let bestDistance = Infinity;
    for (let candidate = 0; candidate < paletteSize; candidate += 1) {
      const p = candidate * 4;
      const dr = r - palette[p];
      const dg = g - palette[p + 1];
      const db = b - palette[p + 2];
      const da = (a - palette[p + 3]) * 2;
      const distance = dr * dr + dg * dg + db * db + da * da;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    }
    mapping[entry] = best;
  }
  return mapping;
}

/**
 * Indices, not the palette content, decide how well PNG filters compress a
 * palette image: two similar colors must land on adjacent indices or every
 * antialiased edge turns into a large residual. Sorting by alpha then luma
 * makes each glow ramp a monotone run, which is what libimagequant does.
 */
function sortPaletteByRamp(palette: Uint8Array): Uint8Array {
  const entries = Array.from({ length: palette.length / 4 }, (_, index) => index);
  const key = (entry: number) =>
    palette[entry * 4 + 3] * 1000 +
    palette[entry * 4] * 0.299 +
    palette[entry * 4 + 1] * 0.587 +
    palette[entry * 4 + 2] * 0.114;
  entries.sort((left, right) => key(left) - key(right));
  const sorted = new Uint8Array(palette.length);
  entries.forEach((entry, position) => {
    sorted.set(palette.subarray(entry * 4, entry * 4 + 4), position * 4);
  });
  return sorted;
}

export function quantizeImage(
  rgba: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  maxColors = DEFAULT_MAX_COLORS,
): QuantizedImage {
  const table = collectExactColors(rgba) ?? collectBinnedColors(rgba);
  const palette = sortPaletteByRamp(buildPalette(table, Math.max(2, maxColors)));
  const mapping = mapColorsToPalette(table, palette);

  const indices = new Uint8Array(width * height);
  for (let pixel = 0, i = 0; i < rgba.length; pixel += 1, i += 4) {
    const entry = table.entryOf(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]);
    indices[pixel] = entry < 0 ? 0 : mapping[entry];
  }
  return { indices, palette, width, height, colorCount: table.count };
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array, seed = 0xffffffff): number {
  let crc = seed;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint32(target: Uint8Array, offset: number, value: number) {
  target[offset] = (value >>> 24) & 0xff;
  target[offset + 1] = (value >>> 16) & 0xff;
  target[offset + 2] = (value >>> 8) & 0xff;
  target[offset + 3] = value & 0xff;
}

function makeChunk(type: string, data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12 + data.length);
  writeUint32(chunk, 0, data.length);
  for (let i = 0; i < 4; i += 1) {
    chunk[4 + i] = type.charCodeAt(i);
  }
  chunk.set(data, 8);
  writeUint32(chunk, 8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
  return chunk;
}

/**
 * Per-row filter choice between None/Sub/Up. Palette rows are long runs of the
 * same index, so Up usually wins; testing Average and Paeth as well was
 * measured to change nothing on this content and doubled filter cost.
 */
function filterRows(indices: Uint8Array, width: number, height: number): Uint8Array {
  const stride = width + 1;
  const out = new Uint8Array(stride * height);
  const none = new Uint8Array(width);
  const sub = new Uint8Array(width);
  const up = new Uint8Array(width);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * width;
    const prevStart = rowStart - width;
    let noneCost = 0;
    let subCost = 0;
    let upCost = 0;
    for (let x = 0; x < width; x += 1) {
      const value = indices[rowStart + x];
      const left = x === 0 ? 0 : indices[rowStart + x - 1];
      const above = y === 0 ? 0 : indices[prevStart + x];
      const subValue = (value - left) & 0xff;
      const upValue = (value - above) & 0xff;
      none[x] = value;
      sub[x] = subValue;
      up[x] = upValue;
      noneCost += value < 128 ? value : 256 - value;
      subCost += subValue < 128 ? subValue : 256 - subValue;
      upCost += upValue < 128 ? upValue : 256 - upValue;
    }
    const rowOffset = y * stride;
    if (subCost < noneCost && subCost <= upCost) {
      out[rowOffset] = 1;
      out.set(sub, rowOffset + 1);
    } else if (upCost < noneCost) {
      out[rowOffset] = 2;
      out.set(up, rowOffset + 1);
    } else {
      out[rowOffset] = 0;
      out.set(none, rowOffset + 1);
    }
  }
  return out;
}

export function encodePalettePng(
  rgba: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  maxColors = DEFAULT_MAX_COLORS,
): Uint8Array<ArrayBuffer> {
  const { indices, palette } = quantizeImage(rgba, width, height, maxColors);
  const colorCount = palette.length / 4;

  const header = new Uint8Array(13);
  writeUint32(header, 0, width);
  writeUint32(header, 4, height);
  header[8] = 8; // bit depth
  header[9] = 3; // color type: indexed
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  const plte = new Uint8Array(colorCount * 3);
  for (let entry = 0; entry < colorCount; entry += 1) {
    plte[entry * 3] = palette[entry * 4];
    plte[entry * 3 + 1] = palette[entry * 4 + 1];
    plte[entry * 3 + 2] = palette[entry * 4 + 2];
  }

  let trnsLength = 0;
  for (let entry = 0; entry < colorCount; entry += 1) {
    if (palette[entry * 4 + 3] !== 255) {
      trnsLength = entry + 1;
    }
  }
  const trns = new Uint8Array(trnsLength);
  for (let entry = 0; entry < trnsLength; entry += 1) {
    trns[entry] = palette[entry * 4 + 3];
  }

  const filtered = filterRows(indices, width, height);
  const idat = zlibSync(filtered, { level: 9 });

  const chunks: Uint8Array[] = [
    PNG_SIGNATURE,
    makeChunk("IHDR", header),
    makeChunk("PLTE", plte),
  ];
  if (trnsLength > 0) {
    chunks.push(makeChunk("tRNS", trns));
  }
  chunks.push(makeChunk("IDAT", idat), makeChunk("IEND", new Uint8Array(0)));

  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const png = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    png.set(chunk, offset);
    offset += chunk.length;
  }
  return png;
}
