import React, { Component } from "react";
import classnames from 'classnames';

import store from '../store/store';
import { updateCheckout, addAddress } from '../action/action-helpers';
import C from '../action/action-constants';
import { Loading } from "./loading";


export class Paypal extends Component {
    state = { isGift:false};
    
    handleClickShippingOption = (event) => {
        const { appContext: {guestCheckout} } = this.props
        const $li = $(event.currentTarget), shippingOption = $li.find("input[name=shipping_opt]").val();
        let shipping_option = {}
        shipping_option[window.seller.id] = parseInt(shippingOption) ;

        if( $li.hasClass('selected') ) return;

        store.dispatch(updateCheckout( window.seller.id, {shipping_option: shipping_option } ));
    }

    handleClickGift = (event) => {
        const isGift = event.currentTarget.checked;
        this.setState({isGift: isGift}) ;
    }

    handleOrderComplete = (event) => {
        this.props.handleOrderComplete(event);
    }

    handleGiftChange = (event) => {
        const $this = $(event.target), val = $this.val();
        let gift_info = {};
        if( this.state.isGift ){
            gift_info = {is_gift: true, gift_message: val||'' };
        }else{
            gift_info = { is_gift: false, gift_message: ''};
        }
        store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {gift_info:gift_info}}) });
    }

    handleNoteChange = (event) => {
        const $this = $(event.target), val = $this.val();
        store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {note_info:val}}) });
    }

    handleProceedToPayment = (event) => {
        const { appContext: { seller, viewer, loggedIn, guestCheckout}, checkout } = this.props;        
        const sellerCart = checkout.sale_items_freeze && checkout.sale_items_freeze[ seller.id ] || {};
        const isAvailable = sellerCart.checkout_available;
        if(!isAvailable){
            let message = "";
            sellerCart.items.forEach(function(item){
                if( !item.available ){
                    message += item.title + " : " +item.error.message;
                }
            })
            alertify.alert(message)
        }
        this.props.handleProceedToPayment(event);
    }

    componentDidMount() {
        const { checkout } = this.props;
        if (checkout.payment_gateway != 9) {
            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {step:'shipping'}}) });
        }
    }

    render() {
        const { isFetching, appContext: { seller, viewer, loggedIn, guestCheckout, gift_info, note_info}, checkout } = this.props;        
        const sellerCart = checkout.sale_items_freeze && checkout.sale_items_freeze[ seller.id ] || {};
        const addresses = checkout.shipping_info.addresses;
        const shippingOptions = sellerCart.shipping_options || [];
        const isAvailable = sellerCart.checkout_available;
        const { isGift, showNewAddress } = this.state;
        let address;
        addresses.forEach(function(v){
            if( v.id == checkout.sale_items_freeze[seller.id].shipping_addr_id ) address = v;
        })
        
        return (
            <div className={classnames('step','shipping',{loading:isFetching})}>
                <h2>Buy with Paypal</h2>
                <h2><em>1</em> Shipping address</h2>
                { loggedIn && 
                    <div className="userinfo">
                        <span className="avatar" style={{backgroundImage: `url(${viewer.user_square_image_small})`}} ></span>
                        <label>SIGNED IN AS</label>
                        {viewer.fullname} <a href="#">NOT YOU?</a>
                    </div>
                    || 
                    <div className="userinfo">
                        <label>Have a Store account?</label>
                        <a href="#">Click here to sign in.</a>
                    </div>
                }
                <div className="saved">
                    <ul className="select_option">
                        <li className="selected">
                            <input type="radio" name="shipping_ads" checked={true} />
                            <label>
                                {address.full_name}
                                <small>{address.address1}{address.address2?' '+address.address2:''}, {address.city}{address.state?', '+address.state:''}, {address.country_name}, {address.zip}</small>
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="options">
                    <h3>Shipping options</h3>
                    <ul className="select_option">
                        {shippingOptions.map((shipping, index) => {
                            return (
                                <li className={ shipping.id == sellerCart.shipping_selected ? "selected":""} onClick={this.handleClickShippingOption}><input type="radio" name="shipping_opt" checked={ shipping.id == sellerCart.shipping_selected }  id={"opt_"+shipping.label} value={shipping.id}/>
                                <label htmlFor="opt_{shipping.label}">
                                    {shipping.label}
                                    <small>{shipping.detail}</small>
                                    <strong>${shipping.amount}</strong> 
                                </label></li>
                            );
                        })}
                    </ul>
                </div>
                <div className="note">
                    <h3>Order Notes</h3>
                    <fieldset className="frm">
                        <p><input type="checkbox" id="order_gift" onClick={this.handleClickGift} checked={isGift} /> <label htmlFor="order_gift">This Order is a Gift</label></p>
                        {isGift &&
                            <p className="gift-note"><label className="label">Gift Note</label>
                            <textarea onChange={this.handleGiftChange} onBlur={this.handleGiftChange} value={gift_info.gift_message}></textarea></p>
                        }
                        <p><label className="label">Note for {seller.brand_name}</label>
                        <textarea onChange={this.handleNoteChange} onBlur={this.handleNoteChange} value={note_info} ></textarea></p>
                    </fieldset>
                </div>
                <button className="submit" disabled={!isAvailable} onClick={this.handleOrderComplete}>Complete Order</button>
                {isFetching && 
                    <Loading />
                    || []
                }
            </div>
        );
    }
}
