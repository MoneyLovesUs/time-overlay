import { describe, expect, it, vi } from "vitest";

import { createLazyExportRuntime } from "@/lib/generator/export/runtime";

function createMockWorker() {
  return {
    terminate: vi.fn(),
    postMessage: vi.fn(),
    onmessage: null,
    onerror: null,
    onmessageerror: null,
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

  it("creates a fresh worker after the current worker is terminated", () => {
    const firstWorker = createMockWorker();
    const secondWorker = createMockWorker();
    const createWorker = vi
      .fn()
      .mockReturnValueOnce(firstWorker)
      .mockReturnValueOnce(secondWorker);
    const runtime = createLazyExportRuntime({
      createWorker,
      loadWebmExporter: vi.fn(),
    });

    expect(runtime.getExportWorker()).toBe(firstWorker);
    runtime.terminateExportWorker();
    expect(firstWorker.terminate).toHaveBeenCalledOnce();
    expect(runtime.getExportWorker()).toBe(secondWorker);
    expect(createWorker).toHaveBeenCalledTimes(2);
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

  it("retries a rejected WebM dynamic import on the next request", async () => {
    const expectedModule = { exportWebmLocally: vi.fn() };
    const loadWebmExporter = vi
      .fn()
      .mockRejectedValueOnce(new Error("chunk was replaced"))
      .mockResolvedValueOnce(expectedModule);
    const runtime = createLazyExportRuntime({
      createWorker: vi.fn(createMockWorker),
      loadWebmExporter,
    });

    await expect(runtime.loadWebmExporter()).rejects.toThrow("chunk was replaced");
    await expect(runtime.loadWebmExporter()).resolves.toBe(expectedModule);
    expect(loadWebmExporter).toHaveBeenCalledTimes(2);
  });
});
