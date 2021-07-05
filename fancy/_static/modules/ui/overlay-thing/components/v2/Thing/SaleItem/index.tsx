import React, { Component } from "react";
import classnames from "classnames";
import { floatFormatMinusTwo, numberFormat, renderPopup, escapeSelector, getLocationArgPairs } from "fancyutils";

import { convertCurrency, updateSaleContext } from "../../../../action/action-helpers";
import { updateAppContext } from "../../../../action/actions";
import { currencyIsUSD, getCurrentSaleOption, getSafeNameProp, isSalesOptionsAvailable } from "../../../map";
import { Keys } from "../../../Perf";
import { SelectBox, MultiOption, MultiOptionState } from "../SaleItemForm";
import type { OverlayProps, ReduxProps, SaleOption, SelectedMetaOption, SaleOptionMeta } from "ftypes";
import type { ISaleItemSidebarHeadProps, ISaleItemSidebarHeadState } from './type';
import CartButton from './CartButton';
import { isOptionMulti } from './multiOption';
import ApplePayButton from './ApplePayButton';

function optionValueFunction(opt) {
    return opt?.id;
}
const saleNamePrinter = (opt) => `${opt.name} - $${opt.price}`;

const { Fancy, alertify } = window;

const Price = ({ discounting, price, retailPrice, discountPercentage }) => {
    return <div className="price" key={Keys.Sidebar.Price}>
        <big className={classnames({ sale: discounting })}>
            ${floatFormatMinusTwo(price)}
        </big>
        {discounting && (
            <span className="sales">
                <em>${floatFormatMinusTwo(retailPrice)}</em> (Save {numberFormat(discountPercentage, 0)}
                            %)
            </span>
        )}
    </div>
}

export default class SaleItemSidebarHead extends Component<
    ISaleItemSidebarHeadProps, ISaleItemSidebarHeadState
> {
    state = {
        loading: false,
        showSelectWarning: false,
        selected: {},
        disabled: [],
        multiOptionState: null,
    };

    static defaultProps = {
        showInfo: true,
    };

    constructor(props: OverlayProps & ReduxProps) {
        super(props);
        // for multi options
        this.onClickThumbnail = this.onClickMultiOptionGen("thumbnail");
        this.onClickSwatch = this.onClickMultiOptionGen("swatch");
        this.onMultiSelectBoxChange = this.onClickMultiOptionGen("dropdown");
        this.onClickMutliButton = this.onClickMultiOptionGen("button");
    }

    renderCurrencyPopup = () => {
        import(/* webpackChunkName: "OverlayThing.popup" */ "../../../popup/index").then(({ CurrencyPopup }) => {
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

    handlePurchase = (event) => {
        event.preventDefault();
        const {
            thing: { sales },
            saleContext,
        } = this.props;
        const saleOption = getCurrentSaleOption(sales, saleContext, true);
        const soldout = saleOption == null ? sales.soldout : saleOption.soldout;
        if (soldout || this.state.loading) {
            return;
        }
        const optionIsMulti = isOptionMulti(sales);
        const saleOptionID = saleOption != null ? saleOption.id : null;
        if (!optionIsMulti && sales.options.length > 0 && saleContext.saleOptionID === null) {
            this.setState({ showSelectWarning: true });
            return;
        }

        this.setState({ showSelectWarning: false, loading: true }, () => {
            const payload = {
                sale_id: sales.id,
                quantity: saleContext.selectedQuantity,
                personalization: saleContext.personalization,
            };
            if (saleOptionID != null) {
                payload.option_id = saleOptionID;
            }
            Fancy.CartAPI.addItem(payload, (success, json) => {
                if (success) {
                    $.dialog('thing-quickview').close();
                    Fancy.Cart.openPopup();
                } else {
                    alertify.alert((json && json.error) || "Failed to add the item to cart. Please contact us at cs@fancy.com if the problem persists.");
                }
                this.setState({ loading: false });
            })
        });
    }

    handleOptionChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        if (!event.currentTarget.value) {
            dispatch(updateSaleContext({ saleOptionID: null }));
        } else {
            const saleOptionID = parseInt(event.currentTarget.value, 10);
            dispatch(updateSaleContext({ saleOptionID }));
        }
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

    checkApplePay = () => {
        if (window.FancyApplePay) {
            const { dispatch, thing, thing: { sales } } = this.props;
            const os = sales.options.filter((o) => !o.soldout);
            const data = {
                total: { label: thing.name, amount: (sales.price * 100) | 0 },
            };

            if (os.length > 0) {
                data.displayItems = os.map((o) => ({
                    label: o.name,
                    amount: (Number(o.price) * 100) | 0,
                }));
            }

            window.FancyApplePay.checkAvailability((available, testmode) => {
                if (available) {
                    dispatch(
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

    componentDidUpdate(prevProps: OverlayProps) {
        if (prevProps.thing.id !== this.props.thing.id) {
            this.initializeMultiOption();
            this.checkApplePay();
            if (this.state.showSelectWarning) {
                this.setState({
                    showSelectWarning: false,
                });
            }
            return;
        }

        const {
            saleContext,
            thing: { sales },
        } = prevProps;

        const nsc = this.props.saleContext;
        const nextSaleOptionID = nsc.saleOptionID;
        if (saleContext.saleOptionID !== nextSaleOptionID) {
            if (this.state.showSelectWarning) {
                this.setState({ showSelectWarning: false });
            }
            const o = _.find(sales.options, (_o) => _o.id === nextSaleOptionID);
            // option sync
            if (o) {
                const mos = $(".sale-item-input .multi-option");
                o.values.forEach((v, i) => {
                    const $so = mos
                        .eq(i)
                        .find(`[data-value="${escapeSelector(v)}"]:not(.selected)`)
                        .eq(0);
                    if ($so.length) {
                        if ($so.is("option"))
                            $so.prop("selected", true);
                        else
                            $so.get(0).click();
                    }
                });
                if (window.FancyApplePay && window.FancyApplePay.paymentRequest) {
                    window.FancyApplePay.paymentRequest.update({
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

    getInitialMultiOptionState(options: SaleOption[], option_meta: SaleOptionMeta[]) {
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

    extractSaleOptionIDFromMultiOptionState = (selected?: SelectedMetaOption) => {
        const {
            thing: { sales },
        } = this.props;
        if (selected == null) {
            selected = this.state.selected;
        }
        const { multiOptionState } = this.state;

        const selectedOptionArray = multiOptionState.option_meta
            .map((m) => {
                const order = multiOptionState.orderMap[m.type][m.name];
                if (selected[m.type][order]) {
                    return selected[m.type][order];
                } else {
                    return selected[m.type][0];
                }
            });
        const selectedOption = _.find(sales.options, (opt) => selectedOptionArray.every((e, i) => e === opt.values[i]));
        if (selectedOption) {
            return selectedOption.id;
        } else {
            window.DEBUG &&
                console.warn("no option found for ", selectedOptionArray, "meta:", sales.options, this.state.selected);
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

    render() {
        const {
            thing,
            thing: { sales },
            appContext: { applePayDisplay },
            saleContext,
            saleContext: { selectedQuantity, price },
            showInfo,
        } = this.props;
        const { showSelectWarning } = this.state;

        const opt = getCurrentSaleOption(sales, saleContext) as SaleOption;
        const discountPercentage = parseFloat(opt.discount_percentage); // TODO: use decimal?
        const retailPrice = opt.retail_price;
        const { soldout, quantity } = opt;
        const { option_meta } = sales;
        const optionIsMulti = isOptionMulti(sales);

        const salesOptionsAvailable = isSalesOptionsAvailable(sales);
        const discounting = discountPercentage > 0;
        const quantitySelectRange = soldout
            ? ["1"]
            : _.range(1, Math.min(10, (quantity || 0) + 1));
        const showSelectbox = sales.options.length !== 0;

        var applePayButton;
        if (applePayDisplay && !soldout) {
            applePayButton = <ApplePayButton {...this.props} />;
        }

        return (
            <>
                {showInfo ? <>
                    <h1 key={Keys.Sidebar.Title} className="title" {...getSafeNameProp(thing)} />
                    <Price {...{ discounting, price, retailPrice, discountPercentage }} />
                </> : null}
                <div className="frm" key={Keys.Sidebar.Form}>
                    <fieldset className="sale-item-input">
                        {showSelectbox && !optionIsMulti && (
                            <SelectBox
                                className="multi-option"
                                id="option"
                                label={gettext("Option")}
                                currentValue={(opt.soldout || saleContext.saleOptionID !== null) ? opt : ""}
                                value={optionValueFunction}
                                printer={saleNamePrinter}
                                options={sales.options}
                                unselectedLabel="Please select"
                                expander={SaleItemOptionsExpander}
                                disabled={!salesOptionsAvailable}
                                onChange={this.handleOptionChange}
                                showSelectWarning={showSelectWarning}
                                SizeGuide={() => {
                                    const hasSizeGuide = sales.size_guide_id != null;
                                    return hasSizeGuide ? (
                                        <a
                                            className="size-guide"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                import(
                                                    /* webpackChunkName: "OverlayThing.popup" */ "../../../popup/index"
                                                ).then(({ SizeGuidePopup }) => {
                                                    renderPopup(SizeGuidePopup, this.props);
                                                });
                                            }}>
                                            Size guide
                                        </a>
                                    ) : null;
                                }}
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
                                SizeGuide={() => {
                                    const hasSizeGuide = sales.size_guide_id != null;
                                    return hasSizeGuide ? (
                                        <a
                                            className="size-guide"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                import(
                                                    /* webpackChunkName: "OverlayThing.popup" */ "../../../popup/index"
                                                ).then(({ SizeGuidePopup }) => {
                                                    renderPopup(SizeGuidePopup, this.props);
                                                });
                                            }}>
                                            Size guide
                                        </a>
                                    ) : null;
                                }}
                                multiOptionState={this.state.multiOptionState}
                            />
                        )}
                        {sales.personalizable && (
                            <div className="personalization">
                                <label>This item can be personalized:</label>
                                <input
                                    type="text"
                                    className="text"
                                    name="personalization"
                                    placeholder="Personalization details"
                                    onChange={this.handlePersonalizationChange}
                                />
                            </div>
                        )}
                        <SelectBox
                            id="quantity"
                            className="multi-option"
                            label={gettext("Quantity")}
                            defaultValue="1"
                            currentValue={selectedQuantity}
                            options={quantitySelectRange}
                            disabled={!!soldout}
                            onChange={this.handleQuantityChange}
                        />
                        {applePayButton}
                        {showSelectWarning && <div className="error">Please select from the available option</div>}
                        <CartButton onPurchase={this.handlePurchase} loading={this.state.loading} />
                    </fieldset>
                </div>
            </>
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
