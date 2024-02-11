const { app, html } = await include("app");
const layout = await include("views/fragments/layout");

let count = 0;

function button() {
  return html`<button hx-post="/click" hx-swap="outerHTML">${count}</button>`;
}

app.get("/", async () => {
  return layout({
    title: "Offline HTMX Todo List",
    children: html`
      ${button()}
      <div hx-get="/test" hx-trigger="load"></div>
    `,
  });
});

app.get("/test", async (req) => {
  return html`is htmx? ${req.htmx}`;
});

app.post("/click", async () => {
  count++;
  return button();
});

app.get("/things/:id", async (req) => {
  return html`<h1>${req.params.id}</h1>`;
});
