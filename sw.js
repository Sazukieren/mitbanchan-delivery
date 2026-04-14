const CACHE_NAME = 'mbc-v4-cache-v3';
const urlsToCache = [
  '/mitbanchan-delivery/',
  '/mitbanchan-delivery/index.html',
  '/mitbanchan-delivery/manifest.json',
  '/mitbanchan-delivery/sw.js',
  '/mitbanchan-delivery/icon-192.png',
  '/mitbanchan-delivery/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  try {
    const {hostname} = new URL(url);
    if (hostname === 'firebasedatabase.app' || hostname.endsWith('.firebasedatabase.app') ||
        hostname === 'googleapis.com' || hostname.endsWith('.googleapis.com') ||
        hostname === 'gstatic.com' || hostname.endsWith('.gstatic.com') ||
        hostname === 'firebaseapp.com' || hostname.endsWith('.firebaseapp.com') ||
        hostname === 'openstreetmap.org' || hostname.endsWith('.openstreetmap.org') ||
        hostname === 'unpkg.com' || hostname.endsWith('.unpkg.com') ||
        hostname.includes('kakao') ||
        hostname.includes('dapi.')) {
      return; // 네트워크 직접 요청
    }
  } catch(err) {}
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
