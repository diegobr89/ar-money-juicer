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
        '/js/fetch-html.js',
				'/js/fetch-dollar-value.js',
				'/js/fetch-ipc.js',
				'https://silicon.createx.studio/assets/css/theme.min.css'
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
  if (!navigator.onLine) {
    // Si no hay conexión a internet, devuelve el recurso de la caché
    event.respondWith(caches.match(event.request));
  } else {
    // Si hay conexión a internet, realiza la solicitud a través de internet
    event.respondWith(
      fetch(event.request).then(function(response) {
        // Almacena el recurso en la caché para futuras solicitudes sin conexión a internet
        caches.open('v1').then(function(cache) {
          cache.put(event.request, response);
        });
        return response.clone();
      }).catch(function() {
        // Si la solicitud a través de internet falla, devuelve el recurso de la caché
        return caches.match(event.request);
      })
    );
  }
});
