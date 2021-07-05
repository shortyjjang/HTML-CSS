import React, { Component } from "react";
import classnames from "classnames";
import { MP, getConciseNumberString } from "fancyutils";

import { FancyStatus } from "../config";
import { cache } from "../cache";


function _handleFancydStateOnLoadThing(thingID, { fancyd, fancyd_count }, stateSetter = _ => _) {
    stateSetter({
        fancyd,
        fancyd_count,
        loading: false,
        fancyStatus: FancyStatus.Idle
    });
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
            fancyd: nextFancyd,
            loading: true,
            fancyd_count: nextFancydCount,
            fancyStatus: getFancyStatus(nextFancyd)
        });

        $.ajax({
            type: "PUT",
            url: `/rest-api/v1/things/${thingID}`,
            data: {
                fancyd: nextFancyd
            }
        })
            .done(function(json) {
                if (json.id && json.fancyd === !fancyd) {
                    // Completing fancy
                    const nextFancydCount = json.fancyd === true ? (fancyd_count || 0) + 1 : (fancyd_count || 0) - 1;

                    cache.update(thingID, undefined, "fancyd", nextFancyd);
                    cache.update(thingID, undefined, "fancyd_count", nextFancydCount);

                    stateSetter({
                        loading: false,
                        fancyd: nextFancyd,
                        fancyd_count: nextFancydCount,
                        fancyStatus: getCompletionIdleStatus(nextFancyd)
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
const bigContainerStyle = { width: "285px" };

export class FancydUsers extends Component {
    static defaultProps = {
        displayCount: 8
    };

    _getInitialState() {
        return {
            fancyAnimation: false,
            // button state
            fancyd: null,
            loading: false,
            fancyd_count: null,
            fancyStatus: FancyStatus.Idle // fancyStatus = 'Idle', { Idle | Addition | Removal | After- } - Fancy'd status for animation control
        };
    }

    constructor(props) {
        super(props);
        this.state = this._getInitialState();
    }

    getFancydCountString = () => {
        const { fancyd_count } = this.state;
        return fancyd_count != null ? getConciseNumberString(fancyd_count, 0) : "0";
    };

    toggleFancy = () => {
        toggleFancy(this.props.thing.id, this.state, ns => {
            this.setState(ns);
        });
    };

    handleFancydStateOnLoadThing = thing => {
        if (thing == null) {
            thing = this.props.thing;
        }
        _handleFancydStateOnLoadThing(thing.id, { fancyd: thing.fancyd, fancyd_count: thing.fancyd_count }, ns => {
            this.setState(ns);
        });
    };

    handleFancyClick = event => {
        event.preventDefault();
        event.stopPropagation();
        const { thing } = this.props;
        if (!this.props.appContext.loggedIn) {
            window.require_login(null, "fancy_thing", thing.id);
            return;
        }
        const { fancyd, loading } = this.state;
        if (loading) {
            return;
        }

        if (!fancyd) {
            MP("Fancy", { thing_id: thing.id });
        } else {
            MP("Unfancy", { thing_id: thing.id });
        }

        this.toggleFancy();
    };

    componentDidMount() {
        this.handleFancydStateOnLoadThing();
    }

    componentDidUpdate(prevProps) {
        // Thing has been updated.
        const { thing } = this.props;
        const prevThing = prevProps.thing;
        if (thing.id !== prevThing.id || thing.isCrawled !== prevThing.isCrawled) {
            this.handleFancydStateOnLoadThing(thing);
        }
    }

    render() {
        const {
            bigContainer,
        } = this.props;
        const { fancyd } = this.state;

        return (
            <span style={bigContainer && bigContainerStyle} className="fancyd_users-wrap">
                <span className="count">
                    <a
                        onClick={this.handleFancyClick}
                        className={classnames("button button-static fancy _count", {
                            fancyd
                        })}>
                        {this.getFancydCountString()}
                    </a>
                    <span className="_fancyd" />
                </span>
            </span>
        );
    }
}
