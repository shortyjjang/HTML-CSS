import React from "react";
import classnames from "classnames";

import { isPlainLeftClick } from "fancyutils";
import { ShareObjectTypes } from './MoreShareUtils';


export class FancydPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            following: false
        };
    }

    componentDidMount() {
        const following = this.props.following || this.props.user.following;
        if (following) {
            this.setState({ following });
        }
    }

    handleFollow = event => {
        event.preventDefault();
        event.stopPropagation();

        const { user } = this.props;
        const { following, loading } = this.state;

        if (this.props.loggedIn !== true) {
            window.require_login();
            return;
        }

        if (loading) {
            return;
        }

        const url = following ? "/delete_follow.xml" : "/add_follow.xml";

        this.setState({ loading: true }, () => {
            $.ajax({
                type: "post",
                url,
                data: { user_id: user.id },
                dataType: "xml"
            })
                .done(xml => {
                    const nextFollowing = !following;
                    const $status = $(xml).find("status_code");
                    if ($status.length && $status.text() !== 0) {
                        this.setState({ following: nextFollowing });
                    }
                })
                .always(() => {
                    this.setState({ loading: false });
                });
        });
    };

    handleTransition = event => {
        if (isPlainLeftClick(event)) {
            const href = event.currentTarget.getAttribute("href");
            if (href) {
                location.href = href;
            }
        }
    };

    render() {
        const { user, isAddedUser, viewerId } = this.props;
        const { following } = this.state;

        return (
            <li>
                <a href={`/${user.username}`} className="username" onClick={this.handleTransition}>
                    <img
                        src="/_ui/images/common/blank.gif"
                        style={{ backgroundImage: `url(${user.image_url || user.user_square_image_small})` }}
                    />
                    {isAddedUser ? "Added by " : ""}
                    <b>{user.fullname || user.full_name}</b>
                    {isAddedUser ? "" : `@${user.username}`}
                </a>
                {viewerId !== user.id && (
                    <button
                        className={classnames("btns-gray-embo", following ? "following" : "follow")}
                        onClick={this.handleFollow}
                    />
                )}
            </li>
        );
    }
}

export class FancydByPopup extends React.Component {
    static popupName = "fancyd_list";

    constructor(props) {
        super(props);
        this.state = this._getInitialState();
    }

    _getInitialState() {
        return {
            loading: false,
            nextPage: 1,
            ended: null,
            added_user: null,
            users: [],
            owner: null
        };
    }

    getFollowList(nextProps, reset) {
        const { objectId, objectType } = nextProps || this.props;
        const { nextPage } = this.state;

        var immediateNextStateUpdate;
        if (reset) {
            immediateNextStateUpdate = this._getInitialState();
            immediateNextStateUpdate.loading = true;
        } else {
            immediateNextStateUpdate = { loading: true };
        }

        if (reset || (this.state.loading !== true && this.state.ended !== true)) {
            this.setState(immediateNextStateUpdate, () => {
                if (objectType === ShareObjectTypes.thing) {
                    $.get("/thing_follower_list.json", { thing_id: objectId, page: nextPage }, ({ has_next, users, owner }) => {
                        const nextState = { loading: false, users: this.state.users.concat(users), owner };
                        if (has_next) {
                            nextState.nextPage = this.state.nextPage + 1;
                            nextState.ended = false;
                        } else {
                            nextState.ended = true;
                        }
                        this.setState(nextState);
                    }).fail(() => {
                        this.setState({ loading: false });
                    });
                } else if (objectType === ShareObjectTypes.article) {
                    $.get(`/rest-api/v1/articles/${objectId}/saved_users`, { page: nextPage }, ({ max_page, current_page, saved_users }) => {
                        const users = saved_users;
                        const has_next = max_page > current_page;
                        const nextState = { loading: false, users: this.state.users.concat(users), owner: null };
                        if (has_next) {
                            nextState.nextPage = this.state.nextPage + 1;
                            nextState.ended = false;
                        } else {
                            nextState.ended = true;
                        }
                        this.setState(nextState);
                    }).fail(() => {
                        this.setState({ loading: false });
                    });
                }
                
            });
        }
    }

    componentDidMount() {
        this.getFollowList();
        this.__last_tid = this.props.objectId;
    }

    componentDidUpdate(nextProps) {
        if (this.__last_tid !== nextProps.objectId) {
            this.__last_tid = nextProps.objectId;
            this.getFollowList(nextProps, true);
        }
    }

    handleMore = event => {
        event.preventDefault();
        this.getFollowList();
    };

    render() {
        const { ended, users, owner } = this.state;
        const { loggedIn, viewerId } = this.props;
        return (
            <div>
                {/* TODO: via-overlay is needed to distinguish jQuery-attached Events and React Events -
                    need to deliver better alternative 
                    rel task: https://app.asana.com/0/86925821949642/152825012917493 */}
                <p className="ltit">{gettext("Fancy'd by")}</p>
                <ul>
                    {owner ? (
                        <FancydPerson user={owner} isAddedUser={true} viewerId={viewerId} loggedIn={loggedIn} />
                    ) : null}
                    {users.map((user, idx) => (
                        <FancydPerson key={`FancydBy-${idx}`} user={user} viewerId={viewerId} loggedIn={loggedIn} />
                    ))}
                    {ended === false && (
                        <li className="more">
                            <a onClick={this.handleMore}>{gettext("View More")}</a>
                        </li>
                    )}
                </ul>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        );
    }
}

export class FancydByPopupV4 extends React.Component {
    static popupName = "fancyd_list";

    constructor(props) {
        super(props);
        this.state = this._getInitialState();
    }

    _getInitialState() {
        return {
            loading: false,
            nextPage: 1,
            next_cursor: null,
            ended: null,
            added_user: null,
            users: [],
            owner: null
        };
    }

    getFollowList(nextProps, reset) {
        const { objectId, objectType, next_cursor } = nextProps || this.props;
        const { nextPage } = this.state;

        var immediateNextStateUpdate;
        if (reset) {
            immediateNextStateUpdate = this._getInitialState();
            immediateNextStateUpdate.loading = true;
        } else {
            immediateNextStateUpdate = { loading: true };
        }

        if (reset || (this.state.loading !== true && this.state.ended !== true)) {
            this.setState(immediateNextStateUpdate, () => {
                if (objectType === ShareObjectTypes.thing) {
                    const args = {};
                    if (!!next_cursor) {
                        args.cursor = next_cursor;
                    }

                    $.get(`/rest-api/v1/things/${objectId}/fancyd-users`, args, ({ next_cursor, fancyd_users }) => {
                        const nextState = { loading: false, users: this.state.users.concat(fancyd_users), owner: null };
                        if (!!next_cursor) {
                            nextState.next_cursor = next_cursor;
                            nextState.ended = false;
                        } else {
                            nextState.ended = true;
                        }
                        this.setState(nextState);
                    }).fail(() => {
                        this.setState({ loading: false });
                    });
                } else if (objectType === ShareObjectTypes.article) {
                    $.get(`/rest-api/v1/articles/${objectId}/saved_users`, { page: nextPage }, ({ max_page, current_page, saved_users }) => {
                        const users = saved_users;
                        const has_next = max_page > current_page;
                        const nextState = { loading: false, users: this.state.users.concat(users), owner: null };
                        if (has_next) {
                            nextState.nextPage = this.state.nextPage + 1;
                            nextState.ended = false;
                        } else {
                            nextState.ended = true;
                        }
                        this.setState(nextState);
                    }).fail(() => {
                        this.setState({ loading: false });
                    });
                }
                
            });
        }
    }

    componentDidMount() {
        this.getFollowList();
        this.__last_tid = this.props.objectId;
    }

    componentDidUpdate(nextProps) {
        if (this.__last_tid !== nextProps.objectId) {
            this.__last_tid = nextProps.objectId;
            this.getFollowList(nextProps, true);
        }
    }

    handleMore = event => {
        event.preventDefault();
        this.getFollowList();
    };

    handleScroll = (e) => {
        const el = e.target;
        if (this.state.ended) {
            return;
        }

        if ((el.scrollHeight - 50) <= (el.clientHeight + el.scrollTop)) {
            this.getFollowList();
        }
    }

    render() {
        const { users, owner } = this.state;
        const { loggedIn, loading, viewerId } = this.props;
        return (
            <div>
                {/* TODO: via-overlay is needed to distinguish jQuery-attached Events and React Events -
                    need to deliver better alternative 
                    rel task: https://app.asana.com/0/86925821949642/152825012917493 */}
                <p className="ltit">{gettext("Liked by")}</p>
                <ul onScroll={this.handleScroll}>
                    {owner ? (
                        <FancydPerson user={owner} isAddedUser={true} viewerId={viewerId} loggedIn={loggedIn} />
                    ) : null}
                    {users.map((user, idx) => (
                        <FancydPerson key={`FancydBy-${idx}`} user={user} viewerId={viewerId} loggedIn={loggedIn} />
                    ))}
                    {loading && (
                        <div id="infscr-loading">
                            <img alt="Loading..." src="/_ui/images/common/loading.gif" />
                        <div />
                    </div>
                    )}
                </ul>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        );
    }
}

// const onLoad = () => { 
//     $(document.body).on("click", ".buttons .fancyd_user", function() {
//         if ($(this).closest('#overlay-thing').length > 0) {
//             return true;
//         }
//         const $container = $(this).closest(".buttons");
//         const objectId = $container.find(".fancy, .fancyd").attr("tid");
//         const objectType = 'thing';
//         if (objectId) {
//             renderPopup(FancydByPopup, { objectId, objectType, loggedIn: FancyUser.loggedIn, viewerId: FancyUser.id });
//             return false;
//         }
//     });
// }

// if (document.readyState !== 'loading') {
//     onLoad()
// } else {
//     document.addEventListener("DOMContentLoaded", onLoad)
// }
