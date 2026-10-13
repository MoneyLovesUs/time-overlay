// Runs only inside the Linux builder after pnpm install. No shell sourcing of
// dotenv values: Next handles quoting, multiline values and variable expansion.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (process.platform !== "linux" || process.arch !== "x64" || !existsSync("/work/.vercel/project.json")) {
  throw new Error("release-build must run inside the linux/amd64 builder.");
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status ?? result.error?.code}).`);
}

run("pnpm", ["lint"]);
run("pnpm", ["run", "test", "--run"]);
run("pnpm", ["release:test"]);

if (!process.argv.includes("--verify-only")) {
  const require = createRequire(import.meta.url);
  const nextRequire = createRequire(require.resolve("next/package.json"));
  const { loadEnvConfig } = nextRequire("@next/env");
  const pulled = readFileSync(".vercel/.env.production.local", "utf8");
  const extra = existsSync("/secrets.env") ? readFileSync("/secrets.env", "utf8") : "";
  writeFileSync(".env.production.local", `${pulled}\n${extra}\n`, { mode: 0o600 });
  try {
    loadEnvConfig(process.cwd(), false, { info() {}, error() { throw new Error("Invalid build environment."); } });
    process.env.VERCEL = "1";
    run("vercel", ["build", "--prod", "--yes"]);
  } finally {
    rmSync(".env.production.local", { force: true });
  }
}
