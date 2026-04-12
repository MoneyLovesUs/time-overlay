import { qaGroups } from "@/components/site/qa-content";

export function QaSection() {
  return (
    <div className="border-b border-border/70 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-16 lg:gap-18">
        {qaGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="scroll-mt-24 border-t border-border/70 pt-8 first:border-t-0 first:pt-0"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
              <header className="max-w-sm">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  {group.eyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {group.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {group.intro}
                </p>
              </header>

              <div className="grid gap-6">
                {group.questions.map((item) => (
                  <article
                    key={item.question}
                    id={item.id}
                    className="scroll-mt-24 rounded-[1.75rem] border border-border/80 bg-[#fcfbf8] px-6 py-6 shadow-[0_10px_30px_rgba(20,20,20,0.03)]"
                  >
                    {item.kicker ? (
                      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        {item.kicker}
                      </p>
                    ) : null}
                    <h3 className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">
                      {item.question}
                    </h3>
                    <div className="mt-4 grid gap-4 text-sm leading-7 text-muted-foreground sm:text-base">
                      {item.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
