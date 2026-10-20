import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const ROOT_DIR = path.resolve(dist);

/**
 * 把 URL 路径解析到 dist 内的真实文件；越界（../、%2e%2e、NUL）一律返回 null。
 * 原实现直接用 path.join(dist, urlPath)，在监听 0.0.0.0 时同网段可读任意文件。
 */
function safePath(urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath); } catch { return null; }
  if (decoded.includes('\0')) return null;
  const full = path.resolve(ROOT_DIR, '.' + decoded);
  if (full !== ROOT_DIR && !full.startsWith(ROOT_DIR + path.sep)) return null;
  return full;
}
const mime = {
  'html': 'text/html; charset=utf-8',
  'js': 'application/javascript',
  'css': 'text/css',
  'svg': 'image/svg+xml',
  'png': 'image/png',
  'ico': 'image/x-icon',
  'json': 'application/json',
  'woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // API proxy to backend
  if (urlPath.startsWith('/api/')) {
    const opts = {
      hostname: 'localhost',
      port: 4000,
      path: urlPath,
      method: req.method,
      headers: { ...req.headers, host: 'localhost:4000' }
    };
    const proxy = http.request(opts, (pres) => {
      res.writeHead(pres.statusCode, pres.headers);
      pres.pipe(res);
    });
    proxy.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Backend unavailable' }));
    });
    req.pipe(proxy);
    return;
  }

  let filePath = urlPath === '/' ? '/index.html' : urlPath;
  const fullPath = safePath(filePath);
  if (!fullPath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // SPA fallback: serve index.html for client-side routing
      fs.readFile(path.join(dist, 'index.html'), (e2, data) => {
        if (e2) {
          res.writeHead(500);
          res.end('Server error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      });
      return;
    }
    const ext = path.extname(fullPath).slice(1);
    const contentType = mime[ext] || 'text/plain';
    const stream = fs.createReadStream(fullPath);
    stream.on('open', () => {
      res.writeHead(200, { 'Content-Type': contentType });
      stream.pipe(res);
    });
    stream.on('error', () => {
      res.writeHead(500);
      res.end('Read error');
    });
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Blog static server on http://localhost:3000');
  console.log('📡 API proxy → http://localhost:4000');
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
