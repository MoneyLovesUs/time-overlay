import { buildLlmsTxt } from "@/lib/markdown/llms";

// Static plain-text index for AI crawlers; regenerated at build only.
export const dynamic = "force-static";

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
