#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync,
  renameSync, rmSync, writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  assertDeployment, assertGitState, assertPrivatePath, assertProject, assertReceipt,
  buildIdentity, BUILDER, collectDeployInputs, DOMAINS, dockerRunArgs, environmentHash,
  hashDeployInputsDirectory, inspectArtifact, ORIGIN,
  findReleaseDeployment, parseArgs, parseDeploymentUrl, prebuiltDeployArgs, PROJECT, SCOPE, sha256,
} from "./lib/release-contract.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HELP = "pnpm release:solo [--build-only] [--reuse-artifact]\n" +
  "Build locally in linux/amd64 Docker; upload only prebuilt output.\n" +
  "--build-only validates a clean committed branch without deploying.";

export function run(command, args, { cwd = ROOT, quiet = false, input, encoding = "utf8" } = {}) {
  const result = spawnSync(command, args, {
    cwd, input, encoding: encoding === "buffer" ? undefined : encoding,
    maxBuffer: 64 * 1024 * 1024, env: process.env,
    stdio: [input ? "pipe" : "ignore", quiet ? "pipe" : "inherit", quiet ? "pipe" : "inherit"],
  });
  // Do not stringify child errors: their buffered output can contain env values.
  if (result.status !== 0) throw new Error(`${command} ${args[0] ?? ""} failed (${result.status ?? result.error?.code}).`);
  return result.stdout ?? "";
}

function privateDirectory(path, outside) {
  mkdirSync(path, { recursive: true, mode: 0o700 });
  assertPrivatePath(path, { directory: true, outside });
}

export async function release(argv, execute = run, root = ROOT) {
  const options = parseArgs(argv);
  if (options.help) { console.log(HELP); return; }
  if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Node >=22 required.");
  const git = (args) => execute("git", args, { cwd: root, quiet: true }).trim();
  const head = git(["rev-parse", "HEAD"]);
  assertGitState({
    head, branch: git(["branch", "--show-current"]), status: git(["status", "--porcelain=v1", "--untracked-files=all"]),
    remoteHead: head, buildOnly: options.buildOnly,
  });
  if (!options.buildOnly) {
    git(["fetch", "origin", "main"]);
    assertGitState({ head, branch: "main", status: "", remoteHead: git(["rev-parse", "origin/main"]), buildOnly: false });
  }
  if (execute("pnpm", ["--version"], { cwd: root, quiet: true }).trim() !== "9.15.9") {
    throw new Error("pnpm 9.15.9 required.");
  }
  execute("docker", ["version", "--format", "{{.Server.Os}}"], { quiet: true });
  const vercel = (args, cwd = root) => execute("vercel", [...args, "--scope", SCOPE], { cwd, quiet: true });
  const api = (endpoint) => JSON.parse(vercel(["api", endpoint, "--method", "GET"]));
  const project = api(`/v9/projects/${PROJECT.projectId}`);
  assertProject(project);
  const cacheRoot = resolve(process.env.TIME_OVERLAY_RELEASE_CACHE ?? join(homedir(), ".time-overlay-release-cache"));
  privateDirectory(cacheRoot, [root]);
  const extraEnvFile = process.env.TIME_OVERLAY_BUILD_ENV_FILE?.trim();
  if (extraEnvFile) assertPrivatePath(resolve(extraEnvFile), { outside: [root] });
  const stage = mkdtempSync(join(tmpdir(), "time-overlay-release-"));
  chmodSync(stage, 0o700);
  let deployedUrl;
  let deploymentId;
  try {
    console.log(`[release] source ${head}; ${options.buildOnly ? "build only" : "production"}`);
    const archive = execute("git", ["archive", "--format=tar", head], { cwd: root, quiet: true, encoding: "buffer" });
    execute("tar", ["-x", "-C", stage], { input: archive, quiet: true });
    const tracked = git(["ls-tree", "-r", "--name-only", head]).split("\n");
    if (tracked.some((path) => /(?:^|\/)(?:\.env(?:\.|$)|\.dev\.vars(?:\.|$))/.test(path))) {
      throw new Error("Source archive contains an environment file.");
    }
    const config = JSON.parse(readFileSync(join(stage, "vercel.json"), "utf8"));
    if (config.git?.deploymentEnabled !== false) throw new Error("Git automatic deployment must be disabled.");
    mkdirSync(join(stage, ".vercel"), { mode: 0o700 });
    writeFileSync(join(stage, ".vercel", "project.json"), JSON.stringify(PROJECT), { mode: 0o600 });
    vercel(["pull", "--yes", "--environment=production"], stage);
    const envPath = join(stage, ".vercel", ".env.production.local");
    chmodSync(envPath, 0o600);
    const pulledProject = JSON.parse(readFileSync(join(stage, ".vercel", "project.json"), "utf8"));
    if (pulledProject.projectId !== PROJECT.projectId || pulledProject.orgId !== PROJECT.orgId) {
      throw new Error("Vercel pull changed the linked project.");
    }
    execute("docker", ["build", "--platform", "linux/amd64", "-t", BUILDER, "-f",
      join(stage, "scripts", "Dockerfile.vercel-builder"), join(stage, "scripts")]);
    const builderId = execute("docker", ["image", "inspect", BUILDER, "--format", "{{.Id}}"], { quiet: true }).trim();
    const identity = buildIdentity({
      sha: head, tree: git(["rev-parse", `${head}^{tree}`]), project,
      environmentHash: environmentHash(readFileSync(envPath, "utf8"),
        extraEnvFile ? readFileSync(resolve(extraEnvFile), "utf8") : ""),
      toolHash: sha256(Buffer.concat([Buffer.from(builderId), ...["scripts/Dockerfile.vercel-builder", "scripts/release-build.mjs",
        "scripts/release-solo.mjs", "scripts/lib/release-contract.mjs"].map((path) => readFileSync(join(stage, path)))])),
    });
    const cache = join(cacheRoot, sha256(JSON.stringify(identity)));
    const output = join(stage, ".vercel", "output");
    const receiptPath = join(cache, "artifact.json");
    const reused = options.reuseArtifact && existsSync(receiptPath);
    let receipt;
    if (reused) {
      assertPrivatePath(cache, { directory: true });
      assertPrivatePath(receiptPath);
      receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
      const cachedOutput = join(cache, "output");
      const cachedInputs = join(cache, "deploy-inputs");
      if (!existsSync(cachedInputs)) {
        throw new Error("Cached artifact predates deploy-input capture; rerun without --reuse-artifact.");
      }
      assertPrivatePath(cachedInputs, { directory: true });
      assertReceipt(receipt, identity, inspectArtifact(cachedOutput), hashDeployInputsDirectory(cachedInputs));
      cpSync(cachedOutput, output, { recursive: true, verbatimSymlinks: true });
      cpSync(cachedInputs, stage, { recursive: true, verbatimSymlinks: true });
      console.log("[release] reusing verified artifact");
    }
    const started = Date.now();
    execute("docker", [...dockerRunArgs(stage, extraEnvFile), "sh", "-c",
      "pnpm install --frozen-lockfile --prefer-offline && node scripts/release-build.mjs" + (reused ? " --verify-only" : "")]);
    const inventory = inspectArtifact(output);
    // vercel deploy --prebuilt re-reads every root-relative filePathMap source
    // (.next/** etc.); verify them and keep them in the cache for reuse runs.
    const inputs = collectDeployInputs(output, stage);
    if (reused) assertReceipt(receipt, identity, inventory, inputs.inventory);
    else {
      receipt = { identity, inventory, inputs: inputs.inventory,
        builtAt: new Date().toISOString(), buildDurationMs: Date.now() - started };
      const pending = mkdtempSync(join(cacheRoot, ".pending-"));
      try {
        cpSync(output, join(pending, "output"), { recursive: true, verbatimSymlinks: true });
        const pendingInputs = join(pending, "deploy-inputs");
        mkdirSync(pendingInputs, { mode: 0o700 });
        for (const rel of inputs.paths) {
          const target = join(pendingInputs, rel);
          mkdirSync(dirname(target), { recursive: true });
          cpSync(join(stage, rel), target, { verbatimSymlinks: true });
        }
        writeFileSync(join(pending, "artifact.json"), JSON.stringify(receipt, null, 2) + "\n", { mode: 0o600 });
        if (existsSync(cache)) {
          assertPrivatePath(cache, { directory: true });
          rmSync(cache, { recursive: true });
        }
        renameSync(pending, cache);
      } finally { rmSync(pending, { recursive: true, force: true }); }
    }
    console.log(`[release] artifact verified: ${inventory.files} files, ${inventory.bytes} bytes; receipt ${receiptPath}`);
    if (options.buildOnly) { console.log("[release] build-only complete; no deployment created"); return receipt; }

    // Recheck the mutable checkout and remote after the potentially long build.
    git(["fetch", "origin", "main"]);
    assertGitState({ head: git(["rev-parse", "HEAD"]), branch: git(["branch", "--show-current"]),
      status: git(["status", "--porcelain=v1", "--untracked-files=all"]), remoteHead: head, buildOnly: false });
    if (git(["rev-parse", "origin/main"]) !== head) throw new Error("origin/main changed during build; rebuild the new commit.");
    const latestProject = api(`/v9/projects/${PROJECT.projectId}`);
    assertProject(latestProject);
    if (JSON.stringify(buildIdentity({ project: latestProject }).project) !== JSON.stringify(identity.project)) {
      throw new Error("Project build settings changed during build; rebuild with the new settings.");
    }
    // vercel deploy --prebuilt (CLI 53) hashes every filePathMap source, which
    // includes the .env.production.local the build consumed and then removed.
    // Recreate the merged build env so the upload finds it; the stage cleanup
    // in finally still removes it afterwards.
    writeFileSync(join(stage, ".env.production.local"),
      readFileSync(envPath, "utf8") + "\n" + (extraEnvFile ? readFileSync(resolve(extraEnvFile), "utf8") : "") + "\n",
      { mode: 0o600 });
    // Allow for clock skew between this machine and Vercel's created timestamps.
    const deployStartedAt = Date.now() - 5 * 60_000;
    const deployOutput = execute("vercel", prebuiltDeployArgs(identity), { cwd: stage, quiet: true });
    deployedUrl = parseDeploymentUrl(deployOutput) ?? findReleaseDeployment(
      api(`/v6/deployments?projectId=${PROJECT.projectId}&target=production&limit=20`).deployments,
      identity, deployStartedAt);
    const deployment = api(`/v13/deployments/${new URL(deployedUrl).hostname}`);
    deploymentId = deployment.id;
    const releases = join(cacheRoot, "releases");
    privateDirectory(releases, []);
    const releasePath = join(releases, `${Date.now()}-${head.slice(0, 12)}.json`);
    writeFileSync(releasePath, JSON.stringify({ ...receipt, reused, deploymentId, deployedUrl,
      releasedAt: new Date().toISOString(), verified: false }, null, 2) + "\n", { mode: 0o600 });
    console.log(`[release] deployment ${deploymentId} ${deployedUrl}; receipt ${releasePath}`);
    assertDeployment(deployment, identity);
    const currentProject = api(`/v9/projects/${PROJECT.projectId}`);
    if (currentProject.targets?.production?.id !== deploymentId) throw new Error("Production target did not move to this deployment.");
    for (const domain of DOMAINS) {
      const alias = api(`/v4/aliases/${domain}`);
      if (alias.deployment?.id !== deploymentId) throw new Error(`Alias ${domain} did not move to this deployment.`);
    }
    for (const path of ["/", "/guides", "/zh-hans", "/sitemap.xml", "/robots.txt"]) {
      const response = await fetch(`${ORIGIN}${path}`, { redirect: "manual", signal: AbortSignal.timeout(30_000) });
      await response.body?.cancel();
      if (response.status !== 200) throw new Error(`Smoke ${path}: HTTP ${response.status}.`);
    }
    const www = await fetch("https://www.timeoverlay.co/", { redirect: "manual", signal: AbortSignal.timeout(30_000) });
    await www.body?.cancel();
    if (www.status !== 308 || www.headers.get("location") !== `${ORIGIN}/`) throw new Error("www canonical redirect failed.");
    writeFileSync(releasePath, JSON.stringify({ ...receipt, reused, deploymentId, deployedUrl,
      releasedAt: new Date().toISOString(), verified: true }, null, 2) + "\n", { mode: 0o600 });
    console.log(`[release] SUCCESS: ${head} live at ${ORIGIN}`);
    return receipt;
  } catch (error) {
    if (deployedUrl) console.error(`[release] deployment retained: ${deploymentId ?? "unknown ID"} ${deployedUrl}; use a verified previous deployment to roll back.`);
    throw error;
  } finally { rmSync(stage, { recursive: true, force: true }); }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  release(process.argv.slice(2)).catch((error) => {
    console.error(`[release] NO-GO: ${error.message}`);
    process.exitCode = 1;
  });
}
