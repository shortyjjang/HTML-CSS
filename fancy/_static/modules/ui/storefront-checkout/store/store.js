import { configureStore } from './configure-store';
import { getAllInitialStoreState } from './initial-store';

const store = configureStore(getAllInitialStoreState());

export default store;
