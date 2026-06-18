/* ============================================================
   Scoop Sense — Service Worker
   Strategy: Cache-first for app shell, network-first for CDN assets
   ============================================================ */

const CACHE_NAME = 'scoop-sense-v1';

// App shell — files that live next to index.html on your server
const APP_SHELL = [
  './scoop-sense.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// CDN resources we want to cache on first fetch so the app works offline
const CDN_ORIGINS = [
  'https://cdn.jsdelivr.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

/* ---- INSTALL: pre-cache the app shell ---- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache app shell; don't fail install if a file is missing
      return Promise.allSettled(
        APP_SHELL.map(url => cache.add(url).catch(e => console.warn('[SW] could not cache', url, e)))
      );
    }).then(() => self.skipWaiting())
  );
});

/* ---- ACTIVATE: clean up old caches ---- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ---- FETCH: serve from cache, fall back to network ---- */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if(request.method !== 'GET') return;
  if(url.protocol === 'chrome-extension:') return;

  // Camera / mediadevices — always go to network, never cache
  if(request.destination === 'video' && !url.hostname) return;

  const isCDN = CDN_ORIGINS.some(o => request.url.startsWith(o));

  if(isCDN){
    // Network-first for CDN: fresh when online, cached copy when offline
    event.respondWith(
      fetch(request)
        .then(response => {
          if(response && response.status === 200){
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first for local app shell
    event.respondWith(
      caches.match(request).then(cached => {
        if(cached) return cached;
        return fetch(request).then(response => {
          if(response && response.status === 200){
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
});
