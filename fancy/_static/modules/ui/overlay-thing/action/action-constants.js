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
  'REQUEST_THING',
  'REQUEST_THING_FAILURE',
  'LOAD_THING',

  // UI Actions
  'OPEN_THING',
  'CLOSE_THING',

  // Comment form suggestion
  'SET_USERNAME_KEYWORD',
  'LOAD_SUGGESTION',

  // Thumbnail
  'SET_THUMBNAIL_INDEX',

  // Follow
  'TOGGLE_FOLLOW',
  'CANCEL_FOLLOW',
  'COMPLETE_FOLLOW',

  // Fancy
  'TOGGLE_FANCY',
  'CANCEL_FANCY',
  'COMPLETE_FANCY',

  // Saleitem
  'UPDATE_SALE_CONTEXT'
);

export default C;
