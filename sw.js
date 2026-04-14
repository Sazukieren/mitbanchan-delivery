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
  // 카카오맵, 구글폰트 등 외부 API는 캐시 안 함 (항상 네트워크)
  if (
    e.request.url.includes('kakao') ||
    e.request.url.includes('dapi.') ||
    e.request.url.includes('fonts.googleapis') ||
    e.request.url.includes('fonts.gstatic')
  ) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
