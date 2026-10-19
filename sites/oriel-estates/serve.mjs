// Local preview server for the Oriel site. No dependencies, Node 18 or newer.
// Usage: node serve.mjs [port] [--no-open]
// From the repo root: npm run oriel

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { exec } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const shouldOpen = !args.includes("--no-open");
const firstPort = Number(args.find((a) => /^\d+$/.test(a)) || process.env.PORT || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

async function send(res, file, status, method) {
  const body = await readFile(file);
  res.writeHead(status, {
    "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  res.end(method === "HEAD" ? undefined : body);
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  let rel;
  try {
    rel = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.join(root, path.normalize(rel));
  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      res.writeHead(301, { Location: pathname + "/" }).end();
      return;
    }
    await send(res, file, 200, req.method);
  } catch {
    await send(res, path.join(root, "404.html"), 404, req.method).catch(() => res.writeHead(404).end());
  }
});

function openBrowser(url) {
  const cmd =
    process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {}); // no browser available (CI, SSH): the URL is printed anyway
}

function listen(port) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && port < firstPort + 20) return listen(port + 1);
    console.error(err.message);
    process.exit(1);
  });
  server.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log(`\n  Oriel is running at ${url}\n  Press Ctrl+C to stop.\n`);
    if (shouldOpen) openBrowser(url);
  });
}

listen(firstPort);
