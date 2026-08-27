type GuideWorkflowDiagramProps = {
  title: string;
  caption: string;
  stages: readonly [string, string, string];
  locale?: "en" | "zh-hans";
};

export function GuideWorkflowDiagram({
  title,
  caption,
  stages,
  locale = "en",
}: GuideWorkflowDiagramProps) {
  return (
    <figure className="cyber-panel-muted cyber-chamfer overflow-hidden border border-border/75">
      <div className="border-b border-border/65 bg-background/55 px-5 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-tertiary">
          {locale === "zh-hans" ? "工作流图" : "Workflow map"}
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      <div className="relative grid gap-3 p-5 sm:grid-cols-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-[16%] top-[3.95rem] hidden h-3 w-[68%] text-tertiary/45 sm:block"
        >
          <path
            d="M0 6 H98 M92 1 L99 6 L92 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {stages.map((stage, index) => (
          <div
            key={stage}
            className="relative z-10 border border-border/70 bg-background/90 px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-primary">
              {locale === "zh-hans" ? "节点" : "Node"}{" "}
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-foreground">
              {stage}
            </p>
          </div>
        ))}
      </div>

      <figcaption className="border-t border-border/65 px-5 py-4 text-sm leading-7 text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
