const cacheName = "TileRushRoot-1e3e952d11453c7a7525c559cd366a6ac23b874f-surfx4-splash2";
const contentToCache = [
    "webgl/WebGLRelease.loader.js",
    "webgl/WebGLRelease.framework.js.unityweb",
    "webgl/WebGLRelease.data.unityweb",
    "webgl/WebGLRelease.wasm.unityweb",
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
    await Promise.all(keys.filter(k => k.startsWith('TileRushRoot-') && k !== cacheName).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
