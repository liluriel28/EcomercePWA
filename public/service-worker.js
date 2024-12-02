const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/", // Página principal
  "/index.html", // HTML principal
  "/manifest.json", // Manifest
  "/favicon.ico", // Ícono
  "/assets/style.css", // Ejemplo de CSS
  "/assets/logo.png", // Ejemplo de imagen
];

// Instalación: Cachear los archivos esenciales
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Archivos cacheados");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación: Eliminar caches antiguos
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activando...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Eliminando cache antiguo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar solicitudes: Cache-First (Primero busca en el cache)
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Interceptando:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("[Service Worker] Sirviendo desde cache:", event.request.url);
        return response;
      }
      console.log("[Service Worker] Solicitando a la red:", event.request.url);
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Guarda una copia en el cache para solicitudes futuras
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
