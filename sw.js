const CACHE_NAME = 'cubofacil-v21';
const PRECACHE_ASSETS = [
  './',
  'index.php',
  'i18n.js',
  'rubiks.js',
  'solver.js',
  'flat.js',
  'camera_scanner.js',
  'speed_timer.js',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'icons/icon-maskable-192x192.png',
  'icons/icon-maskable-512x512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32x32.png',
  'icons/favicon.ico'
];

// 1. Instalação e precache
self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache aviso:', err);
      });
    })
  );
});

// 2. Ativação e limpeza de versões antigas de cache
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Network-First com fallback inteligente para Cache Offline
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    fetch(evt.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(evt.request, { ignoreSearch: true }).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (evt.request.mode === 'navigate') {
            return caches.match('./', { ignoreSearch: true });
          }
        });
      })
  );
});