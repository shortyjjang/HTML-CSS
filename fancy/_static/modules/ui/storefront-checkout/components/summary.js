import React, { Component } from "react";
import { renderPopup } from "fancyutils";

import { updateCheckout } from "../action/action-helpers";
import classnames from "classnames";
import store from "../store/store";
import C from "../action/action-constants";
import CurrencyPopup from "./popup/currency";

export class Summary extends Component {
    state = { expand: true };

    renderCurrencyPopup = () => {
        renderPopup(CurrencyPopup, { currentCurrency: this.props.currencyContext.currencyCode });
    };

    handleCurrencyPopup = event => {
        event.preventDefault();
        this.renderCurrencyPopup();
    };

    handleCurrencyPopupDefault = event => {
        event.preventDefault();
        const {
            appContext: { convert_currency },
            checkout
        } = this.props;
        const currency = (convert_currency && checkout.currency) || { code: "USD", symbol: "$" };

        if (!this.props.currencyContext.currencyCode === currency.code) {
            return false;
        }
        this.renderCurrencyPopup();
    };

    handleOpenCustomize = event => {
        event.preventDefault();
        const $this = $(event.target);
        $this
            .hide()
            .closest(".cs")
            .find(".add")
            .show();
    };

    handleCustomizeChange = event => {
        event.preventDefault();
        const $this = $(event.target),
            val = $this.val(),
            saleId = $this.data("sale-id"),
            optionId = $this.data("option-id");
        const {
            appContext: { personalizations }
        } = this.props;
        const key = saleId + (optionId ? "-" + optionId : "");
        personalizations[key] = val;
        store.dispatch((dispatch, getState) => {
            dispatch({ type: C.UPDATE_APP_CONTEXT, context: { personalizations: personalizations } });
        });
    };

    toggleSummaryExpand = event => {
        this.setState({ expand: !this.state.expand });
    };

    getApproxText = () => {
        var { currencySymbol, currencyMoney } = this.props.currencyContext;
        return `${currencySymbol}${currencyMoney} `;
    };

    render() {
        const {
            parent,
            status,
            isFetching,
            appContext: {
                seller,
                viewer,
                loggedIn,
                step,
                guestCheckout,
                convert_currency,
                personalizations,
                has_own_users
            },
            checkout,
            order: { order },
            currencyContext: { currencySymbol, currencyMoney, currencyCode }
        } = this.props;
        const currency = (convert_currency && checkout.currency) || { code: "USD", symbol: "$" };
        const { expand } = this.state;
        const sellerCart =
            (checkout.sale_items_freeze &&
                Object.keys(checkout.sale_items_freeze).length > 0 &&
                checkout.sale_items_freeze[Object.keys(checkout.sale_items_freeze)[0]]) ||
            {};
        const items =
            checkout.sale_items_freeze &&
            Object.keys(checkout.sale_items_freeze)
                .map(seller_id => checkout.sale_items_freeze[seller_id].items || [])
                .reduce((prev, items) => [...prev, ...items], []);

        const addresses = (checkout.shipping_info && checkout.shipping_info.addresses) || [];
        const isAvailable =
            sellerCart.checkout_available ||
            guestCheckout ||
            !addresses.length ||
            (parent.shipping && parent.shipping.state.showNewAddress);
        const isOrderSubmitted =
            (status == "requestPayment" && isFetching) ||
            (parent.payment && parent.payment.state.requestingBitpayInvoice);

        let total_prices = checkout.total_prices,
            fancy_gift_card = checkout.fancy_money_amount,
            antavo_discount = 0,
            antavo_points = 0;
        let preorder = { remainder: 0, remainder_discount: 0, shipping: 0, tax: 0, remainder_total: 0 };

        let shipping_promotion_amount =
            (checkout.extra_info.free_shipping_promotion &&
                parseFloat(checkout.extra_info.free_shipping_promotion.total)) ||
            0;
        let shipping_discount_amount = shipping_promotion_amount + (parseFloat(checkout.shipping_discount_amount) || 0);
        let original_shipping_cost = parseFloat(checkout.shipping_costs) || 0;
        let shipping_cost = original_shipping_cost - shipping_discount_amount;
        let coupon_amount = parseFloat(checkout.coupon_amount) || 0;
        if (shipping_discount_amount > 0) {
            coupon_amount = Math.max(coupon_amount - shipping_discount_amount, 0);
        }

        if (!convert_currency) {
            antavo_discount =
                (checkout.antavo && checkout.antavo.max_points > 0 && checkout.antavo.max_discount) || "0";
            antavo_points = (checkout.antavo && checkout.antavo.max_points > 0 && checkout.antavo.max_points) || "0";
            total_prices = parseFloat(checkout.total_prices) - parseFloat(antavo_discount);
            const reduce_fancy_money = parseFloat((checkout.antavo && checkout.antavo.reduce_fancy_money) || "0");
            if (reduce_fancy_money) {
                total_prices += reduce_fancy_money;
                fancy_gift_card = (parseFloat(fancy_gift_card) - reduce_fancy_money).toFixed(2);
            }
        }

        if (sellerCart.preorder) {
            _.each(sellerCart.preorder, function(value, key) {
                var curValue = preorder[key];
                if (curValue) {
                    if (!isNaN(parseFloat(value))) {
                        preorder[key] = (parseFloat(curValue) + parseFloat(value)).toFixed(2);
                    }
                } else {
                    preorder[key] = isNaN(parseFloat(value)) ? null : parseFloat(value).toFixed(2);
                }
            });
        }

        return (
            <div id="summary" className={expand ? "" : "collapse"}>
                <h2>
                    Order Summary <small onClick={this.toggleSummaryExpand}>{items.length} Items</small>
                </h2>
                <div className="summary-wrapper">
                    <ul className="items">
                        {items.map((item, index) => {
                            return (
                                <li key={index}>
                                    <div className="item_info">
                                        <span
                                            className="figure"
                                            style={{ backgroundImage: `url(${item.image_url})` }}
                                        />
                                        <div className="figcaption">
                                            <span className="qty">
                                                <b>{item.quantity}</b>
                                            </span>
                                            &nbsp;<b className="title">{item.title}</b>
                                            {item.option && <small className="option">{item.option}</small>}
                                            {(item.item_discount_percentage > 0 && (
                                                <b className="price sale">
                                                    {currency.symbol}
                                                    {(convert_currency && numberFormat(item.item_price_converted)) ||
                                                        numberFormat(item.item_price)}{" "}
                                                    <small>
                                                        {currency.symbol}
                                                        {(convert_currency &&
                                                            numberFormat(item.item_retail_price_converted)) ||
                                                            numberFormat(item.item_retail_price)}
                                                    </small>
                                                </b>
                                            )) || (
                                                <b className="price">
                                                    {currency.symbol}
                                                    {(convert_currency && numberFormat(item.item_price_converted)) ||
                                                        numberFormat(item.item_price)}
                                                </b>
                                            )}
                                            {(item.personalizable && order && (
                                                <div className="cs">
                                                    <div className="add">
                                                        <label>Customize</label>
                                                        <div className="text personalization">
                                                            {
                                                                personalizations[
                                                                    item.sale_id +
                                                                        (item.option_id ? "-" + item.option_id : "")
                                                                ]
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )) ||
                                                []}
                                            {(item.personalizable && !order && (
                                                <div className="cs">
                                                    <a href="#" className="show" onClick={this.handleOpenCustomize}>
                                                        Customize this item
                                                    </a>
                                                    <div className="add" style={{ display: "none" }}>
                                                        <label>Customize</label>
                                                        <textarea
                                                            className="text personalization"
                                                            data-sale-id={`${item.sale_id}`}
                                                            data-option-id={`${item.option_id}`}
                                                            onChange={this.handleCustomizeChange}
                                                            onBlur={this.handleCustomizeChange}
                                                        />
                                                    </div>
                                                </div>
                                            )) ||
                                                []}
                                            {step == "shipping" && !item.available && (
                                                <span className="error">
                                                    {item.error_message || "Currently Unavailable"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    {(step != "complete" && (
                        <Coupon
                            {...this.props}
                            ref={coupon => {
                                this.coupon = coupon;
                            }}
                        />
                    )) ||
                        []}
                    <div className="receipt">
                        <h3>Receipt details</h3>
                        <ul>
                            <li>
                                <label>Subtotal</label>
                                <b>
                                    {currency.symbol}
                                    {(convert_currency && numberFormat(checkout.subtotal_prices_converted)) ||
                                        numberFormat(checkout.subtotal_prices)}
                                </b>
                            </li>
                            <li>
                                <label>Shipping</label>
                                <b>
                                    {currency.symbol}
                                    {(convert_currency && numberFormat(checkout.shipping_costs_converted)) ||
                                        numberFormat(shipping_cost.toFixed(2))}
                                </b>
                                {(!convert_currency && shipping_discount_amount > 0 && (
                                    <b className="before-discount">
                                        {currency.symbol}
                                        {numberFormat(original_shipping_cost.toFixed(2))}
                                    </b>
                                )) ||
                                    []}
                            </li>
                            <li>
                                <label>Estimated Tax</label>
                                <b>
                                    {currency.symbol}
                                    {(convert_currency && numberFormat(checkout.sales_taxes_converted)) ||
                                        numberFormat(checkout.sales_taxes)}
                                </b>
                            </li>
                            {(checkout.discount_amount > 0 && (
                                <li className="discount">
                                    <label>Discount</label>
                                    <b>
                                        -{currency.symbol}
                                        {(convert_currency && numberFormat(checkout.discount_amount_converted)) ||
                                            numberFormat(checkout.discount_amount)}
                                    </b>
                                </li>
                            )) ||
                                []}
                            {(coupon_amount > 0 && (
                                <li className="discount">
                                    <label>Coupon</label>
                                    <b>
                                        -{currency.symbol}
                                        {(convert_currency && numberFormat(checkout.coupon_amount_converted)) ||
                                            numberFormat(coupon_amount.toFixed(2))}
                                    </b>
                                </li>
                            )) ||
                                []}
                            {(checkout.credit_amount > 0 && (
                                <li className="discount">
                                    <label>Fancy Rebate</label>
                                    <b>
                                        -{currency.symbol}
                                        {(convert_currency && numberFormat(checkout.credit_amount_converted)) ||
                                            numberFormat(checkout.credit_amount)}
                                    </b>
                                </li>
                            )) ||
                                []}
                            {(fancy_gift_card > 0 && (
                                <li className="discount">
                                    <label>{(has_own_users && "Gift Certificates") || "Gift card"}</label>
                                    <b>
                                        -{currency.symbol}
                                        {(convert_currency && numberFormat(checkout.fancy_money_amount_converted)) ||
                                            numberFormat(fancy_gift_card)}
                                    </b>
                                </li>
                            )) ||
                                []}
                            {(antavo_discount > 0 && (
                                <li className="discount">
                                    <label>Toad Points ({antavo_points} points)</label>
                                    <b>-${antavo_discount}</b>
                                </li>
                            )) ||
                                []}
                            <li className="total">
                                <big>
                                    <label>{(preorder.remainder > 0 && "Pay Now") || "Order Total"}</label>
                                    <b>
                                        {currency.symbol}
                                        {(convert_currency &&
                                            numberFormat(checkout.total_prices_converted.toFixed(2))) ||
                                            numberFormat(total_prices.toFixed(2))}
                                        {!currencyCode ||
                                            (currencyCode === currency.code && (
                                                <small className="currency">
                                                    <strong>
                                                        <a href="#" onClick={this.handleCurrencyPopupDefault}>
                                                            {currency.code}
                                                        </a>
                                                    </strong>
                                                </small>
                                            )) ||
                                            []}
                                        {(currencyCode && currencyCode !== currency.code && (
                                            <small className="currency done">
                                                Approx{" "}
                                                <strong>
                                                    {this.getApproxText()}{" "}
                                                    <a href="#" onClick={this.handleCurrencyPopup}>
                                                        {currencyCode}
                                                    </a>
                                                </strong>
                                            </small>
                                        )) ||
                                            []}
                                    </b>
                                </big>
                            </li>
                        </ul>
                    </div>
                    {(preorder.remainder > 0 && (
                        <div className="receipt">
                            <ul>
                                <li>
                                    <label>Remainder</label>
                                    <b>${preorder.remainder}</b>
                                </li>
                                {(preorder.remainder_discount > 0 && (
                                    <li className="discount">
                                        <label>Remainder Coupon</label>
                                        <b>-${preorder.remainder_discount}</b>
                                    </li>
                                )) ||
                                    []}
                                <li>
                                    <label>Shipping</label>
                                    <b>${preorder.shipping}</b>
                                </li>
                                <li>
                                    <label>Estimated Tax</label>
                                    <b>${preorder.tax}</b>
                                </li>
                                <li className="total">
                                    <big>
                                        <label>Pay Later</label>
                                        <b>${preorder.remainder_total}</b>
                                    </big>
                                </li>
                            </ul>
                        </div>
                    )) ||
                        []}
                </div>
                {(step == "shipping" && (
                    <button
                        className="submit"
                        disabled={!isAvailable}
                        onClick={parent.shipping && parent.shipping.handleProceedToPayment}>
                        Continue to Payment
                    </button>
                )) ||
                    []}
                {(step == "payment" && (
                    <button
                        className={classnames("submit", { loading: isOrderSubmitted })}
                        disabled={isOrderSubmitted}
                        onClick={parent.payment && parent.payment.handleOrderComplete}>
                        Complete Order
                    </button>
                )) ||
                    []}
            </div>
        );
    }
}

export class Coupon extends Component {
    state = { showNewCard: false, showCoupon: false, cardId: null, couponCode: "" };

    handleShowCoupon = event => {
        event.preventDefault();
        this.setState({ showCoupon: true });
    };

    handleCodeChange = event => {
        let code = $(event.currentTarget).val();
        this.setState({ couponCode: code });
    };

    handleRemoveCode = event => {
        store.dispatch(updateCheckout(window.seller.id, { apply_coupon: false }));
        this.setState({ showCoupon: false });
    };

    handleApplyCode = event => {
        const {
            appContext: { seller, viewer, loggedIn, guestCheckout, guestEmail, step },
            checkout,
            status,
            message
        } = this.props;
        let email = (guestCheckout && guestEmail) || "";
        if (!email && step == "paypal") email = checkout.extra_info.paypal_email || "";
        if (guestCheckout && !email) {
            alertify.alert("Please enter email before apply coupon");
            return;
        }
        store.dispatch(
            updateCheckout(window.seller.id, { apply_coupon: true, coupon_code: this.state.couponCode, email: email })
        );
    };

    render() {
        const {
            appContext: { seller, viewer, loggedIn, guestCheckout },
            checkout,
            status,
            message
        } = this.props;
        const sellerCart =
            (checkout.sale_items_freeze &&
                Object.keys(checkout.sale_items_freeze).length > 0 &&
                checkout.sale_items_freeze[Object.keys(checkout.sale_items_freeze)[0]]) ||
            {};
        const credit_cards = (sellerCart.credit_cards && sellerCart.credit_cards.cards) || [];
        const coupon = (sellerCart.coupons && sellerCart.coupons[0]) || null;
        const { showCoupon, cardId, couponCode } = this.state;
        const invalidCoupon = status == "applyCouponFailed";
        const invalidCouponMessage = status == "applyCouponFailed" && message;

        return (
            <div className={classnames("discount_code", { confirm: coupon && coupon.code })}>
                <fieldset className="frm">
                    <label className="label">Discount Code</label>
                    <input
                        type="text"
                        className={classnames("text", { error: invalidCoupon })}
                        placeholder="Enter discount code"
                        value={(coupon && coupon.code) || couponCode || ''}
                        onChange={this.handleCodeChange}
                        readOnly={!!coupon}
                    />
                    {(!coupon && couponCode && (
                        <button className="btn-apply" onClick={this.handleApplyCode}>
                            Apply
                        </button>
                    )) ||
                        []}
                    {(coupon && coupon.code && (
                        <button className="btn-remove" onClick={this.handleRemoveCode}>
                            Remove
                        </button>
                    )) ||
                        []}
                    {(invalidCouponMessage && <span className="error">{invalidCouponMessage}</span>) || []}
                </fieldset>
            </div>
        );
    }
}
