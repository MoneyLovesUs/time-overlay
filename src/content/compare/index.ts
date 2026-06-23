import compareContent from "./en";

import type { ComparePageContent } from "./types";

/**
 * The comparison page is English-only for now (see the route definition in
 * `src/lib/site.ts`). This indirection keeps the call sites stable so a future
 * locale fan-out only has to change here, mirroring `src/content/root`.
 */
export function getComparePageContent(): ComparePageContent {
  return compareContent;
}

export type { ComparePageContent } from "./types";
