import React from 'react';
import classnames from 'classnames';
import { FancyUser, debounceUntilTimeout, MP, getDisplay, triggerEvent, alertify } from 'fancyutils';
import { ShareObjectTypes, getShareURL } from './MoreShareUtils';

import { Display } from 'fancymixin';


const SNSDict = { "fb": "Facebook", "tw": "Twitter", "tb": "Tumblr" };

const followingUsers = [];
let followingUsersRequested = false;

const ViewClasses = {
    Success: 'empty success',
    Default: 'empty default',
    Searching: 'empty searching',
    NoResult: 'empty no-result',
};


export class SharePopover extends React.Component {
    state = {
        friendSearchQuery: '',
        searchedFriends: [],
        selectedUserID: null,
        sentUser: null,
        sendNote: '',
        sendSuccess: false,
        searching: false,
        isContact: false,
    };

    mailUser = {
        id: 'EMAIL',
        type: 'email',
        profile_image_url: '/_ui/images/common/blank.gif',
        fullname: 'Email',
        /* mut */ username: null,
    };

    constructor(props) {
        super(props);
        this.searchFriends = debounceUntilTimeout(function searchFriends(prevQuery, friendSearchQuery) {
            if (this.isEmailOnlyMode()) {
                this.setState({ searching: false });
                return;
            }

            const term = $.trim(friendSearchQuery);
            if ($.trim(prevQuery) === term) {
                return;
            }
            if (term === '') {
                this.setState({
                    searchedFriends: [],
                    selectedUserID: null,
                });
                return;
            }
            this.setState({ searching: true }, () => {
                $.get('/search-users.json', {
                    term, 
                    filter_messages_permission: true
                })
                .done(searchedFriends => {
                    const nextState = { searching: false };
                    if (this.state.friendSearchQuery === friendSearchQuery) {
                        nextState.searchedFriends = searchedFriends;
                        nextState.selectedUserID = null;
                    }
                    this.setState(nextState);
                });
            })
        }, 200, this);
    }

    handleContinue = (event) => {
        event.preventDefault();
        this.clearFriendList();
        if (this.props.handleHide) {
            this.props.handleHide()
        }
    }

    handleFriendSearch = (event) => {
        const friendSearchQuery = event.target.value;
        const prevQuery = this.state.friendSearchQuery;
        this.setState({ friendSearchQuery, sendSuccess: false, searching: true }, () => {
            this.searchFriends(prevQuery, friendSearchQuery);
        });
    }

    handleSend = () => {
        const { sendNote, selectedUserID, searchedFriends } = this.state;
        const { title, referrerURL } = this.props;
        if (this.sending) {
            return;
        }

        const isMailuser = selectedUserID === this.mailUser.id;
        if (isMailuser) {
            this.handleSendMail();
            return;
        } else if (searchedFriends.length === 0 || selectedUserID == null) {
            return;
        }


        const { objectType } = this.props;
        let params;
        if (objectType === ShareObjectTypes.thing) {
            params = {
                things: this.props.objectId,
                user_id: selectedUserID
            };
        } else {
            params = {
                user_id: selectedUserID,
                message: `${title} ${referrerURL}`,
            };
        }
        
        this.sending = true;
        if ($.trim(sendNote)) {
            params.message += (' ' + $.trim(sendNote));
        }

        $.post('/messages/send-message.json', params)
            .done(json => {
                if (json.status_code !== 1) {
                    if (json.message) {
                        alertify.alert(json.message);
                    } else {
                        alertify.alert("There was an error while sending message. Please try again.");
                    }
                    return;
                }
                this.clearFriendList({
                    sendSuccess: true,
                    sentUserID: selectedUserID,
                    selectedUserID: null,
                }, ['searchedFriends']);
                MP('Complete Share', { "thing id": params.things, "type": "FancyMessage" });
            })
            .fail(xhr => {
                console.warn(xhr);
            })
            .always(() => {
                this.sending = false;
            });
    }

    handleSendMail = () => {
        if (this.sending) {
            return;
        }
        if (this.props.objectType == null) {
            console.warn('objectType should be provided.');
        }
        const object_type = this.props.objectType || 'thing';
        const email_address = this.mailUser.username.trim();

        const object_id = this.props.objectId;
        this.sending = true;
        const params = { email_address, object_type, object_id };
        const message = $.trim(this.state.sendNote);
        if (message) {
            params.message = message;
        }
        if (this.props.objectMeta && this.props.objectMeta.type === 'shoplist') {
            params.object_meta = this.props.objectMeta.type;
        }

        $.post('/messages/send-email.json', params)
            .done(json => {
                if (json.status_code !== 1) {
                    if (json.message) {
                        alertify.alert(json.message);
                    } else {
                        alertify.alert("There was an error while sending message. Please try again.");
                    }
                    return;
                }
                this.clearFriendList({
                    sendSuccess: true,
                    sentUserID: params.email_address,
                    selectedUserID: null,
                });
                MP('Complete Share', { "object id": params.object_id, "object type": params.object_type, "type": "Email" });
            })
            .fail(xhr => {
                var responseObject = null
                try { responseObject = JSON.parse(xhr.responseText) } catch(e) { }
                if(responseObject && responseObject.message) {
                    alertify.alert(responseObject.message)
                } else {
                    alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                }
                console.warn(xhr);
            })
            .always(() => {
                this.sending = false;
            });
    }

    clearFriendList = (additionals, excludes) => {
        // remove search history for users
        const nextState = _.extend({
            friendSearchQuery: '',
            searchedFriends: [],
            sendNote: '',
            sendSuccess: false,
            sentUserID: null,
        }, additionals);
        if (excludes) {
            excludes.forEach(excludeKey => {
                delete nextState[excludeKey];
                nextState[excludeKey] = this.state[excludeKey];
            });
        }
        this.setState(nextState);
    }

    handleSendNoteInput = (event) => {
        const sendNote = event.target.value;
        this.setState({ sendNote });
    }

    handleUserSelect = (event) => {
        event.preventDefault();
        const { selectedUserID } = this.state;
        const nextID = $(event.currentTarget).attr('data-userid');
        // Canceling
        if (String(selectedUserID) === $(event.currentTarget).attr('data-userid')) {
            this.setState({ selectedUserID: null });
        // Selecting
        } else {
            this.setState({ selectedUserID: nextID });
        }
    }

    getSelectedUser = () => {
        const { selectedUserID } = this.state;
        return _.find(this.getSearchedFriends(), e => String(e.id) === selectedUserID);
    }

    getSentUser = () => {
        const { sentUserID } = this.state;
        return _.find(this.getSearchedFriends(), e => String(e.id) === sentUserID);
    }

    getDisplayUsers = () => {
        if (followingUsersRequested) {
            return;
        }
        this.loadingDisplayUsers = true;
        followingUsersRequested = true;
        $.get('/get-share-display-users.json').done(res => {
            if (res.status_code === 1 && res.users.length > 0) {
                followingUsers.push.apply(followingUsers, res.users);
            }
        }).fail(() => {
            console.warn('failed to fetch display users')
        })
        .always(() => {
            this.loadingDisplayUsers = false;
            this.forceUpdate();
        });
    }

    handleClickBackFromContact = () => {
        this.setState({ isContact: false });
    }

    handleClickContactImport = (event) => {
        event.preventDefault();
        this.setState({ isContact: true });
    }

    getSharedMailUser = () => {
        const {
            friendSearchQuery,
        } = this.state;
        this.mailUser.username = friendSearchQuery;
        return [this.mailUser];
    }

    getSearchedFriends = () => {
        if (
            this.state.friendSearchQuery.length !== 0 || 
            this.state.sendSuccess
        ) {
            if (this.isInputEmail()) {
                return this.getSharedMailUser();
            } else {
                return this.state.searchedFriends;
            }
        } else {
            return followingUsers;
        }
    }

    isInputEmail = () => {
        const { friendSearchQuery } = this.state;
        return friendSearchQuery.length > 1 && 
               friendSearchQuery.indexOf('@') > 0;
    }

    getPrefix(user) {
        return user.type === 'email' ? '' : '@';
    }

    static getShareMessage(objectType, defaultMessage = '') {
        let shareMessage = defaultMessage;
        if (objectType === ShareObjectTypes.list) {
            shareMessage = 'Share collection';
        } else if (objectType === ShareObjectTypes.store) {
            shareMessage = 'Share store';
        } else if (objectType === ShareObjectTypes.user) {
            shareMessage = 'Share profile';
        } else if (objectType === ShareObjectTypes.article) {
            shareMessage = 'Share article';
        }
        return shareMessage;
    }

    isEmailOnlyMode = () => {
        return !(this.props.objectType === ShareObjectTypes.thing || this.props.objectType === ShareObjectTypes.article) || !FancyUser.loggedIn;
    }

    componentDidUpdate(prevProps) {
        const { showShare } = this.props;
        const { isContact } = this.state;
        // share is closed, if contact mode close it.
        if (isContact && !showShare && prevProps.showShare !== showShare) {
            this.setState({ isContact: false });
        }
    }

    componentDidMount() {
        // Do loading friends stuff.
        if (!this.isEmailOnlyMode()) {
            this.getDisplayUsers();
        }
    }

    render() {
        const {
            showShare,
            title,
            headerGap,
            objectType,
            objectId,
            objectMeta,
            viewerUsername,
            referrerURL,
        } = this.props;

        if (process.env.NODE_ENV !== 'production') {
            viewerUsername == null &&
            console.warn('SharePopover: viewerUsername missing');
        }

        const {
            friendSearchQuery,
            sendNote,
            sendSuccess,
            sentUserID,
            searching,
            isContact
        } = this.state;
        const searchedFriends = this.getSearchedFriends();

        const selectedUser = this.getSelectedUser();
        const sentUser = this.getSentUser();

        var emptyDisplay = Display.Block;
        var emptyClassName;
        var searchedFriendsDisplay;
        const inputIsEmail = this.isInputEmail();
        const emailOnlyMode = this.isEmailOnlyMode(); 
        // Search returns nothing
        
        if (sendSuccess) {
            emptyClassName = ViewClasses.Success;
        } else {
            if (emailOnlyMode && !inputIsEmail) {
                emptyClassName = ViewClasses.Default;
            } else if (searchedFriends.length > 0) {
                if (!inputIsEmail && searching) {
                    emptyClassName = ViewClasses.Searching;
                }
            } else if (searchedFriends.length === 0) {
                if (friendSearchQuery.length === 0) {
                    if (this.loadingDisplayUsers) {
                        emptyClassName = ViewClasses.Searching;
                    } else {
                        emptyClassName = ViewClasses.Default;
                    }
                } else {
                    if (searching) {
                        emptyClassName = ViewClasses.Searching;
                    } else {
                        emptyClassName = ViewClasses.NoResult;
                    }
                }
            }
        }

        if (emptyClassName) {
            searchedFriendsDisplay = Display.None;
        } else {
            emptyDisplay = Display.None;
        }

        if (selectedUser) {
            searchedFriendsDisplay = Display.None;
        }

        const noteSendable = (
            !this.sending &&
            searchedFriends.length > 0 &&
            !!selectedUser
        );

        // Sliding indicator style
        const isSNS = !(selectedUser || sendSuccess);

        let sentMessage = '';
        if (sendSuccess) {
            sentMessage += gettext("Sent to ");
            sentMessage += sentUser ? (sentUser.fullname || sentUser.username) : sentUserID
        }

        let bottom = false;
        if (headerGap < 290) {
            bottom = true;
        }

        return (
            <div id="show-share" className={classnames("more-share-popup more-share-popup-2 has-arrow", { bot: bottom })} style={getDisplay(showShare)}>
                <h3 className="tit" style={Display.NoneIf(isContact || selectedUser)}>{SharePopover.getShareMessage(objectType, 'Share')}</h3>
                <a className="btn-back" style={Display.NoneIf(!selectedUser || sentUser)}
                   onClick={() => {this.setState({ selectedUserID: null });return false;}}>Back</a>
                <div className="frm" style={Display.NoneIf(isContact)}>
                    {FancyUser.loggedIn &&
                    <div id="more-share-send">
                        <span className="textbox before-bg-share2" style={Display.NoneIf(selectedUser || sendSuccess)}>
                            <input id="more-share-email"
                                   className="text" type="text"
                                   placeholder={emailOnlyMode ? gettext("Enter email address") : gettext("Username or email address")}
                                   autoComplete="off"
                                   onChange={this.handleFriendSearch}
                                   value={friendSearchQuery} />
                        </span>
                        <ul className="lists" style={searchedFriendsDisplay}>
                            {searchedFriends
                                .map((user, idx) => {
                                    const term = $.trim(friendSearchQuery).toLowerCase();
                                    const prefix = this.getPrefix(user);
                                    let style;
                                    if (term) {
                                        if (
                                            `${user.fullname} ${prefix}${user.username}`.toLowerCase().indexOf(term) === -1
                                        ) {
                                            style = Display.None;
                                        }
                                    }
                                    let username;
                                    let imgClass;
                                    if (user.type === 'email') {
                                        username = user.username;
                                        imgClass = 'email';
                                    } else {
                                        username = `${prefix}${user.username}`;
                                    }

                                    return (
                                        <li key={idx} style={style}>
                                            <a className="before-bg-share2"
                                                onClick={this.handleUserSelect}
                                                data-userid={user.id}>
                                                <img alt="" className={imgClass} src={user.profile_image_url} />
                                                <b>{user.fullname}</b>
                                                <small>{username}</small>
                                            </a>
                                        </li>
                                    )
                            })}
                        </ul>
                        <div className={emptyClassName} style={emptyDisplay}>
                            <i className="circle bg-share2" />
                            {emailOnlyMode ?
                                <span className="default">
                                    {gettext("Share this via Email")}
                                </span>
                                :
                                <span className="default">
                                    <b>{gettext("Find people to share with")}</b>
                                    <a onClick={this.handleClickContactImport}>{gettext("Import from contacts")}</a>
                                </span>
                            }
                            <span className="searching">
                                {gettext("Searching...")}
                            </span>
                            <span className="no-result">
                                {gettext("No users found")}
                            </span>
                            <span className="success">
                                <b>{gettext("Success!")}</b>
                                {sentMessage}
                                <a className="close" onClick={this.handleContinue}>{gettext("Continue")}</a>
                            </span>
                        </div>
                        <div className="send" style={Display.NoneIf(selectedUser == null)}>
                            {selectedUser && 
                                <span className="recipient">
                                    <img alt="user image" className={selectedUser.type === 'email' && 'email'} src={selectedUser.profile_image_url} />
                                    <b>{selectedUser.fullname}</b>
                                    <small>{this.getPrefix(selectedUser)}{selectedUser.username}</small>
                                </span>
                            }
                            <fieldset>
                                <textarea placeholder="Add a message" value={sendNote} onChange={this.handleSendNoteInput} />
                                <button className="btn-send" disabled={!noteSendable} onClick={this.handleSend}>Send</button>
                            </fieldset>
                        </div>
                    </div>
                    }
                    <SNSShareBox showShareBox={isSNS} title={title} referrerURL={referrerURL}
                                 objectId={objectId} objectType={objectType} objectMeta={objectMeta}
                                 viewerUsername={viewerUsername} />
                </div>
                <div className="contact-sns" style={Display.NoneIf(!isContact)}>
                    <a onClick={this.handleClickBackFromContact} className="back">Back</a>
                    <a href="/find-friends" className="fb" target="_blank"><em> Facebook</em></a>
                    <a href="/find-friends?type=twitter" className="tw" target="_blank"><em> Twitter</em></a>
                    <a href="/find-friends?type=gmail" className="gm" target="_blank"><em> Gmail</em></a>
                </div>
            </div>
        );
    }
}

export class SNSShareBox extends React.Component {
    state = {
        copied: false,
        referrerURL: '',
        textboxDisplay: false
    };
    loading = false;
    snsShareWindow = null;

    getRefURL() {
        return this.state.referrerURL || this.props.referrerURL
    }

    updateEmbedOption($li, viewerUsername) {
        const $thumb = $li.find('.embed-thum');
        const $options = $li.find('input[name="embed-info"]');
        const types = [];

        $options.each(function() {
            const { value, checked } = this;
            if (checked) {
                $thumb.addClass(value);
                types.push(value);
            } else {
                $thumb.removeClass(value);
            }
        });
        const width = parseInt($li.find('input[name="embed-width"]').val(), 10) || undefined;

        const snippet = $('<script />', {
            'src': `//${location.hostname}/embed.js?v=150608`,
            'async': true,
            'class': 'fancy-embed',
            'data-id': $li.attr('tid') || $li.attr('objectId') || '',
            'data-ref': viewerUsername,
            'data-type': types.length > 0 ? types.join(',') : '',
            'data-width': width
        }).prop('outerHTML');
        $li.find('textarea[name="embed-code"]').val(snippet);
    }

    handleEmbed = () => {
        const { updateEmbedOption, props: { objectType, objectId, viewerUsername } } = this;

        if (objectType === ShareObjectTypes.thing) {
            const $ep = $("#embed_popup");
            $ep
                .off('click.fancyembed')
                .off('keyup.fancyembed')
                .on('click.fancyembed', 'input[name="embed-info"]', function() {
                    updateEmbedOption($("#embed_popup"), viewerUsername);
                })
                .on('keyup.fancyembed', 'input[name="embed-width"]', function() {
                    updateEmbedOption($("#embed_popup"), viewerUsername);
                });

            $ep.find('.customize').removeClass('opened');
            $ep.find('input[name="embed-info"]').prop('checked', true);
            $ep.find('input[name="embed-width"]').val(450);
            $ep.attr('tid', objectId);
            updateEmbedOption($("#embed_popup"), viewerUsername);

            $.dialog("embed_item").open(true);
        }

        return false;
    }

    handleShare = (event) => {
        const { props: { objectId, objectType } } = this;
        const element = event.currentTarget;

        // redirect to acquired URL using blank window, which does not blocked by blocker usually.
        // Low possiblity, but if assign fails with DOMException, silently pass so
        // user can retry without confusion.
        if (event.detail && event.detail.faintClick) {
            try {
                this.snsShareWindow.location.assign(element.getAttribute('href'));
            } catch (e) {}
            // Remove disposable window 
            this.snsShareWindow = null;
            return;
        } else {
            if (!this.getRefURL()) {
                this.snsShareWindow = window.open('about:blank', '_fancy_sns_share');
            }
            event.preventDefault();
        }

        getShareURL(this, (directClick) => {
            if (directClick) {
                window.open(element.getAttribute('href'), '_fancy_sns_share');
            } else {
                triggerEvent(element, 'click', { faintClick: true });
            }
        });

        if (objectType === ShareObjectTypes.thing) {
            const type = SNSDict[element.className];
            MP('Complete Share', { "thing id": objectId, type });
        }
    }

    render() {
        const { title, showShareBox, objectType } = this.props;
        const { textboxDisplay } = this.state;
        const referrerURL = this.getRefURL()

        return (
            <div id="more-share-sns" className="more-share-sns" style={showShareBox ? Display.Block : Display.None}>
                <span className="via after" style={Display.NoneIf(textboxDisplay)}>
                    <a href={`https://www.facebook.com/sharer.php?u=${referrerURL}`}
                        onClick={this.handleShare} className="fb" target="_blank">
                        <span className="ic-fb" /> <em>{gettext("Share with Facebook")}</em>
                    </a>
                    <a href={`https://twitter.com/share?text=${encodeURI(title)}&url=${referrerURL}&via=fancy`}
                        onClick={this.handleShare} className="tw" target="_blank">
                        <span className="ic-tw" /> <em>{gettext("Share with Twitter")}</em>
                    </a>
                    <a href={`https://www.tumblr.com/share/link?url=${referrerURL}&name=${encodeURI(title)}&description=${encodeURI(title)}`}
                        onClick={this.handleShare} className="tb" target="_blank">
                        <span className="ic-tb" /> <em>{gettext("Share with Tumblr")}</em>
                    </a>
                    {objectType === ShareObjectTypes.thing &&
                        <a onClick={this.handleEmbed} className="embed">
                            <span className="ic-em" /> <em>{gettext("Embed this item")}</em>
                        </a>
                    }
                </span>
            </div>
        );
    }
}
