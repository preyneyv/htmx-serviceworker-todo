const { html } = await include("app");

module.exports = ({ title, children }) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script src="https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js"></script>
        <link rel="stylesheet" href="/styles.css" />

        <title>${title}</title>
      </head>
      <body>
        <main>
          <header>
            <h1>HATEOAS But Client-Side and Offline</h1>
            <h2>HTMX + Service Workers</h2>
          </header>
          <h3 class="hero-links">
            <a
              href="//github.com/preyneyv/htmx-serviceworker-todo"
              target="_blank"
              rel="noopener noreferrer"
              >View on GitHub</a
            >
          </h3>
          ${children}
          <footer>
            <span
              >Built by
              <a
                href="//twitter.com/@preyneyv"
                target="_blank"
                rel="noopener noreferrer"
                >@preyneyv</a
              ></span
            >
            <a
              href="//github.com/preyneyv/htmx-serviceworker-todo"
              target="_blank"
              rel="noopener noreferrer"
              >GitHub</a
            >
          </footer>
        </main>
      </body>
    </html>
  `;
};
