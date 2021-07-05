import React, { Component } from 'react';
import classnames from 'classnames';
import { MP, getConciseNumberString } from 'fancyutils';
import { Display } from 'fancymixin';

import { FancyStatus } from '../config';
import { cache } from '../cache';
import { onArticleFancyButtonUpdate } from '../SyncedContext';

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
             style={{ backgroundImage: `url(${user.image_url || user.profile_image_url})`}} />
        <em>{user.fullname || user.full_name}</em>
    </a>
);

const bgXPosSequence = [0, -54, -108, -163, -218, -272, -327, -436, -490, -545, -599, -654, -708, -763, -817, -872, -926, -981, -1035, -1144, -1199, -1253, -1308, -1417, -1471];

function isUserEqual(a, b) {
    if (a == null || b == null) {
        return false;
    }
    return a.id === b.id;
}

function _handleFancydStateOnLoadArticle(slug, { fancyd, save_count }, stateSetter = _ => _) {
    onArticleFancyButtonUpdate(slug, fancyd, getConciseNumberString(save_count));
    stateSetter({
        fancyd,
        save_count,
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
function toggleFancy(article, currentState, stateSetter = _ => _) {
    const { fancyd, save_count, loading } = currentState;
    const nextFancyd = !fancyd;
    const nextFancydCount = getNextFancydCount(nextFancyd, save_count);
    
    if (!loading) {
        stateSetter({
            fancyd: nextFancyd, loading: true, fancyStatus: getFancyStatus(nextFancyd)
        });

        $.ajax({
            type: 'POST',
            url: '/articles/save.json',
            data: {
                article_id: article.id,
                action: nextFancyd ? 'save':'unsave',
            }
        })
        .done(function(json){
            if (json.article_id && json.saved === !fancyd) {
                // Completing fancy
                
                cache.update(article.slug, undefined, 'saved', nextFancyd);
                cache.update(article.slug, undefined, 'save_count', nextFancydCount);
                onArticleFancyButtonUpdate(article.slug, nextFancyd, getConciseNumberString(nextFancydCount));
                
                stateSetter({
                    loading: false, fancyd: nextFancyd, save_count: nextFancydCount, fancyStatus: getCompletionIdleStatus(nextFancyd)
                });
            } else {
                // cancelling fancy
                stateSetter({ loading: false, fancyd, save_count, fancyStatus: getFancyStatus(fancyd) });
            }
        })
        .fail(function() {
            // cancelling fancy
            stateSetter({ loading: false, fancyd, save_count, fancyStatus: getFancyStatus(fancyd) });
        });
    }
}

export class FancydUsers extends Component {
    _getInitialState() {
        return {
            fancyAnimation: false,
            // button state
            fancyd: null,
            loading: false,
            save_count: null,
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
        const { save_count } = this.state;
        return save_count != null ? getConciseNumberString(save_count, 0) : '0';
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
            if (totalLength <= 8) {
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
        const indexLimit = 8;
        if (
            (fancyStatus === FancyStatus.AfterAddition ||
             fancyStatus === FancyStatus.Addition ||
             (fancyd && fancyStatus === FancyStatus.Idle)
            ) &&
            index > indexLimit
        ) {
            display = Display.None;
        }else if (
            fancyStatus === FancyStatus.Removal 
            &&
            index >= indexLimit
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
        toggleFancy(this.props.article, this.state, ns => { this.setState(ns) });
    }

    handleFancydStateOnLoadArticle = (article) => {
        if (article == null) {
            article = this.props.article;
        }
        _handleFancydStateOnLoadArticle(article.slug, { fancyd: article.saved, save_count: article.save_count  }, ns => { this.setState(ns); });
    }

    handleFancyClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const { article } = this.props;
        if (!this.props.appContext.loggedIn) {
            window.require_login && window.require_login(null, 'fancy_article', article.id);
            return;
        }
        const { fancyAnimation, fancyd, loading } = this.state;
        if (loading) {
            return;
        }
        if (!fancyd && !fancyAnimation) {
            this.setState({ fancyAnimation: true }, _ => { this.animateFancyBG(); });
        }

        if (!fancyd) {
            MP('Fancy', { article_id: article.id });
        } else {
            MP('Unfancy', { article_id: article.id });
        }

        this.toggleFancy();
    }

    componentDidMount() {
        this.handleFancydStateOnLoadArticle();
    }

    componentDidUpdate(prevProps) {
        const { article } = prevProps;
        const np = this.props
        // Thing has been updated.
        if (article.id !== np.article.id || article.isCrawled !== np.article.isCrawled) {
            this.handleFancydStateOnLoadArticle(article);
        }
    }

    render() {
        const {
            appContext: { loggedIn, viewer },
            article: { saved_users, user },
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
            saved_users &&
            saved_users.filter(fancydUser => !isUserEqual(fancydUser, user) &&
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
            <div className="like">
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
            </div>
        );
    }
}
