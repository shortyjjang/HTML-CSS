import { MP, getLocationArgPairs, isEmpty, isStaticPage, stripPathname } from "fancyutils";
import { Dispatch, State } from "redux";
import { ThunkAction } from "redux-thunk";

import { history } from "common-components";
import { historyData } from "../container/history";
import store from "../store/store";
import { closeModal } from "../container/routeutils";
import {
    closeThing,
    openThing,
    loadThing,
    requestThing,
    requestThingFail,
    toggleFollow as toggleFollowAction,
    cancelFollow,
    completeFollow,
    toggleFancy as toggleFancyAction,
    cancelFancy,
    completeFancy,
    setThumbnailIndex,
} from "./actions";
import C from "./action-constants";
import { formatPrice, isSalesOptionsAvailable, getCurrentSaleOption, getSaleImages } from "../components/map";
import { ThingCache, cache } from "../cache";
import { salesStatus } from "../config";
import { ThingObject, SaleContext } from "ftypes";

function shouldOpenThing(state) {
    return state.appContext.visible !== true;
}

// Blocks illegal requests
function shouldFetchThing(state, thingID) {
    if (state.thing.ID === thingID || state.thing.isFetching) {
        return false;
    } else {
        return true;
    }
}

export function closeOverlay() {
    return (dispatch: Dispatch) => {
        if (isStaticPage()) {
            return;
        }
        closeModal();
        historyData.overlayIsOn = false;
        history.push(stripPathname(historyData.preservedHref), null);
        document.title = historyData.initialTitle;

        dispatch(closeThing());
        $(document).off("keydown.overlayThing");
        $(window).trigger("scroll");
    };
}

function onDataFetched(dispatch: Dispatch, thingID, thing, type) {
    addAdditionalThingContext(thing);
    cache.add(thingID, thing, type);
    dispatch(loadThing(thingID, thing));
    onLoadThing(thing);
}

const fetchedThingsIds = {};

export function fetchThing(
    thingID: string,
    type = ThingCache.THINGS,
    killCache = false,
    override = false,
    queryString = ""
) {
    return (dispatch: Dispatch, getState: () => State) => {
        if (thingID == null) {
            console.warn("fetchThing(): thingID was null.");
            return;
        }
        var state = getState();
        if (shouldOpenThing(state)) {
            dispatch(openThing());
        }
        if (killCache) {
            cache.remove(thingID, type);
            delete state.thing;
        }

        const shouldFetch = override || shouldFetchThing(state, thingID);
        if (killCache || shouldFetch) {
            if (cache.exists(thingID, type)) {
                const cac = cache.get(thingID, type);
                dispatch(loadThing(thingID, cac));
                onLoadThing(cac);
                // if cache is crawled one, request should continue
                if (!cac.isCrawled) {
                    return;
                }
            }

            // static ot page prefetch
            if (window.thingPageData) {
                const thingPageData = window.thingPageData;
                onDataFetched(dispatch, thingID, thingPageData, type);
                delete window.thingPageData;
                return;
            }

            dispatch(requestThing(thingID));
            let options;

            options = { owner: true, external_apps: true, viewer: true };
            if (getLocationArgPairs("admin")) {
                options.admin = true;
            }
            if (type === ThingCache.SALES) {
                options.sales = true; // /sales/(+d) URL
            }
            const successFn = (thing) => {
                if (thing.need_more_fetch) {
                    // Load main image as fast as possible.
                    if (thing.image_resized_max && thing.image_resized_max.src) {
                        let img = new Image();
                        img.src = thing.image.src;
                    }
                    fetchedThingsIds[thingID] = 1;
                    dispatch(loadThing(thingID, thing));
                    onLoadThing(thing);
                } else {
                    fetchedThingsIds[thingID] = 2;
                    onDataFetched(dispatch, thingID, thing, type);
                }
            };
            const failFn = (failureXHR) => {
                // FIXME: This error handling only happens when there's server-side error -
                //        can't handle client-side ones
                dispatch(requestThingFail(/*thingID*/));
                if (failureXHR && failureXHR.status === 404) {
                    alertify.alert("This page is not available. Please try again later.");
                } else {
                    alertify.alert(
                        'There was an error while opening the page.<br> Please try again or contact <a mailto="cs@fancy.com">cs@fancy.com</a>.'
                    );
                }
            };
            if (window.requestPromise) {
                const requestPromise = window.requestPromise;
                delete window.requestPromise;
                requestPromise.then(successFn).catch(failFn);
            } else {
                $.get(`/rest-api/v1/things/${thingID}/details${queryString}`, options).then(successFn).fail(failFn);
            }
        }
    };
}

export function getCordialProperties(thing) {
    const prop = {
        thingID: thing.id,
        productID: thing.sales.id,
        seller: thing.sales.seller.username,
        url: "https://fancy.com" + thing.url,
        name: thing.emojified_name,
        category: thing.sales.cordial_category,
        instock: thing.sales.available && !thing.sales.soldout,
        image: thing.images[0].image_url,
        price: parseFloat(thing.sales.min_price),
    };
    if (thing.recommended && thing.recommended.length) {
        prop["recommended"] = thing.recommended.map((item, i) => item.id);
    }
    return prop;
}

function onLoadThing(thing) {
    const MPArgs = { "thing id": thing.id };
    const currentLocationArgPair = getLocationArgPairs("utm");
    if (currentLocationArgPair) {
        MPArgs.utm = currentLocationArgPair[1];
    }
    MP("View Thing Detail", MPArgs);
    if (typeof LogExposed != "undefined") window.LogExposed.addLog(thing.id + "", "thing");
    try {
        window.crdl("event", "browse", getCordialProperties(thing));
    } catch (e) {}
    try {
        let trackingItem;
        if (thing.sales) {
            trackingItem = {
                id: thing.sales.id,
                brand: thing.sales.seller.brand_name,
                name: thing.sales.emojified_name || thing.emojified_name,
                price: thing.sales.price,
            };
            window.dataLayer.push({
                product_id: thing.sales.id,
                event: "ProductPage",
                products: undefined,
                products_info: undefined,
                revenue: undefined,
                option_id: thing.sales.options && thing.sales.options.length ? thing.sales.options[0].id : undefined,
            });
        } else {
            trackingItem = {
                id: thing.id,
                name: thing.emojified_name,
            };
        }
        window.TrackingEvents.viewItem(trackingItem);
        ga("send", { hitType: "pageview", page: location.href, title: document.title });
    } catch (e) {}
}

function addAdditionalThingContext(thingData: ThingObject) {
    thingData.fromServer = true;
    thingData.sales_available =
        !isEmpty(thingData.sales) &&
        !thingData.sales.show_anywhere_only &&
        thingData.sales.status !== salesStatus.EXPIRED; // TODO: need to check exact condition.
}

export function toggleFollow({ seller_id, user_id }) {
    return (dispatch: Dispatch, getState: () => State) => {
        var state = getState();
        var followType;
        var data;
        if (seller_id) {
            followType = "followStore";
            data = { seller_id };
        } else if (user_id) {
            followType = "followUser";
            data = { user_id };
        } else {
            return;
        }

        if (state.followContext[followType].loading === false) {
            var url = state.followContext[followType].following === true ? "/delete_follow.xml" : "/add_follow.xml";
            dispatch(toggleFollowAction(followType));
            $.ajax({
                url,
                data,
                type: "post",
                dataType: "xml",
            })
                .done(function (xml) {
                    var $status = $(xml).find("status_code");
                    if ($status.length && $status.text() !== 0) {
                        dispatch(completeFollow(followType));
                    } else {
                        dispatch(cancelFollow(followType));
                    }
                })
                .fail(function () {
                    dispatch(cancelFollow(followType));
                });
        }
    };
}

export function toggleFancy(thingID: string) {
    return (dispatch: Dispatch, getState: () => State) => {
        var state = getState();
        var { fancyd, fancyd_count, loading } = state.fancyContext;
        if (!loading) {
            dispatch(toggleFancyAction(thingID));
            $.ajax({
                type: "PUT",
                url: `/rest-api/v1/things/${thingID}`,
                data: {
                    fancyd: !fancyd,
                },
            })
                .done(function (json) {
                    var fc = 0;
                    if (json.id && json.fancyd === !fancyd) {
                        if (json.fancyd === true) {
                            fc = fancyd_count + 1;
                        } else if (json.fancyd === false) {
                            fc = fancyd_count - 1;
                        }
                        // cache.update(thingID, undefined, "fancyd", json.fancyd);
                        // cache.update(thingID, undefined, "fancyd_count", fc);

                        dispatch(completeFancy(thingID, fc));
                    } else {
                        dispatch(cancelFancy(thingID));
                    }
                })
                .fail(function () {
                    dispatch(cancelFancy(thingID));
                });
        }
    };
}

function calculatePrice(thing: ThingObject, saleContext: SaleContext, newContext: SaleContext) {
    const saleOptionID = newContext.saleOptionID || saleContext.saleOptionID;
    const sales = thing && thing.sales;
    // Get object basis for retrieving price.
    if (isSalesOptionsAvailable(sales)) {
        const basis = _.find(sales.options, (option) => option.id === saleOptionID);
        if (basis != null) {
            return basis.price;
        } else {
            console.warn(
                "calculatePrice():",
                "Wrong saleOptionID supplied, please investigate. saleOptionID: ",
                saleOptionID
            );
            return 0;
        }
    } else if (sales != null) {
        return sales.price;
    } else {
        return 0;
    }
}

export function updateSaleContext(newContext: SaleContext) {
    return (dispatch: Dispatch, getState: () => State) => {
        var { thing, saleContext, slideContext } = getState();
        newContext.price = calculatePrice(thing.data, saleContext, newContext);
        dispatch({ ...newContext, type: C.UPDATE_SALE_CONTEXT });
        if (saleContext.saleOptionID !== newContext.saleOptionID) {
            const option = getCurrentSaleOption(thing.data.sales, newContext, true);
            const saleImages = getSaleImages(thing.data, option);
            let firstOptionImageIdx;
            if (
                option &&
                saleImages.some((img, idx) => {
                    if (img.option_id === option.id) {
                        firstOptionImageIdx = idx;
                        return true;
                    }
                })
            ) {
                // blank
            } else {
                if (slideContext.thumbnailIndex > saleImages.length - 1) {
                    firstOptionImageIdx = 0;
                }
            }
            if (firstOptionImageIdx) {
                dispatch(setThumbnailIndex(firstOptionImageIdx));
            }
        }
    };
}

function requestCurrencyConversion(nextCode: string, nextPrice: string, callback) {
    const shouldConvert = !(nextCode == null || callback == null);
    if (shouldConvert) {
        if (window.numberType === 2) {
            nextPrice = nextPrice.replace(/,/g, ".").replace(/ /g, "");
        }
        if (_.isString(nextPrice)) {
            nextPrice = nextPrice.replace(/,/g, "");
        }
        $.ajax({
            url: "/convert_currency.json",
            type: "GET",
            dataType: "json",
            data: {
                amount: nextPrice,
                currency_code: nextCode,
            },
        }).success(({ amount, currency } = {}) => {
            if (amount == null) {
                return;
            }
            callback(currency.code, formatPrice(amount, currency.code), currency.symbol);
        });
    }
}

function _convertCurrency(nextCode: string, nextPrice: string, force: boolean) {
    return (dispatch: Dispatch, getState: () => State) => {
        const { saleContext } = getState();
        if (nextCode !== "USD") {
            if (
                force || // FIXME: unable to comparison since price update comes first (SaleitemSidebarHead.componentWillReceiveProps())
                saleContext.price !== nextPrice || // currency price changed
                saleContext.currencyCode !== nextCode || // currency code changed
                saleContext.currencyMoney == null || // currency symbol/money is not set (changed from usd)
                saleContext.currencySymbol == null
            ) {
                nextPrice = nextPrice || saleContext.price || "0.00";
                requestCurrencyConversion(nextCode, nextPrice, (currencyCode, currencyMoney, currencySymbol) => {
                    if (typeof currencyMoney === "number") {
                        currencyMoney = currencyMoney.toFixed(2);
                    }
                    currencyMoney = currencyMoney.replace(/[ \.]00$/, "");
                    dispatch(
                        updateSaleContext({
                            currencyCode,
                            currencyMoney,
                            currencySymbol,
                        })
                    );
                });
            } else {
                // NOOP
            }
        } else {
            dispatch(
                updateSaleContext({
                    currencyCode: "USD",
                    currencyMoney: null,
                    currencySymbol: null,
                })
            );
        }
    };
}

export function convertCurrency(nextCode, nextPrice, force = false) {
    store.dispatch(_convertCurrency(nextCode, nextPrice, force));
}
