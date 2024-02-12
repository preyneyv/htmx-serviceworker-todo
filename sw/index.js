const { app, html } = await include("app");
const todos = await include("stores/todos");

const layout = await include("fragments/layout");
const todoList = await include("fragments/todoList");
const todoItem = await include("fragments/todoItem");
const todoItemEdit = await include("fragments/todoItemEdit");
const thesis = await include("fragments/thesis");

function button() {
  return html`<button hx-post="/click" hx-swap="outerHTML">${count}</button>`;
}

app.get("/", async () => {
  console.log("wow this works?");
  return layout({
    title: "HATEOAS but Client-Side and Offline",
    children: html` ${todoList(todos.getAll())} ${thesis()} `,
  });
});

app.post("/todos", async (req) => {
  const { task } = await req.body();
  todos.create(task);

  return todoList(todos.getAll());
});

app.put("/todos/:id", async (req) => {
  const { id } = req.params;
  const body = await req.body();
  const delta = {};

  if (body.completed !== undefined) delta.completed = body.completed === "true";
  if (body.task !== undefined) delta.task = body.task;

  const todo = todos.update(id, delta);
  if (!todo) return new Response(null, { status: 404 });

  return todoItem(todo);
});

app.get("/todos/:id/edit", async (req) => {
  const { id } = req.params;
  const todo = todos.get(id);
  if (!todo) return new Response(null, { status: 404 });

  return todoItemEdit(todos.get(id));
});

app.delete("/todos/:id", async (req) => {
  const { id } = req.params;
  const deletedTodo = Boolean(todos.delete(id));
  if (deletedTodo === null) return new Response(null, { status: 404 });
  return html``;
});
