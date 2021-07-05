import { combineReducers } from 'redux';
import { extractMetaFromURL, update, updateShallow, isEmpty } from 'fancyutils';

import C from './action/action-constants';
import { getInitialStoreState } from './store/initial-store';
import { updateState } from './appstate';


const isLoggedIn = viewer => !isEmpty(viewer) && viewer.id != null;

var loaded = false;
var lastFullyRenderedArticleID = 0;
function appContext(state = getInitialStoreState('appContext'), action) {
    switch (action.type) {
    case C.OPEN_ARTICLE:
        return updateShallow(state, {
            visible: true,
        });
    case C.CLOSE_ARTICLE:
        lastFullyRenderedArticleID = 0;
        loaded = false;
        return updateShallow(state, {
            visible: false,
            lastFullyRenderedArticleID
        });
    case C.UPDATE_APP_CONTEXT:
        return updateShallow(state, action.context);
    case C.LOAD_ARTICLE: {
        // Due to multi-stage rendering (cache -> from-server-data -> ...) 
        // it is unable to check state change correctly just by comparing ID;
        // Therefore, we set internal state per every update cycle and check 
        // if state is fully updated.

        // FIXME: when cached response exist, it marks as rendered before
        if (
            loaded === true &&
            lastFullyRenderedArticleID !== action.data.id
        ) {
            lastFullyRenderedArticleID = action.data.id;
        }
        const viewer = action.data.viewer || window.viewer || {};
        const loggedIn = isLoggedIn(viewer);
        const userCountry = action.data.current_country_code || state.userCountry;

        updateState('loggedIn', loggedIn);
        updateState('viewer', viewer);
        loaded = true;

        return update(state, { lastFullyRenderedArticleID, loggedIn, viewer, userCountry });
    }
    default:
        return state;
    }
}

function populateArticleContext(articleData) {
    articleData.loading = articleData.fromServer !== true;
    articleData.URLMeta = extractMetaFromURL(location.href); // FIXME: provide current pathname
    articleData.owner = articleData.user;
}

// Article context
function article(state = getInitialStoreState('article'), action) {
    switch (action.type) {
    case C.LOAD_ARTICLE:
        populateArticleContext(action.data)
        return updateShallow(state, {
            data: action.data,
            status: action.status,
            ID: action.ID,
            pendingID: null,
            isFetching: false
        });
    case C.REQUEST_ARTICLE:
        return update(state, {
            pendingID: action.pendingID,
            status: action.status,
            isFetching: true
        });
    case C.REQUEST_ARTICLE_FAILURE:
        return update(state, {
            status: action.status,
            isFetching: false
        });

    // Reset state
    case C.CLOSE_ARTICLE:
        return updateShallow(getInitialStoreState('article'));
    default:
        return state;
    }
}

const rootReducer = combineReducers({
    appContext,
    article,
});

export default rootReducer;
