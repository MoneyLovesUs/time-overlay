import { createHash } from "node:crypto";
import {
  lstatSync, openSync, readSync, closeSync, readFileSync,
  readdirSync, readlinkSync, realpathSync,
} from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { parseEnv } from "node:util";

export const PROJECT = Object.freeze({
  projectId: "prj_IHTU6bhE36lhZcooqWo50dQ3hjGy",
  orgId: "team_nyAa8oJCujnSymAWbsZ0xiDl",
  projectName: "time-overlay",
});
export const SCOPE = "sean-lius-projects-484b037e";
export const ORIGIN = "https://timeoverlay.co";
export const DOMAINS = ["timeoverlay.co", "www.timeoverlay.co"];
export const BUILD_MODE = "local-linux-amd64-prebuilt";
export const BUILDER = "time-overlay-vercel-builder";
export const STORE = "time-overlay-vercel-pnpm-store";

export function parseArgs(argv) {
  const options = { buildOnly: false, reuseArtifact: false, help: false };
  for (const arg of argv) {
    if (arg === "--build-only") options.buildOnly = true;
    else if (arg === "--reuse-artifact") options.reuseArtifact = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown release option: ${arg}`);
  }
  return options;
}

export function assertGitState({ branch, status, head, remoteHead, buildOnly }) {
  if (status.trim()) throw new Error("Use a clean worktree, including untracked files.");
  if (!/^[a-f0-9]{40}$/.test(head)) throw new Error("Invalid source SHA.");
  if (!buildOnly && branch !== "main") throw new Error("Production release requires main.");
  if (!buildOnly && head !== remoteHead) throw new Error("main differs from origin/main; sync first.");
}

export function assertProject(project) {
  if (project.id !== PROJECT.projectId || project.accountId !== PROJECT.orgId ||
      project.name !== PROJECT.projectName) throw new Error("Unexpected Vercel project/team.");
  if (project.nodeVersion !== "24.x" || project.framework !== "nextjs" ||
      (project.rootDirectory && project.rootDirectory !== ".")) {
    throw new Error("Vercel runtime/framework/root changed; review the builder first.");
  }
}

export function inside(root, path) {
  const rel = relative(root, path);
  return rel === "" || (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`));
}

export function assertPrivatePath(path, { directory = false, outside = [] } = {}) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink() || (directory ? !stat.isDirectory() : !stat.isFile())) {
    throw new Error(`Expected a regular ${directory ? "directory" : "file"}: ${path}`);
  }
  if ((stat.mode & 0o077) !== 0) throw new Error(`Owner-only permissions required: ${path}`);
  const canonical = realpathSync(path);
  for (const root of outside) {
    if (inside(realpathSync(root), canonical)) throw new Error(`Private path must be outside ${root}`);
  }
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function environmentHash(pulled, extra = "") {
  // pull rotates its short-lived OIDC credential on every call. It is not an
  // application setting; keep every other variable in the build identity.
  const env = parseEnv(`${pulled}\n${extra}\n`);
  delete env.VERCEL_OIDC_TOKEN;
  return sha256(JSON.stringify(Object.entries(env).sort(([a], [b]) => a.localeCompare(b))));
}

// A receipt binds the exact source, fresh environment, project and builder.
export function buildIdentity({ sha, tree, environmentHash, toolHash, project }) {
  return {
    schemaVersion: 1, mode: BUILD_MODE, sha, tree, environmentHash, toolHash,
    project: {
      id: project.id, accountId: project.accountId, nodeVersion: project.nodeVersion,
      framework: project.framework, rootDirectory: project.rootDirectory ?? null,
      buildCommand: project.buildCommand ?? null, installCommand: project.installCommand ?? null,
      outputDirectory: project.outputDirectory ?? null,
    },
  };
}

function prefix(path) {
  const fd = openSync(path, "r");
  try {
    const buffer = Buffer.alloc(20);
    const count = readSync(fd, buffer, 0, buffer.length, 0);
    return buffer.subarray(0, count);
  } finally { closeSync(fd); }
}

// Inventory links as well as file bytes. Next function aliases can be symlinks,
// but their resolved target must stay within the output being uploaded.
export function inspectArtifact(root) {
  if (!lstatSync(root).isDirectory()) throw new Error("Missing output directory.");
  const config = JSON.parse(readFileSync(join(root, "config.json"), "utf8"));
  if (config.version !== 3) throw new Error("Expected Build Output API version 3.");
  for (const name of ["static", "functions"]) {
    const stat = lstatSync(join(root, name));
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Missing output ${name} directory.`);
  }
  const canonicalRoot = realpathSync(root);
  const hash = createHash("sha256");
  let files = 0;
  let bytes = 0;
  let entries = 0;
  function walk(directory) {
    for (const name of readdirSync(directory).sort()) {
      if (++entries > 200_000) throw new Error("Output inspection limit exceeded.");
      const path = join(directory, name);
      const rel = relative(root, path);
      const stat = lstatSync(path);
      if (/^(?:\.env(?:\.|$)|env(?:\.|$)|\.dev\.vars(?:\.|$))/i.test(name)) {
        throw new Error(`Environment file in artifact: ${rel}`);
      }
      if (stat.isSymbolicLink()) {
        if (isAbsolute(readlinkSync(path))) throw new Error(`Nonportable absolute artifact symlink: ${rel}`);
        if (!inside(canonicalRoot, realpathSync(path))) throw new Error(`Escaping artifact symlink: ${rel}`);
        hash.update(JSON.stringify([rel, "link", readlinkSync(path)]) + "\n");
      } else if (stat.isDirectory()) {
        hash.update(JSON.stringify([rel, "directory", stat.mode & 0o777]) + "\n");
        walk(path);
      } else if (stat.isFile()) {
        const header = prefix(path);
        const magic = header.subarray(0, 4).toString("hex");
        if (["feedface", "cefaedfe", "feedfacf", "cffaedfe", "cafebabe", "bebafeca"].includes(magic)) {
          throw new Error(`macOS binary in artifact: ${rel}`);
        }
        if (name.endsWith(".node") && (magic !== "7f454c46" || header[5] !== 1 ||
            header.length < 20 || header.readUInt16LE(18) !== 62)) {
          throw new Error(`Native module is not Linux x64: ${rel}`);
        }
        hash.update(JSON.stringify([rel, "file", stat.mode & 0o777, stat.size]) + "\n");
        hash.update(readFileSync(path));
        files++;
        bytes += stat.size;
      } else throw new Error(`Unsupported artifact entry: ${rel}`);
    }
  }
  walk(root);
  return { hash: hash.digest("hex"), files, bytes };
}

export function assertReceipt(receipt, identity, inventory) {
  if (JSON.stringify(receipt.identity) !== JSON.stringify(identity)) throw new Error("Cached build identity differs.");
  if (JSON.stringify(receipt.inventory) !== JSON.stringify(inventory)) throw new Error("Cached artifact content differs.");
}

export function prebuiltDeployArgs(identity) {
  return ["deploy", "--prebuilt", "--prod", "--yes", "--scope", SCOPE,
    "--meta", `releaseBuildMode=${BUILD_MODE}`,
    "--meta", `releaseGitSha=${identity.sha}`,
    "--meta", `releaseGitTree=${identity.tree}`];
}

export function parseDeploymentUrl(stdout) {
  const lines = stdout.trim().split(/\s+/);
  const url = lines.findLast((line) => /^https:\/\/time-overlay-[a-z0-9]+-sean-lius-projects-[a-z0-9]+\.vercel\.app\/?$/.test(line));
  if (!url) throw new Error("Deploy returned no Time Overlay deployment URL.");
  return new URL(url).origin;
}

export function assertDeployment(deployment, identity) {
  if (!/^dpl_[A-Za-z0-9]+$/.test(deployment.id ?? "") || deployment.projectId !== PROJECT.projectId ||
      deployment.readyState !== "READY" || deployment.target !== "production" ||
      deployment.meta?.releaseBuildMode !== BUILD_MODE || deployment.meta?.releaseGitSha !== identity.sha ||
      deployment.meta?.releaseGitTree !== identity.tree) {
    throw new Error("Deployment is not the expected READY production prebuilt release.");
  }
}

export function dockerRunArgs(stage, extraEnvFile) {
  return ["run", "--rm", "--platform", "linux/amd64",
    "-v", `${resolve(stage)}:/work`, "-v", `${STORE}:/root/.local/share/pnpm/store`,
    "-e", "npm_config_store_dir=/root/.local/share/pnpm/store",
    ...(extraEnvFile ? ["-v", `${resolve(extraEnvFile)}:/secrets.env:ro`] : []),
    "-w", "/work", BUILDER];
}
