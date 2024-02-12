/**
 * @typedef {{ id: string, completed: boolean, task: string }} Todo
 */

/**
 * Datastore object to store and interact with an array of todos.
 */
class TodoStore {
  constructor() {
    /** @type {Todo[]} */
    this.todos = [
      {
        completed: true,
        id: self.crypto.randomUUID(),
        task: "Learn HTMX",
      },
      {
        completed: true,
        id: self.crypto.randomUUID(),
        task: "Build a Worker-based HTTP router",
      },
      {
        completed: false,
        id: self.crypto.randomUUID(),
        task: "Make an antithetical demo",
      },
    ];
  }

  /**
   * @returns {Todo[]}
   */
  getAll() {
    return this.todos;
  }

  /**
   * @param {string} id
   * @returns {Todo | null}
   */
  get(id) {
    return this.todos.find((todo) => todo.id === id) || null;
  }

  /**
   * @param {string} task
   * @returns {Todo}
   */
  create(task) {
    const todo = { task, completed: false, id: self.crypto.randomUUID() };
    this.todos.push(todo);
    return todo;
  }

  /**
   * @param {string} id
   * @param {Partial<Todo>} delta
   * @returns {Todo}
   */
  update(id, delta) {
    const todo = this.todos.find((todo) => todo.id === id);
    Object.assign(todo, delta);
    return todo;
  }

  /**
   * @param {string} id
   * @returns {Todo | null}
   */
  delete(id) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) return null;
    return this.todos.splice(index, 1)[0];
  }
}

module.exports = new TodoStore();
