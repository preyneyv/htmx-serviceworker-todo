self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      await include("index");

      // // Cache required files for offline use
      // const cache = await caches.open("cache");
      // await cache.addAll(include.webCache);

      for (const client of await self.clients.matchAll()) {
        client.postMessage("ready");
      }
    })()
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await include("index");

      for (const client of await self.clients.matchAll()) {
        client.postMessage("ready");
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  // // Offline cache handler
  // if (include.webCache.find((r) => r.url === event.request.url)) {
  //   event.respondWith(
  //     (async () => {
  //       const match = await caches.match(event.request);
  //       if (match) {
  //         return match;
  //       }
  //       const res = await fetch(event.request);
  //       const cache = await caches.open("cache");
  //       cache.put(e.request, res.clone());
  //       return res;
  //     })()
  //   );
  //   return;
  // }

  const appModule = include.moduleCache["/sw/app.js"];
  if (!appModule) throw new Error("App was never loaded.");

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

  // Evaluate the script in an async scope (for top level awaits :D)
  await eval(
    `;(async()=>{${await fetch(arguments[0]).then((response) =>
      response.text()
    )}})();`
  );

  // Cache the module for future use
  include.moduleCache[arguments[0]] = module;

  return module.exports;
}

include.moduleCache = {};
// include.webCache = [
//   new Request("https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js"),
//   // new Request("https://cdn.tailwindcss.com/3.4.1", { mode: "no-cors" }),
// ];
