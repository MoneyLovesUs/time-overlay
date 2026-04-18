import type { MetadataRoute } from "next";

import { buildManifestDefinition } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return buildManifestDefinition();
}
