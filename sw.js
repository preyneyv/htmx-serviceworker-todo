function makeJSONResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

class AppRequest {
  constructor() {}
}

/**
 * @typedef {(req: AppRequest) => Promise<Response>} AppCallback
 * @typedef {{type: 'var' | 'path', part: string}} AppPathSegment
 */

class App {
  #isRegistered = false;

  /** @type {AppPathSegment[]} */
  #routes = [];

  constructor() {
    self.addEventListener("fetch", (event) => this.#handleRequest(event));
  }

  /**
   * Parse a route path and extract dynamic parameters.
   * @param {string} route desired route path
   * @returns {AppPathSegment[]} parsed route path
   */
  #parseRoute(route) {
    return route.split("/").map((segment) => {
      if (segment.startsWith(":")) {
        return { type: "var", part: segment.substring(1) };
      } else {
        return { type: "path", part: segment };
      }
    });
  }

  /**
   * Register a callback for a GET request
   * @param {string} route route to match
   * @param {AppCallback} callback callback to be triggered when the route is matched
   */
  get(route, callback) {
    this.#routes.push({
      path: this.#parseRoute(route),
      method: "GET",
      callback,
    });
  }

  /**
   * Register a callback for a POST request
   * @param {string} route route to match
   * @param {AppCallback} callback callback to be triggered when the route is matched
   */
  post(route, callback) {
    this.#routes.push({
      path: this.#parseRoute(route),
      method: "POST",
      callback,
    });
  }

  /**
   * Register a callback for a PUT request
   * @param {string} route route to match
   * @param {AppCallback} callback callback to be triggered when the route is matched
   */
  put(route, callback) {
    this.#routes.push({
      path: this.#parseRoute(route),
      method: "PUT",
      callback,
    });
  }

  /**
   * Register a callback for a DELETE request
   * @param {string} route route to match
   * @param {AppCallback} callback callback to be triggered when the route is matched
   */
  delete(route, callback) {
    this.#routes.push({
      path: this.#parseRoute(route),
      method: "DELETE",
      callback,
    });
  }

  /**
   * Handle a 'fetch' request to the service worker.
   * @param {*} event
   */
  #handleRequest(event) {
    const url = new URL(event.request.url);
    if (url.host !== this.host) {
      // I guess it just wasn't meant to be :(
      return;
    }
    console.log(event.request, url);
    event.respondWith(makeJSONResponse({ hello: "world" }));
  }

  /**
   * @param {string} host hostname of the active webpage
   */
  configure(host) {
    if (this.#isRegistered) throw new Error("Tried to re-register app");

    this.#isRegistered = true;
    this.host = host;
  }
}

const app = new App();
app.get("/test", (req) => makeJSONResponse({ hello: "world" }));
app.get("/test/:variable/wow", (req) => makeJSONResponse({ hello: "world" }));

const messageHandlers = {
  /**
   * Initialize the service worker using data provided by the page.
   * @param {{ hostname: string }}
   */
  initialize({ host }) {
    console.log("Initializing service worker", host);
    app.configure(host);
  },
};

self.addEventListener("message", (event) => {
  const { handler, data } = JSON.parse(event.data);
  try {
    messageHandlers[handler](data);
  } catch (e) {
    console.error("Unknown message handler:", handler, e);
  }
});
