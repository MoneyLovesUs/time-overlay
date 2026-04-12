import { qaGroups } from "@/components/site/qa-content";

function formatQuestionIndex(index: number) {
  return `Q${String(index + 1).padStart(2, "0")}`;
}

function formatTopicIndex(index: number) {
  return `CH-${String(index + 1).padStart(2, "0")}`;
}

export function QaSection() {
  return (
    <div className="relative border-b border-border/70 bg-[linear-gradient(180deg,rgba(7,8,12,1),rgba(10,11,16,1))]">
      <div
        aria-hidden="true"
        className="cyber-grid cyber-scanlines absolute inset-0 opacity-45"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 sm:py-16 lg:gap-12 lg:py-20">
        {qaGroups.map((group, groupIndex) => (
          <section
            key={group.id}
            id={group.id}
            className="scroll-mt-24"
          >
            <div className="cyber-panel cyber-chamfer overflow-hidden border-border/80 bg-background/85 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_28px_80px_rgba(0,0,0,0.3)]">
              <div className="grid lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
                <header className="relative overflow-hidden border-b border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(0,255,136,0.11),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(0,212,255,0.12),transparent_28%),linear-gradient(180deg,rgba(10,12,18,0.98),rgba(8,9,14,0.98))] p-6 sm:p-7 lg:border-r lg:border-b-0">
                  <div aria-hidden="true" className="cyber-grid absolute inset-0 opacity-45" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      <span>{formatTopicIndex(groupIndex)}</span>
                      <span className="text-primary">Topic channel</span>
                    </div>

                    <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-tertiary">
                      {group.eyebrow}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                      {group.title}
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-[15px]">
                      {group.intro}
                    </p>

                    <p className="mt-7 border-t border-dashed border-border/60 pt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      {group.questions.length} creator questions in this channel
                    </p>
                  </div>
                </header>

                <div className="bg-background/96">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:px-7">
                    <span>Question feed</span>
                    <span className="text-primary">{group.questions.length} entries</span>
                  </div>

                  <div className="divide-y divide-border/70">
                    {group.questions.map((item, questionIndex) => (
                      <article
                        key={item.question}
                        id={item.id}
                        className="scroll-mt-24 px-5 py-6 sm:px-7"
                      >
                        <div className="grid gap-4 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:items-start lg:gap-6">
                          <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                              {formatQuestionIndex(questionIndex)}
                            </span>
                          </div>

                          <div>
                            {item.kicker ? (
                              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-tertiary">
                                {item.kicker}
                              </p>
                            ) : null}
                            <h3 className="mt-3 max-w-4xl text-xl font-medium tracking-[-0.03em] text-foreground sm:text-[1.7rem]">
                              {item.question}
                            </h3>
                            <div className="mt-4 grid max-w-4xl gap-4 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                              {item.answer.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
