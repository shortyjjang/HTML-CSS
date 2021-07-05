var articleAdmin;
export function setArticleAdmin(instance) {
    articleAdmin = instance;
}
export function reactBridge(callback) {
    if (articleAdmin) {
        if (callback) {
            callback && callback(articleAdmin);
        } else {
            return articleAdmin;
        }
    } else {
        console.warn('articleAdmin is not ready');
    }
}

window.reactBridge = reactBridge; // FIXME
