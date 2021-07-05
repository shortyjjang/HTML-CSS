import React, { Component } from "react";
import classnames from "classnames";
import { floatFormatMinusTwo, numberFormat, renderPopup, escapeSelector, getLocationArgPairs } from "fancyutils";
import { Display } from "fancymixin";

import appState from "../../../appstate";
import { convertCurrency, updateSaleContext } from "../../../action/action-helpers";
import ActionButtons from "../action-buttons";
import { updateAppContext } from "../../../action/actions";
import {
    currencyIsUSD,
    getCurrentSaleOption,
    getSafeNameProp,
    getWaiting,
    isSalesOptionsAvailable,
    getSales,
    getDomesticDeliveryDate,
    getIntlDeliveryDate,
} from "../../map";
import { Keys } from "../../Perf";
import { CartButton, SelectBox, handlePurchase, MultiOption, MultiOptionState } from "./Mixin";
import { getCountryByCode } from "../../../data/Countries";
import { OverlayPropsV1 } from "ftypes";

function optionValueFunction(opt) {
    return opt.id;
}
const saleNamePrinter = (opt) => `${opt.name} - $${opt.price}`;

export default class SaleItemSidebarHead extends Component<
    OverlayPropsV1,
    {
        loading: boolean;
        selected: Object;
        disabled: Array<any>;
    }
> {
    state = {
        loading: false,
        selected: {},
        disabled: [],
    };

    constructor(props: OverlayPropsV1) {
        super(props);
        this.handlePurchase = handlePurchase.bind(this);
        // for multi options
        this.onClickThumbnail = this.onClickMultiOptionGen("thumbnail");
        this.onClickSwatch = this.onClickMultiOptionGen("swatch");
        this.onMultiSelectBoxChange = this.onClickMultiOptionGen("dropdown");
        this.onClickMutliButton = this.onClickMultiOptionGen("button");
    }

    renderCurrencyPopup = () => {
        import(/* webpackChunkName: "OverlayThing.popup" */ "../../popup/index").then(({ CurrencyPopup }) => {
            renderPopup(CurrencyPopup, { currentCurrency: this.props.saleContext.currencyCode });
        });
    };

    handleCurrencyPopup = (event: React.SyntheticEvent<EventTarget>) => {
        event.preventDefault();
        this.renderCurrencyPopup();
    };

    handleCurrencyPopupUSD = (event: React.SyntheticEvent<EventTarget>) => {
        event.preventDefault();
        if (!currencyIsUSD(this.props)) {
            return false;
        }
        this.renderCurrencyPopup();
    };

    getApproxText = () => {
        var { currencySymbol, currencyMoney } = this.props.saleContext;
        var approxText = gettext("Approximately");
        return `${approxText} ${currencySymbol}${currencyMoney} `;
    };

    handleOptionChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const saleOptionID = parseInt(event.currentTarget.value, 10);
        dispatch(updateSaleContext({ saleOptionID }));
    };

    handleQuantityChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const selectedQuantity = parseInt(event.currentTarget.value, 10);
        dispatch(updateSaleContext({ selectedQuantity }));
    };

    handlePersonalizationChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const personalization = event.currentTarget.value;
        dispatch(updateSaleContext({ personalization }));
    };

    handleNotifyLater = (event: React.SyntheticEvent<EventTarget>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!appState.loggedIn) {
            return window.require_login();
        }
        const {
            thing: { sales },
            saleContext,
        } = this.props;
        const opt = getCurrentSaleOption(sales, saleContext, true);
        const params = { sale_item_id: sales.id };

        if (opt != null) {
            params.option_id = opt.id;
        }

        const waiting = getWaiting(sales, saleContext);
        if (waiting) {
            params.remove = 1;
        }

        $.ajax({
            type: "post",
            url: "/wait_for_product.json",
            data: params,
            dataType: "json",
        }).done((json) => {
            if (!json || json.status_code == null) {
                return;
            }
            if (json.status_code == 0 && json.message) {
                alertify.alert(json.message);
                return;
            }
            const waiting = params.remove ? false : true;
            this.props.dispatch(updateSaleContext({ waiting }));
        });
    };

    checkApplePay = () => {
        if (window.FancyApplePay) {
            const { sales } = this.props.thing;
            const os = sales.options.filter((o) => !o.soldout);
            const data = {
                total: { label: sales.title, amount: (sales.price * 100) | 0 },
            };

            if (os.length > 0) {
                data.displayItems = os.map((o) => ({
                    label: o.name,
                    amount: (Number(o.price) * 100) | 0,
                }));
            }

            FancyApplePay.checkAvailability((available, testmode) => {
                if (available) {
                    this.props.dispatch(
                        updateAppContext({
                            applePayDisplay: true,
                            applePayTest: testmode,
                        })
                    );
                }
            }, data);
        }
    };

    componentDidMount() {
        if (!currencyIsUSD(this.props)) {
            const { saleContext } = this.props;
            convertCurrency(saleContext.currencyCode, saleContext.price);
        }
        this.initializeMultiOption();
        this.checkApplePay();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.thing.id !== this.props.thing.id) {
            this.initializeMultiOption();
            this.checkApplePay();
            return;
        }

        const {
            saleContext,
            thing: { sales },
        } = prevProps;

        const nsc = this.props.saleContext;
        const nextSaleOptionID = nsc.saleOptionID;
        if (saleContext.saleOptionID !== nextSaleOptionID) {
            const o = _.find(sales.options, (_o) => _o.id === nextSaleOptionID);
            // option sync
            if (o) {
                const mos = $(".sale-item-input .multi-option");
                o.values.forEach((v, i) => {
                    const so = mos
                        .eq(i)
                        .find(`[data-value="${escapeSelector(v)}"]:not(.selected)`)
                        .get(0);
                    if (so) {
                        so.click();
                    }
                });
                if (window.FancyApplePay && FancyApplePay.paymentRequest) {
                    FancyApplePay.paymentRequest.update({
                        total: {
                            label: o.name,
                            amount: (Number(o.price) * 100) | 0,
                        },
                    });
                }
            }
        }
    }

    initializeMultiOption = () => {
        const {
            thing: {
                sales: { options, option_meta },
            },
            saleContext,
            dispatch,
        } = this.props;

        this.setState(this.getInitialMultiOptionState(options, option_meta), () => {
            // don't block selecting cheapest item
            if (!(options && options.length > 1)) {
                this.updateSaleOptionIDFromMultiOptionState();
            }
            // ?option={number} support
            const presetOptionId = getLocationArgPairs("option");
            if (presetOptionId && presetOptionId[1] && String(saleContext.saleOptionID) !== presetOptionId[1]) {
                dispatch(updateSaleContext({ saleOptionID: parseInt(presetOptionId[1], 10) }));
            }
        });
    };

    getInitialMultiOptionState(options, option_meta) {
        const selected = { swatch: [], button: [], thumbnail: [], dropdown: [] };
        if (option_meta.length > 0) {
            const nonSoldout = options.filter((o) => o.quantity !== 0);
            if (nonSoldout.length !== 0) {
                const selectedNonSoldoutOption = nonSoldout[0]; // temporary - FIXME
                option_meta.forEach(function (opt, i) {
                    const { type } = opt;
                    const nextValue = selectedNonSoldoutOption.values[i];
                    selected[type].push(nextValue);
                });
            } else {
                // set first available multi option
                option_meta.forEach(function (opt) {
                    const { type } = opt;
                    const nextValue = opt.values[0];
                    selected[type].push(nextValue);
                });
            }
        }
        const multiOptionState = new MultiOptionState(options, option_meta);
        return { selected, multiOptionState };
    }

    extractSaleOptionIDFromMultiOptionState = (selected) => {
        const {
            thing: { sales },
        } = this.props;
        if (selected == null) {
            selected = this.state.selected;
        }
        const { multiOptionState } = this.state;

        const selectedOptionName = multiOptionState.option_meta
            .map((m) => {
                const order = multiOptionState.orderMap[m.type][m.name];
                if (selected[m.type][order]) {
                    return selected[m.type][order].replace(" / ", "/");
                } else {
                    return selected[m.type][0];
                }
            })
            .join(" / ");
        const selectedOption = _.find(sales.options, (opt) => opt.name === selectedOptionName);
        if (selectedOption) {
            return selectedOption.id;
        } else {
            window.DEBUG &&
                console.warn("no option found for ", selectedOptionName, "meta:", sales.options, this.state.selected);
        }
    };

    updateSaleOptionIDFromMultiOptionState = () => {
        const { dispatch } = this.props;
        let saleOptionID = this.extractSaleOptionIDFromMultiOptionState();
        if (saleOptionID === undefined) {
            const amendedID = this.amendSaleOptionFromMultiOptionState();
            if (amendedID) {
                saleOptionID = amendedID;
            } else {
                window.DEBUG && console.warn("Couldn't recover option");
            }
        }
        dispatch(updateSaleContext({ saleOptionID }));
    };

    amendSaleOptionFromMultiOptionState = () => {
        const { selected, multiOptionState } = this.state;
        const nextSelected = { swatch: [], button: [], thumbnail: [], dropdown: [] };
        multiOptionState.option_meta.forEach(({ type, name }, index) => {
            const order = multiOptionState.orderMap[type][name];
            const selectedValue = selected[type][order];
            if (index === 0) {
                nextSelected[type][order] = selectedValue;
                return;
            }
            const values = multiOptionState.getPossibleValuesForIndex(selected, index);
            let value;
            if (values.some((v) => v === selectedValue)) {
                value = selectedValue;
            } else {
                value = values[0];
            }
            selected[type][order] = value; // even though it will be flushed out, it will affect next options so fix it as well
            nextSelected[type][order] = value;
        });
        this.setState({ selected: nextSelected });
        return this.extractSaleOptionIDFromMultiOptionState(nextSelected);
    };

    onClickMultiOptionGen = (type) => {
        return (e) => {
            const el = e.currentTarget;
            let value;
            let indexOfType;
            if (el.tagName === "SELECT") {
                value = el.value;
                indexOfType = Number($(el).find(":selected").attr("data-index-typeof"));
            } else {
                value = $(el).attr("data-value");
                indexOfType = Number($(el).attr("data-index-typeof"));
            }
            if (e.currentTarget.className === "disabled") {
                return;
            }

            this.state.selected[type][indexOfType] = value;
            // forceful trigger even though no differences in value.
            this.setState({ selected: _.extend({}, this.state.selected) }, this.updateSaleOptionIDFromMultiOptionState);
        };
    };

    onClickThumbnail = null;
    onClickSwatch = null;
    onMultiSelectBoxChange = null;
    onClickMutliButton = null;

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { saleContext } = this.props;
        const nsc = nextProps.saleContext;
        const priceChanges = saleContext.price !== nsc.price;
        const currencyChanges = saleContext.currencyCode !== nsc.currencyCode;
        if (priceChanges || currencyChanges) {
            if (!currencyIsUSD(nextProps)) {
                const { saleContext } = nextProps;
                convertCurrency(saleContext.currencyCode, saleContext.price, true); // FIXME: unable to comparison since price update comes first (SaleItemSidebarHead.componentWillReceiveProps())
            }
        }
    }

    isOptionMulti(): boolean {
        const {
            thing: { sales },
        } = this.props;
        // sales.
        if (sales.option_meta.length > 1) {
            return true;
        } else if (sales.option_meta.length === 1) {
            return sales.option_meta[0].type !== "dropdown";
        } else {
            return false;
        }
    }

    render() {
        const {
            thing: { sales },
            appContext: { applePayDisplay },
            saleContext,
            saleContext: { currencyCode, currencySymbol, currencyMoney, selectedQuantity, price },
        } = this.props;

        var opt = getCurrentSaleOption(sales, saleContext);
        var discountPercentage = parseFloat(opt.discount_percentage); // TODO: use decimal?
        var retailPrice = opt.retail_price;
        const { soldout, quantity, remaining_quantity } = opt;
        const { option_meta } = sales;
        const optionIsMulti = this.isOptionMulti();

        const salesOptionsAvailable = isSalesOptionsAvailable(sales);
        const discounting = discountPercentage > 0;
        const converted = currencySymbol != null && currencyMoney != null;
        const currencyCodeStyle = { display: converted && !currencyIsUSD(this.props) ? "block" : "none" };
        const quantitySelectRange = soldout ? ["1"] : _.range(1, Math.min(10, (quantity || remaining_quantity) + 1));
        const showSelectbox = sales.options.length !== 0;

        var cartButtonStyle;
        if (!soldout) {
            cartButtonStyle = { display: "none" };
        }
        const waiting = getWaiting(sales, saleContext);

        var applePayButton;
        if (applePayDisplay && !soldout) {
            applePayButton = <ApplePayButton {...this.props} />;
        }

        return (
            <div key={Keys.Sidebar.Wrap}>
                <div className="wrapper figure-info" key={Keys.Sidebar.Body}>
                    <h1 key={Keys.Sidebar.Title} className="title" {...getSafeNameProp(sales)} />
                    <p className="price" key={Keys.Sidebar.Price}>
                        <big className={classnames({ sale: discounting })}>
                            ${floatFormatMinusTwo(price)}
                            <small className="usd">
                                <a
                                    className={classnames("code", { "currently-usd": currencyIsUSD(this.props) })}
                                    onClick={this.handleCurrencyPopupUSD}>
                                    USD
                                </a>
                            </small>
                        </big>
                        {discounting && (
                            <span className="sales">
                                <em>${floatFormatMinusTwo(retailPrice, 2)}</em> (Save{" "}
                                {numberFormat(discountPercentage, 0)}%)
                            </span>
                        )}
                        <span className="currency_price" style={currencyCodeStyle}>
                            {this.getApproxText()}
                            <a className="code" onClick={this.handleCurrencyPopup}>
                                {currencyCode}
                            </a>
                        </span>
                    </p>
                    <div className="frm" key={Keys.Sidebar.Form}>
                        <fieldset className="sale-item-input">
                            {showSelectbox && !optionIsMulti && (
                                <SelectBox
                                    id="option"
                                    label={gettext("Option")}
                                    currentValue={opt}
                                    value={optionValueFunction}
                                    printer={saleNamePrinter}
                                    options={sales.options}
                                    expander={SaleItemOptionsExpander}
                                    disabled={!salesOptionsAvailable}
                                    onChange={this.handleOptionChange}
                                    handleSizeGuidePopup={this.handleSizeGuidePopup}
                                />
                            )}
                            {showSelectbox && !optionIsMulti && (
                                <SelectBox
                                    id="quantity"
                                    label={gettext("Quantity")}
                                    defaultValue="1"
                                    currentValue={selectedQuantity}
                                    options={quantitySelectRange}
                                    disabled={!!soldout}
                                    onChange={this.handleQuantityChange}
                                />
                            )}
                            {optionIsMulti && (
                                <MultiOption
                                    sid={sales.id}
                                    onClickThumbnail={this.onClickThumbnail}
                                    onClickSwatch={this.onClickSwatch}
                                    onMultiSelectBoxChange={this.onMultiSelectBoxChange}
                                    onClickMutliButton={this.onClickMutliButton}
                                    selected={this.state.selected}
                                    disabled={this.state.disabled}
                                    soldout={!!soldout}
                                    option_meta={option_meta}
                                    multiOptionState={this.state.multiOptionState}
                                />
                            )}
                            {sales.personalizable && (
                                <div className="personalization">
                                    <label>This item can be personalized</label>
                                    <input
                                        type="text"
                                        className="text"
                                        name="personalization"
                                        placeholder="Personalization details"
                                        onChange={this.handlePersonalizationChange}
                                    />
                                </div>
                            )}
                            {applePayButton}
                            <CartButton
                                onClick={this.handlePurchase}
                                className={classnames("add_to_cart btn-cart", {
                                    "btns-blue-embo disabled": soldout,
                                    "btns-green-embo": !soldout,
                                })}
                                disabled={!!soldout}
                                label={soldout ? gettext("Sold out") : gettext("Add to cart")}
                            />
                        </fieldset>
                        <CartButton
                            className={classnames("btn-create notify-available", { subscribed: waiting })}
                            label={waiting ? gettext("Subscribed") : gettext("Notify me when available")}
                            style={cartButtonStyle}
                            onClick={this.handleNotifyLater}
                        />
                        <SalesOverview {...this.props} />
                        <ActionButtons {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}

function SaleItemOptionsExpander(sio, idx) {
    return (
        <option value={sio.id} key={`sale_options-${idx}`}>
            {sio.soldout === true || !(sio.quantity > 0) ? `${sio.name} - ${gettext("Sold out")}` : sio.name}
        </option>
    );
}

class ApplePayButton extends Component {
    handleApplePayCheckout = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (window.FancyApplePay.clicked) {
            return;
        }
        window.FancyApplePay.clicked = true;
        const {
            appContext: { /*applePayDisplay, */ applePayTest },
        } = this.props;
        const {
            thing: { sales },
            saleContext: { saleOptionID, selectedQuantity, price },
        } = this.props;
        const salesOptionsAvailable = isSalesOptionsAvailable(sales);

        var title = sales.title;
        var country = sales.seller.country;
        var sale_item_id = sales.id;
        var seller_id = sales.seller.id;
        var quantity = selectedQuantity;

        var option_id = null;
        var option = null;
        if (salesOptionsAvailable) {
            option_id = parseInt(saleOptionID, 10) || null; // ? should be same value with option except get casted
            option = saleOptionID;
        }

        try {
            window.FancyApplePay.requestPurchase("Dynamic", {
                sale_item_id,
                seller_id,
                option_id,
                quantity,
                price,
                title,
                option,
                country,
                testmode: applePayTest,
            });
        } catch (err) {
            window.DEBUG && console.trace(err);
            alert(err);
            window.FancyApplePay.clicked = false;
        }
    };

    render() {
        return (
            <div
                className="apple-pay-button apple-pay-thing-button apple-pay-button-with-text apple-pay-button-black-with-text checkout-express"
                onClick={this.handleApplePayCheckout}>
                <span className="text">Buy With</span>
                <span className="logo" />
            </div>
        );
    }
}

export class SalesOverview extends Component {
    handleShipCountryClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const {
            appContext: { userCountry },
            dispatch,
        } = this.props;
        import(/* webpackChunkName: "OverlayThing.popup" */ "../../popup/index").then(({ ShippingCountriesPopup }) => {
            renderPopup(ShippingCountriesPopup, { dispatch, userCountry });
        });
    };

    handlePolicyDislplay = (event) => {
        event.preventDefault();
        const {
            thing: { sales },
        } = this.props;
        if (sales) {
            import(/* webpackChunkName: "OverlayThing.popup" */ "../../popup/index").then(
                ({ ReturnPolicyDetailPopup }) => {
                    renderPopup(ReturnPolicyDetailPopup, { sales });
                }
            );
        }
    };

    handleSizeGuidePopup = (event) => {
        event.preventDefault();
        import(/* webpackChunkName: "OverlayThing.popup" */ "../../popup/index").then(({ SizeGuidePopup }) => {
            renderPopup(SizeGuidePopup, this.props);
        });
    };

    render() {
        const {
            appContext: { userCountry },
            thing,
            type,
        } = this.props;

        const sales = getSales(type, thing)!;
        const hasSizeGuide = sales.size_guide_id != null; /*|| (sales.size_chart_ids && sales.size_chart_ids.length)*/
        const deliveryIsDomestic = sales && userCountry === "US";
        const ableToShip =
            (deliveryIsDomestic && sales.expected_delivery_day_1) ||
            (userCountry !== "US" && sales.international_shipping);
        const hideShippingWindow = deliveryIsDomestic && !sales.expected_delivery_day_1;

        var deliveryDate;
        if (ableToShip) {
            if (deliveryIsDomestic) {
                deliveryDate = getDomesticDeliveryDate(sales);
            } else {
                deliveryDate = getIntlDeliveryDate(sales);
            }
        }

        const shippingInfo : { [k:string] : any } = sales.shipping_info || {};

        return (
            <div className="overview">
                <label>Overview</label>
                <ul className="after">
                    {shippingInfo.cost && <li className="tips">{shippingInfo.cost}</li>}
                    <li
                        className={`${deliveryIsDomestic ? "domestic" : "international"} shipping`}
                        style={Display.NoneIf(hideShippingWindow)}>
                        <label>{deliveryDate ? gettext("Estimated Delivery") : gettext("Delivery")}</label>
                        <span className="able">{shippingInfo.window}</span>
                    </li>
                    {shippingInfo.origin && (
                        <li className="shipping">
                            <span>{shippingInfo.origin}</span>
                        </li>
                    )}
                    {sales.return_exchange_policy_title && (
                        <li>
                            <label>{gettext("Return policy")}</label>
                            <span>
                                {sales.return_exchange_policy_title + ". "}
                                <a onClick={this.handlePolicyDislplay}>{gettext("View details")}</a>
                            </span>
                        </li>
                    )}
                    {hasSizeGuide && (
                        <li className="sizeguide">
                            <a href="#" onClick={this.handleSizeGuidePopup}>
                                View size guide
                            </a>
                        </li>
                    )}
                </ul>
                <div className="description">
                    <div className={classnames("detail show")}>
                        <h4 className="tit">{gettext("Description")}</h4>
                        <div dangerouslySetInnerHTML={{ __html: sales.description }} />
                    </div>
                </div>
            </div>
        );
    }
}
