import { index } from 'fancyutils';

// Cache bucket
export class ArticleCache {
    articles = {};
    count = 0;
    static ARTICLES = 'articles';

    exists = (id, type, ignoreCralwed) => {
        const cac = this.get(id, type);
        var existence = cac != null && typeof cac === 'object';
        if (ignoreCralwed) {
            existence = existence && cac.isCrawled !== true;
        }
        return existence;
    }

    // resolver function
    _get = (id) => {
        return this[ArticleCache.ARTICLES][id] || null;
    }

    get = (id, type = ArticleCache.ARTICLES) => {
        const cac = this[type][id] || this.getCrawled(id, type);
        return cac;
    }

    getCrawled = (id, type) => {
        const cac = this[type][id];
        if (cac && cac.isCrawled) {
            return cac;
        } else {
            return null;
        }
    }

    add = (id, data, type) => {
        // to add, cache should not be exist or crawled one
        const cac = this[type][id];
        if (
            cac == null || 
            cac.isCrawled === true
        ) {
            this[type][id] = data;
            this.count += 1;
        } else {
            console.warn('cache.add(): Cache overwrite');
        }
    }

    remove = (id, type) => {
        if (this[type][id]) {
            delete this[type][id];
            this.count -= 1;
        } else {
            console.warn('cache.remove(): Non-existing cache removal');
        }
    }

    // selector = 'a.b.c'
    update = (id, type = ArticleCache.ARTICLES, selector, value) => {
        if (selector == null) {
            console.warn('ArticleCache#update(): selector is empty');
            return;
        }
        const t = this.get(id, type);
        if (t) {
            index(t, selector, value);
        }
    }

    sweep() {
        // TODO: should sweep cache if too many cache added by looking `cache.count`
    }
}

export const cache = new ArticleCache();
