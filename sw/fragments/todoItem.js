const { html } = await include("app");
const { hxVals, attr } = await include("utils/htmx");

module.exports = (todo) => {
  const base = `/todos/${todo.id}`;
  return html` <div ${attr("class", todo.completed ? "completed" : "")}>
    <label class="checkbox">
      <input
        type="checkbox"
        hx-put="${base}"
        hx-target="closest div"
        hx-swap="outerHTML"
        ${todo.completed ? "checked" : ""}
        ${hxVals({ completed: !todo.completed })}
      />
      <div class="checkbox-standin"></div>
    </label>
    <h3>
      <div hx-get="${base}/edit" hx-swap="outerHTML">
        <span>${todo.task}</span>
      </div>
    </h3>
    <button hx-target="closest div" hx-swap="outerHTML" hx-delete="${base}">
      x
    </button>
  </div>`;
};
