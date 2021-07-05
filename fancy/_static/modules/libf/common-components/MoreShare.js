import React, { Component } from "react";
import classnames from "classnames";
import { renderPopup, copyToClipboard, isElementOutsideViewport, MP, ClickOutside, FancyUser } from "fancyutils";
import { getElementGapFromHeader } from "fancymixin";

import { SharePopover } from "./SharePopover";
import { AddlistPopover } from "./AddlistPopover";
import { ShareObjectTypes, getShareURL } from "./MoreShareUtils";
import { FancydByPopup } from "./Popup";

// returns dictionary with only one value true and else is false
function makeToggle(keys) {
    const obj = {};
    return function toggle(...toggleKeys) {
        keys.forEach(key => {
            obj[key] = false;
        });
        if (toggleKeys) {
            toggleKeys.forEach(key => {
                obj[key] = true;
            });
        }
        return obj;
    };
}
const toggleShow = makeToggle(["showShare", "showList", "showSellerList", "showMenu"]);



export class MoreShare extends Component {
    state = {
        showShare: false,
        showList: false,
        showMenu: false,
        headerGap: null,

        referrerURL: null,
        linkCopied: false,
    };

    setStateSafe(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.clickOutside = new ClickOutside({ component: this, popupElementRefKey: "MoreShareEl" });
        
        if (this.props.facadeShowShare) {
            this.handleShareDisplay();
        }
        if (this.props.facadeShowList) {
            this.handleMoreShareToggle();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.clickOutside.destroy();
    }

    componentDidUpdate(pp, ps) {
        const ns = this.state;
        const { showList, showShare, showMenu } = ns;
        if (showList || showShare || showMenu) {
            this.clickOutside.handleAttach(this.closePopup);
            this.checkViewport();

            if (showShare || showMenu) {
                getShareURL(this);
            }
        }

        if (ns.showMenu !== ps.showMenu && ns.showMenu === false) {
            this.setState({ linkCopied: false });
            clearTimeout(this.linkCopiedRemovalTimer);
            this.linkCopiedRemovalTimer = null;
        }
    }

    handleShareDisplay = () => {
        this.setStateSafe(
            {
                showShare: !this.state.showShare,
                showList: false,
                showMenu: false,
                headerGap: getElementGapFromHeader(this.moreMenuButton)
            },
            this.handleHook
        );
        if (this.props.objectType === ShareObjectTypes.thing) {
            MP("Share", { "thing id": this.props.objectId });
        }
    };

    handleListDisplay = () => {
        if (!FancyUser.loggedIn) {
            this.closePopup();
            window.require_login();
            return;
        }
        const showList = !this.state.showList;
        this.setStateSafe(toggleShow(showList ? "showList" : null), this.handleHook);
    };

    handleMerchantListDisplay = () => {
        if (!FancyUser.loggedIn) {
            this.closePopup();
            window.require_login();
            return;
        }
        const showSellerList = !this.state.showSellerList;
        this.setStateSafe(toggleShow(showSellerList ? "showSellerList" : null), this.handleHook);
    };

    closePopup = () => {
        this.removeViewportCheck();
        this.setStateSafe(toggleShow(), this.handleHook);
    };

    viewPortChecking = false;
    evtName = "scrollstop.MoreShare";
    checkViewport = () => {
        if (this.viewPortChecking) {
            return;
        }
        this.viewPortChecking = true;
        $(window).on(this.evtName, () => {
            const $root = $(this.MoreShareEl);
            const headerEl = $("#header .header-featured").get(0);

            const { showMenu, showShare, showList, showSellerList } = this.state;
            let sel;
            if (showMenu) {
                sel = "#more-menu";
            } else if (showShare) {
                sel = "#show-share";
            } else if (showList || showSellerList) {
                sel = "#show-addlist";
            }
            const el = $root.find(sel).get(0);
            if (el) {
                const outsideViewport = isElementOutsideViewport(el, { element: headerEl, type: "top" });

                if (outsideViewport) {
                    this.closePopup();
                }
            }
        });
    };

    removeViewportCheck = () => {
        this.viewPortChecking = false;
        $(window).off(this.evtName);
    };

    handleMoreShareToggle = () => {
        const { objectType } = this.props;
        const { showMenu, showShare, showList, showSellerList } = this.state;
        // thing types will show menu
        if (objectType === ShareObjectTypes.thing || objectType === ShareObjectTypes.article) {
            if (showMenu || showShare || showList || showSellerList) {
                this.closePopup();
            } else {
                this.setStateSafe(
                    {
                        showMenu: true,
                        headerGap: getElementGapFromHeader(this.moreMenuButton)
                    },
                    this.handleHook
                );
            }
            // non-thing types will show share popover directly, because add-to-list is not available
        } else {
            this.handleShareDisplay();
        }
        return false;
    };

    handleHook = () => {
        if (this.props.onShowSomething) {
            const { showList, showShare, showMenu, showSellerList } = this.state;
            this.props.onShowSomething(showList || showShare || showMenu || showSellerList, this);
        }
    };

    handleHideList = () => {
        this.setStateSafe({ showList: false });
    };

    handleHideShare = () => {
        this.setStateSafe({ showShare: false });
    };

    linkCopiedRemovalTimer = null;
    handleCopyLink = () => {
        if (this.linkCopiedRemovalTimer != null) {
            return;
        }
        copyToClipboard(this.state.referrerURL, {
            cb: () => {
                this.setState({ linkCopied: true });
                this.linkCopiedRemovalTimer = setTimeout(() => {
                    this.setState({ linkCopied: false });
                }, 5000);
            }
        });
    };

    handleFancydByDisplay = () => {
        event.preventDefault();
        event.stopPropagation();
        const { viewerUsername, objectId, objectType } = this.props;

        renderPopup(FancydByPopup, { objectId, objectType, loggedIn: FancyUser.loggedIn, viewerId: viewerUsername });
    };

    shouldShowMerchantCollection() {
        return FancyUser.merchant && FancyUser.active_merchant;
    }

    render() {
        const {
            title,
            viewerUsername,
            componentClass = "menu-container",
            btnClass = "btn-more",
            objectType,
            objectMeta,
            objectId,
            showShortcuts = true,
            fromThingSidebar = false
        } = this.props;

        if (objectType == null) {
            console.warn("objectType is not defined");
        }

        const {
            showShare,
            showList,
            showMenu,
            headerGap,
            referrerURL,
            linkCopied,
            showSellerList
        } = this.state;
        const isThing = objectType === ShareObjectTypes.thing;
        const isArticle = objectType === ShareObjectTypes.article;

        let showMerchantList = this.shouldShowMerchantCollection();
        let merchantId = showMerchantList && showSellerList ? FancyUser.id : null;
        const newLayout = fromThingSidebar;

        return (
            <em
                className={classnames(componentClass, "on-home ignore-ext", {
                    open: showShare || showList || showMenu
                })}
                ref={el => {
                    this.MoreShareEl = el;
                }}
                data-rendered="true">
                {newLayout && <button className="btn-share" onClick={this.handleShareDisplay} />}
                <small
                    className={btnClass}
                    onClick={this.handleMoreShareToggle}
                    ref={element => {
                        this.moreMenuButton = element;
                    }}>
                    {<em>{SharePopover.getShareMessage(objectType, "Share & Lists")}</em>}
                </small>
                {(isThing || isArticle) && (
                    <small
                        id="more-menu"
                        className={classnames("has-arrow menu-content react new", {
                            opened: showMenu,
                            bot: headerGap && headerGap < 16 + 109 /*= tip + bubble*/
                        })}>
                        {!newLayout && (
                            <button className="share before-bg-share2" onClick={this.handleShareDisplay}>
                                <b>{gettext("Share item")}</b>
                                <small>{gettext("Share this with friends")}</small>
                            </button>
                        )}
                        {newLayout && (
                            <button className="fancyd-by before-bg-share2" onClick={this.handleFancydByDisplay}>
                                <b>{gettext("Fancy'd By")}</b>
                                <small>{gettext("People who fancy'd this")}</small>
                            </button>
                        )}
                        {isThing && (
                            <button className="add-list before-bg-share2" onClick={this.handleListDisplay}>
                                <b>{gettext("Lists")}</b>
                                <small>{gettext("Add this to your saved lists")}</small>
                            </button>
                        )}
                        {showMerchantList && (
                            <button className="add-list before-bg-share2" onClick={this.handleMerchantListDisplay}>
                                <b>{gettext("Add to Collection")}</b>
                                <small>{gettext("Save this to your collections")}</small>
                            </button>
                        )}
                        {showShortcuts && (
                            <span>
                                <button
                                    style={referrerURL ? null : { opacity: 0.7 }}
                                    className={classnames("copy-link")}
                                    onClick={this.handleCopyLink}>
                                    <b>{linkCopied ? "Copied to clipboard" : "Item link"}</b>
                                    <small>Copy link to clipboard</small>
                                </button>
                            </span>
                        )}
                    </small>
                )}
                {isThing && (
                    <AddlistPopover
                        key={`${objectId}-${merchantId}` || `${objectId}-addlist`}
                        objectType={objectType}
                        objectId={objectId}
                        showList={showList || showSellerList}
                        merchantId={merchantId}
                        viewerUsername={viewerUsername}
                        handleHide={this.handleHideList}
                        headerGap={headerGap}
                    />
                )}
                <SharePopover
                    objectType={objectType}
                    objectId={objectId}
                    objectMeta={objectMeta}
                    showShare={showShare}
                    title={title}
                    referrerURL={this.state.referrerURL}
                    viewerUsername={viewerUsername}
                    headerGap={headerGap}
                    handleHide={this.handleHideShare}
                />
            </em>
        );
    }
}
