import type { exportWebmLocally } from "@/lib/generator/export/webm";

type PngSequenceWorker = Pick<Worker, "terminate" | "postMessage" | "onmessage">;
type WebmExporterModule = {
  exportWebmLocally: typeof exportWebmLocally;
};

type LazyExportRuntimeDependencies = {
  createWorker: () => PngSequenceWorker;
  loadWebmExporter: () => Promise<WebmExporterModule>;
};

export type LazyExportRuntime = ReturnType<typeof createLazyExportRuntime>;

function createDefaultWorker() {
  return new Worker(
    new URL("../../../workers/generator-export.worker.ts", import.meta.url),
    {
      type: "module",
    },
  );
}

async function loadDefaultWebmExporter() {
  return import("./webm");
}

export function createLazyExportRuntime(
  dependencies: LazyExportRuntimeDependencies = {
    createWorker: createDefaultWorker,
    loadWebmExporter: loadDefaultWebmExporter,
  },
) {
  let pngSequenceWorker: PngSequenceWorker | null = null;
  let webmExporterPromise: Promise<WebmExporterModule> | null = null;

  return {
    getPngSequenceWorker() {
      pngSequenceWorker ??= dependencies.createWorker();
      return pngSequenceWorker;
    },
    loadWebmExporter() {
      webmExporterPromise ??= dependencies.loadWebmExporter();
      return webmExporterPromise;
    },
    terminatePngSequenceWorker() {
      pngSequenceWorker?.terminate();
      pngSequenceWorker = null;
    },
  };
}
