import { getFancyDepsRoot } from 'fancyutils';

import store from './store/store';
import { cache } from './cache';
import { pagingContext, transition } from './container/routeutils';
import { reloadCurrentThing } from './container/history';


getFancyDepsRoot().Shared = {
    getStore: () => store.getState(),
    cache,
    pagingContext,
    transition,
    reloadCurrentThing,
};
