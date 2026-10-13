import type { Metadata } from "next";

import { ProSuccessClient } from "./success-client";

export const metadata: Metadata = {
  title: "Pro unlocked — Time Overlay",
  description:
    "Your Time Overlay Pro purchase was verified. This one-time unlock lives in this browser.",
  // The success page is a private post-checkout utility page: keep it out of
  // search results and (by not touching src/lib/site.ts) out of the sitemap.
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProSuccessPage() {
  return <ProSuccessClient />;
}
