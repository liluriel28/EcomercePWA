self.addEventListener('install', (event) => {
  console.log('Service Worker Instalado');
  event.waitUntil(
    caches.open('achanta').then((cache) => {
      return cache.addAll([
        '/',       
        '/index.html',   
        '/styles.css',    
        '/script.js',   
        '/images/logo.png' 
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker Activado');
});

// También puedes agregar el fetch event si necesitas que el service worker maneje las solicitudes
self.addEventListener('fetch', (event) => {
  console.log('Interceptando solicitud para:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
