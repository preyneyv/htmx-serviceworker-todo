# [HTMX + Service Worker Todo List](https://htmx-serviceworker-todo.vercel.app/)

I wanted to mess around with [HTMX](https://htmx.org) and Service Workers, so
this combines both of them in the worst way possible.

This project has a service worker that serves API requests and responds
using HTML fragments. The client uses HTMX to enable interactivity
with minimal browser-side JS.

I might just have too much time on my hands.

## Goals

- Use HTMX
- Only client-side, offline-ready
- No dependencies (other than HTMX)
- No build step

## Technical Details

### Module System

Since ES modules are not supported in service workers (yet), [I wrote my own cursed module system](/sw.js#L38-L76)
inspired by the CommonJS specification. It fetches the JS file contents and
`eval`s it after defining `module` and `exports` objects. This regrettably
causes an N+1 waterfall, but so do ES modules. Since the TS language server has
no idea what `include()` is or why we're `await`ing it, we get no type safety on
imports. Oh well.

### HTTP Router

The `Request`s from the client are handled by a [custom HTTP router implementation](/sw/app.js)
that is heavily inspired by [Hono](https://hono.dev). The router supports all
the common HTTP verbs as well as URL parameter matching.

### Templating

I originally considered writing a templating engine using the [MustacheJS](https://mustache.github.io/) syntax, but settled for a [no-op `html` template tag](/sw/app.js#L17-L26).

## Conclusion

This was honestly really fun to build. Building things the "HTMX way" (the
"correct way"?) was definitely interesting, and a far departure from my comfort
zone of JSON APIs and JS-rendered clients. HTMX gets a gold star from me.

This should've been obvious from the start, but I do _NOT_ recommend building
client-side applications this way (using a service worker so you can HATEOAS ALL
THE THINGS), but I learnt a lot about service workers and how they can be
completely abused to do cool things. No build step and no dependencies was cool
too, and browser APIs are honestly really good now.
