// Warning: objects has to be flat in each context
export function getInitialStoreState(contextName) {
    switch(contextName) {
    case 'appContext':
        return {
            visible: false,
            viewer: {},
            loggedIn: null,
            userCountry: 'US',
        };
    case 'article':
        return {
            data: null,
            ID: null,
            pendingID: null,
            isFetching: null,
            status: 'idle' // { idle | request | failed }
        };
    default:
        console.warn('`getInitialStoreState()`: Unknown context name ', contextName);
    }
};

var contexts = [
    'article',
    'appContext'
];

export function getAllInitialStoreState() {
    return contexts.reduce((state, contextKey) => {
        state[contextKey] = getInitialStoreState(contextKey);
        return state;
    } , {});
}
