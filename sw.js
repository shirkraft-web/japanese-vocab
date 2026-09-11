"use strict";

var CACHE_NAME = "jp-vocab-v1";
var SHELL_FILES = [
  "./",
  "index.html",
  "manifest.json",
  "icon.svg",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(SHELL_FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; })
          .map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function isDataFile(url) {
  return /\/(vocab|grammar)\.json(\?|$)/.test(url);
}

function isGoogleFont(url) {
  return url.indexOf("fonts.googleapis.com") !== -1 || url.indexOf("fonts.gstatic.com") !== -1;
}

function networkFirst(request) {
  return fetch(request).then(function (response) {
    var copy = response.clone();
    caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
    return response;
  }).catch(function () {
    return caches.match(request);
  });
}

function cacheFirst(request) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
      return response;
    });
  });
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  if (isDataFile(req.url)) {
    event.respondWith(networkFirst(req));
  } else if (isGoogleFont(req.url)) {
    event.respondWith(cacheFirst(req));
  } else if (new URL(req.url).origin === self.location.origin) {
    event.respondWith(cacheFirst(req));
  }
});
