/// <reference lib="webworker" />
//This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

//Install stage sets up the offline page in the cahche and opens a new cache
self.addEventListener("install", function (event) {
  event.waitUntil(preLoad());
});

function preLoad() {
  return caches.open("pwabuilder-offline").then(function (cache) {
    return cache.addAll([
      "/assets/styles/main.css?v=5",
      "/assets/scripts/main.js?v=5",
      "https://fonts.googleapis.com/css2?family=Source+Code+Pro&family=Source+Serif+Pro:wght@400;600;700&display=swap",
      "/wp-content/uploads/me.jpg",
      "https://fonts.gstatic.com/s/sourceserifpro/v11/neIQzD-0qpwxpaWvjeD0X88SAOeauXQ-oAGIyY0.woff2",
      "https://fonts.gstatic.com/s/sourceserifpro/v11/neIXzD-0qpwxpaWvjeD0X88SAOeasasatSyqxKcsdrM.woff2",
      "https://fonts.gstatic.com/s/sourceserifpro/v11/neIXzD-0qpwxpaWvjeD0X88SAOeasc8btSyqxKcsdrM.woff2",
      "/icon/favicon-32x32.png",
      "/icon/apple-icon-180x180.png",
    ]);
  });
}

/**
 *
 * @param {Request} request
 * @returns
 */
function returnFromCache(request) {
  return caches.open("pwabuilder-offline").then(function (cache) {
    return cache.match(request);
  });
}

/**
 *
 * @param {FetchEvent} event
 */
function fetchEventHandler(event) {
  event.respondWith(
    returnFromCache(event.request).catch(function () {
      return fetch(event.request);
    })
  );
}

self.addEventListener("fetch", fetchEventHandler);

/*self.addEventListener("fetch", function (event) {
  console.log("The service worker is serving the asset. ", event.request.url);
  event.respondWith(
    checkResponse(event.request).catch(function () {
      return returnFromCache(event.request);
    })
  );
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function (request) {
  return new Promise(function (fulfill, reject) {
    fetch(request).then(function (response) {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};

var addToCache = function (request) {
  return caches.open("pwabuilder-offline").then(function (cache) {
    return fetch(request).then(function (response) {
      console.log("[PWA Builder] add page to offline: " + response.url);
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function (request) {
  return caches.open("pwabuilder-offline").then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status == 404) {
        return cache.match("404.html");
      } else {
        return matching;
      }
    });
  });
};
*/
