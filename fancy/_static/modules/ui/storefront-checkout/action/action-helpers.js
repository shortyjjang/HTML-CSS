import store from '../store/store';
import {
    loadCheckout,
    requestCheckout,
    requestCheckoutFail,
    applyCoupon,
    applyCouponFail,
    requestPayment,
    requestPaymentSuccess,
    requestPaymentFail,
    requestLogin,
    requestLoginSuccess,
    requestLoginFail,
} from './actions';
import C from './action-constants';
import { alertify } from 'fancyutils'

export function fetchCheckout(sellerId) {
    return (dispatch, getState) => {
        const state = getState();
        const {appContext:{convert_currency}} = state;
        
        dispatch(requestCheckout());
        const options = {payment_gateway: convert_currency?18:6, storefront: sellerId };
        $.post(`/rest-api/v1/checkout`, options)
            .then(checkout => {
                dispatch(loadCheckout(checkout));
            })
            .fail(failureXHR => {
                dispatch(requestCheckoutFail());
                if (failureXHR.status === 404) {
                    alertify.alert("This page is not available. Please try again later.");
                } else if (failureXHR.status >= 500) {
                    alertify.alert("There was an error while opening the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                }
            });
    };
}

export function updateCheckout(sellerId, options) {
    return (dispatch/*, getState*/) => {
        // var state = getState();
        
        if('apply_coupon' in options){
            dispatch(applyCoupon());
            try {
                if (window.ga && window.uses_tracking) {
                    window.ga('send', 'event', {
                        eventCategory: 'UserAction',
                        eventAction: 'ApplyCoupon',
                        eventLabel: options['coupon_code'],
                    });
                }
            } catch(e) {
                console.error(e);
            }
        }else{
            dispatch(requestCheckout());
        }
        
        let _options = { storefront: sellerId };
        for( let k in options){
            _options[k] = options[k];
        }

        $.ajax({
                url:'/rest-api/v1/checkout', 
                method:'PUT',
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(_options),
                processData : false,
            })
            .then(checkout => {
                if('apply_coupon' in options && checkout.error){
                    dispatch(applyCouponFail(checkout.error));
                }else{
                    dispatch(loadCheckout(checkout));
                }
            })
            .fail(failureXHR => {
                dispatch(requestCheckoutFail());
                if (failureXHR.status === 404) {
                    alertify.alert("This page is not available. Please try again later.");
                } else if (failureXHR.status === 400 || failureXHR.status >= 500) {
                    alertify.alert(failureXHR.responseJSON.message || "There was an error while update the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                }
            });
    };
}

export function addAddress(sellerId, address) {
    return (dispatch, getState) => {
        var state = getState();
        
        let _address = { is_default: false };
        for( let k in address){
            _address[k] = address[k];
        }
        if( !_address.alias) _address.alias = _address.full_name;

        if( state.appContext.guestCheckout ){
            store.dispatch((dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {address:address}}) } );
            return;
        }

        $.ajax({
                url:'/rest-api/v1/addresses/', 
                method:'POST',
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(_address),
                processData : false,
            })
            .then(address => {
                store.dispatch(updateCheckout( window.seller.id, {address_id:address.id} ));
                try {
                    if (window.ga && window.uses_tracking) {
                        ga('send', 'event', {
                            eventCategory: 'UserAction',
                            eventAction: 'AddAddress',
                        });
                    }
                } catch(e) {
                    console.error(e);
                }
            })
            .fail(failureXHR => {
                if (failureXHR.status === 404) {
                    alertify.alert("This page is not available. Please try again later.");
                } else if (failureXHR.status === 400 || failureXHR.status >= 500) {
                    alertify.alert(failureXHR.responseJSON.message || "There was an error while update the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                }
            });
    };
}

export function completeOrder(checkoutId, data, payment_data, callback) {
    return (dispatch, getState) => {
        var state = getState();

        dispatch(requestPayment());
        
        $.ajax({
                url:'/rest-api/v1/checkout', 
                method:'PUT',
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(data),
                processData : false,
            })
            .then(checkout => {
                $.ajax({
                    type : 'POST',
                    url  : '/rest-api/v1/checkout/payment/'+checkoutId,
                    contentType: "application/json; charset=utf-8",
                    data : JSON.stringify(payment_data),
                    processData : false,
                    success  : function(order){
                        dispatch(requestPaymentSuccess(order, payment_data));
                        $(window).scrollTop(0);
                        try {
                            if (window.ga && window.uses_tracking) {
                                window.ga('send', 'event', {
                                    eventCategory: 'UserAction',
                                    eventAction: 'CompleteOrder',
                                });
                            }
                        } catch(e) {
                            console.error(e);
                        }
                    }
                }).fail(function(xhr) {
                    if(xhr.responseJSON && xhr.responseJSON.error) {
                        alertify.alert(xhr.responseJSON.error);
                    } else {
                        alertify.alert("Order failed. Please try again");
                    }
                    dispatch(requestPaymentFail());
                }).always(function() {
                    if (callback) callback()
                });
            })
            .fail(failureXHR => {
                if (failureXHR.status === 404) {
                    alertify.alert("This page is not available. Please try again later.");
                } else if (failureXHR.status === 400 || failureXHR.status >= 500) {
                    alertify.alert(failureXHR.responseJSON.message || "There was an error while update the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                }
                dispatch(requestPaymentFail());
                if (callback) callback()
            });
    };
}

export function updateCurrencyContext(newContext) {
    return (dispatch, getState) => {
        newContext.type = C.UPDATE_CURRENCY_CONTEXT;
        dispatch(newContext);
    };
}

export function formatPrice(amount) {
    var newPrice = amount.toFixed(2) + '';
    var regex = /(\d)(\d{3})([,\.]|$)/;
    while (regex.test(newPrice)) {
        newPrice = newPrice.replace(regex, '$1,$2$3');
    }
    if (window.numberType === 2) {
        newPrice = newPrice.replace(/,/g, ' ').replace(/\./g, ',');
    }
    return newPrice;
}

function requestCurrencyConversion(nextCode, nextPrice, callback) {
    const shouldConvert = !(nextCode == null || callback == null);
    if (shouldConvert) {
        if (window.numberType === 2) {
            nextPrice = nextPrice.replace(/,/g, '.').replace(/ /g, '');
        }
        if (_.isString(nextPrice)) {
            nextPrice = nextPrice.replace(/,/g, '');
        }
        $.ajax({
            url: '/convert_currency.json',
            type: 'GET',
            dataType: 'json',
            data: {
                amount: nextPrice,
                currency_code: nextCode
            }
        })
        .fail(() => {
            alertify.alert('Convert currency is unavailable. please try again.')
        })
        .success(({ error, amount, currency } = {}) => {
            if (amount == null) {
                alertify.alert(error || 'Convert currency is unavailable. please try again.')
                return;
            }
            callback(currency.code, formatPrice(amount), currency.symbol);
        });
    }
}


function _convertCurrency(nextCode, nextPrice, force) {
    return (dispatch, getState) => {
        const { currencyContext, appContext:{convert_currency}, checkout } = getState();
        const currency = convert_currency && checkout.data.currency || {code:'USD'};
        if (nextCode !== currency.code) {
            if (force ||                                 // FIXME: unable to comparison since price update comes first (SaleitemSidebarHead.componentWillReceiveProps())
                currencyContext.price !== nextPrice ||       // currency price changed
                currencyContext.currencyCode !== nextCode || // currency code changed
                currencyContext.currencyMoney == null ||     // currency symbol/money is not set (changed from usd)
                currencyContext.currencySymbol == null
            ) {
                nextPrice = nextPrice || currencyContext.price || '0.00'
                requestCurrencyConversion(
                    nextCode,
                    nextPrice,
                    (currencyCode, currencyMoney, currencySymbol) => {
                        if (typeof currencyMoney === 'number') {
                            currencyMoney = currencyMoney.toFixed(2);
                        }
                        currencyMoney = currencyMoney.replace(/[ \.]00$/,'');
                        dispatch(updateCurrencyContext({
                            currencyCode,
                            currencyMoney,
                            currencySymbol
                        }));
                    }
                );
            } else {
                // NOOP
            }
        } else {
            dispatch(updateCurrencyContext({
                currencyCode: currency.code,
                currencyMoney: null,
                currencySymbol: null
            }));
        }
    }
}

export function convertCurrency(nextCode, nextPrice, force) {
    store.dispatch(_convertCurrency(nextCode, nextPrice, force));
}


export function doLogin(data) {
    return (dispatch, getState) => {
        const state = getState();
        const {appContext: {seller, has_own_users, domain_with_checkout}} = state;
        let loginUrl;

        if(has_own_users){
            loginUrl = '_login.json';
        }else{
            loginUrl = '/login.json';
        }

        dispatch(requestLogin());

        
        $.ajax({
                url:loginUrl, 
                method:'POST',
                contentType: "application/x-www-form-urlencoded",
                data : data,
            })
            .then(result => {
                if( result.status_code == 0 ){
                    alertify.alert(result.message || 'Login Failed. please try again.');
                }else{
                    if(has_own_users){
                        location.reload();
                    }else{
                        $.get('/rest-api/v1/users/me', function(result){
                            dispatch(requestLoginSuccess(result));
                            store.dispatch(fetchCheckout(window.seller.id));
                        })
                    }
                }
            })
            .fail(failureXHR => {
                if (failureXHR.status === 404) {
                    alertify.alert("This page is not available. Please try again later.");
                } else if (failureXHR.status >= 500) {
                    alertify.alert("There was an error while update the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                }
            });
    };
}

export function doSignup(data) {
    return (dispatch, getState) => {
        var state = getState();
        const {appContext: {seller, has_own_users, domain_with_checkout}} = state;
        let signupUrl, params = {};

        (['email', 'password']).forEach(function(v){
            params[v] = data[v];
        })

        if(has_own_users){
            (['fullname', 'username']).forEach(function(v){
                params[v] = data[v];
            })
            signupUrl = '_signup.json';
        }else{
            signupUrl = '/email_signup.json';
        }


        dispatch(requestLogin());
        
        $.ajax({
                url:signupUrl, 
                method:'POST',
                contentType: "application/x-www-form-urlencoded",
                data : params,
            })
            .then(result => {
                if( result.status_code == 0 ){
                    alertify.alert(result.message || 'Signup Failed. please try again.');
                }else{
                    if(has_own_users){
                        location.reload();
                    }else{
                        $.get('/rest-api/v1/users/me', function(result){
                            dispatch(requestLoginSuccess(result));
                            store.dispatch(fetchCheckout(window.seller.id));
                        })
                    }
                }
            })
            .fail(failureXHR => {
                if (failureXHR.status === 404) {
                    alertify.alert("This page is not available. Please try again later.");
                } else if (failureXHR.status >= 500) {
                    alertify.alert("There was an error while update the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                }
            });
    };
}

export function doLogout() {
    return (dispatch, getState) => {
        const state = getState();
        const {appContext: {seller, has_own_users, domain_with_checkout}} = state;
        let logoutUrl;

        if(has_own_users){
            location.href = 'logout';
            return;
        }else{
            logoutUrl = '/logout.json';
        }

        dispatch(requestLogin());

        $.ajax({
                url:logoutUrl, 
                method:'GET'
            })
            .then(result => {
                location.reload();
            });
    };
}


