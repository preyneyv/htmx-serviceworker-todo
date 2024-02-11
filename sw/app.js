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
 * Template tag to convert HTML into a string
 * This exists solely so my LSP gives me syntax highlighting.
 * @param {string[]} strings
 * @param {...*} keys
 * @returns {string}
 */
function html(strings, ...keys) {
  return strings.flatMap((string, i) => [string, keys[i]]).join("");
}

/**
 * @typedef {(req: AppRequest) => Response | Promise<Response>} AppCallback
 * @typedef {{ type: 'var' | 'path', part: string }} AppPathSegment
 * @typedef {{ method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: AppPathSegment[], callback: AppCallback }} AppRoute
 */

class AppRequest {
  /**
   * Convenience wrapper around the `Request` object.
   * @param {URL} url
   * @param {Request} request
   * @param {AppRoute} route
   */
  constructor(url, request, route) {
    this.url = url;
    this.request = request;
    this.route = route;

    this.htmx = request.headers.get("hx-request") === "true";

    this.query = {};
    url.searchParams.forEach((value, key) => {
      this.query[key] = value;
    });

    this.params = {};
    url.pathname.split("/").map((segment, i) => {
      const part = route.path[i];
      if (part.type === "var") {
        this.params[part.part] = decodeURIComponent(segment);
      }
    });
  }
}
/**
 * Minimal implementation of an API router (a la Hono, Express, etc.)
 * Supports path parameters by prefixing the segment with a :
 * Example: `/users/:id/profile`
 */
class App {
  /** @type {AppRoute[]} */
  #routes = [];

  constructor() {}

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
   * @param {FetchEvent} event
   */
  handleRequest(event) {
    /** @type {Request} */
    const request = event.request;
    const url = new URL(request.url);

    if (url.host !== self.location.host) {
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

    // console.log(url, matchingRoute, this.#routes);

    if (!matchingRoute) {
      // No matching route found, we defer to the browser.
      return;
    }

    event.respondWith(
      (async () => {
        const res = await matchingRoute.callback(
          new AppRequest(url, request, matchingRoute)
        );
        if (typeof res === "string") {
          return makeHTMLResponse(res);
        }
        return res;
      })()
    );
  }
}

const app = new App();

module.exports = {
  makeJSONResponse,
  makeHTMLResponse,
  html,
  AppRequest,
  App,
  app,
};
