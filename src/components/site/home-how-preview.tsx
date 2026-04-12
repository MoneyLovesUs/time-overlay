import Link from "next/link";

import { Button } from "@/components/ui/button";
import { homeLinks } from "@/components/site/home-links";

const workflowSteps = [
  {
    title: "Choose the countdown role",
    command: "mode --overlay transparent|baked",
    detail:
      "Decide whether the overlay timer is a transparent layer for later compositing or a visible timer that stays inside the final rendered video.",
    result: "Sets the render path before you spend time styling the timer.",
  },
  {
    title: "Set output cues that affect readability",
    command: "style --duration 05:00 --font mono --accent restrained",
    detail:
      "Duration, format, and font choices influence whether a countdown feels cinematic, instructional, or utility-first on screen.",
    result: "Locks in the visual language the audience has to parse at a glance.",
  },
  {
    title: "Match the timer to the edit",
    command: "place --safe-zone video|stream",
    detail:
      "Positioning, spacing, and safe-zone choices keep the overlay from fighting subtitles, speaker framing, or a live layout.",
    result: "Routes the timer into the final frame without breaking the composition.",
  },
] as const;

const previewCtaClassName =
  "relative isolate h-auto overflow-hidden rounded-none border border-tertiary/35 bg-background/50 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground before:absolute before:inset-x-4 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-tertiary/80 before:to-transparent before:opacity-75 before:content-[''] hover:-translate-y-0.5 hover:border-tertiary/60 hover:bg-tertiary/10 hover:text-tertiary hover:shadow-[0_0_0_1px_rgba(0,212,255,0.18),0_0_28px_rgba(0,212,255,0.16)] focus-visible:-translate-y-0.5 focus-visible:border-tertiary/70 focus-visible:text-tertiary focus-visible:shadow-[0_0_0_1px_rgba(0,212,255,0.2),0_0_30px_rgba(0,212,255,0.18)] motion-reduce:transform-none";

const previewPulseClassName =
  "pointer-events-none absolute inset-0 rounded-none bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.22),transparent_62%)] opacity-0 transition-opacity duration-200 group-hover/button:animate-pulse group-hover/button:opacity-100 motion-reduce:animate-none";

export function HomeHowPreview() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,rgba(8,9,13,1),rgba(10,10,15,1))]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(0,212,255,0.1),transparent_24%),radial-gradient(circle_at_10%_80%,rgba(255,0,255,0.09),transparent_22%)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:gap-12 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
              Workflow Terminal
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
              Treat the workflow like an execution rail: define the job, lock
              the visual rules, then route the timer into the edit or stream
              scene.
            </h2>
          </div>

          <Button
            render={<Link href={homeLinks.howItWorksWorkflow} />}
            nativeButton={false}
            variant="outline"
            className={previewCtaClassName}
          >
            <span aria-hidden="true" className={previewPulseClassName} />
            Open full process log
          </Button>
        </div>

        <div className="cyber-panel cyber-chamfer overflow-hidden transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.12),0_0_38px_rgba(0,255,136,0.14)] motion-reduce:transform-none">
          <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:px-6">
            <span>Execution rail</span>
            <span className="text-primary">Input / route / destination</span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
            <div className="border-b border-border/70 px-5 py-6 sm:px-6 lg:border-r lg:border-b-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-tertiary">
                Terminal summary
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                Run the workflow in order so each step narrows the next
                decision instead of reopening it.
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Start with countdown intent, lock the visual rules, then carry
                the timer into the frame with less guesswork and fewer late
                export surprises.
              </p>

              <div className="mt-6 rounded-none border border-tertiary/30 bg-tertiary/8 px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
                  Destination
                </p>
                <p className="mt-2 text-sm leading-7 text-foreground">
                  Open the full guide when you want app-specific workflow details
                  for editors and publishing paths.
                </p>
              </div>
            </div>

            <div className="relative px-5 py-6 sm:px-6">
              <div
                aria-hidden="true"
                className="absolute bottom-8 left-[1.05rem] top-8 w-px bg-gradient-to-b from-primary via-tertiary to-transparent sm:left-[1.3rem]"
              />
              <ol className="relative space-y-0">
                {workflowSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="relative grid gap-3 rounded-none border border-transparent pb-8 pl-9 pr-3 transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-border/80 hover:bg-background/35 hover:shadow-[0_0_0_1px_rgba(0,212,255,0.08),0_0_22px_rgba(0,212,255,0.08)] last:pb-0 sm:pl-12 motion-reduce:transform-none"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-background text-[10px] text-primary shadow-[0_0_18px_rgba(0,255,136,0.16)]"
                    >
                      {index + 1}
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      {step.command}
                    </p>
                    <h3 className="text-xl font-medium tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {step.detail}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-tertiary">
                      Output: {step.result}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
