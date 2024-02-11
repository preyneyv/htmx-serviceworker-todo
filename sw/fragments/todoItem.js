const { html } = await include("app");
const { hxVals } = await include("utils/htmx");

module.exports = (todo) => {
  const base = `/todos/${todo.id}`;
  return html`<div>
    <input
      type="checkbox"
      hx-put="${base}"
      hx-target="closest div"
      ${todo.completed ? "checked" : ""}
      ${hxVals({ completed: !todo.completed })}
    />
    <h3 hx-get="${base}/edit" hx-swap="outerHTML">${todo.task}</h3>
    <button hx-target="closest div" hx-swap="outerHTML" hx-delete="${base}">
      x
    </button>
  </div>`;
};
