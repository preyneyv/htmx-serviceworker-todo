const { html } = await include("app");
const todoItem = await include("fragments/todoItem");

module.exports = (todos) => {
  return html`<div id="todo-list" class="todo-container">
    <h1>Demo: Todo List</h1>
    <div class="todos">${todos.map(todoItem).join("")}</div>
    <div class="add-todo">
      <form hx-post="/todos" hx-target="#todo-list" hx-swap="outerHTML">
        <input
          type="text"
          name="task"
          placeholder="Press Enter to Add"
          required
          autofocus
        />
      </form>
    </div>
  </div>`;
};
