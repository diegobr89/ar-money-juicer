// Instalación del Service Worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("v1").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/assets/ar-money-juicer.png",
        "/js/price-calc-core.js",
        "/node_modules/bootstrap/dist/css/bootstrap.min.css",
        "/node_modules/@fortawesome/fontawesome-free/css/all.min.css",
        "/node_modules/mdb-ui-kit/css/mdb.min.css",
        "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap",
        "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
      ]);
    })
  );
});

// Activa el Service Worker
self.addEventListener("activate", function (event) {
  console.log("Service Worker activado.");
});

// Manejo de peticiones
self.addEventListener("fetch", function (event) {
  if (!navigator.onLine) {
    // Si no hay conexión a internet, devuelve el recurso de la caché
    event.respondWith(caches.match(event.request));
  } else {
    // Si hay conexión a internet, realiza la solicitud a través de internet
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          // Almacena el recurso en la caché para futuras solicitudes sin conexión a internet
          caches.open("v1").then(function (cache) {
            cache.put(event.request, response);
          });
          return response.clone();
        })
        .catch(function () {
          // Si la solicitud a través de internet falla, devuelve el recurso de la caché
          return caches.match(event.request);
        })
    );
  }
});
