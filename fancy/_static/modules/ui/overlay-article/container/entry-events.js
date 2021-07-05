import { KEYS, didClickOn, getObjectTypeFromUrl, getPathname, isPlainLeftClick, isHomepage } from "fancyutils";

import store from "../store/store";
import { Selectors } from "../config";
import { LinkTypes, transition } from "./routeutils";
import { closeOverlay } from "../action/action-helpers";
import { historyData } from './history';


function handleOverlayArticleKeyEvents(event) {
    if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") {
        return;
    }

    switch (event.which) {
        case KEYS.ESC:
            // If popup is not on
            if ($("#popup_container:visible").length === 0) {
                store.dispatch(closeOverlay());
            }
            break;
    }
}

function conditionalTransition(aElement) {
    // Turn off video
    $("#container-wrapper .btn-pause")
        .attr("scroll", true)
        .click();
    // Ensure anchor is static (sticked to homepage timeline) or not.
    if (isHomepage() && $(Selectors.HomepageWrapper).has(aElement)) {
        transition(aElement.getAttribute("href"), LinkTypes.Static);
    } else {
        transition(aElement.getAttribute("href"));
    }
}

var oneshotEventAttached = false;
export function attachEntryEvents() {
    if (oneshotEventAttached) {
        return;
    }
    oneshotEventAttached = true;
    // Remove pre-existing url event and start transition first
    $(document.body).off("click.overlayArticleInit");
    if (window.__INIT_ARTICLE_ANCHOR != null) {
        conditionalTransition(window.__INIT_ARTICLE_ANCHOR);
        delete window.__INIT_ARTICLE_ANCHOR;
    }
    // TODO: replace to class-based event binding
    $(document.body).on("click", "a", function(event) {
        if (
            isPlainLeftClick(event) &&
            this.getAttribute("data-prevent-overlay") == null &&
            getObjectTypeFromUrl(getPathname(this)) === "Article"
        ) {
            event.preventDefault();
            // note: key event will be detached inside `closeOverlay()` call
            $(document).on("keydown.overlayArticle", handleOverlayArticleKeyEvents);
            conditionalTransition(this);
        }
    });

    $("#overlay-article").on("click", function(event) {
        const $targ = $(event.target);
        if (didClickOn($targ, "#article-container") || historyData.initialPageIsArticlePage) {
            //pass
        } else {
            store.dispatch(closeOverlay());
        }
    });
}

export const OaContainer = {
    isStatic() {
        return $(document.body).is(".static-article");
    },
    getDynamic() {
        return $("#article-container");
    },
    getStatic() {
        return $(document);
    },
    get() {
        return this.isStatic() ? this.getStatic() : this.getDynamic();
    },
    scrollToTop() {
        if (this.isStatic()) {
            $(document.body.parentElement).scrollTop(0);
        } else {
            this.getDynamic().scrollTop(0);
        }
    }
};
