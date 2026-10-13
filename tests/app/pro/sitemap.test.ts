import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { buildSitemapEntries } from "@/lib/site";

describe("sitemap", () => {
  it("never lists the private /pro routes", () => {
    const entries = buildSitemapEntries();
    assert.ok(entries.length > 0);
    const proEntries = entries.filter((entry) => entry.url.includes("/pro"));
    assert.deepEqual(proEntries, []);
  });
});
