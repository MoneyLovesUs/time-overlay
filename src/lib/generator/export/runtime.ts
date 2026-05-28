import type { exportWebmLocally } from "@/lib/generator/export/webm";

type ExportWorker = Pick<Worker, "terminate" | "postMessage" | "onmessage">;
type WebmExporterModule = {
  exportWebmLocally: typeof exportWebmLocally;
};

type LazyExportRuntimeDependencies = {
  createWorker: () => ExportWorker;
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
  let exportWorker: ExportWorker | null = null;
  let webmExporterPromise: Promise<WebmExporterModule> | null = null;

  return {
    getExportWorker() {
      exportWorker ??= dependencies.createWorker();
      return exportWorker;
    },
    loadWebmExporter() {
      webmExporterPromise ??= dependencies.loadWebmExporter();
      return webmExporterPromise;
    },
    terminateExportWorker() {
      exportWorker?.terminate();
      exportWorker = null;
    },
  };
}
