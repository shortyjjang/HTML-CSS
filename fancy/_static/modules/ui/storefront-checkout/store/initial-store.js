// Warning: objects has to be flat in each context
export function getInitialStoreState(contextName) {
    switch(contextName) {
        case 'appContext':
            return {
                viewer: window.viewer,
                seller : window.seller,
                countries : window.countries,
                states : window.states,
                loggedIn: window.viewer && window.viewer.id,
                loading: true,
                guestCheckout: !window.viewer,
                guestEmail: '',
                guestCard: {},
                userCountry: window.default_country||'US',
                step:'shipping',
                convert_currency:window.convert_currency || false,
                has_own_users:false,
                domain_with_checkout:false,
                gift_info:{},
                note_info:"",
                personalizations:{}
            };
        case 'checkout':
            return {
                data: {},
                isFetching: true,
                status: 'idle',
            };
        case 'order':
            return {};
        case 'currencyContext':
            return {
                currencyCode: null, //
                currencyMoney: null, //
                currencySymbol: null, //
                price: 0, //
            };
        default:
            console.warn('`getInitialStoreState()`: Unknown context name ', contextName);
    }
};

var contexts = [
    'checkout',
    'order',
    'appContext',
    'currencyContext'
];

export function getAllInitialStoreState() {
    return contexts.reduce((state, contextKey) => {
        state[contextKey] = getInitialStoreState(contextKey);
        return state;
    } , {});
}
