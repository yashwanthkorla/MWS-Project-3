let CACHE_VERSION = 1;

// Shorthand identifier mapped to specific versioned cache.
let CURRENT_CACHES = {
    cahce_name: 'RR_Restaurant' + CACHE_VERSION
};

//Service Worker File. To install the service worker for the first and save the files which we want to be cached.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CURRENT_CACHES['cahce_name']).then((cache) => {
            //adding all images and the html,css files , also added data file so that data can be fetched when the user is offline
            return cache.addAll([
                'index.html',
                'restaurant.html',
                'manifest.json',
                '/Main/opt_css/style.min.css',
                '/Main/opt_webp/1.webp',
                '/Main/opt_webp/2.webp',
                '/Main/opt_webp/3.webp',
                '/Main/opt_webp/4.webp',
                '/Main/opt_webp/5.webp',
                '/Main/opt_webp/6.webp',
                '/Main/opt_webp/7.webp',
                '/Main/opt_webp/8.webp',
                '/Main/opt_webp/9.webp',
                '/Main/opt_webp/10.webp',
                '/Main/opt_webp/noimage.webp',
                '/Main/opt_img/icon/rr.png',
                '/Main/opt_img/icon/rrx512.png'
            ]);
        }).catch((err) => {
            console.log(err);
        })
    );
});
self.addEventListener('activate', (event) => {
    var allCacheNames = Object.values(CURRENT_CACHES);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!allCacheNames.includes(cacheName)) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});



// Before fetching the file from the internet, we are checking whether the file exists in the cache or not.
// If doesnt exists fetch it from the internet.
self.addEventListener('fetch', (event) => {
    // For more on match you can refer https://developer.mozilla.org/en-US/docs/Web/API/Cache/match
    event.respondWith(

        caches.open(CURRENT_CACHES['cahce_name']).then((cache) => {
            return cache.match(event.request).then((response) => {
                /* according to Mozilla developer docs match always resolves, if not match is found it will return undefined.
          so we are making sure that if the file does exists it return the file from the cache or else return from the internet using fetch api.        
         */     
                if (response) {
                    console.log(response,'cache return')
                    return response
                }
                return fetch(event.request).then((fetched_response) => {
                    //You can read more about put here https://developer.mozilla.org/en-US/docs/Web/API/Cache/put                    
                    cache.put(event.request, fetched_response.clone());
                    return fetched_response;
                }).catch((error) => {
                    console.error('Error in fetching', error);
                    throw error;
                })
            })
        }).catch(err => {
            console.error(err);
        })
    )
});

