const CACHE_NAME = 'cubofacil-v2';
const FILES_TO_CACHE = [
  './',
  'index.html',
  'rubiks.js',
  'solver.js',
  'flat.js',
  'camera_scanner.js',
  'speed_timer.js',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// 1. Instala o Service Worker e armazena os arquivos em cache
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Instalando...');
  
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Armazenando arquivos no cache...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// 2. Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Ativando...');
  
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );

  self.clients.claim();
});

// 3. Intercepta requisições de rede (Fetch)
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Buscando', evt.request.url);
  
  // Estratégia: Cache-First
  // Responde com o cache. Se falhar, tenta buscar na rede.
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});