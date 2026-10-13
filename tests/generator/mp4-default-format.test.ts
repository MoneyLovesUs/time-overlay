import { describe, expect, it } from "vitest";

import { resolveDefaultExportFormat } from "@/lib/generator/defaults";

describe("resolveDefaultExportFormat", () => {
  it("keeps the desktop default format at png-sequence", () => {
    expect(
      resolveDefaultExportFormat({ deviceType: "desktop", supportsMp4: true }),
    ).toBe("png-sequence");
  });

  it("defaults mobile devices with mp4 support to mp4", () => {
    expect(
      resolveDefaultExportFormat({ deviceType: "mobile", supportsMp4: true }),
    ).toBe("mp4");
  });

  it("falls back to png-sequence when mp4 is unsupported, pending, or the user chose a format", () => {
    expect(
      resolveDefaultExportFormat({ deviceType: "mobile", supportsMp4: false }),
    ).toBe("png-sequence");
    expect(
      resolveDefaultExportFormat({ deviceType: "mobile", supportsMp4: null }),
    ).toBe("png-sequence");
    expect(
      resolveDefaultExportFormat({
        deviceType: "mobile",
        supportsMp4: true,
        hasUserSelectedFormat: true,
      }),
    ).toBe("png-sequence");
  });
});
