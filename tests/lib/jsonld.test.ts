import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHowToJsonLd,
  buildItemListJsonLd,
  buildWebApplicationJsonLd,
} from "@/lib/seo/jsonld";

describe("jsonld builders", () => {
  it("builds a free WebApplication node", () => {
    const node = buildWebApplicationJsonLd();
    expect(node["@type"]).toBe("WebApplication");
    expect(node.offers).toMatchObject({ price: "0", priceCurrency: "USD" });
    expect(Array.isArray(node.inLanguage)).toBe(true);
  });

  it("maps FAQ items to Question/Answer pairs", () => {
    const node = buildFaqJsonLd([
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ]);
    expect(node["@type"]).toBe("FAQPage");
    const entities = node.mainEntity as Array<Record<string, unknown>>;
    expect(entities).toHaveLength(2);
    expect(entities[0]).toMatchObject({
      "@type": "Question",
      name: "Q1",
      acceptedAnswer: { "@type": "Answer", text: "A1" },
    });
  });

  it("numbers HowTo steps from 1", () => {
    const node = buildHowToJsonLd({
      name: "How",
      description: "Desc",
      steps: [
        { title: "First", body: "do x" },
        { title: "Second", body: "do y" },
      ],
    });
    const steps = node.step as Array<Record<string, unknown>>;
    expect(steps.map((s) => s.position)).toEqual([1, 2]);
    expect(steps[0]).toMatchObject({ "@type": "HowToStep", name: "First", text: "do x" });
  });

  it("numbers breadcrumb items sequentially", () => {
    const node = buildBreadcrumbJsonLd([
      { name: "Home", url: "https://x/" },
      { name: "Guide", url: "https://x/g" },
    ]);
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    expect(items[1]).toMatchObject({ name: "Guide", item: "https://x/g" });
  });

  it("builds an ItemList with numberOfItems and positions", () => {
    const node = buildItemListJsonLd({
      name: "Formats",
      items: [
        { name: "PNG", description: "lossless" },
        { name: "WebM" },
      ],
    });
    expect(node["@type"]).toBe("ItemList");
    expect(node.numberOfItems).toBe(2);
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    expect(items[0]).toMatchObject({ name: "PNG", description: "lossless" });
    expect(items[1].description).toBeUndefined();
  });
});
