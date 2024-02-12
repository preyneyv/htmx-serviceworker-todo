self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      await caches.delete("cache");
      // await include("index");
    })()
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async () => {
      await include("index");
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  // Offline cache handler
  if (
    include.webCache.find((r) => r.url === event.request.url) ||
    event.request.url.startsWith("https://fonts.googleapis.com") ||
    event.request.url.startsWith("https://fonts.gstatic.com")
  ) {
    event.respondWith(include.cachedFetch(event.request));
    return;
  }

  const appModule = include.moduleCache["/sw/app.js"];
  if (!appModule) return;

  const { app } = appModule.exports;
  app.handleRequest(event);
});

/**
 * A crude implementation of an async variant of the CommonJS require()
 * function. This will reuse the module from cache if possible.
 */
async function include() {
  const exports = {};
  const module = { exports };

  arguments[0] = "/sw/" + arguments[0] + ".js";

  if (include.moduleCache[arguments[0]])
    return include.moduleCache[arguments[0]].exports;

  // Evaluate the script in an async scope (for top level awaits and var scoping :D)
  await eval(
    `;(async()=>{${await include
      .cachedFetch(arguments[0])
      .then((response) => response.text())}})();`
  );

  // Cache the module for future use
  include.moduleCache[arguments[0]] = module;

  return module.exports;
}

include.moduleCache = {};
include.cachedFetch =
  /**
   * @param {RequestInfo} req
   */
  async (req) => {
    const cache = await caches.open("cache");
    const match = await cache.match(req);
    if (match) return match;
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  };
include.webCache = [
  new Request("https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js"),
  new Request("/styles.css"),
];
include("index");
