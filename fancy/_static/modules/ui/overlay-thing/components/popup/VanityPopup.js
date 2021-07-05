import React from 'react';
import { KEYS, isEmpty } from 'fancyutils';
import { Display } from 'fancymixin';

import { redirect } from '../../container/routeutils';
import appState from '../../appstate';
import { isVanityQueriable } from '../map';


export class VanityLearnMore extends React.Component {
    static popupName = 'vanity_learn';

    render() {
        return (
            <div>
                <p className="ltit">Learn more</p>
                <div className="terms">
                    <h3>How it Works</h3>
                    <p>After you purchase a vanity number, we will contact you within 1-2 business days with all the information you need to provide to your carrier to transfer your number. You should be able to use your new number within 1-3 days of contacting your carrier.</p>
                    <p>The number is yours to keep. If you decide to change carriers or phones at any point, you can continue to use your vanity number.</p>

                    <h3>Compatibility</h3>
                    <p>All numbers are compatible with the following US Wireless Carriers: AT&amp;T, Spring, T-Mobile, and Verizon Wireless.</p>

                    <h3>Special Requests</h3>
                    <p>Please note: we can only accept special requests for the last four digits of a desired phone number that is not listed.</p>
                    <p>Additional fees may apply to specially requested phone numbers.</p>

                    <h3>Refunds and Returns</h3>
                    <p>If for whatever reason your carrier of choice* will not accept your number, we will refund your order within 30 days of purchase. We cannot accept returns unless the carrier refuses to transfer the number.</p>
                    <p>Numbers can only be transferred to the following US cell phone carriers: AT&T, Sprint, T-Mobile and Verizon Wireless.</p>

                    <h3>Powered by PhoneNumberGuy.</h3>
                    <p>
                        Any questions? <a href="/about/email">Contact us</a> and we'll be happy to help.
                    </p>
                </div>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        );
    }
}

const propsToCheck = [
    'AC',
    'minPrice',
    'maxPrice',
    'keyword'
];

const formatVanityPrice = window.numeral != null ?
    function formatVanityPrice(price) {
        return window.numeral(price).format("$0,0.00")
    }
    :
    function formatVanityPrice(price) {
        const priceFormatted = Number(price).toFixed(2);
        if (_.isNaN(priceFormatted)) {
            return price;
        } else {
            return `$${priceFormatted}`;
        }
    }


export class VanitySearchResult extends React.Component {
    static popupName = 'vanity_result';
    state = {
        sort: 'price_asc',
        result: [],
        currentPage: 0,
        endReached: false,
        loading: false,
    };

    handleSort = (event) => {
        const sort = event.target.value;
        this.setState({ sort }, _ => {
            this.search();
        });
    }

    getSearchParams = (page, sort = null) => {
        const {
            AC,
            minPrice,
            maxPrice,
            keyword,
        } = this.state;

        const query = {};

        if (AC != null) { query.ac = AC; }
        if (keyword != null) { query.q = keyword; }

        if (
            (minPrice == null && maxPrice == null) ||
            isVanityQueriable({ minPrice, maxPrice }, true)
        ) {
            query.p = (minPrice || '0') + '-' + maxPrice;
        }

        if (page != null && page > 1) {
            query.pg = page;
        }

        if (sort) {
            query.sort = sort;
        }
        return query;
    }

    search = ({ adding } = {}) => {
        const { currentPage, loading, sort } = this.state;
        if (loading) {
            return;
        }
        let page = adding ? currentPage + 1 : 1;
        const query = this.getSearchParams(page, sort);
        this.setState({ loading: true }, () => {
            $.get('/rest-api/v1/things/vanity-number/search', query, (response) => {
                const nextState = {};
                if (response.data.length > 20 || response.next_page) {
                    nextState.endReached = false;
                    nextState.currentPage = page;
                } else {
                    nextState.endReached = true;
                }

                if (!isEmpty(response.data)) {
                    const prevResult = adding ? this.state.result: [];
                    nextState.result = prevResult.concat(response.data);
                } else {
                    if (page > 1) { } else { nextState.result = []; }
                    nextState.endReached = true;
                }
                this.setState(nextState);
            }).always(() => { this.setState({ loading: false }); })
        });
    }

    isUpdated(currentProps, nextProps) {
        return propsToCheck.some(key => currentProps[key] !== nextProps[key]);
    }

    handleGetMore = (event) => {
        this.search({ adding: true });
    }

    handleCheckout = (event) => {
        if (appState.loggedIn !== true) {
            window.require_login();
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const pid = event.currentTarget.getAttribute('data-phone-id');
        $.post('/rest-api/v1/things/vanity-number/add-to-cart', { id: pid }, function(response){
            if (response) {
                if (response.error_message) {
                    const original_labels = alertify.labels
                    alertify.set({ labels: { ok: 'Close' }});
                    alertify.alert(response.error_message);
                    alertify.set({ labels: original_labels })
                } else {
                    checkoutVanity();
                }
            }
        });
    }

    handleKeywordInput = (event) => {
        if (event.keyCode === KEYS.ENTER) {
            event.preventDefault();
            const nextState = { keyword: event.target.value };
            if (isVanityQueriable(nextState, false)) {
                this.setState(nextState, () => {
                    this.search();
                });
            }
        }
    }

    handleKeywordInputChange = (event) => {
        this.setState({ keyword: event.target.value });
    }

    componentDidMount() {
        this.setState(this.props, () => {
            this.search();
        });
    }

    componentDidUpdate(prevProps) {
        const nextProps = this.props;
        if (this.isUpdated(prevProps, nextProps)) {
            this.setState(_.extend({ endReached: false, currentPage: 0, result: [] }, nextProps), () => {
                this.search();
            });
        }
    }

    render() {
        const { endReached, result, loading, keyword } = this.state;
        const empty = isEmpty(result);

        return (
            <div>
                <p className="ltit">Search results</p>
                <div className="result">
                    <fieldset>
                        <select className="select-boxes2" onChange={this.handleSort}>
                            <option value="price_asc">Lowest to Highest Price</option>
                            <option value="price_desc">Highest to Lowest Price</option>
                        </select>
                        <span className="hastext">
                            <input type="text" className="text"
                                   placeholder="Search by numbers or letters"
                                   onKeyDown={this.handleKeywordInput}
                                   onChange={this.handleKeywordInputChange}
                                   value={keyword} />
                        </span>
                    </fieldset>
                    <ul style={Display.NoneIf(empty)}>
                        {this.state.result.map(({ id_str, display_num, price }, idx) =>
                            <li key={`vanitySearch-${idx}`}>
                                <b className="number">{display_num}</b>
                                <span className="price">{formatVanityPrice(price)}</span>
                                <button className="btn-checkout btns-green-embo"
                                        onClick={this.handleCheckout}
                                        data-phone-id={id_str}>Checkout</button>
                            </li>
                        )}
                        {!endReached &&
                            <a onClick={this.handleGetMore}>
                                <li className={`load-more ${loading ? 'loading' : ''}`}>
                                    <span>Load more numbers</span>
                                </li>
                            </a>
                        }
                    </ul>
                </div>
                <div className="empty" style={Display.NoneIf(!(empty && endReached))}>
                    <span className="phone">
                        <i className="icon" />
                    </span>
                    <p>
                        <b>Can't find what you're looking for?</b>
                        No results found that match your search
                    </p>
                </div>
                <div className="empty loading" style={Display.NoneIf(!(empty && !endReached))}>
                </div>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        );
    }
}

function checkoutVanity() {
    $.ajax({
        type: 'POST',
        url: '/rest-api/v1/checkout',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            "payment_gateway": 6,
            "is_vanity": 'true'
        }),
        processData: false
    })
    .then(() => {
        redirect("/vanity-number/checkout");
    })
    .fail(res => {
        if (res.responseText) {
            var json = JSON.parse(res.responseText)
            if (json.error) {
                const original_labels = alertify.labels
                alertify.set({ labels: { ok: 'Close' }});
                alertify.alert(json.error);
                alertify.set({ labels: original_labels })
            }
        }
    })
}
