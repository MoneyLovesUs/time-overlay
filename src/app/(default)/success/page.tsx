import type { Metadata } from "next";
import { Suspense } from "react";

import { SuccessShell } from "@/components/license/success-shell";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Activating Time Overlay Pro",
  description: "Validating your Time Overlay Pro license.",
  path: "/success",
});

function SuccessFallback() {
  return (
    <main className="mx-auto flex min-h-[40vh] w-full max-w-2xl flex-col items-start gap-6 px-6 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-secondary">
        Time Overlay Pro
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Preparing activation
      </h1>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessShell />
    </Suspense>
  );
}
