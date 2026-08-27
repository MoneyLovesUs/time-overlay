import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "@/proxy";

describe("request proxy", () => {
  it("preserves the permanent 410 response for retired style pages", () => {
    const response = proxy(
      new NextRequest("https://timeoverlay.co/zh-hans/styles/neon"),
    );

    expect(response.status).toBe(410);
    expect(response.headers.get("content-type")).toContain("text/plain");
  });

  it("adds a fresh strict CSP to rendered pages", () => {
    const first = proxy(new NextRequest("https://timeoverlay.co/"));
    const second = proxy(new NextRequest("https://timeoverlay.co/guides"));
    const firstCsp = first.headers.get("Content-Security-Policy");
    const secondCsp = second.headers.get("Content-Security-Policy");

    expect(first.status).toBe(200);
    expect(firstCsp).toContain("'strict-dynamic'");
    expect(firstCsp).toMatch(/'nonce-[A-Za-z0-9-]+'/);
    expect(secondCsp).toMatch(/'nonce-[A-Za-z0-9-]+'/);
    expect(secondCsp).not.toBe(firstCsp);
  });
});
