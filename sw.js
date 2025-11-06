/**
 * Service Worker for Portfolio Website
 * Provides offline functionality and caching for better performance
 */

const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.min.css',
  '/styles/components.min.css',
  '/styles/responsive.min.css',
  '/scripts/main.min.js',
  '/scripts/animations.min.js',
  '/scripts/utils.min.js',
  '/assets/images/project-placeholder.svg',
  '/favicon.ico'
];

// Assets to cache dynamically
const DYNAMIC_ASSETS = [
  '/assets/images/',
  '/assets/documents/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Determine which cache to use
            const shouldCacheDynamically = DYNAMIC_ASSETS.some(pattern => 
              request.url.includes(pattern)
            );

            if (shouldCacheDynamically) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  console.log('Service Worker: Caching dynamic asset', request.url);
                  cache.put(request, responseToCache);
                });
            }

            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Return placeholder for images
            if (request.destination === 'image') {
              return caches.match('/assets/images/project-placeholder.svg');
            }
          });
      })
  );
});

// Background sync for form submissions (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle offline form submissions
      handleOfflineFormSubmission()
    );
  }
});

// Push notifications (if needed in the future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon-32x32.png',
      badge: '/favicon-16x16.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle offline form submissions
async function handleOfflineFormSubmission() {
  try {
    // Get stored form data from IndexedDB or localStorage
    const formData = await getStoredFormData();
    
    if (formData) {
      // Attempt to submit the form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Clear stored data on successful submission
        await clearStoredFormData();
        console.log('Service Worker: Offline form submission successful');
      }
    }
  } catch (error) {
    console.error('Service Worker: Offline form submission failed', error);
  }
}

// Helper functions for form data storage
async function getStoredFormData() {
  // Implementation would depend on your storage method
  // This is a placeholder for the actual implementation
  return null;
}

async function clearStoredFormData() {
  // Implementation would depend on your storage method
  // This is a placeholder for the actual implementation
}

// Handle service worker updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded');