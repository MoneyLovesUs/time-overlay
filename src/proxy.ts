import { NextResponse, type NextRequest } from "next/server";

import {
  buildContentSecurityPolicy,
  CSP_NONCE_HEADER,
} from "@/lib/content-security-policy";

// The /styles/<preset> landing pages (and their /<locale>/styles/<preset>
// variants) were retired after producing no search demand. Preserve the
// explicit 410 response while expanding Proxy coverage to inject CSP nonces.
const RETIRED_STYLES_SEGMENT = /(?:^|\/)styles(?:\/|$)/;

export function proxy(request: NextRequest): NextResponse {
  if (RETIRED_STYLES_SEGMENT.test(request.nextUrl.pathname)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const nonce = crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    "Content-Security-Policy",
    buildContentSecurityPolicy(nonce),
  );

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|.*\\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|png|svg|txt|webmanifest|webp|xml)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
