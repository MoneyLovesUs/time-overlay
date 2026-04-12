import Link from "next/link";

import { homeLinks } from "@/components/site/home-links";

const faqPreviewItems = [
  {
    question: "Can an overlay timer export with transparency?",
    answer:
      "That depends on the output format and editing stack, which is why the site separates transparent overlays from baked-in video timers.",
    href: homeLinks.qaTransparentExports,
  },
  {
    question: "What countdown style reads best on video?",
    answer:
      "Mono numerals, disciplined spacing, and a restrained accent usually survive motion better than decorative timer faces.",
    href: homeLinks.qaBestStyles,
  },
  {
    question: "Should I show the timer in the corner or center?",
    answer:
      "Placement depends on subtitles, face cam framing, and the job the timer is doing inside the edit or stream layout.",
    href: homeLinks.qaPlacementGuide,
  },
  {
    question: "Is this a live tool already?",
    answer:
      "No. Right now the site gives workflow, styling, and export guidance so you can choose the right overlay-timer setup before building or rendering it elsewhere.",
    href: homeLinks.qaLiveToolStatus,
  },
] as const;

export function HomeFaqPreview() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,rgba(10,10,15,1),rgba(13,15,21,1))]">
      <div
        aria-hidden="true"
        className="cyber-grid absolute inset-0 opacity-50"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:gap-12 lg:py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
            FAQ Feed
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
            Intercept the questions creators usually ask once transparency,
            placement, or live-tool expectations start affecting the plan.
          </h2>
        </div>

        <div className="cyber-panel cyber-chamfer overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:px-6">
            <span>Intercepted knowledge items</span>
            <span className="text-primary">Read-only feed</span>
          </div>

          <div className="divide-y divide-border/70">
            {faqPreviewItems.map((item, index) => (
              <article
                key={item.question}
                className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[7rem_minmax(0,1fr)] lg:items-start"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  Q0{index + 1}
                </p>
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-foreground">
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-primary"
                    >
                      {item.question}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
