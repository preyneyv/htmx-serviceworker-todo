const { html } = await include("app");
const { attr } = await include("utils/htmx");

module.exports = (todo) => {
  return html`<input
    type="text"
    name="task"
    autofocus
    ${attr("value", todo.task)}
    hx-trigger="blur, keyup[keyCode==13], keyup[keyCode==27]"
    hx-put="/todos/${todo.id}"
    hx-target="closest div"
    hx-swap="outerHTML"
  />`;
};
