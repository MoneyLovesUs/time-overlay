import type { ComparePageContent } from "@/content/compare/types";
import {
  BENCHMARK_ENV,
  BROWSER_IDS,
  EDITOR_IDS,
  FORMAT_MATRIX,
  hasBenchmarkData,
  type BrowserSupport,
  type SupportLevel,
} from "@/lib/formats/matrix";

type CompareTableProps = {
  content: ComparePageContent;
};

const supportToneClass: Record<SupportLevel | "n/a", string> = {
  native: "text-primary",
  works: "text-foreground",
  unreliable: "text-secondary",
  unsupported: "text-muted-foreground/60",
  "n/a": "text-muted-foreground/60",
};

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

export function CompareTable({ content }: CompareTableProps) {
  const showBenchmark = hasBenchmarkData();

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
          <caption className="sr-only">{content.tableCaption}</caption>
          <thead>
            <tr className="border-b border-border/70 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <th scope="col" className="px-3 py-3 font-medium">
                {content.columns.format}
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                {content.columns.transparency}
              </th>
              {EDITOR_IDS.map((editorId) => (
                <th key={editorId} scope="col" className="px-3 py-3 font-medium">
                  {content.editorLabels[editorId]}
                </th>
              ))}
              <th scope="col" className="px-3 py-3 font-medium">
                {content.columns.browsers}
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                {content.columns.bestFor}
              </th>
            </tr>
          </thead>
          <tbody>
            {FORMAT_MATRIX.map((row) => {
              const prose = content.formats[row.id];
              return (
                <tr
                  key={row.id}
                  className="border-b border-border/40 align-top"
                >
                  <th scope="row" className="px-3 py-4 font-medium text-foreground">
                    <span className="block">{prose.name}</span>
                    <span className="mt-1 block font-mono text-[11px] font-normal text-muted-foreground">
                      {row.codecLabel}
                    </span>
                  </th>
                  <td className="px-3 py-4 text-muted-foreground">
                    {content.transparencyLabels[row.transparency]}
                  </td>
                  {EDITOR_IDS.map((editorId) => {
                    const level = row.editors[editorId];
                    return (
                      <td
                        key={editorId}
                        className={`px-3 py-4 ${supportToneClass[level]}`}
                      >
                        {content.supportLabels[level]}
                      </td>
                    );
                  })}
                  <td className="px-3 py-4 text-muted-foreground">
                    {browsersThatExport(row.browsers, content.browserLabels)}
                  </td>
                  <td className="px-3 py-4 text-muted-foreground">
                    {prose.bestFor}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {showBenchmark
          ? `Tested · ${BENCHMARK_ENV.config}`
          : content.benchmarkPendingNote}
      </p>
    </div>
  );
}
