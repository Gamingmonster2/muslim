#!/usr/bin/env node
/**
 * يُشغَّل بعد next build تلقائياً (npm lifecycle: postbuild).
 * يكتب داخل out/: سكربت الخدمة (sw.js)، وsitemap.xml، وrobots.txt.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const SITE = "https://muslim.com.ly";

const ADHKAR_IDS = ["morning", "evening", "sleep", "wake", "distress", "healing"];

function readJson(rel) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  } catch {
    return null;
  }
}

function buildSitemap() {
  const scholars = readJson("src/content/generated/scholars.json")?.scholars ?? [];
  const library = readJson("src/content/generated/library.json")?.items ?? [];

  const staticRoutes = [
    "/",
    "/ruqyah",
    "/scholars",
    "/adhkar",
    "/tasbeeh",
    "/library",
    "/about",
  ];

  const urls = [];
  const push = (loc, lastmod) => urls.push(`  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`);

  for (const route of staticRoutes) {
    push(`${SITE}${route}`);
    push(`${SITE}/en${route === "/" ? "" : route}`);
  }
  for (const scholar of scholars) {
    push(`${SITE}/scholars/${scholar.id}`);
    push(`${SITE}/en/scholars/${scholar.id}`);
  }
  for (const item of library) {
    const enc = encodeURIComponent(item.id);
    push(`${SITE}/library/${enc}`);
    push(`${SITE}/en/library/${enc}`);
  }
  for (const id of ADHKAR_IDS) {
    push(`${SITE}/adhkar/${id}`);
    push(`${SITE}/en/adhkar/${id}`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

function collectPrecache() {
  const files = [];
  const walk = (dir, base = "") => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.join(base, entry.name);
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, rel);
      else if (/\.(html|js|css|svg|png|webmanifest|woff2|woff)$/i.test(entry.name)) {
        files.push(rel);
      }
    }
  };
  walk(OUT);
  const urls = files
    .map((rel) => "/" + rel.split(path.sep).join("/"))
    .filter((url) => !url.includes("og-cover") && !url.includes("icon-"));
  // أضف المسارات الأساسية
  const extra = ["/", "/en/", "/offline/"];
  // لا تدرج ملفات المكتبة الكبيرة في pre-cache الأولي
  return [...extra, ...urls].filter((url) => !url.startsWith("/data/library/"));
}

function buildServiceWorker(precache) {
  const version = `lyd-${Date.now().toString(36)}`;
  return `const CACHE = "${version}";
const PRECACHE = ${JSON.stringify(precache)};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // التنقّل: شبكة أولاً ثم العودة للرئيسية عند الانقطاع
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // الأصول الثابتة: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(event.request).then((cached) => {
        const network = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
`;
}

function main() {
  if (!fs.existsSync(OUT)) {
    console.error("✗ مجلد out غير موجود — شغّل next build أولاً.");
    process.exit(1);
  }
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), buildSitemap(), "utf8");
  fs.writeFileSync(path.join(OUT, "robots.txt"), buildRobots(), "utf8");
  const precache = collectPrecache();
  fs.writeFileSync(path.join(OUT, "sw.js"), buildServiceWorker(precache), "utf8");
  console.log(`✓ sitemap.xml · robots.txt · sw.js (${precache.length} ملف pre-cache)`);
}

main();
