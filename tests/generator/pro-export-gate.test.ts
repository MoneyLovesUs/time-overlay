import { describe, expect, it } from "vitest";

import { getProExportBlockReason } from "@/lib/generator/defaults";
import {
  GENERATOR_TEMPLATES,
  isProTemplateId,
} from "@/lib/generator/templates";

describe("pro export gate (spec 6.5 #3-#4)", () => {
  it("lets free users export every original template without a paywall", () => {
    const originalTemplates = GENERATOR_TEMPLATES.filter(
      (template) => !isProTemplateId(template.id),
    );
    expect(originalTemplates).toHaveLength(48);
    for (const template of originalTemplates) {
      expect(
        getProExportBlockReason(template.id, false),
        `original template ${template.id} must export for free`,
      ).toBeNull();
    }
  });

  it("blocks free exports of all 12 signature pro templates", () => {
    const proTemplates = GENERATOR_TEMPLATES.filter((template) =>
      isProTemplateId(template.id),
    );
    expect(proTemplates).toHaveLength(12);
    for (const template of proTemplates) {
      expect(
        getProExportBlockReason(template.id, false),
        `pro template ${template.id} must be blocked for free`,
      ).toBe("template");
    }
  });

  it("never blocks exports for pro users", () => {
    for (const template of GENERATOR_TEMPLATES) {
      expect(getProExportBlockReason(template.id, true)).toBeNull();
    }
  });
});
