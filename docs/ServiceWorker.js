const cacheName = "TileRush-f9a6b338ff2f3cd7b474f583069ed6a26fc5f72611-surfx4-splash2";
const contentToCache = [
    "Build/WebGLRelease.loader.js",
    "Build/WebGLRelease.framework.js.unityweb",
    "Build/WebGLRelease.data.unityweb",
    "Build/WebGLRelease.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
  self.skipWaiting();
    console.log('[Service Worker] Install');

    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
  if (e.request.mode === 'navigate') {
    e.respondWith((async function () {
      try {
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
      } catch (error) {
        const cached = await caches.match(e.request);
        if (cached) return cached;
        throw error;
      }
    })());
    return;
  }
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('TileRush-') && k !== cacheName).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
