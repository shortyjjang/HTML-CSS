import React, { Component } from "react";
import classnames from 'classnames';
import store from '../store/store';
import { updateCheckout } from '../action/action-helpers';
import C from '../action/action-constants';


export class Payment extends Component {
    state = { 
        showNewCard: false, cardId: null, useBitcoin: false, 
        bitpayInvoiceId: null, requestingBitpayInvoice: false,
    };

    constructor(props) {
        super(props);
        this.stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
    }

    handleClickCreditCard = (event) => {
        const $li = $(event.currentTarget), cardId = $li.find("input[name=payment_method]").val();

        if( $(event.target).is(".btn-delete") ) return;

        if( $li.hasClass('selected') ) return;
        if( cardId == 'new'){
            this.setState({showNewCard: true, cardId: null, useBitcoin:false});
        }else if(cardId == "bitcoin"){
            this.setState({showNewCard: false, cardId: null, useBitcoin:true});
        }else{
            this.setState({showNewCard: false, cardId: cardId, useBitcoin:false});
        }
    }

    handleRemoveCreditCard = (event) => {
        const $li = $(event.currentTarget).closest('li'), $list = $li.closest('ul'), cardId = $li.find("input[name=payment_method]").val();
        var original_labels = alertify.labels;
        alertify.set({
                labels: {
                    ok     : "Delete",
                    cancel : "Cancel"
                }
            });
        alertify.confirm("Are you sure you want to delete this payment method?", function(e){
            if(e){
                $.ajax({
                    url:'/rest-api/v1/payment/credit_cards/'+cardId, 
                    method:'DELETE',
                    contentType: "application/json; charset=utf-8",
                    data : JSON.stringify({payment_type:'stripe'}),
                    processData : false,
                })
                .then(card => {
                    $li.remove();
                    if(window.use_bitcoin)
                        $list.find("li:eq(1)").trigger('click');
                    else
                        $list.find("li:eq(0)").trigger('click');
                })
                .fail(failureXHR => {
                    if (failureXHR.status === 404) {
                        alertify.alert("This page is not available. Please try again later.");
                    } else if (failureXHR.status >= 500) {
                        alertify.alert("There was an error while update the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                    }
                })
            }
        });
        alertify.set({labels: original_labels})
        
    }

    handleOrderComplete = (event) => {
        const { appContext : {guestCheckout, guestEmail}, checkout } = this.props;
        const that = this;

        if( this.state.useBitcoin){
            let bitpay_invoice_check_timer = null, params={};
            const handlePostMessage = function(event){
                if (event.data.status == "paid" || event.data.status == "confirmed" || event.data.status == "complete") {
                    bitpay.paid = true;
                }else if(event.data == "close"){
                    that.setState({requestingBitpayInvoice: false});
                }
            }
            const clear_bitpay_invoice_check_timer = function() {
                if (bitpay_invoice_check_timer) {
                    clearTimeout(bitpay_invoice_check_timer);
                    bitpay_invoice_check_timer = null;
                }
            }
            const check_bitpay_invoice_paid = function() {
                clear_bitpay_invoice_check_timer();
                if (bitpay.paid) {
                    that.props.handleOrderComplete(event);
                } else {
                    $.get('/rest-api/v1/checkout/' + checkout.id + '/bitpay/invoice', function(resp) {
                        var status = resp.invoice.status;
                        if (status == 'paid' || status == 'confirmed' || status == 'complete') {
                            bitpay.paid = true;
                        } 
                    })
                    bitpay_invoice_check_timer = setTimeout(check_bitpay_invoice_paid, 3000);
                }
            }

            if(guestCheckout){
                params.email = guestEmail;
            }

            this.setState({requestingBitpayInvoice: true});

            $.post('/rest-api/v1/checkout/' + checkout.id + '/bitpay/invoice', params, function(resp) { 
                var invoice = resp.invoice;
                if (invoice) {

                    that.setState({bitpayInvoiceId:invoice.invoice_id});
                    window.removeEventListener("message", handlePostMessage, false); 
                    bitpay.enableTestMode(invoice.testmode);
                    bitpay.showInvoice(invoice.invoice_id);

                    bitpay.onModalWillEnter(function() {
                        check_bitpay_invoice_paid();
                    });
                    
                    bitpay.onModalWillLeave(function() {
                    if (!bitpay.paid) {
                        clear_bitpay_invoice_check_timer();
                    }
                    })
                    
                    window.addEventListener("message", handlePostMessage, false);
                }else{
                    that.setState({requestingBitpayInvoice: false});
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.responseText) {
                    try {
                        var message = JSON.parse(jqXHR.responseText);
                        alertify.alert(message.error);
                    } catch(err) {
                        console.log(err);
                    }
                }
                that.setState({requestingBitpayInvoice: false});
            })
        }else if( guestCheckout ){
            if( this.newCard.isValid() ) {
                this.addGuestCreditCard(this.newCard.cardElement, this.newCard.state, ()=>this.props.handleOrderComplete(event) );
            }else{
                alertify.alert('Please enter valid payment information.');
                return;
            }
        }else if( this.state.showNewCard ){
            if( this.newCard.isValid() ) {
                this.addCreditCard(this.newCard.cardElement, this.newCard.state, ()=>this.props.handleOrderComplete(event) );
            }else{
                alertify.alert('Please enter valid payment information.');
                return;
            }
        }else{
            this.props.handleOrderComplete(event);
        }
    }

    handlePrev = (event) => {
        const { isFetching, appContext: { seller, viewer, loggedIn, guestCheckout}, checkout, status, message } = this.props;        
        const { showNewCard, cardId } = this.state;
        const newCard = this.newCard && this.newCard.state;
        if(guestCheckout && showNewCard){
            store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {newCard:newCard}}) });
        }
        this.props.handleProceedStart(event);
    }

    addCreditCardLock = false;
    addCreditCard = (cardElement, card, success) => {
        const self = this;
        if (this.addCreditCardLock) {
            return;
        }
        this.addCreditCardLock = true
        const { appContext: { seller, countries }, checkout } = this.props;
        const addresses = checkout.shipping_info && checkout.shipping_info.addresses || [];
        const sellerCart = checkout.sale_items_freeze && Object.keys(checkout.sale_items_freeze).length > 0 && checkout.sale_items_freeze[ Object.keys(checkout.sale_items_freeze)[0] ] || {};
        let shippingAddress;
        addresses.forEach(function(v){
            if( v.id == sellerCart.shipping_addr_id ) shippingAddress = v;
        })

        if(!card.showNewBillingAddress){
            card.address1 = shippingAddress.address1;
            card.address2 = shippingAddress.address2
            card.country = shippingAddress.country;
            card.state = shippingAddress.state;
            card.city = shippingAddress.city;
            card.postal_code = shippingAddress.zip;
        }

        let stripe_attrs = {
            name : card.card_holder_name, 
            address_line1 : card.address1,
            address_line2 : card.address2,
            address_city : card.city,
            address_state : card.state,
            address_country  : card.country,
            address_zip : card.postal_code
        };

        this.stripe.createToken(cardElement, stripe_attrs).then(function(result) {
            if (result.error) {
                self.addCreditCardLock = false;
                if ('message' in result.error) alertify.alert(result.error.message);
                else alertify.alert("Please enter valid payment information.");
            } else {
                const token = result.token;
                let card_attrs = {
                    card_token : token.id,
                    address1 : card.address1,
                    address2 : card.address2,
                    country : card.country,
                    city : card.city,
                    state : card.state,
                    postal_code : card.postal_code,
                    payment_type : 'stripe',
                }
                $.ajax({
                    url:'/rest-api/v1/payment/credit_cards/', 
                    method:'POST',
                    contentType: "application/json; charset=utf-8",
                    data : JSON.stringify(card_attrs),
                    processData : false,
                })
                .then(card => {
                    self.setState({cardId: card.id});
                    success();
                })
                .fail(failureXHR => {
                    alertify.alert("There was an error while update the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                })
                .always(function () {
                    self.addCreditCardLock = false;
                })
            }
        });
    }

    addGuestCreditCard = (cardElement, card, success) => {
        const self = this;
        if (this.addCreditCardLock) {
            return;
        }
        this.addCreditCardLock = true
        const { appContext: { seller, countries, address }, checkout } = this.props;
        const addresses = checkout.shipping_info && checkout.shipping_info.addresses || [];
        let shippingAddress = address;

        if(!card.showNewBillingAddress){
            card.address1 = shippingAddress.address1;
            card.address2 = shippingAddress.address2
            card.country = shippingAddress.country;
            card.state = shippingAddress.state;
            card.city = shippingAddress.city;
            card.postal_code = shippingAddress.zip;
        }

        let stripe_attrs = {
            name : card.card_holder_name, 
            address_line1 : card.address1,
            address_line2 : card.address2,
            address_city : card.city,
            address_state : card.state,
            address_country  : card.country,
            address_zip : card.postal_code
        };

        let billingAddress = {
            full_name: card.card_holder_name,
            address1 : card.address1,
            address2 : card.address2,
            city : card.city,
            state : card.state,
            country : card.country,
            postal_code : card.postal_code,
        }

        this.stripe.createToken(cardElement, stripe_attrs).then(function(result) {
            self.addCreditCardLock = false;
            if (result.error) {
                if ('message' in result.error) alertify.alert(result.error.message);
                else alertify.alert("Please enter valid payment information.");
            } else {
                store.dispatch((dispatch, getState) => {
                    dispatch({type: C.UPDATE_APP_CONTEXT, context: {guestCard : {
                        token: result.token.id, address: billingAddress, 
                        card_holder_name: result.token.card.name, card_type: result.token.card.brand, card_last_digits: result.token.card.last4,
                    }} });
                });
                success();
            }
        });
    }

    componentDidMount(){
        const { isFetching, appContext: { seller, viewer, loggedIn, guestCheckout}, checkout } = this.props;
        const sellerCart = checkout.sale_items_freeze && Object.keys(checkout.sale_items_freeze).length > 0 && checkout.sale_items_freeze[ Object.keys(checkout.sale_items_freeze)[0] ] || {};
        
        const credit_cards = sellerCart.credit_cards && sellerCart.credit_cards.cards || [];
        if(guestCheckout || !credit_cards.length){
            this.setState({showNewCard:true});
        }
        let defaultCard = null
        credit_cards.forEach(function(card){
            if(card.is_primary) defaultCard = card;
        })
        if(!defaultCard && credit_cards[0]) defaultCard = credit_cards[0];
        if(defaultCard) this.setState({cardId: defaultCard.id});  

        store.dispatch( (dispatch, getState) => { dispatch({type: C.UPDATE_APP_CONTEXT, context: {}}) });
    }

    render() {
        const { isFetching, appContext: { seller, viewer, loggedIn, guestCheckout}, checkout, status, message } = this.props;        
        const { showNewCard, cardId, useBitcoin, requestingBitpayInvoice } = this.state;
        const sellerCart = checkout.sale_items_freeze && Object.keys(checkout.sale_items_freeze).length > 0 && checkout.sale_items_freeze[ Object.keys(checkout.sale_items_freeze)[0] ] || {};
        const credit_cards = sellerCart.credit_cards && sellerCart.credit_cards.cards || [];
        const isAvailable = sellerCart.checkout_available;
        const isOrderSubmitted = status == 'requestPayment' && isFetching || requestingBitpayInvoice;
        
        return (
            <div id="step2">
                <div className="step payment">
                    <a href="#" className="back" onClick={this.handlePrev}>Back</a>
                    <h2>Payment information</h2>
                    <div className="saved">
                        <ul className="select_option">
                            { window.use_bitcoin &&
                                <li className={ (!showNewCard && useBitcoin)?"selected":""} onClick={this.handleClickCreditCard}>
                                    <input type="radio" id="payment_method_bitcoin" name="payment_method" checked={ (!showNewCard && useBitcoin)?"selected":""} value="bitcoin" />
                                    <label for="payment_method_bitcoin">
                                        <span className="card bitcoin">Bitcoin</span>
                                        Pay with Bitcoin
                                    </label>
                                </li> || []
                            }
                            {credit_cards.map((card, index) => {
                                return (
                                    <li className={ (!showNewCard && !useBitcoin && ( card.id == cardId || (!cardId && card.is_primary) ))?"selected":""} onClick={this.handleClickCreditCard}>
                                    <input type="radio" name="payment_method" checked={!showNewCard && !useBitcoin && (card.id == cardId || (!cardId && card.is_primary) )} id={`payment_method_${card.id}`} value={card.id}/>
                                    <label for={`payment_method_${card.id}`}>
                                        {loggedIn && 
                                        <a href="#" className="btn-delete" onClick={this.handleRemoveCreditCard}></a> || []}
                                        <span className={`card ${card.card_type.toLowerCase()}`}>{card.card_type}</span>
                                        {card.card_holder_name}
                                        <small>Credit Card - {card.card_last_digits}</small>
                                    </label></li>
                                );
                            })}
                            { (window.use_bitcoin || credit_cards.length > 0) &&
                                <li className={ showNewCard?"selected":""} onClick={this.handleClickCreditCard}>
                                <input type="radio" name="payment_method" checked={showNewCard} value="new"/>
                                <label for="payment_method_new">
                                    Use a new payment card
                                </label></li>
                                || []
                            }
                        </ul>
                    </div>
                    { showNewCard &&  
                        <NewCard {...this.props} stripe={this.stripe} ref={(newCard) => { this.newCard = newCard; }}/>
                    }
                </div>
            </div>
        );
    }
}

export class NewCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showNewBillingAddress:false,
            card_complete : false,
            card_error : null,
            card_holder_name : '',
            address1 : '',
            address2 : '',
            country : 'US',
            city : '',
            state : '',
            postal_code : '',
            payment_type : 'stripe',
            touched : {
                name : false,
                card_element : false,
                address1 : false,
                city : false,
                postal_code : false,
            }
        };
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
            card_holder_name: this.state.card_holder_name.length === 0,
            card_element: !this.state.card_complete, 
            address1: this.state.address1.length === 0 && this.state.showNewBillingAddress,
            city: this.state.city.length === 0  && this.state.showNewBillingAddress,
            postal_code: this.state.postal_code.length === 0  && this.state.showNewBillingAddress,
        };
    }

    handleBlur = (field) => (evt) => {
        const name = $(evt.currentTarget).attr('name'), val = $(evt.currentTarget).val();
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    }

    handleChange = (evt) => {
        const name = $(evt.currentTarget).attr('name'), val = $(evt.currentTarget).val();
        this.setState({ [name] : val });
    }

    handleClickAddressType = (event) => {
        const $li = $(event.currentTarget), type = $li.find("input[name=billing_addr]").val();

        if( $li.hasClass('selected') ) return;
        if( type == 'new'){
            this.setState({showNewBillingAddress: true});
        }else{
            this.setState({showNewBillingAddress: false});
        }
    }

    componentDidUpdate(){
    }

    componentDidMount(){
        const { appContext: { seller, countries, states, guestCheckout, address, newCard }, checkout, stripe } = this.props;
        if(guestCheckout && newCard){
            newCard.card_complete = false;
            newCard.card_error = null;
            newCard.touched.card_element = false;
            this.setState(newCard);
        }
        const elements = stripe.elements();
        this.cardElement = elements.create('card', { hidePostalCode: true });
        this.cardElement.mount(this.cardRef);
        this.cardElement.on('change', (change) => {
            this.setState({ 
                touched: { ...this.state.touched,card_element: true },
                card_complete: change.complete ? true : false, 
                card_error: change.error ? change.error.message : null,
            });
            if (change.complete) this.cardHolderNameRef.focus();
        });
        this.cardElement.on('ready', () => { this.cardElement.focus(); });
    }

    componentWillUnmount() {
        if (this.cardElement) {
            this.cardElement.destroy();
            this.cardElement = null;
        }
    }

    render() {
        const { appContext: { seller, countries, states, guestCheckout, address }, checkout } = this.props;
        const { showNewBillingAddress, card_holder_name, address1, address2, country, city, state, postal_code } = this.state;    
        const addresses = checkout.shipping_info && checkout.shipping_info.addresses || [];
        const sellerCart = checkout.sale_items_freeze && Object.keys(checkout.sale_items_freeze).length > 0 && checkout.sale_items_freeze[ Object.keys(checkout.sale_items_freeze)[0] ] || {};
        
        let shippingAddress = guestCheckout && address;
        if(!shippingAddress && addresses.length){
            addresses.forEach(function(v){
                if( v.id == sellerCart.shipping_addr_id ) shippingAddress = v;
            })
        }
        const errors = this.validate();

        const shouldMarkError = (field) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];

            return hasError ? shouldShow : false;
        };

        
        return (
                <div className="new">
                    <fieldset className="frm">
                        <div className={classnames("element", { error: shouldMarkError('card_element') })}>
                            <label className="label">Credit or debit card</label>
                            <div id="card-element" ref={(cardRef) => { this.cardRef = cardRef; }}/>
                            <div className="card-error" style={{ display: this.state.card_error ? 'block' : 'none' }}>{this.state.card_error}</div>
                        </div>
                        <p><label className="label">Name on card</label>
                        <input type="text" name="card_holder_name" className={classnames("text", { error: shouldMarkError('card_holder_name') })} onChange={this.handleChange} onBlur={this.handleBlur('card_holder_name')} value={card_holder_name} ref={(ref) => { this.cardHolderNameRef = ref; }}/></p>
                        <p className="tip">Your payment details are encrypted and sent over a secure connection</p>
                    </fieldset>
                    <div className="billing">
                        <h3>Billing address</h3>
                        <ul className="select_option">
                            <li className={showNewBillingAddress?'':'selected'} onClick={this.handleClickAddressType} ><input type="radio" name="billing_addr" checked={!showNewBillingAddress} id="addr_default" value='shipping' />
                            <label for="addr_default">
                                Same as shipping address
                                <small>{shippingAddress.address1}{shippingAddress.address2?' '+shippingAddress.address2:''}, {shippingAddress.city}{shippingAddress.state?', '+shippingAddress.state:''}, {shippingAddress.country_name}, {shippingAddress.zip}</small>
                            </label></li>
                            <li className={showNewBillingAddress?'selected':''} onClick={this.handleClickAddressType} ><input type="radio" name="billing_addr" checked={showNewBillingAddress}  id="addr_new" value='new'/>
                            <label for="addr_new">
                                Use a different billing address
                            </label></li>
                        </ul>
                        { showNewBillingAddress &&  
                            <fieldset className="frm">
                                <p><label className="label">Address Line 1</label>
                                <input type="text" name="address1" className={classnames("text", { error: shouldMarkError('address1') })}  onChange={this.handleChange} onBlur={this.handleBlur('address1')} value={address1}/></p>
                                <p><label className="label">Address Line 2</label>
                                <input type="text" name="address2" className="text" onChange={this.handleChange}  value={address2}/></p>
                                <p><label className="label">City</label>
                                <input type="text" name="city" className={classnames("text", { error: shouldMarkError('city') })}  onChange={this.handleChange} onBlur={this.handleBlur('city')}  value={city}/></p>
                                <p><label className="label">Country</label>
                                <span className="selectBox"><select name="country" onChange={this.handleChange}>
                                {countries.map((c, index) => { 
                                    return (
                                        <option value={c.c3} data-c2={c.c2} selected={country == c.c2} >{c.s}</option>
                                    );
                                })}
                                </select></span></p>
                                <p className="state"><label className="label">State</label>
                                { country == 'US' &&
                                    <span className="selectBox"><select name="state" onChange={this.handleChange} value={state}>
                                    {states.map((s, index) => {
                                        return (
                                            <option value={s.v}>{s.s}</option>
                                        );
                                    })}
                                    </select></span>
                                }
                                { country != 'US' &&   
                                    <input type="text" name="state" className="text"  onChange={this.handleChange} value={state}/>
                                }
                                </p>
                                <p className="zipcode"><label className="label">Postcode</label>
                                <input type="text" name="postal_code" className={classnames("text", { error: shouldMarkError('postal_code') })} onChange={this.handleChange} onBlur={this.handleBlur('postal_code')} value={postal_code}/></p>
                            </fieldset>
                        }
                    </div>
                </div>
        );
    }
}




                
