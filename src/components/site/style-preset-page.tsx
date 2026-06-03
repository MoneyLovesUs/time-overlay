import Link from "next/link";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { RootPageContent } from "@/content/root/types";
import { GENERATOR_THEME_PRESETS } from "@/lib/generator/defaults";
import { buildLocalizedPath, type EnabledLocale } from "@/lib/i18n";
import type { ThemePreset } from "@/lib/generator/types";

export type StylePresetPageProps = {
  preset: ThemePreset;
  presetLabel: string;
  content: RootPageContent;
  locale: EnabledLocale;
};

function buildRelatedPresets(currentId: ThemePreset["id"]): ThemePreset[] {
  return GENERATOR_THEME_PRESETS.filter((preset) => preset.id !== currentId).slice(
    0,
    3,
  );
}

export function StylePresetPage({
  preset,
  presetLabel,
  content,
  locale,
}: StylePresetPageProps) {
  const homePath = buildLocalizedPath("/", locale);
  const generatorPath = `${homePath === "/" ? "" : homePath}/?preset=${preset.id}#tool`;
  const related = buildRelatedPresets(preset.id);

  const headerNavItems = [
    {
      href: buildLocalizedPath("/#tool", locale),
      label: content.siteChrome.header.toolLinkLabel,
    },
    {
      href: buildLocalizedPath("/#faq", locale),
      label: content.siteChrome.header.faqLinkLabel,
    },
  ];
  const footerNavItems = content.siteChrome.footer.jumpLinks.map((item) => ({
    href: buildLocalizedPath(`/#${item.anchorId}`, locale),
    label: item.label,
  }));

  return (
    <div>
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={content.siteChrome.header.shellLabel}
        siteName={content.siteChrome.siteName}
      />
      <main className="bg-background text-foreground">
        <section className="border-b border-border/70 px-6 py-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tertiary">
              Time Overlay style preset
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {presetLabel} Time Overlay — {presetLabel} countdown timer overlay
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              {preset.description} The {presetLabel} Time Overlay preset drops a
              clean {presetLabel.toLowerCase()} countdown on top of streams,
              tutorials, gameplay, and product footage. Export the {presetLabel}
              {" "}
              Time Overlay as a transparent PNG sequence for master-grade work,
              or as a WebM (with alpha) Time Overlay video for quick handoff
              into Premiere Pro, DaVinci Resolve, Final Cut Pro, CapCut, and
              OBS.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={generatorPath}
                className="inline-flex items-center gap-2 border border-primary/60 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary/20"
              >
                Open in generator
              </Link>
              <Link
                href={`${homePath}#faq`}
                className="inline-flex items-center gap-2 border border-border/80 bg-background/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Format and FPS guidance
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto grid w-full max-w-4xl gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                When the {presetLabel} Time Overlay preset fits
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {`The ${presetLabel} Time Overlay is purpose-built for clean Time Overlay handoff into your editor, and it pairs well with footage where readability cannot fight the look.`}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Recommended editor pairing
              </h2>
              <ul className="mt-3 grid gap-2 leading-7 text-muted-foreground">
                <li>Premiere Pro: import PNG sequence for master-grade alpha, or WebM (with alpha) for quick iteration.</li>
                <li>DaVinci Resolve (Free + Studio): both PNG sequence and WebM (with alpha) import as transparent media.</li>
                <li>Final Cut Pro: import PNG sequence for the most predictable transparency on macOS.</li>
                <li>CapCut Web/Desktop: WebM (with alpha) drops in as an overlay layer.</li>
                <li>OBS Studio: WebM (with alpha) loads as a Media Source for streaming scenes.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {presetLabel} Time Overlay export format
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Ship the {presetLabel} Time Overlay as PNG sequence when
                transparency quality matters and you can handle the larger file
                size. Ship the {presetLabel} Time Overlay as WebM (with alpha)
                when you want a single transparent video file that plays in
                editors and streaming software. The {presetLabel} Time Overlay
                preset renders identically across both formats.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Color recommendations
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Stick with the preset palette for fast results, or swap colors
                via the in-app color picker and keep the rest of the preset
                intact, then export the customized {presetLabel} look.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 px-6 py-12">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className="text-xl font-semibold tracking-tight">
              Other Time Overlay style presets to try
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {related.map((other) => {
                const otherLabel = content.generatorUi.themePresetPicker
                  .presetLabels[other.id];
                return (
                  <Link
                    key={other.id}
                    href={buildLocalizedPath(`/styles/${other.id}`, locale)}
                    className="block border border-border/70 bg-background/60 px-4 py-4 transition-colors hover:border-tertiary/55"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-tertiary">
                      Style preset
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {otherLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {other.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        navItems={footerNavItems}
        siteDescription={content.siteChrome.siteDescription}
        siteName={content.siteChrome.siteName}
        systemRailLabel={content.siteChrome.footer.systemRailLabel}
        publicStatusLabel={content.siteChrome.footer.publicStatusLabel}
        identityTitle={content.siteChrome.footer.identityTitle}
        jumpTitle={content.siteChrome.footer.jumpTitle}
        productTitle={content.siteChrome.footer.productTitle}
        productDescription={content.siteChrome.footer.productDescription}
      />
    </div>
  );
}
