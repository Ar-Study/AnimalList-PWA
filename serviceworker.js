const cacheKey = "MyFancyCacheName_v1";
const cacheAllowList = [cacheKey];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheKey).then((cache) => {
      console.log("in install service worker ... cache opened");
      return cache.addAll([
        "/",
        "/fallback.json",
        "/css/main.css",
        "/js/main.js",
        "/js/jquery.min.js",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  var request = event.request;
  var url = new URL(request.url);

  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(function (response) {
        return response || fetch(request);
      })
    );
  } else {
    event.respondWith(
      caches.open("animals-cache").then(function (cache) {
        return fetch(request)
          .then(function (liveResponse) {
            cache.put(request, liveResponse.clone());
            return liveResponse;
          })
          .catch(function () {
            return caches.match(request).then(function (response) {
              if (response) return response;
              return caches.match("/fallback.json");
            });
          });
      })
    );
  }

  // Cache Only

  // caches
  //   .match(event.request)
  //   .then((cachedResponse) => {
  //     if (cachedResponse) {
  //       return cachedResponse;
  //     }
  //     return fetch(event.request).then((fetchedResponse) => {
  //       return caches.open(cacheKey).then((cache) => {
  //         cache.put(event.request, fetchedResponse.clone());
  //         return fetchedResponse;
  //       });
  //     });
  //   })
  //   .catch(() => {
  //     // Fallback response if both cache and network fail
  //     return caches.match("/offline.html");
  //   })
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!cacheAllowList.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
