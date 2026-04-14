import type { Metadata } from "next";

import { GeneratorShell } from "@/components/generator/generator-shell";
import { RootSeoSection } from "@/components/site/root-seo-section";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Overlay Timer Generator for PNG Sequence and WebM Export",
  description:
    "Build an overlay timer directly in the browser, preview it live, and export PNG sequence or WebM assets from one local-first tool page.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <GeneratorShell />
      <RootSeoSection />
    </>
  );
}
