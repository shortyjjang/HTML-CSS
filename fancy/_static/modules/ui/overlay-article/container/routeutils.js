import { extractMetaFromArticleURL, getObjectTypeFromUrl, isStaticPage, stripPathname } from 'fancyutils';
import { history } from 'common-components';

import { historyData } from './history';


export const LinkTypes = {
    Dynamic: 0,
    Static: 1,
    Timeline: 2,
    Internal: 3, // no update needed
};

// `staticLink`: transition from statically attached links
export function transition(href) {
    // ID-only
    if (!_.isNaN(Number(href))) {
        href = `/articles/${href}`;
    }

    if (getObjectTypeFromUrl(href) === 'Article') {
        const meta = extractMetaFromArticleURL(href);
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
    $(document.body).removeClass('article-overlay-on');
}

export function redirect(destination) {
    if (destination == null) {
        return false;
    } else {
        location.href = destination;
        return true;
    }
}
