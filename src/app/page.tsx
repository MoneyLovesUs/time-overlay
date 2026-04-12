import type { Metadata } from "next";

import { HomeBenefits } from "@/components/site/home-benefits";
import { HomeFaqPreview } from "@/components/site/home-faq-preview";
import { HomeFinalCta } from "@/components/site/home-final-cta";
import { HomeHero } from "@/components/site/home-hero";
import { HomeHowPreview } from "@/components/site/home-how-preview";
import { HomeUseCases } from "@/components/site/home-use-cases";
import { createPageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Overlay Timer for Video, Streams, and Countdown Overlays",
  description:
    "Overlay timer ideas for creators who need transparent countdown overlays, readable video timers, and practical export guidance for recordings and live streams.",
  path: "/",
});

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <HomeHero />
      <HomeUseCases />
      <HomeBenefits />
      <HomeHowPreview />
      <HomeFaqPreview />
      <HomeFinalCta siteName={siteConfig.name} />
    </main>
  );
}
