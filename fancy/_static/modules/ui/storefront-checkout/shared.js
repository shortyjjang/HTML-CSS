import { getFancyDepsRoot } from 'fancyutils';

import store from './store/store';

getFancyDepsRoot().Shared = {
    getStore: () => store.getState(),
};
