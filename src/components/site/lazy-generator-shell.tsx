"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { RootPageContent } from "@/content/root/types";

type LazyGeneratorShellProps = {
  hero: RootPageContent["generatorHero"];
  ui: RootPageContent["generatorUi"];
};

const DynamicGeneratorShell = dynamic(
  () =>
    import("@/components/generator/generator-shell").then(
      (module) => module.GeneratorShell,
    ),
  {
    ssr: false,
  },
);

function GeneratorShellFallback({
  hero,
}: Pick<LazyGeneratorShellProps, "hero">) {
  return (
    <main id="tool" className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.14),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(0,255,136,0.12),transparent_22%),linear-gradient(180deg,rgba(9,10,14,0.99),rgba(7,8,12,1))]"
        />
        <div
          aria-hidden="true"
          className="cyber-grid cyber-scanlines absolute inset-0 opacity-75"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 sm:py-8 lg:gap-6 lg:py-10">
          <div className="rounded-none border border-border/70 bg-background/35 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-2">
              <span className="sr-only">generator-loading-shell</span>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                {hero.eyebrow}
              </p>
              <h1 className="text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">
                {hero.heading}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                {hero.intro}
              </p>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_18rem]">
            <div className="cyber-panel cyber-chamfer min-h-72 animate-pulse bg-background/40" />
            <div className="cyber-panel cyber-chamfer min-h-72 animate-pulse bg-background/40" />
            <div className="cyber-panel cyber-chamfer min-h-72 animate-pulse bg-background/40" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function LazyGeneratorShell(props: LazyGeneratorShellProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <GeneratorShellFallback hero={props.hero} />;
  }

  return <DynamicGeneratorShell {...props} />;
}
