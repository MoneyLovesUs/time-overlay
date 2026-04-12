import type { Metadata } from "next";
import Link from "next/link";

import { homeLinks } from "@/components/site/home-links";
import { qaGroupLinks } from "@/components/site/qa-content";
import { QaSection } from "@/components/site/qa-section";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title:
    "Overlay Timer Q&A for Transparent Exports, Editing Apps, and Video Platforms",
  description:
    "Creator-focused answers about overlay timer transparency, export formats, placement, styling, CapCut, Premiere Pro, Final Cut Pro, TikTok, and YouTube workflows.",
  path: "/qa",
});

export default function QaPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(252,251,248,1)_0%,rgba(255,255,255,1)_100%)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Creator Q&amp;A
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
                Practical answers for overlay timers, transparent exports, and
                real editing workflows.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Use this page when you need to decide how a countdown should
                look, where it should sit, and which export path makes sense
                for CapCut, Premiere Pro, Final Cut Pro, TikTok, YouTube, and
                other creator setups.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-border/80 bg-white/80 p-6 shadow-[0_16px_40px_rgba(20,20,20,0.04)]">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Need a faster starting point?
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Button
                  render={<Link href="/" />}
                  nativeButton={false}
                  size="lg"
                >
                  Read the overlay timer overview
                </Button>
                <Button
                  render={<Link href={homeLinks.howItWorksWorkflow} />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                >
                  Read the overlay timer workflow guide
                </Button>
              </div>
            </div>
          </div>

          <nav
            aria-label="Q&A topic sections"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            {qaGroupLinks.map((group) => (
              <Link
                key={group.id}
                href={`#${group.id}`}
                className="rounded-[1.4rem] border border-border/80 bg-background px-5 py-4 text-sm font-medium tracking-tight transition-colors hover:border-primary/40 hover:text-primary"
              >
                {group.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <QaSection />

      <section className="bg-[#f7f3ea]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Keep moving
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Compare the broader workflow, then come back here when you need a
              specific export or placement answer.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              variant="outline"
            >
              Return to the overlay timer overview
            </Button>
            <Button
              render={<Link href={homeLinks.howItWorksWorkflow} />}
              nativeButton={false}
            >
              Open the overlay timer workflow guide
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
