import React, { Component } from "react";


export class Complete extends Component {
    componentDidMount() {
        const { checkout, order : {order, paymentData} } = this.props;
        const sale_order = order.orders[0];
        if (window.ga) {
            ga('require', 'ecommerce');
            ga('ecommerce:addTransaction', { 'id': sale_order.order_id.toString(), 'revenue': order.total_prices,
                'shipping': order.shipping_costs, 'tax': order.sales_taxes, 'currency': 'USD' });
            Object.keys(checkout.sale_items_freeze).forEach(function(seller_id) {
                checkout.sale_items_freeze[seller_id].items.forEach(function(item) {
                    ga('ecommerce:addItem', { 'id': item.id.toString(), 'name': item.title,
                        'sku': item.sku, 'price': item.item_price, 'quantity': item.quantity });
                    })
                });
            ga('ecommerce:send');
        }
        if (window.fbq) {
            fbq('track', 'Purchase', { value: order.total_prices, currency: 'USD' });
        }
    }

    render() {
        const { appContext: { seller, viewer, loggedIn, guestEmail, guestCheckout, guestCard, address}, checkout, order : {order, paymentData} } = this.props;        
        const addresses = checkout.shipping_info && checkout.shipping_info.addresses || [];
        const sellerCart = checkout.sale_items_freeze && Object.keys(checkout.sale_items_freeze).length > 0 && checkout.sale_items_freeze[ Object.keys(checkout.sale_items_freeze)[0] ] || {};
        const shippingOptions = sellerCart.shipping_options;
        const creditCards = sellerCart.credit_cards && sellerCart.credit_cards.cards || [];
        const isPaypal = checkout.payment_gateway == 9;
        
        let shippingAddress, shippingOption, creditCard;

        if( guestCheckout && !isPaypal){
            shippingAddress = address;
            creditCard = guestCard;
        }else{
            addresses.forEach(function(v){
                if( v.id == sellerCart.shipping_addr_id ) shippingAddress = v;
            })
            creditCards.forEach(function(v){
                if( v.id == paymentData.payment_id ) creditCard = v;
            })
        }
        shippingOptions.forEach(function(v){
            if( v.id == sellerCart.shipping_selected ) shippingOption = v;
        })

        return (
            <div id="step3">
                <div className="step complete">
                    <h2>Thanks for your order!</h2>
                    <p>Your order details have been sent to your email address</p>
                    <a href={seller.store_url} className="submit">Back to the Shop</a>
                    <small className="order-number">Order {order.orders
                            .map(sale_order => <span>#{sale_order.order_id}</span> )
                            .reduce((prev, curr) => [prev, ', ', curr])}</small>
                    <div className="detail">
                        <h3>Order details</h3>
                        <dl>
                            <dt>Shipping address</dt>
                            <dd>{shippingAddress.full_name}<br/>
                            {shippingAddress.address1}{shippingAddress.address2?' '+shippingAddress.address2:''}, {shippingAddress.city}<br/>
                            {shippingAddress.state?shippingAddress.state+', ':''}{shippingAddress.country_name}, {shippingAddress.zip}</dd>
                        </dl>
                        <dl>
                            <dt>Shipping options</dt>
                            <dd>{shippingOption.label}</dd>
                        </dl>
                        <dl>
                            <dt>Payment method</dt>
                            {isPaypal &&
                                <dd>PayPal : {checkout.extra_info.paypal_email}</dd>
                                || ''
                            }
                            {creditCard &&
                                <dd>{creditCard.card_holder_name} - {creditCard.card_type} {creditCard.card_last_digits}</dd>
                                || ''
                            }
                        </dl>
                    </div>
                </div>
            </div>
        );
    }
}
