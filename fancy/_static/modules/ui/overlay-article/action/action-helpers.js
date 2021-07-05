import { MP, getLocationArgPairs, isStaticPage, stripPathname } from 'fancyutils';

import { historyData } from '../container/history';
import store from '../store/store';
import { closeModal } from '../container/routeutils';
import {
    closeArticle,
    openArticle,
    loadArticle,
    requestArticle,
    requestArticleFail,
} from './actions';
import { ArticleCache, cache } from '../cache';
import { history } from 'common-components';


function shouldOpenArticle(state) {
    return state.appContext.visible !== true;
}

// Blocks illegal requests
function shouldFetchArticle(state, articleID) {
    if (state.article.ID === articleID || state.article.isFetching) {
        return false;
    } else {
        return true;
    }
}

export function closeOverlay() {
    return dispatch => {
        if (isStaticPage()) {
            return;
        }
        closeModal();
        historyData.overlayIsOn = false;
        history.push(stripPathname(historyData.preservedHref), null);
        document.title = historyData.initialTitle;

        dispatch(closeArticle());
        $(document).off('keydown.overlayArticle');
        $(window).trigger('scroll');
    }
}

export function fetchArticle(articleID, type = ArticleCache.ARTICLES, killCache = false, queryString = '') {
    return (dispatch, getState) => {
        if (articleID == null) {
            console.warn('fetchArticle(): articleID was null.');
            return;
        }
        var state = getState();
        if (shouldOpenArticle(state)) {
            dispatch(openArticle());
        }
        if (killCache) {
            cache.remove(articleID, type);
            delete state.article;
        }

        if (killCache || shouldFetchArticle(state, articleID)) {
            if (cache.exists(articleID, type)) {
                const cac = cache.get(articleID, type);
                dispatch(loadArticle(articleID, cac));
                onLoadArticle(cac);
                // if cache is crawled one, request should continue
                if (!(cac.isCrawled)) {
                    return;
                }
            }
            dispatch(requestArticle(articleID));
            const options = { saved_users_top:10, raw_content: 'true', include_viewer: 'true'};
            if (getLocationArgPairs('preview')) {
                options.preview = true;
            }
            $.get(`/rest-api/v1/articles/${articleID}${queryString}`, options)
                .then(article => {
                    cache.add(articleID, article, type);
                    dispatch(loadArticle(articleID, article));
                    onLoadArticle(article);
                })
                .fail(failureXHR => {
                    // FIXME: This error handling only happens when there's server-side error -
                    //        can't handle client-side ones
                    dispatch(requestArticleFail(articleID));
                    if (failureXHR.status === 404) {
                        alertify.alert("This page is not available. Please try again later.");
                    // } else if (failureXHR.status >= 500) {
                    } else {
                        alertify.alert("There was an error while opening the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
                    }

                    if (historyData.initialPageIsArticlePage) {
                        location.href = '/';
                    } else {
                        dispatch(closeOverlay());
                    }
                });
        }
    };
}

// TODO: make unified eventemitter interface after all
function onLoadArticle(article) {
    const MPArgs = { article_id: article.id };
    const currentLocationArgPair = getLocationArgPairs('utm');
    if (currentLocationArgPair) {
        MPArgs.utm = currentLocationArgPair[1];
    }
    MP('View Article Detail', MPArgs);
}

window.___D = () => {
    return store.getState();
};
