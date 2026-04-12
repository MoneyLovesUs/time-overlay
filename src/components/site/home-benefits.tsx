const benefits = [
  {
    title: "Readable over moving footage",
    detail:
      "Contrast, spacing, and timer placement matter when an overlay timer has to stay legible over fast-moving scenes.",
  },
  {
    title: "Transparent versus baked-in output thinking",
    detail:
      "Creators often decide between a countdown layer they can composite later and a timer rendered directly into the final video.",
  },
  {
    title: "Format choices that feel grounded",
    detail:
      "Duration, font, and export format sit up front because those are the settings that usually decide whether a timer fits the job.",
  },
  {
    title: "Guidance beyond the first screen",
    detail:
      "Setup steps and export answers stay close at hand when you need to turn an overlay idea into a practical workflow.",
  },
] as const;

export function HomeBenefits() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,rgba(13,15,21,1),rgba(9,10,14,1))]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(0,255,136,0.09),transparent_22%),radial-gradient(circle_at_80%_70%,rgba(0,212,255,0.1),transparent_26%)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:gap-12 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
              Calibration Layer
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
              After the scene is chosen, the timer still has to pass four
              practical checks before it belongs in the frame.
            </h2>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            Check whether the audience can read it, whether the export path can
            support it, whether the styling still feels grounded, and whether
            the next production step is obvious.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="cyber-panel-muted cyber-chamfer p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-tertiary">
              Operator priority
            </p>
            <p className="mt-4 text-lg font-medium tracking-tight text-foreground">
              Readability wins when footage, subtitles, and host framing are
              already competing for attention.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              If the timer fails any of these checks, the result looks noisier
              than a plain scene change or chapter cut.
            </p>
          </aside>

          <div className="cyber-panel cyber-chamfer overflow-hidden">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:grid-cols-[7rem_minmax(0,1fr)] sm:px-6">
              <span>Check</span>
              <span>Why it matters</span>
            </div>

            <div className="divide-y divide-border/70">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="grid gap-3 px-5 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:px-6"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {benefit.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
