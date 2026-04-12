import { howItWorksProcessSteps } from "@/components/site/how-it-works-content";
import { howItWorksAnchors } from "@/components/site/home-links";

const executionSignals = [
  "Countdown length is fixed before styling starts.",
  "Style and export decisions stay attached to readability.",
  "Import into the editor happens before any publishing step.",
] as const;

export function ProcessSteps() {
  return (
    <section
      id={howItWorksAnchors.workflow}
      className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,rgba(9,10,14,1),rgba(12,14,19,1))] scroll-mt-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(0,255,136,0.14),transparent_26%),radial-gradient(circle_at_82%_74%,rgba(0,212,255,0.1),transparent_24%)]"
      />
      <div
        aria-hidden="true"
        className="cyber-grid cyber-scanlines absolute inset-0 opacity-60"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:gap-12 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
              Execution rail
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
              Run the timer setup like a control sequence: lock the countdown,
              pair styling with export logic, then hand the finished file to
              the editor.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              The workflow stays short on purpose. What changes here is the
              order of decisions: duration first, visual and format choices
              second, editing handoff third. That keeps the timer operational
              instead of becoming one more thing to fix downstream.
            </p>
          </div>

          <aside className="cyber-panel-muted cyber-chamfer p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Control notes
            </p>
            <div className="mt-5 space-y-4">
              {executionSignals.map((signal, index) => (
                <div
                  key={signal}
                  className="border-b border-dashed border-border/70 pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                    {`0${index + 1}`}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {signal}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-5 top-0 hidden w-px bg-gradient-to-b from-primary/0 via-primary/50 to-tertiary/0 md:block"
          />

          <ol className="grid gap-5">
            {howItWorksProcessSteps.map((step, index) => (
              <li
                key={step.title}
                className="relative grid gap-4 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-6"
              >
                <div className="flex items-center gap-4 md:flex-col md:items-start md:pt-5">
                  <div className="relative flex size-10 items-center justify-center rounded-full border border-primary/40 bg-background/85 font-mono text-[11px] uppercase tracking-[0.22em] text-primary shadow-[0_0_18px_rgba(0,255,136,0.18)]">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-primary/12 blur-[10px]"
                    />
                    <span className="relative">{`0${index + 1}`}</span>
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                      {step.command}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {index === howItWorksProcessSteps.length - 1
                        ? "Final handoff"
                        : "Checkpoint"}
                    </p>
                  </div>
                </div>

                <article className="cyber-panel cyber-chamfer overflow-hidden p-1">
                  <div className="border border-border/70 bg-background/88 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {`Step ${index + 1}`}
                      </p>
                      <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-tertiary">
                        {step.title}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-medium tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-foreground">
                      {step.summary}
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                      {step.detail}
                    </p>

                    <ul className="mt-6 grid gap-3 border-t border-border/70 pt-5 sm:grid-cols-2">
                      {step.notes.map((note) => (
                        <li
                          key={note}
                          className="rounded-[1.1rem] border border-border/75 bg-background/70 px-4 py-4 text-sm leading-6 text-muted-foreground"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                            Operator note
                          </p>
                          <p className="mt-2">{note}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
