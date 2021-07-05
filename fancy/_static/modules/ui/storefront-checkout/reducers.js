import { combineReducers } from 'redux';
import { update, updateShallow, isEmpty } from 'fancyutils';

import C from './action/action-constants';
import { getInitialStoreState } from './store/initial-store';
import { updateState } from './appstate';


const isLoggedIn = viewer => !isEmpty(viewer) && viewer.id != null;

function appContext(state = getInitialStoreState('appContext'), action) {
    switch (action.type) {
        case C.UPDATE_APP_CONTEXT:
            return updateShallow(state, action.context);
        case C.LOAD_CHECKOUT:
            const viewer = window.viewer || null;
            const seller = window.seller || null;
            const countries = window.countries || [];
            const convert_currency = window.convert_currency || false;
            const states = window.states || [];
            const loggedIn = isLoggedIn(viewer);
            const has_own_users = window.has_own_users || false;
            const domain_with_checkout = window.domain_with_checkout || false;
            const loading = false;
            
            updateState('loggedIn', loggedIn);
            updateState('viewer', viewer);
            updateState('seller', seller);
            updateState('countries', countries);
            updateState('states', states);
            updateState('convert_currency', states);
            updateState('has_own_users', has_own_users);
            updateState('domain_with_checkout', domain_with_checkout);
            updateState('loading', loading);

            return updateShallow(state, { loggedIn, viewer, seller, countries, convert_currency, states, has_own_users, domain_with_checkout, loading });
        case C.REQUEST_LOGIN_SUCCESS:
            window.viewer = action.data;
            return updateShallow(state, { loggedIn:true, viewer:action.data, guestCheckout:false, gueestEmail:'', step:'shipping'} );
        default:
            return state;
    }
}

function checkout(state = getInitialStoreState('checkout'), action) {
    switch (action.type) {
        case C.LOAD_CHECKOUT:
            return updateShallow(state, {
                data: action.data,
                status: action.status,
                pendingID: null,
                isFetching: false
            });
        case C.REQUEST_CHECKOUT:
            return update(state, {
                pendingID: action.pendingID,
                status: action.status,
                isFetching: true
            });
        case C.REQUEST_CHECKOUT_FAILURE:
            return update(state, {
                status: action.status,
                isFetching: false,
            });
        case C.APPLY_COUPON:
            return updateShallow(state, {
                status: action.status,
                isFetching: true
            });
        case C.APPLY_COUPON_FAILURE:
            return updateShallow(state, {
                message: action.message,
                status: action.status,
                isFetching: false,
            });
        case C.REQUEST_PAYMENT:
            return update(state, {
                pendingID: action.pendingID,
                status: action.status,
                isFetching: true
            });
        case C.REQUEST_PAYMENT_FAILURE:
            return update(state, {
                status: action.status,
                isFetching: false,
            });
        default:
            return state;
    }
}

function order(state = getInitialStoreState('order'), action) {
    switch (action.type) {
        case C.REQUEST_PAYMENT_SUCCESS:
            return updateShallow(state, {
                order: action.data,
                status: action.status,
                paymentData: action.paymentData,
            });
        default:
            return state;
    }
}

function currencyContext(state = getInitialStoreState('currencyContext'), action) {
    switch (action.type) {
        case C.LOAD_CHECKOUT:
            return updateShallow(state, {currencyCode: action.data.currency && action.data.currency.code || 'USD', price : action.data.currency && action.data.total_prices_converted || action.data.total_prices} );

        case C.UPDATE_CURRENCY_CONTEXT: {
            return updateShallow(state, {
                currencyCode: action.currencyCode, 
                currencyMoney: action.currencyMoney,
                currencySymbol: action.currencySymbol,
            });
        }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    appContext,
    checkout,
    order,
    currencyContext,
});

export default rootReducer;
