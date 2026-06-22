import { describe, expect, it } from "vitest";

import enRootPageContent from "@/content/root/en";
import { getComparePageContent } from "@/content/compare";
import { GUIDES } from "@/content/guides";
import { buildLlmsTxt } from "@/lib/markdown/llms";
import {
  renderComparisonMarkdown,
  renderGuideMarkdown,
  renderHomeMarkdown,
} from "@/lib/markdown/render";

describe("markdown mirrors", () => {
  it("renders a guide as headed Markdown with numbered steps", () => {
    const guide = GUIDES["add-countdown-to-obs"];
    const md = renderGuideMarkdown(guide);
    expect(md).toContain(`# ${guide.title}`);
    expect(md).toContain("## Steps");
    expect(md).toContain(`### 1. ${guide.steps[0].title}`);
    expect(md).toContain("## Tips");
  });

  it("renders the comparison as a Markdown table covering every format", () => {
    const content = getComparePageContent();
    const md = renderComparisonMarkdown(content);
    expect(md).toContain(`# ${content.h1}`);
    // A Markdown table divider row is present.
    expect(md).toMatch(/\| --- \|/);
    for (const format of Object.values(content.formats)) {
      expect(md).toContain(format.name);
    }
    expect(md).toContain(content.faqItems[0].question);
  });

  it("renders the homepage answer Markdown with the FAQ", () => {
    const md = renderHomeMarkdown(enRootPageContent);
    expect(md).toContain(enRootPageContent.seoSection.faqItems[0].question);
    expect(md).toContain(enRootPageContent.seoSection.workflowHeading);
  });
});

describe("llms.txt", () => {
  const txt = buildLlmsTxt();

  it("lists the core pages and guides with absolute URLs and Markdown mirrors", () => {
    expect(txt).toContain("# Time Overlay");
    expect(txt).toContain("https://timeoverlay.co/compare/transparent-overlay-formats");
    expect(txt).toContain("https://timeoverlay.co/md/compare/transparent-overlay-formats");
    expect(txt).toContain("https://timeoverlay.co/guides/add-countdown-to-obs");
    expect(txt).toContain("https://timeoverlay.co/md/guides/add-countdown-to-obs");
    expect(txt).toContain("https://timeoverlay.co/md/home");
  });
});
