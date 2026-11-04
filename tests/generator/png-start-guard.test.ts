import { describe, expect, it, vi } from "vitest";

import {
  claimPngStart,
  createPngStartGuard,
} from "@/lib/generator/export/png-start-guard";

describe("PNG preparation start guard", () => {
  it("accepts only the first of two immediate claims and recovers after release", () => {
    const guard = createPngStartGuard();
    expect(guard.claim()).toBe(true);
    expect(guard.isBusy()).toBe(true);
    expect(guard.claim()).toBe(false);
    guard.release();
    expect(guard.isBusy()).toBe(false);
    expect(guard.claim()).toBe(true);
  });
});

describe("claimPngStart", () => {
  it("claims once for the matching preparation and rejects a second click", () => {
    const guard = createPngStartGuard();
    const onClaim = vi.fn();
    expect(claimPngStart(guard, "job-a", "job-a", onClaim)).toBe(true);
    expect(claimPngStart(guard, "job-a", "job-a", onClaim)).toBe(false);
    expect(claimPngStart(guard, "job-b", "job-a", onClaim)).toBe(false);
    expect(onClaim).toHaveBeenCalledOnce();
    guard.release();
    expect(claimPngStart(guard, undefined, "job-a", onClaim)).toBe(false);
    expect(claimPngStart(guard, "job-a", "job-a", onClaim)).toBe(true);
    expect(onClaim).toHaveBeenCalledTimes(2);
  });
});
