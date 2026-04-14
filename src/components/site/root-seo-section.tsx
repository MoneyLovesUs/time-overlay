const faqItems = [
  {
    question: "Can I export an overlay timer with transparency?",
    answer:
      "Yes. The safest local-first route is PNG sequence, because editors handle image-based transparent assets more reliably than compressed video workflows. WebM is available when the browser supports it, but PNG sequence stays the safest handoff when transparency matters most.",
  },
  {
    question: "Which export format should I pick first?",
    answer:
      "Start with PNG sequence if you want the most dependable editor handoff, especially for compositing over real footage. Choose WebM when you want a lighter local video export and your browser already supports it cleanly.",
  },
  {
    question: "Is this tool rendered on the server?",
    answer:
      "No. The core experience is local-first. Preview and export run on the user's machine so the homepage can behave like a real tool instead of waiting on a remote render queue.",
  },
  {
    question: "What timer style reads best on video?",
    answer:
      "Simple numerals with strong contrast usually win. Monospaced digits, restrained glow, and careful corner placement stay readable over busy footage better than decorative timer skins.",
  },
  {
    question: "Should I use this for TikTok, YouTube, and editors like CapCut or Premiere?",
    answer:
      "Yes, but the handoff path changes. Short-form and editor workflows usually benefit from transparent or image-sequence exports, while quick local video exports can work when you only need a lightweight WebM asset.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function RootSeoSection() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-border/70 bg-[linear-gradient(180deg,rgba(8,9,13,1),rgba(10,11,16,1))]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div
        aria-hidden="true"
        className="cyber-grid cyber-scanlines absolute inset-0 opacity-45"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:py-14 lg:gap-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-tertiary">
              Tool Notes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
              One tool page, plus the smallest amount of context needed to use it well.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Time Overlay is designed as a local-first overlay timer generator.
              Use the controls above to configure duration, style, position, and
              export format, then keep this lower section for the handful of
              questions that still matter for SEO and real-world workflow choices.
            </p>
          </div>

          <div
            id="export-formats"
            className="cyber-panel-muted cyber-chamfer px-5 py-5 text-sm leading-7 text-muted-foreground"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
              Export formats
            </p>
            <p className="mt-3">
              PNG sequence is the most dependable local export when you need
              transparent overlays or editor-friendly assets.
            </p>
            <p className="mt-3">
              WebM is available as a browser-native convenience path when the
              current environment supports it cleanly.
            </p>
          </div>
        </div>

        <div className="cyber-panel cyber-chamfer overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>FAQ</span>
            <span className="text-primary">Overlay timer essentials</span>
          </div>

          <div className="divide-y divide-border/70">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                className="group px-5 py-4 open:bg-background/45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-base font-medium tracking-tight text-foreground">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-4xl pl-12 text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
