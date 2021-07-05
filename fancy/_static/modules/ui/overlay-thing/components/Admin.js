import React, { Component } from "react";
import { Display } from "fancymixin";
import { didClickOn, eitherFancy, getFancyDepsRoot, xmlUtil } from "fancyutils";

// 'yy-mm-dd H:i:s';
function formatISODate(date) {
    return date ? removeISOString(date.toISOString()) : "";
}

function removeISOString(dateTimeString) {
    return dateTimeString.replace(/T/, " ").split(".")[0];
}

function handleInput(stateKey, component) {
    return function InputHandler(event) {
        const el = event.target;
        const key = el.type === "checkbox" ? "checked" : "value";
        component.setState({ [stateKey]: el[key] });
    };
}

export default class Admin extends Component {
    state = {
        showOnHomepage: null,
        showOnHomepageChecked: null,
        showInSearch: null,
        datePublished: null,
        datePublishedIntermediate: "",
        salesShowInNewest: null,
        salesExcludeFromPopular: null,
        salesEditorPicked: null,
        salesEditorPickedIntermediate: "",
        salesEditorPickedChecked: null,
        salesVideoFeatured: null,
        thingVideoUrl: "",
        collapse: false
    };

    loading = false;

    constructor(props) {
        super(props);
        this.changeOwnerInputRef = element => {
            this.changeOwnerInput = element;
        }
        this.reassignInputRef = element => {
            this.reassignInput = element;
        }
    }

    setThingAdminState = (thing) => {
        const datePublished = new Date(thing.date_published) || new Date();
        const salesEditorPicked =
            thing.sales && (thing.sales.editor_picked ? new Date(thing.sales.editor_picked) : new Date());
        this.setState({
            showOnHomepage: thing.show_on_homepage,
            showOnHomepageChecked: thing.show_on_homepage == true,
            datePublished,
            datePublishedIntermediate: formatISODate(datePublished),
            salesShowInNewest: thing.sales && thing.sales.show_in_newest,
            showInSearch: thing.show_in_search,
	    salesExcludeFromPopular: thing.exclude_from_popular,
            salesEditorPicked,
            salesEditorPickedIntermediate: salesEditorPicked instanceof Date ? formatISODate(salesEditorPicked) : "",
            thingVideoUrl: thing.metadata && thing.metadata.video_url ? thing.metadata.video_url : "",
            salesEditorPickedChecked: (thing.sales && thing.sales.editor_picked) != null,
            salesVideoFeatured: thing.sales && thing.sales.video && thing.sales.video.featured
        });
    }

    handleReassign = () => {
        const { thing } = this.props;
        var thing_id = thing.id;
        var user_id = thing.user.id;
        var new_thing_id = thing.ntid;
        var reassign_thing_id = $(this.reassignInput)
            .val()
            .trim();

        if (!Number.isInteger(Number(reassign_thing_id))) {
            alert("Please enter thing_id");
            return false;
        }
        if (thing_id == reassign_thing_id) {
            alert("Please check thing_id. You can't merge this to itself.");
            return false;
        }
        if (this.loading) {
            return false;
        }
        if (window.confirm(`sure to delete the current thing and reassign to thing_id: ${reassign_thing_id}?`)) {
            if (this.loading) {
                return false;
            }
            this.loading = true;
            $.post(
                "/merge_duplicate_things.xml",
                {
                    reassign_thing_id,
                    thing_id,
                    new_thing_id,
                    user_id
                },
                function(xml) {
                    if (xmlUtil.isSuccess(xml)) {
                        alert("done");
                        location.href = $(xml)
                            .find("url")
                            .text();
                    } else if (xmlUtil.isFail(xml)) {
                        var msg = $(xml)
                            .find("message")
                            .text();
                        alert(msg);
                    }
                },
                "xml"
            )
                .fail(() => {
                    alert("There was an error.");
                })
                .always(() => {
                    this.loading = false;
                });
        }
        return false;
    }

    handleOwnerChange = () => {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        const { thing } = this.props;
        var thing_id = thing.id;
        var old_user_id = thing.user.id;
        var new_thing_id = thing.ntid;

        var new_owner_name = $(this.changeOwnerInput)
            .val()
            .trim();
        if (thing.user.username === new_owner_name) {
            alert("The thing is already owned by the user.");
            this.loading = false;
            return false;
        }
        var placeholder_str = $(this.changeOwnerInput)
            .attr("placeholder")
            .trim();
        if (new_owner_name == placeholder_str || new_owner_name.length === 0) {
            alert("Please enter new username.");
            this.loading = false;
            return false;
        }

        if (window.confirm(`sure to owner of the current thing to username: ${new_owner_name}?`)) {
            $.ajax({
                type: "post",
                url: "/change_new_thing_owner.xml",
                data: {
                    new_owner_name,
                    thing_id,
                    new_thing_id,
                    old_user_id
                },
                dataType: "xml"
            })
                .done(xml => {
                    if (xmlUtil.isSuccess(xml)) {
                        alert("done");
                        eitherFancy("Shared", ({ reloadCurrentThing }) => {
                            reloadCurrentThing();
                        });
                    } else if (xmlUtil.isFail(xml)) {
                        alert(
                            $(xml)
                                .find("message")
                                .text()
                        );
                    }
                })
                .fail(() => {
                    alert("There was an error.");
                })
                .always(() => {
                    this.loading = false;
                });
        } else {
            this.loading = false;
        }
        return false;
    }

    handleFeaturedVideo = (event) => {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        const salesVideoFeatured = event.target.checked;
        this.setState({ salesVideoFeatured }, () => {
            const { thing } = this.props;
            var thing_id = thing.id;
            var user_id = thing.user.id;
            var new_thing_id = thing.ntid;
            var show_on_homepage = salesVideoFeatured;

            $.post(
                "/set_show_video_on_homepage.xml",
                {
                    thing_id,
                    new_thing_id,
                    user_id,
                    show_on_homepage
                },
                function(xml) {
                    if (xmlUtil.isSuccess(xml)) {
                        alert("Video Setting saved");
                        eitherFancy("Shared", ({ cache }) =>
                            cache.update(thing_id, undefined, "show_on_homepage", show_on_homepage)
                        );
                    } else if (xmlUtil.isFail(xml)) {
                        alert(
                            $(xml)
                                .find("message")
                                .text()
                        );
                    }
                },
                "xml"
            )
                .fail(() => {
                    alert("There was an error.");
                })
                .always(() => {
                    this.loading = false;
                });
            return false;
        });
    }

    handlePublishedDateChange = (nextState) => {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        const { thing } = this.props;
        const { datePublishedIntermediate } = this.state;
        let showOnHomepageChecked = (nextState && nextState.showOnHomepageChecked);
        if (showOnHomepageChecked == null) {
            showOnHomepageChecked = this.state.showOnHomepageChecked;
        }

        var date_published;
        if (showOnHomepageChecked) {
            let inputDate = new Date(datePublishedIntermediate);
            if (Number.isNaN(inputDate)) {
                alert("illformatted date - please put ISO date (i.e. 2020-01-01 10:10:10)");
                return false;
            }
            inputDate = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000); // utc date
            inputDate = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000); // apply timezone offset
            date_published = formatISODate(inputDate);
        }
        
        var show_on_homepage = showOnHomepageChecked ? 1 : 0;

        var thing_id = thing.id;
        var user_id = thing.user.id;
        var new_thing_id = thing.ntid;
        var payload = {
            new_thing_id,
            thing_id,
            show_on_homepage,
            user_id
        }
        if (date_published) {
            payload.date_published = date_published
        }

        $.post(
            "/set_show_on_homepage.xml",
            payload,
            function(xml) {
                if (xmlUtil.isSuccess(xml)) {
                    alert("publish option set");
                } else if (xmlUtil.isFail(xml)) {
                    alert(
                        $(xml)
                            .find("message")
                            .text()
                    );
                }
            },
            "xml"
        )
            .fail(() => {
                alert("There was an error.");
            })
            .always(() => {
                this.loading = false;
            });

        return false;
    }

    handleShowNewest = (event) => {
        if (this.loading) {
            return false;
        }
        this.loading = true;

        const salesShowInNewest = event.target.checked;
        this.setState({ salesShowInNewest }, () => {
            const { thing } = this.props;
            const { salesShowInNewest } = this.state;
            const sale_item_id = thing.sales && thing.sales.id;
            $.post(
                "/set_show_in_newest.xml",
                {
                    sale_item_id,
                    show_in_newest: salesShowInNewest ? "true" : "false"
                },
                function(xml) {
                    if (xmlUtil.isSuccess(xml)) {
                        alert("show in newest set");
                    } else if (xmlUtil.isFail(xml)) {
                        alert(
                            $(xml)
                                .find("message")
                                .text()
                        );
                    }
                },
                "xml"
            )
                .fail(() => {
                    alert("There was an error.");
                })
                .always(() => {
                    this.loading = false;
                });
        });
    }

    handleShowInSearch = (event) => {
        if (this.loading) {
            return false;
        }
        this.loading = true;

        const showInSearch = event.target.checked;
        this.setState({ showInSearch }, () => {
            const { thing } = this.props;
            const { showInSearch } = this.state;
            const thing_id = thing.id;

            $.post(
                "/set_show_in_search.json",
                {
                    thing_id,
                    show_in_search: showInSearch ? "true" : "false"
                },
                function(json) {
                    if (json.success) {
                        alert("show_in_search set");
                    }
                },
                "json"
            )
                .fail(() => {
                    alert("There was an error.");
                })
                .always(() => {
                    this.loading = false;
                });
        });
    }


    handleExcludePopular = (event) => {
        if (this.loading) {
            return false;
        }
        this.loading = true;

        const salesExcludeFromPopular = event.target.checked;
        this.setState({ salesExcludeFromPopular }, () => {
            const { thing } = this.props;
            const { salesExcludeFromPopular } = this.state;
            const thing_id = thing.id;
            $.post(
                "/set_exclude_from_popular.json",
                {
                    thing_id,
                    exclude_from_popular: salesExcludeFromPopular ? "true" : "false"
                },
                function(json) {
                    if (json.success) {
                        alert("exclude_from_popular set");
                    }
                },
                "json"
            )
                .fail(() => {
                    alert("There was an error.");
                })
                .always(() => {
                    this.loading = false;
                });
        });
    }

    handleEditorPickChange = () => {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        const { thing } = this.props;
        const { salesEditorPickedIntermediate, salesEditorPickedChecked } = this.state;

        var inputDate = new Date(salesEditorPickedIntermediate);
        if (Number.isNaN(inputDate)) {
            alert("illformatted date - please put ISO date (i.e. 2016-03-11 02:48:44)");
            return false;
        }
        inputDate = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000);
        var thing_id = thing.id;
        var user_id = thing.user.id;
        var new_thing_id = thing.ntid;
        var editor_picked = salesEditorPickedChecked ? formatISODate(inputDate) : "";

        $.post(
            "/set_editor_picked.xml",
            {
                editor_picked,
                thing_id,
                new_thing_id,
                user_id
            },
            function(xml) {
                if (xmlUtil.isSuccess(xml)) {
                    alert("editors picked set");
                } else if (xmlUtil.isFail(xml)) {
                    alert(
                        $(xml)
                            .find("message")
                            .text()
                    );
                }
            },
            "xml"
        )
            .fail(() => {
                alert("There was an error.");
            })
            .always(() => {
                this.loading = false;
            });
        return false;
    }

    handleThingVideoUrl = () => {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        const { thing } = this.props;
        const { thingVideoUrl } = this.state;
        const thing_id = thing.id;
        const user_id = thing.user.id;
        $.post(
            "/set_thing_video_url.xml",
            {
                thing_id,
                user_id,
                video_url: thingVideoUrl
            },
            function(xml) {
                if (xmlUtil.isSuccess(xml)) {
                    alert("video url set");
                } else if (xmlUtil.isFail(xml)) {
                    alert(
                        $(xml)
                            .find("message")
                            .text()
                    );
                }
            },
            "xml"
        )
            .fail(() => {
                alert("There was an error.");
            })
            .always(() => {
                this.loading = false;
            });
    }

    handleCollapseClick = () => {
        this.setState({ collapse: !this.state.collapse });
    }

    componentDidUpdate(prevProps) {
        const { thing } = this.props;
        if (
            prevProps.appContext.lastFullyRenderedThingID !== this.props.appContext.lastFullyRenderedThingID &&
            thing.fromServer
        ) {
            this.setThingAdminState(thing);
        }
    }

    componentDidMount() {
        const adminForm = $(".admin-user-frm");
        if (adminForm.length > 0) {
            adminForm.draggable({ handle: ".stit" });
        }
        const { thing } = this.props;
        if (thing.fromServer) {
            this.setThingAdminState(thing);
        }
    }

    render() {
        const { appContext: { viewer }, thing, thing: { sales } } = this.props;

        const {
            datePublishedIntermediate,
            showOnHomepageChecked,
            salesShowInNewest,
	    showInSearch,
	    salesExcludeFromPopular,
            salesEditorPickedChecked,
            salesEditorPickedIntermediate,
            salesVideoFeatured,
            thingVideoUrl,
            collapse
        } = this.state;

        const canSeeOrder = sales && !thing.is_fancybox && !thing.is_vanity_number_thing;
        const canSeeCart = viewer.is_admin_senior && !viewer.is_admin_manager;

        return (
            <div className={`wrapper admin-user-frm ${collapse ? "show" : ""}`}>
                <h3 className="stit">Admin</h3>
                <a onClick={this.handleCollapseClick} className="collapse" />
                <form>
                    <ul>
                        {canSeeOrder && (
                            <li>
                                <a href={`/admin/view-sale-orders-by-thing-id?thing_id=${thing.id}`}>View Orders</a>
                            </li>
                        )}
                        {canSeeOrder &&
                            canSeeCart && (
                                <li>
                                    <a href={`/admin/view-users-by-cart-item?sale_id=${sales.id}`}>View Carts</a>
                                </li>
                            )}
                        <li>
                            <a href={`/view-edit-new-thing?ntid=${thing.ntid}&ooid=${thing.user && thing.user.id}`}>
                                Edit Directory Entries
                            </a>
                        </li>
                        <li>
                            Fancy'd: {thing.fancyd_count}
                        </li>
                    </ul>
                </form>
                <dl>
                    <dt>Change owner</dt>
                    <dd className="change-owner">
                        <input
                            type="text"
                            className="text full"
                            ref={this.changeOwnerInputRef}
                            placeholder="Enter new username"
                        />
                        <button className="btns-blue-embo btn-owner" onClick={this.handleOwnerChange}>
                            Submit
                        </button>
                    </dd>
                </dl>
                <dl className="show-on-homepage">
                    <dt>Show on homepage</dt>
                    <dd className="after">
                        <p className="left">
                            <input
                                type="checkbox"
                                id="homepage_y"
                                name="homepage"
                                checked={showOnHomepageChecked}
                                onChange={(e) => {
                                    handleInput("showOnHomepageChecked", this)(e);
                                    if (!e.target.checked) {
                                        this.handlePublishedDateChange({ showOnHomepageChecked: false })
                                    }
                                }}
                            />
                            <label htmlFor="homepage_y">Show</label>
                        </p>
                        <div className="left">
                            <input
                                type="text"
                                id="time_date_published"
                                className="text"
                                value={datePublishedIntermediate}
                                onChange={handleInput("datePublishedIntermediate", this)}
                                style={Display.NoneIf(!showOnHomepageChecked)}
                            />
                            <button
                                className="btns-blue-embo btn-date-published"
                                onClick={this.handlePublishedDateChange}>
                                Submit
                            </button>
                        </div>
                    </dd>
                </dl>
                <form>
                    <ul className="showon">
                        <li className="exclude_pop" key="exclude_pop">
                            <label>Exclude from Popular</label>
                                <input
                                    type="checkbox"
                                    id="exclude_from_pop"
                                    name="exclude_from_pop"
                                    checked={salesExcludeFromPopular}
                                    onChange={this.handleExcludePopular}
                                />
                        </li>
                        <li className="show_in_search" key="show_in_search">
                            <label>Show in Search</label>
                                <input
                                    type="checkbox"
                                    id="show_in_search"
                                    name="show_in_search"
                                    checked={showInSearch}
                                    onChange={this.handleShowInSearch}
                                />
                        </li>
                        {sales &&
                            sales.video &&
                            sales.video.is_ready && (
                                <li
                                    className="after"
                                    id="homepage_video">
                                    <input
                                        type="checkbox"
                                        id="homepage_video_y"
                                        name="homepage_video"
                                        checked={salesVideoFeatured}
                                        onChange={this.handleFeaturedVideo}
                                    />
                                    <label htmlFor="homepage_video_y">Show video on Timeline</label>
                                </li>
                            )}
                            {sales && [
                                <li className="feature_item_on" key="feature_item_on">
                                    <label>Show on Editor's Picks</label>
                                    <input
                                        type="checkbox"
                                        id="feature_item_epick"
                                        name="feature_item"
                                        checked={salesEditorPickedChecked}
                                        onChange={handleInput("salesEditorPickedChecked", this)}
                                    />
                                    <p className="time-date-epicks" style={Display.NoneIf(!salesEditorPickedChecked)}>
                                        <input
                                            type="text"
                                            id="time_date_epicks"
                                            className="text"
                                            value={salesEditorPickedIntermediate}
                                            onChange={handleInput("salesEditorPickedIntermediate", this)}
                                        />
                                        <button 
                                            className="btns-blue-embo time_date_epicks"
                                            onClick={this.handleEditorPickChange}>
                                            Submit
                                        </button>
                                    </p>
                                </li>,
                                <li className="show_newest" key="show_newest">
                                    <label>Show on Newest</label>
                                    <input
                                        type="checkbox"
                                        id="show_in_newest"
                                        name="show_in_newest"
                                        checked={salesShowInNewest}
                                        onChange={this.handleShowNewest}
                                    />
                                </li>
                            ]}
                    </ul>
                </form>
                <dl className="reassign">
                    <dt>Reassign</dt>
                    <dd>
                        <input ref={this.reassignInputRef} type="text" className="text full" placeholder="Enter Thing_ID" />
                        <button className="btns-blue-embo btn-reassign" onClick={this.handleReassign}>
                            Submit
                        </button>
                    </dd>
                </dl>
                <dl className="videourl">
                    <dt>Video URL Override</dt>
                    <dd>
                        <input
                            type="text"
                            className="text full"
                            placeholder="Enter mp4 URL"
                            value={thingVideoUrl}
                            onChange={handleInput("thingVideoUrl", this)}
                        />
                        <button className="btns-blue-embo btn-videourl" onClick={this.handleThingVideoUrl}>
                            Submit
                        </button>
                    </dd>
                </dl>
            </div>
        );
    }
}

const sharedState = {
    /* mutable */ draggingAdmin: false
};

$(document).ready(() => {
    $(document.body).on("mousedown", "#overlay-thing .popup.overlay-thing", function(event) {
        const clickedOn = didClickOn($(event.target), ".thing-detail-container .admin-user-frm");
        sharedState.draggingAdmin = clickedOn;
    });
});

getFancyDepsRoot().Admin = {
    sharedState
};
