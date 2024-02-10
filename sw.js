function makeJSONResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function makeHTMLResponse(html) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

/**
 * Template tag to convert HTML into a Response object
 * @param {string} value
 * @returns {Response}
 */
function html(value) {
  return makeHTMLResponse(value);
}

/**
 * @typedef {(req: AppRequest) => Promise<Response>} AppCallback
 * @typedef {{type: 'var' | 'path', part: string}} AppPathSegment
 * @typedef {{ method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: AppPathSegment[], callback: AppCallback }} AppRoute
 */

class AppRequest {
  /**
   *
   * @param {URL} url
   * @param {Request} request
   * @param {} route
   */
  constructor(url, request, route) {}
}
/**
 * Minimal implementation of an API router (a la Hono, Express, etc.)
 * Supports path parameters by prefixing the segment with a :
 * Example: `/users/:id/profile`
 */
class App {
  /** @type {AppRoute[]} */
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
    /** @type {Request} */
    const request = event.request;
    const url = new URL(request.url);
    if (url.host !== this.host) {
      // I guess it just wasn't meant to be :(
      return;
    }

    const matchingRoute = this.#routes.find((route) => {
      const segments = url.pathname.split("/");
      return (
        route.method === request.method &&
        route.path.length === segments.length &&
        route.path.every((segment, i) => {
          if (segment.type === "var") {
            return true;
          } else {
            return segments[i] === segment.part;
          }
        })
      );
    });
    if (!matchingRoute) {
      // No matching route found, we defer to the browser.
      return;
    }

    event.respondWith(matchingRoute.callback(new AppRequest()));
  }

  /**
   * @param {string} host hostname of the active webpage
   */
  configure(host) {
    this.host = host;
  }
}

const app = new App();
app.post(
  "/clicked",
  () =>
    html`<button hx-post="/clicked-2" hx-swap="outerHTML">Now click me</button>`
);
app.post(
  "/clicked-2",
  () =>
    html`<button hx-post="/clicked" hx-swap="outerHTML">
      this is honestly kinda cool tbh
    </button>`
);

const messageHandlers = {
  /**
   * Initialize the service worker using data provided by the page.
   * @param {{ hostname: string }}
   */
  initialize({ host }) {
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
