// This is entrypoint, which `React.render` takes place after DOM is ready.
import React from 'react';
import { render } from 'react-dom';
import { selectOrCreate } from 'fancyutils';
import { Provider } from 'react-redux';

import { fetchCheckout, updateCheckout } from './action/action-helpers';
import { attachEntryEvents } from './container/entry-events';
import store from './store/store';
import StorefrontCheckout from './components/checkout';
import C from './action/action-constants';

$(document).ready(function() {
    require('./shared');
    
    render(
        <Provider store={store}>
            <StorefrontCheckout />
        </Provider>,
        selectOrCreate('#wrap'),
        () => {
            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {convert_currency:window.convert_currency}}) });
            if (window.paypal_payment) {
                store.dispatch(updateCheckout( window.seller.id, window.paypal_payment ));
                store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'paypal'}}) });
            } else {
                store.dispatch(fetchCheckout(window.seller.id));
            }
            attachEntryEvents();

            if (window.ga && window.uses_tracking) {
                try {
                    ga('send', 'event', {
                        eventCategory: 'UserAction',
                        eventAction: 'ProceedToCheckout',
                    });
                } catch(e) {
                    console.error(e);
                }
            }
        }
    );
});
