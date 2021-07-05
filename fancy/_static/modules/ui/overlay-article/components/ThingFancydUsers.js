import React, { Component } from 'react';
import classnames from 'classnames';
import { MP, getConciseNumberString } from 'fancyutils';
import { Display } from 'fancymixin';

import { FancyStatus } from '../config';
import { cache } from '../cache';


export function handleProfileMouseOver(event) {
    const $profile = $(event.currentTarget).find('em');
    $profile.css('margin-left', `${-($profile.width() / 2) - 10}px`);
}

const FancydUser = ({ user = {}, display, isViewer }) => (
    <a href={user.html_url}
       className={classnames("user", { _viewer: isViewer })}
       onMouseOver={handleProfileMouseOver}
       style={display}>
        <img src="/_ui/images/common/blank.gif"
             style={{ backgroundImage: `url(${user.user_square_image_small || user.image_url})`}} />
        <em>{user.full_name || user.fullname}</em>
    </a>
);

function isUserEqual(a, b) {
    if (a == null || b == null) {
        return false;
    }
    return a.id === b.id;
}

const bgXPosSequence = [0, -54, -108, -163, -218, -272, -327, -436, -490, -545, -599, -654, -708, -763, -817, -872, -926, -981, -1035, -1144, -1199, -1253, -1308, -1417, -1471];

function _handleFancydStateOnLoadThing(thingID, { fancyd, fancyd_count }, stateSetter = _ => _) {
    // onFancyButtonUpdate(thingID, fancyd, getConciseNumberString(fancyd_count));
    stateSetter({
        fancyd,
        fancyd_count,
        loading: false,
        fancyStatus: FancyStatus.Idle,
    })
}

function getFancyStatus(nextFancydState) {
    return nextFancydState ? FancyStatus.Addition : FancyStatus.Removal;
}
function getCompletionIdleStatus(currentFancyState) {
    const prevFancyState = !currentFancyState;
    return prevFancyState ? FancyStatus.AfterRemoval : FancyStatus.AfterAddition;
}
function getNextFancydCount(nextFancyd, currentFancydCount) {
    if (nextFancyd === true) {
        return currentFancydCount + 1;
    } else {
        return currentFancydCount - 1;
    }
}
function toggleFancy(thingID, currentState, stateSetter = _ => _) {
    const { fancyd, fancyd_count, loading } = currentState;
    const nextFancyd = !fancyd;
    const nextFancydCount = getNextFancydCount(nextFancyd, fancyd_count);

    if (!loading) {
        stateSetter({
            fancyd: nextFancyd, loading: true, fancyd_count: nextFancydCount, fancyStatus: getFancyStatus(nextFancyd)
        });

        $.ajax({
            type: 'PUT',
            url: `/rest-api/v1/things/${thingID}`,
            data: {
                fancyd: nextFancyd
            }
        })
        .done(function(json){
            if (json.id && json.fancyd === !fancyd) {
                // Completing fancy
                const nextFancydCount = (json.fancyd === true) ? (fancyd_count||0) + 1 : (fancyd_count||0) - 1;

                cache.update(thingID, undefined, 'fancyd', nextFancyd);
                cache.update(thingID, undefined, 'fancyd_count', nextFancydCount);
                // onFancyButtonUpdate(thingID, nextFancyd, getConciseNumberString(nextFancydCount));

                stateSetter({
                    loading: false, fancyd: nextFancyd, fancyd_count: nextFancydCount, fancyStatus: getCompletionIdleStatus(nextFancyd)
                });
            } else {
                // cancelling fancy
                stateSetter({ loading: false, fancyd, fancyd_count, fancyStatus: getFancyStatus(fancyd) });
            }
        })
        .fail(function() {
            // cancelling fancy
            stateSetter({ loading: false, fancyd, fancyd_count, fancyStatus: getFancyStatus(fancyd) });
        });
    }
}

// workaround for profile heads overflow on animation
const bigContainerStyle = { width: '285px' };

export class FancydUsers extends Component {
    _getInitialState() {
        return {
            fancyAnimation: false,
            // button state
            fancyd: null,
            loading: false,
            fancyd_count: null,
            fancyStatus: FancyStatus.Idle, // fancyStatus = 'Idle', { Idle | Addition | Removal | After- } - Fancy'd status for animation control
        };
    };

    constructor(props) {
        super(props);
        this.state = this._getInitialState();
        this.fancyBGAnimationRef = element => {
            this.fancyBGAnimation = element;
        }
    }

    getFancydCountString = () => {
        const { fancyd_count } = this.state;
        return fancyd_count != null ? getConciseNumberString(fancyd_count, 0) : '0';
    }

    animateFancyBG = (frame) => {
        if (frame === undefined) {
            this.animateFancyBG(0);
        } else if (frame < bgXPosSequence.length) {
            // Special branching due to misposition in background
            var xPos = bgXPosSequence[frame];
            $(this.fancyBGAnimation).css('background-position-x', `${xPos}px`);
            setTimeout(() => { this.animateFancyBG(frame + 1) }, 10);
        } else if (frame >= bgXPosSequence.length) {
            this.setState({ fancyAnimation: false });
        }
    }

    getFancyduserDisplay = (user, index, totalLength) => {
        const {
            appContext: { viewer },
            bigContainer,
        } = this.props;
        const {
            fancyd,
            fancyStatus,
        } = this.state;

        const first = index === 0;
        const last = index === totalLength - 1;

        var display;
        if (fancyStatus === FancyStatus.AfterAddition || fancyStatus === FancyStatus.Addition) {
            // designer satisfaction 1)
            if (totalLength <= 2) {
                display = Display.Inline;
            } else {
                if (first) {
                    display = Display.Inline;
                } 
            }
        } else if (fancyStatus === FancyStatus.AfterRemoval || fancyStatus === FancyStatus.Removal) {
            if (first) {
                display = Display.None;
            } else if (last) {
                display = Display.Inline;
            }
        }
        // designer satisfaction 2) https://app.asana.com/0/86925821949642/161445424426526
        const indexLimit = bigContainer ? 6 : 5;
        if (
            (fancyStatus === FancyStatus.AfterAddition ||
             fancyStatus === FancyStatus.Addition ||
             fancyStatus === FancyStatus.Removal ||
             (fancyd && fancyStatus === FancyStatus.Idle)
            ) &&
            index > indexLimit
        ) {
            display = Display.None;
        }

        if (fancyStatus === FancyStatus.Idle &&
            !fancyd &&
            isUserEqual(user, viewer)
        ) {
            display = Display.None;
        }

        return display;
    }

    toggleFancy = () => {
        toggleFancy(this.props.thing.id, this.state, ns => { this.setState(ns) });
    }

    handleFancydStateOnLoadThing = (thing) => {
        if (thing == null) {
            thing = this.props.thing;
        }
        _handleFancydStateOnLoadThing(thing.id, { fancyd: thing.fancyd, fancyd_count: thing.fancyd_count }, ns => { this.setState(ns); });
    }

    handleFancyClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!this.props.appContext.loggedIn) {
            window.require_login && window.require_login();
            return;
        }
        const { thing } = this.props;
        const { fancyAnimation, fancyd, loading } = this.state;
        if (loading) {
            return;
        }
        if (!fancyd && !fancyAnimation) {
            this.setState({ fancyAnimation: true }, _ => { this.animateFancyBG(); });
        }

        if (!fancyd) {
            MP('Fancy', { thing_id: thing.id });
        } else {
            MP('Unfancy', { thing_id: thing.id });
        }

        this.toggleFancy();
    }

    componentDidMount() {
        this.handleFancydStateOnLoadThing();
    }

    componentDidUpdate({ thing }) {
        // Thing has been updated.
        if (thing.id !== this.props.thing.id || thing.isCrawled !== this.props.thing.isCrawled) {
            this.handleFancydStateOnLoadThing(thing);
        }
    }

    render() {
        const {
            appContext: { loggedIn, viewer },
            thing: { fancyd_users, user },
            bigContainer,
        } = this.props;
        const {
            fancyd,
            fancyAnimation,
            fancyStatus,
        } = this.state;

        const fancydUsers = [
            loggedIn && viewer,
            loggedIn && !isUserEqual(viewer, user) && user
        ]
        .concat(
            fancyd_users &&
            fancyd_users.filter(fancydUser => !isUserEqual(fancydUser, user) &&
                                              !isUserEqual(fancydUser, viewer))
        )
        .filter(e => e);

        var fancydUserAnimClass;
        if (fancyStatus === FancyStatus.Addition) {
            fancydUserAnimClass = "add";
        } else if (fancyStatus === FancyStatus.Removal) {
            fancydUserAnimClass = "remove";
        }
        // designer satisfaction 1)
        // If user is less than 2 we need to apply special class.
        // In this way dont owner profile dont get 'consumed': https://app.asana.com/0/86925821949642/173945332708784
        const userCountSufficiency = fancydUsers.length <= 2 ? '_insuff' : '_suff';

        return (
            <span style={bigContainer && bigContainerStyle} className="fancyd_users-wrap">
                <span className="count">
                    <a onClick={this.handleFancyClick}
                       className={classnames("button button-static fancy _count", { fancyd, loading: fancyAnimation })}>
                        <span ref={this.fancyBGAnimationRef}>
                            <i />
                        </span>{this.getFancydCountString()}
                    </a>
                    <span className="_fancyd" />
                </span>
                <span className={classnames("fancyd_user", fancydUserAnimClass, userCountSufficiency)}>
                    {fancydUsers.map((user, index) => {
                        const isViewer = isUserEqual(user, viewer);
                        return (
                            <FancydUser key={index}
                                        user={user}
                                        display={this.getFancyduserDisplay(user, index, fancydUsers.length)}
                                        isViewer={isViewer} />
                        );
                    })}
                </span>
            </span>
        );
    }
}
