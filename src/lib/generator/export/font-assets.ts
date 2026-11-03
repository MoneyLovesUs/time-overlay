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
let previewLoadPromise: Promise<void> | null = null;

type WorkerFontScope = {
  fonts?: FontFaceSet;
};

export function ensureExportFontsLoaded(): Promise<void> {
  if (typeof self === "undefined") {
    return Promise.resolve();
  }
  const scope = self as unknown as WorkerFontScope;
  if (!scope.fonts) {
    // Never render with an OS-dependent fallback when the pinned face cannot
    // be installed. The caller surfaces this as a PNG export error.
    throw new Error("This worker cannot load the pinned export fonts.");
  }
  loadPromise ??= (async () => {
    for (const asset of EXPORT_FONT_ASSETS) {
      const response = await fetch(asset.url, { cache: "force-cache" });
      if (!response.ok) {
        throw new Error(`Could not load the export font (${asset.family}).`);
      }
      const face = new FontFace(asset.family, await response.arrayBuffer(), {
        style: "normal",
        // Must match the @font-face descriptor used by the main-thread preview;
        // an omitted descriptor selects a different weight from a variable font.
        weight: "100 900",
      });
      await face.load();
      scope.fonts?.add(face);
    }
  })().catch((error) => {
    loadPromise = null;
    throw error;
  });
  return loadPromise;
}

/**
 * Main-thread counterpart for the preview canvas. Registering the same bytes
 * with the same weight descriptor avoids the CSS-family fallback that Turbopack
 * did not emit reliably for global @font-face rules.
 */
export function ensurePreviewFontsLoaded(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) {
    return Promise.resolve();
  }
  previewLoadPromise ??= (async () => {
    for (const asset of EXPORT_FONT_ASSETS) {
      const existing = [...document.fonts].some(
        (face) => face.family.replaceAll('"', "") === asset.family,
      );
      if (existing) {
        continue;
      }
      const response = await fetch(asset.url, { cache: "force-cache" });
      if (!response.ok) {
        throw new Error(`Could not load the preview font (${asset.family}).`);
      }
      const face = new FontFace(asset.family, await response.arrayBuffer(), {
        style: "normal",
        weight: "100 900",
      });
      await face.load();
      document.fonts.add(face);
    }
    await document.fonts.ready;
  })().catch((error) => {
    previewLoadPromise = null;
    throw error;
  });
  return previewLoadPromise;
}
