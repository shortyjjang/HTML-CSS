import React, { Component } from "react";
import classnames from 'classnames';
import store from '../store/store';
import { updateCheckout, doLogout } from '../action/action-helpers';
import C from '../action/action-constants';


export class UserInfo extends Component {
    state = {
        'email':'',
        touched: {
            email: false
        }
    }

    isValid = () => {
        const errors = this.validate();
        let isValid = true;
        let touched = this.state.touched;
        for( let k in errors){
            if( errors[k] ){
                isValid = false;
                touched[k] = true;
            }
        }
        this.setState({touched: touched});
        return isValid;
    }

    validate = () => {
      return {
        email: this.state.email.length === 0
      };
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });

        this.handleChange(evt);
    }

    handleChange = (evt) => {
        const { appContext: { seller, viewer, loggedIn, guestCheckout}, checkout } = this.props;
        const name = $(evt.currentTarget).attr('name'), val = $(evt.currentTarget).val();

        this.setState({
            [name]: val
        });

        if( name=='email' && guestCheckout ){
            if(this.isValid() ){
                store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {guestEmail:this.state.email}}) });
            }
        }
    }

    clickLogin = (event) => {
        const { appContext: { seller, viewer, loggedIn, guestCheckout, guestEmail, gift_info, note_info}, checkout } = this.props;
        location.href = "/"+seller.username+"/login?new&next="+encodeURIComponent(location.pathname+location.search);
    }

    handleLogout = (event) => {
        event.preventDefault();
        store.dispatch(doLogout());
    }

    componentDidMount(){
        const { isFetching, appContext: { seller, viewer, loggedIn, guestCheckout, guestEmail, gift_info, note_info}, checkout } = this.props;
        if(guestEmail) this.setState({email : guestEmail})

        if(window.paypal_api ){
            paypal.Button.render({
                env: window.paypal_env, style: { size: 'responsive', shape: 'rect', color: 'silver' },
                payment: function(resolve, reject) {
                  var data = { "payment_gateway": 9, "storefront": window.seller.id, 'paypal': 'true'};
                  if(window.paypal_env=='sandbox') data.paypal_sandbox = 'true';
                  $.ajax({ 
                        type: "POST", url: "/rest-api/v1/checkout", 
                        data: data,
                        success: function(json) {
                            var paymentId = json.extra_info.paypal_payment_id;
                            resolve(paymentId);
                        }, 
                        error: function(jqXHR, textStatus, errorThrown) {
                            var msg = "Server Error";
                            try {
                                var json = JSON.parse(jqXHR.responseText);
                                msg = json.error || "Server Error";
                            } catch (e) {
                            }
                            reject(msg);
                            alertify.alert(msg);
                            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'shipping'}}) });
                        }
                    });
                },
                onAuthorize: function(data) {
                    store.dispatch(updateCheckout( window.seller.id, {payerId:data.payerID, paymentId:data.paymentID, token:data.paymentToken} ));
                    store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'paypal'}}) });
                },
                onCancel: function(data){
                    var data = { "payment_gateway": checkout.payment_gateway, "storefront": window.seller.id};
                    $.ajax({ 
                        type: "POST", url: "/rest-api/v1/checkout", 
                        data: data,
                        success: function(json) {
                            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'shipping'}}) });
                        }
                    });
                },
                onError: function(data){
                    var data = { "payment_gateway": checkout.payment_gateway, "storefront": window.seller.id};
                    $.ajax({ 
                        type: "POST", url: "/rest-api/v1/checkout", 
                        data: data,
                        success: function(json) {
                            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'shipping'}}) });
                        }
                    });
                }
              }, '#paypal-button');
        }
    }

    render() {
        const { isFetching, appContext: { seller, viewer, loggedIn, convert_currency, guestCheckout, has_own_users, domain_with_checkout, gift_info, note_info}, checkout } = this.props;        
        const { email } = this.state;
        const showPaypal = window.paypal_api;
        const errors = this.validate();

        const shouldMarkError = (field) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];

            return hasError ? shouldShow : false;
        };

        return (
            <div className="step customer-info">
                <h2>Customer information</h2>
                { loggedIn && 
                    <div className="userinfo">
                        <span className="avatar" style={{backgroundImage: `url(${viewer.user_square_image_small})`}} ></span>
                        <label>SIGNED IN AS</label>
                        {viewer.fullname} <a href="#" onClick={this.handleLogout}>NOT YOU?</a>
                    </div>
                    ||
                    <fieldset className="frm">
                        <p>
                            <label className="label">Email address</label>
                            <span className="account">Already have an account? <a href="#" onClick={this.clickLogin}>Log in</a></span>
                            <input type="text" name="email" className={classnames("text", { error: shouldMarkError('email') })}  value={email} onChange={this.handleChange} onBlur={this.handleBlur('email')} />
                        </p>
                    </fieldset>
                }
                { showPaypal && <div id="paypal-button"></div>}
            </div>
        );
    }
}
