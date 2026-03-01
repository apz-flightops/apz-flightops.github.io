// sw.js (Hub offline cache v1)
const CACHE_NAME = "apz-hub-v2";
const ASSETS = [
  "/",                 
  "/index.html",
  "/apple-touch-icon.png",
  "/icon-512.png",

  // 앱(양식)도 미리 캐시
  "/oe-record/",
  "/oe-record/index.html",
  "/ap-training-record/",
  "/ap-training-record/index.html",

  // 앱이 쓰는 CDN도 미리 캐시 (오프라인 깨짐 방지 핵심)
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
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
