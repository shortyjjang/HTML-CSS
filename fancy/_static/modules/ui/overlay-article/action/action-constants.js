// Generate `key: String(key)` structure by given string key arguments
function constantGen() {
    var keys = [].slice.call(arguments);
    return keys.reduce((prev, next) => {
        prev[next] = next;
        return prev;
    }, {});
}

var C = constantGen(
  'UPDATE_APP_CONTEXT',
  // Loading
  'REQUEST_ARTICLE',
  'REQUEST_ARTICLE_FAILURE',
  'LOAD_ARTICLE',

  // UI Actions
  'OPEN_ARTICLE',
  'CLOSE_ARTICLE',

);

export default C;
