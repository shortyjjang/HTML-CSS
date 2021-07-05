import { combineReducers } from "@reduxjs/toolkit";
import { extractMetaFromURL, /*getConciseNumberString,*/ update, updateShallow } from "fancyutils";

import C from "./action/action-constants";
import { getInitialStoreState } from "./store/initial-store";
import { getFirstSaleOption, setWaiting } from "./components/map";
import { updateState } from "./appstate";
import { scrollEvent } from "./container/entry-events";
import { getThingType } from "./ThingTypes";
import { cache } from "./cache";

var loaded = false;
var lastFullyRenderedThingID = 0;
function appContext(state = getInitialStoreState("appContext"), action) {
    switch (action.type) {
        case C.OPEN_THING:
            scrollEvent.visible = true;
            return updateShallow(state, {
                visible: true,
            });
        case C.CLOSE_THING:
            scrollEvent.visible = false;
            lastFullyRenderedThingID = 0;
            loaded = false;
            return updateShallow(state, {
                visible: false,
                lastFullyRenderedThingID,
            });
        case C.UPDATE_APP_CONTEXT:
            return updateShallow(state, action.context);
        case C.LOAD_THING: {
            // Due to multi-stage rendering (cache -> from-server-data -> ...)
            // it is unable to check state change correctly just by comparing ID;
            // Therefore, we set internal state per every update cycle and check
            // if state is fully updated.

            // FIXME: when cached response exist, it marks as rendered before
            if (loaded === true && lastFullyRenderedThingID !== action.data.id && action.data.fromServer) {
                lastFullyRenderedThingID = action.data.id;
            }

            const loggedIn = window.__FancyUser.loggedIn;
            const viewer = action.data.viewer || {};
            const userCountry =
                $.cookie.get("shipping_country_code") || action.data.current_country_code || state.userCountry;

            updateState("loggedIn", loggedIn);
            updateState("viewer", viewer);
            loaded = true;

            return update(state, { lastFullyRenderedThingID, loggedIn, viewer, userCountry });
        }
        default:
            return state;
    }
}

function populateThingContext(thingData) {
    thingData.loading = thingData.fromServer !== true;
    thingData.META = getThingType(thingData);
    thingData.URLMeta = extractMetaFromURL(location.href); // FIXME: provide current pathname
    thingData.owner = thingData.user;
}

// Thing context
function thing(state = getInitialStoreState("thing"), action) {
    switch (action.type) {
        case C.LOAD_THING:
            populateThingContext(action.data);
            return updateShallow(state, {
                data: action.data,
                status: action.status,
                ID: action.ID,
                pendingID: null,
                isFetching: false,
            });
        case C.REQUEST_THING:
            return update(state, {
                pendingID: action.pendingID,
                status: action.status,
                isFetching: true,
            });
        case C.REQUEST_THING_FAILURE:
            return update(state, {
                status: action.status,
                isFetching: false,
            });

        // Reset state
        case C.CLOSE_THING:
            return updateShallow(getInitialStoreState("thing"));
        default:
            return state;
    }
}

// Follow contexts
function followContext(state = getInitialStoreState("followContext"), action) {
    switch (action.type) {
        // reset thing context on new thing loading / closing.
        case C.LOAD_THING:
            return updateShallow(getInitialStoreState("followContext"), {
                id: action.data.id,
                followStore: {
                    following: action.data.sales
                        ? Boolean(action.data.sales.seller && action.data.sales.seller.seller_follow)
                        : false,
                    loading: false,
                },
                followUser: {
                    following: action.data ? Boolean(action.data.following) : false,
                    loading: false,
                },
            });

        // Sidebar
        // Follow seller/user
        case C.TOGGLE_FOLLOW:
            return update(state, {
                [action.followType]: {
                    loading: true,
                    following: !state[action.followType].following,
                },
            });
        case C.CANCEL_FOLLOW:
            return update(state, {
                [action.followType]: {
                    loading: false,
                    following: !state[action.followType].following,
                },
            });
        case C.COMPLETE_FOLLOW:
            if (action.followType === "followStore") {
                cache.update(state.id, undefined, "sales.seller.seller_follow", state[action.followType].following);
            }
            return update(state, {
                [action.followType]: {
                    loading: false,
                    following: state[action.followType].following,
                },
            });
        case C.CLOSE_THING:
            return updateShallow(getInitialStoreState("followContext"));
        default:
            return state;
    }
}

/*
function getFancyStatus(nextFancydState) {
    return nextFancydState ? FancyStatus.Addition : FancyStatus.Removal;
}
function getCompletionIdleStatus(currentFancyState) {
    const prevFancyState = !currentFancyState;
    return prevFancyState ? FancyStatus.AfterRemoval : FancyStatus.AfterAddition;
}*/

function fancyContext(state = getInitialStoreState("fancyContext"), action) {
    switch (action.type) {
        // reset thing context on new thing loading / closing.
        case C.LOAD_THING:
            // Extract thing data for initial thing context data reset.
            // onFancyButtonUpdate(action.data.id, action.data.fancyd, getConciseNumberString(action.data.fancyd_count));
            return updateShallow(getInitialStoreState("fancyContext"), {
                id: action.data.id,
                fancyd: action.data.fancyd,
                fancyd_count: action.data.fancyd_count,
                loading: false,
                //status: FancyStatus.Idle,
            });
        case C.TOGGLE_FANCY:
            const nextFancydState = !state.fancyd;
            // return update(state, {
            //     fancyd: nextFancydState,
            //     loading: true,
            //     //status: getFancyStatus(nextFancydState)
            // });
            return {
                ...state,
                ...{
                    fancyd: nextFancydState,
                    loading: true,
                    //status: getFancyStatus(nextFancydState)
                },
            };
        case C.CANCEL_FANCY: {
            const nextFancydState = !state.fancyd;
            // return update(state, {
            //     fancyd: nextFancydState,
            //     loading: false,
            //     //status: getFancyStatus(nextFancydState)
            // });
            return {
                ...state,
                ...{
                    fancyd: nextFancydState,
                    loading: false,
                    //status: getFancyStatus(nextFancydState)
                },
            };
        }
        // Update data
        case C.COMPLETE_FANCY:
            // cache.update(state.id, undefined, "fancyd", state.fancyd);
            // cache.update(state.id, undefined, "fancyd_count", action.fancyd_count);
            // onFancyButtonUpdate(state.id, state.fancyd, getConciseNumberString(action.fancyd_count));
            // return update(state, {
            //     loading: false,
            //     fancyd_count: action.fancyd_count,
            //     //status: getCompletionIdleStatus(state.fancyd)
            // });
            return {
                ...state,
                ...{
                    loading: false,
                    fancyd_count: action.fancyd_count,
                    //status: getCompletionIdleStatus(state.fancyd)
                },
            };
        case C.CLOSE_THING:
            return updateShallow(getInitialStoreState("fancyContext"));
        default:
            return state;
    }
}

function slideContext(state = getInitialStoreState("slideContext"), action) {
    switch (action.type) {
        // reset thing context on new thing loading / closing.
        case C.LOAD_THING:
            return updateShallow(getInitialStoreState("slideContext"), {
                id: action.data.id,
            });
        case C.SET_THUMBNAIL_INDEX:
            return update(state, {
                thumbnailIndex: action.thumbnailIndex,
            });
        case C.CLOSE_THING:
            return updateShallow(getInitialStoreState("slideContext"));
        default:
            return state;
    }
}

function saleContext(state = getInitialStoreState("saleContext"), action) {
    switch (action.type) {
        // reset thing context on new thing loading / closing.
        case C.LOAD_THING: {
            // Extract thing data for initial thing context data reset.
            const thing = action.data;
            const sales = thing && thing.sales;
            const saleOptionInclSales = getFirstSaleOption(sales);
            const nextContext = {
                selectedQuantity: 1,
                // saleOptionID: (saleOptionInclSales && saleOptionInclSales.id) || null,
                saleOptionID: null,
                currencyCode: action.data.currency_code,
                price: (saleOptionInclSales && saleOptionInclSales.price) || null,
                waiting: null,
            };
            return updateShallow(getInitialStoreState("saleContext"), nextContext);
        }
        case C.CLOSE_THING:
            return updateShallow(getInitialStoreState("saleContext"));
        case C.UPDATE_SALE_CONTEXT: {
            // Setting waiting
            if (action.waiting != null) {
                setWaiting(state.saleOptionID, action.waiting);
            }

            let waiting = action.waiting;
            // Reset quantity / Change waiting if option is changed.
            if (action.saleOptionID != null && action.saleOptionID !== state.saleOptionID) {
                action.selectedQuantity = 1;
                waiting = null;
            }

            const nextContext = {
                selectedQuantity: action.selectedQuantity,
                saleOptionID: action.saleOptionID, // `thing.id`? | `sio.id`?
                price: action.price, // (props.thing.sales_available && props.thing.sales.price) || null,
                // UI
                currencyCode: action.currencyCode, // props.thing.currency_code
                currencyMoney: action.currencyMoney, //
                currencySymbol: action.currencySymbol, //
                personalization: action.personalization,
                waiting,
            };
            return update(state, nextContext);
        }
        default:
            return state;
    }
}

/*
function checkNotImplementedWithURLExceptionRule(META) {
    if (['Fancybox', 'Hermes'].some(type => META[type])) {
        window.location.reload()
    }
}*/

const rootReducer = combineReducers({
    appContext,
    // Thing contexts
    followContext,
    fancyContext,
    slideContext,
    saleContext,
    // etc.
    thing,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
