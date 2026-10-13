import assert from "node:assert/strict";
import { test } from "node:test";
import {
  chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync,
  rmSync, symlinkSync, unlinkSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertDeployment, assertGitState, assertPrivatePath, assertProject, assertReceipt,
  buildIdentity, BUILD_MODE, environmentHash, inspectArtifact, parseArgs, PROJECT, sha256,
} from "./lib/release-contract.mjs";
import { release, run } from "./release-solo.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHA = "a".repeat(40);
const project = {
  id: PROJECT.projectId, accountId: PROJECT.orgId, name: PROJECT.projectName,
  nodeVersion: "24.x", framework: "nextjs", targets: {},
};
const identity = buildIdentity({ sha: SHA, tree: "b".repeat(40),
  environmentHash: sha256("env"), toolHash: sha256("tools"), project });

function temporary(t) {
  const path = mkdtempSync(join(tmpdir(), "time-overlay-release-test-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}

function artifact(root) {
  mkdirSync(join(root, "static"), { recursive: true });
  mkdirSync(join(root, "functions", "index.func"), { recursive: true });
  writeFileSync(join(root, "config.json"), '{"version":3}');
  writeFileSync(join(root, "static", "page.html"), "hello");
  writeFileSync(join(root, "functions", "index.func", "index.js"), "export default 1;");
  symlinkSync("index.func", join(root, "functions", "alias.func"));
}

test("rejects unexpected flags instead of falling back to a different deployment", () => {
  assert.throws(() => parseArgs(["--remote"]), /Unknown/);
  assert.throws(() => parseArgs(["--prod"]), /Unknown/);
  assert.deepEqual(parseArgs(["--build-only", "--reuse-artifact"]), { buildOnly: true, reuseArtifact: true, help: false });
});

test("requires clean synced main for production; build-only permits a clean branch", () => {
  const state = { branch: "main", status: "", head: SHA, remoteHead: SHA, buildOnly: false };
  assertGitState(state);
  assert.throws(() => assertGitState({ ...state, branch: "feature" }), /main/);
  assert.throws(() => assertGitState({ ...state, remoteHead: "b".repeat(40) }), /differs/);
  assert.throws(() => assertGitState({ ...state, status: "?? work.txt" }), /clean/);
  assertGitState({ ...state, branch: "feature", buildOnly: true, remoteHead: undefined });
});

test("wrong team, project or runtime cannot pass the deployment gate", () => {
  assertProject(project);
  for (const changed of [{ id: "wrong" }, { accountId: "wrong" }, { nodeVersion: "22.x" },
    { rootDirectory: "other" }, { framework: "other" }]) {
    assert.throws(() => assertProject({ ...project, ...changed }));
  }
});

test("environment fingerprint ignores rotated OIDC credentials but retains application changes and multiline values", () => {
  const base = 'NEXT_PUBLIC_SITE_URL="https://timeoverlay.co"\nSECRET="first\nsecond"\n';
  const a = environmentHash(base + "VERCEL_OIDC_TOKEN=one\n");
  assert.equal(a, environmentHash("# changed pull comment\n" + base + "VERCEL_OIDC_TOKEN=two\n"));
  assert.notEqual(a, environmentHash(base.replace("first", "third")));
  assert.notEqual(a, environmentHash(base, "NEXT_PUBLIC_SITE_URL=https://example.com\n"));
});

test("external secret file must be private and cannot escape validation through a symlink", (t) => {
  const root = temporary(t);
  const file = join(root, "secret.env");
  writeFileSync(file, "SECRET=test", { mode: 0o600 });
  assertPrivatePath(file);
  chmodSync(file, 0o644);
  assert.throws(() => assertPrivatePath(file), /Owner-only/);
  chmodSync(file, 0o600);
  assert.throws(() => assertPrivatePath(file, { outside: [root] }), /outside/);
  symlinkSync(file, join(root, "link.env"));
  assert.throws(() => assertPrivatePath(join(root, "link.env")), /regular/);
});

test("artifact inventory permits internal function aliases and detects content tampering", (t) => {
  const root = temporary(t);
  artifact(root);
  const inventory = inspectArtifact(root);
  const receipt = { identity, inventory };
  assertReceipt(receipt, identity, inventory);
  writeFileSync(join(root, "static", "page.html"), "tampered");
  assert.throws(() => assertReceipt(receipt, identity, inspectArtifact(root)), /content/);
  assert.throws(() => assertReceipt(receipt, { ...identity, environmentHash: sha256("changed") }, inventory), /identity/);
});

test("artifact inventory ignores permission bits rewritten by artifact copies", (t) => {
  const root = temporary(t);
  artifact(root);
  const before = inspectArtifact(root);
  chmodSync(join(root, "static", "page.html"), 0o664);
  chmodSync(join(root, "static"), 0o775);
  assert.deepEqual(inspectArtifact(root), before);
});

test("artifact rejects env leaks, escaping aliases, wrong API version and macOS binaries", (t) => {
  const root = temporary(t);
  artifact(root);
  const envFile = join(root, "static", ".env.production");
  writeFileSync(envFile, "SECRET=test");
  assert.throws(() => inspectArtifact(root), /Environment file/);
  rmSync(envFile);
  const external = join(temporary(t), "outside.js");
  writeFileSync(external, "external");
  symlinkSync(relative(join(root, "functions"), external), join(root, "functions", "outside.func"));
  assert.throws(() => inspectArtifact(root), /Escaping/);
  rmSync(join(root, "functions", "outside.func"));
  symlinkSync(join(root, "functions", "index.func"), join(root, "functions", "absolute.func"));
  assert.throws(() => inspectArtifact(root), /Nonportable/);
  unlinkSync(join(root, "functions", "absolute.func"));
  const binary = join(root, "functions", "index.func", "addon.node");
  writeFileSync(binary, Buffer.from("cffaedfe00000000", "hex"));
  assert.throws(() => inspectArtifact(root), /macOS/);
  rmSync(binary);
  writeFileSync(join(root, "config.json"), '{"version":2}');
  assert.throws(() => inspectArtifact(root), /version 3/);
});

test("native addons must be x64 ELF, not Linux arm64", (t) => {
  const root = temporary(t);
  artifact(root);
  const elf = Buffer.alloc(20);
  Buffer.from("7f454c46", "hex").copy(elf);
  elf[5] = 1;
  elf.writeUInt16LE(183, 18); // AArch64
  const file = join(root, "functions", "index.func", "addon.node");
  writeFileSync(file, elf);
  assert.throws(() => inspectArtifact(root), /Linux x64/);
  elf.writeUInt16LE(62, 18);
  writeFileSync(file, elf);
  inspectArtifact(root);
});

test("production result requires READY, exact SHA/tree, correct project and prebuilt mode", () => {
  const deployment = { id: "dpl_test", projectId: PROJECT.projectId, readyState: "READY", target: "production",
    meta: { releaseBuildMode: BUILD_MODE, releaseGitSha: identity.sha, releaseGitTree: identity.tree } };
  assertDeployment(deployment, identity);
  for (const changed of [{ target: "preview" }, { projectId: "wrong" }, { readyState: "ERROR" },
    { meta: { ...deployment.meta, releaseBuildMode: "remote" } }, { meta: { ...deployment.meta, releaseGitSha: "other" } }]) {
    assert.throws(() => assertDeployment({ ...deployment, ...changed }, identity));
  }
});

test("binary Git archives are not decoded as UTF-8", () => {
  const result = run(process.execPath, ["-e", "process.stdout.write(Buffer.from([0,255,128,10]))"], { quiet: true, encoding: "buffer" });
  assert.deepEqual(result, Buffer.from([0, 255, 128, 10]));
});

function simulation(t, { production = false, failBuild = false, wrongProject = false, dirty = false, movedRemote = false } = {}) {
  const root = temporary(t);
  const cache = temporary(t);
  const previous = process.env.TIME_OVERLAY_RELEASE_CACHE;
  const previousEnv = process.env.TIME_OVERLAY_BUILD_ENV_FILE;
  process.env.TIME_OVERLAY_RELEASE_CACHE = cache;
  delete process.env.TIME_OVERLAY_BUILD_ENV_FILE;
  t.after(() => {
    if (previous === undefined) delete process.env.TIME_OVERLAY_RELEASE_CACHE;
    else process.env.TIME_OVERLAY_RELEASE_CACHE = previous;
    if (previousEnv === undefined) delete process.env.TIME_OVERLAY_BUILD_ENV_FILE;
    else process.env.TIME_OVERLAY_BUILD_ENV_FILE = previousEnv;
  });
  const calls = [];
  let stage;
  let fetches = 0;
  function execute(command, args, options = {}) {
    calls.push({ command, args });
    if (command === "git") {
      if (args[0] === "fetch") { fetches++; return ""; }
      if (args[0] === "branch") return production ? "main" : "feature";
      if (args[0] === "status") return dirty ? "?? WIP" : "";
      if (args[0] === "ls-tree") return "package.json";
      if (args[0] === "archive") return Buffer.from("archive");
      if (args[1]?.endsWith("^{tree}")) return "b".repeat(40);
      if (args[1] === "origin/main" && movedRemote && fetches > 1) return "c".repeat(40);
      return SHA;
    }
    if (command === "pnpm") return "9.15.9";
    if (command === "tar") {
      stage = args[2];
      cpSync(join(ROOT, "scripts"), join(stage, "scripts"), { recursive: true });
      writeFileSync(join(stage, "vercel.json"), '{"git":{"deploymentEnabled":false}}');
      assert.deepEqual(options.input, Buffer.from("archive"));
      return "";
    }
    if (command === "docker") {
      if (args[0] === "run") {
        if (failBuild) throw new Error("simulated build failure");
        if (!args.at(-1).includes("--verify-only")) artifact(join(stage, ".vercel", "output"));
      }
      return "linux";
    }
    if (command === "vercel" && args[0] === "pull") {
      writeFileSync(join(stage, ".vercel", ".env.production.local"), "NEXT_PUBLIC_SITE_URL=https://timeoverlay.co\n");
      return "";
    }
    if (command === "vercel" && args[0] === "api") {
      if (args[1].includes("/projects/")) return JSON.stringify({ ...project, ...(wrongProject ? { accountId: "wrong" } : {}) });
    }
    if (command === "vercel" && args[0] === "deploy") throw new Error("simulated deployment stop");
    throw new Error(`Unexpected command ${command} ${args[0]}`);
  }
  return { root, cache, calls, execute, stage: () => stage };
}

test("build-only exercises the pipeline and cache reuse without any deployment or alias writes", async (t) => {
  const sim = simulation(t);
  const receipt = await release(["--build-only"], sim.execute, sim.root);
  assert.equal(receipt.identity.sha, SHA);
  assert.ok(!existsSync(sim.stage()), "temporary source/env cleaned after build");
  await release(["--build-only", "--reuse-artifact"], sim.execute, sim.root);
  assert.ok(sim.calls.some(({ command, args }) => command === "docker" && args.at(-1).includes("--verify-only")));
  assert.ok(!sim.calls.some(({ command, args }) => command === "vercel" && ["deploy", "alias", "promote"].includes(args[0])));
});

test("build failure cleans source/env and never falls back to remote deployment", async (t) => {
  const sim = simulation(t, { production: true, failBuild: true });
  await assert.rejects(release([], sim.execute, sim.root), /build failure/);
  assert.ok(!existsSync(sim.stage()));
  assert.ok(!sim.calls.some(({ args }) => args[0] === "deploy"));
});

test("project mismatch and dirty state stop before pulling credentials or building", async (t) => {
  const sim = simulation(t, { wrongProject: true });
  await assert.rejects(release(["--build-only"], sim.execute, sim.root), /project\/team/);
  assert.ok(!sim.calls.some(({ args }) => args[0] === "pull" || args[0] === "build"));
  const dirty = simulation(t, { dirty: true });
  await assert.rejects(release(["--build-only"], dirty.execute, dirty.root), /clean/);
  assert.ok(!dirty.calls.some(({ command }) => command === "vercel"));
});

test("production refuses to publish if origin/main moves while the artifact is built", async (t) => {
  const sim = simulation(t, { production: true, movedRemote: true });
  await assert.rejects(release([], sim.execute, sim.root), /changed during build/);
  assert.ok(!sim.calls.some(({ args }) => args[0] === "deploy"));
});

test("production path always uploads prebuilt output, with no fallback after a failed upload", async (t) => {
  const sim = simulation(t, { production: true });
  await assert.rejects(release([], sim.execute, sim.root), /deployment stop/);
  const uploads = sim.calls.filter(({ command, args }) => command === "vercel" && args[0] === "deploy");
  assert.equal(uploads.length, 1);
  assert.ok(uploads[0].args.includes("--prebuilt"));
  assert.ok(uploads[0].args.includes("--prod"));
  assert.ok(!existsSync(sim.stage()));
});
