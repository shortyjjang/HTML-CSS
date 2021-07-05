// Warning: objects has to be flat in each context
export function getInitialStoreState(contextName: 'appContext' | 'thing' | 'followContext' | 'fancyContext' | 'saleContext' | 'slideContext') {
    switch(contextName) {
    case 'appContext':
        return {
            visible: false,
            viewer: {},
            loggedIn: null,
            userCountry: 'US',
            applePayDisplay: false,
            applePayTest: false,
        };
    case 'thing':
        return {
            data: null,
            ID: null,
            pendingID: null,
            isFetching: null,
            status: 'idle' // { idle | request | failed }
        };
    case 'followContext':
        return {
            id: null,
            followStore: {
                following: undefined,
                loading: false,
            },
            followUser: {
                following: undefined,
                loading: false,
            },
        };
    case 'fancyContext':
        return {
            id: null,
            fancyd_count: 0,
            fancyd: false,
            loading: false,
            status: 'Idle', // { Idle | Addition | Removal | After- } - Fancy'd status for animation control 
        };
    case 'saleContext':
        return {
            selectedQuantity: 1,
            saleOptionID: null, // `thing.id`? | `sio.id`?
            currencyCode: null, // props.thing.currency_code
            currencyMoney: null, //
            currencySymbol: null, //
            price: null, // (props.thing.sales_available && props.thing.sales.price) || null,
            personalization: null,
        };
    case 'slideContext':
        return {
            id: null,
            thumbnailIndex: 0,
        };
    default:
        console.warn('`getInitialStoreState()`: Unknown context name ', contextName);
    }
};

var contexts = [
    'slideContext',
    'saleContext',
    'fancyContext',
    'followContext',
    'thing',
    'appContext'
];

export function getAllInitialStoreState() {
    return contexts.reduce((state, contextKey) => {
        state[contextKey] = getInitialStoreState(contextKey);
        return state;
    } , {});
}
