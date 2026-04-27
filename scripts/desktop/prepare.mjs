import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const bundleRoot = path.join(root, "desktop-bundle");
const bundleBinRoot = path.join(bundleRoot, "bin");
const standaloneRoot = path.join(root, ".next", "standalone");
const bundledStandaloneRoot = path.join(bundleRoot, ".next", "standalone");
const bundledStaticRoot = path.join(bundledStandaloneRoot, ".next", "static");
const bundledPublicRoot = path.join(bundledStandaloneRoot, "public");

await rm(bundleRoot, { force: true, recursive: true });
await mkdir(path.join(bundledStandaloneRoot, ".next"), { recursive: true });
await mkdir(bundleBinRoot, { recursive: true });

await cp(standaloneRoot, bundledStandaloneRoot, {
  recursive: true,
  dereference: true,
});

await rm(bundledStaticRoot, { force: true, recursive: true });
await cp(path.join(root, ".next", "static"), bundledStaticRoot, { recursive: true });

try {
  await rm(bundledPublicRoot, { force: true, recursive: true });
  await cp(path.join(root, "public"), bundledPublicRoot, { recursive: true });
} catch {
  // Public directory is optional.
}

await cp(path.join(root, ".env"), path.join(bundleRoot, ".env"));
await cp(process.execPath, path.join(bundleBinRoot, process.platform === "win32" ? "node.exe" : "node"));
