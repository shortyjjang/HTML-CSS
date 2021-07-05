    import C from './action-constants';


// Action on requesting article starts
export function requestArticle(pendingID) {
    return {
        type: C.REQUEST_ARTICLE,
        status: 'request',
        pendingID
    };
}

// Action on requesting article fails
export function requestArticleFail(/*lastRequestFailedArticleID*/) {
    return {
        type: C.REQUEST_ARTICLE_FAILURE,
        status: 'failed'
    };
}

// action on loading request result
export function loadArticle(ID, data) {
    // FIXME: should we do this here?
    const title = data.name;
    if (title) {
        document.title = `Fancy | ${title}`;
    }

    return {
        type: C.LOAD_ARTICLE,
        status: 'idle',
        ID,
        data
    };
}

// Action on close overlay
export function openArticle() {
    return {
        type: C.OPEN_ARTICLE
    };
}

// Action on close overlay
export function closeArticle() {
    return {
        type: C.CLOSE_ARTICLE,
        ID: null,
        pendingID: null,
        article: null
    };
}

export function updateAppContext(contextObject) {
    return {
        type: C.UPDATE_APP_CONTEXT,
        context: contextObject
    };
}
