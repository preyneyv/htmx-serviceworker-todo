self.addEventListener("install", function (event) {
  event.waitUntil(
    (async () => {
      self.skipWaiting();
      await include("index");

      for (const client of await self.clients.matchAll()) {
        client.postMessage("ready");
      }
    })()
  );
});

self.addEventListener("activate", function (event) {
  console.log("activate");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  console.log("fetch", event.request.url);
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

// Load the bootstrapper file
