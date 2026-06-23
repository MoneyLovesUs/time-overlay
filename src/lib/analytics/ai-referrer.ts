/**
 * Maps a document referrer to a known AI answer-engine source, so PostHog can
 * segment traffic arriving from AI citations (ChatGPT, Perplexity, etc.). Pure
 * and side-effect free for easy testing; the registration happens at init.
 */

// Ordered host-suffix → source-name map. Suffix match handles subdomains
// (e.g. "www.perplexity.ai", "chat.openai.com").
const AI_REFERRER_HOSTS: readonly { suffix: string; source: string }[] = [
  { suffix: "chatgpt.com", source: "chatgpt" },
  { suffix: "openai.com", source: "chatgpt" },
  { suffix: "perplexity.ai", source: "perplexity" },
  { suffix: "gemini.google.com", source: "gemini" },
  { suffix: "copilot.microsoft.com", source: "copilot" },
  // Note: bing.com is intentionally excluded — most bing.com referrers are plain
  // web search, not Copilot/AI answers, and tagging them as AI would inflate the
  // segment. copilot.microsoft.com captures the AI surface unambiguously.
  { suffix: "claude.ai", source: "claude" },
  { suffix: "you.com", source: "you" },
];

export function detectAiReferrerSource(referrer: string | undefined | null): string | null {
  if (!referrer) {
    return null;
  }

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }

  const match = AI_REFERRER_HOSTS.find(
    ({ suffix }) => host === suffix || host.endsWith(`.${suffix}`),
  );

  return match ? match.source : null;
}
