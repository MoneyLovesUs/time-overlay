import type { ComparePageContent } from "@/content/compare/types";
import type { GuideContent } from "@/content/guides";
import type { RootPageContent } from "@/content/root/types";
import {
  BROWSER_IDS,
  EDITOR_IDS,
  FORMAT_MATRIX,
  type BrowserSupport,
} from "@/lib/formats/matrix";

/**
 * Clean Markdown mirrors of the high-value pages. Built from the same content
 * sources as the HTML so an AI crawler can parse the answer without the nav,
 * scripts, and styling noise of the rendered page.
 */

function browsersThatExport(
  browsers: Record<string, BrowserSupport>,
  labels: ComparePageContent["browserLabels"],
): string {
  const supported = BROWSER_IDS.filter((id) => {
    const level = browsers[id];
    return level === "works" || level === "native";
  }).map((id) => labels[id]);
  return supported.length > 0 ? supported.join(", ") : "—";
}

export function renderGuideMarkdown(guide: GuideContent): string {
  const steps = guide.steps
    .map((step, index) => `### ${index + 1}. ${step.title}\n\n${step.body}`)
    .join("\n\n");

  return [
    `# ${guide.title}`,
    guide.intro,
    `**Recommended export:** ${guide.recommendedFormat}`,
    `## Steps`,
    steps,
    `## Tips`,
    guide.closer,
  ].join("\n\n");
}

export function renderComparisonMarkdown(content: ComparePageContent): string {
  const headerCells = [
    content.columns.format,
    content.columns.transparency,
    ...EDITOR_IDS.map((id) => content.editorLabels[id]),
    content.columns.browsers,
  ];
  const headerRow = `| ${headerCells.join(" | ")} |`;
  const dividerRow = `| ${headerCells.map(() => "---").join(" | ")} |`;

  const bodyRows = FORMAT_MATRIX.map((row) => {
    const cells = [
      content.formats[row.id].name,
      content.transparencyLabels[row.transparency],
      ...EDITOR_IDS.map((id) => content.supportLabels[row.editors[id]]),
      browsersThatExport(row.browsers, content.browserLabels),
    ];
    return `| ${cells.join(" | ")} |`;
  });

  const verdicts = FORMAT_MATRIX.map((row) => {
    const prose = content.formats[row.id];
    return [
      `### ${prose.name}`,
      `${prose.verdict}`,
      `- **Best for:** ${prose.bestFor}`,
      `- **Watch out:** ${prose.weakness}`,
    ].join("\n");
  }).join("\n\n");

  const faq = content.faqItems
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  return [
    `# ${content.h1}`,
    content.leadAnswer,
    `## Comparison`,
    [headerRow, dividerRow, ...bodyRows].join("\n"),
    `_${content.benchmarkPendingNote}_`,
    `## Format notes`,
    verdicts,
    `## ${content.faqTitle}`,
    faq,
  ].join("\n\n");
}

export function renderHomeMarkdown(content: RootPageContent): string {
  const seo = content.seoSection;
  const workflow = seo.workflowSteps
    .map((step, index) => `### ${index + 1}. ${step.title}\n\n${step.body}`)
    .join("\n\n");
  const faq = seo.faqItems
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  return [
    `# ${content.metadata.title}`,
    content.metadata.description,
    `## ${seo.exportFormatsTitle}`,
    seo.exportFormatsPngText,
    seo.exportFormatsWebmText,
    `## ${seo.workflowHeading}`,
    workflow,
    `## ${seo.faqTitle}`,
    faq,
  ].join("\n\n");
}
