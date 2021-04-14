/// <reference lib="webworker" />

const version = "7";

var offlineFundamentals = [
  `/assets/styles/main.css?v=${version}`,
  `/assets/scripts/main.js?v=${version}`,
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(version + "::fundamentals").then(function (cache) {
      return cache.addAll(offlineFundamentals);
    })
  );
});

self.addEventListener("fetch", function (/** @type {FetchEvent} */ event) {
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("carbonads") ||
    event.request.url.includes("buysellads") ||
    event.request.url.includes("doubleclick")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      const networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);

      return cached || networked;

      function fetchedFromNetwork(response) {
        const cacheCopy = response.clone();
        caches
          // We open a cache to store the response for this request.
          .open(version + "::pages")
          .then(function add(cache) {
            return cache.put(event.request, cacheCopy);
          });

        return response;
      }

      function unableToResolve() {
        return new Response("<h1>Service Unavailable</h1>", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({
            "Content-Type": "text/html",
          }),
        });
      }
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return !key.startsWith(`${version}::`);
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});
