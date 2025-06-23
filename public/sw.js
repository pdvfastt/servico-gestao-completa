
const CACHE_NAME = 'gestao-os-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrar no cache, retorna
        if (response) {
          return response;
        }
        
        // Senão, busca na rede
        return fetch(event.request).then(
          (response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync para funcionalidades offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync executado');
    // Aqui você pode implementar lógica para sincronizar dados offline
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Sistema de Gestão de OS',
    icon: 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png',
    badge: 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir Sistema',
        icon: 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Sistema de Gestão de OS', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
