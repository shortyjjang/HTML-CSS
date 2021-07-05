import React, { Component } from "react";
import classnames from "classnames";

import { isEmpty, convertThingsV1ToRest, debounceUntilTimeout } from "fancyutils";
import { Display } from "fancymixin";

import { OtContainer, scrollEvent } from "../container/entry-events";
import { ThingCache, cache } from "../cache";
import ThingCard from "./ThingCard";

const Views = {
    Similar: "similar",
    Recently: "recently",
};

// bound later to timeline
function scrollTouchdown(isReached) {
    if (this.state.similarLoading || isReached !== true) {
        return;
    }
    this.updateSimilar(this.props.thing.id);
}

function shouldShowRecommendation() {
    if (!OtContainer.isStatic()) {
        return true;
    }
    const wHeight = $(window).height();
    const $content = $("#overlay-thing .wrapper-content .content > .wrapper");
    const tabHeight = $("#overlay-thing .wrapper-content .timeline .tabs").outerHeight();
    const footerHeight = $("#overlay-thing .timeline .tabs").outerHeight();
    const topOffset = $content.offset().top;
    return wHeight - (topOffset + ($content.height() + tabHeight) + footerHeight) > 0;
}

export default class Timeline extends Component {
    // Non-react states
    similarCursorEndReached = null;
    lastthingID = null;
    similarNextCursor = null;
    recentlyNextCursor = null;
    state = {
        currentView: Views.Similar,
        similarLoading: false,
        recently: [],
        similar: [],
    };

    handleToggleSimilar = (event) => {
        event.preventDefault();
        this.setState({ currentView: Views.Similar });
    };

    handleToggleRecently = (event) => {
        event.preventDefault();
        this.updateRecently(this.props.thing.id);
        this.setState({ currentView: Views.Recently });
    };

    // @param reset - thing is changed, page is 1
    updateSimilar = (thingID, reset) => {
        if (thingID == null || this.state.similarLoading || this.similarCursorEndReached) {
            return;
        }
        this.setState({ similarLoading: true }, () => {
            var nextCursorString = "";
            if (this.similarNextCursor != null) {
                nextCursorString = `&cursor=${this.similarNextCursor}`;
            }

            $.ajax({
                type: "get",
                url: `/might_also_fancy.json?include_sale_item_option=True&rapi_compl=True&thing_id=${thingID}&lang=${
                    window.CURRENT_LANGCODE || ""
                }&count=20${nextCursorString}`,
            })
                .done(({ next_cursor, results }) => {
                    if (!this.unmounted) {
                        const { similar } = this.state;
                        const converted = convertThingsV1ToRest(results);
                        cacheSimilarThings(converted);
                        logExposed(converted);

                        // Update/Insert things array
                        var things;
                        if (reset || isEmpty(similar)) {
                            things = converted;
                        } else if (_.isArray(similar)) {
                            things = similar.concat(converted);
                        }

                        // Write if page is reached end.
                        // this.similarCursorEndReached = ( next_cursor == null || !converted.length) ;    // End reached
                        this.similarCursorEndReached = true; // End reached
                        this.similarNextCursor = next_cursor;
                        this.setState({ similar: things });
                    }
                })
                .fail(function (xhr) {
                    console.warn("updateSimilar():", xhr);
                })
                .always(() => {
                    this.setState({ similarLoading: false });
                });
        });
    };

    updateRecently = (thingID) => {
        if (thingID == null) {
            return;
        }
        // TODO: Should update overlay viewed things.
        $.ajax({
            type: "get",
            url: `/recently_viewed_things_json?include_sale_item_option=True&rapi_compl=True&thing_id=${thingID}`,
        })
            .done((response) => {
                if (!this.unmounted) {
                    const recently = convertThingsV1ToRest(response).filter((_, i) => i < 20);
                    logExposed(recently);

                    this.setState({ recently });
                }
            })
            .fail(function (xhr) {
                console.warn("updateRecently():", xhr);
            });
    };

    handleDelete = (deletedThing) => {
        this.setState({ recently: this.state.recently.filter((thing) => thing.id !== deletedThing.id) });
    };

    componentDidMount() {
        // // in case browser is too big, load manually
        if (shouldShowRecommendation() || !this.props.thing.sales) {
            this.updateSimilar(this.props.thing.id);
        }
        scrollEvent.attach(debounceUntilTimeout(scrollTouchdown, 150, this));
        this.lastthingID = this.props.thing.id;
    }

    componentDidUpdate() {
        const nextProps = this.props;

        // Thing has changed, reset similar things.
        if (this.lastthingID !== nextProps.thing.id) {
            const idCopy = nextProps.thing.id;
            this.lastthingID = idCopy;
            this.similarCursorEndReached = null;
            this.similarNextCursor = null;
            if (shouldShowRecommendation() || !nextProps.thing.sales) {
                this.updateSimilar(nextProps.thing.id, true);
            }
        }
    }

    componentWillUnmount() {
        this.unmounted = true;
        // this.thingContext.disconnectTimeline();
        delete this.thingContext;
    }

    render() {
        const {
            appContext,
            appContext: { loggedIn },
            thing,
        } = this.props;
        const { currentView, recently, similar } = this.state;

        return (
            <div className={classnames("timeline other-thing newcard", { loading: thing.loading })}>
                <ul className="tabs after">
                    <li>
                        <a
                            className={classnames(Views.Similar, { current: currentView === Views.Similar })}
                            onClick={this.handleToggleSimilar}>
                            {__Config.nostore ? gettext("Similar items") : gettext("You may also Fancy")}
                        </a>
                    </li>
                    <li>
                        <a
                            className={classnames(Views.Recently, { current: currentView === Views.Recently })}
                            onClick={this.handleToggleRecently}>
                            {gettext("Recently viewed")}
                        </a>
                    </li>
                </ul>
                {currentView === Views.Similar && (
                    <div
                        className="inner similar"
                        style={{ display: similar.length > 0 || this.state.similarLoading ? "block" : "none" }}>
                        <ul className="after fancy-suggestions">
                            {similar &&
                                similar.map((similarThing, idx) => (
                                    <ThingCard
                                        itemIdx={idx}
                                        itemType="similar"
                                        loggedIn={loggedIn}
                                        key={`timeline-similar-${idx}`}
                                        viewer={this.props.appContext.viewer}
                                        appContext={appContext}
                                        {...similarThing}
                                    />
                                ))}
                        </ul>
                        <RecommendationItemLoading display={this.state.similarLoading} />
                    </div>
                )}
                {currentView === Views.Recently && (
                    <div className="inner recently" style={{ display: recently.length > 0 ? "block" : "none" }}>
                        <ul className="after fancy-suggestions">
                            {recently &&
                                recently.map((recentlyThing, idx) => (
                                    <ThingCard
                                        itemIdx={idx}
                                        itemType="recently"
                                        loggedIn={loggedIn}
                                        key={`timeline-recently-${idx}`}
                                        onDelete={this.handleDelete}
                                        viewer={this.props.appContext.viewer}
                                        appContext={appContext}
                                        {...recentlyThing}
                                    />
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

function RecommendationItemLoading({ display }) {
    return (
        <div id="infscr-loading" style={Display.NoneIf(!display)}>
            <img alt="Loading..." src="/_ui/images/common/loading.gif" />
            <div />
        </div>
    );
}

function cacheSimilarThings(things) {
    things.forEach((thing) => {
        if (!cache.exists(thing.id, ThingCache.THINGS)) {
            cache.add(thing.id, thing, ThingCache.THINGS);
        }
    });
}

function logExposed(things) {
    if (typeof LogExposed == "undefined") return;
    things.forEach((thing) => {
        window.LogExposed.addLog(thing.id + "", "thing related");
    });
}
