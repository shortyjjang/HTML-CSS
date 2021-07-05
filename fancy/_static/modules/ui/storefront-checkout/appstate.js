// App state that does not usually change during app lifecycle. (i.e. Login state)
// import assign from 'object-assign';

// module-level login state object and setter
const state = { viewer: {}, seller:{}, loggedIn: false };
export default state;

/*
export function statify(config) {
    assign(state, config);
    state.loginNeededAttr = config.loggedIn ? {} : {'data-require_login': "true"};
}
*/

export function updateState(k, v) {
    state[k] = v;
}
