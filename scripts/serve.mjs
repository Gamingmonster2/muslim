#!/usr/bin/env node
/**
 * خادم ثابت بسيط بلا اعتماديات لخدمة مجلد out (نسخة الإنتاج).
 * يدعم مسارات index.html وSpa-fallback، مع أنواع MIME صحيحة.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

if (!fs.existsSync(OUT)) {
  console.error(`✗ مجلد ${OUT} غير موجود — شغّل \`npm run build\` أولاً.`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathname === "/") pathname = "/index.html";

  let filePath = path.join(OUT, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // محاولة إضافة .html عند غياب الملف
  if (!fs.existsSync(filePath)) {
    const withHtml = filePath + ".html";
    if (fs.existsSync(withHtml)) filePath = withHtml;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 — Not Found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-cache" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✓ خادم محلي يعمل: http://localhost:${PORT}`);
  console.log(`  (يخدم نسخة الإنتاج من out/ — أبقِ هذه النافذة مفتوحة)`);
});
