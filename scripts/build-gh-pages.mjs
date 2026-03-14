import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, ".output/public");
const docsDir = join(root, "docs");
const basePath = "/sentinel-AOD";

function stripBase(pathname) {
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length);
  return pathname;
}

async function mockAssetsFetch(request) {
  const url = new URL(request.url);
  const assetPath = stripBase(decodeURIComponent(url.pathname));
  const filePath = join(publicDir, assetPath);
  const body = await readFile(filePath);
  const ext = url.pathname.split(".").pop();
  const types = {
    css: "text/css; charset=utf-8",
    js: "text/javascript; charset=utf-8",
    txt: "text/plain; charset=utf-8",
  };
  return new Response(body, {
    headers: { "Content-Type": types[ext] || "application/octet-stream" },
  });
}


async function main() {
  const worker = await import(join(root, ".output/server/index.mjs"));
  const env = { ASSETS: { fetch: mockAssetsFetch } };
  const ctx = { waitUntil: () => {}, passThroughOnException: () => {} };

  const response = await worker.default.fetch(
    new Request(`http://localhost${basePath}/`),
    env,
    ctx,
  );
  if (!response.ok) {
    throw new Error(`SSR failed with status ${response.status}`);
  }

  let html = await response.text();

  await mkdir(docsDir, { recursive: true });
  await cp(publicDir, docsDir, { recursive: true });
  await writeFile(join(docsDir, "index.html"), html);
  await writeFile(join(docsDir, "404.html"), html);
  await writeFile(join(docsDir, ".nojekyll"), "");
  console.log(`GitHub Pages bundle written to ${docsDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
