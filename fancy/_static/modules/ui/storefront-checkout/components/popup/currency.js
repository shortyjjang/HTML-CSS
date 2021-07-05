import React from "react";
import classnames from "classnames";
import { closePopup } from "fancyutils";

import getCurrencies from "../../data/currency";
import { convertCurrency } from "../../action/action-helpers";

// FIXME: refactor for common usage
const db = { display: "block" };
const dn = { display: "none" };
function displayIf(condition) {
    return condition ? db : dn;
}

export default class CurrencyPopup extends React.Component {
    static popupName = "show_currency";

    constructor(props) {
        super(props);
        this.currencies = getCurrencies();
        this.continents = [
            {
                code: "all",
                name: gettext("All Currencies")
            },
            {
                code: "ap",
                name: gettext("Asia-Pacific")
            },
            {
                code: "af",
                name: gettext("Africa and Middle East")
            },
            {
                code: "am",
                name: gettext("Americas")
            },
            {
                code: "eu",
                name: gettext("Europe")
            }
        ];
        this.state = {
            currentContinent: "all"
        };
    }

    handleContinentClick = event => {
        event.preventDefault();
        const currentContinent = $(event.currentTarget).attr("data-continent");
        this.setState({ currentContinent });
    };

    handleCurrencyClick = event => {
        event.preventDefault();
        const chosenCode = $(event.currentTarget).attr("data-currency");
        this.setState({ chosenCode });
    };

    handleCancelClick = event => {
        event.preventDefault();
        closePopup(CurrencyPopup.popupName);
        this.setState({ chosenCode: null }); // reset
    };

    handleSaveClick = event => {
        event.preventDefault();
        const { chosenCode } = this.state;
        convertCurrency(chosenCode);
        closePopup(CurrencyPopup.popupName);
        $.ajax({
            type: "POST",
            url: "/set_my_currency.json",
            data: { currency_code: chosenCode }
        });
        this.setState({ chosenCode: null }); // reset
    };

    render() {
        const { chosenCode, currentContinent } = this.state;
        const currentCurrency = chosenCode || this.props.currentCurrency;

        return (
            <div>
                <p className="ltit">{gettext("Choose your currency")}</p>
                <div className="currency-list after">
                    <span className="line" />
                    <div className="left">
                        <ul className="continents">
                            {this.continents.map(({ code, name }, idx) => (
                                <li className={`continent code-continent-${code}`} key={`continent-${idx}`}>
                                    <a
                                        className={classnames({ current: currentContinent === code })}
                                        onClick={this.handleContinentClick}
                                        data-continent={code}>
                                        {name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="right-outer scroll">
                        <div className="right" style={displayIf(currentContinent === "all")}>
                            <ul className="major after">
                                {this.currencies.major.map(({ code, name, assist }, idx) => (
                                    <li className="currency" key={`currency-${idx}`}>
                                        <a
                                            className={classnames({ current: currentCurrency === code })}
                                            data-currency={code}
                                            onClick={this.handleCurrencyClick}>
                                            <b>{name}</b>
                                            <small>{` ${code}`}</small>
                                            <span>{assist}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <ul className="after">
                                {this.currencies.all.map(({ code, name, assist }, idx) => (
                                    <li className="currency" key={`currency-${this.currencies.major.length + idx}`}>
                                        <a
                                            className={classnames({ current: currentCurrency === code })}
                                            data-currency={code}
                                            onClick={this.handleCurrencyClick}>
                                            <b>{name}</b>
                                            <small>{` ${code}`}</small>
                                            <span>{assist}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="right" style={displayIf(currentContinent === "ap")}>
                            <ul className="after">
                                {this.currencies.ap.map(({ code, name, assist }, idx) => (
                                    <li className="currency" key={`currency-${idx}`}>
                                        <a
                                            className={classnames({ current: currentCurrency === code })}
                                            data-currency={code}
                                            onClick={this.handleCurrencyClick}>
                                            <b>{name}</b>
                                            <small>{` ${code}`}</small>
                                            <span>{assist}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="right" style={displayIf(currentContinent === "af")}>
                            <ul className="after">
                                {this.currencies.af.map(({ code, name, assist }, idx) => (
                                    <li className="currency" key={`currency-${idx}`}>
                                        <a
                                            className={classnames({ current: currentCurrency === code })}
                                            data-currency={code}
                                            onClick={this.handleCurrencyClick}>
                                            <b>{name}</b>
                                            <small>{` ${code}`}</small>
                                            <span>{assist}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="right" style={displayIf(currentContinent === "am")}>
                            <ul className="after">
                                {this.currencies.am.map(({ code, name, assist }, idx) => (
                                    <li className="currency" key={`currency-${idx}`}>
                                        <a
                                            className={classnames({ current: currentCurrency === code })}
                                            data-currency={code}
                                            onClick={this.handleCurrencyClick}>
                                            <b>{name}</b>
                                            <small>{` ${code}`}</small>
                                            <span>{assist}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="right" style={displayIf(currentContinent === "eu")}>
                            <ul className="after">
                                {this.currencies.eu.map(({ code, name, assist }, idx) => (
                                    <li className="currency" key={`currency-${idx}`}>
                                        <a
                                            className={classnames({ current: currentCurrency === code })}
                                            data-currency={code}
                                            onClick={this.handleCurrencyClick}>
                                            <b>{name}</b>
                                            <small>{` ${code}`}</small>
                                            <span>{assist}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="btn-area">
                    <button className="btns-gray-embo cancel" onClick={this.handleCancelClick}>
                        {gettext("Cancel")}
                    </button>
                    <button className="btns-blue-embo save" onClick={this.handleSaveClick}>
                        {gettext("Save")}
                    </button>
                </div>
            </div>
        );
    }
}
