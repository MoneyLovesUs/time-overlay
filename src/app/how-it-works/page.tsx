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

const processSignals = [
  {
    label: "Mode",
    value: "Operator briefing",
  },
  {
    label: "Decisions",
    value: "Duration, style, format",
  },
  {
    label: "Outcome",
    value: "Import-ready overlay asset",
  },
] as const;

const routeButtonBaseClassName =
  "relative h-auto justify-between overflow-hidden rounded-none px-4 py-3 font-mono text-[11px] uppercase tracking-[0.28em] before:absolute before:inset-x-4 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:to-transparent before:content-[''] motion-reduce:transform-none";

const primaryRouteButtonClassName = `${routeButtonBaseClassName} border border-primary/45 bg-primary/12 text-primary shadow-[0_0_28px_rgba(0,255,136,0.14)] before:via-primary/80 before:opacity-80 hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/16 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.22),0_0_32px_rgba(0,255,136,0.24)] focus-visible:-translate-y-0.5 focus-visible:border-primary/70 focus-visible:shadow-[0_0_0_1px_rgba(0,255,136,0.26),0_0_34px_rgba(0,255,136,0.24)]`;

const secondaryRouteButtonClassName = `${routeButtonBaseClassName} border border-tertiary/35 bg-background/45 text-foreground before:via-tertiary/80 before:opacity-70 hover:-translate-y-0.5 hover:border-tertiary/60 hover:bg-tertiary/10 hover:text-tertiary hover:shadow-[0_0_0_1px_rgba(0,212,255,0.18),0_0_28px_rgba(0,212,255,0.16)] focus-visible:-translate-y-0.5 focus-visible:border-tertiary/70 focus-visible:text-tertiary focus-visible:shadow-[0_0_0_1px_rgba(0,212,255,0.2),0_0_30px_rgba(0,212,255,0.18)]`;

const routeCardEffectClassName =
  "cyber-panel-muted cyber-chamfer group transition-[transform,border-color,box-shadow,background-color,color] duration-200 ease-out hover:-translate-y-1 hover:border-primary/45 hover:bg-primary/8 hover:text-primary hover:shadow-[0_0_0_1px_rgba(0,255,136,0.12),0_0_28px_rgba(0,255,136,0.16)] focus-visible:-translate-y-1 focus-visible:border-primary/55 focus-visible:shadow-[0_0_0_1px_rgba(0,255,136,0.14),0_0_28px_rgba(0,255,136,0.16)] motion-reduce:transform-none";

const jumpNavRouteClassName = `${routeCardEffectClassName} relative overflow-hidden px-5 py-4`;

const exitRouteClassName = `${routeCardEffectClassName} flex items-center justify-between gap-4 px-5 py-4`;

const exitRoutes = [
  {
    href: "/",
    label: "Overlay timer overview",
    command: "/",
  },
  {
    href: "/qa",
    label: "Overlay timer Q&A",
    command: "/qa",
  },
] as const;

const workflowStageModules = [
  {
    id: `${howItWorksAnchors.editingWorkflows}-editors`,
    stage: "editor",
    label: "Import targets",
    command: "/editor",
    detail:
      "Editing apps are where the overlay gets imported, aligned to the cue, and kept adjustable on the timeline.",
  },
  {
    id: `${howItWorksAnchors.editingWorkflows}-publishing`,
    stage: "publishing",
    label: "Publishing workflows",
    command: "/publish",
    detail:
      "Publishing routes stay downstream. Use them after the edit is locked and the timer placement already works in frame.",
  },
] as const;

const workflowStageMeta = {
  editor: {
    badge: "Import target",
    teaserEyebrow: "Editor lane",
    commandClassName:
      "text-primary border-primary/35 bg-primary/10 shadow-[0_0_18px_rgba(0,255,136,0.12)]",
    linkClassName:
      "cyber-panel cyber-chamfer group overflow-hidden p-1 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.12),0_0_28px_rgba(0,255,136,0.16)] motion-reduce:transform-none",
    linkGlowClassName: "via-primary/75",
    summaryClassName: "text-primary",
  },
  publishing: {
    badge: "Publishing route",
    teaserEyebrow: "Publishing lane",
    commandClassName:
      "text-tertiary border-tertiary/35 bg-tertiary/10 shadow-[0_0_18px_rgba(0,212,255,0.1)]",
    linkClassName:
      "cyber-panel-muted cyber-chamfer group overflow-hidden p-1 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-tertiary/55 hover:shadow-[0_0_0_1px_rgba(0,212,255,0.14),0_0_28px_rgba(0,212,255,0.16)] motion-reduce:transform-none",
    linkGlowClassName: "via-tertiary/75",
    summaryClassName: "text-tertiary",
  },
} as const;

function buildWorkflowRouteCode(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const metadata: Metadata = createPageMetadata({
  title: "How Overlay Timer Workflow Fits Into Editing and Publishing",
  description:
    "A creator-focused guide to the overlay timer workflow: set duration, choose style and export format, import the file into editors like CapCut, Premiere Pro, or Final Cut Pro, and finish cleanly for TikTok or YouTube publishing.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  const workflowModules = workflowStageModules.map((module) => ({
    ...module,
    items: editingWorkflows.filter((workflow) => workflow.stage === module.stage),
  }));

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,136,0.14),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(0,212,255,0.12),transparent_24%),linear-gradient(180deg,rgba(10,10,15,0.98),rgba(8,9,13,0.98))]"
        />
        <div
          aria-hidden="true"
          className="cyber-grid cyber-scanlines absolute inset-0 opacity-80"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 sm:py-16 lg:gap-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-background/45 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="inline-flex items-center gap-2 text-primary">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-primary/30 blur-[6px]" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
                  </span>
                  Operator Briefing
                </span>
                <span className="hidden h-3 w-px bg-border sm:block" />
                <span className="hidden sm:block">Process console / route map</span>
              </div>

              <p className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
                How it works
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
                Build the countdown, export the right file, and place it in the
                edit without adding guesswork to production.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Use this page as a briefing for the timer workflow. First lock
                the countdown duration, visual treatment, and export format.
                Then bring the finished asset into the edit while TikTok,
                YouTube, or any other publishing flow stays downstream from the
                editor instead of getting mixed into setup.
              </p>

              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {processSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="cyber-panel-muted cyber-chamfer px-4 py-4 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-tertiary/55 hover:shadow-[0_0_0_1px_rgba(0,212,255,0.14),0_0_28px_rgba(0,212,255,0.16)] motion-reduce:transform-none"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {signal.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-foreground">
                      {signal.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="cyber-panel cyber-chamfer cyber-grid cyber-scanlines overflow-hidden p-1">
              <div className="border border-border/65 bg-background/90 p-6">
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span>Process console</span>
                  <span className="text-primary">Ready</span>
                </div>
                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  Use this briefing to move through the timer setup in order:
                  configure the countdown, confirm the export, then move the
                  asset into the right editing app before you think about
                  publishing.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    render={<Link href={`#${howItWorksAnchors.workflow}`} />}
                    nativeButton={false}
                    size="lg"
                    className={primaryRouteButtonClassName}
                  >
                    <span>Open the three-step workflow</span>
                    <span aria-hidden="true">/workflow</span>
                  </Button>
                  <Button
                    render={<Link href="/qa" />}
                    nativeButton={false}
                    size="lg"
                    variant="outline"
                    className={secondaryRouteButtonClassName}
                  >
                    <span>Check workflow Q&amp;A</span>
                    <span aria-hidden="true">/qa</span>
                  </Button>
                </div>

                <div className="mt-6 rounded-none border border-border/80 bg-background/65 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    At a glance
                  </p>

                  <div className="mt-4 space-y-4">
                    {howItWorksProcessSteps.map((step, index) => (
                      <div
                        key={step.title}
                        className="border-t border-border/80 pt-4 first:border-t-0 first:pt-0"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-primary">
                            {`0${index + 1}`}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                            {step.title}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {step.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label="How it works sections and related routes"
            className="grid gap-3 sm:grid-cols-3"
          >
            <Link
              href={`#${howItWorksAnchors.workflow}`}
              className={jumpNavRouteClassName}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/75 to-transparent opacity-70"
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                    Route 01
                  </p>
                  <p className="mt-3 text-sm font-medium tracking-tight text-foreground">
                    Three-step workflow
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-primary"
                >
                  /start
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Lock the timer setup sequence first.
              </p>
            </Link>
            <Link
              href={`#${howItWorksAnchors.editingWorkflows}`}
              className={jumpNavRouteClassName}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-tertiary/75 to-transparent opacity-70"
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                    Route 02
                  </p>
                  <p className="mt-3 text-sm font-medium tracking-tight text-foreground">
                    Import targets and publishing workflows
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-primary"
                >
                  /handoff
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Choose the next stop after the file is ready.
              </p>
            </Link>
            <Link
              href={homeLinks.qaExportQuestions}
              className={jumpNavRouteClassName}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-secondary/75 to-transparent opacity-70"
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                    Route 03
                  </p>
                  <p className="mt-3 text-sm font-medium tracking-tight text-foreground">
                    Export and editing Q&amp;A
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-primary"
                >
                  /resolve
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Jump out to Q&amp;A when you need an exact export answer.
              </p>
            </Link>
          </nav>
        </div>
      </section>

      <ProcessSteps />

      <section
        id={howItWorksAnchors.editingWorkflows}
        className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,rgba(8,9,13,1),rgba(11,13,18,1))] scroll-mt-24"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(0,255,136,0.12),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(0,212,255,0.14),transparent_22%)]"
        />
        <div
          aria-hidden="true"
          className="cyber-grid cyber-scanlines absolute inset-0 opacity-55"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:gap-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
                Destination modules
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
                Route the finished overlay to the right target: editors are for
                import and placement, publishing platforms are the downstream
                review and release step.
              </h2>
            </div>

            <aside className="cyber-panel-muted cyber-chamfer p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                Route split
              </p>
              <div className="mt-5 space-y-4">
                <div className="border-b border-dashed border-border/70 pb-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                    Editor lane
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Import, stack, trim, and keep the timer adjustable inside
                    the timeline.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-tertiary">
                    Publishing lane
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Review mobile-safe framing, then export and publish after
                    the edit is already resolved.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <nav
            aria-label="Editing and publishing app links"
            className="grid gap-4 lg:grid-cols-2"
          >
            {workflowModules.map((module) => {
              const meta = workflowStageMeta[module.stage];

              return (
                <article key={module.id} className={meta.linkClassName}>
                  <div className="relative border border-border/70 bg-background/88 px-5 py-5">
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent ${meta.linkGlowClassName} to-transparent opacity-80`}
                    />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`font-mono text-[11px] uppercase tracking-[0.32em] ${meta.summaryClassName}`}
                        >
                          {meta.teaserEyebrow}
                        </p>
                        <Link
                          href={`#${module.id}`}
                          className="mt-3 block text-lg font-medium tracking-tight text-foreground transition-colors hover:text-primary focus-visible:text-primary"
                        >
                          {module.label}
                        </Link>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {module.detail}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${meta.commandClassName}`}
                      >
                        {module.command}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {module.items.map((workflow) => (
                        <Link
                          key={workflow.id}
                          href={`#${workflow.id}`}
                          className="rounded-full border border-border/80 bg-background/72 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                        >
                          {workflow.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </nav>

          <div className="grid gap-5 xl:grid-cols-2">
            {workflowModules.map((module, moduleIndex) => {
              const meta = workflowStageMeta[module.stage];

              return (
                <section
                  id={module.id}
                  key={module.id}
                  className={meta.linkClassName}
                >
                  <div className="relative border border-border/70 bg-background/88 px-6 py-6">
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${meta.linkGlowClassName} to-transparent opacity-80`}
                    />
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-5">
                      <div className="max-w-xl">
                        <p
                          className={`font-mono text-[10px] uppercase tracking-[0.32em] ${meta.summaryClassName}`}
                        >
                          {`Destination module ${String(moduleIndex + 1).padStart(2, "0")}`}
                        </p>
                        <h3 className="mt-3 text-2xl font-medium tracking-tight text-foreground">
                          {module.label}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {module.detail}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${meta.commandClassName}`}
                      >
                        {module.command}
                      </span>
                    </div>

                    <div className="divide-y divide-border/70">
                      {module.items.map((workflow) => (
                        <article
                          id={workflow.id}
                          key={workflow.id}
                          className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-start"
                        >
                          <div>
                            <p
                              className={`font-mono text-[10px] uppercase tracking-[0.28em] ${meta.summaryClassName}`}
                            >
                              {buildWorkflowRouteCode(workflow.title)}
                            </p>
                            <h4 className="mt-3 text-xl font-medium tracking-tight text-foreground">
                              {workflow.title}
                            </h4>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">
                              {workflow.detail}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                              {meta.badge}
                            </p>
                            <p
                              className={`mt-3 text-sm font-medium tracking-tight ${meta.summaryClassName}`}
                            >
                              {module.stage === "editor"
                                ? "Use after overlay export"
                                : "Use after the edit is locked"}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(0,255,136,0.12),transparent_26%),radial-gradient(circle_at_84%_72%,rgba(0,212,255,0.12),transparent_24%),linear-gradient(180deg,rgba(9,10,14,0.98),rgba(7,8,12,1))]"
        />
        <div
          aria-hidden="true"
          className="cyber-grid cyber-scanlines absolute inset-0 opacity-70"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
              Exit Routes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
              Return to the overview for the full system picture, or switch to
              Q&amp;A when you need a narrower export, styling, or placement
              answer.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              This page covers the workflow in order. Use the overview to
              re-orient around the product surface, then move into the Q&amp;A
              route for exact creator-facing decisions that sit next to this
              workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {exitRoutes.map((route, index) => (
              <Link
                key={route.href}
                href={route.href}
                className={exitRouteClassName}
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Route {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {route.label}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary"
                >
                  {route.command}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
