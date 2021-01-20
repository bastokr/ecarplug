'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "a8d1d130b9909728d724354dc06becc1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"ecarplug/.git/config": "f56a53c07f756562769d90da448d6bd2",
"ecarplug/.git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
"ecarplug/.git/HEAD": "4cf2d64e44205fe628ddd534e1151b58",
"ecarplug/.git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
"ecarplug/.git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
"ecarplug/.git/hooks/fsmonitor-watchman.sample": "ea587b0fae70333bce92257152996e70",
"ecarplug/.git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
"ecarplug/.git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
"ecarplug/.git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
"ecarplug/.git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
"ecarplug/.git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
"ecarplug/.git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
"ecarplug/.git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
"ecarplug/.git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
"ecarplug/.git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
"ecarplug/.git/index": "912c81022debed77887dae7b54faa67b",
"ecarplug/.git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
"ecarplug/.git/logs/HEAD": "b4819d3fb984b7343a367e61646864be",
"ecarplug/.git/logs/refs/heads/master": "b4819d3fb984b7343a367e61646864be",
"ecarplug/.git/logs/refs/remotes/origin/HEAD": "b4819d3fb984b7343a367e61646864be",
"ecarplug/.git/objects/pack/pack-465f57d6eb059eb867593a3160d8068e7f74e0bd.idx": "918f8b834047335a38df30425bfac701",
"ecarplug/.git/objects/pack/pack-465f57d6eb059eb867593a3160d8068e7f74e0bd.pack": "7f5fcd6a50e2b3c9081d158235f3163b",
"ecarplug/.git/packed-refs": "aef19fcdf4925ae6c28009ff257ec9cb",
"ecarplug/.git/refs/heads/master": "b0062481a26980bbfcec243a52889e0d",
"ecarplug/.git/refs/remotes/origin/HEAD": "73a00957034783b7b5c8294c54cd3e12",
"ecarplug/web/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"ecarplug/web/icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"ecarplug/web/icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"ecarplug/web/index.html": "21e660162473829dca2a83b072ba278b",
"/": "f3728cf28350222517797d9bf03f2a5c",
"ecarplug/web/manifest.json": "faa73bc57f3f9aea199ee3f3ff798472",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "f3728cf28350222517797d9bf03f2a5c",
"main.dart.js": "7e969882be06e8b41df5930082465b98",
"manifest.json": "faa73bc57f3f9aea199ee3f3ff798472",
"version.json": "8bad0d1bbcbc65dc6a7635dbf9827e40"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
