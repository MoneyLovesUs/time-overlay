import Link from "next/link";

import { Button } from "@/components/ui/button";
import { homeLinks } from "@/components/site/home-links";

type HomeFinalCtaProps = {
  siteName: string;
};

const primaryRouteCtaClassName =
  "mt-6 relative isolate h-auto justify-between overflow-hidden rounded-none border border-primary/45 bg-primary/12 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-primary before:absolute before:inset-x-4 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/80 before:to-transparent before:opacity-80 before:content-[''] hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/16 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.22),0_0_32px_rgba(0,255,136,0.22)] focus-visible:-translate-y-0.5 focus-visible:border-primary/70 focus-visible:shadow-[0_0_0_1px_rgba(0,255,136,0.24),0_0_34px_rgba(0,255,136,0.24)] motion-reduce:transform-none";

const secondaryRouteCtaClassName =
  "mt-6 relative isolate h-auto justify-between overflow-hidden rounded-none border border-tertiary/35 bg-background/45 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground before:absolute before:inset-x-4 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-tertiary/80 before:to-transparent before:opacity-75 before:content-[''] hover:-translate-y-0.5 hover:border-tertiary/60 hover:bg-tertiary/10 hover:text-tertiary hover:shadow-[0_0_0_1px_rgba(0,212,255,0.18),0_0_28px_rgba(0,212,255,0.16)] focus-visible:-translate-y-0.5 focus-visible:border-tertiary/70 focus-visible:text-tertiary focus-visible:shadow-[0_0_0_1px_rgba(0,212,255,0.2),0_0_30px_rgba(0,212,255,0.18)] motion-reduce:transform-none";

const primaryPulseClassName =
  "pointer-events-none absolute inset-0 rounded-none bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.26),transparent_62%)] opacity-0 transition-opacity duration-200 group-hover/button:animate-pulse group-hover/button:opacity-100 motion-reduce:animate-none";

const secondaryPulseClassName =
  "pointer-events-none absolute inset-0 rounded-none bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.22),transparent_62%)] opacity-0 transition-opacity duration-200 group-hover/button:animate-pulse group-hover/button:opacity-100 motion-reduce:animate-none";

export function HomeFinalCta({ siteName }: HomeFinalCtaProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(13,15,21,1),rgba(8,9,13,1))]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,212,255,0.12),transparent_22%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="cyber-panel cyber-chamfer overflow-hidden border-primary/30 shadow-[0_0_42px_rgba(0,255,136,0.14)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.14),0_0_48px_rgba(0,255,136,0.18)] motion-reduce:transform-none">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:px-8">
            <span>Final CTA Beacon</span>
            <span className="text-primary">Choose the next route</span>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
                Decision relay
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
                Use {siteName} to clear the blocker in front of you, then take
                the route that answers that blocker directly.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                If export rules are still unclear, go to the Q&amp;A. If the
                countdown plan is settled and you want to stage it in an edit or
                stream layout, go to the workflow guide.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="cyber-panel-muted cyber-chamfer flex h-full flex-col p-5 transition-[transform,border-color,box-shadow,background-color] duration-200 ease-out hover:-translate-y-1 hover:border-tertiary/55 hover:shadow-[0_0_0_1px_rgba(0,212,255,0.14),0_0_28px_rgba(0,212,255,0.16)] motion-reduce:transform-none">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                  Route A / inspect
                </p>
                <h3 className="mt-3 text-xl font-medium tracking-tight text-foreground">
                  I still need export and editing certainty.
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Use the Q&amp;A when you still need clarity on transparent
                  exports, baked-in renders, or which output approach belongs in your
                  editing workflow.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-foreground">
                  <li>Transparent export questions</li>
                  <li>Baked-in versus overlay output</li>
                  <li>Editing workflow handoff</li>
                </ul>
                <Button
                  render={<Link href={homeLinks.qaExportQuestions} />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className={secondaryRouteCtaClassName}
                >
                  <span aria-hidden="true" className={secondaryPulseClassName} />
                  <span>Read the overlay timer Q&amp;A</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/button:translate-x-0.5 motion-reduce:transform-none"
                  >
                    /inspect
                  </span>
                </Button>
              </article>

              <article className="cyber-panel cyber-chamfer flex h-full flex-col p-5 transition-[transform,border-color,box-shadow,background-color] duration-200 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.14),0_0_30px_rgba(0,255,136,0.16)] motion-reduce:transform-none">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                  Route B / run
                </p>
                <h3 className="mt-3 text-xl font-medium tracking-tight text-foreground">
                  I am ready to stage the timer in a workflow.
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Open the guide when the question is no longer whether the
                  timer fits, but how to carry it into the edit or publish path.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-foreground">
                  <li>Three-step workflow rail</li>
                  <li>Editing and publishing context</li>
                  <li>Cleaner handoff into production</li>
                </ul>
                <Button
                  render={<Link href={homeLinks.howItWorksWorkflow} />}
                  nativeButton={false}
                  size="lg"
                  className={primaryRouteCtaClassName}
                >
                  <span aria-hidden="true" className={primaryPulseClassName} />
                  <span>Read the workflow guide</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/button:translate-x-0.5 motion-reduce:transform-none"
                  >
                    /run
                  </span>
                </Button>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
