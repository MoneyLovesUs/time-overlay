import type { MetadataRoute } from "next";

import { buildRobotsDefinition } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsDefinition();
}
