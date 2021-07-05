import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import logger from 'redux-logger'

import { getAllInitialStoreState } from "./initial-store";
import rootReducer from "../reducers";
// import type { RootState } from '../reducers';

const middlewares = [thunk];
if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger);
}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: getAllInitialStoreState(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).prepend(middlewares),
});

export type AppDispatch = typeof store.dispatch;
export default store;
