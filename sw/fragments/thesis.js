const { html } = await include("app");

module.exports = () => {
  console.log("helo from theses");
  return html`
    <article>
      <h2>Not another todo list!</h2>
      <p>
        But this one is HTMX-powered, fully client-side and offline-ready. A
        service worker intercepts requests and responds to them using a custom
        HTTP router implementation. Everything you see is rendered in the
        service worker.
      </p>
      <p>See for yourself by opening DevTools and enabling offline mode!</p>
      <h2>Okay, but why?</h2>
      <p>
        As a zoomer web dev, I found
        <a
          href="https://htmx.org/essays/how-did-rest-come-to-mean-the-opposite-of-rest/"
          target="_blank"
          rel="noopener noreferrer"
          >&ldquo;How did REST Come To Mean The Opposite of REST?&rdquo;</a
        >
        to be extremely upsetting. I've also been meaning to mess around with
        service workers, so this project combines them in the worst way
        possible. Plus, it's exceedingly funny to have a thick client HTMX app.
      </p>
      <p>
        Furthering the nonconformist nature of this project, there are no build
        steps or dependencies (other than HTMX, of course). Everything you see
        is rendered by a custom
        <a href="https://hono.dev/" target="_blank" rel="noopener noreferrer"
          >Hono</a
        >-like HTTP router running in the service worker. I also built a cursed
        CommonJS-esque module system since ES modules aren't supported in
        service workers yet and I didn't want to have all my code in a single
        file/namespace.
      </p>
    </article>
  `;
};
