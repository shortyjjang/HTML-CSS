import { extractMetaFromArticleURL, extractMetaFromURL } from 'fancyutils';
import { history } from 'common-components';
import store from '../store/store';
import { closeOverlay, fetchArticle } from '../action/action-helpers';
import {
    closeArticle,
} from '../action/actions';


const initialArticlePageID = extractMetaFromArticleURL(location.pathname).id;
const initialPageIsArticlePage = initialArticlePageID != null;

// This stores initial static page history info that needs to be restored when modal get closed.
export const historyData = {
    initialPath: location.pathname,
    /* mut */preservedHref: location.href, // Preserved Href just before open, and to be returned when closed.
    initialArticlePageID,
    initialPageIsArticlePage,
    initialTitle: document.title,
    // This prop indicates current location is (static) article page. Mutable.
    locationIsArticlePage: initialPageIsArticlePage,
    overlayIsOn: false,
};

export function runOverlay(articleID, articleURLType, killCache = false, queryString) {
    if (!$(document.body).hasClass('error-page')) {
        // Context needs to be isolated from hook: https://github.com/rackt/redux-router/issues/157
        requestIdleCallback(() => {
            $(document.body).addClass('article-overlay-on');
            store.dispatch(fetchArticle(articleID, articleURLType, killCache, queryString));
            historyData.overlayIsOn = true;
        });
    }
}

export function stopOverlay() {
    historyData.overlayIsOn = false;
    store.dispatch(closeOverlay());
}

export function historyHook({ pathname, search /*, action*/ }) {
    const meta = extractMetaFromArticleURL(pathname);
    const articleID = meta && meta.id;
    // When initially (statically) renderred page is article page
    // Moving to new article page
    historyData.locationIsArticlePage = articleID != null;
    if (historyData.locationIsArticlePage) {
        runOverlay(articleID, meta.type, false, search);
    } else if (historyData.overlayIsOn) {
        stopOverlay();
    }
}

history.listen(historyHook)
