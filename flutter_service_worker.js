'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "f99fe9ea873c2122e12685a52d9b2626",
"assets/FontManifest.json": "fcd9b463321536c3929a8d3f2a07e513",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/fonts/PlayfairDisplay-Medium.ttf": "6b6f0053a6811a9381a9fa488ac76cb0",
"assets/fonts/PlayfairDisplay-Regular.ttf": "b3721ba3bde34e5b38b0e1523cccfd7f",
"assets/fonts/Roboto-Bold.ttf": "e07df86cef2e721115583d61d1fb68a6",
"assets/fonts/Roboto-Light.ttf": "88823c2015ffd5fa89d567e17297a137",
"assets/fonts/Roboto-Medium.ttf": "58aef543c97bbaf6a9896e8484456d98",
"assets/fonts/Roboto-Regular.ttf": "11eabca2251325cfc5589c9c6fb57b46",
"assets/images/desk.jpg": "9bf53e9ed33206dea8279447c3ce65a3",
"assets/images/me.jpg": "262cf54ffad42bf29824f4f4394f3772",
"assets/LICENSE": "8eb46c5d32f5176c54614af61b3cedde",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"index.html": "b035406569ef966698ec32f796eeb0fa",
"/": "b035406569ef966698ec32f796eeb0fa",
"main.dart.js": "136e4f484e4f6b69d770fc48c816cbce"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
