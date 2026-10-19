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
  ".mp4": "video/mp4",
};

async function send(res, file, status, method, range) {
  const body = await readFile(file);
  const headers = {
    "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
    "Accept-Ranges": "bytes",
  };
  // Safari will only play video when the server answers byte-range requests
  const m = status === 200 && range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (m && (m[1] || m[2])) {
    const size = body.length;
    let start = m[1] ? Number(m[1]) : size - Number(m[2]);
    let end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    start = Math.max(0, start);
    if (start > end) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
      return;
    }
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
    res.end(method === "HEAD" ? undefined : body.subarray(start, end + 1));
    return;
  }
  res.writeHead(status, headers);
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
    await send(res, file, 200, req.method, req.headers.range);
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
