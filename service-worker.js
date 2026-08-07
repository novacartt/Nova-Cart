/* ========================================
   NOVA CART - SERVICE WORKER
   ======================================== */

const CACHE_NAME = 'nova-cart-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/contact.html',
    '/faq.html',
    '/product.html',
    '/checkout.html',
    '/apply-emi.html',
    '/track-application.html',
    '/notifications.html',
    '/privacy-policy.html',
    '/terms.html',
    '/emi-terms.html',
    '/refund-policy.html',
    '/fraud-prevention.html',
    '/responsible-lending.html',
    '/consent-esign.html',
    '/disclaimer.html',
    '/cookie-policy.html',
    '/consumer-rights.html',
    '/portal/index.html',
    '/admin/index.html',
    '/css/style.css',
    '/css/responsive.css',
    '/css/animation.css',
    '/css/theme.css',
    '/js/main.js',
    '/js/firebase-config.js',
    '/js/auth.js',
    '/js/cart.js',
    '/js/search.js',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// ===== INSTALL =====
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.warn('Cache install warning:', err);
            })
    );
});

// ===== ACTIVATE =====
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// ===== FETCH =====
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Clone the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});

// ===== SKIP WAITING =====
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('📦 Service Worker loaded');