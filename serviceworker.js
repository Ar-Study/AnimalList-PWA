// /sw.js
self.addEventListener("install", (event) => {
  const cacheKey = "MyFancyCacheName_v1";

  event.waitUntil(
    caches.open(cacheKey).then((cache) => {
      // Add all the assets in the array to the 'MyFancyCacheName_v1'
      // `Cache` instance for later use.
      console.log("in install service worker ... cache opened");
      return cache.addAll([
        "/",
        "/css/main.css",
        "/js/main.js",
        "/js/jquery.min.js",
      ]);
    })
  );
});

// Establish a cache name
const cacheName = "MyFancyCacheName_v1";

self.addEventListener("fetch", (event) => {
  // Check if this is a request for an image
  if (event.request.destination === "image") {
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        // Go to the cache first
        return cache.match(event.request.url).then((cachedResponse) => {
          // Return a cached response if we have one
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise, hit the network
          return fetch(event.request).then((fetchedResponse) => {
            // Add the network response to the cache for later visits
            cache.put(event.request, fetchedResponse.clone());

            // Return the network response
            return fetchedResponse;
          });
        });
      })
    );
  } else {
    return;
  }
});

self.addEventListener("activate", (event) => {
  // Specify allowed cache keys
  const cacheAllowList = ["MyFancyCacheName_v2"];

  // Get all the currently active `Cache` instances.
  event.waitUntil(
    caches.keys().then((keys) => {
      // Delete all caches that aren't in the allow list:
      return Promise.all(
        keys
          .filter(function (key) {
            return key != cacheKey;
          })
          .map(function (key) {
            return caches.delete(key);
          })

        // Default
        // keys.map((key) => {
        //   if (!cacheAllowList.includes(key)) {
        //     return caches.delete(key);
        //   }
        // })
      );
    })
  );
});
