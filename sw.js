const CACHE_NAME = 'mbc4-v1';
const urlsToCache = [
  '/mitbanchan-delivery/',
  '/mitbanchan-delivery/index.html',
  '/mitbanchan-delivery/manifest.json',
  '/mitbanchan-delivery/sw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Skip caching for external APIs and Firebase
  try {
    const {hostname} = new URL(url);
    if (hostname.endsWith('kakao.com') || hostname.endsWith('dapi.kakao.com') ||
        hostname.endsWith('firebase.io') || hostname.endsWith('firebaseio.com') ||
        hostname.endsWith('firebaseapp.com') || hostname.endsWith('firebasedatabase.app') ||
        hostname.endsWith('googleapis.com') || hostname.endsWith('gstatic.com')) {
      return; // Let browser handle directly
    }
  } catch(e) { return; }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/mitbanchan-delivery/index.html')))
  );
});
