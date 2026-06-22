import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The /styles/<preset> landing pages (and their /<locale>/styles/<preset>
// variants) were retired: 160 near-duplicate URLs that earned zero Search
// Console impressions over 12+ months. They are gone for good, so answer with
// 410 Gone — the explicit "deleted, drop it from the index" signal — instead of
// the soft 404 that a missing route would produce. Preset deep-linking still
// works through the generator's `/?preset=<id>` query param, which is untouched.
const RETIRED_STYLES_SEGMENT = /(?:^|\/)styles(?:\/|$)/;

export function proxy(request: NextRequest): NextResponse {
  if (RETIRED_STYLES_SEGMENT.test(request.nextUrl.pathname)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/styles/:path*", "/:locale/styles/:path*"],
};
