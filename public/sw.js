// Service Worker for Madina Basketball - Offline Support
const CACHE_NAME = 'madina-basketball-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
  '/',
  '/game/basic',
  '/game/stats',
  '/statssheet',
  '/game',
  '/tools',
  '/globals.css',
  '/icon.png',
  '/manifest.json'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching critical assets');
      return cache.addAll(CRITICAL_ASSETS).catch((error) => {
        console.error('[Service Worker] Failed to cache:', error);
        // Don't fail install if some assets aren't available
        return Promise.resolve();
      });
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API requests (they need to be online)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ 
            error: 'Offline - This action will be queued and synced when online' 
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and update cache in background
        event.waitUntil(
          fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }).catch(() => {
            // Network fetch failed, but we have cached version
            return cachedResponse;
          })
        );
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Cache successful responses
        if (networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline and not in cache
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Background sync for queued game saves
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-games') {
    event.waitUntil(syncGames());
  }
});

async function syncGames() {
  console.log('[Service Worker] Syncing queued games...');
  // This will be implemented with IndexedDB in the client
  // The service worker will trigger the sync, but the actual
  // implementation will be in the page context
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_GAMES'
    });
  });
}

