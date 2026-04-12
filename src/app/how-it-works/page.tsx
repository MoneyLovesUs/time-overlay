import type { Metadata } from "next";
import Link from "next/link";

import {
  editingWorkflows,
  howItWorksProcessSteps,
} from "@/components/site/how-it-works-content";
import {
  homeLinks,
  howItWorksAnchors,
} from "@/components/site/home-links";
import { ProcessSteps } from "@/components/site/process-steps";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "How Overlay Timer Workflow Fits Into Editing and Publishing",
  description:
    "A creator-focused guide to the overlay timer workflow: set duration, choose style and export format, import the file into editors like CapCut, Premiere Pro, or Final Cut Pro, and finish cleanly for TikTok or YouTube publishing.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,246,242,0.94)_48%,rgba(255,255,255,1)_100%)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                How it works
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
                Build the countdown, export the right file, and place it in the
                edit without adding guesswork to production.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                The overlay timer workflow is built around three creator
                decisions: how long the countdown should run, how it should
                look on screen, and which file format belongs in the timeline.
                Once those are set, the last step is straightforward: download
                the final asset, import it into the editor, and only then move
                into the export or publishing workflow you already use.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  render={<Link href={`#${howItWorksAnchors.workflow}`} />}
                  nativeButton={false}
                  size="lg"
                >
                  Jump to the three-step workflow
                </Button>
                <Button
                  render={<Link href="/qa" />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                >
                  Browse overlay timer workflow questions
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border/80 bg-white/85 p-6 shadow-[0_16px_40px_rgba(20,20,20,0.04)]">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                At a glance
              </p>

              <div className="mt-4 space-y-4">
                {howItWorksProcessSteps.map((step, index) => (
                  <div key={step.title} className="border-t border-border pt-4">
                    <p className="font-mono text-sm text-muted-foreground">
                      {`0${index + 1}`}
                    </p>
                    <p className="mt-2 text-sm leading-6">{step.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <nav
            aria-label="How it works sections"
            className="grid gap-3 sm:grid-cols-3"
          >
            <Link
              href={`#${howItWorksAnchors.workflow}`}
              className="rounded-[1.4rem] border border-border/80 bg-background px-5 py-4 text-sm font-medium tracking-tight transition-colors hover:border-primary/40 hover:text-primary"
            >
              Three-step workflow
            </Link>
            <Link
              href={`#${howItWorksAnchors.editingWorkflows}`}
              className="rounded-[1.4rem] border border-border/80 bg-background px-5 py-4 text-sm font-medium tracking-tight transition-colors hover:border-primary/40 hover:text-primary"
            >
              Editing and publishing apps
            </Link>
            <Link
              href={homeLinks.qaExportQuestions}
              className="rounded-[1.4rem] border border-border/80 bg-background px-5 py-4 text-sm font-medium tracking-tight transition-colors hover:border-primary/40 hover:text-primary"
            >
              Export and editing Q&amp;A
            </Link>
          </nav>
        </div>
      </section>

      <ProcessSteps />

      <section
        id={howItWorksAnchors.editingWorkflows}
        className="border-b border-border/70 bg-[#f7f3ea] scroll-mt-24"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Editing workflow
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Use the finished overlay like any other timeline asset: import
                it, stack it above footage when needed, and keep it readable in
                the final frame.
              </h2>
            </div>

            <p className="text-sm leading-7 text-muted-foreground">
              The tool path splits cleanly here: editing apps are where you
              import and place the timer, while TikTok and YouTube workflows
              are where you review framing and publish the finished video.
            </p>
          </div>

          <nav
            aria-label="Editing and publishing app links"
            className="flex flex-wrap gap-3"
          >
            {editingWorkflows.map((workflow) => (
              <Link
                key={workflow.id}
                href={`#${workflow.id}`}
                className="rounded-full border border-border/80 bg-background px-4 py-2 text-sm font-medium tracking-tight transition-colors hover:border-primary/40 hover:text-primary"
              >
                {workflow.title}
              </Link>
            ))}
          </nav>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {editingWorkflows.map((workflow) => (
              <article
                id={workflow.id}
                key={workflow.id}
                className="rounded-[1.6rem] border border-border/80 bg-background p-6 shadow-[0_16px_40px_rgba(20,20,20,0.04)]"
              >
                <h3 className="text-xl font-medium tracking-tight">
                  {workflow.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {workflow.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Keep exploring
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Return to the overview or use the Q&amp;A page when you need a
              more specific export, styling, or placement answer.
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
            <Button render={<Link href="/qa" />} nativeButton={false}>
              Open the overlay timer Q&amp;A
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
