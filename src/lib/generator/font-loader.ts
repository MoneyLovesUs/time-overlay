export type UploadedFont = {
  family: string;
  data: ArrayBuffer;
};

const ALLOWED_FONT_TYPES = new Set([
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2",
  "application/x-font-ttf",
  "application/x-font-otf",
  "application/font-woff",
  "application/font-woff2",
  "application/octet-stream",
]);

const ALLOWED_FONT_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"] as const;

export function isUploadedFontFile(file: File): boolean {
  if (ALLOWED_FONT_TYPES.has(file.type)) {
    return true;
  }
  const name = file.name.toLowerCase();
  return ALLOWED_FONT_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function deriveFontFamily(file: File): string {
  const baseName = file.name.replace(/\.(ttf|otf|woff2?)$/i, "");
  const cleaned = baseName.replace(/[^A-Za-z0-9_-]/g, "-");
  return `user-${cleaned}-${Date.now().toString(36)}`;
}

export async function readFontFile(file: File): Promise<UploadedFont> {
  if (!isUploadedFontFile(file)) {
    throw new Error("Unsupported font file. Use .ttf, .otf, .woff, or .woff2.");
  }
  const data = await file.arrayBuffer();
  return {
    family: deriveFontFamily(file),
    data,
  };
}

export async function loadFontIntoDocument(font: UploadedFont): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return;
  }
  const fontFace = new FontFace(font.family, font.data);
  const loaded = await fontFace.load();
  document.fonts.add(loaded);
}

export async function loadFontIntoWorker(font: UploadedFont): Promise<void> {
  if (typeof self === "undefined" || !("fonts" in self)) {
    return;
  }
  const fontFace = new FontFace(font.family, font.data);
  const loaded = await fontFace.load();
  (self as unknown as { fonts: FontFaceSet }).fonts.add(loaded);
}
