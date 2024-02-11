/**
 * Generate a hx-vals attribute by JSON-encoding the provided value.
 */
function hxVals(value) {
  const json = JSON.stringify(value);
  return attr("hx-vals", json);
}

/**
 * Create an html attribute by escaping the value.
 * @param {string} name
 * @param {string} value
 * @returns {string}
 */
function attr(name, value) {
  return `${name}="${value.replace(/"/g, "&quot;")}"`;
}

module.exports = {
  hxVals,
  attr,
};
