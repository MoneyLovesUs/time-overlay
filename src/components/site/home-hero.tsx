import Link from "next/link";

import { homeLinks } from "@/components/site/home-links";
import { Button } from "@/components/ui/button";

const heroSignals = [
  {
    label: "Signal",
    value: "Overlay timer planning",
  },
  {
    label: "Output",
    value: "Transparent or baked-in",
  },
  {
    label: "Status",
    value: "Guidance live now",
  },
] as const;

const generatorPanelRows = [
  { label: "MODE", value: "Countdown overlay" },
  { label: "CANVAS", value: "Video / stream safe zone" },
  { label: "READOUT", value: "Mono digits + restrained accent" },
  { label: "EXPORT", value: "Transparency depends on format" },
];

const statusStrip = [
  "Readable over footage",
  "Workflow-first guidance",
  "Clear guidance before you render",
] as const;

const primaryCtaClassName =
  "relative isolate h-auto justify-between overflow-hidden rounded-none border border-primary/45 bg-primary/12 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-primary shadow-[0_0_28px_rgba(0,255,136,0.14)] before:absolute before:inset-x-4 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/80 before:to-transparent before:opacity-80 before:content-[''] hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/16 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.22),0_0_32px_rgba(0,255,136,0.24)] focus-visible:-translate-y-0.5 focus-visible:border-primary/70 focus-visible:shadow-[0_0_0_1px_rgba(0,255,136,0.26),0_0_34px_rgba(0,255,136,0.24)] motion-reduce:transform-none";

const secondaryCtaClassName =
  "relative isolate h-auto justify-between overflow-hidden rounded-none border border-tertiary/35 bg-background/45 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground before:absolute before:inset-x-4 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-tertiary/80 before:to-transparent before:opacity-70 before:content-[''] hover:-translate-y-0.5 hover:border-tertiary/60 hover:bg-tertiary/10 hover:text-tertiary hover:shadow-[0_0_0_1px_rgba(0,212,255,0.18),0_0_28px_rgba(0,212,255,0.16)] focus-visible:-translate-y-0.5 focus-visible:border-tertiary/70 focus-visible:text-tertiary focus-visible:shadow-[0_0_0_1px_rgba(0,212,255,0.2),0_0_30px_rgba(0,212,255,0.18)] motion-reduce:transform-none";

const primaryPulseClassName =
  "pointer-events-none absolute inset-0 rounded-none bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.26),transparent_62%)] opacity-0 transition-opacity duration-200 group-hover/button:animate-pulse group-hover/button:opacity-100 motion-reduce:animate-none";

const secondaryPulseClassName =
  "pointer-events-none absolute inset-0 rounded-none bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.22),transparent_62%)] opacity-0 transition-opacity duration-200 group-hover/button:animate-pulse group-hover/button:opacity-100 motion-reduce:animate-none";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.14),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,0,255,0.12),transparent_24%),linear-gradient(180deg,rgba(10,10,15,0.98),rgba(8,9,13,0.98))]"
      />
      <div
        aria-hidden="true"
        className="cyber-grid cyber-scanlines absolute inset-0 opacity-80"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 sm:py-16 lg:min-h-[calc(100svh-7rem)] lg:flex-row lg:items-center lg:gap-12 lg:py-20">
        <div className="max-w-3xl flex-1">
          <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-background/45 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="inline-flex items-center gap-2 text-primary">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-primary/30 blur-[6px]" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              Overlay Signal
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <span className="hidden sm:block">Creator-facing timing guidance</span>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
            Hero HUD
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-none tracking-[-0.05em] text-balance sm:text-5xl lg:text-7xl">
            <span
              className="cyber-glitch text-foreground before:opacity-55 after:opacity-45 [text-shadow:0_0_10px_rgba(0,255,136,0.18),0_0_20px_rgba(0,212,255,0.12)]"
              data-text="Overlay Timer"
            >
              Overlay Timer
            </span>{" "}
            for Video, Streams, and Countdown Overlays
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Use this overview to plan a readable overlay timer for recordings,
            live layouts, and countdown scenes before you commit to export
            settings, placement, or a baked-in render.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href={homeLinks.howItWorksWorkflow} />}
              nativeButton={false}
              size="lg"
              className={primaryCtaClassName}
            >
              <span aria-hidden="true" className={primaryPulseClassName} />
              <span>Open workflow terminal</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover/button:translate-x-0.5 motion-reduce:transform-none"
              >
                /run
              </span>
            </Button>
            <Button
              render={<Link href={homeLinks.qaExportQuestions} />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className={secondaryCtaClassName}
            >
              <span aria-hidden="true" className={secondaryPulseClassName} />
              <span>Inspect export questions</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover/button:translate-x-0.5 motion-reduce:transform-none"
              >
                /read
              </span>
            </Button>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {heroSignals.map((signal) => (
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

        <div className="w-full max-w-xl flex-1 lg:max-w-none">
          <div className="cyber-panel cyber-chamfer cyber-grid cyber-scanlines overflow-hidden p-1 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_0_1px_rgba(0,255,136,0.14),0_0_42px_rgba(0,255,136,0.16)] motion-reduce:transform-none">
            <div className="grid gap-0 border border-border/60 bg-background/90 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div className="border-b border-border/70 p-6 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  <span>Generator surface</span>
                  <span className="text-primary">Readiness: preview</span>
                </div>

                <div className="mt-6 space-y-4">
                  {generatorPanelRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-4 border-b border-dashed border-border/70 pb-4"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                        {row.label}
                      </span>
                      <span className="max-w-[15rem] text-right text-sm leading-6 text-foreground">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-none border border-tertiary/30 bg-tertiary/8 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                    Operator note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The site helps compare workflow choices now. Transparent
                    export support still depends on the editor, codec, and
                    delivery path you choose.
                  </p>
                </div>
              </div>

              <div className="bg-[linear-gradient(180deg,rgba(0,212,255,0.08),rgba(255,0,255,0.06))] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Status strip
                </p>
                <div className="mt-5 space-y-3">
                  {statusStrip.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                        0{index + 1}
                      </span>
                      <p className="text-sm leading-6 text-foreground">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-none border border-border/80 bg-background/65 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Section routing
                  </p>
                  <div className="mt-4 flex flex-col gap-3 text-sm">
                    <Link
                      href={homeLinks.howItWorksWorkflow}
                      className="flex items-center justify-between gap-3 transition-colors hover:text-primary"
                    >
                      <span>Workflow terminal</span>
                      <span aria-hidden="true" className="font-mono text-xs">
                        /how-it-works
                      </span>
                    </Link>
                    <Link
                      href={homeLinks.qaTransparentExports}
                      className="flex items-center justify-between gap-3 transition-colors hover:text-tertiary"
                    >
                      <span>Transparent export guidance</span>
                      <span aria-hidden="true" className="font-mono text-xs">
                        /qa
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
