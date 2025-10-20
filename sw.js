// Service Worker for BPM Formation
// Version 1.0.0

const CACHE_NAME = 'bpm-formation-v1.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/assets/Logo BPM Formations.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip external domains except for allowed CDNs
    const url = new URL(event.request.url);
    const allowedDomains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdnjs.cloudflare.com',
        'unpkg.com'
    ];
    
    if (url.origin !== location.origin && !allowedDomains.includes(url.hostname)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return cachedResponse;
                }
                
                // Fetch from network and cache for future use
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache if it's not a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response before caching
                        const responseToCache = networkResponse.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        console.log('Service Worker: Fetched and cached', event.request.url);
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match('/offline.html');
                        }
                        
                        // Return placeholder for images
                        if (event.request.destination === 'image') {
                            return new Response(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image indisponible</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        }
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nouvelle notification de BPM Formation',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Voir les formations',
                icon: '/assets/action-explore.png'
            },
            {
                action: 'close',
                title: 'Fermer',
                icon: '/assets/action-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('BPM Formation', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#formations')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions
async function syncContactForm() {
    try {
        const pendingForms = await getStoredForms();
        
        for (const form of pendingForms) {
            await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            });
            
            await removeStoredForm(form.id);
        }
        
        console.log('Service Worker: Contact forms synced successfully');
    } catch (error) {
        console.error('Service Worker: Form sync failed', error);
    }
}

async function getStoredForms() {
    const db = await openDB();
    const transaction = db.transaction(['forms'], 'readonly');
    const store = transaction.objectStore('forms');
    return store.getAll();
}

async function removeStoredForm(id) {
    const db = await openDB();
    const transaction = db.transaction(['forms'], 'readwrite');
    const store = transaction.objectStore('forms');
    return store.delete(id);
}

async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('BPMFormationDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('forms')) {
                const store = db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        console.log('Service Worker: Performance metrics received', event.data.metrics);
        
        // Store performance data for analytics
        event.waitUntil(
            caches.open('analytics-cache')
                .then((cache) => {
                    const performanceData = {
                        url: event.data.url,
                        metrics: event.data.metrics,
                        timestamp: Date.now()
                    };
                    
                    return cache.put(
                        `/analytics/${Date.now()}`,
                        new Response(JSON.stringify(performanceData))
                    );
                })
        );
    }
});

// Log service worker events for debugging
console.log('Service Worker: Script loaded');

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        // Check for content updates
        const response = await fetch('/api/content-version');
        const serverVersion = await response.text();
        
        const cachedVersion = await caches.match('/content-version');
        const currentVersion = cachedVersion ? await cachedVersion.text() : '';
        
        if (serverVersion !== currentVersion) {
            console.log('Service Worker: Content update available');
            
            // Notify the main thread about the update
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'CONTENT_UPDATE_AVAILABLE',
                    version: serverVersion
                });
            });
        }
    } catch (error) {
        console.error('Service Worker: Content sync failed', error);
    }
}