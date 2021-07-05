import { getFancyDepsRoot } from 'fancyutils';

import store from './store/store';
import { cache } from './cache';
import { transition } from './container/routeutils';
// import { reloadCurrentArticle } from './container/history';


getFancyDepsRoot().Shared = {
    getStore: () => store.getState(),
    cache,
    transition,
    // reloadCurrentArticle,
};
