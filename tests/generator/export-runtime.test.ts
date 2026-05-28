import { describe, expect, it, vi } from "vitest";

import { createLazyExportRuntime } from "@/lib/generator/export/runtime";

function createMockWorker() {
  return {
    terminate: vi.fn(),
    postMessage: vi.fn(),
    onmessage: null,
  };
}

describe("createLazyExportRuntime", () => {
  it("does not create an export worker until it is requested", () => {
    const createWorker = vi.fn(createMockWorker);
    const loadWebmExporter = vi.fn();

    createLazyExportRuntime({
      createWorker,
      loadWebmExporter,
    });

    expect(createWorker).not.toHaveBeenCalled();
    expect(loadWebmExporter).not.toHaveBeenCalled();
  });

  it("creates and reuses the export worker lazily", () => {
    const worker = createMockWorker();
    const createWorker = vi.fn(() => worker);
    const runtime = createLazyExportRuntime({
      createWorker,
      loadWebmExporter: vi.fn(),
    });

    expect(runtime.getExportWorker()).toBe(worker);
    expect(runtime.getExportWorker()).toBe(worker);
    expect(createWorker).toHaveBeenCalledTimes(1);
  });

  it("loads the WebM exporter only when WebM export is requested", async () => {
    const loadWebmExporter = vi.fn(async () => ({
      exportWebmLocally: vi.fn(),
    }));
    const runtime = createLazyExportRuntime({
      createWorker: vi.fn(createMockWorker),
      loadWebmExporter,
    });

    expect(loadWebmExporter).not.toHaveBeenCalled();

    await runtime.loadWebmExporter();
    await runtime.loadWebmExporter();

    expect(loadWebmExporter).toHaveBeenCalledTimes(1);
  });
});
