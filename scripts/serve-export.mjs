// Serves the static export (`out/`) under the same base path GitHub Pages uses,
// so end-to-end tests exercise the real URLs:  http://localhost:4173/gautam-m-a-portfolio/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const BASE = '/gautam-m-a-portfolio';
const ROOT = join(process.cwd(), 'out');
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [join(ROOT, clean), join(ROOT, clean, 'index.html'), join(ROOT, `${clean}.html`)];
  for (const c of candidates) {
    try {
      if ((await stat(c)).isFile()) return c;
    } catch {
      /* next */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  // robots.txt is only honoured at the host root, so mirror it there for local Lighthouse runs
  if (url.pathname === '/robots.txt') url.pathname = `${BASE}/robots.txt`;
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(302, { Location: `${BASE}/` }).end();
    return;
  }
  const rel = url.pathname.slice(BASE.length) || '/';
  const file = await resolveFile(rel);
  if (!file) {
    const notFound = await resolveFile('/404');
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(notFound ? await readFile(notFound) : 'Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));
