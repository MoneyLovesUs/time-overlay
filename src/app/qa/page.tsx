import type { Metadata } from "next";
import Link from "next/link";

import { homeLinks } from "@/components/site/home-links";
import { qaGroupLinks } from "@/components/site/qa-content";
import { QaSection } from "@/components/site/qa-section";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/site";

const archiveSignals = [
  {
    label: "Mode",
    value: "Knowledge terminal",
  },
  {
    label: "Archive",
    value: "Overlay timer decisions",
  },
  {
    label: "Audience",
    value: "Creator-facing workflows",
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

const routeChoices = [
  {
    href: "/",
    label: "Overlay timer overview",
    command: "/",
  },
  {
    href: homeLinks.howItWorksWorkflow,
    label: "Workflow guide",
    command: "/how-it-works#workflow",
  },
] as const;

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
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.14),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,0,255,0.1),transparent_24%),linear-gradient(180deg,rgba(10,10,15,0.98),rgba(8,9,13,0.98))]"
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
                  Knowledge Terminal
                </span>
                <span className="hidden h-3 w-px bg-border sm:block" />
                <span className="hidden sm:block">Signal archive / creator Q&amp;A</span>
              </div>

              <p className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
                Archive Intro
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
                Practical answers for overlay timers, transparent exports, and
                real editing workflows.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Enter this route when you need fast answers on timer styling,
                frame placement, transparent exports, and editor handoff choices
                for CapCut, Premiere Pro, Final Cut Pro, TikTok, YouTube, and
                adjacent creator workflows.
              </p>

              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {archiveSignals.map((signal) => (
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
                  <span>Route handoff</span>
                  <span className="text-primary">Live index</span>
                </div>
                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  Need the broader system first? Exit this archive through the
                  overview or workflow route, then return when you need an exact
                  export or placement answer.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  {routeChoices.map((route, index) => (
                    <Button
                      key={route.href}
                      render={<Link href={route.href} />}
                      nativeButton={false}
                      size="lg"
                      variant={index === 0 ? "default" : "outline"}
                      className={
                        index === 0
                          ? primaryRouteButtonClassName
                          : secondaryRouteButtonClassName
                      }
                    >
                      <span>{route.label}</span>
                      <span aria-hidden="true">{route.command}</span>
                    </Button>
                  ))}
                </div>

                <div className="mt-6 rounded-none border border-border/80 bg-background/65 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Intake note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This route stays focused on decision support. The detailed
                    answers live below in the archive sections without changing
                    the current route structure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label="Q&A topic sections"
            className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4"
          >
            {qaGroupLinks.map((group, index) => (
              <Link
                key={group.id}
                href={`#${group.id}`}
                className={jumpNavRouteClassName}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/75 to-transparent opacity-70"
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                      Route {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-3 text-sm font-medium tracking-tight text-foreground">
                      {group.label}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-primary"
                  >
                    /jump
                  </span>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  #{group.id}
                </p>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <QaSection />

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
              Compare the broader workflow, then re-enter this archive when you
              need a precise export, styling, or placement answer.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Keep the path simple: use the overview when you are orienting,
              switch to the workflow guide when you are choosing the production
              route, then come back here for the exact operational question.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {routeChoices.map((route, index) => (
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
