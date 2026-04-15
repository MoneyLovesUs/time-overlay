import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import esRootPageContent from "@/content/root/es";
import { RootPage } from "@/components/site/root-page";

vi.mock("@/components/generator/generator-shell", () => ({
  GeneratorShell: () => React.createElement("div", null, "generator-shell"),
}));

describe("localized root page chrome and seo section", () => {
  it("renders localized chrome, localized links, and locale-specific FAQ/export copy", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RootPage, {
        locale: "es",
        content: esRootPageContent,
      }),
    );

    expect(markup).toContain("Capa pública");
    expect(markup).toContain("Herramienta");
    expect(markup).toContain("Generador");
    expect(markup).toContain("/es#tool");
    expect(markup).toContain("/es#faq");
    expect(markup).toContain("/es#export-formats");
    expect(markup).toContain("Formatos de exportación");
    expect(markup).toContain("Fundamentos del temporizador overlay");
    expect(markup).toContain(
      "¿Puedo exportar un temporizador overlay con transparencia?",
    );
    expect(markup).toContain('"@type":"FAQPage"');
  });
});
