// Both are filled in at build time by the sw-precache plugin in vite.config.ts: a hash of the
// build and the built JS/CSS files. The dev server serves this file unchanged.
const BUILD_ID = 'dev';
const PRECACHE_ASSETS = [];

// One app cache per build; activate deletes the caches of older builds.
const CACHE_NAME = `englishvibe-${BUILD_ID}`;
// Read-aloud clips are named by their text, so a cached clip never goes stale.
const TTS_CLIP_CACHE = 'englishvibe-tts-v1';
// Caches owned by the read-aloud service (src/services/tts) are kept on activate.
const TTS_CACHE_PREFIX = 'englishvibe-tts-';
const R2_CLIP_HOST_SUFFIX = '.r2.dev';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon-32.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // If any file fails to download, the install fails and the previous worker stays in charge.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([...APP_SHELL, ...PRECACHE_ASSETS]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && !key.startsWith(TTS_CACHE_PREFIX))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function putInCache(cacheName, request, response) {
  if (response && response.status === 200 && response.type === 'basic') {
    const copy = response.clone();
    caches.open(cacheName).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // The clips may be served from the Cloudflare R2 bucket (VITE_TTS_CLIP_BASE_URL); nothing else is.
  const isR2Clip = url.protocol === 'https:' && url.hostname.endsWith(R2_CLIP_HOST_SUFFIX);
  if (url.origin !== self.location.origin && !isR2Clip) return;
  // The online voice is cached by the page itself.
  if (url.pathname.startsWith('/api/')) return;

  if (url.pathname.startsWith('/tts/') && url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(TTS_CLIP_CACHE).then((cache) =>
        cache.match(request).then(
          (cached) =>
            cached ||
            fetch(request).then((response) => {
              if (response && response.status === 200) cache.put(request, response.clone());
              return response;
            })
        )
      )
    );
    return;
  }

  // Page loads: network first so updates arrive at once; offline, this build's app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.match('/index.html'))
          .then((cached) => cached || Response.error())
      )
    );
    return;
  }

  // Built files have a content hash in their name, so a cached copy is always right.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches
        .match(request)
        .then((cached) => cached || fetch(request).then((response) => putInCache(CACHE_NAME, request, response)))
    );
    return;
  }

  // Everything else (art, sounds, icons): network first, the cached copy when offline. A file
  // that isn't cached fails like any missing file instead of answering with the HTML page.
  event.respondWith(
    fetch(request)
      .then((response) => putInCache(CACHE_NAME, request, response))
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});

// Streak reminder (api/streak-reminder.ts): a Hebrew notification; a tap opens or focuses the app.
self.addEventListener('push', (event) => {
  let message = { title: 'EnglishVibe', body: '' };
  try {
    message = { ...message, ...event.data.json() };
  } catch {
    // An unreadable payload still shows the plain title.
  }
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: '/apple-touch-icon.png',
      lang: 'he',
      dir: 'rtl',
      tag: 'streak-reminder',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => new URL(w.url).origin === self.location.origin);
      return open ? open.focus() : self.clients.openWindow('/');
    })
  );
});
