export const ShareObjectTypes = {
    thing: 'thing',
    list: 'list',
    store: 'store',
    user: 'user',
    article: 'article',
}

function createReferredUrl(viewerUsername, objectId, objectType, objectMeta) {
    let url;
    if (objectType === ShareObjectTypes.thing) {
        url = `https://${location.hostname}/things/${objectId}`;
    } else if (objectType === ShareObjectTypes.article && objectMeta) {
        url = `https://${location.hostname}/articles/${objectMeta.slug}`;
    } else {
        url = location.href.replace(/(#.*)/, ''); // Remove hash
    }

    if (viewerUsername) {
        let connector = ~url.indexOf('?') ? '&' : '?';
        url = `${url}${connector}ref=${viewerUsername}`
    }

    return url;
}

export function getShareURL(component, callback) {
    if (component.loading || component.state.referrerURL || component.props.referrerURL) {
        callback && callback(true);
        return;
    }
    component.loading = true;

    // If async loading is needed, assign setState callback.
    let cb = null;
    if (callback) {
        cb = () => {
            callback(false);
            component.loading = false;
        };
    }
    const { viewerUsername, objectId, objectType, objectMeta } = component.props;
    const originalUrl = createReferredUrl(viewerUsername, objectId, objectType, objectMeta);
    $.post('/get_short_url.json', { url: originalUrl })
        .done(res => {
            component.setState({ referrerURL: res.short_url }, cb);
        })
        .fail(() => {
            component.setState({ referrerURL: originalUrl }, cb);
            console.warn('/get_short_url failed');
        });
}
