import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/content-security-policy";

export const metadata: Metadata = {
  title: "Time Overlay Live",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function LiveRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read once so the route stays dynamic and Next can attach its CSP nonce.
  await headers().then((h) => h.get(CSP_NONCE_HEADER));

  return (
    <html lang="en" style={{ background: "transparent" }}>
      <body style={{ margin: 0, background: "transparent", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
