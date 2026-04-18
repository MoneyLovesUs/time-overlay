import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    exclude: [".pnpm-store/**", ".worktrees/**", "node_modules/**"],
    environment: "node",
    globals: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    passWithNoTests: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
