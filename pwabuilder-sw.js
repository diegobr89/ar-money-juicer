// Instalación del Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/ar-money-juicer.png',
        '/css/bootstrap.min.css',
        '/css/all.min.css',
        '/css/mdb.min.css',
        '/js/bootstrap.bundle.min.js',
        '/js/price-calc-core.js'
      ]);
    })
  );
});

// Activa el Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker activado.');
});

// Manejo de peticiones
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
