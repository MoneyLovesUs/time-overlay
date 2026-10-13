import { describe, expect, it } from "vitest";

import {
  MP4_CHROMA_KEY_BACKGROUND_COLOR,
  MP4_VIDEO_BITRATE_BY_QUALITY,
  resolveMp4FrameBackground,
} from "@/lib/generator/encode/mp4-encoder";

describe("resolveMp4FrameBackground", () => {
  it("fills transparent canvases with chroma-key green", () => {
    expect(
      resolveMp4FrameBackground({
        backgroundMode: "transparent",
        backgroundColor: "#090B10",
      }),
    ).toBe("#00FF00");
  });

  it("keeps the user-chosen color for solid canvases", () => {
    expect(
      resolveMp4FrameBackground({
        backgroundMode: "solid",
        backgroundColor: "#112233",
      }),
    ).toBe("#112233");
  });

  it("exposes the chroma-key constant as pure green", () => {
    expect(MP4_CHROMA_KEY_BACKGROUND_COLOR).toBe("#00FF00");
  });
});

describe("MP4_VIDEO_BITRATE_BY_QUALITY", () => {
  it("encodes standard quality at 4 Mbps and high quality at 8 Mbps", () => {
    expect(MP4_VIDEO_BITRATE_BY_QUALITY.standard).toBe(4_000_000);
    expect(MP4_VIDEO_BITRATE_BY_QUALITY.high).toBe(8_000_000);
  });
});
