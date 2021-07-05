import React, { Component } from 'react';
import classnames from 'classnames';
import { floatFormatMinusTwo, renderPopup } from 'fancyutils';
import { Display } from 'fancymixin';

import appState from '../../../appstate';
import ActionButtons from '../action-buttons';
import { Keys } from '../../Perf';

// Unsafe DOM wrapper
// - which means its DOM children will be modified by non-react script
//   and not going to be updated via React.
class Unsafe extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return this.props.children;
    }
}

export default class Hotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'checkin',
            showDetail: false,
        };
    }

    handleMoreDetail = (event) => {
        event.preventDefault();
        this.setState({ showDetail: true });
    }

    handleSell = (event) => {
        event.preventDefault();
        if (!appState.loggedIn) {
            return window.require_login();
        }
        const { thing } = this.props;
        location.href = `/sales/create?ntid=${thing.id}&ntoid=${thing.user && thing.user.id || ''}`;
    }

    handleLookupAvailability = (event) => {
        if (!appState.loggedIn) {
            return window.require_login();
        }
        event.preventDefault();
        const { thing: { hotel_search } } = this.props;

        if (hotel_search == null || this.lookupLoading) {
            return;
        }
        this.lookupLoading = true;

        // check avail rooms
        const params = {
            hotelId       : hotel_search.hotel.hotelId,
            arrivalDate   : $('#check-in').val(),
            departureDate : $('#check-out').val(),
        };

        var adult = $('#adult-people').val();
        var child = '';
        for (let i=0; i < $('#child-people').val(); i++) {
            child += ",10";
        }
        params.rooms = adult + child;

        $.ajax({
            type     : 'post',
            url      : '/ean/hotel/rooms/',
            data     : params,
            cache    : false,
            dataType : 'json',
        })
            .then(json => {
                if (json.EanWsError == null) {
                    import(/* webpackChunkName: "OverlayThing.popup" */'../../popup/index')
                        .then(({ BookingResultPopup }) => {
                            renderPopup(BookingResultPopup, {
                                hotelID: hotel_search.hotel.hotelId,
                                roomlist: json.roomlist,
                                arrivalDate: json.arrivalDate,
                                departureDate: json.departureDate,
                                rooms: params.rooms
                            });
                        })
                } else {
                    alertify.alert(json.EanWsError.presentationMessage);
                }
            })
            .fail(() => { alertify.alert('An error occurred during request data.'); })
            .always(() => { this.lookupLoading = false; });
    }

    handleSelected = (selectedOption) => {
        this.setState({ selectedOption });
    }

    isSubmitable() {
        return $('#check-in:visible').val() != null && $('#check-out:visible').val() != null;
    }

    render() {
        var { thing: { hotel_search } } = this.props;
        var { selectedOption, showDetail } = this.state;

        return (
            <div key={Keys.Sidebar.Wrap}>
                <div className="wrapper figure-info hotel" key={Keys.Sidebar.Body}>
                    <h1 className="title" key={Keys.Sidebar.Title}>{hotel_search.hotel.name}</h1>
                    <p className="price" key={Keys.Sidebar.Price}>
                        {hotel_search.hotel.city}, {hotel_search.hotel.country}
                        <big>{gettext('From')} <b>${floatFormatMinusTwo(hotel_search.hotel.lowRate)}</b> {gettext("/ Night")}</big>
                    </p>
                    <div className="frm" key={Keys.Sidebar.Form}>
                        <fieldset>
                            <HotelCheckin onSelected={this.handleSelected} selectedOption={selectedOption} />
                            <HotelCheckout onSelected={this.handleSelected} selectedOption={selectedOption} />
                            <HotelPeople onSelected={this.handleSelected} selectedOption={selectedOption} />
                        </fieldset>
                        <button onClick={this.handleLookupAvailability}
                                className="btns-green-embo btn-check"
                                disabled={!this.isSubmitable()}>{gettext("See Availability")}</button>
                        <ActionButtons {...this.props} />
                    </div>
                </div>
                <div className="wrapper hotel-description">
                    <h3 className="stit">{gettext('Hotel Details')}</h3>
                    <div className={classnames("description", { 'show': showDetail })} key={Keys.Sidebar.Desc}>
                        {hotel_search.details.hotelPolicy && <b>{gettext("General Policy")}</b>}
                        {hotel_search.details.hotelPolicy && <p dangerouslySetInnerHTML={{__html: hotel_search.details.hotelPolicy }} />}
                        {hotel_search.details.roomInformation && <b>{gettext("Notifications and Fees")}</b>}
                        {hotel_search.details.roomInformation &&  <p dangerouslySetInnerHTML={{__html: hotel_search.details.roomInformation }} />}
                        <b>{gettext("Frequently Asked Questions")}</b>
                        <p>
                            <a href={hotel_search.faq_link} target="_blank">
                                {gettext("Read FAQs")}
                            </a>
                        </p>
                        <a className="more" onClick={this.handleMoreDetail} style={Display.NoneIf(showDetail)}>
                            <span>{gettext("more")}</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

class HotelCheckin extends Component {
    state = { selected: false }
    componentDidMount() {
        $('#calendar-check-in')
            .datepicker({dateFormat : 'MM d, yy', showOtherMonths: true, selectOtherMonths: true})
            .datepicker('option', 'altField', '#check-in')
            .datepicker('option', 'minDate', 1)
            .datepicker('option', 'onSelect', (dateText, inst) => {
                this.setState({ selected: true }, () => {
                    var nextDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
                    nextDate.setDate(nextDate.getDate() + 1);
                    $('#calendar-check-out').datepicker('option', 'minDate', nextDate);
                    this.props.onSelected('checkout');
                });
            });
    }

    handleSelectCheckIn = () => {
        this.props.onSelected('checkin');
    }

    render() {
        const { selectedOption /*, checkinDate*/ } = this.props;
        const { selected } = this.state;

        return (
            <dl className={classnames("calendar", { on: selectedOption === 'checkin' })}
                onClick={this.handleSelectCheckIn}>
                <dt>
                    <span>Check in</span>
                    <input type="text" id="check-in" className="calendar checkin" readOnly style={Display.NoneIf(!selected)} />
                </dt>
                <dd>
                    <Unsafe>
                        <div id="calendar-check-in" className="calendar" />
                    </Unsafe>
                </dd>
            </dl>
        );
    }
}

class HotelCheckout extends Component {
    state = { selected: false }
    componentDidMount() {
        $('#calendar-check-out')
            .datepicker({ dateFormat : 'MM d, yy', showOtherMonths: true, selectOtherMonths: true })
            .datepicker('option', 'altField', '#check-out')
            .datepicker('option', 'minDate', 2)
            .datepicker('option', 'onSelect', () => {
                this.setState({ selected: true }, () => {
                    this.props.onSelected('people');
                });
            });
    }

    handleSelectCheckout = () => {
        this.props.onSelected('checkout');
    }

    render() {
        const { selectedOption } = this.props;
        const { selected } = this.state;
        return (
            <dl className={classnames("calendar", { on: selectedOption === 'checkout' })}
                onClick={this.handleSelectCheckout}>
                <dt>
                    <span>{selected ? gettext('Check out') : gettext('Select check out date')}</span>
                    <input type="text" id="check-out" className="calendar checkout" readOnly style={Display.NoneIf(!selected)} />
                </dt>
                <dd>
                    <Unsafe>
                        <div id="calendar-check-out" className="calendar" />
                    </Unsafe>
                </dd>
            </dl>
        );
    }
}

export class HotelPeople extends Component {
    state = {
        adult: 1,
        children: 0
    };

    handlePeopleChange = (event) => {
        this.setState({ adult: parseInt(event.currentTarget.value, 10) });
    }

    handleChildrenChange = (event) => {
        this.setState({ children: parseInt(event.currentTarget.value, 10) });
    }

    handleSelectPeople = () => {
        this.props.onSelected('people');
    }

    render() {
        const { selectedOption } = this.props;
        const { adult, children } = this.state;
        return (
            <dl className={classnames("people", { on: selectedOption === 'people' })} onClick={this.handleSelectPeople}>
                <dt htmlFor="adult-people">{adult} Adult, {children} {children === 1 ? 'Child' : 'Children'}</dt>
                <dd className="after">
                    <p>
                        <b>{gettext('Adult')}</b>
                        <span className="trick-select adult-people">
                            <a className="selectBox" tabIndex="1">
                                <span className="selectBox-label">{adult}</span>
                                <span className="selectBox-arrow"></span>
                            </a>
                            <select id="adult-people" className="things-select" onChange={this.handlePeopleChange} value={adult}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </span>
                    </p>

                    <p>
                        <b>{gettext('Children')}</b>
                        <span className="trick-select child-people">
                            <a className="selectBox" tabIndex="1">
                                <span className="selectBox-label">{children}</span>
                                <span className="selectBox-arrow"></span>
                            </a>
                            <select id="child-people" className="things-select" onChange={this.handleChildrenChange} value={children}>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </span>
                    </p>
                </dd>
            </dl>
        );
    }
}
