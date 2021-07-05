import React from "react";
import classnames from "classnames";
import { getCurrentSaleOption, getThingName } from "../../map";
import { addItemToCart, logAddCartMixpanel } from "../../map.cart";

// Generic purchase handler, needs to be bound to insatnce on initialization.
/*
    data-sii={sales.id}
    data-sisi={sales.seller_id}
    data-tid={thing.id}
*/
export function handlePurchase(event) {
    event.preventDefault();
    const {
        thing,
        thing: { sales },
        saleContext
    } = this.props;
    const saleOption = getCurrentSaleOption(sales, saleContext, true);
    const soldout = saleOption == null ? sales.soldout : saleOption.soldout;
    if (soldout || this.state.loading) {
        return;
    }
    const saleOptionID = saleOption != null ? saleOption.id : null;

    this.setState({ loading: true }, () => {
        const log = {
            salesID: sales.id
        };
        if (saleOption) {
            log.saleOptionID = saleOptionID;
        }
        logAddCartMixpanel(log);
        const request = {
            thing_id: thing.id,
            seller_id: thing.sales.seller.id,
            sale_item_id: sales.id,
            quantity: saleContext.selectedQuantity,
            personalization: saleContext.personalization
        };
        if (saleOptionID != null) {
            request.option_id = saleOptionID;
        }
        const discounting = sales && sales.discount_percentage !== "0";
        const meta = {
            title: getThingName(thing),
            price: discounting ? sales.retail_price : sales.deal_price,
            brand_name: sales.seller.brand_name
        };
        addItemToCart(
            request,
            () => {
                this.setState({ loading: false });
            },
            meta
        );
    });
}

const SaleOptions = ({
    options = ["1"],
    currentValue = "1",
    id = "",
    value = v => v,
    expander,
    defaultValue,
    printer,
    disabled,
    onChange,
    onClick,
    onFocus,
    unselectedLabel
}) => {
    expander =
        expander ||
        ((option, idx) => (
            <option key={`sale_options-${idx}`} value={value(option)}>
                {printer(option)}
            </option>
        ));

    return (
        <select
            id={id}
            className={classnames("select-boxes2", { 'one-option': options.length <= 1 })}
            value={value(currentValue) || defaultValue}
            disabled={disabled}
            onChange={onChange}
            onClick={onClick}
            onFocus={onFocus}>
            {unselectedLabel && <option value="">{unselectedLabel}</option>}
            {options.map(expander)}
        </select>
    );
};

export const CartButton = props => (
    <button {...props} label={null}>
        {props.label}
    </button>
);

export const SelectBox = props => {
    let { className, disabled, label, currentValue, defaultValue, id, printer, tabIndex, unselectedLabel, options = ['1'] } = props;

    printer = printer != null ? printer : s => s;
    defaultValue = defaultValue != null ? defaultValue : "1";
    className = className != null ? className : null;

    var labelValue;
    if (unselectedLabel != null && currentValue === "") {
        labelValue = unselectedLabel;
    } else {
        labelValue = printer(currentValue != null ? currentValue : defaultValue);
    }

    return (
        <p className={className}>
            <label>{label}</label>
            <span className={`trick-select ${id}`}>
                <a className={classnames("selectBox", { disabled, 'one-option': options.length <= 1 })} tabIndex={tabIndex || "1"}>
                    <span className="selectBox-label">{labelValue}</span>
                    <span className="selectBox-arrow" />
                </a>
                <SaleOptions {...props} printer={printer} defaultValue={defaultValue} />
            </span>
        </p>
    );
};

export class MultiOptionState {
    constructor(options, option_meta) {
        this.options = options;
        this.option_meta = option_meta;
        const orderMap = {};
        option_meta.forEach(m => {
            if (orderMap[m.type] == null) {
                orderMap[m.type] = { length: 1 };
                orderMap[m.type][m.name] = 0;
            } else {
                orderMap[m.type][m.name] = orderMap[m.type].length;
                orderMap[m.type].length += 1;
            }
        });
        this.orderMap = orderMap;
    }
    // i.e.) getPossibleValues(['a', '1', '가'], 1) => ['1', '3', '6']
    // output: get possible options for 2nd option dependent on ('a' / 1st option)
    getPossibleValuesForIndex(selected, targetIndex) {
        const { options, option_meta, orderMap } = this;
        if (targetIndex === 0) {
            return option_meta[0].values;
        }
        let filteredOptions = options;
        option_meta
            .map(m => {
                const order = orderMap[m.type][m.name];
                if (selected[m.type][order]) {
                    return selected[m.type][order];
                } else {
                    return selected[m.type][0];
                }
            })
            .forEach((sel, idx) => {
                if (idx < targetIndex) {
                    filteredOptions = filteredOptions.filter(option => option.values[idx] === sel);
                }
            });
        return _.uniq(filteredOptions.map(o => o.values[targetIndex])); // FIXME
    }

    getMultiOptions(selected) {
        return this.option_meta.map((meta, idx) => {
            return [meta, this.getPossibleValuesForIndex(selected, idx)];
        });
        /*
        returns [
            [type, ['a', 'b', 'c']],
            [type, ['1', '2']],
            [tyep, ['red', 'white', 'black']]
        ]
        */
    }
}

export const MultiOption = props => {
    const { selected, multiOptionState, sid } = props;
    if (multiOptionState == null) {
        return null;
    } 
    const multiOptions = multiOptionState.getMultiOptions(selected);
    return multiOptions.map(([meta, values], idx) => {
        const { type, name } = meta;

        const indexTypeOf = multiOptionState.orderMap[type] && multiOptionState.orderMap[type][name];
        const additional = {
            name,
            values,
            indexTypeOf,
            selectedArray: selected && selected[type],
            selectedValue: selected && selected[type] && selected[type][indexTypeOf],
            key: `${sid}-${idx}`
        };
        if (type === "dropdown") {
            return <MultiSelectBox {...props} {...additional} />;
        } else if (type === "swatch") {
            additional.swatch = meta.swatch;
            return <MultiSwatch {...props} {...additional} />;
        } else if (type === "thumbnail") {
            additional.thumbnail = meta.thumbnail;
            return <MultiThumbnail {...props} {...additional} />;
        } else if (type === "button") {
            return <MultiButton {...props} {...additional} />;
        }
    });
};

export const MultiSelectBox = props => {
    const { values, name, onMultiSelectBoxChange, indexTypeOf, selectedValue } = props;
    return (
        <div className="multi-option">
            <label>{name}</label>
            <select onChange={onMultiSelectBoxChange} selected={selectedValue} className={values.length <= 1 ? 'one-option' : null}>
                {values.map(value => {
                    return <MultiSelectBoxOption value={value} indexTypeOf={indexTypeOf} />
                })}
            </select>
        </div>
    );
};

const MultiSelectBoxOption = props => {
    const { value, indexTypeOf } = props;
    return (
        <option data-value={value} data-index-typeof={indexTypeOf} value={value}>
            {value}
        </option>
    );
};

export const MultiSwatch = props => {
    const { name, values, swatch, indexTypeOf, selectedValue, onClickSwatch } = props;
    return (
        <div className="multi-option swatch">
            <label>{name}</label>
            <span className="value">{selectedValue}</span>
            <ul>
                {values.map(value => {
                    return <MultiSwatchOption
                            value={value}
                            swatch={swatch}
                            indexTypeOf={indexTypeOf}
                            selectedValue={selectedValue}
                            onClick={onClickSwatch}
                        />
                })}
            </ul>
        </div>
    );
};

const MultiSwatchOption = props => {
    const { value, swatch, indexTypeOf, selectedValue, onClick } = props;
    return (
        <li>
            <a
                href="#"
                style={{ backgroundColor: swatch[value] }}
                onClick={onClick}
                data-value={value}
                data-index-typeof={indexTypeOf}
                className={selectedValue === value ? "selected" : ""}
            />
        </li>
    );
};

export const MultiThumbnail = props => {
    const { values, name, thumbnail, onClickThumbnail, indexTypeOf, selectedValue } = props;

    return (
        <div className="multi-option thumbnail">
            <label>{name}</label>
            <span className="value">{selectedValue}</span>
            <ul>
                {values.map(value => {
                    return <MultiThumbnailOption
                            onClick={onClickThumbnail}
                            value={value}
                            indexTypeOf={indexTypeOf}
                            selectedValue={selectedValue}
                            thumbnail={thumbnail}
                        />
                })}
            </ul>
        </div>
    );
};

const MultiThumbnailOption = ({ onClick, value, indexTypeOf, selectedValue, thumbnail }) => {
    return (
        <li>
            <a
                href="#"
                onClick={onClick}
                data-value={value}
                data-index-typeof={indexTypeOf}
                className={selectedValue === value ? "selected" : ""}>
                <img
                    src="/_ui/images/common/blank.gif"
                    style={{ backgroundImage: `url("${thumbnail[value]}")` }}
                    alt={value}
                />
            </a>
        </li>
    );
};

export const MultiButton = props => {
    const { values, name, onClickMutliButton, indexTypeOf, selectedValue } = props;
    return (
        <div className="multi-option button">
            <label>{name}</label>
            <ul>
                {values.map(value => {
                    return <MultiButtonOption
                            onClick={onClickMutliButton}
                            indexTypeOf={indexTypeOf}
                            selectedValue={selectedValue}
                            value={value}
                        />
                })}
            </ul>
        </div>
    );
};

const MultiButtonOption = props => {
    const { value, onClick, indexTypeOf, selectedValue } = props;
    return (
        <li>
            <button
                onClick={onClick}
                className={selectedValue === value ? "selected" : ""}
                data-value={value}
                data-index-typeof={indexTypeOf}>
                {value}
            </button>
        </li>
    );
};
