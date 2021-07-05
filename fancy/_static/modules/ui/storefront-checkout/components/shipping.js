import React, { Component } from "react";
import classnames from "classnames";
import store from "../store/store";
import { updateCheckout, addAddress, doLogout } from "../action/action-helpers";
import C from "../action/action-constants";
import { UserInfo } from "./userinfo";
import { Loading } from "./loading";

export class Shipping extends Component {
    state = { isGift: false, showNewAddress: false };

    handleClickAddress = event => {
        const $li = $(event.currentTarget),
            addressId = $li.find("input[name=shipping_ads]").val();

        if ($li.hasClass("selected")) return;
        if (addressId == "new") {
            this.setState({ showNewAddress: true });
        } else {
            this.setState({ showNewAddress: false });
            store.dispatch(updateCheckout(window.seller.id, { address_id: addressId }));
        }
    };

    handleRemoveAddress = event => {
        const $li = $(event.currentTarget).closest("li"),
            $list = $li.closest("ul"),
            addressId = $li.find("input[name=shipping_ads]").val();
        var original_labels = alertify.labels;
        alertify.set({
            labels: {
                ok: "Delete",
                cancel: "Cancel"
            }
        });
        alertify.confirm("Are you sure you want to delete this shipping address?", function(e) {
            if (e) {
                $.ajax({
                    url: "/remove_shipping_addr.json",
                    method: "POST",
                    data: { id: addressId },
                    dataType: "json"
                })
                    .then(_ => {
                        $list
                            .find("li")
                            .not($li)
                            .eq(0)
                            .trigger("click");
                    })
                    .fail(failureXHR => {
                        if (failureXHR.status === 404) {
                            alertify.alert("This page is not available. Please try again later.");
                        } else if (failureXHR.status >= 500) {
                            alertify.alert(
                                'There was an error while update the page.<br> Please try again or contact <a mailto="cs@fancy.com">cs@fancy.com</a>.'
                            );
                        }
                    });
            }
        });
        alertify.set({ labels: original_labels });
    };

    handleClickShippingOption = event => {
        const {
            appContext: { guestCheckout }
        } = this.props;
        const $li = $(event.currentTarget),
            shippingOption = $li.find("input[name=shipping_opt]").val();
        let shipping_option = {};
        shipping_option[window.seller.id] = parseInt(shippingOption);

        if ($li.hasClass("selected")) return;

        if (guestCheckout) {
            const address = this.newAddress.state;
            store.dispatch(
                updateCheckout(window.seller.id, {
                    country: address.country,
                    state: address.state,
                    city: address.city,
                    zip: address.zip,
                    shipping_option: shipping_option
                })
            );
        } else {
            store.dispatch(updateCheckout(window.seller.id, { shipping_option: shipping_option }));
        }
    };

    handleChangeGift = event => {
        const isGift = event.currentTarget.checked;
        this.setState({ isGift });
    };

    handleGiftChange = event => {
        const $this = $(event.target),
            val = $this.val();
        let gift_info = {};
        if (this.state.isGift) {
            gift_info = { is_gift: true, gift_message: val || "" };
        } else {
            gift_info = { is_gift: false, gift_message: "" };
        }
        store.dispatch((dispatch, getState) => {
            dispatch({ type: C.UPDATE_APP_CONTEXT, context: { gift_info: gift_info } });
        });
    };

    handleNoteChange = event => {
        const $this = $(event.target),
            val = $this.val();
        store.dispatch((dispatch, getState) => {
            dispatch({ type: C.UPDATE_APP_CONTEXT, context: { note_info: val } });
        });
    };

    handleProceedToPayment = event => {
        const {
            appContext: { seller, viewer, loggedIn, guestCheckout },
            checkout
        } = this.props;
        let isAvailable = true;
        for (let k in checkout.sale_items_freeze) {
            const cart = checkout.sale_items_freeze[k];
            if (!cart.checkout_available) {
                isAvailable = false;
                break;
            }
        }

        if (!isAvailable) {
            let message = "";
            for (let k in checkout.sale_items_freeze) {
                const cart = checkout.sale_items_freeze[k];
                cart.items.forEach(function(item) {
                    if (!item.available) {
                        message += item.title + " : " + (item.error_message || "");
                    }
                });
            }
            if (message) {
                alertify.alert(message);
                return;
            } else {
                isAvailable = true;
            }
        }
        if (guestCheckout) {
            if (this.userinfo.isValid()) {
                store.dispatch((dispatch, getState) => {
                    dispatch({ type: C.UPDATE_APP_CONTEXT, context: { guestEmail: this.userinfo.state.email } });
                });
            } else {
                alertify.alert("Please enter your email address");
                isAvailable = false;
            }
        }
        if (guestCheckout || this.state.showNewAddress) {
            if (this.newAddress.isValid()) {
                store.dispatch(addAddress(window.seller.id, this.newAddress.state));
            } else {
                alertify.alert("Please enter a valid shipping address");
                isAvailable = false;
            }
        }
        if (isAvailable) {
            this.props.handleProceedToPayment(event);
        }
    };

    componentDidMount() {
        const {
            isFetching,
            appContext: { seller, viewer, loggedIn, guestCheckout, gift_info, note_info },
            checkout
        } = this.props;
        const addresses = (checkout.shipping_info && checkout.shipping_info.addresses) || [];

        if (gift_info.is_gift) {
            this.setState({ isGift: true });
        }

        if (!addresses.length) {
            this.setState({ showNewAddress: true });
        }

        store.dispatch((dispatch, getState) => {
            dispatch({ type: C.UPDATE_APP_CONTEXT, context: {} });
        });
    }

    render() {
        const {
            isFetching,
            appContext: {
                seller,
                viewer,
                loggedIn,
                convert_currency,
                guestCheckout,
                has_own_users,
                domain_with_checkout,
                gift_info,
                note_info
            },
            checkout
        } = this.props;
        const { isGift, showNewAddress } = this.state;
        const addresses = (checkout.shipping_info && checkout.shipping_info.addresses) || [];
        const sellerCart =
            (checkout.sale_items_freeze &&
                Object.keys(checkout.sale_items_freeze).length > 0 &&
                checkout.sale_items_freeze[Object.keys(checkout.sale_items_freeze)[0]]) ||
            {};
        const shippingOptions = sellerCart.shipping_options || [];
        const useNewAddress = guestCheckout || showNewAddress || !addresses.length;
        const currency = (convert_currency && checkout.currency) || { code: "USD", symbol: "$" };
        let isAvailable = useNewAddress;
        if (!isAvailable) {
            for (let k in checkout.sale_items_freeze) {
                const cart = checkout.sale_items_freeze[k];
                if (!cart.checkout_available) {
                    isAvailable = false;
                    break;
                }
            }
        }

        return (
            <div id="step1">
                <UserInfo
                    {...this.props}
                    ref={userinfo => {
                        this.userinfo = userinfo;
                    }}
                />
                <div className={classnames("step", "shipping", { loading: isFetching })}>
                    <h2>
                        <em>1</em> Shipping address
                    </h2>
                    {(!guestCheckout && addresses.length && (
                        <div className="saved">
                            <ul className="select_option">
                                {addresses.map((address, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className={
                                                !showNewAddress && address.id == sellerCart.shipping_addr_id
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={this.handleClickAddress}>
                                            <input
                                                type="radio"
                                                name="shipping_ads"
                                                checked={!showNewAddress && address.id == sellerCart.shipping_addr_id}
                                                id={"shipping_ads_" + address.alias}
                                                value={address.id}
                                                onChange={() => {} /* for shutting off warning */}
                                            />
                                            <label htmlFor={"shipping_ads_" + address.alias}>
                                                {(loggedIn && (
                                                    <a
                                                        href="#"
                                                        className="btn-delete"
                                                        onClick={this.handleRemoveAddress}
                                                    />
                                                )) ||
                                                    []}
                                                {address.full_name}
                                                <small>
                                                    {address.address1}
                                                    {address.address2 ? " " + address.address2 : ""}, {address.city}
                                                    {address.state ? ", " + address.state : ""}, {address.country_name},{" "}
                                                    {address.zip}
                                                </small>
                                            </label>
                                        </li>
                                    );
                                })}
                                <li className={showNewAddress ? "selected" : ""} onClick={this.handleClickAddress}>
                                    <input
                                        type="radio"
                                        name="shipping_ads"
                                        checked={showNewAddress}
                                        id="shipping_ads_new"
                                        value="new"
                                    />
                                    <label htmlFor="shipping_ads_new">Use another shipping address</label>
                                </li>
                            </ul>
                        </div>
                    )) ||
                        ""}
                    {useNewAddress && (
                        <NewAddress
                            {...this.props}
                            ref={newAddress => {
                                this.newAddress = newAddress;
                            }}
                        />
                    )}
                    <div className="options">
                        <h3>Shipping options</h3>
                        <ul className="select_option">
                            {shippingOptions.map((shipping, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={shipping.id == sellerCart.shipping_selected ? "selected" : ""}
                                        onClick={this.handleClickShippingOption}>
                                        <input
                                            type="radio"
                                            name="shipping_opt"
                                            checked={shipping.id == sellerCart.shipping_selected}
                                            id={"opt_" + shipping.label}
                                            value={shipping.id}
                                            onChange={() => {} /* for shutting off warning */}
                                        />
                                        <label htmlFor="opt_{shipping.label}">
                                            {shipping.label}
                                            <small>{shipping.detail}</small>
                                            {(shipping.amount > 0 && (
                                                <strong>
                                                    {currency.symbol}
                                                    {(convert_currency && shipping.amount_converted) || shipping.amount}
                                                </strong>
                                            )) ||
                                                []}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="note">
                        <h3>Order Notes</h3>
                        <fieldset className="frm">
                            <p>
                                <input
                                    type="checkbox"
                                    id="order_gift"
                                    onChange={this.handleChangeGift}
                                    checked={isGift}
                                />{" "}
                                <label htmlFor="order_gift">This Order is a Gift</label>
                            </p>
                            {isGift && (
                                <p className="gift-note">
                                    <label className="label">Gift Note</label>
                                    <textarea
                                        onChange={this.handleGiftChange}
                                        onBlur={this.handleGiftChange}
                                        value={gift_info.gift_message}
                                    />
                                </p>
                            )}
                            <p>
                                <label className="label">Note for {seller.brand_name}</label>
                                <textarea
                                    onChange={this.handleNoteChange}
                                    onBlur={this.handleNoteChange}
                                    value={note_info}
                                />
                            </p>
                        </fieldset>
                    </div>
                </div>
                {(isFetching && <Loading />) || []}
            </div>
        );
    }
}

export class NewAddress extends Component {
    state = {
        full_name: "",
        address1: "",
        address2: "",
        city: "",
        country: "US",
        country_name: "United States Of America",
        state: "",
        zip: "",
        phone: "",
        touched: {
            full_name: false,
            address1: false,
            city: false,
            zip: false,
            phone: false
        }
    };

    componentDidMount() {
        const {
            appContext: { countries, states, guestCheckout, address, userCountry },
            checkout
        } = this.props;
        const addr =
            (guestCheckout &&
                (checkout.shipping_info && checkout.shipping_info.addresses && checkout.shipping_info.addresses[0])) ||
            address;
        if (addr) {
            ["address1", "address2", "full_name", "phone", "zip"].forEach(function(v) {
                addr[v] = (addr && addr[v]) || (address && address[v]) || "";
            });
            if (!addr.country) {
                addr.country = userCountry;
                store.dispatch(updateCheckout(window.seller.id, { country: addr.country }));
            }

            this.setState(addr);
        }
    }

    isValid = () => {
        const errors = this.validate();
        let isValid = true;
        let touched = this.state.touched;
        for (let k in errors) {
            if (errors[k]) {
                isValid = false;
                touched[k] = true;
            }
        }
        this.setState({ touched: touched });
        return isValid;
    };

    validate = () => {
        return {
            full_name: this.state.full_name.length === 0,
            address1: this.state.address1.length === 0,
            city: this.state.city.length === 0,
            zip: this.state.zip.length === 0,
            phone: this.state.phone.length === 0
        };
    };

    handleBlur = field => evt => {
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
        const {
            appContext: { guestCheckout },
            checkout
        } = this.props;
        const name = $(evt.currentTarget).attr("name"),
            val = $(evt.currentTarget).val();

        if (guestCheckout && this.state.country != "US" && name == "state") {
            this.setState({
                [name]: val
            });

            let address = this.state;
            address[name] = val;
            store.dispatch(
                updateCheckout(window.seller.id, {
                    country: address.country,
                    state: address.state,
                    city: address.city,
                    zip: address.zip
                })
            );
        }
    };

    handleChange = evt => {
        const {
            appContext: { guestCheckout },
            checkout
        } = this.props;
        const addresses = (checkout.shipping_info && checkout.shipping_info.addresses) || [];
        const name = $(evt.currentTarget).attr("name"),
            val = $(evt.currentTarget).val();

        this.setState({
            [name]: val
        });

        if (name === "country") {
            this.setState({
                country_name: $(evt.currentTarget)
                    .find("option:selected")
                    .text()
            });
        }

        if (name === "state") {
            if (this.state.country != "US" && name == "state") return;
            let address = this.state;
            address[name] = val;
            store.dispatch(
                updateCheckout(window.seller.id, {
                    country: address.country,
                    state: address.state,
                    city: address.city,
                    zip: address.zip
                })
            );
        }
    };

    render() {
        const {
            appContext: { countries, states, guestCheckout, address },
            checkout
        } = this.props;
        const addr =
            (guestCheckout &&
                (this.state ||
                    (checkout.shipping_info &&
                        checkout.shipping_info.addresses &&
                        checkout.shipping_info.addresses[0]))) ||
            null;
        const country = (addr && addr.country) || this.state.country;
        const errors = this.validate();

        const shouldMarkError = field => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];

            return hasError ? shouldShow : false;
        };

        return (
            <div className="new">
                <fieldset className="frm">
                    <p>
                        <label className="label">Full name</label>
                        <input
                            type="text"
                            name="full_name"
                            className={classnames("text", { error: shouldMarkError("full_name") })}
                            onBlur={this.handleBlur("full_name")}
                            onChange={this.handleChange}
                            value={(addr && addr.full_name) || this.state.full_name || ""}
                        />
                    </p>
                    <p>
                        <label className="label">Address Line 1</label>
                        <input
                            type="text"
                            name="address1"
                            className={classnames("text", { error: shouldMarkError("address1") })}
                            onBlur={this.handleBlur("address1")}
                            onChange={this.handleChange}
                            value={(addr && addr.address1) || this.state.address1 || ""}
                        />
                    </p>
                    <p>
                        <label className="label">Address Line 2</label>
                        <input
                            type="text"
                            name="address2"
                            className="text"
                            onChange={this.handleChange}
                            value={(addr && addr.address2) || this.state.address2 || ""}
                        />
                    </p>
                    <p>
                        <label className="label">City</label>
                        <input
                            type="text"
                            name="city"
                            className={classnames("text", { error: shouldMarkError("city") })}
                            onBlur={this.handleBlur("city")}
                            onChange={this.handleChange}
                            value={(addr && addr.city) || this.state.city || ""}
                        />
                    </p>
                    <p>
                        <label className="label">Country</label>
                        <span className="selectBox">
                            <select name="country" onChange={this.handleChange} value={country || countries[0]}>
                                {countries.map((c, index) => {
                                    return (
                                        <option key={`country-${c.c2}-${index}`} value={c.c2}>
                                            {c.s}
                                        </option>
                                    );
                                })}
                            </select>
                        </span>
                    </p>
                    <p className="state">
                        <label className="label">State</label>
                        {country == "US" && (
                            <span className="selectBox">
                                <select name="state" onChange={this.handleChange} value={(addr && addr.state) || states[0]}>
                                    {states.map((s, index) => {
                                        return (
                                            <option key={`state-${s.v}-${index}`} value={s.v}>
                                                {s.s}
                                            </option>
                                        );
                                    })}
                                </select>
                            </span>
                        )}
                        {country != "US" && (
                            <input
                                type="text"
                                name="state"
                                className="text"
                                onChange={this.handleChange}
                                onBlur={this.handleBlur("state")}
                                value={(addr && addr.state) || this.state.state || ""}
                            />
                        )}
                    </p>
                    <p className="zipcode">
                        <label className="label">Postcode</label>
                        <input
                            type="text"
                            name="zip"
                            className={classnames("text", { error: shouldMarkError("zip") })}
                            onBlur={this.handleBlur("zip")}
                            onChange={this.handleChange}
                            value={(addr && addr.zip) || this.state.zip || ""}
                        />
                    </p>
                    <p className="phone">
                        <label className="label">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            className={classnames("text", { error: shouldMarkError("phone") })}
                            onBlur={this.handleBlur("phone")}
                            onChange={this.handleChange}
                            value={(addr && addr.phone) || this.state.phone || ""}
                        />
                    </p>
                </fieldset>
            </div>
        );
    }
}
