// sw.js (Hub offline cache v1)
const CACHE_NAME = "apz-hub-v1";
const ASSETS = [
  "/",                 // hub root
  "/index.html",
  "/apple-touch-icon.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
