const CACHE = "betterrx-dme-shell-v1";
const SHELL = [
  "/brand/logo-pill.png",
  "/brand/icon-192.png",
  "/brand/icon-512.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/" || url.pathname.startsWith("/?")) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});
