import { describe, expect, it, vi } from "vitest";

import { createLazyExportRuntime } from "@/lib/generator/export/runtime";

describe("createLazyExportRuntime", () => {
  it("does not create a PNG export worker until PNG export is requested", () => {
    const createWorker = vi.fn(() => ({
      terminate: vi.fn(),
      postMessage: vi.fn(),
    }));
    const loadWebmExporter = vi.fn();

    createLazyExportRuntime({
      createWorker,
      loadWebmExporter,
    });

    expect(createWorker).not.toHaveBeenCalled();
    expect(loadWebmExporter).not.toHaveBeenCalled();
  });

  it("creates and reuses the PNG export worker lazily", () => {
    const worker = {
      terminate: vi.fn(),
      postMessage: vi.fn(),
    };
    const createWorker = vi.fn(() => worker);
    const runtime = createLazyExportRuntime({
      createWorker,
      loadWebmExporter: vi.fn(),
    });

    expect(runtime.getPngSequenceWorker()).toBe(worker);
    expect(runtime.getPngSequenceWorker()).toBe(worker);
    expect(createWorker).toHaveBeenCalledTimes(1);
  });

  it("loads the WebM exporter only when WebM export is requested", async () => {
    const loadWebmExporter = vi.fn(async () => ({
      exportWebmLocally: vi.fn(),
    }));
    const runtime = createLazyExportRuntime({
      createWorker: vi.fn(),
      loadWebmExporter,
    });

    expect(loadWebmExporter).not.toHaveBeenCalled();

    await runtime.loadWebmExporter();
    await runtime.loadWebmExporter();

    expect(loadWebmExporter).toHaveBeenCalledTimes(1);
  });
});
