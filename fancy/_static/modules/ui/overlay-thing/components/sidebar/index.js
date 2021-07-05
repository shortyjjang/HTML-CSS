import React, { Component } from "react";
import classnames from "classnames";
import { isEmpty, cdnUtils, didClickOn, renderPopup, getConciseNumberString } from "fancyutils";
import { BGImage, Display } from "fancymixin";

import appState from "../../appstate";
import { toggleFollow } from "../../action/action-helpers";
import SidebarHead from "./heads/index";

export class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reported: props.thing.reported_by_viewer,
            showQuestion: false,
        };
    }

    handleRequestSaleOpen = (event) => {
        event.preventDefault();
        const { thing } = this.props;
        import(/* webpackChunkName: "OverlayThing.popup" */ "../popup/index").then(({ RequestSalePopup }) => {
            renderPopup(RequestSalePopup, { thing });
        });
        return false;
    };

    componentDidUpdate(prevProps) {
        const nextProps = this.props;
        if (nextProps.thing.id !== prevProps.thing.id) {
            this.setState({ reported: nextProps.thing.reported_by_viewer });
        }
    }

    handleReport = (event) => {
        event.preventDefault();
        if (!appState.loggedIn) {
            window.require_login();
            return;
        }
        const self = this;
        if (self.state.reported) {
            window.alertify.confirm(window.gettext("Cancel Report this?"), function (e) {
                if (e) {
                    $.ajax({
                        type: "post",
                        url: "/cancel_report_thing.xml",
                        data: { tid: self.props.thing.id },
                        dataType: "xml",
                        success(xml) {
                            var $xml = $(xml);
                            var $st = $xml.find("status_code");
                            if ($st.length && $st.text() === "1") {
                                window.alertify.alert(window.gettext("Cancelled your report."));
                                self.setState({ reported: false });
                            }
                        },
                    });
                }
            });
        } else {
            window.alertify.confirm(window.gettext("Report this as inappropriate or broken?"), function (e) {
                if (e) {
                    $.ajax({
                        type: "post",
                        url: "/report_thing.xml",
                        data: { tid: self.props.thing.id },
                        dataType: "xml",
                        success(xml) {
                            var $xml = $(xml);
                            var $st = $xml.find("status_code");
                            if ($st.length && $st.text() === "1") {
                                window.alertify.alert(window.gettext("Reported. We'll look into it."));
                                self.setState({ reported: true });
                            }
                        },
                    });
                }
            });
        }
    };

    render() {
        var {
            thing,
            thing: { META, from_list, sales, sales_available },
        } = this.props;

        // Should we display 'Request for sale' button?
        var requestSale = !(sales_available || META.Giftcard || META.Hotel || META.LaunchApp);
        // Should we show merchant information?
        var sidebarMerchantInfo;
        if (sales_available && sales.seller.is_seller && thing.type !== "fancybox" && thing.type !== "vanity_number") {
            sidebarMerchantInfo = <SidebarMerchantInfo {...this.props} />;
        }

        var reported = appState.loggedIn && this.state.reported;
        var reportLabel = reported ? gettext("Undo Reporting") : gettext("Report as inappropriate");

        return (
            <aside className="sidebar">
                <SidebarHead {...this.props} />
                {/*<SidebarApplePayAd />*/}
                {sidebarMerchantInfo}
                {/*<SidebarFancydFriends {...this.props} />*/}
                {/*(!isEmpty(added_lists) || category_item) && <SidebarAddmore thing={thing} />*/}
                {/*from_list && <SidebarFromList {...this.props} />*/}
                {thing && (
                    <div className="flagged">
                        {requestSale && <a onClick={this.handleRequestSaleOpen}>{gettext("Request for sale")}</a>}
                        <a onClick={this.handleReport} className={classnames("report-link", { reported })}>
                            {reportLabel}
                        </a>
                    </div>
                )}
            </aside>
        );
    }
}

class SidebarMerchantInfo extends Component {
    handleFollowToggle = (event) => {
        event.preventDefault();
        if (!appState.loggedIn) {
            return window.require_login();
        }
        var {
            thing: { sales },
            dispatch,
        } = this.props;
        dispatch(toggleFollow({ seller_id: sales.seller.id }));
    };

    isFollowingStore(sales, followContext) {
        var precondition = sales.seller.id !== appState.viewer.id && sales.seller.profile_is_private !== 1;
        var following = followContext.followStore.following === true;

        return precondition && following;
    }

    render() {
        const {
            appContext: { viewer },
            thing,
            thing: {
                sales,
                sales: { popular_seller_saleitems },
            },
            followContext,
        } = this.props;
        const following = this.isFollowingStore(sales, followContext);

        const sellerImageAttrs = {};
        // FIXME: check serialization
        if (sales.saleitem_seller && sales.saleitem_seller.logo_type) {
            if (sales.saleitem_seller.logo_type.indexOf("resize-ec.thefancy.com/letters") == -1) {
                sellerImageAttrs.url = cdnUtils.resizedSchemelessImage(sales.saleitem_seller.logo_type, 360, "crop");
            } else {
                sellerImageAttrs.url = sales.saleitem_seller.logo_type.replace(/letters\/[0-9]+\//, "letters/360/");
            }
            sellerImageAttrs.schemeless = true;
            sellerImageAttrs.alt = `${sales.seller.brand_name} logo image`;
        }

        const pops = _.uniq(popular_seller_saleitems, false, (e) => e.thing_id).filter((_, idx) => idx < 4);
        // fill blanks
        while (pops.length < 4) {
            pops.push(null);
        }

        return (
            <div className={classnames("wrapper from thing-more merchant-info", { loading: thing.loading })}>
                {__Config.nostore ? (
                    <div style={{ display: "flex" }}>
                        <h3 className="tit">{gettext("You may also like")}</h3>
                        <h3
                            className="tit"
                            style={{
                                position: "absolute",
                                right: 0,
                                fontSize: "14px",
                                textDecoration: "underline",
                            }}>
                            <a
                                href={`/shop/${sales.seller.username}`}
                                style={{
                                    color: "#373d48",
                                }}>
                                {gettext("See more")}
                            </a>
                        </h3>
                    </div>
                ) : (
                    <a href={`/shop/${sales.seller.username}`} className="tit">
                        <BGImage {...sellerImageAttrs} />
                        <small>{gettext("More from")}</small>
                        <b>
                            {sales.discount_percentage > 0 && sales.seller.id === 616001
                                ? "Fancy Sales"
                                : sales.seller.brand_name}
                        </b>
                    </a>
                )}
                {!isEmpty(popular_seller_saleitems) && (
                    <ul className="after">
                        {pops.map((si, idx) => (
                            <li key={`popular_seller_saleitems-${idx}`}>
                                <a
                                    data-idx={idx}
                                    className="figure-img"
                                    rel={si ? `thing-${si.thing_id}` : `thing`}
                                    href={si ? si.html_url : "#"}
                                    onClick={
                                        si
                                            ? null
                                            : (e) => {
                                                  e.preventDefault();
                                              }
                                    }>
                                    <span
                                        className="price"
                                        style={
                                            si
                                                ? {
                                                      backgroundImage: `url(${cdnUtils.resizedSchemelessImage(
                                                          si.image,
                                                          160,
                                                          "crop"
                                                      )})`,
                                                  }
                                                : null
                                        }
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {!__Config.nostore && (
                    <button
                        className={classnames("btns-gray-embo", following ? "following" : "follow")}
                        onClick={this.handleFollowToggle}
                        style={Display.NoneIf(viewer.id === sales.seller.id)}>
                        {following ? gettext("Following") : gettext("Follow")}
                        <small>{getConciseNumberString(sales.seller.seller_followed_count || 0)}</small>
                    </button>
                )}
                <AskQuestionPopover {...this.props} />
            </div>
        );
    }
}

class AskQuestionPopover extends Component {
    state = {
        sending: false,
        showQuestion: false,
        showQuestionSuccess: false,
        questionFile: null,
        questionFileValue: "",
        question: "",
        threadUrl: "",
    };

    componentDidUpdate(prevProps) {
        const nextProps = this.props;
        if (nextProps.thing.id !== prevProps.thing.id) {
            this.handleQuestionClose();
        }
    }

    handleQuestionClose = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            sending: false,
            showQuestion: false,
            showQuestionSuccess: false,
            questionFile: null,
            questionFileValue: "",
            question: "",
            threadUrl: "",
        });
    };

    handleQuestionFileChange = (e) => {
        let questionFile, questionFileValue;
        if (e.target.files) {
            questionFile = e.target.files[0];
            questionFileValue = e.target.value;
        } else {
            questionFile = null;
        }
        this.setState({ questionFile, questionFileValue });
    };

    handleQuestionFileDelete = (e) => {
        e.preventDefault();
        this.setState({ questionFile: null });
    };

    handleQuestionChange = (event) => {
        this.setState({ question: event.target.value });
    };

    handleQuestionFileSend = () => {
        const { sending, question, questionFile } = this.state;
        const {
            thing,
            thing: { sales },
        } = this.props;

        if (sending) {
            return;
        }
        if (appState.loggedIn !== true) {
            window.require_login();
            return;
        }
        if ($.trim(question).length > 2048) {
            window.alertify.alert("Sorry, message is too long. Please write less than 2048 characters.");
            return;
        }
        this.setState({ sending: true }, () => {
            const formData = new window.FormData();
            formData.append("seller_id", sales.seller.id);
            formData.append("things", thing.id);
            formData.append("message", question);
            formData.append("attachments", questionFile);

            $.ajax({
                url: "/messages/send-message.json",
                processData: false,
                contentType: false,
                type: "POST",
                data: formData,
            })
                .done((res) => {
                    if (!res.status_code) {
                        window.alertify.alert(
                            res.message || "Sorry, we couldn't send your message right now. Please try again later."
                        );
                    } else {
                        this.setState({ showQuestionSuccess: true, threadUrl: res.thread.url });
                    }
                })
                .fail(() => {
                    window.alertify.alert("Failed to send question. Please try again");
                })
                .always(() => {
                    this.setState({ sending: false });
                });
        });
    };

    handleAsking = () => {
        this.setState({ showQuestion: true }, () => {
            $("#overlay-thing").on("click.showQuestion", (event) => {
                if (!didClickOn($(event.target), ".ask_seller") && !didClickOn($(event.target), ".ask")) {
                    $("#overlay-thing").off("click.showQuestion");
                    this.setState({ showQuestion: false });
                    return false;
                }
            });
            // due to preact behavior, need timeout. otherwise close popup right after opening
        });
        return false;
    };

    render() {
        const {
            thing: { sales },
        } = this.props;
        const { showQuestion, showQuestionSuccess, questionFile, sending, threadUrl } = this.state;

        const sellerImageAttrs = {};
        // FIXME: check serialization
        if (sales.saleitem_seller && sales.saleitem_seller.logo_type) {
            sellerImageAttrs.url = cdnUtils.resizedSchemelessImage(sales.saleitem_seller.logo_type, 80, "crop");
            sellerImageAttrs.schemeless = true;
            sellerImageAttrs.alt = `${sales.seller.brand_name} logo image`;
        }
        return (
            <React.Fragment>
                <a className="ask" onClick={this.handleAsking}>
                    {gettext("Ask a Question")}
                </a>
                <div className="ask_seller" style={Display.NoneIf(!showQuestion)}>
                    <p className="title">
                        <BGImage {...sellerImageAttrs} /> {sales.seller.brand_name}
                    </p>
                    <fieldset>
                        <p>
                            <textarea
                                className="text"
                                placeholder={`Ask a question about ${sales.title}`}
                                onChange={this.handleQuestionChange}
                            />
                        </p>
                        <div className="file">
                            <span className="uploader" style={Display.NoneIf(questionFile)}>
                                Add Attachment
                                <input
                                    type="file"
                                    onClick={this.handleQuestionAddFile}
                                    onChange={this.handleQuestionFileChange}
                                    value={this.state.questionFileValue}
                                    accept="image/*"
                                />
                            </span>
                            <span className="uploaded" style={Display.BlockIf(questionFile)}>
                                {questionFile ? questionFile.name : ""}
                                <a href="#" className="delete" onClick={this.handleQuestionFileDelete} />
                            </span>
                        </div>
                        <button
                            className="btns-blue-embo _send"
                            onClick={this.handleQuestionFileSend}
                            disabled={sending}>
                            Send
                        </button>
                    </fieldset>
                    <a href="#" className="close" onClick={this.handleQuestionClose} />
                    <div className="success" style={Display.BlockIf(showQuestion && showQuestionSuccess)}>
                        <p>
                            Message sent <a href={threadUrl}>View message</a>
                        </p>
                        <a href="#" className="close" onClick={this.handleQuestionClose}>
                            Close
                        </a>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
