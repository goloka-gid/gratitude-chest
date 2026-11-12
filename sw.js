const CACHE_NAME = 'gratitude-chest-v3';
const ASSETS = [
  './',
  './index.html',
  './icon.png'
];

// Установка и кэширование
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Активация и удаление старых кэшей
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов (работа в офлайн)
self.addEventListener('fetch', (e) => {
  e.respondId = true;
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => {
        // Если сети нет и файла нет в кэше, отдаем главную страницу
        return caches.match('./index.html');
      });
    })
  );
});
