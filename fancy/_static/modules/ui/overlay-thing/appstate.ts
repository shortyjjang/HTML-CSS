// App state that does not usually change during app lifecycle. (i.e. Login state)

// module-level login state object and setter
const state : { viewer: {}; loggedIn: Boolean; } = { viewer: {}, loggedIn: false };
export default state;

export function updateState(k, v) {
    state[k] = v;
}
