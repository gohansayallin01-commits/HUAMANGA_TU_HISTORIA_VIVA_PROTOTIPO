// Service Worker para "Huamanga: Tu Historia Viva"
const CACHE_NAME = 'huamanga-v1.0.0';
const ASSETS_TO_CACHE = [
  '/HUAMANGA_TU_HISTORIA_VIVA_PROTOTIPO/',
  '/HUAMANGA_TU_HISTORIA_VIVA_PROTOTIPO/index.html',
  '/HUAMANGA_TU_HISTORIA_VIVA_PROTOTIPO/favicon.svg',
  '/HUAMANGA_TU_HISTORIA_VIVA_PROTOTIPO/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Solo procesar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Retornar caché y actualizar en segundo plano (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Si no hay red y solicita HTML, devolver index.html
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/HUAMANGA_TU_HISTORIA_VIVA_PROTOTIPO/index.html');
        }
      });
    })
  );
});
