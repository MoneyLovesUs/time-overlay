import { describe, expect, it } from "vitest";

import { generateStaticParams } from "@/app/[locale]/page";

describe("localized root routes", () => {
  it("statically generates every non-default locale", async () => {
    expect(await generateStaticParams()).toEqual([
      { locale: "es" },
      { locale: "pt" },
      { locale: "ru" },
      { locale: "fr" },
      { locale: "de" },
      { locale: "ko" },
      { locale: "ja" },
      { locale: "fi" },
    ]);
  });
});
