/* عامل الخدمة — يجعل التطبيق يعمل دون اتصال بعد أول زيارة.
   مكتوب يدويًا لتجنّب مشاكل أدوات البناء مع مسارات تحتوي مسافات. */

const VERSION = "v1";
const SHELL_CACHE = `ruqyah-shell-${VERSION}`;
const ASSET_CACHE = `ruqyah-assets-${VERSION}`;

const SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== ASSET_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // الصوت يُبثّ من مصدر خارجي: لا نتدخّل أبدًا (حتى لا نتعارض مع طلبات النطاق الجزئي)
  if (url.origin !== self.location.origin) return;

  // طلبات التنقل: الشبكة أولًا ثم نسخة مخزّنة
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() =>
          caches.match("/index.html").then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // بقية الأصول: من الكاش أولًا ثم الشبكة
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
