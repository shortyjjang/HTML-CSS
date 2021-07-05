import { extractMetaFromURL } from 'fancyutils';
import { history } from 'common-components';

import store from '../store/store';
import { closeOverlay, fetchThing } from '../action/action-helpers';


const initialThingPageID = extractMetaFromURL(location.pathname).id;
const initialPageIsThingPage = initialThingPageID != null;

// This stores initial static page history info that needs to be restored when modal get closed.
export const historyData = {
    initialPath: location.pathname,
    /* mut */preservedHref: location.href, // Preserved Href just before open, and to be returned when closed.
    initialThingPageID,
    initialPageIsThingPage,
    initialTitle: document.title,
    // This prop indicates current location is (static) thing page. Mutable.
    locationIsThingPage: initialPageIsThingPage,
    overlayIsOn: false,
};

export function runOverlay(thingID, thingURLType, killCache = false, queryString) {
    // Context needs to be isolated from hook: https://github.com/rackt/redux-router/issues/157
    if (!$(document.body).hasClass('error-page')) {
        requestIdleCallback(() => {
            $(document.body).addClass('thing-overlay-on');
            store.dispatch(fetchThing(thingID, thingURLType, killCache, false, queryString));
            historyData.overlayIsOn = true;
        });
    }
}

function stopOverlay() {
    historyData.overlayIsOn = false;
    store.dispatch(closeOverlay());
}

export function reloadCurrentThing() {
    const meta = extractMetaFromURL(location.href);
    const thingID = meta && meta.id;
    if (thingID != null && historyData.overlayIsOn) {
        runOverlay(thingID, meta.type, true);
    }
}

export function historyHook({ pathname, search /*, action*/ }) {
    const meta = extractMetaFromURL(pathname);
    const thingID = meta && meta.id;
    // When initially (statically) renderred page is thing page
    // Moving to new thing page
    historyData.locationIsThingPage = thingID != null;
    if (historyData.locationIsThingPage) {
        runOverlay(thingID, meta.type, false, search);
    } else if (historyData.overlayIsOn) {
        stopOverlay();
    }
}

history.listen(historyHook)
