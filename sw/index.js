const { app, html } = await include("app");

app.get("/", async () => {
  return html`<h1>Hello World!</h1>`;
});

app.get("/wow", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return html`<h1>Hello World!</h1>`;
});
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
