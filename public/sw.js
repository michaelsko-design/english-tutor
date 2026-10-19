const CACHE_NAME = 'englishvibe-v1';
// Read-aloud clips are named by their text, so a cached clip never goes stale.
const TTS_CLIP_CACHE = 'englishvibe-tts-v1';
// Caches owned by the read-aloud service (src/services/tts) are kept on activate.
const TTS_CACHE_PREFIX = 'englishvibe-tts-';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.svg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME && !key.startsWith(TTS_CACHE_PREFIX)) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // The online voice is cached by the page itself.
  if (url.pathname.startsWith('/api/')) return;

  if (url.pathname.startsWith('/tts/') && url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(TTS_CLIP_CACHE).then((cache) =>
        cache.match(event.request).then(
          (cached) =>
            cached ||
            fetch(event.request).then((response) => {
              if (response && response.status === 200) cache.put(event.request, response.clone());
              return response;
            })
        )
      )
    );
    return;
  }

  // Network-first with cache fallback so updates arrive immediately while supporting offline launch
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match('/index.html'))
      )
  );
});
