import { KEYS, didClickOn, eitherFancy, getObjectTypeFromUrl, getPathname, isPlainLeftClick, isStream } from 'fancyutils';

import store from '../store/store';
import { Selectors } from '../config';
import { LinkTypes, transition, pagingContext } from './routeutils';
import { closeOverlay } from '../action/action-helpers';


function handleOverlayThingKeyEvents(event) {
    if (event.target.tagName === 'TEXTAREA' ||
        event.target.tagName === 'INPUT') {
        return;
    }

    switch (event.which) {
    case KEYS.LEFT:
        pagingContext.movePrev();
        break;
    case KEYS.RIGHT:
        pagingContext.moveNext();
        break;
    case KEYS.ESC:
        // If popup is not on
        if ($('#popup_container:visible').length === 0) {
            store.dispatch(closeOverlay());
        }
        break;
    }
}

function conditionalTransition(aElement) {
    // Turn off video
    $('#container-wrapper .btn-pause').attr('scroll',true).click();
    // Ensure anchor is static (sticked to homepage timeline) or not.
    if (isStream() && $(Selectors.HomepageWrapper).has(aElement)) {
        transition(aElement.getAttribute('href'), LinkTypes.Static);
    } else {
        transition(aElement.getAttribute('href'));
    }
}

var oneshotEventAttached = false;
export function attachEntryEvents() {
    if (oneshotEventAttached) {
        return;
    }
    oneshotEventAttached = true;
    // Remove pre-existing url event and start transition first
    $(document.body).off('click.overlayThingInit');
    if (window.__INIT_THING_ANCHOR != null) {
        conditionalTransition(window.__INIT_THING_ANCHOR);
        delete window.__INIT_THING_ANCHOR;
    }
    // TODO: replace to class-based event binding
    $(document.body)
        .on('click', 'a', function(event) {
            if (isPlainLeftClick(event) &&
                this.getAttribute('data-prevent-overlay') == null &&
                getObjectTypeFromUrl(getPathname(this)) === 'Thing'
            ) {
                event.preventDefault();
                // note: key event will be detached inside `closeOverlay()` call
                $(document).on('keydown.overlayThing', handleOverlayThingKeyEvents);
                conditionalTransition(this);
            }
        });

    $('#overlay-thing').on('click', '.popup.overlay-thing', function(event) {
        const $targ = $(event.target);
        // Center container
        if (didClickOn($targ, '.sidebar') ||
            didClickOn($targ, '.thing-detail-container .content') ||
            didClickOn($targ, '.thing-detail-container .timeline') ||
            eitherFancy('Admin', ({ sharedState }) => sharedState.draggingAdmin)) {
            // pass
        // prev button
        } else if (didClickOn($targ, '.popup_prev')) {
            pagingContext.movePrev();
            return false;
        // next button
        } else if (didClickOn($targ, '.popup_next')) {
            pagingContext.moveNext();
            return false;
        } else {
            store.dispatch(closeOverlay());
        }
    });
}

export const OtContainer = {
    isStaticCache: undefined,
    isStatic() {
        if (this.isStaticCache === undefined) {
            this.isStaticCache = $(document.body).is('.static-ot');
        }
        return this.isStaticCache;
    },
    getDynamic() {
        return $('#overlay-thing .thing-detail');
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
            $('#overlay-thing').scrollTop(0);
        }
    },
}
window.OtContainer = OtContainer;

// Only one event is allowed
export const scrollEvent = {
    handleScroll: null,
    attach(func, prepare) {
        if (scrollEvent.handleScroll != null) {
            scrollEvent.detach();
        }
        const _prepare = prepare != null ? prepare : 10;
        
        const handleScroll = _.throttle(function() {
            if (OtContainer.isStatic()) {
                const viewportHeight = document.documentElement.clientHeight;
                if (scrollEvent.visible === true) {
                    // console.debug('$(window).height() - $(window).scrollTop() - _prepare <= viewportHeight', $(window).height(), $(window).scrollTop(), _prepare, viewportHeight, $(window).height() - $(window).scrollTop() - _prepare <= viewportHeight)
                    if (document.documentElement.scrollHeight - $(window).scrollTop() - _prepare <= viewportHeight) {
                        func(true);
                    }
                }
            } else {
                const el = this;
                const viewportHeight = el.clientHeight;
                if (scrollEvent.visible === true) {
                    if (el.scrollHeight - el.scrollTop - _prepare <= viewportHeight) {
                        func(true);
                    }
                }
            }
        }, 50);
        this.handleScroll = handleScroll;

        const containerEl = OtContainer.isStatic() ? OtContainer.get().get(0) : $('#overlay-thing').get(0);
        containerEl.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    },

    detach() {
        const containerEl = OtContainer.get().get(0);
        containerEl.removeEventListener('scroll', this.handleScroll);
    },
    visible: false // copied variable on `state.appContext.visible` change
};
