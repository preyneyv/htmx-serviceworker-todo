const { html } = await include("app");
const todoItem = await include("fragments/todoItem");

module.exports = (todos) => {
  return html`<div id="todo-list" class="todo-container">
    <div class="todos">${todos.map(todoItem).join("")}</div>
    <div class="add-todo">
      <form hx-post="/todos" hx-target="#todo-list">
        <input type="text" name="task" placeholder="Some task here..." />
        <button type="submit">Add</button>
      </form>
    </div>
  </div>`;
};
