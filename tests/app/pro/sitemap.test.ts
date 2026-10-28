import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { buildSitemapEntries } from "@/lib/site";

describe("sitemap", () => {
  it("never lists the private post-checkout route", () => {
    const entries = buildSitemapEntries();
    assert.ok(entries.length > 0);
    const privateEntries = entries.filter((entry) => entry.url.includes("/pro/success"));
    assert.deepEqual(privateEntries, []);
  });

  it("lists the public /pro sales page in every enabled locale", () => {
    const entries = buildSitemapEntries();
    const proEntries = entries.filter((entry) => /\/pro$/.test(entry.url));

    assert.equal(proEntries.length, 17);
    assert.ok(
      proEntries.some((entry) => entry.url === "https://timeoverlay.co/pro"),
    );
    assert.ok(
      proEntries.some((entry) => entry.url === "https://timeoverlay.co/ja/pro"),
    );
    assert.ok(
      proEntries.some(
        (entry) => entry.url === "https://timeoverlay.co/zh-hans/pro",
      ),
    );
  });
});
