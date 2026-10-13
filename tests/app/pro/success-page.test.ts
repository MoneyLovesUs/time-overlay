import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, vi } from "vitest";

vi.mock("posthog-js", () => ({ default: { capture: vi.fn() } }));

import ProSuccessPage, { metadata } from "@/app/(default)/pro/success/page";

describe("/pro/success", () => {
  it("is marked noindex so search engines never list the post-checkout page", () => {
    assert.deepEqual(metadata.robots, { index: false, follow: false });
  });

  it("server-renders the pending verification state", () => {
    const markup = renderToStaticMarkup(React.createElement(ProSuccessPage));
    assert.match(markup, /Checking your purchase/);
  });
});
