import React, { Component } from "react";
import classnames from "classnames";
import { numberFormat, isPlainLeftClick } from "fancyutils";
import { MoreShare, MoreShareFacade } from "common-components";

import appState from "../appstate";
import { addItemToCart, logAddCartMixpanel } from "../../overlay-thing/components/map.cart";
import { getSafeNameProp, getThingName } from "./map";
import { LinkTypes, transition } from "../container/routeutils";
import { FancydUsers } from "./ThingFancydUsers";
import { OaContainer } from "../container/entry-events";

const itemTraits = {
    article: {
        utm: "article",
        section: "items",
        via: "article",
    },
    similar: {
        section: "recommended",
        utm: "rec",
        via: "thing more",
    },
    recently: {
        section: "recently viewed",
        utm: "rv",
        via: "thing more",
    },
};

export default class ThingCard extends Component {
    static defaultProps = {
        showDelete: true,
    };

    state = {
        fancydCount: 0,
        quantity: 1,
        optionID: null,
        showCart: false,
        popupOpened: false,
    };

    constructor(props) {
        super(props);
        this.handleLinkClick = _.throttle(this.handleLinkClick, 500);
    }

    componentDidMount() {
        this.setState({ fancydCount: this.props.fancyd_count || 0 });
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    handleCartAddition = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.addToCart();
    };

    addToCart() {
        if (!appState.loggedIn) {
            window.require_login && window.require_login();
            return;
        }
        const { id, itemType } = this.props;
        const { quantity } = this.state;

        const sales = this.getSales();
        const saleAvailable = this.isSaleAvailable();
        const saleOptionExists = this.isSaleOptionExists();
        const option = this.getSaleOption();

        if (!saleAvailable || this.state.loading) {
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            alert(gettext("Please select a valid quantity."));
            return;
        }

        const param = {
            seller_id: sales.seller.id, // sisi
            thing_id: id, // tid
            sale_item_id: sales.sale_id, // sii
            quantity,
        };
        if (saleOptionExists && option) {
            param.option_id = option.id;
        }

        const traits = itemTraits[itemType];
        const title = getThingName(this.props);
        this.setState({ loading: true }, () => {
            const log = {
                salesID: sales.sale_id,
                utm: traits.utm,
                section: traits.section,
                via: traits.via,
            };
            if (option) {
                log.saleOptionID = option.id;
            }
            logAddCartMixpanel(log);
            // ga shit
            const discounting = sales && sales.discount_percentage !== "0";
            const meta = {
                title,
                price: discounting ? sales.retail_price : sales.deal_price,
                brand_name: sales.seller.brand_name,
            };
            addItemToCart(
                param,
                () => {
                    if (!this.unmounted) {
                        this.setState({ loading: false });
                    }
                },
                meta
            );
        });
    }

    handleQuickCartToggle = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const saleAvailable = this.isSaleAvailable();
        const saleOptionExists = this.isSaleOptionExists();
        if (saleAvailable) {
            if (saleOptionExists) {
                this.setState({ showCart: !this.state.showCart });
            } else {
                this.addToCart();
            }
        } else {
            this.setState({ showCart: !this.state.showCart });
        }
    };

    isSaleAvailable = () => {
        const { sales_available } = this.props;
        const sales = this.getSales();
        if (sales) {
            return sales_available && sales.quantity !== 0;
        } else {
            return false;
        }
    };

    getSaleOption = () => {
        const saleOptionExists = this.isSaleOptionExists();
        const sales = this.getSales();
        if (sales && saleOptionExists) {
            const optionID = this.state.optionID || sales.options[0].id;
            const option = sales.options.filter((option) => option.id === optionID)[0] || null;
            return option;
        } else {
            return null;
        }
    };

    isSaleOptionExists = () => {
        const sales = this.getSales();
        if (sales) {
            return sales.has_options === true;
        } else {
            return false;
        }
    };

    isSaleOptionAvailable = () => {
        const option = this.getSaleOption();
        if (option) {
            return option.available_for_sale === true && option.quantity !== 0;
        } else {
            return false;
        }
    };

    getSales = () => {
        return this.props.sales;
    };

    getFancydCount = () => {
        return _.isNumber(this.state.fancydCount) ? this.state.fancydCount : this.props.fancyd_count;
    };

    handleFancydCount = (diff) => {
        this.setState({
            fancydCount: this.state.fancydCount + diff,
        });
    };

    getQuantityRange = () => {
        const saleOptionExists = this.isSaleOptionExists();
        var max;
        if (saleOptionExists && this.isSaleOptionAvailable()) {
            max = this.getSaleOption().quantity;
        } else if (this.isSaleAvailable()) {
            max = this.getSales().quantity;
        }
        return max == null ? ["1"] : _.range(1, Math.min(10, max + 1));
    };

    handleOptionChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ optionID: parseInt(event.target.value, 10), quantity: 1 });
    };

    handleOptionQuantityChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ quantity: parseInt(event.target.value, 10) });
    };

    handleTrickClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showCart: false });
    };

    handleRecentlyDelete = () => {
        $.post("/remove_recently_viewed_thing", { thing_id: this.props.id }, (json) => {
            if (!json || json.status_code !== 1) {
                window.alertify.alert(`Sorry, failed to remove "${this.props.name}". Please retry.`);
            } else {
                this.props.onDelete(this.props);
            }
        }).fail(() => {
            window.alertify.alert(`Sorry, failed to remove "${this.props.name}". Please retry.`);
        });
    };

    handleLinkClick = (event) => {
        event.stopPropagation();
        if (isPlainLeftClick(event)) {
            event.preventDefault();

            if (!window.isWhitelabel) OaContainer.scrollToTop();

            transition(this.html_url(), LinkTypes.Timeline);
        }
    };

    handleShowSomething = (popupOpened) => {
        this.setState({ popupOpened });
    };

    handleNotifySoldout = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!appState.loggedIn) {
            window.require_login && window.require_login();
            return;
        }
        const sales = this.getSales();
        const params = { sale_item_id: sales.sale_id };
        const waiting = this.getWaiting(sales);
        if (waiting) {
            params.remove = 1;
        }

        $.ajax({
            type: "post",
            url: "/wait_for_product.json",
            data: params,
            dataType: "json",
        })
            .done((json) => {
                if (!json || json.status_code == null) {
                    return;
                }
                if (json.status_code == 0 && json.message) {
                    window.alertify.alert(json.message);
                    return;
                }
                const waiting = params.remove ? false : true;
                this.setState({ waiting });
            })
            .fail(function (json) {
                if (json && json.message) {
                    window.alertify.alert(json.message);
                } else {
                    window.alertify.alert("There was an error while processing your request. Please try again later.");
                }
            });
    };

    getWaiting = () => {
        const sales = this.getSales();
        if (sales) {
            if (this.state.waiting == null) {
                return sales.waiting;
            } else {
                return this.state.waiting;
            }
        } else {
            return false;
        }
    };

    html_url = () => {
        const { utm } = itemTraits[this.props.itemType] || {};
        return `${this.props.html_url}${utm ? "?utm=" + utm : ""}`;
    };

    render() {
        const { id, thumb_image_url_310, thumb_image_url_558, itemIdx, loggedIn, viewer, showDelete } = this.props;
        const { showCart, loading, popupOpened } = this.state;
        const html_url = this.html_url();

        const sales = this.getSales();
        const discounting = sales && sales.discount_percentage !== "0";
        const waiting = this.getWaiting();

        const saleAvailable = this.isSaleAvailable();
        const saleOptionExists = this.isSaleOptionExists();
        const saleOptionAvailable = this.isSaleOptionAvailable();

        const showFrom =
            sales && sales.max_price !== null && sales.min_price !== null && sales.max_price > sales.min_price;

        return __Config.new_card ? (
            <li className={classnames({ "quick-cart": loading, active: popupOpened || showCart })}>
                <div className={classnames("figure-item new", { toggled: showCart })}>
                    <figure>
                        <a
                            href={html_url}
                            rel={`thing-${id}`}
                            onClick={this.handleLinkClick}
                            data-prevent-overlay="true">
                            <span className="figure">
                                <img
                                    src="/_ui/images/common/blank.gif"
                                    style={{ backgroundImage: `url(${thumb_image_url_558 || thumb_image_url_310})` }}
                                />
                            </span>
                        </a>
                        <div className="buttons">
                            <FancydUsers
                                thing={this.props}
                                appContext={this.props.appContext}
                                displayCount={6}
                                showFancydUser={false}
                            />
                            <MoreShareFacade
                                objectType="thing"
                                objectId={id}
                                loggedIn={loggedIn}
                                title={getThingName(this.props)}
                                viewerUsername={viewer.username}
                                onShowSomething={this.handleShowSomething}
                            />
                        </div>
                        <div
                            className={classnames("show_cart", { opened: showCart })}
                            style={!sales ? { display: "none" } : undefined}>
                            {sales && (
                                <button
                                    className="btn-cart nopopup"
                                    onClick={this.handleCartAddition}
                                    disabled={!saleOptionAvailable}>
                                    <em>Add to Cart</em>
                                </button>
                            )}
                            <em className="sale-item-input">
                                <small
                                    className="trick"
                                    style={{ display: showCart ? "block" : undefined }}
                                    onClick={this.handleTrickClick}
                                />
                                {saleAvailable ? (
                                    <span className="frm">
                                        {saleOptionExists && (
                                            <select
                                                name="option_id"
                                                id={`${id}-option_id`}
                                                onChange={this.handleOptionChange}>
                                                {sales.options.map((option, i) => (
                                                    <option
                                                        key={`other-item-${itemIdx}-saleoption-${i}`}
                                                        value={option.id}>
                                                        {option.option} -{" "}
                                                        {!option.available_for_sale || option.quantity === 0
                                                            ? gettext("Sold out")
                                                            : `$${numberFormat(option.deal_price, 0)}`}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        <select
                                            className="option"
                                            id={`${id}-quantity`}
                                            name="quantity"
                                            disabled={!saleOptionAvailable}
                                            onChange={this.handleOptionQuantityChange}>
                                            {this.getQuantityRange().map((e, i) => (
                                                <option key={`other-item-${itemIdx}-quantityOption-${i}`} value={e}>
                                                    {e}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="add_to_cart btns-green-embo"
                                            onClick={this.handleCartAddition}
                                            disabled={!saleOptionAvailable}>
                                            {gettext("Add to Cart")}
                                        </button>
                                    </span>
                                ) : (
                                    <span className="frm">
                                        <span className="notify-soldout">Sorry, this item has sold out</span>
                                        <button
                                            className={classnames("btns-green-embo btn-notify", {
                                                subscribed: waiting,
                                            })}
                                            onClick={this.handleNotifySoldout}>
                                            {waiting ? "Subscribed" : "Notify me when available"}
                                        </button>
                                    </span>
                                )}
                            </em>
                        </div>
                    </figure>
                    <figcaption>
                        <a
                            href={html_url}
                            className="title"
                            rel={`thing-${id}`}
                            onClick={this.handleLinkClick}
                            data-prevent-overlay="true">
                            <b className="title" {...getSafeNameProp(this.props)} />
                            {sales && (
                                <span
                                    className={`price ${discounting ? "sales" : ""} ${saleAvailable ? "" : "soldout"}`}>
                                    {discounting && (
                                        <small key="ThingCard2-price-deal">
                                            ${numberFormat(sales.retail_price, 0)}
                                        </small>
                                    )}
                                    {showFrom ? (
                                        <React.Fragment>
                                            <em className="from">from </em> ${numberFormat(sales.min_price, 0)}
                                        </React.Fragment>
                                    ) : (
                                        `$
                                        ${numberFormat(sales.deal_price, 0)}`
                                    )}
                                </span>
                            )}
                        </a>
                    </figcaption>
                    <a className="delete" onClick={this.handleRecentlyDelete} />
                </div>
            </li>
        ) : (
            <li className={classnames({ "quick-cart": loading, active: popupOpened || showCart })}>
                <div className={classnames("figure-item", { toggled: showCart })}>
                    <figure>
                        <a href={html_url} rel={`thing-${id}`} onClick={this.handleLinkClick}>
                            <span className="back" />
                            <img
                                className="figure"
                                style={{ backgroundImage: `url(${thumb_image_url_310})` }}
                                src="/_ui/images/common/blank.gif"
                            />
                        </a>
                    </figure>
                    <figcaption>
                        <span
                            className={classnames("show_cart", { opened: showCart })}
                            style={{ display: sales ? null : "none" }}>
                            {sales && (
                                <button
                                    className={`btn-cart nopopup ${discounting ? "sales" : ""} ${
                                        saleAvailable ? "" : "soldout"
                                    }`}
                                    onClick={this.handleQuickCartToggle}>
                                    <em>
                                        {discounting
                                            ? [
                                                  <small key="ThingCard2-price-deal">
                                                      ${numberFormat(sales.retail_price, 0)}
                                                  </small>,
                                                  `$${numberFormat(sales.deal_price, 0)}`,
                                              ]
                                            : `$${numberFormat(sales.deal_price, 0)}`}
                                    </em>
                                </button>
                            )}
                            <em className="sale-item-input">
                                <small
                                    className="trick"
                                    style={{ display: showCart ? "block" : null }}
                                    onClick={this.handleTrickClick}
                                />
                                {saleAvailable ? (
                                    <span className="frm">
                                        {saleOptionExists && (
                                            <select
                                                name="option_id"
                                                id={`${id}-option_id`}
                                                onChange={this.handleOptionChange}>
                                                {sales.options.map((option, i) => (
                                                    <option
                                                        key={`other-item-${itemIdx}-saleoption-${i}`}
                                                        value={option.id}>
                                                        {option.option} -{" "}
                                                        {!option.available_for_sale || option.quantity === 0
                                                            ? gettext("Sold out")
                                                            : `$${numberFormat(option.deal_price, 0)}`}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        <select
                                            className="option"
                                            id={`${id}-quantity`}
                                            name="quantity"
                                            disabled={!saleOptionAvailable}
                                            onChange={this.handleOptionQuantityChange}>
                                            {this.getQuantityRange().map((e, i) => (
                                                <option key={`other-item-${itemIdx}-quantityOption-${i}`} value={e}>
                                                    {e}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="add_to_cart btns-green-embo"
                                            onClick={this.handleCartAddition}
                                            disabled={!saleOptionAvailable}>
                                            {gettext("Add to Cart")}
                                        </button>
                                    </span>
                                ) : (
                                    <span className="frm">
                                        <span className="notify-soldout">Sorry, this item has sold out</span>
                                        <button
                                            className={classnames("btns-green-embo btn-notify", {
                                                subscribed: waiting,
                                            })}
                                            onClick={this.handleNotifySoldout}>
                                            {waiting ? "Subscribed" : "Notify me when available"}
                                        </button>
                                    </span>
                                )}
                            </em>
                        </span>
                        <a
                            href={html_url}
                            className="title"
                            rel={`thing-${id}`}
                            onClick={this.handleLinkClick}
                            {...getSafeNameProp(this.props)}
                        />
                        <span className={classnames("buttons" /*, { 'no-cart': saleAvailable }*/)}>
                            <FancydUsers thing={this.props} appContext={this.props.appContext} />
                            <MoreShare
                                objectType="thing"
                                objectId={id}
                                loggedIn={loggedIn}
                                title={getThingName(this.props)}
                                viewerUsername={viewer.username}
                                onShowSomething={this.handleShowSomething}
                            />
                        </span>
                    </figcaption>
                    {showDelete && <a className="delete" onClick={this.handleRecentlyDelete} />}
                </div>
            </li>
        );
    }
}
