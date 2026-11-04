// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PngRecoveryCard } from "@/components/generator/png-export-view";
import en from "@/content/root/en";

const copy = en.generatorUi.exportPanel.png;
const noop = () => undefined;

function render(partsDownloadable: boolean) {
  return renderToStaticMarkup(
    React.createElement(PngRecoveryCard, {
      busy: false,
      cleanupAvailable: partsDownloadable,
      committedFrames: 10,
      copy,
      error: null,
      jobId: "job-test",
      needsDirectorySelection: false,
      needsFont: false,
      needsPermission: false,
      onCleanup: noop,
      onDownloadPart: noop,
      onRemoveRecord: noop,
      onRestore: noop,
      onSelectFolder: noop,
      onSelectFont: noop,
      outputMode: partsDownloadable ? "opfs" : "directory",
      parts: [
        {
          partNumber: 1,
          fileName: "timer-part-001.zip",
          firstFrameIndex: 0,
          nextFrameIndex: 10,
          frameCount: 10,
          bytes: 100,
          entryCount: 10,
          directoryDigest: "a".repeat(64),
          directoryOffset: 0,
          directorySize: 22,
          frameNameWidth: 4,
        },
      ],
      partsDownloadable,
      totalFrames: 20,
    }),
  );
}

describe("PngRecoveryCard downloads", () => {
  it("shows per-part downloads only when the parts are OPFS-backed", () => {
    expect(render(true)).toContain(copy.partDownloadButton);
    expect(render(false)).not.toContain(copy.partDownloadButton);
  });
});
