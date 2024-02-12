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
        <main>${children}</main>
      </body>
    </html>
  `;
};
