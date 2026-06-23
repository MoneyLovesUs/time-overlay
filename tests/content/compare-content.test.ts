import { describe, expect, it } from "vitest";

import { getComparePageContent } from "@/content/compare";
import {
  EDITOR_IDS,
  FORMAT_MATRIX,
  type SupportLevel,
} from "@/lib/formats/matrix";
import { CONTENT_YEAR } from "@/lib/site";

describe("comparison page content", () => {
  const content = getComparePageContent();

  it("stamps the current content year into the title and heading", () => {
    const year = String(CONTENT_YEAR);
    expect(content.metadata.title).toContain(year);
    expect(content.h1).toContain(year);
  });

  it("provides opinionated prose for every format in the matrix", () => {
    for (const row of FORMAT_MATRIX) {
      const prose = content.formats[row.id];
      expect(prose, `missing prose for ${row.id}`).toBeDefined();
      expect(prose.name.length).toBeGreaterThan(0);
      expect(prose.bestFor.length).toBeGreaterThan(0);
      expect(prose.weakness.length).toBeGreaterThan(0);
      expect(prose.verdict.length).toBeGreaterThan(0);
    }
  });

  it("labels every support level and editor used by the matrix", () => {
    const levels: SupportLevel[] = ["native", "works", "unreliable", "unsupported"];
    for (const level of levels) {
      expect(content.supportLabels[level]).toBeDefined();
    }
    for (const editorId of EDITOR_IDS) {
      expect(content.editorLabels[editorId]).toBeDefined();
    }
  });

  it("keeps the meta description within the 160-char SEO cap", () => {
    expect(content.metadata.description.length).toBeLessThanOrEqual(160);
  });
});
