import C from './action-constants';

// Action on requesting checkout starts
export function requestCheckout(pendingID) {
    return {
        type: C.REQUEST_CHECKOUT,
        status: 'request',
        pendingID
    };
}

// Action on requesting checkout fails
export function requestCheckoutFail() {
    return {
        type: C.REQUEST_CHECKOUT_FAILURE,
        status: 'failed'
    };
}

// action on loading request result
export function loadCheckout(data) {
    return {
        type: C.LOAD_CHECKOUT,
        status: 'idle',
        data
    };
}

export function updateAppContext(contextObject) {
    return {
        type: C.UPDATE_APP_CONTEXT,
        context: contextObject
    };
}

// Action on requesting checkout starts
export function applyCoupon() {
    return {
        type: C.APPLY_COUPON,
        status: 'applyCoupon'
    };
}

// Action on requesting checkout fails
export function applyCouponFail(message) {
    return {
        type: C.APPLY_COUPON_FAILURE,
        status: 'applyCouponFailed',
        message: message
    };
}

// Action on requesting checkout starts
export function requestPayment() {
    return {
        type: C.REQUEST_PAYMENT,
        status: 'requestPayment'
    };
}

export function requestPaymentSuccess(data, paymentData) {
    return {
        type: C.REQUEST_PAYMENT_SUCCESS,
        status: 'requestPaymentSuccess',
        data,
        paymentData
    };
}

// Action on requesting checkout fails
export function requestPaymentFail(message) {
    return {
        type: C.REQUEST_PAYMENT_FAILURE,
        status: 'requestPaymentFailed',
        message: message
    };
}

// Action on requesting checkout starts
export function requestLogin() {
    return {
        type: C.REQUEST_LOGIN,
        status: 'requestLogin'
    };
}

export function requestLoginSuccess(data, paymentData) {
    return {
        type: C.REQUEST_LOGIN_SUCCESS,
        status: 'requestLoginSuccess',
        data,
    };
}

// Action on requesting checkout fails
export function requestLoginFail(message) {
    return {
        type: C.REQUEST_LOGIN_FAILURE,
        status: 'requestLoginFailed',
        message: message
    };
}