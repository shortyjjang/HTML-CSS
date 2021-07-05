import React, { Component } from 'react';
import { Display } from 'fancymixin';

import appState from '../../../appstate';
import { debounceUntilTimeout, triggerEvent } from 'fancyutils';
import { redirect } from '../../../container/routeutils';
import ActionButtons from '../action-buttons';
import { Keys } from '../../Perf';
import { SelectBox } from './Mixin';


function searchUser(query) {
    if ($.trim(query) === '') {
        return;
    }
    return $.ajax({
        type : 'get',
        url  : '/search-users.json',
        data : { term: query },
        dataType : 'json'
    }).done(searchedUsers => {
        if (searchedUsers && searchedUsers.length) {
            this.setState({
                showSearchedUsers: true,
                userType: this.FancyUserType,
                searchedUsers
            });
        } else {
           this.setState({
                showSearchedUsers: false,
           });
        }
    });
}


export default class Giftcard extends Component {
    giftcardPrices = ['10', '25', '50', '100', '250', '500', '1000', '5000', '10000'];
    FancyUserType = 'fancyUser';
    ExternalUserType = 'externalUser';
    prevQuery = '';
    purchasing = false;

    constructor(props) {
        super(props);
        this.state = {
            searchedUsers: [],
            cursorIndex: 0,   // where 'current item' is displayed on searched user list
            showSearchedUsers: false,

            cardValue: '50',
            userType: this.FancyUserType,
            fancyUser: {},
            externalUser: {},
        };
        this.searchUser = debounceUntilTimeout(searchUser, 500, this);
    }

    handlePurchaseError = (errorMessage, focusingEl) => {
        this.purchasing = false;
        alertify.alert(errorMessage);
        if (focusingEl) {
            triggerEvent(focusingEl, 'focus');
        }
    }

    handlePurchase = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!appState.loggedIn) {
            return window.require_login();
        }
        if (this.purchasing) {
            return;
        }
        this.purchasing = true;

        const { cardValue, message } = this.state;
        const { fullname, username, email } = this.getUser();

        if ($.trim(fullname).length === 0) {
            this.handlePurchaseError('Please enter recipient name', this.recipientName)
            return false;
        }

        if (username && username !== email) {
            this.handlePurchaseError('Please choose correct user.')
            return false;
        }

        // see common/util.js to change emailRegEx
        if (email.search(this.emailRegEx) === -1 && !username) {
            this.handlePurchaseError('A valid email address is required', this.searchInput)
            return false;
        }

        if ($.trim(message).length === 0) {
            this.handlePurchaseError('Please enter personal message', this.message)
            return false;
        }

        $.post("/create-gift-card.json", {
                v3: true,
                recipient_name: fullname,
                recipient_email: email,
                recipient_username: username,
                amount: cardValue,
                message
            }, null, "json")
            .done(({ status_code, message }) => {
                if (status_code != null) {
                    if (status_code == 1) {
                        redirect('/gift-card/checkout');
                    } else if (status_code == 0) {
                        if (message != null){
                            alertify.alert(message);
                        }
                    }
                }
            })
            .always(() => {
                this.purchasing = false;
            });
    }

    handleInputFieldsFocus = (event) => {
        if (!appState.loggedIn) {
            event.preventDefault();
            event.stopPropagation();
            return window.require_login();
        }
    }

    handleEmailChange = (event) => {
        if (!appState.loggedIn) {
            event.target.value = '';
            return window.require_login();
        }

        const input = $.trim(event.target.value);
        const intermediateInputSlice = input.split('@');
        const inputIsEmailType = input.length > 0 && intermediateInputSlice.length > 1 && intermediateInputSlice[0].length > 0;
        if (input === '') {
            this.setUserDetail(input, null, null, { showSearchedUsers: false });
        } else if (inputIsEmailType) {
            this.setUserDetail(input, null, null, { showSearchedUsers: false, userType: this.ExternalUserType });
        } else {
            this.searchUser(input);
            this.setUserDetail(input);
        }
    }

    getUser = () => {
        return this.state[this.state.userType];
    }

    setFancyUser = (idx) => {
        const { searchedUsers } = this.state;
        if (idx != null && searchedUsers && searchedUsers.length) {
            const { searchedUsers } = this.state;
            const { username, fullname } = searchedUsers[idx];

            this.setState({
                userType: this.FancyUserType,
                showSearchedUsers: false,
                [this.FancyUserType]: {
                    email: username,
                    fullname,
                    username,
                },
            });
        }
    }

    setUserDetail = (email, fullname, username, additionalState) => {
        // FIXME: improve
        var nextUserDetail = {};
        if (email != null) { nextUserDetail.email = email; }
        if (fullname != null) { nextUserDetail.fullname = fullname; }
        if (username != null) { nextUserDetail.username = username; }

        // deleting
        if (email === '') {
            nextUserDetail.username = '';
        }

        nextUserDetail = _.extend({}, this.getUser(), nextUserDetail);
        var nextUserType = this.state.userType;
        // Switching user type
        // FIXME: make vice-versa
        if (additionalState &&
            additionalState.userType &&
            additionalState.userType === this.ExternalUserType
        ) {
            delete nextUserDetail.username;
            nextUserType = additionalState.userType;
        }

        const nextState = _.extend(
            { [nextUserType]: nextUserDetail },
            additionalState
        );
        this.setState(nextState);
    }

    handleListItemClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const idx = event.currentTarget.getAttribute('data-idx');
        this.setFancyUser(idx);
    }

    handleCardValueChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ cardValue: event.currentTarget.value });
    }

    handleMessageChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ message: event.currentTarget.value });
    }

    handleRecipientNameChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setUserDetail(null, event.currentTarget.value, null);
    }

    render() {
        const {
            cardValue,
            cursorIndex,
            searchedUsers,
            showSearchedUsers,
        } = this.state;
        const user = this.getUser();

        return (
            <div key={Keys.Sidebar.Wrap}>
                <div className="wrapper figure-info giftcard" key={Keys.Sidebar.Body}>
                    <h1 className="title" key={Keys.Sidebar.Title}>{gettext("Fancy Gift Card")}</h1>
                    <div className="description" key={Keys.Sidebar.Desc}>
                        <p>{gettext("The perfect present for any occasion. Send a Fancy Gift Card today and let your friends choose what they love!")}</p>
                    </div>
                    <div className="frm" key={Keys.Sidebar.Form}>
                        <fieldset className="sale-item-input">
                            <SelectBox printer={s => `$${s}`} defaultValue="50" currentValue={cardValue}
                                       id="value" options={this.giftcardPrices} onChange={this.handleCardValueChange} onFocus={this.handleInputFieldsFocus}/>
                            <div className="recipent">
                                <p>
                                    <input type="text" id="recipient-email" name="recipient_email"
                                           className="text search-fancy-users-for-giftcard"
                                           onChange={this.handleEmailChange}
                                           onFocus={this.handleInputFieldsFocus}
                                           ref={(element) => {this.searchInput = element;}}
                                           value={user.email}
                                           placeholder={gettext("Recipient’s username or email address")} />
                                </p>
                                <ul className="user-list" ref={(element) => {this.userList = element;}} style={Display.BlockIf(showSearchedUsers)}>
                                    {searchedUsers &&
                                     searchedUsers.map((searched, idx) => {
                                        return (
                                            <li key={`giftcard-user-${idx}`} data-idx={idx}
                                                onClick={this.handleListItemClick}
                                                className={cursorIndex === idx ? 'on' : null}>
                                                <img src="/_ui/images/common/blank.gif"
                                                     style={{ backgroundImage: `url(${searched.profile_image_url})` }} />
                                                <b>{searched.name}</b>
                                                <small>@{searched.username}</small>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <p>
                                <input type="text" ref={(element) => {this.recipientName = element;}} id="recipient-name"
                                       name="recipient_name" className="text"
                                       placeholder={gettext("Recipient’s name")}
                                       value={user.fullname}
                                       onChange={this.handleRecipientNameChange} 
                                       onFocus={this.handleInputFieldsFocus}/>
                            </p>
                            <p>
                                <textarea onChange={this.handleMessageChange}
                                          onFocus={this.handleInputFieldsFocus}
                                          name="message" className="text"
                                          placeholder={gettext("Enter a personal message")} />
                            </p>
                        </fieldset>
                        <button className="btns-green-embo btn-cart create-gift-card"
                                onClick={this.handlePurchase}>{gettext("Buy Now")}</button>
                        <ActionButtons {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}
