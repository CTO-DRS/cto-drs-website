/* CTO-DRS Service Worker — network-first + offline fallback
   يضمن دائماً أحدث محتوى عند توفر الشبكة، ويجعل الموقع
   يعمل من النسخة المخزنة أثناء انقطاع الاتصال. */
const CACHE = "cto-drs-v1";
const OFFLINE_URL = "/index.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL, "/manifest.webmanifest"])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // نفس الأصل فقط (GitHub Pages) — لا نتدخل في طلبات الجهات الخارجية
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // تخزين النسخة الناجحة للرجوع إليها دون اتصال
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;
          // طلب تنقل (صفحة) دون اتصال → الصفحة الرئيسية المخزنة
          if (req.mode === "navigate") {
            return caches.match(OFFLINE_URL).then((fallback) => fallback || Response.error());
          }
          return Response.error();
        })
      )
  );
});
