import { howItWorksProcessSteps } from "@/components/site/how-it-works-content";
import { howItWorksAnchors } from "@/components/site/home-links";

export function ProcessSteps() {
  return (
    <section
      id={howItWorksAnchors.workflow}
      className="border-b border-border/70 bg-background scroll-mt-24"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Overlay timer generator workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              A creator-focused flow that starts with timing decisions and ends
              with a file you can place in the edit immediately.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            The point is not to add extra steps. It is to lock the countdown
            length, visual treatment, and delivery format before the overlay
            reaches your timeline.
          </p>
        </div>

        <ol className="grid gap-6 lg:grid-cols-3">
          {howItWorksProcessSteps.map((step, index) => (
            <li
              key={step.title}
              className="flex h-full flex-col rounded-[1.75rem] border border-border/80 bg-white p-6 shadow-[0_16px_40px_rgba(20,20,20,0.04)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-4">
                <p className="font-mono text-sm text-muted-foreground">
                  Step {index + 1}
                </p>
                <span className="rounded-full border border-border/80 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                  {step.title}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {step.detail}
              </p>

              <ul className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-5 text-sm leading-6 text-muted-foreground">
                {step.notes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
