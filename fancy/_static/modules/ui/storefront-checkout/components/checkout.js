import React, { Component } from "react";
import { connect } from "react-redux";
import store from '../store/store';
import { completeOrder } from '../action/action-helpers';
import C from '../action/action-constants';

import { About } from "./about";
import { Summary } from "./summary";
import { Shipping } from "./shipping";
import { Paypal } from "./paypal";
import { Payment } from "./payment";
import { Complete } from "./complete";

function mapStateToProps(state) {
    var { appContext, checkout: { data, isFetching, status, message }, order, currencyContext} = state;

    return {
        appContext,
        status,
        checkout: data,
        order: order,
        isFetching,
        message,
        currencyContext
    };
}

// Container class for checkout.
export class StorefrontCheckout extends Component {
    render() {
        const { appContext: { viewer, seller } } = this.props;

        var display = null;
        display = (
            <div id="container">
                <div>
                    <Checkout {...this.props} />
                </div>
            </div>
        );

        return display;
    }
}

export default connect(mapStateToProps)(StorefrontCheckout);

class Checkout extends Component {
    
    handleProceedStart = (e) => {
        e.preventDefault();
        store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'shipping'}}) });
        $(window).scrollTop(0);
    }

    handleProceedToPayment = (e) => {
        e.preventDefault();
        store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'payment'}}) });
        $(window).scrollTop(0);
        try {
            if (window.ga && window.uses_tracking) {
                ga('send', 'event', {
                    eventCategory: 'UserAction',
                    eventAction: 'ProceedToPayment',
                });
            }
        } catch(e) {
            console.error(e);
        }
    }
    
    orderLock = false
    handleOrderComplete = (e) => {
        e.preventDefault();
        if (this.orderLock) {
            return;
        }
        this.orderLock = true
        const { appContext: {seller, guestCheckout, guestEmail, guestCard, address, gift_info, note_info, personalizations }, checkout } = this.props;
        let data = {storefront: seller.id, note_info:{}, gift_info:{}, personalizations:''};
        let payment_data = {payment_gateway: checkout.payment_gateway, ordered_via:'storefront', usesandbox: window.usesandbox};

        
        if(checkout.payment_gateway == 9){
            payment_data.payment_gateway = 9;
            payment_data.payerId = checkout.extra_info.paypal_payer_id;
            payment_data.paymentId = checkout.extra_info.paypal_payment_id;
        }else if(this.payment && this.payment.state.useBitcoin){
            payment_data.payment_gateway = 21;
            payment_data.payment_id = this.payment.state.bitpayInvoiceId;
            if(guestCheckout){
                data.email = guestEmail;
                data.shipping_addr = address;
                payment_data.guest_checkout_web = true;
            }
        }else if(guestCheckout){
            data.email = guestEmail;
            data.shipping_addr = address;
            payment_data.card_token = guestCard.token;
            payment_data.billing_addr = JSON.stringify(guestCard.address);
        }else{
            data.payment_id = this.payment.state.cardId;
            payment_data.payment_id = this.payment.state.cardId;
        }
        if (checkout.antavo && checkout.antavo.max_points>0) {
            payment_data.antavo_points = checkout.antavo.max_points;
        }
        
        data.note_info[seller.id] = note_info;
        data.gift_info[seller.id] = gift_info;
        data.personalizations = personalizations;
        
        store.dispatch(completeOrder( this.props.checkout.id, data, payment_data, () => {
            this.orderLock = false;
        } ));
    }

    componentDidUpdate(){
        const { appContext: { viewer, seller, loggedIn, loading, guestCheckout, step }, checkout, order: {order}, status, message } = this.props;
        if( step != 'complete' && order && order.orders && order.orders.length > 0){
            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'complete'}}) });
        }else if( !order && step != 'paypal' && checkout && checkout.payment_gateway == 9){
            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'paypal'}}) });
        }
    }

    render() {
        const { appContext: { viewer, seller, loggedIn, loading, guestCheckout, step }, checkout, order: {order}, status, message } = this.props;

        let currentComponent;
        if ( step == 'complete' ){
            currentComponent = <Complete {...this.props} ref={(complete) => { this.complete = complete; }}/>;  
        } else if(step == 'paypal'){
            currentComponent = <Paypal {...this.props} handleOrderComplete={this.handleOrderComplete}  ref={(paypal) => { this.paypal = paypal; }}/>;
        } else if(step == 'shipping') {
            currentComponent = <Shipping {...this.props} handleProceedToPayment={this.handleProceedToPayment} ref={(shipping) => { this.shipping = shipping; }}/>;
        } else if(step == 'payment'){
            currentComponent = <Payment {...this.props} handleOrderComplete={this.handleOrderComplete} handleProceedStart={this.handleProceedStart} ref={(payment) => { this.payment = payment; }}/>;
        }

        return (
            <div className={loading?'loading':''}>
                {!loading && 
                    <div>
                        <About {...this.props} />
                        <Summary {...this.props} parent={this} ref={(summary) => { this.summary = summary; }}/>
                        <div id="checkout">
                            {currentComponent}
                        </div>
                    </div>
                }
            </div>
        );
    }
}
