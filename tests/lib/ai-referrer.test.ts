import { describe, expect, it } from "vitest";

import { detectAiReferrerSource } from "@/lib/analytics/ai-referrer";

describe("detectAiReferrerSource", () => {
  it("detects known AI answer engines, including subdomains", () => {
    expect(detectAiReferrerSource("https://chatgpt.com/")).toBe("chatgpt");
    expect(detectAiReferrerSource("https://chat.openai.com/c/123")).toBe("chatgpt");
    expect(detectAiReferrerSource("https://www.perplexity.ai/search")).toBe("perplexity");
    expect(detectAiReferrerSource("https://gemini.google.com/app")).toBe("gemini");
    expect(detectAiReferrerSource("https://copilot.microsoft.com/")).toBe("copilot");
    expect(detectAiReferrerSource("https://www.bing.com/search?q=x")).toBe("bing");
    expect(detectAiReferrerSource("https://claude.ai/chat")).toBe("claude");
  });

  it("returns null for non-AI, empty, or malformed referrers", () => {
    expect(detectAiReferrerSource("https://www.google.com/")).toBeNull();
    expect(detectAiReferrerSource("https://t.co/abc")).toBeNull();
    expect(detectAiReferrerSource("")).toBeNull();
    expect(detectAiReferrerSource(null)).toBeNull();
    expect(detectAiReferrerSource(undefined)).toBeNull();
    expect(detectAiReferrerSource("not a url")).toBeNull();
  });

  it("does not match lookalike hosts that merely contain a known token", () => {
    expect(detectAiReferrerSource("https://notperplexity.ai.evil.com/")).toBeNull();
    expect(detectAiReferrerSource("https://openai.com.evil.com/")).toBeNull();
  });
});
