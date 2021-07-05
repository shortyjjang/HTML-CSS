import React, { Component } from "react";
import { renderPopup } from "fancyutils";

import ActionButtons from "../action-buttons";
import { getSafeNameProp, isVanityQueriable } from "../../map";
import { Keys } from "../../Perf";
import { CartButton } from "./Mixin";


export default class Vanity extends Component {
    state = {
        stateCode: "",
        AC: "",
        minPrice: "",
        maxPrice: "",
        keyword: ""
    };

    handleVanityLearnPopupOpen = () => {
        import(/* webpackChunkName: "OverlayThing.popup" */'../../popup/index')
            .then(({ VanityLearnMore }) => {
                renderPopup(VanityLearnMore, null);
            });
    };

    handleVanitySearchPopupOpen = () => {
        if (isVanityQueriable(this.state)) {
            import(/* webpackChunkName: "OverlayThing.popup" */'../../popup/index')
                .then(({ VanitySearchResult }) => {
                    renderPopup(VanitySearchResult, this.state);
                });
        }
    };

    onACChange = event => {
        event.preventDefault();
        this.setState({ AC: event.target.value });
    };
    onKeywordChange = event => {
        event.preventDefault();
        this.setState({ keyword: event.target.value });
    };
    onMinPriceChange = event => {
        event.preventDefault();
        this.setState({ minPrice: event.target.value });
    };
    onMaxPriceChange = event => {
        event.preventDefault();
        this.setState({ maxPrice: event.target.value });
    };

    render() {
        var { thing: { sales } } = this.props;

        return (
            <div key={Keys.Sidebar.Wrap}>
                <div className="wrapper figure-info vanity" key={Keys.Sidebar.Body}>
                    <h1 key={Keys.Sidebar.Title} className="title" {...getSafeNameProp(sales)} />
                    <div className="description" key={Keys.Sidebar.Desc}>
                        <p>
                            {gettext(
                                "Easy-to-remember vanity phone numbers for anyone and everyone, from private individuals to the biggest of companies."
                            )}
                        </p>
                        <p>
                            {gettext(
                                "All numbers are compatible with the following US Wireless Carriers: AT&T, Sprint, T-Mobile, and Verizon Wireless."
                            )}
                        </p>
                        <p>
                            <a onClick={this.handleVanityLearnPopupOpen}>{gettext("Learn more")}</a>
                        </p>
                    </div>
                    <div className="frm" key={Keys.Sidebar.Form}>
                        <fieldset className="sale-item-input">
                            <p>
                                <label>{gettext("Area code")}</label>
                                <input
                                    type="text"
                                    id="code"
                                    className="text code"
                                    placeholder="Area code"
                                    onChange={this.onACChange}
                                    value={this.state.AC}
                                />
                            </p>
                            <p className="_left">
                                <label>{gettext("Price min")}</label>
                                <input
                                    type="text"
                                    id="price_min"
                                    className="text price"
                                    placeholder="$50"
                                    onChange={this.onMinPriceChange}
                                    value={this.state.minPrice}
                                />
                                <span className="dash">-</span>
                            </p>
                            <p>
                                <label>{gettext("Price max")}</label>
                                <input
                                    type="text"
                                    id="price_max"
                                    className="text price"
                                    placeholder="$10,000+"
                                    onChange={this.onMaxPriceChange}
                                    value={this.state.maxPrice}
                                />
                            </p>
                            <p>
                                <label>{gettext("Search")}</label>
                                <input
                                    type="text"
                                    id="search"
                                    className="text search"
                                    placeholder="Search by numbers or letters"
                                    onChange={this.onKeywordChange}
                                    value={this.state.keyword}
                                />
                            </p>
                            <CartButton
                                className="btn-search btns-green-embo"
                                label={gettext("Search numbers")}
                                onClick={this.handleVanitySearchPopupOpen}
                            />
                        </fieldset>
                        <ActionButtons {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}
