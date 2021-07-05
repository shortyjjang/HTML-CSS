import { extractMetaFromURL, getObjectTypeFromUrl, isStaticPage, stripPathname } from "fancyutils";

import { historyData } from "./history";
import { history } from 'common-components';
export const LinkTypes = {
    Dynamic: 0,
    Static: 1,
    Timeline: 2,
    Internal: 3 // no update needed
};

// `staticLink`: transition from statically attached links
export function transition(href, linkType = LinkTypes.Dynamic) {
    // ID-only
    if (!_.isNaN(Number(href))) {
        href = `/things/${href}`;
    }

    if (getObjectTypeFromUrl(href) === "Thing") {
        const meta = extractMetaFromURL(href);
        // Update URL to go back when overlay is closed
        if (!historyData.overlayIsOn) {
            historyData.preservedHref = location.href;
        }
        history.push(stripPathname(meta.href), null);
    } else {
        redirect(href);
    }
}

export function closeModal() {
    if (isStaticPage()) {
        return;
    }
    $(document.body).removeClass("thing-overlay-on"); // FIXME: isolate modal logic
}

// NOOP
export const pagingContext = {
    init() {},
    movePrev() {},
    moveNext() {}
}

export function redirect(destination) {
    if (destination == null) {
        return false;
    } else {
        location.href = destination;
        return true;
    }
}

function getUtm() {
    const $nav = $('.navigation')
    if ($nav.length > 0) {
        if ($nav.find('a.current[data-feed="featured"]').length > 0) {
            return "timeline_featured";
        } else if ($nav.find('a.current[data-feed="recommended"]').length > 0) {
            return "timeline_recommended";
        } else {
            const $shopLink = $nav.find('.shop li a');
            if ($shopLink.eq(0).is('.current')) {
                return "shop";
            } else if ($shopLink.eq(1).is('.current')) {
                return "";
            } else if ($shopLink.eq(2).is('.current')) {
                return "popular";
            } else if ($shopLink.eq(3).is('.current')) {
                return "newest";
            } else if ($shopLink.eq(4).is('.current')) {
                return "editors_picks";
            } else if ($shopLink.eq(5).is('.current')) {
                return "sales";
            }
        }
    } else {
        if ($('.wrapper-content.profile-section').length > 0) {
            return "userprofile";
        } else if ($('.wrapper-content.merchant').length > 0) {
            return "seller_shop";
        }
    }
}

export function getUtmString() {
    const utm = getUtm()
    if (utm) {
        return `?utm=${utm}`
    } else {
        return ''
    }
}
