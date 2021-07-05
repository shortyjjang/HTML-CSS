import React from "react";
import { Display } from "fancymixin";
import { closePopup } from "fancyutils";

import { getCountryByCode, CountriesPair } from "../../data/Countries";
import { updateAppContext } from "../../action/actions";


export default class ShippingCountriesPopup extends React.Component {
    static popupName = "shipping";
    state = {
        query: "",
        selectedCountry: ""
    };
    countries = CountriesPair;

    // state.selectedCountry initialization
    componentDidMount() {
        this.setState({ selectedCountry: this.props.userCountry });
    }

    // state.selectedCountry initialization
    componentDidUpdate(prevProps) {
        const { userCountry } = this.props
        if (prevProps.userCountry !== userCountry) {
            this.setState({ selectedCountry: userCountry });
        }
    }

    handleCountryClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const selectedCountry = event.currentTarget.getAttribute("data-code");
        this.setState({ selectedCountry });
    }

    handleSaveCountry = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const { selectedCountry } = this.state;
        const { dispatch } = this.props;
        if (this.props.userCountry === selectedCountry) {
            closePopup(ShippingCountriesPopup.popupName);
            return;
        }
        $.post("/set_shipping_country", { code: selectedCountry, name: getCountryByCode(selectedCountry) }).done(() => {
            dispatch(updateAppContext({ userCountry: this.state.selectedCountry }));
            closePopup(ShippingCountriesPopup.popupName);
        });
    }

    handleCancel = (event) => {
        event.preventDefault();
        event.stopPropagation();
        closePopup(ShippingCountriesPopup.popupName);
    }

    handleQueryChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ query: event.currentTarget.value });
    }

    handleRemoveQuery = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ query: "" });
    }

    render() {
        const { selectedCountry, query } = this.state;
        return (
            <div>
                <p className="ltit">{gettext("Choose your country")}</p>
                <div className="country-list after">
                    <span className="line" />
                    <div className="search">
                        <input
                            type="text"
                            className="text"
                            placeholder="Search country"
                            onChange={this.handleQueryChange}
                            value={query}
                        />
                        <a
                            className="remove"
                            onClick={this.handleRemoveQuery}
                            style={Display.NoneIf($.trim(query) === "")}
                        />
                    </div>
                    <div className="right-outer scroll">
                        <div code="all">
                            <ul className="after">
                                {this.countries
                                    .filter(([code, name]) => {
                                        const q = $.trim(query).toLowerCase();
                                        if (q === "") {
                                            return true;
                                        } else {
                                            return (
                                                name.toLowerCase().indexOf(q) > -1 || code.toLowerCase().indexOf(q) > -1
                                            );
                                        }
                                    })
                                    .map(([code, name], i) => (
                                        <li className={selectedCountry === code ? "current" : null} key={i}>
                                            <a onClick={this.handleCountryClick} data-code={code}>
                                                <b>{name}</b>
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="btn-area">
                    <button className="btns-gray-embo cancel" onClick={this.handleCancel}>
                        {gettext("Cancel")}
                    </button>
                    <button className="btns-blue-embo save" onClick={this.handleSaveCountry}>
                        {gettext("Save")}
                    </button>
                </div>
            </div>
        );
    }
}
