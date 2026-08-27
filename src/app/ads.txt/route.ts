import { buildAdsTxtRecord, publicationConfig } from "@/lib/publication";

export function GET() {
  const record = buildAdsTxtRecord(publicationConfig.adsenseAccount);

  if (!record) {
    return new Response("AdSense publisher account is not configured.\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  return new Response(`${record}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
