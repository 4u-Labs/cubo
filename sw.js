const CACHE_NAME = 'cubofacil-v10';
const FILES_TO_CACHE = [
  './',
  'index.html',
  'rubiks.js?v=10',
  'solver.js?v=10',
  'flat.js?v=10',
  'camera_scanner.js?v=10',
  'speed_timer.js?v=10',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// 1. Instala o Service Worker e força ativação imediata
self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 2. Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removendo cache antigo:', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// 3. Estratégia Network-First: busca na rede primeiro, com fallback para cache offline
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    fetch(evt.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(evt.request))
  );
});