const useCases = [
  {
    title: "YouTube breakdowns and edit walkthroughs",
    signal: "Channel / editorial",
    role: "Keep captions, face cams, and chapter markers from fighting the timer.",
    detail:
      "Creators often need a countdown layer that stays legible over footage while leaving room for captions, face cams, or chapter graphics.",
  },
  {
    title: "Live stream sessions and study sprints",
    signal: "Live / pacing",
    role: "Show block timing clearly without opening a second app window on stream.",
    detail:
      "A visible overlay timer helps audiences understand pacing for focus blocks, Q&A windows, and transition moments without a separate app window.",
  },
  {
    title: "Coaching calls, workshops, and product demos",
    signal: "Presentation / timing",
    role: "Keep section timing visible while the host still owns the frame.",
    detail:
      "Video-first teams use timing overlays to manage sections on screen, especially when the host wants a clean, presentation-safe countdown.",
  },
] as const;

const downstreamSignals = [
  {
    label: "Dominance",
    detail: "Decide whether the timer should lead attention or stay supportive.",
  },
  {
    label: "Clearance",
    detail: "Protect subtitle zones, speaker framing, and other persistent overlays.",
  },
  {
    label: "Render path",
    detail: "Choose early between a later composite and a baked-in countdown.",
  },
] as const;

export function HomeUseCases() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,rgba(9,10,14,1),rgba(13,15,21,1))]">
      <div
        aria-hidden="true"
        className="cyber-grid absolute inset-0 opacity-55"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:gap-12 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="max-w-lg">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
              Signal Grid
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
              Pick the scene first. The overlay timer behaves differently in an
              edit breakdown, a live sprint, or a presentation-safe countdown.
            </h2>
          </div>

          <div className="cyber-panel-muted cyber-chamfer p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Routing logic
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Start with the scene you need to support. That choice determines
              how much attention the timer should take, how much space it can
              occupy, and whether you are planning for a later composite or a
              visible final render.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <ol className="cyber-panel cyber-chamfer divide-y divide-border/70">
            {useCases.map((useCase, index) => (
              <li
                key={useCase.title}
                className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[6rem_minmax(0,1fr)] lg:gap-6"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                    0{index + 1}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {useCase.signal}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-foreground">
                    {useCase.role}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {useCase.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid gap-4">
            <article className="cyber-panel-muted cyber-chamfer p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-tertiary">
                What this choice controls
              </p>
              <div className="mt-5 space-y-4">
                {downstreamSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="border-b border-dashed border-border/70 pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-foreground">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {signal.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="cyber-panel-muted cyber-chamfer p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                First principle
              </p>
              <p className="mt-4 text-lg font-medium tracking-tight text-foreground">
                Plan around the screen you need to protect, not a generic timer
                preset.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
