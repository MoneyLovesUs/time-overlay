/**
 * Fonts used by canvas rendering. The UI already uses Geist, but canvas font
 * strings resolved to OS generic families, so a worker restart could fall back
 * to a different monospace face and change glyphs mid-sequence. These local
 * assets are loaded explicitly into the export worker before any frame is
 * rendered, making the drawn face deterministic within the page origin.
 */
export const EXPORT_FONT_ASSETS = [
  {
    family: "TimeOverlay Geist Mono",
    url: "/fonts/geist-mono-latin.woff2",
  },
  {
    family: "TimeOverlay Geist Sans",
    url: "/fonts/geist-latin.woff2",
  },
] as const;

let loadPromise: Promise<void> | null = null;

type WorkerFontScope = {
  fonts?: FontFaceSet;
};

export function ensureExportFontsLoaded(): Promise<void> {
  if (typeof self === "undefined") {
    return Promise.resolve();
  }
  const scope = self as unknown as WorkerFontScope;
  if (!scope.fonts) {
    // Older workers without FontFaceSet cannot pin the family; the renderer
    // falls back explicitly. A browser with FontFaceSet always loads first.
    return Promise.resolve();
  }
  loadPromise ??= (async () => {
    for (const asset of EXPORT_FONT_ASSETS) {
      const response = await fetch(asset.url, { cache: "force-cache" });
      if (!response.ok) {
        throw new Error(`Could not load the export font (${asset.family}).`);
      }
      const face = new FontFace(asset.family, await response.arrayBuffer());
      await face.load();
      scope.fonts?.add(face);
    }
  })().catch((error) => {
    loadPromise = null;
    throw error;
  });
  return loadPromise;
}
