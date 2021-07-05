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
  'UPDATE_CURRENCY_CONTEXT',
  // Loading
  'REQUEST_CHECKOUT',
  'REQUEST_CHECKOUT_FAILURE',
  'LOAD_CHECKOUT',
  'REQUEST_PAYMENT',
  'REQUEST_PAYMENT_SUCCESS',
  'REQUEST_PAYMENT_FAILURE',
  'APPLY_COUPON',
  'APPLY_COUPON_FAILURE',

  'REQUEST_LOGIN',
  'REQUEST_LOGIN_SUCCESS',
  'REQUEST_LOGIN_FAILURE',
);

export default C;
