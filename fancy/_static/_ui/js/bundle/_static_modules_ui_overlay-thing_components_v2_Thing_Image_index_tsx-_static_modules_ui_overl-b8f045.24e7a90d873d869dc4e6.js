(self["webpackChunkfancy"] = self["webpackChunkfancy"] || []).push([["_static_modules_ui_overlay-thing_components_v2_Thing_Image_index_tsx-_static_modules_ui_overl-b8f045"],{

/***/ "./_static/modules/ui/overlay-thing/ThingTypes.js":
/*!********************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/ThingTypes.js ***!
  \********************************************************/
/*! namespace exports */
/*! export GiftcardType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export HotelType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export LaunchAppType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PlainThingType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export SaleItemType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ThingTypeMeta [provided] [no usage info] [missing usage info prevents renaming] */
/*! export VanityType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getThingType [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThingTypeMeta": () => /* binding */ ThingTypeMeta,
/* harmony export */   "PlainThingType": () => /* binding */ PlainThingType,
/* harmony export */   "SaleItemType": () => /* binding */ SaleItemType,
/* harmony export */   "GiftcardType": () => /* binding */ GiftcardType,
/* harmony export */   "HotelType": () => /* binding */ HotelType,
/* harmony export */   "VanityType": () => /* binding */ VanityType,
/* harmony export */   "LaunchAppType": () => /* binding */ LaunchAppType,
/* harmony export */   "getThingType": () => /* binding */ getThingType
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");






// -- Members --
// className: string
// - class name that used from sidebar head 'wrapper figure-info {className}'.
// type: string
// - meta string that indicates type name

var ThingTypeMeta = /*#__PURE__*/function () {
  function ThingTypeMeta() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, ThingTypeMeta);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(ThingTypeMeta, [{
    key: "getName",
    value: function getName(thingContext) {
      return thingContext.name;
    }
  }]);

  return ThingTypeMeta;
}();

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(ThingTypeMeta, "isSale", false);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(ThingTypeMeta, "type", 'ThingTypeMeta');

var PlainThingType = /*#__PURE__*/function (_ThingTypeMeta) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(PlainThingType, _ThingTypeMeta);

  function PlainThingType() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, PlainThingType);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1___default()(PlainThingType).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(PlainThingType, null, [{
    key: "createEmptyObject",
    value: function createEmptyObject() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var objectArgs = (0,fancyutils__WEBPACK_IMPORTED_MODULE_6__.mergeObjectArgs)(args);
      var thing = $.extend(true, {
        id: '1',
        url: '/',
        isCrawled: false,
        owner: {},
        image: {
          src: '',
          width: 1,
          height: 1
        },
        user: {},
        type: 'thing',
        fancyd_friends: []
      }, objectArgs);
      thing.META = getThingType(thing);
      return thing;
    }
  }]);

  return PlainThingType;
}(ThingTypeMeta);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(PlainThingType, "className", '');

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(PlainThingType, "type", 'PlainThing');

var SaleItemType = /*#__PURE__*/function (_ThingTypeMeta2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(SaleItemType, _ThingTypeMeta2);

  function SaleItemType() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, SaleItemType);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1___default()(SaleItemType).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(SaleItemType, null, [{
    key: "getName",
    value: function getName(thingContext) {
      return thingContext.sales.name;
    }
  }, {
    key: "createEmptyObject",
    value: function createEmptyObject(objectArgs) {
      return PlainThingType.createEmptyObject({
        sales_available: true,
        sales: {
          id: '1',
          review_rating: 1,
          review_count: 1,
          size_chart_ids: ['1'],
          images: [{
            src: '',
            width: 1,
            height: 1
          }],
          seller: {
            id: '1'
          }
        },
        type: 'sales'
      }, objectArgs);
    }
  }]);

  return SaleItemType;
}(ThingTypeMeta);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(SaleItemType, "className", '');

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(SaleItemType, "type", 'SaleItem');

var GiftcardType = /*#__PURE__*/function (_SaleItemType) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(GiftcardType, _SaleItemType);

  function GiftcardType() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, GiftcardType);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1___default()(GiftcardType).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(GiftcardType, null, [{
    key: "getName",
    value: function getName() {
      return window.gettext("Fancy Gift Card");
    }
  }]);

  return GiftcardType;
}(SaleItemType);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(GiftcardType, "className", 'giftcard');

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(GiftcardType, "type", 'Giftcard');

var HotelType = /*#__PURE__*/function (_SaleItemType2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(HotelType, _SaleItemType2);

  function HotelType() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, HotelType);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1___default()(HotelType).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(HotelType, null, [{
    key: "getName",
    value: function getName(thingContext) {
      return thingContext.hotel_search.hotel.name;
    }
  }]);

  return HotelType;
}(SaleItemType);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(HotelType, "className", 'hotel');

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(HotelType, "type", 'Hotel');

var VanityType = /*#__PURE__*/function (_SaleItemType3) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(VanityType, _SaleItemType3);

  function VanityType() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, VanityType);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1___default()(VanityType).apply(this, arguments));
  }

  return VanityType;
}(SaleItemType);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(VanityType, "className", 'vanity');

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(VanityType, "type", 'Vanity');

var LaunchAppType = /*#__PURE__*/function (_ThingTypeMeta3) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(LaunchAppType, _ThingTypeMeta3);

  function LaunchAppType() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, LaunchAppType);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_0___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_1___default()(LaunchAppType).apply(this, arguments));
  }

  return LaunchAppType;
}(ThingTypeMeta); // Retrieve meta by looking up thing object.

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(LaunchAppType, "className", '');

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(LaunchAppType, "type", 'LaunchApp');

function getThingType(thingContext) {
  var ThingType;

  if (thingContext.hotel_search) {
    ThingType = HotelType;
  } else if (thingContext.has_launch_app && thingContext.metadata) {
    ThingType = LaunchAppType;
  } else if (thingContext.type === 'giftcard') {
    ThingType = GiftcardType;
  } else if (thingContext.sales_available) {
    if (thingContext.type === 'vanity_number') {
      ThingType = VanityType;
    } else {
      ThingType = SaleItemType;
    }
  } else {
    ThingType = PlainThingType;
  }

  return ThingType;
}
var ThingTypes = [PlainThingType, SaleItemType, GiftcardType, HotelType, VanityType, LaunchAppType]; // TODO: immutable

ThingTypes.forEach(function (AttachingType) {
  ThingTypes.forEach(function (ComparingType) {
    AttachingType[ComparingType.type] = AttachingType === ComparingType;
  });
});

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/action/action-constants.js":
/*!*********************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/action/action-constants.js ***!
  \*********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// Generate `key: String(key)` structure by given string key arguments
function constantGen() {
  var keys = [].slice.call(arguments);
  return keys.reduce(function (prev, next) {
    prev[next] = next;
    return prev;
  }, {});
}

var C = constantGen('UPDATE_APP_CONTEXT', // Loading
'REQUEST_THING', 'REQUEST_THING_FAILURE', 'LOAD_THING', // UI Actions
'OPEN_THING', 'CLOSE_THING', // Comment form suggestion
'SET_USERNAME_KEYWORD', 'LOAD_SUGGESTION', // Thumbnail
'SET_THUMBNAIL_INDEX', // Follow
'TOGGLE_FOLLOW', 'CANCEL_FOLLOW', 'COMPLETE_FOLLOW', // Fancy
'TOGGLE_FANCY', 'CANCEL_FANCY', 'COMPLETE_FANCY', // Saleitem
'UPDATE_SALE_CONTEXT');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (C);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/action/action-helpers.ts":
/*!*******************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/action/action-helpers.ts ***!
  \*******************************************************************/
/*! namespace exports */
/*! export closeOverlay [provided] [no usage info] [missing usage info prevents renaming] */
/*! export convertCurrency [provided] [no usage info] [missing usage info prevents renaming] */
/*! export fetchThing [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getCordialProperties [provided] [no usage info] [missing usage info prevents renaming] */
/*! export toggleFancy [provided] [no usage info] [missing usage info prevents renaming] */
/*! export toggleFollow [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateSaleContext [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeOverlay": () => /* binding */ closeOverlay,
/* harmony export */   "fetchThing": () => /* binding */ fetchThing,
/* harmony export */   "getCordialProperties": () => /* binding */ getCordialProperties,
/* harmony export */   "toggleFollow": () => /* binding */ toggleFollow,
/* harmony export */   "toggleFancy": () => /* binding */ toggleFancy,
/* harmony export */   "updateSaleContext": () => /* binding */ updateSaleContext,
/* harmony export */   "convertCurrency": () => /* binding */ convertCurrency
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread */ "./node_modules/@babel/runtime/helpers/objectSpread.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _container_history__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../container/history */ "./_static/modules/ui/overlay-thing/container/history.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/store */ "./_static/modules/ui/overlay-thing/store/store.ts");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../container/routeutils */ "./_static/modules/ui/overlay-thing/container/routeutils.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions */ "./_static/modules/ui/overlay-thing/action/actions.js");
/* harmony import */ var _action_constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./action-constants */ "./_static/modules/ui/overlay-thing/action/action-constants.js");
/* harmony import */ var _components_map__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/map */ "./_static/modules/ui/overlay-thing/components/map.ts");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../cache */ "./_static/modules/ui/overlay-thing/cache.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../config */ "./_static/modules/ui/overlay-thing/config.js");












function shouldOpenThing(state) {
  return state.appContext.visible !== true;
} // Blocks illegal requests


function shouldFetchThing(state, thingID) {
  if (state.thing.ID === thingID || state.thing.isFetching) {
    return false;
  } else {
    return true;
  }
}

function closeOverlay() {
  return function (dispatch) {
    if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.isStaticPage)()) {
      return;
    }

    (0,_container_routeutils__WEBPACK_IMPORTED_MODULE_5__.closeModal)();
    _container_history__WEBPACK_IMPORTED_MODULE_3__.historyData.overlayIsOn = false;
    common_components__WEBPACK_IMPORTED_MODULE_2__.history.push((0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.stripPathname)(_container_history__WEBPACK_IMPORTED_MODULE_3__.historyData.preservedHref), null);
    document.title = _container_history__WEBPACK_IMPORTED_MODULE_3__.historyData.initialTitle;
    dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.closeThing)());
    $(document).off("keydown.overlayThing");
    $(window).trigger("scroll");
  };
}

function onDataFetched(dispatch, thingID, thing, type) {
  addAdditionalThingContext(thing);
  _cache__WEBPACK_IMPORTED_MODULE_9__.cache.add(thingID, thing, type);
  dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.loadThing)(thingID, thing));
  onLoadThing(thing);
}

var fetchedThingsIds = {};
function fetchThing(thingID) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _cache__WEBPACK_IMPORTED_MODULE_9__.ThingCache.THINGS;
  var killCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var override = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var queryString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
  return function (dispatch, getState) {
    if (thingID == null) {
      console.warn("fetchThing(): thingID was null.");
      return;
    }

    var state = getState();

    if (shouldOpenThing(state)) {
      dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.openThing)());
    }

    if (killCache) {
      _cache__WEBPACK_IMPORTED_MODULE_9__.cache.remove(thingID, type);
      delete state.thing;
    }

    var shouldFetch = override || shouldFetchThing(state, thingID);

    if (killCache || shouldFetch) {
      if (_cache__WEBPACK_IMPORTED_MODULE_9__.cache.exists(thingID, type)) {
        var cac = _cache__WEBPACK_IMPORTED_MODULE_9__.cache.get(thingID, type);
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.loadThing)(thingID, cac));
        onLoadThing(cac); // if cache is crawled one, request should continue

        if (!cac.isCrawled) {
          return;
        }
      } // static ot page prefetch


      if (window.thingPageData) {
        var thingPageData = window.thingPageData;
        onDataFetched(dispatch, thingID, thingPageData, type);
        delete window.thingPageData;
        return;
      }

      dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.requestThing)(thingID));
      var options;
      options = {
        owner: true,
        external_apps: true,
        viewer: true
      };

      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.getLocationArgPairs)("admin")) {
        options.admin = true;
      }

      if (type === _cache__WEBPACK_IMPORTED_MODULE_9__.ThingCache.SALES) {
        options.sales = true; // /sales/(+d) URL
      }

      var successFn = function successFn(thing) {
        if (thing.need_more_fetch) {
          // Load main image as fast as possible.
          if (thing.image_resized_max && thing.image_resized_max.src) {
            var img = new Image();
            img.src = thing.image.src;
          }

          fetchedThingsIds[thingID] = 1;
          dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.loadThing)(thingID, thing));
          onLoadThing(thing);
        } else {
          fetchedThingsIds[thingID] = 2;
          onDataFetched(dispatch, thingID, thing, type);
        }
      };

      var failFn = function failFn(failureXHR) {
        // FIXME: This error handling only happens when there's server-side error -
        //        can't handle client-side ones
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.requestThingFail)());

        if (failureXHR && failureXHR.status === 404) {
          alertify.alert("This page is not available. Please try again later.");
        } else {
          alertify.alert('There was an error while opening the page.<br> Please try again or contact <a mailto="cs@fancy.com">cs@fancy.com</a>.');
        }
      };

      if (window.requestPromise) {
        var requestPromise = window.requestPromise;
        delete window.requestPromise;
        requestPromise.then(successFn)["catch"](failFn);
      } else {
        $.get("/rest-api/v1/things/".concat(thingID, "/details").concat(queryString), options).then(successFn).fail(failFn);
      }
    }
  };
}
function getCordialProperties(thing) {
  var prop = {
    thingID: thing.id,
    productID: thing.sales.id,
    seller: thing.sales.seller.username,
    url: "https://fancy.com" + thing.url,
    name: thing.emojified_name,
    category: thing.sales.cordial_category,
    instock: thing.sales.available && !thing.sales.soldout,
    image: thing.images[0].image_url,
    price: parseFloat(thing.sales.min_price)
  };

  if (thing.recommended && thing.recommended.length) {
    prop["recommended"] = thing.recommended.map(function (item, i) {
      return item.id;
    });
  }

  return prop;
}

function onLoadThing(thing) {
  var MPArgs = {
    "thing id": thing.id
  };
  var currentLocationArgPair = (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.getLocationArgPairs)("utm");

  if (currentLocationArgPair) {
    MPArgs.utm = currentLocationArgPair[1];
  }

  (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.MP)("View Thing Detail", MPArgs);
  if (typeof LogExposed != "undefined") window.LogExposed.addLog(thing.id + "", "thing");

  try {
    window.crdl("event", "browse", getCordialProperties(thing));
  } catch (e) {}

  try {
    var trackingItem;

    if (thing.sales) {
      trackingItem = {
        id: thing.sales.id,
        brand: thing.sales.seller.brand_name,
        name: thing.sales.emojified_name || thing.emojified_name,
        price: thing.sales.price
      };
      window.dataLayer.push({
        product_id: thing.sales.id,
        event: "ProductPage",
        products: undefined,
        products_info: undefined,
        revenue: undefined,
        option_id: thing.sales.options && thing.sales.options.length ? thing.sales.options[0].id : undefined
      });
    } else {
      trackingItem = {
        id: thing.id,
        name: thing.emojified_name
      };
    }

    window.TrackingEvents.viewItem(trackingItem);
    ga("send", {
      hitType: "pageview",
      page: location.href,
      title: document.title
    });
  } catch (e) {}
}

function addAdditionalThingContext(thingData) {
  thingData.fromServer = true;
  thingData.sales_available = !(0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(thingData.sales) && !thingData.sales.show_anywhere_only && thingData.sales.status !== _config__WEBPACK_IMPORTED_MODULE_10__.salesStatus.EXPIRED; // TODO: need to check exact condition.
}

function toggleFollow(_ref) {
  var seller_id = _ref.seller_id,
      user_id = _ref.user_id;
  return function (dispatch, getState) {
    var state = getState();
    var followType;
    var data;

    if (seller_id) {
      followType = "followStore";
      data = {
        seller_id: seller_id
      };
    } else if (user_id) {
      followType = "followUser";
      data = {
        user_id: user_id
      };
    } else {
      return;
    }

    if (state.followContext[followType].loading === false) {
      var url = state.followContext[followType].following === true ? "/delete_follow.xml" : "/add_follow.xml";
      dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.toggleFollow)(followType));
      $.ajax({
        url: url,
        data: data,
        type: "post",
        dataType: "xml"
      }).done(function (xml) {
        var $status = $(xml).find("status_code");

        if ($status.length && $status.text() !== 0) {
          dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.completeFollow)(followType));
        } else {
          dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.cancelFollow)(followType));
        }
      }).fail(function () {
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.cancelFollow)(followType));
      });
    }
  };
}
function toggleFancy(thingID) {
  return function (dispatch, getState) {
    var state = getState();
    var _state$fancyContext = state.fancyContext,
        fancyd = _state$fancyContext.fancyd,
        fancyd_count = _state$fancyContext.fancyd_count,
        loading = _state$fancyContext.loading;

    if (!loading) {
      dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.toggleFancy)(thingID));
      $.ajax({
        type: "PUT",
        url: "/rest-api/v1/things/".concat(thingID),
        data: {
          fancyd: !fancyd
        }
      }).done(function (json) {
        var fc = 0;

        if (json.id && json.fancyd === !fancyd) {
          if (json.fancyd === true) {
            fc = fancyd_count + 1;
          } else if (json.fancyd === false) {
            fc = fancyd_count - 1;
          } // cache.update(thingID, undefined, "fancyd", json.fancyd);
          // cache.update(thingID, undefined, "fancyd_count", fc);


          dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.completeFancy)(thingID, fc));
        } else {
          dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.cancelFancy)(thingID));
        }
      }).fail(function () {
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.cancelFancy)(thingID));
      });
    }
  };
}

function calculatePrice(thing, saleContext, newContext) {
  var saleOptionID = newContext.saleOptionID || saleContext.saleOptionID;
  var sales = thing && thing.sales; // Get object basis for retrieving price.

  if ((0,_components_map__WEBPACK_IMPORTED_MODULE_8__.isSalesOptionsAvailable)(sales)) {
    var basis = _.find(sales.options, function (option) {
      return option.id === saleOptionID;
    });

    if (basis != null) {
      return basis.price;
    } else {
      console.warn("calculatePrice():", "Wrong saleOptionID supplied, please investigate. saleOptionID: ", saleOptionID);
      return 0;
    }
  } else if (sales != null) {
    return sales.price;
  } else {
    return 0;
  }
}

function updateSaleContext(newContext) {
  return function (dispatch, getState) {
    var _getState = getState(),
        thing = _getState.thing,
        saleContext = _getState.saleContext,
        slideContext = _getState.slideContext;

    newContext.price = calculatePrice(thing.data, saleContext, newContext);
    dispatch(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, newContext, {
      type: _action_constants__WEBPACK_IMPORTED_MODULE_7__.default.UPDATE_SALE_CONTEXT
    }));

    if (saleContext.saleOptionID !== newContext.saleOptionID) {
      var option = (0,_components_map__WEBPACK_IMPORTED_MODULE_8__.getCurrentSaleOption)(thing.data.sales, newContext, true);
      var saleImages = (0,_components_map__WEBPACK_IMPORTED_MODULE_8__.getSaleImages)(thing.data, option);
      var firstOptionImageIdx;

      if (option && saleImages.some(function (img, idx) {
        if (img.option_id === option.id) {
          firstOptionImageIdx = idx;
          return true;
        }
      })) {// blank
      } else {
        if (slideContext.thumbnailIndex > saleImages.length - 1) {
          firstOptionImageIdx = 0;
        }
      }

      if (firstOptionImageIdx) {
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_6__.setThumbnailIndex)(firstOptionImageIdx));
      }
    }
  };
}

function requestCurrencyConversion(nextCode, nextPrice, callback) {
  var shouldConvert = !(nextCode == null || callback == null);

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
        currency_code: nextCode
      }
    }).success(function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          amount = _ref2.amount,
          currency = _ref2.currency;

      if (amount == null) {
        return;
      }

      callback(currency.code, (0,_components_map__WEBPACK_IMPORTED_MODULE_8__.formatPrice)(amount, currency.code), currency.symbol);
    });
  }
}

function _convertCurrency(nextCode, nextPrice, force) {
  return function (dispatch, getState) {
    var _getState2 = getState(),
        saleContext = _getState2.saleContext;

    if (nextCode !== "USD") {
      if (force || // FIXME: unable to comparison since price update comes first (SaleitemSidebarHead.componentWillReceiveProps())
      saleContext.price !== nextPrice || // currency price changed
      saleContext.currencyCode !== nextCode || // currency code changed
      saleContext.currencyMoney == null || // currency symbol/money is not set (changed from usd)
      saleContext.currencySymbol == null) {
        nextPrice = nextPrice || saleContext.price || "0.00";
        requestCurrencyConversion(nextCode, nextPrice, function (currencyCode, currencyMoney, currencySymbol) {
          if (typeof currencyMoney === "number") {
            currencyMoney = currencyMoney.toFixed(2);
          }

          currencyMoney = currencyMoney.replace(/[ \.]00$/, "");
          dispatch(updateSaleContext({
            currencyCode: currencyCode,
            currencyMoney: currencyMoney,
            currencySymbol: currencySymbol
          }));
        });
      } else {// NOOP
      }
    } else {
      dispatch(updateSaleContext({
        currencyCode: "USD",
        currencyMoney: null,
        currencySymbol: null
      }));
    }
  };
}

function convertCurrency(nextCode, nextPrice) {
  var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  _store_store__WEBPACK_IMPORTED_MODULE_4__.default.dispatch(_convertCurrency(nextCode, nextPrice, force));
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/action/actions.js":
/*!************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/action/actions.js ***!
  \************************************************************/
/*! namespace exports */
/*! export cancelFancy [provided] [no usage info] [missing usage info prevents renaming] */
/*! export cancelFollow [provided] [no usage info] [missing usage info prevents renaming] */
/*! export closeThing [provided] [no usage info] [missing usage info prevents renaming] */
/*! export completeFancy [provided] [no usage info] [missing usage info prevents renaming] */
/*! export completeFollow [provided] [no usage info] [missing usage info prevents renaming] */
/*! export loadThing [provided] [no usage info] [missing usage info prevents renaming] */
/*! export openThing [provided] [no usage info] [missing usage info prevents renaming] */
/*! export requestThing [provided] [no usage info] [missing usage info prevents renaming] */
/*! export requestThingFail [provided] [no usage info] [missing usage info prevents renaming] */
/*! export setThumbnailIndex [provided] [no usage info] [missing usage info prevents renaming] */
/*! export toggleFancy [provided] [no usage info] [missing usage info prevents renaming] */
/*! export toggleFollow [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateAppContext [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "requestThing": () => /* binding */ requestThing,
/* harmony export */   "requestThingFail": () => /* binding */ requestThingFail,
/* harmony export */   "loadThing": () => /* binding */ loadThing,
/* harmony export */   "openThing": () => /* binding */ openThing,
/* harmony export */   "closeThing": () => /* binding */ closeThing,
/* harmony export */   "setThumbnailIndex": () => /* binding */ setThumbnailIndex,
/* harmony export */   "toggleFollow": () => /* binding */ toggleFollow,
/* harmony export */   "cancelFollow": () => /* binding */ cancelFollow,
/* harmony export */   "completeFollow": () => /* binding */ completeFollow,
/* harmony export */   "toggleFancy": () => /* binding */ toggleFancy,
/* harmony export */   "cancelFancy": () => /* binding */ cancelFancy,
/* harmony export */   "completeFancy": () => /* binding */ completeFancy,
/* harmony export */   "updateAppContext": () => /* binding */ updateAppContext
/* harmony export */ });
/* harmony import */ var _action_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action-constants */ "./_static/modules/ui/overlay-thing/action/action-constants.js");
 // Action on requesting thing starts

function requestThing(pendingID) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.REQUEST_THING,
    status: 'request',
    pendingID: pendingID
  };
} // Action on requesting thing fails

function requestThingFail() {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.REQUEST_THING_FAILURE,
    status: 'failed'
  };
} // action on loading request result

function loadThing(ID, data) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.LOAD_THING,
    status: 'idle',
    ID: ID,
    data: data
  };
} // Action on close overlay

function openThing() {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.OPEN_THING
  };
} // Action on close overlay

function closeThing() {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.CLOSE_THING,
    ID: null,
    pendingID: null,
    thing: null
  };
}
function setThumbnailIndex(thumbnailIndex) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.SET_THUMBNAIL_INDEX,
    thumbnailIndex: thumbnailIndex
  };
}
function toggleFollow(followType) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.TOGGLE_FOLLOW,
    followType: followType
  };
}
function cancelFollow(followType) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.CANCEL_FOLLOW,
    followType: followType
  };
}
function completeFollow(followType) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.COMPLETE_FOLLOW,
    followType: followType
  };
}
function toggleFancy(thingID) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.TOGGLE_FANCY,
    thingID: thingID
  };
}
function cancelFancy(thingID) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.CANCEL_FANCY,
    thingID: thingID
  };
}
function completeFancy(thingID, fancyd_count) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.COMPLETE_FANCY,
    thingID: thingID,
    fancyd_count: fancyd_count
  };
}
function updateAppContext(contextObject) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.UPDATE_APP_CONTEXT,
    context: contextObject
  };
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/appstate.ts":
/*!******************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/appstate.ts ***!
  \******************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateState [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "updateState": () => /* binding */ updateState
/* harmony export */ });
// App state that does not usually change during app lifecycle. (i.e. Login state)
// module-level login state object and setter
var state = {
  viewer: {},
  loggedIn: false
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (state);
function updateState(k, v) {
  state[k] = v;
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/cache.js":
/*!***************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/cache.js ***!
  \***************************************************/
/*! namespace exports */
/*! export ThingCache [provided] [no usage info] [missing usage info prevents renaming] */
/*! export cache [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThingCache": () => /* binding */ ThingCache,
/* harmony export */   "cache": () => /* binding */ cache
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");



 // Cache bucket

var ThingCache = function ThingCache() {
  var _this = this;

  _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, ThingCache);

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "things", {});

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "sales", {});

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "count", 0);

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "exists", function (id, type, ignoreCralwed) {
    var cac = _this.get(id, type);

    var existence = cac != null && _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(cac) === 'object';

    if (ignoreCralwed) {
      existence = existence && cac.isCrawled !== true;
    }

    return existence;
  });

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "_get", function (id) {
    return _this[ThingCache.THINGS][id] || _this[ThingCache.SALES][id] || null;
  });

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "get", function (id) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ThingCache.THINGS;

    var cac = _this[type][id] || _this.getCrawled(id, type);

    return cac;
  });

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "getCrawled", function (id, type) {
    var cac = _this[type][id];

    if (cac && cac.isCrawled) {
      return cac;
    } else {
      return null;
    }
  });

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "add", function (id, data, type) {
    // to add, cache should not be exist or crawled one
    var cac = _this[type][id];

    if (cac == null || cac.isCrawled === true) {
      _this[type][id] = data; // Store thing information as well

      if (type === ThingCache.SALES && data.id) {
        _this[ThingCache.THINGS][data.id] = data;
      }

      _this.count += 1;
    } else {
      console.warn('cache.add(): Cache overwrite');
    }
  });

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "remove", function (id, type) {
    if (_this[type][id]) {
      delete _this[type][id];
      _this.count -= 1;
    } else {
      console.warn('cache.remove(): Non-existing cache removal');
    }
  });

  _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "update", function (id) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ThingCache.THINGS;
    var selector = arguments.length > 2 ? arguments[2] : undefined;
    var value = arguments.length > 3 ? arguments[3] : undefined;

    if (selector == null) {
      console.warn('ThingCache#update(): selector is empty');
      return;
    }

    var t = _this.get(id, type);

    if (t) {
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_3__.index)(t, selector, value);
    }
  });
} // sweep() {
//     // TODO: should sweep cache if too many cache added by looking `cache.count`
// }
;

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(ThingCache, "SALES", 'sales');

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(ThingCache, "THINGS", 'things');

var cache = new ThingCache();
window.__THING_CACHE = cache;

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/Perf.js":
/*!*************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/Perf.js ***!
  \*************************************************************/
/*! namespace exports */
/*! export Keys [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Keys": () => /* binding */ Keys
/* harmony export */ });
var Keys = {
  Sidebar: {
    Wrap: 'SIDEBAR_WRAP',
    Body: 'SIDEBAR_BODY',
    Title: 'SIDEBAR_TITLE',
    Price: 'SIDEBAR_PRICE',
    Form: 'SIDEBAR_FORM',
    Desc: 'SIDEBAR_DESCRIPTION',
    Owner: 'SIDEBAR_OWNER'
  }
};

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/map.ts":
/*!************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/map.ts ***!
  \************************************************************/
/*! namespace exports */
/*! export currencyIsUSD [provided] [no usage info] [missing usage info prevents renaming] */
/*! export formatPrice [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getCurrentSaleOption [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getDescription [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getDetailType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getDomesticDeliveryDate [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getFirstSaleOption [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getIntlDeliveryDate [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSafeNameProp [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSaleImages [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSaleItemId [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSales [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSeller [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getThingName [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getWaiting [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isSalesOptionsAvailable [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isVanityQueriable [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isVideoUploadable [provided] [no usage info] [missing usage info prevents renaming] */
/*! export mapStateToThingProps [provided] [no usage info] [missing usage info prevents renaming] */
/*! export setWaiting [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapStateToThingProps": () => /* binding */ mapStateToThingProps,
/* harmony export */   "getSales": () => /* binding */ getSales,
/* harmony export */   "getDescription": () => /* binding */ getDescription,
/* harmony export */   "getSaleItemId": () => /* binding */ getSaleItemId,
/* harmony export */   "getSeller": () => /* binding */ getSeller,
/* harmony export */   "getDetailType": () => /* binding */ getDetailType,
/* harmony export */   "isSalesOptionsAvailable": () => /* binding */ isSalesOptionsAvailable,
/* harmony export */   "getFirstSaleOption": () => /* binding */ getFirstSaleOption,
/* harmony export */   "getCurrentSaleOption": () => /* binding */ getCurrentSaleOption,
/* harmony export */   "formatPrice": () => /* binding */ formatPrice,
/* harmony export */   "getDomesticDeliveryDate": () => /* binding */ getDomesticDeliveryDate,
/* harmony export */   "getIntlDeliveryDate": () => /* binding */ getIntlDeliveryDate,
/* harmony export */   "currencyIsUSD": () => /* binding */ currencyIsUSD,
/* harmony export */   "setWaiting": () => /* binding */ setWaiting,
/* harmony export */   "getWaiting": () => /* binding */ getWaiting,
/* harmony export */   "getSaleImages": () => /* binding */ getSaleImages,
/* harmony export */   "isVanityQueriable": () => /* binding */ isVanityQueriable,
/* harmony export */   "getSafeNameProp": () => /* binding */ getSafeNameProp,
/* harmony export */   "isVideoUploadable": () => /* binding */ isVideoUploadable,
/* harmony export */   "getThingName": () => /* binding */ getThingName
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");

var _window = window,
    gettext = _window.gettext,
    _ = _window._;
function mapStateToThingProps(state) {
  var appContext = state.appContext,
      _state$thing = state.thing,
      data = _state$thing.data,
      isFetching = _state$thing.isFetching,
      status = _state$thing.status,
      followContext = state.followContext,
      fancyContext = state.fancyContext,
      slideContext = state.slideContext,
      saleContext = state.saleContext;
  return {
    appContext: appContext,
    status: status,
    thing: data,
    isFetching: isFetching,
    followContext: followContext,
    fancyContext: fancyContext,
    slideContext: slideContext,
    saleContext: saleContext
  };
}
function getSales(type, thing) {
  return thing.sales;
}
function getDescription(type, thing) {
  if (type === "sales") {
    return thing.sales.description;
  } else if (type === "hotel") {
    return thing.hotel_search.details.propertyDescription;
  }
} // Get sale item id via permission / sales availability

function getSaleItemId(thing, viewer) {
  if (viewer && viewer.is_admin_any) {
    if (thing.sales) {
      return thing.sales.id;
    } else if (thing.inactive_sales) {
      return thing.inactive_sales.id;
    }
  }
} // Get sale item id via permission / sales availability

function getSeller(thing) {
  if (thing.sales) {
    return thing.sales.seller;
  } else if (thing.inactive_sales) {
    return thing.inactive_sales.seller;
  }
}
function getDetailType(thing) {
  if (thing.hotel_search) {
    return "hotel";
  } else if (thing.sales_available && thing.type !== "vanity_number") {
    return "sales";
  } else if (!thing.sales_available && !thing.has_launch_app && thing.type !== "giftcard") {
    return "urlOnly";
  }
}
function isSalesOptionsAvailable(sales) {
  return sales != null && !(0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(sales.options);
}
function getFirstSaleOption(sales) {
  var ignoreEmptySaleOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (isSalesOptionsAvailable(sales)) {
    return sales.options[0];
  } else if (ignoreEmptySaleOption === false) {
    return sales || null;
  }
}
function getCurrentSaleOption(sales) {
  var saleContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ignoreEmptySaleOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var saleOptionID = saleContext.saleOptionID;

  if (isSalesOptionsAvailable(sales)) {
    if (saleOptionID) {
      var opts = _(sales.options).filter(function (prop) {
        return prop.id === saleOptionID;
      });

      if (opts[0] == null) {
        console.warn("saleOption should not be null!");
      }

      return opts[0] == null ? {
        id: 0,
        discount_percentage: "0.0",
        quantity: 0,
        soldout: true,
        retail_price: 0,
        name: ''
      } : opts[0];
    } else {
      return sales.options[0];
    }
  } else if (ignoreEmptySaleOption === false) {
    return sales;
  }
}
function formatPrice(amount, currency) {
  if (currency == "BTC") return amount + "";
  var newPrice = amount.toFixed(2) + "";
  var regex = /(\d)(\d{3})([,\.]|$)/;

  while (regex.test(newPrice)) {
    newPrice = newPrice.replace(regex, "$1,$2$3");
  }

  if (window.numberType === 2) {
    newPrice = newPrice.replace(/,/g, " ").replace(/\./g, ",");
  }

  return newPrice;
} // sales: thing.sales

function getDomesticDeliveryDate(sales) {
  var date = "";

  if (sales.expected_delivery_day_1) {
    date += sales.expected_delivery_day_1;
  }

  if (sales.expected_delivery_day_2) {
    date += " - " + sales.expected_delivery_day_2;
  }

  return date;
} // sales: thing.sales

function getIntlDeliveryDate(sales) {
  var date = ""; // TODO: use moment for locale string

  if (sales.expected_delivery_day_intl_1) {
    date += sales.expected_delivery_day_intl_1;
  }

  if (sales.expected_delivery_day_intl_2) {
    date += " - " + sales.expected_delivery_day_intl_2;
  }

  return date;
}
function currencyIsUSD(_ref) {
  var saleContext = _ref.saleContext;
  return saleContext.currencyCode === "USD";
} // [sale option id]: { true | false }

var saleOptionWaitingRegistry = {};
window.saleOptionWaitingRegistry = saleOptionWaitingRegistry;
function setWaiting(chosenSaleOptionID, setResult) {
  saleOptionWaitingRegistry[chosenSaleOptionID] = setResult;
}
function getWaiting(sales, saleContext) {
  if (sales == null) {
    return null;
  }

  if (saleContext.waiting != null) {
    return saleContext.waiting;
  } // https://app.asana.com/0/86925821949642/160205241997173
  // It could be a bit weird for future, but design-side decision


  if (sales.waiting) {
    return sales.waiting;
  }

  var chosenSaleOption = getCurrentSaleOption(sales, saleContext); // options is SaleItem

  if (sales.id === chosenSaleOption.id) {
    return sales.waiting; // option is SaleOption
  } else {
    if (saleOptionWaitingRegistry[chosenSaleOption.id] != null) {
      return saleOptionWaitingRegistry[chosenSaleOption.id];
    } else if (chosenSaleOption.waiting != null) {
      return chosenSaleOption.waiting;
    }
  }
}

function fillArray(original,
/*sparse?ArrayToFill*/
filler) {
  var ol = original.length;
  var fl = filler.length;
  var sparseIdxs = []; // Find sparse indexes first.

  for (var j = 0; j < ol; j++) {
    if (!(j in original)) {
      sparseIdxs.push(j);
    }
  }

  for (var i = 0; i < fl; i++) {
    // if sparse indexes are all in (or nonexist), push leftovers to tail
    if (i > sparseIdxs.length - 1) {
      original.push(filler[i]);
    } else {
      original[sparseIdxs[i]] = filler[i];
    }
  }

  return original;
}

var tid;
var optionId;
var hotelImages;
var salesImages;
var thingImages;
function getSaleImages(thing, option, thumbnailsLimit) {
  if (thing.hotel_search != null) {
    if (tid !== thing.id) {
      // Caching structure
      if (thing.fromServer) {
        tid = thing.id;
      }

      hotelImages = thing.hotel_search.images.map(function (img) {
        return {
          src: img.url,
          thumbnail_src: img.thumbnailUrl,
          width: img.width,
          height: img.height
        };
      });
      hotelImages.unshift(thing.image_resized_max);
    }

    return hotelImages;
  } else if (thing.sales != null) {
    var images = [];
    fillArray(images, thing.images);

    if (option && option.images && option.images.length > 0) {
      fillArray(images, option.images);
    }

    salesImages = images;

    if (option) {
      optionId = option.id;
    }

    if (thing && thing.sales && thing.sales.video) {
      images.unshift(thing.sales.video);
    }

    return salesImages;

    if (tid !== thing.id) {
      // Caching structure
      if (thing.fromServer) {
        tid = thing.id;
      } // optionId = option ? option.id : null;
      // FIXME: do this somewhere else


      if (thing.image_resized_max == null) {
        if (thing.image.src) {
          thing.image_resized_max = {
            src: thing.image.src,
            width: thing.image.width,
            height: thing.image.height,
            thumbType: "thing"
          }; // FIXME: to prevent null referencing
        } else {
          thing.image_resized_max = {
            src: "/_ui/images/common/blank.gif",
            width: 1,
            height: 1,
            thumbType: "thing"
          }; // FIXME: to prevent null referencing
        }
      }

      var _images = [];

      if (thing.image_resized_max) {
        _images.push(thing.image_resized_max);
      }

      if (thing.images && thing.images[0]) {
        _images.push(thing.images[0]);
      } // set sale images


      if (thing && thing.sales && thing.sales.video) {
        var video = {
          src: thing.sales.video.thumbnail_url,
          thumbType: "video"
        };

        if (thing.sales.video.position > 0) {
          _images[thing.sales.video.position] = video;
        } else {
          // set video to first unless the position is set
          _images.unshift(video);
        }
      }

      if (thing.sales.images) {
        fillArray(_images, thing.sales.images);
      }

      salesImages = _images;
    }

    if (option && optionId !== option.id) {
      optionId = option.id;

      if (salesImages == null) {
        salesImages = [];
      }

      if (option.images && option.images.length > 0) {
        var _images2 = salesImages.filter(function (img) {
          return img.option_id == null;
        });

        fillArray(_images2, option.images);
        salesImages = _images2;
      }
    }

    return _.isNumber(thumbnailsLimit) && thumbnailsLimit > 0 ? salesImages.filter(function (image, idx) {
      return idx < thumbnailsLimit && image.src;
    }) : salesImages;
  } else {
    if (tid !== thing.id) {
      // Caching structure
      if (thing.fromServer) {
        tid = thing.id;
      }

      if (thing.image_resized_max) {
        thingImages = [thing.image_resized_max];
      } else if (thing.image) {
        thingImages = [thing.image];
      } else {
        thingImages = []; // || (option && optionId !== option.id)
      }
    }

    return thingImages;
  }
}
function isVanityQueriable(props, suppress) {
  var AC = props.AC,
      minPrice = props.minPrice,
      maxPrice = props.maxPrice,
      keyword = props.keyword;
  keyword = $.trim(keyword);
  AC = $.trim(AC);
  minPrice = minPrice != null ? minPrice : "0";
  minPrice = $.trim(minPrice).replace(",", "").replace("$", "");
  maxPrice = $.trim(maxPrice).replace(",", "").replace("$", "");
  var original_labels = fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.labels;

  if (AC !== "") {
    if (_.isNaN(parseInt(AC, 10)) || AC.length !== 3) {
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: {
          ok: "Close"
        }
      });
      !suppress && fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.alert("Invalid area code. Area code should be 3 digits.");
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: original_labels
      });
      return false;
    }
  }

  if (minPrice !== "") {
    if (_.isNaN(parseInt(minPrice, 10))) {
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: {
          ok: "Close"
        }
      });
      !suppress && fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.alert("Please check min price. It should be number.");
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: original_labels
      });
      return false;
    }

    if (parseInt(minPrice, 10) >= parseInt(maxPrice, 10)) {
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: {
          ok: "Close"
        }
      });
      !suppress && fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.alert("The max price number should be bigger than min price number.");
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: original_labels
      });
      return false;
    }
  }

  if (maxPrice !== "") {
    if (_.isNaN(parseInt(maxPrice, 10))) {
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: {
          ok: "Close"
        }
      });
      !suppress && fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.alert("Please check max price. It should be number.");
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: original_labels
      });
      return false;
    }
  }

  if (keyword !== "") {
    if (keyword.length < 4) {
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: {
          ok: "Close"
        }
      });
      !suppress && fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.alert("Please enter 4 or more characters.");
      fancyutils__WEBPACK_IMPORTED_MODULE_0__.alertify.set({
        labels: original_labels
      });
      return false;
    }
  }

  return true;
}
function getSafeNameProp(_ref2) {
  var emojified_name = _ref2.emojified_name,
      name = _ref2.name;

  if (emojified_name) {
    return {
      dangerouslySetInnerHTML: {
        __html: emojified_name
      }
    };
  } else {
    return {
      children: name
    };
  }
}
function isVideoUploadable(thing) {
  if (thing && thing.hotel_search || thing.metadata) {
    return true;
  } else {
    return false;
  }
}

function salesAvailable(thing) {
  if (!(0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(thing.sales)) {
    return thing.sales_available;
  }

  return false;
}

function getThingName(thing) {
  if (thing.type === "giftcard") {
    return gettext("Fancy Gift Card");
  } else if (salesAvailable(thing)) {
    return thing.sales.name;
  } else {
    return thing.name;
  }
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/AddlistPopup.js":
/*!***************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/AddlistPopup.js ***!
  \***************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ AddlistPopup
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");













var AddlistPopup = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(AddlistPopup, _Component);

  function AddlistPopup() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, AddlistPopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(AddlistPopup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      lists: [],
      listSearchQuery: '',
      listCreationQuery: '',
      listCreating: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleDialogOpen", function () {
      _this.setState({
        lists: [],
        listSearchQuery: '',
        listCreationQuery: ''
      });

      _this.drawUserList();

      setTimeout(function () {
        _this.listSearchInput.focus();
      }, 0);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListSearch", function (event) {
      var listSearchQuery = event.target.value;

      _this.setState({
        listSearchQuery: listSearchQuery
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListCreation", function (event) {
      event.preventDefault();
      if (_this.state.listCreating) return;

      if (event.type === 'keyup' && event.which !== fancyutils__WEBPACK_IMPORTED_MODULE_10__.KEYS.ENTER) {
        return;
      }

      var listCreationQuery = $.trim(_this.state.listCreationQuery);
      var objectId = _this.props.objectId;

      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.isEmpty)(listCreationQuery)) {
        return;
      }

      _this.setState({
        listCreating: true
      }); // save new list


      updateList({
        objectId: objectId,
        createList: listCreationQuery,
        callback: function callback(success, updated) {
          if (success) {
            var lists = _this.state.lists;
            (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)('Create New List', {
              'thing id': objectId,
              'list name': listCreationQuery,
              'via': 'thing detail'
            });

            _this.setState({
              listCreationQuery: '',
              listCreating: false,
              lists: [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(updated), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(lists))
            });
          }
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListItemToggle", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var targ = event.currentTarget;
      var objectId = _this.props.objectId;
      var lists = _this.state.lists;
      var selectedListId = Number(targ.getAttribute('data-listid'));
      var theList = lists.filter(function (list) {
        return list.id === selectedListId;
      })[0];
      var prevAdded = theList.added;
      theList.added = !theList.added;
      var eventName = theList.added ? "Add to List" : "Remove from List";

      _this.setState({
        lists: lists
      });

      var callback = function callback(success, updated) {
        var lists = _this.state.lists;

        if (success) {} else {
          var _theList = lists.filter(function (list) {
            return list.id === selectedListId;
          })[0];
          _theList.added = prevAdded;
        }

        _this.setState({
          lists: lists
        });

        (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)(eventName, {
          'thing id': objectId,
          'list name': theList.name,
          'list id': theList.id,
          'via': 'thing detail'
        });
      };

      var update = {
        objectId: objectId,
        callback: callback
      };
      if (theList.added) update['checked'] = [theList.id];else update['unchecked'] = [theList.id];
      updateList(update);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCreateListQueryChange", function (event) {
      _this.setState({
        listCreationQuery: event.target.value
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(AddlistPopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $.dialog(AddlistPopup.popupName).$obj.on('open', this.handleDialogOpen);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      $.dialog(AddlistPopup.popupName).center();
    }
  }, {
    key: "drawUserList",
    value: function drawUserList() {
      var _this2 = this;

      var objectId = this.props.objectId;
      getListCheckbox({
        objectId: objectId,
        callback: function callback(res) {
          _this2.setState(res);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var objectId = this.props.objectId;
      var _this$state = this.state,
          lists = _this$state.lists,
          listSearchQuery = _this$state.listSearchQuery,
          listCreationQuery = _this$state.listCreationQuery,
          listCreating = _this$state.listCreating;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(react__WEBPACK_IMPORTED_MODULE_8__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("p", {
        className: "ltit"
      }, "Add to collections"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("fieldset", {
        className: "search"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "text",
        placeholder: "Search",
        className: "text",
        value: listSearchQuery,
        ref: function ref(element) {
          _this3.listSearchInput = element;
        },
        onChange: this.handleListSearch
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("ul", {
        ref: function ref(el) {
          _this3.lists = el;
        }
      }, lists && lists.map(function (list, idx) {
        var term = $.trim(listSearchQuery).toLowerCase();
        var style;

        if (_.isString(term) && term.length > 0) {
          style = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(list.name.toLowerCase().indexOf(term.toLowerCase()) === -1);
        }

        var ident = "".concat(objectId, "-").concat(list.id);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", {
          key: idx,
          style: style,
          className: classnames__WEBPACK_IMPORTED_MODULE_9___default()({
            "added": list.added
          })
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", null, list.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
          "data-listid": list.id,
          onClick: _this3.handleListItemToggle,
          className: "btns-blue-embo"
        }, list.added ? "Remove" : "Add"));
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("fieldset", {
        className: "create"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "text",
        placeholder: "Create new collection",
        ref: function ref(element) {
          _this3.quickCreateList = element;
        },
        onKeyUp: this.handleListCreation,
        onChange: this.handleCreateListQueryChange,
        value: listCreationQuery
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("btn-create", {
          "loading": listCreating
        }),
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf($.trim(listCreationQuery).length == 0),
        onClick: this.handleListCreation
      }, gettext("Create"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return AddlistPopup;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(AddlistPopup, "popupName", 'add-list');



function getListCheckbox(_ref) {
  var objectId = _ref.objectId,
      callback = _ref.callback;
  $.get('/get_list_checkbox.json', {
    tid: objectId
  }).done(function (resp) {
    if (resp.status_code == 0) {
      fancyutils__WEBPACK_IMPORTED_MODULE_10__.alertify.alert(resp.message || "Please try again later.");
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.closePopup)(AddlistPopup.popupName);
    }

    callback && callback({
      lists: resp.lists
    });
  }).error(function (err) {
    fancyutils__WEBPACK_IMPORTED_MODULE_10__.alertify.alert("Please try again later.");
    console.warn(err);
    (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.closePopup)(AddlistPopup.popupName);
  });
}

function updateList(_ref2) {
  var objectId = _ref2.objectId,
      checked = _ref2.checked,
      unchecked = _ref2.unchecked,
      createList = _ref2.createList,
      callback = _ref2.callback;
  var payload = {
    tid: objectId
  };
  if (checked) payload['add_list_ids'] = checked.join(',');
  if (unchecked) payload['remove_list_ids'] = unchecked.join(',');
  if (createList) payload['new_list'] = createList;
  $.post('/update_list_checkbox.json', payload).done(function (resp) {
    if (resp.status_code == 0) {
      fancyutils__WEBPACK_IMPORTED_MODULE_10__.alertify.alert(resp.message || "Please try again later.");
      callback(false, null);
    } else {
      callback(true, resp.lists);
    }
  }).error(function (err) {
    console.warn(err);
    fancyutils__WEBPACK_IMPORTED_MODULE_10__.alertify.alert("Please try again later.");
    callback(false, []);
  });
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/AdminPopup.js":
/*!*************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/AdminPopup.js ***!
  \*************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ AdminPopup
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");












var AdminPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(AdminPopup, _React$Component);

  function AdminPopup() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, AdminPopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(AdminPopup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "state", {
      show_on_homepage: null,
      date_published: null,
      exclude_from_popular: false,
      show_in_search: true,
      optionSaving: false,
      ownerSaving: false,
      mergeSaving: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleSaveOptions", function () {
      var thing = _this.props.thing;
      var _this$state = _this.state,
          show_on_homepage = _this$state.show_on_homepage,
          date_published = _this$state.date_published,
          exclude_from_popular = _this$state.exclude_from_popular,
          show_in_search = _this$state.show_in_search,
          optionSaving = _this$state.optionSaving;
      if (optionSaving) return false;
      var payload = {
        thing_id: thing.id,
        show_on_homepage: show_on_homepage,
        exclude_from_popular: exclude_from_popular,
        show_in_search: show_in_search
      };

      if (show_on_homepage) {
        var inputDate = new Date(date_published);

        if (isNaN(inputDate)) {
          alert("invalid date - must be in format of 2020-01-01 10:10:10");
          return false;
        }

        payload['date_published'] = inputDate.toISOString().replace(/T/, " ").split(".")[0];
      }

      _this.setState({
        optionSaving: true
      });

      $.post('/manage-newthing.json', payload).then(function (json) {
        if (json.status_code == 1) {
          Object.assign(thing, payload);
          alert("Updated!");
        } else {
          alert(json.message || "Failed to save the changes");
        }

        _this.setState({
          optionSaving: false
        });
      }).fail(function () {
        alert("Something went wrong!");

        _this.setState({
          optionSaving: false
        });
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleChangeOwner", function () {
      var thing = _this.props.thing;
      if (_this.state.ownerSaving) return false;
      if (_this.changeOwnerEl == null) return false;

      var new_owner = _this.changeOwnerEl.value.trim();

      if (new_owner.length == 0) {
        alert("Please enter a username.");
        return false;
      }

      if (new_owner.toLowerCase() == thing.thing_owner.username.toLowerCase()) {
        alert("The thing is already owned by the user.");
        return false;
      }

      if (window.confirm("Do you want to change the current thing's owner to ".concat(new_owner, "?"))) {
        _this.setState({
          ownerSaving: true
        });

        $.ajax({
          type: "post",
          url: "/change_new_thing_owner.xml",
          data: {
            new_owner_name: new_owner,
            thing_id: thing.id,
            new_thing_id: thing.ntid,
            old_user_id: thing.thing_owner.id
          },
          dataType: "xml"
        }).done(function (xml) {
          if (fancyutils__WEBPACK_IMPORTED_MODULE_10__.xmlUtil.isSuccess(xml)) {
            alert("Done!");
            location.reload();
          } else if (fancyutils__WEBPACK_IMPORTED_MODULE_10__.xmlUtil.isFail(xml)) {
            alert($(xml).find("message").text());
          }
        }).fail(function () {
          alert("There was an error.");
        }).always(function () {
          _this.setState({
            ownerSaving: false
          });
        });
      }

      return false;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleMergeThings", function () {});

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(AdminPopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var that = this;
      $.dialog(AdminPopup.popupName).$obj.on('open', function () {
        var _that$props$thing = that.props.thing,
            show_on_homepage = _that$props$thing.show_on_homepage,
            date_published = _that$props$thing.date_published,
            exclude_from_popular = _that$props$thing.exclude_from_popular,
            show_in_search = _that$props$thing.show_in_search;
        that.setState({
          show_on_homepage: show_on_homepage,
          date_published: date_published,
          exclude_from_popular: exclude_from_popular,
          show_in_search: show_in_search
        });
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      $.dialog(AdminPopup.popupName).center();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          thing = _this$props.thing,
          sales = _this$props.thing.sales;
      var _this$state2 = this.state,
          show_on_homepage = _this$state2.show_on_homepage,
          date_published = _this$state2.date_published,
          exclude_from_popular = _this$state2.exclude_from_popular,
          show_in_search = _this$state2.show_in_search,
          optionSaving = _this$state2.optionSaving,
          ownerSaving = _this$state2.ownerSaving,
          mergeSaving = _this$state2.mergeSaving;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, thing.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "thing-admin-body"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "thing-info"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, "Sale ID"), " ", sales.id), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, "Thing ID"), " ", thing.id), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, "Thing Owner"), " ", thing.thing_owner.username), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
        className: "buttons"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: "btns-blue-embo",
        href: "/merchant/products/".concat(sales.id),
        target: "_blank"
      }, "Edit Sale"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: "btns-gray-embo",
        href: "/admin/view-sale-orders-by-thing-id?thing_id=".concat(thing.id),
        target: "_blank"
      }, "View Orders"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: "btns-gray-embo",
        href: "/admin/view-users-by-cart-item?sale_id=".concat(sales.id),
        target: "_blank"
      }, "View Carts"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "thing-options"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "checkbox",
        name: "show-on-homepage",
        checked: !!show_on_homepage,
        onChange: function onChange(event) {
          return _this2.setState({
            show_on_homepage: event.target.checked
          });
        }
      }), " Show on Homepage"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        className: "text",
        type: "text",
        name: "date-published",
        placeholder: "2020-01-02 10:20:30",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_8__.Display.NoneIf(!show_on_homepage),
        value: date_published || '',
        onChange: function onChange(event) {
          _this2.setState({
            date_published: event.target.value
          });
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "checkbox",
        name: "exclude-from-popular",
        checked: !!exclude_from_popular,
        onChange: function onChange(event) {
          return _this2.setState({
            exclude_from_popular: event.target.checked
          });
        }
      }), " Exclude from Popular")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "checkbox",
        name: "show-in-search",
        checked: !!show_in_search,
        onChange: function onChange(event) {
          return _this2.setState({
            show_in_search: event.target.checked
          });
        }
      }), " Show in Search")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("btns-blue-embo", {
          "loading": optionSaving
        }),
        onClick: this.handleSaveOptions
      }, "Save Changes"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "thing-actions"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, "Change Owner"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "text",
        name: "change_owner",
        placeholder: "Enter new username",
        ref: function ref(el) {
          _this2.changeOwnerEl = el;
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("btns-blue-embo", {
          "loading": ownerSaving
        }),
        onClick: this.handleChangeOwner
      }, "Change")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return AdminPopup;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(AdminPopup, "popupName", 'thing-admin');



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/SimpleSharePopup.js":
/*!*******************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/SimpleSharePopup.js ***!
  \*******************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ SimpleSharePopup
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");











var SimpleSharePopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(SimpleSharePopup, _React$Component);

  function SimpleSharePopup(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, SimpleSharePopup);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SimpleSharePopup).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleCancelClick", function (event) {
      event.preventDefault();
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.closePopup)(SimpleSharePopup.popupName);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleCopyLink", function (event) {
      console.log('handleCopyLink');
      var shareUrl = _this.state.shareUrl;
      console.log('handleCopyLink ' + shareUrl);
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.copyToClipboard)(shareUrl);

      _this.setState({
        urlCopied: true
      });

      setTimeout(function () {
        _this.setState({
          urlCopied: false
        });
      }, 2000);
    });

    var thing = props.thing,
        viewer = props.viewer;
    var url = "https://fancy.com".concat(thing.url);

    if (viewer && viewer.username) {
      var connector = ~url.indexOf('?') ? '&' : '?';
      url = "".concat(url).concat(connector, "ref=").concat(viewer.username);
    }

    console.log(url);
    _this.state = {
      shareUrl: url,
      urlCopied: false
    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(SimpleSharePopup, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      $.dialog(SimpleSharePopup.popupName).center();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          thing = _this$props.thing,
          viewer = _this$props.viewer;
      var _this$state = this.state,
          shareUrl = _this$state.shareUrl,
          urlCopied = _this$state.urlCopied;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, "Share"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "#",
        className: "btn-copy-link link",
        onClick: this.handleCopyLink
      }, urlCopied ? "Copied to clipboard" : "Copy link")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "http://pinterest.com/pin/create/link/?url=".concat(encodeURIComponent(shareUrl), "&media=").concat(thing.images ? encodeURIComponent(thing.images[0].image_url) : "", "&description=").concat(encodeURIComponent(thing.name)),
        target: "_blank",
        className: "pin"
      }, "Share to Pinterest")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "mailto:?body=Check%20out%20".concat(encodeURIComponent(thing.name), "%20on%20Fancy!%0A%0A").concat(encodeURIComponent(shareUrl), "&subject=").concat(encodeURIComponent(thing.name), "%20on%20Fancy"),
        target: "_blank",
        className: "email"
      }, "Share via email"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return SimpleSharePopup;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(SimpleSharePopup, "popupName", 'minimum-share');



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx":
/*!*************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx ***!
  \*************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getFancyContextDefaultValue [provided] [no usage info] [missing usage info prevents renaming] */
/*! export useFancy [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFancyContextDefaultValue": () => /* binding */ getFancyContextDefaultValue,
/* harmony export */   "useFancy": () => /* binding */ useFancy,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function getFancyContextDefaultValue() {
  return {
    appContext: {},
    thing: {},
    followContext: {},
    fancyContext: {},
    slideContext: {},
    saleContext: {},
    dispatch: function dispatch() {}
  };
} // @ts-ignore

var FancyContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(getFancyContextDefaultValue());
var useFancy = function useFancy() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(FancyContext);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FancyContext);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/ActionButtons.tsx":
/*!********************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/ActionButtons.tsx ***!
  \********************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ActionButtons
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");
/* harmony import */ var _popup_AdminPopup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../popup/AdminPopup */ "./_static/modules/ui/overlay-thing/components/popup/AdminPopup.js");
/* harmony import */ var _popup_SimpleSharePopup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../popup/SimpleSharePopup */ "./_static/modules/ui/overlay-thing/components/popup/SimpleSharePopup.js");
/* harmony import */ var _popup_AddlistPopup__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../popup/AddlistPopup */ "./_static/modules/ui/overlay-thing/components/popup/AddlistPopup.js");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");











function Favorite() {
  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_5__.useFancy)(),
      appContext = _useFancy.appContext,
      thing = _useFancy.thing,
      fancyContext = _useFancy.fancyContext;

  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();

  var handleClick = function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('favortie');

    if (!appContext.loggedIn) {
      window.require_login(null, "fancy_thing", thing.id);
      return;
    }

    if (fancyContext.loading) {
      return;
    }

    dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_9__.toggleFancy)(thing.id));

    if (!fancyContext.fancyd) {
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.MP)("Fancy", {
        thing_id: thing.id
      });

      try {
        window.crdl('event', 'favorite_item', (0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_9__.getCordialProperties)(thing));
      } catch (e) {}
    } else {
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.MP)("Unfancy", {
        thing_id: thing.id
      });
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("button button-static fancy _count", {
      fancyd: fancyContext.fancyd
    }),
    onClick: handleClick
  }, "Favorite");
}

function ActionButtons() {
  var _useFancy2 = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_5__.useFancy)(),
      _useFancy2$appContext = _useFancy2.appContext,
      viewer = _useFancy2$appContext.viewer,
      loggedIn = _useFancy2$appContext.loggedIn,
      thing = _useFancy2.thing,
      objectId = _useFancy2.thing.id,
      fancyContext = _useFancy2.fancyContext;

  var msg;

  if (thing.fancyd_friends) {
    var cnt = fancyContext.fancyd_count - 1;

    if (cnt > 0) {
      msg = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "Favorited by ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        href: thing.fancyd_friends[0].url
      }, thing.fancyd_friends[0].full_name), " and ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", null, cnt, " other", cnt > 1 ? "s" : ""));
    } else {
      msg = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "Favorited by ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        href: thing.fancyd_friends[0].url
      }, thing.fancyd_friends[0].full_name));
    }
  } else {
    msg = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fancyContext.fancyd_count, " people favorited");
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    className: "_fancyd fancyd_user",
    onClick: function onClick(e) {
      if (e.target.tagName === 'A') {
        return;
      }

      (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.renderPopup)(common_components__WEBPACK_IMPORTED_MODULE_4__.FancydByPopupV4, {
        objectId: objectId,
        objectType: 'thing',
        loggedIn: fancyutils__WEBPACK_IMPORTED_MODULE_2__.FancyUser.loggedIn,
        viewerId: fancyutils__WEBPACK_IMPORTED_MODULE_2__.FancyUser.id
      });
    }
  }, msg), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    onClick: function onClick(event) {
      event.preventDefault();

      if (!loggedIn) {
        window.require_login();
        return;
      }

      (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.renderPopup)(_popup_AddlistPopup__WEBPACK_IMPORTED_MODULE_8__.default, {
        objectId: objectId
      });
    },
    className: "add-list"
  }, "Add to List"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "figure-button action-button-v2"
  }, viewer.is_admin_any && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "edit",
    onClick: function onClick(event) {
      event.preventDefault();
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.renderPopup)(_popup_AdminPopup__WEBPACK_IMPORTED_MODULE_6__.default, {
        viewer: viewer,
        thing: thing
      });
    }
  }, "Edit"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Favorite, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "btn-share",
    onClick: function onClick(event) {
      event.preventDefault();
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.renderPopup)(_popup_SimpleSharePopup__WEBPACK_IMPORTED_MODULE_7__.default, {
        viewer: viewer,
        thing: thing
      });
    }
  }, "Share")));
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/Image/index.tsx":
/*!******************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/Image/index.tsx ***!
  \******************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread */ "./node_modules/@babel/runtime/helpers/objectSpread.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! swiper/react */ "./node_modules/swiper/esm/react/swiper-slide.js");
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! swiper/react */ "./node_modules/swiper/esm/react/swiper.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/esm/components/thumbs/thumbs.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/esm/components/zoom/zoom.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/esm/components/core/core-class.js");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");
/* harmony import */ var _ActionButtons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ActionButtons */ "./_static/modules/ui/overlay-thing/components/v2/Thing/ActionButtons.tsx");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../map */ "./_static/modules/ui/overlay-thing/components/map.ts");
/* harmony import */ var _action_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../action/actions */ "./_static/modules/ui/overlay-thing/action/actions.js");
/* harmony import */ var _zoom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./zoom */ "./_static/modules/ui/overlay-thing/components/v2/Thing/Image/zoom.ts");













var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
var SwiperAddons = [swiper__WEBPACK_IMPORTED_MODULE_11__.default];

if (isTouchDevice) {
  SwiperAddons.push(swiper__WEBPACK_IMPORTED_MODULE_12__.default);
}

swiper__WEBPACK_IMPORTED_MODULE_13__.default.use(SwiperAddons);
var placeholderImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
var PER_PAGE = 5;

var preloadImage = function preloadImage(src) {
  return new Promise(function (r) {
    var image = new window.Image();
    image.onload = r;
    image.onerror = r;
    image.src = src;
  });
};

var ImageSlide = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.memo)(function (_ref) {
  var image = _ref.image,
      i = _ref.i,
      setSlideLocked = _ref.setSlideLocked,
      isActive = _ref.isActive;

  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_6__.useFancy)(),
      thing = _useFancy.thing,
      thumbnailIndex = _useFancy.slideContext.thumbnailIndex;

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState, 2),
      isZoomActive = _useState2[0],
      setZoomActive = _useState2[1];

  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(fancymixin__WEBPACK_IMPORTED_MODULE_5__.Display.None),
      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState3, 2),
      zoomImageStyle = _useState4[0],
      setZoomImageStyle = _useState4[1];

  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(""),
      _useState6 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState5, 2),
      zoomImageCacheKey = _useState6[0],
      setZoomImageCacheKey = _useState6[1];

  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false),
      _useState8 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState7, 2),
      zoomImageLoaded = _useState8[0],
      setZoomImageLoaded = _useState8[1];

  var isVideo = !!image.h264_1000k_url;
  var isMagnifyingGlassZoomable = !isVideo && !isTouchDevice;
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    if (!zoomImageCacheKey && isZoomActive) {
      preloadImage(image.large_image_url).then(function () {
        setZoomImageCacheKey(image.large_image_url);
        setZoomImageLoaded(true);
      });
    }

    if (zoomImageCacheKey !== "" && image.large_image_url !== zoomImageCacheKey) {
      setZoomImageCacheKey("");
      setZoomImageLoaded(false);
    }
  }, [image.large_image_url, isZoomActive, zoomImageCacheKey]);

  var handleMouseEvent = function handleMouseEvent(_ref2) {
    var pageX = _ref2.pageX,
        pageY = _ref2.pageY;

    if (!isMagnifyingGlassZoomable) {
      return;
    }

    if (isZoomActive) {
      var nextZoomImageStyle = (0,_zoom__WEBPACK_IMPORTED_MODULE_10__.getNextZoomImageStyle)(image, pageX, pageY);
      setZoomImageStyle(nextZoomImageStyle);
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_14__.SwiperSlide, {
    zoom: isMagnifyingGlassZoomable,
    key: i,
    className: classnames__WEBPACK_IMPORTED_MODULE_3___default()({
      "video-slide": isVideo,
      startZoom: isZoomActive,
      zoomShow: true,
      "active-slide": isActive,
      loading: thing.loading
    }),
    onClick: function onClick(_ref3) {
      var pageX = _ref3.pageX,
          pageY = _ref3.pageY;

      if (!isMagnifyingGlassZoomable) {
        return;
      }

      var nextZoomImageStyle = (0,_zoom__WEBPACK_IMPORTED_MODULE_10__.getNextZoomImageStyle)(image, pageX, pageY);
      setZoomImageStyle(nextZoomImageStyle);
      setZoomActive(!isZoomActive);
      setSlideLocked(!isZoomActive);
    },
    onMouseMove: handleMouseEvent
  }, isVideo ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(common_components__WEBPACK_IMPORTED_MODULE_4__.Video, {
    object: image,
    display: true,
    playing: thumbnailIndex == i,
    lastFullyRenderedObjectID: thing.id,
    allow: {
      fullScreen: true
    }
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("img", {
    className: "swiper-lazy",
    src: image.image_url,
    "data-src": image.image_url,
    title: !isTouchDevice ? "Double click to zoom-in" : undefined,
    alt: thing.name,
    style: {
      cursor: "zoom-in"
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("em", {
    className: "zoomImage",
    onClick: function onClick() {
      setZoomActive(false);
      setSlideLocked(false);
    },
    style: _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, (0,_zoom__WEBPACK_IMPORTED_MODULE_10__.getZoomImageStyle)(image, isZoomActive, zoomImageStyle), {
      backgroundColor: "white",
      backgroundImage: "url(".concat(zoomImageLoaded ? image.large_image_url : image.image_url, ")")
    })
  }), isTouchDevice && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
    className: "swiper-lazy-preloader"
  })));
}, function (prevProps, nextProps) {
  return prevProps.image.image_url === nextProps.image.image_url && prevProps.isActive === nextProps.isActive;
});
ImageSlide.displayName = "SwiperSlide"; // This is important to make swiper to acknowledge it's actually slide, not some random components

var Image = function Image(_ref4) {
  var _ref4$imageOnly = _ref4.imageOnly,
      imageOnly = _ref4$imageOnly === void 0 ? false : _ref4$imageOnly,
      _ref4$galleryThumbsDi = _ref4.galleryThumbsDirection,
      galleryThumbsDirection = _ref4$galleryThumbsDi === void 0 ? "vertical" : _ref4$galleryThumbsDi,
      _ref4$thumbsPerView = _ref4.thumbsPerView,
      thumbsPerView = _ref4$thumbsPerView === void 0 ? PER_PAGE : _ref4$thumbsPerView;
  var fancyProps = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_6__.useFancy)();
  var thing = fancyProps.thing,
      saleContext = fancyProps.saleContext,
      thumbnailIndex = fancyProps.slideContext.thumbnailIndex;
  var swiperRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  var swipeThumbsRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);

  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(0),
      _useState10 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState9, 2),
      thumbIndex = _useState10[0],
      setThumbIndex = _useState10[1];

  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false),
      _useState12 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState11, 2),
      slideLocked = _useState12[0],
      setSlideLocked = _useState12[1];

  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null),
      _useState14 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState13, 2),
      swiper = _useState14[0],
      setSwiper = _useState14[1];

  var option = (0,_map__WEBPACK_IMPORTED_MODULE_8__.getCurrentSaleOption)(thing.sales, saleContext, true);
  var images = (0,_map__WEBPACK_IMPORTED_MODULE_8__.getSaleImages)(thing, option);
  var lastThumbIndex = images.length - thumbsPerView;
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    if (!swiper) {
      return;
    }

    if (thumbnailIndex != swiper.activeIndex) {
      swiper.slideTo(thumbnailIndex);
    }

    if (!imageOnly && swipeThumbsRef.current) {
      var thumbSwiper = swipeThumbsRef.current.swiper;
      if (!thumbSwiper.slides[thumbnailIndex].classList.contains("swiper-slide-visible")) thumbSwiper.slideTo(Math.min(thumbnailIndex, lastThumbIndex));
    }
  }, [thumbnailIndex, swiper, imageOnly]);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    if (!swipeThumbsRef.current) {
      return;
    }

    var swiper = swipeThumbsRef.current.swiper;

    if (thumbIndex != swiper.activeIndex) {
      swiper.slideTo(thumbIndex);
    }
  }, [thumbIndex, imageOnly]);
  var prevEl = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
    className: "prev ".concat(thumbIndex > 0 ? "disabled" : ""),
    style: {
      opacity: thumbIndex > 0 ? undefined : 0.3
    },
    onClick: function onClick() {
      return setThumbIndex(Math.max(0, thumbIndex - thumbsPerView));
    }
  });
  var nextEl = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
    className: "next ".concat(thumbIndex < lastThumbIndex ? "disabled" : ""),
    style: {
      opacity: thumbIndex < lastThumbIndex ? undefined : 0.3
    },
    onClick: function onClick() {
      setThumbIndex(Math.min(thumbIndex + thumbsPerView, lastThumbIndex));
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
    className: "figure-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_15__.Swiper, {
    ref: swiperRef,
    onSlideChange: function onSlideChange() {
      var swiper = swiperRef.current?.swiper;

      if (swiper) {
        fancyProps.dispatch((0,_action_actions__WEBPACK_IMPORTED_MODULE_9__.setThumbnailIndex)(swiper.activeIndex));
        setThumbIndex(swiper.activeIndex);
      }
    },
    preloadImages: false,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 0
    },
    zoom: isTouchDevice ? {
      maxRatio: 2
    } : undefined,
    allowSlidePrev: !slideLocked,
    allowSlideNext: !slideLocked,
    onZoomChange: function onZoomChange(_, scale) {
      if (scale > 1) {
        setSlideLocked(true);
      } else {
        setSlideLocked(false);
      }
    },
    onSwiper: function onSwiper(swiper) {
      setSwiper(swiper);
    },
    className: "gallery-top"
  }, images.map(function (image, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(ImageSlide, {
      key: i,
      image: image,
      i: i,
      setSlideLocked: setSlideLocked,
      isActive: swiper?.activeIndex === i
    });
  }), !imageOnly && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ActionButtons__WEBPACK_IMPORTED_MODULE_7__.default, null)), !imageOnly && prevEl, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_15__.Swiper, {
    className: "gallery-thumbs",
    ref: swipeThumbsRef,
    onClick: function onClick() {
      if (!swipeThumbsRef.current) {
        return;
      }

      fancyProps.dispatch((0,_action_actions__WEBPACK_IMPORTED_MODULE_9__.setThumbnailIndex)(swipeThumbsRef.current.swiper.clickedIndex));
    },
    direction: galleryThumbsDirection,
    spaceBetween: 16,
    slidesPerView: thumbsPerView,
    watchSlidesVisibility: true,
    height: 80
  }, images.map(function (image, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_14__.SwiperSlide, {
      key: i,
      className: classnames__WEBPACK_IMPORTED_MODULE_3___default()({
        "video-thumbnail": image.h264_1000k_url,
        selected: i == thumbnailIndex
      })
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("img", {
      height: "80",
      src: placeholderImage,
      style: {
        backgroundImage: "url(".concat(image.thumbnail_url, ")")
      }
    }));
  }), imageOnly && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, prevEl, nextEl)), !imageOnly && nextEl);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Image);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/Image/zoom.ts":
/*!****************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/Image/zoom.ts ***!
  \****************************************************************************/
/*! namespace exports */
/*! export getNextZoomImageStyle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getZoomImageStyle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isZoomable [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getNextZoomImageStyle": () => /* binding */ getNextZoomImageStyle,
/* harmony export */   "isZoomable": () => /* binding */ isZoomable,
/* harmony export */   "getZoomImageStyle": () => /* binding */ getZoomImageStyle
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread */ "./node_modules/@babel/runtime/helpers/objectSpread.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");



// TODO: cache per (thing id + image index)
var zoomBoxMaximumSize = 240;
var zoomScale = 1.5;

var getBoundarySize = function getBoundarySize() {
  var $el = $(".thing-detail-container .figure-section .swiper-container.gallery-top .active-slide").eq(0);

  if ($el.length !== 1) {
    window.DEBUG && console.warn('getBoundarySize(): warning: $el.length is ', $el.length);
  }

  return {
    $el: $el,
    width: $el.width(),
    height: $el.height()
  };
};

var getZoomBoxSize = function getZoomBoxSize(bs) {
  return Math.min(bs.width / 3, zoomBoxMaximumSize);
};

var getZoomMargin = function getZoomMargin(bs) {
  return (getZoomBoxSize(bs) - 4) / 2;
};

var zidCac = {};

var getZoomImageDimension = function getZoomImageDimension(img) {
  var bs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getBoundarySize();

  if (zidCac[img.image_url]) {
    return zidCac[img.image_url];
  }

  var zoomMargin = getZoomMargin(bs); // const imageSize = calculateImageSize(img);

  var ret = {
    width: bs.width * zoomScale
    /* * (imageSize.larger === "height" ? imageSize.proportion : 1) */
    + zoomMargin,
    height: bs.height * zoomScale + zoomMargin
    /* ((b.height * imageSize.height) / imageSize.width) *
            (imageSize.larger === "width" ? imageSize.proportion : 1) *
            zoomScale +
        zoomMargin ,*/

  };
  zidCac[img.image_url] = ret;
  return ret;
};

var getImageMeta = function getImageMeta(bs) {
  var width, height, marginHoriz, marginVert;
  var $fig = $(".thing-detail-container .figure-section .swiper-container.gallery-top img:eq(0)");
  width = $fig.width();
  height = $fig.height();
  marginHoriz = 0;

  if (width > height) {
    marginHoriz = 0;
    marginVert = (bs.height - height) / 2;
  } else {
    marginHoriz = (bs.width - width) / 2;
    marginVert = 0;
  }

  return {
    width: width,
    height: height,
    marginHoriz: marginHoriz,
    marginVert: marginVert
  };
};

var getNextZoomImageStyle = function getNextZoomImageStyle(img, pageX, pageY) {
  var bs = getBoundarySize();
  var $wrapper = bs.$el;

  if (!$wrapper.length) {
    return fancymixin__WEBPACK_IMPORTED_MODULE_2__.Display.None;
  }

  var boundaryWidth = bs.width;
  var boundaryHeight = bs.height;
  var meta = getImageMeta(bs);
  var offset = $wrapper.offset();
  var left = pageX - offset.left;
  var top = pageY - offset.top;
  var topPosition = top - (boundaryHeight - meta.height) / 2;
  var showZoomImage = left > 0 && topPosition > 0 && topPosition < meta.height;
  var zoomBoxSize = getZoomBoxSize(bs);
  var zoomMargin = getZoomMargin(bs);

  if (showZoomImage) {
    var zd = getZoomImageDimension(img, bs);
    var zoomImageContainerX = (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.minmax)(left - zoomMargin, meta.marginHoriz, meta.marginHoriz + meta.width - zoomBoxSize);
    var zoomImageContainerY = (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.minmax)(top - zoomMargin, meta.marginVert, meta.marginVert + meta.height - zoomBoxSize);
    var backgroundLeft = zd.width * left / boundaryWidth - zoomMargin;
    var backgroundTop = zd.height * top / boundaryHeight - zoomMargin;
    var bgPosX = -(0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.minmax)(backgroundLeft, 0, zd.width - zoomBoxSize);
    var bgPosY = -(0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.minmax)(backgroundTop, 0, zd.height - zoomBoxSize);
    return {
      left: 0,
      top: 0,
      width: "".concat(zoomBoxSize, "px"),
      height: "".concat(zoomBoxSize, "px"),
      transform: "translate(".concat(zoomImageContainerX, "px, ").concat(zoomImageContainerY, "px)"),
      backgroundPosition: "".concat(bgPosX, "px ").concat(bgPosY, "px"),
      display: "inline"
    };
  } else {
    return fancymixin__WEBPACK_IMPORTED_MODULE_2__.Display.None;
  }
};
var RESIZED_SIZE = 1280;

var calculateImageSize = function calculateImageSize(img) {
  var size = Math.max(img.width, img.height);

  if (size < RESIZED_SIZE) {
    var smallerSize = Math.min(img.width, img.height);
    return {
      width: img.width,
      height: img.height,
      proportion: size / smallerSize,
      larger: img.width > img.height ? "width" : "height"
    };
  } else {
    if (img.width > img.height) {
      var proportion = RESIZED_SIZE / img.width;
      return {
        width: RESIZED_SIZE,
        height: img.height / proportion,
        proportion: proportion,
        larger: "width"
      };
    } else {
      var _proportion = RESIZED_SIZE / img.height;

      return {
        width: img.width / _proportion,
        height: RESIZED_SIZE,
        proportion: _proportion,
        larger: "height"
      };
    }
  }
};

var isZoomable = function isZoomable(img) {
  var imageSize = calculateImageSize(img);
  var boundarySize = getBoundarySize();
  return imageSize.width > boundarySize.width * zoomScale || imageSize.height > boundarySize.height * zoomScale;
};
var getZoomImageStyle = function getZoomImageStyle(img, isZoomActive, currentZoomImageStyle) {
  if (isZoomActive) {
    var zd = getZoomImageDimension(img);

    var ret = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, currentZoomImageStyle, {
      backgroundSize: "".concat(zd.width, "px ").concat(zd.height, "px")
    });

    return ret;
  } else {
    return fancymixin__WEBPACK_IMPORTED_MODULE_2__.Display.None;
  }
};

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/ApplePayButton.tsx":
/*!******************************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/ApplePayButton.tsx ***!
  \******************************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../map */ "./_static/modules/ui/overlay-thing/components/map.ts");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");




var ApplePayButton = function ApplePayButton() {
  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_2__.useFancy)(),
      applePayTest = _useFancy.appContext.applePayTest,
      thing = _useFancy.thing,
      sales = _useFancy.thing.sales,
      _useFancy$saleContext = _useFancy.saleContext,
      saleOptionID = _useFancy$saleContext.saleOptionID,
      selectedQuantity = _useFancy$saleContext.selectedQuantity,
      price = _useFancy$saleContext.price;

  var handleApplePayCheckout = function handleApplePayCheckout(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!saleOptionID || window.FancyApplePay.clicked) {
      return;
    }

    window.FancyApplePay.clicked = true;
    var salesOptionsAvailable = (0,_map__WEBPACK_IMPORTED_MODULE_1__.isSalesOptionsAvailable)(sales);
    var title = thing.name;
    var country = sales.seller.country;
    var sale_item_id = sales.id;
    var seller_id = sales.seller.id;
    var quantity = selectedQuantity;
    var option_id = null;
    var option = null;

    if (salesOptionsAvailable) {
      option_id = parseInt(saleOptionID, 10) || null; // ? should be same value with option except get casted

      option = saleOptionID;
    }

    try {
      window.FancyApplePay.requestPurchase("Dynamic", {
        sale_item_id: sale_item_id,
        seller_id: seller_id,
        option_id: option_id,
        quantity: quantity,
        price: price,
        title: title,
        option: option,
        country: country,
        testmode: applePayTest
      });
    } catch (err) {
      window.DEBUG && console.trace(err);
      alert(err);
      window.FancyApplePay.clicked = false;
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "applePayButton",
    style: {
      WebkitAppearance: "-apple-pay-button",
      ApplePayButtonType: "plain",
      ApplePayButtonStyle: "black"
    },
    onClick: handleApplePayCheckout
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ApplePayButton);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/CartButton.tsx":
/*!**************************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/CartButton.tsx ***!
  \**************************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../map */ "./_static/modules/ui/overlay-thing/components/map.ts");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");
/* harmony import */ var _appstate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../appstate */ "./_static/modules/ui/overlay-thing/appstate.ts");









var CartButton = function CartButton(_ref) {
  var onPurchase = _ref.onPurchase,
      loading = _ref.loading;
  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();

  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_6__.useFancy)(),
      sales = _useFancy.thing.sales,
      saleContext = _useFancy.saleContext;

  var waiting = (0,_map__WEBPACK_IMPORTED_MODULE_5__.getWaiting)(sales, saleContext);
  var available = sales.available;

  var _ref2 = (0,_map__WEBPACK_IMPORTED_MODULE_5__.getCurrentSaleOption)(sales, saleContext),
      soldout = _ref2.soldout;

  if (!available) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Button, {
      className: "btn-create not-available",
      label: gettext("Not Available"),
      disabled: true
    });
  }

  var onNotifyLater = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (!_appstate__WEBPACK_IMPORTED_MODULE_7__.default.loggedIn) {
      return window.require_login();
    }

    var opt = (0,_map__WEBPACK_IMPORTED_MODULE_5__.getCurrentSaleOption)(sales, saleContext, true);
    var params = {
      sale_item_id: sales.id
    };

    if (opt != null) {
      params.option_id = opt.id;
    }

    var waiting = (0,_map__WEBPACK_IMPORTED_MODULE_5__.getWaiting)(sales, saleContext);

    if (waiting) {
      params.remove = 1;
    }

    $.ajax({
      type: "post",
      url: "/wait_for_product.json",
      data: params,
      dataType: "json"
    }).done(function (json) {
      if (!json || json.status_code == null) {
        return;
      }

      if (json.status_code == 0 && json.message) {
        window.alertify.alert(json.message);
        return;
      }

      var waiting = params.remove ? false : true;
      dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_4__.updateSaleContext)({
        waiting: waiting
      }));
    });
  }, [dispatch, sales, saleContext]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Button, {
    onClick: onPurchase,
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("add_to_cart btn-cart", {
      "btn-create": soldout,
      "btns-blue-embo": !soldout,
      loading: loading
    }),
    disabled: !!soldout,
    label: soldout ? gettext("Sold out") : gettext("Add to cart")
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Button, {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("btn-create notify-available", {
      subscribed: waiting
    }),
    label: waiting ? gettext("Subscribed") : gettext("Notify me when available"),
    style: !soldout ? {
      display: "none"
    } : undefined,
    onClick: onNotifyLater
  }));
};

var Button = function Button(_ref3) {
  var props = _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, _ref3);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, props, {
    label: null
  }), props.label);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CartButton);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/index.tsx":
/*!*********************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/index.tsx ***!
  \*********************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.e, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ SaleItemSidebarHead
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");
/* harmony import */ var _action_actions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../action/actions */ "./_static/modules/ui/overlay-thing/action/actions.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../map */ "./_static/modules/ui/overlay-thing/components/map.ts");
/* harmony import */ var _Perf__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../Perf */ "./_static/modules/ui/overlay-thing/components/Perf.js");
/* harmony import */ var _SaleItemForm__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../SaleItemForm */ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItemForm.tsx");
/* harmony import */ var _CartButton__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./CartButton */ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/CartButton.tsx");
/* harmony import */ var _multiOption__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./multiOption */ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/multiOption.ts");
/* harmony import */ var _ApplePayButton__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./ApplePayButton */ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/ApplePayButton.tsx");




















function optionValueFunction(opt) {
  return opt?.id;
}

var saleNamePrinter = function saleNamePrinter(opt) {
  return "".concat(opt.name, " - $").concat(opt.price);
};

var _window = window,
    Fancy = _window.Fancy,
    alertify = _window.alertify;

var Price = function Price(_ref) {
  var discounting = _ref.discounting,
      price = _ref.price,
      retailPrice = _ref.retailPrice,
      discountPercentage = _ref.discountPercentage;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
    className: "price",
    key: _Perf__WEBPACK_IMPORTED_MODULE_14__.Keys.Sidebar.Price
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("big", {
    className: classnames__WEBPACK_IMPORTED_MODULE_9___default()({
      sale: discounting
    })
  }, "$", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.floatFormatMinusTwo)(price)), discounting && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
    className: "sales"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", null, "$", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.floatFormatMinusTwo)(retailPrice)), " (Save ", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(discountPercentage, 0), "%)"));
};

var SaleItemSidebarHead = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(SaleItemSidebarHead, _Component);

  function SaleItemSidebarHead(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, SaleItemSidebarHead);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(SaleItemSidebarHead).call(this, props)); // for multi options

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      loading: false,
      showSelectWarning: false,
      selected: {},
      disabled: [],
      multiOptionState: null
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "renderCurrencyPopup", function () {
      __webpack_require__.e(/*! import() | OverlayThing.popup */ "OverlayThing.popup").then(__webpack_require__.bind(__webpack_require__, /*! ../../../popup/index */ "./_static/modules/ui/overlay-thing/components/popup/index.js")).then(function (_ref2) {
        var CurrencyPopup = _ref2.CurrencyPopup;
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.renderPopup)(CurrencyPopup, {
          currentCurrency: _this.props.saleContext.currencyCode
        });
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCurrencyPopup", function (event) {
      event.preventDefault();

      _this.renderCurrencyPopup();
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCurrencyPopupUSD", function (event) {
      event.preventDefault();

      if (!(0,_map__WEBPACK_IMPORTED_MODULE_13__.currencyIsUSD)(_this.props)) {
        return false;
      }

      _this.renderCurrencyPopup();
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handlePurchase", function (event) {
      event.preventDefault();
      var _this$props = _this.props,
          sales = _this$props.thing.sales,
          saleContext = _this$props.saleContext;
      var saleOption = (0,_map__WEBPACK_IMPORTED_MODULE_13__.getCurrentSaleOption)(sales, saleContext, true);
      var soldout = saleOption == null ? sales.soldout : saleOption.soldout;

      if (soldout || _this.state.loading) {
        return;
      }

      var optionIsMulti = (0,_multiOption__WEBPACK_IMPORTED_MODULE_18__.isOptionMulti)(sales);
      var saleOptionID = saleOption != null ? saleOption.id : null;

      if (!optionIsMulti && sales.options.length > 0 && saleContext.saleOptionID === null) {
        _this.setState({
          showSelectWarning: true
        });

        return;
      }

      _this.setState({
        showSelectWarning: false,
        loading: true
      }, function () {
        var payload = {
          sale_id: sales.id,
          quantity: saleContext.selectedQuantity,
          personalization: saleContext.personalization
        };

        if (saleOptionID != null) {
          payload.option_id = saleOptionID;
        }

        Fancy.CartAPI.addItem(payload, function (success, json) {
          if (success) {
            $.dialog('thing-quickview').close();
            Fancy.Cart.openPopup();
          } else {
            alertify.alert(json && json.error || "Failed to add the item to cart. Please contact us at cs@fancy.com if the problem persists.");
          }

          _this.setState({
            loading: false
          });
        });
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleOptionChange", function (event) {
      var dispatch = _this.props.dispatch;

      if (!event.currentTarget.value) {
        dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.updateSaleContext)({
          saleOptionID: null
        }));
      } else {
        var saleOptionID = parseInt(event.currentTarget.value, 10);
        dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.updateSaleContext)({
          saleOptionID: saleOptionID
        }));
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleQuantityChange", function (event) {
      var dispatch = _this.props.dispatch;
      var selectedQuantity = parseInt(event.currentTarget.value, 10);
      dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.updateSaleContext)({
        selectedQuantity: selectedQuantity
      }));
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handlePersonalizationChange", function (event) {
      var dispatch = _this.props.dispatch;
      var personalization = event.currentTarget.value;
      dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.updateSaleContext)({
        personalization: personalization
      }));
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "checkApplePay", function () {
      if (window.FancyApplePay) {
        var _this$props2 = _this.props,
            dispatch = _this$props2.dispatch,
            thing = _this$props2.thing,
            sales = _this$props2.thing.sales;
        var os = sales.options.filter(function (o) {
          return !o.soldout;
        });
        var data = {
          total: {
            label: thing.name,
            amount: sales.price * 100 | 0
          }
        };

        if (os.length > 0) {
          data.displayItems = os.map(function (o) {
            return {
              label: o.name,
              amount: Number(o.price) * 100 | 0
            };
          });
        }

        window.FancyApplePay.checkAvailability(function (available, testmode) {
          if (available) {
            dispatch((0,_action_actions__WEBPACK_IMPORTED_MODULE_12__.updateAppContext)({
              applePayDisplay: true,
              applePayTest: testmode
            }));
          }
        }, data);
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "initializeMultiOption", function () {
      var _this$props3 = _this.props,
          _this$props3$thing$sa = _this$props3.thing.sales,
          options = _this$props3$thing$sa.options,
          option_meta = _this$props3$thing$sa.option_meta,
          saleContext = _this$props3.saleContext,
          dispatch = _this$props3.dispatch;

      _this.setState(_this.getInitialMultiOptionState(options, option_meta), function () {
        // don't block selecting cheapest item
        if (!(options && options.length > 1)) {
          _this.updateSaleOptionIDFromMultiOptionState();
        } // ?option={number} support


        var presetOptionId = (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.getLocationArgPairs)("option");

        if (presetOptionId && presetOptionId[1] && String(saleContext.saleOptionID) !== presetOptionId[1]) {
          dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.updateSaleContext)({
            saleOptionID: parseInt(presetOptionId[1], 10)
          }));
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "extractSaleOptionIDFromMultiOptionState", function (selected) {
      var sales = _this.props.thing.sales;

      if (selected == null) {
        selected = _this.state.selected;
      }

      var multiOptionState = _this.state.multiOptionState;
      var selectedOptionArray = multiOptionState.option_meta.map(function (m) {
        var order = multiOptionState.orderMap[m.type][m.name];

        if (selected[m.type][order]) {
          return selected[m.type][order];
        } else {
          return selected[m.type][0];
        }
      });

      var selectedOption = _.find(sales.options, function (opt) {
        return selectedOptionArray.every(function (e, i) {
          return e === opt.values[i];
        });
      });

      if (selectedOption) {
        return selectedOption.id;
      } else {
        window.DEBUG && console.warn("no option found for ", selectedOptionArray, "meta:", sales.options, _this.state.selected);
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "updateSaleOptionIDFromMultiOptionState", function () {
      var dispatch = _this.props.dispatch;

      var saleOptionID = _this.extractSaleOptionIDFromMultiOptionState();

      if (saleOptionID === undefined) {
        var amendedID = _this.amendSaleOptionFromMultiOptionState();

        if (amendedID) {
          saleOptionID = amendedID;
        } else {
          window.DEBUG && console.warn("Couldn't recover option");
        }
      }

      dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.updateSaleContext)({
        saleOptionID: saleOptionID
      }));
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "amendSaleOptionFromMultiOptionState", function () {
      var _this$state = _this.state,
          selected = _this$state.selected,
          multiOptionState = _this$state.multiOptionState;
      var nextSelected = {
        swatch: [],
        button: [],
        thumbnail: [],
        dropdown: []
      };
      multiOptionState.option_meta.forEach(function (_ref3, index) {
        var type = _ref3.type,
            name = _ref3.name;
        var order = multiOptionState.orderMap[type][name];
        var selectedValue = selected[type][order];

        if (index === 0) {
          nextSelected[type][order] = selectedValue;
          return;
        }

        var values = multiOptionState.getPossibleValuesForIndex(selected, index);
        var value;

        if (values.some(function (v) {
          return v === selectedValue;
        })) {
          value = selectedValue;
        } else {
          value = values[0];
        }

        selected[type][order] = value; // even though it will be flushed out, it will affect next options so fix it as well

        nextSelected[type][order] = value;
      });

      _this.setState({
        selected: nextSelected
      });

      return _this.extractSaleOptionIDFromMultiOptionState(nextSelected);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "onClickMultiOptionGen", function (type) {
      return function (e) {
        var el = e.currentTarget;
        var value;
        var indexOfType;

        if (el.tagName === "SELECT") {
          value = el.value;
          indexOfType = Number($(el).find(":selected").attr("data-index-typeof"));
        } else {
          value = $(el).attr("data-value");
          indexOfType = Number($(el).attr("data-index-typeof"));
        }

        if (e.currentTarget.className === "disabled") {
          return;
        }

        _this.state.selected[type][indexOfType] = value; // forceful trigger even though no differences in value.

        _this.setState({
          selected: _.extend({}, _this.state.selected)
        }, _this.updateSaleOptionIDFromMultiOptionState);
      };
    });

    _this.onClickThumbnail = _this.onClickMultiOptionGen("thumbnail");
    _this.onClickSwatch = _this.onClickMultiOptionGen("swatch");
    _this.onMultiSelectBoxChange = _this.onClickMultiOptionGen("dropdown");
    _this.onClickMutliButton = _this.onClickMultiOptionGen("button");
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(SaleItemSidebarHead, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!(0,_map__WEBPACK_IMPORTED_MODULE_13__.currencyIsUSD)(this.props)) {
        var saleContext = this.props.saleContext;
        (0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.convertCurrency)(saleContext.currencyCode, saleContext.price);
      }

      this.initializeMultiOption();
      this.checkApplePay();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.thing.id !== this.props.thing.id) {
        this.initializeMultiOption();
        this.checkApplePay();

        if (this.state.showSelectWarning) {
          this.setState({
            showSelectWarning: false
          });
        }

        return;
      }

      var saleContext = prevProps.saleContext,
          sales = prevProps.thing.sales;
      var nsc = this.props.saleContext;
      var nextSaleOptionID = nsc.saleOptionID;

      if (saleContext.saleOptionID !== nextSaleOptionID) {
        if (this.state.showSelectWarning) {
          this.setState({
            showSelectWarning: false
          });
        }

        var o = _.find(sales.options, function (_o) {
          return _o.id === nextSaleOptionID;
        }); // option sync


        if (o) {
          var mos = $(".sale-item-input .multi-option");
          o.values.forEach(function (v, i) {
            var $so = mos.eq(i).find("[data-value=\"".concat((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.escapeSelector)(v), "\"]:not(.selected)")).eq(0);

            if ($so.length) {
              if ($so.is("option")) $so.prop("selected", true);else $so.get(0).click();
            }
          });

          if (window.FancyApplePay && window.FancyApplePay.paymentRequest) {
            window.FancyApplePay.paymentRequest.update({
              total: {
                label: o.name,
                amount: Number(o.price) * 100 | 0
              }
            });
          }
        }
      }
    }
  }, {
    key: "getInitialMultiOptionState",
    value: function getInitialMultiOptionState(options, option_meta) {
      var selected = {
        swatch: [],
        button: [],
        thumbnail: [],
        dropdown: []
      };

      if (option_meta.length > 0) {
        var nonSoldout = options.filter(function (o) {
          return o.quantity !== 0;
        });

        if (nonSoldout.length !== 0) {
          var selectedNonSoldoutOption = nonSoldout[0]; // temporary - FIXME

          option_meta.forEach(function (opt, i) {
            var type = opt.type;
            var nextValue = selectedNonSoldoutOption.values[i];
            selected[type].push(nextValue);
          });
        } else {
          // set first available multi option
          option_meta.forEach(function (opt) {
            var type = opt.type;
            var nextValue = opt.values[0];
            selected[type].push(nextValue);
          });
        }
      }

      var multiOptionState = new _SaleItemForm__WEBPACK_IMPORTED_MODULE_15__.MultiOptionState(options, option_meta);
      return {
        selected: selected,
        multiOptionState: multiOptionState
      };
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var saleContext = this.props.saleContext;
      var nsc = nextProps.saleContext;
      var priceChanges = saleContext.price !== nsc.price;
      var currencyChanges = saleContext.currencyCode !== nsc.currencyCode;

      if (priceChanges || currencyChanges) {
        if (!(0,_map__WEBPACK_IMPORTED_MODULE_13__.currencyIsUSD)(nextProps)) {
          var _saleContext = nextProps.saleContext;
          (0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_11__.convertCurrency)(_saleContext.currencyCode, _saleContext.price, true); // FIXME: unable to comparison since price update comes first (SaleItemSidebarHead.componentWillReceiveProps())
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          thing = _this$props4.thing,
          sales = _this$props4.thing.sales,
          applePayDisplay = _this$props4.appContext.applePayDisplay,
          saleContext = _this$props4.saleContext,
          _this$props4$saleCont = _this$props4.saleContext,
          selectedQuantity = _this$props4$saleCont.selectedQuantity,
          price = _this$props4$saleCont.price,
          showInfo = _this$props4.showInfo;
      var showSelectWarning = this.state.showSelectWarning;
      var opt = (0,_map__WEBPACK_IMPORTED_MODULE_13__.getCurrentSaleOption)(sales, saleContext);
      var discountPercentage = parseFloat(opt.discount_percentage); // TODO: use decimal?

      var retailPrice = opt.retail_price;
      var soldout = opt.soldout,
          quantity = opt.quantity;
      var option_meta = sales.option_meta;
      var optionIsMulti = (0,_multiOption__WEBPACK_IMPORTED_MODULE_18__.isOptionMulti)(sales);
      var salesOptionsAvailable = (0,_map__WEBPACK_IMPORTED_MODULE_13__.isSalesOptionsAvailable)(sales);
      var discounting = discountPercentage > 0;
      var quantitySelectRange = soldout ? ["1"] : _.range(1, Math.min(10, (quantity || 0) + 1));
      var showSelectbox = sales.options.length !== 0;
      var applePayButton;

      if (applePayDisplay && !soldout) {
        applePayButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ApplePayButton__WEBPACK_IMPORTED_MODULE_17__.default, this.props);
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(react__WEBPACK_IMPORTED_MODULE_8__.Fragment, null, showInfo ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(react__WEBPACK_IMPORTED_MODULE_8__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("h1", _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
        key: _Perf__WEBPACK_IMPORTED_MODULE_14__.Keys.Sidebar.Title,
        className: "title"
      }, (0,_map__WEBPACK_IMPORTED_MODULE_13__.getSafeNameProp)(thing))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(Price, {
        discounting: discounting,
        price: price,
        retailPrice: retailPrice,
        discountPercentage: discountPercentage
      })) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "frm",
        key: _Perf__WEBPACK_IMPORTED_MODULE_14__.Keys.Sidebar.Form
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("fieldset", {
        className: "sale-item-input"
      }, showSelectbox && !optionIsMulti && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_SaleItemForm__WEBPACK_IMPORTED_MODULE_15__.SelectBox, {
        className: "multi-option",
        id: "option",
        label: gettext("Option"),
        currentValue: opt.soldout || saleContext.saleOptionID !== null ? opt : "",
        value: optionValueFunction,
        printer: saleNamePrinter,
        options: sales.options,
        unselectedLabel: "Please select",
        expander: SaleItemOptionsExpander,
        disabled: !salesOptionsAvailable,
        onChange: this.handleOptionChange,
        showSelectWarning: showSelectWarning,
        SizeGuide: function SizeGuide() {
          var hasSizeGuide = sales.size_guide_id != null;
          return hasSizeGuide ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
            className: "size-guide",
            onClick: function onClick(e) {
              e.preventDefault();
              __webpack_require__.e(/*! import() | OverlayThing.popup */ "OverlayThing.popup").then(__webpack_require__.bind(__webpack_require__, /*! ../../../popup/index */ "./_static/modules/ui/overlay-thing/components/popup/index.js")).then(function (_ref4) {
                var SizeGuidePopup = _ref4.SizeGuidePopup;
                (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.renderPopup)(SizeGuidePopup, _this2.props);
              });
            }
          }, "Size guide") : null;
        }
      }), optionIsMulti && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_SaleItemForm__WEBPACK_IMPORTED_MODULE_15__.MultiOption, {
        sid: sales.id,
        onClickThumbnail: this.onClickThumbnail,
        onClickSwatch: this.onClickSwatch,
        onMultiSelectBoxChange: this.onMultiSelectBoxChange,
        onClickMutliButton: this.onClickMutliButton,
        selected: this.state.selected,
        disabled: this.state.disabled,
        soldout: !!soldout,
        option_meta: option_meta,
        SizeGuide: function SizeGuide() {
          var hasSizeGuide = sales.size_guide_id != null;
          return hasSizeGuide ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
            className: "size-guide",
            onClick: function onClick(e) {
              e.preventDefault();
              __webpack_require__.e(/*! import() | OverlayThing.popup */ "OverlayThing.popup").then(__webpack_require__.bind(__webpack_require__, /*! ../../../popup/index */ "./_static/modules/ui/overlay-thing/components/popup/index.js")).then(function (_ref5) {
                var SizeGuidePopup = _ref5.SizeGuidePopup;
                (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.renderPopup)(SizeGuidePopup, _this2.props);
              });
            }
          }, "Size guide") : null;
        },
        multiOptionState: this.state.multiOptionState
      }), sales.personalizable && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "personalization"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", null, "This item can be personalized:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "text",
        className: "text",
        name: "personalization",
        placeholder: "Personalization details",
        onChange: this.handlePersonalizationChange
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_SaleItemForm__WEBPACK_IMPORTED_MODULE_15__.SelectBox, {
        id: "quantity",
        className: "multi-option",
        label: gettext("Quantity"),
        defaultValue: "1",
        currentValue: selectedQuantity,
        options: quantitySelectRange,
        disabled: !!soldout,
        onChange: this.handleQuantityChange
      }), applePayButton, showSelectWarning && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "error"
      }, "Please select from the available option"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_CartButton__WEBPACK_IMPORTED_MODULE_16__.default, {
        onPurchase: this.handlePurchase,
        loading: this.state.loading
      }))));
    }
  }]);

  return SaleItemSidebarHead;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(SaleItemSidebarHead, "defaultProps", {
  showInfo: true
});



function SaleItemOptionsExpander(sio, idx) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("option", {
    value: sio.id,
    key: "sale_options-".concat(idx)
  }, sio.soldout === true || !(sio.quantity > 0) ? "".concat(sio.name, " - ").concat(gettext("Sold out")) : sio.name);
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/multiOption.ts":
/*!**************************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/multiOption.ts ***!
  \**************************************************************************************/
/*! namespace exports */
/*! export isOptionMulti [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isOptionMulti": () => /* binding */ isOptionMulti
/* harmony export */ });
function isOptionMulti(sales) {
  if (sales.option_meta.length > 1) {
    return true;
  } else if (sales.option_meta.length === 1) {
    return sales.option_meta[0].type !== "dropdown";
  } else {
    return false;
  }
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItemForm.tsx":
/*!*******************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItemForm.tsx ***!
  \*******************************************************************************/
/*! namespace exports */
/*! export MultiButton [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MultiOption [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MultiOptionState [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MultiSelectBox [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MultiSwatch [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MultiThumbnail [provided] [no usage info] [missing usage info prevents renaming] */
/*! export SelectBox [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectBox": () => /* binding */ SelectBox,
/* harmony export */   "MultiOptionState": () => /* binding */ MultiOptionState,
/* harmony export */   "MultiOption": () => /* binding */ MultiOption,
/* harmony export */   "MultiSelectBox": () => /* binding */ MultiSelectBox,
/* harmony export */   "MultiSwatch": () => /* binding */ MultiSwatch,
/* harmony export */   "MultiThumbnail": () => /* binding */ MultiThumbnail,
/* harmony export */   "MultiButton": () => /* binding */ MultiButton
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_5__);





 // Generic purchase handler, needs to be bound to insatnce on initialization.

/*
    data-sii={sales.id}
    data-sisi={sales.seller_id}
    data-tid={thing.id}
*/

var SaleOptions = function SaleOptions(_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? ["1"] : _ref$options,
      _ref$currentValue = _ref.currentValue,
      currentValue = _ref$currentValue === void 0 ? "1" : _ref$currentValue,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? "" : _ref$id,
      _ref$value = _ref.value,
      value = _ref$value === void 0 ? function (v) {
    return v;
  } : _ref$value,
      expander = _ref.expander,
      defaultValue = _ref.defaultValue,
      printer = _ref.printer,
      disabled = _ref.disabled,
      onChange = _ref.onChange,
      onClick = _ref.onClick,
      onFocus = _ref.onFocus,
      unselectedLabel = _ref.unselectedLabel;

  expander = expander || function (option, idx) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("option", {
      key: "sale_options-".concat(idx),
      value: value(option)
    }, printer(option));
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("select", {
    id: id,
    className: classnames__WEBPACK_IMPORTED_MODULE_5___default()("select-boxes2", {
      "one-option": options.length <= 1
    }),
    value: value(currentValue) || defaultValue,
    disabled: disabled,
    onChange: onChange,
    onClick: onClick,
    onFocus: onFocus
  }, unselectedLabel && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("option", {
    value: ""
  }, unselectedLabel), options.map(expander));
};

var SelectBox = function SelectBox(props) {
  var className = props.className,
      disabled = props.disabled,
      label = props.label,
      currentValue = props.currentValue,
      defaultValue = props.defaultValue,
      id = props.id,
      printer = props.printer,
      tabIndex = props.tabIndex,
      unselectedLabel = props.unselectedLabel,
      _props$options = props.options,
      options = _props$options === void 0 ? ["1"] : _props$options,
      SizeGuide = props.SizeGuide,
      showSelectWarning = props.showSelectWarning;
  printer = printer != null ? printer : function (s) {
    return s;
  };
  defaultValue = defaultValue != null ? defaultValue : "1";
  className = className != null ? className : null;
  var labelValue;

  if (unselectedLabel != null && currentValue === "") {
    labelValue = unselectedLabel;
  } else {
    labelValue = printer(currentValue != null ? currentValue : defaultValue);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("label", null, label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("span", {
    className: "trick-select ".concat(id, " ").concat(showSelectWarning ? 'soldout' : '')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("a", {
    className: classnames__WEBPACK_IMPORTED_MODULE_5___default()("selectBox", {
      disabled: disabled,
      "one-option": options.length <= 1
    }),
    tabIndex: tabIndex || "1"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("span", {
    className: "selectBox-label"
  }, labelValue), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("span", {
    className: "selectBox-arrow"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(SaleOptions, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3___default()({}, props, {
    printer: printer,
    defaultValue: defaultValue
  }))), SizeGuide && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(SizeGuide, {
    key: "size-guide"
  }));
};
var MultiOptionState = /*#__PURE__*/function () {
  function MultiOptionState(options, option_meta) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, MultiOptionState);

    this.options = options;
    this.option_meta = option_meta;
    var orderMap = {};
    option_meta.forEach(function (m) {
      if (orderMap[m.type] == null) {
        orderMap[m.type] = {
          length: 1
        };
        orderMap[m.type][m.name] = 0;
      } else {
        orderMap[m.type][m.name] = orderMap[m.type].length;
        orderMap[m.type].length += 1;
      }
    });
    this.orderMap = orderMap;
  } // i.e.) getPossibleValues(['a', '1', '가'], 1) => ['1', '3', '6']
  // output: get possible options for 2nd option dependent on ('a' / 1st option)


  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(MultiOptionState, [{
    key: "getPossibleValuesForIndex",
    value: function getPossibleValuesForIndex(selected, targetIndex) {
      var options = this.options,
          option_meta = this.option_meta,
          orderMap = this.orderMap;

      if (targetIndex === 0) {
        return option_meta[0].values;
      }

      var filteredOptions = options;
      option_meta.map(function (m) {
        var order = orderMap[m.type][m.name];

        if (selected[m.type][order]) {
          return selected[m.type][order];
        } else {
          return selected[m.type][0];
        }
      }).forEach(function (sel, idx) {
        if (idx < targetIndex) {
          filteredOptions = filteredOptions.filter(function (option) {
            return option.values[idx] === sel;
          });
        }
      });
      return _.uniq(filteredOptions.map(function (o) {
        return o.values[targetIndex];
      })); // FIXME
    }
  }, {
    key: "getMultiOptions",
    value: function getMultiOptions(selected) {
      var _this = this;

      return this.option_meta.map(function (meta, idx) {
        return [meta, _this.getPossibleValuesForIndex(selected, idx)];
      });
      /*
      returns [
          [type, ['a', 'b', 'c']],
          [type, ['1', '2']],
          [tyep, ['red', 'white', 'black']]
      ]
      */
    }
  }]);

  return MultiOptionState;
}();
var MultiOption = function MultiOption(props) {
  var selected = props.selected,
      multiOptionState = props.multiOptionState,
      sid = props.sid,
      SizeGuide = props.SizeGuide;

  if (multiOptionState == null) {
    return null;
  }

  var multiOptions = multiOptionState.getMultiOptions(selected);
  var sizeGuidePos = -1;

  if (SizeGuide) {
    multiOptions.map(function (_ref2, idx) {
      var _ref3 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref2, 2),
          meta = _ref3[0],
          values = _ref3[1];

      if (meta.name && meta.name.trim().toLowerCase() === "size") sizeGuidePos = idx;
    });
    if (sizeGuidePos < 0) sizeGuidePos = multiOptions.length - 1;
  }

  return multiOptions.map(function (_ref4, idx) {
    var _ref5 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref4, 2),
        meta = _ref5[0],
        values = _ref5[1];

    var type = meta.type,
        name = meta.name;
    var indexTypeOf = multiOptionState.orderMap[type] && multiOptionState.orderMap[type][name];
    var additional = {
      name: name,
      values: values,
      indexTypeOf: indexTypeOf,
      selectedArray: selected && selected[type],
      selectedValue: selected && selected[type] && selected[type][indexTypeOf],
      key: "".concat(sid, "-").concat(idx),
      showSizeGuide: idx == sizeGuidePos
    };

    if (type === "dropdown") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiSelectBox, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3___default()({}, props, additional));
    } else if (type === "swatch") {
      additional.swatch = meta.swatch;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiSwatch, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3___default()({}, props, additional));
    } else if (type === "thumbnail") {
      additional.thumbnail = meta.thumbnail;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiThumbnail, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3___default()({}, props, additional));
    } else if (type === "button") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiButton, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_3___default()({}, props, additional));
    }
  });
};
var MultiSelectBox = function MultiSelectBox(props) {
  var values = props.values,
      name = props.name,
      onMultiSelectBoxChange = props.onMultiSelectBoxChange,
      indexTypeOf = props.indexTypeOf,
      selectedValue = props.selectedValue,
      showSizeGuide = props.showSizeGuide,
      SizeGuide = props.SizeGuide;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: "multi-option"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("label", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("select", {
    onChange: onMultiSelectBoxChange,
    value: selectedValue,
    className: values.length <= 1 ? "one-option" : undefined
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiSelectBoxOption, {
    key: -1,
    value: "Please select",
    indexTypeOf: indexTypeOf
  }), values.map(function (value, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiSelectBoxOption, {
      key: i,
      value: value,
      indexTypeOf: indexTypeOf
    });
  })), showSizeGuide ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(SizeGuide, {
    key: "size-guide"
  }) : null);
};

var MultiSelectBoxOption = function MultiSelectBoxOption(props) {
  var value = props.value,
      indexTypeOf = props.indexTypeOf;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("option", {
    "data-value": value,
    "data-index-typeof": indexTypeOf,
    value: value
  }, value);
};

var MultiSwatch = function MultiSwatch(props) {
  var name = props.name,
      values = props.values,
      swatch = props.swatch,
      indexTypeOf = props.indexTypeOf,
      selectedValue = props.selectedValue,
      onClickSwatch = props.onClickSwatch,
      showSizeGuide = props.showSizeGuide,
      SizeGuide = props.SizeGuide;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: "multi-option swatch"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("label", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: "select-option"
  }, values.map(function (value, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiSwatchOption, {
      key: i,
      value: value,
      swatch: swatch,
      indexTypeOf: indexTypeOf,
      selectedValue: selectedValue,
      onClick: onClickSwatch
    });
  })), showSizeGuide ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(SizeGuide, {
    key: "size-guide"
  }) : null);
};

var MultiSwatchOption = function MultiSwatchOption(props) {
  var value = props.value,
      swatch = props.swatch,
      indexTypeOf = props.indexTypeOf,
      selectedValue = props.selectedValue,
      onClick = props.onClick;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("a", {
    href: "#",
    style: {
      backgroundColor: swatch[value]
    },
    onClick: onClick,
    "data-value": value,
    "data-label": value,
    "data-index-typeof": indexTypeOf,
    className: selectedValue === value ? "selected" : ""
  });
};

var MultiThumbnail = function MultiThumbnail(props) {
  var values = props.values,
      name = props.name,
      thumbnail = props.thumbnail,
      onClickThumbnail = props.onClickThumbnail,
      indexTypeOf = props.indexTypeOf,
      selectedValue = props.selectedValue,
      showSizeGuide = props.showSizeGuide,
      SizeGuide = props.SizeGuide;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: "multi-option thumbnail"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("label", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("span", {
    className: "value"
  }, selectedValue), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: "select-option"
  }, values.map(function (value, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiThumbnailOption, {
      key: i,
      onClick: onClickThumbnail,
      value: value,
      indexTypeOf: indexTypeOf,
      selectedValue: selectedValue,
      thumbnail: thumbnail
    });
  })), showSizeGuide ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(SizeGuide, {
    key: "size-guide"
  }) : null);
};

var MultiThumbnailOption = function MultiThumbnailOption(_ref6) {
  var onClick = _ref6.onClick,
      value = _ref6.value,
      indexTypeOf = _ref6.indexTypeOf,
      selectedValue = _ref6.selectedValue,
      thumbnail = _ref6.thumbnail;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("a", {
    href: "#",
    onClick: onClick,
    "data-value": value,
    "data-index-typeof": indexTypeOf,
    className: selectedValue === value ? "selected" : ""
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("img", {
    src: "/_ui/images/common/blank.gif",
    style: {
      backgroundImage: "url(\"".concat(thumbnail[value], "\")"),
      backgroundSize: "cover"
    },
    alt: value
  }));
};

var MultiButton = function MultiButton(props) {
  var values = props.values,
      name = props.name,
      onClickMutliButton = props.onClickMutliButton,
      indexTypeOf = props.indexTypeOf,
      selectedValue = props.selectedValue,
      showSizeGuide = props.showSizeGuide,
      SizeGuide = props.SizeGuide;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: "multi-option button"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("label", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
    className: "select-option"
  }, values.map(function (value, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(MultiButtonOption, {
      key: i,
      onClick: onClickMutliButton,
      indexTypeOf: indexTypeOf,
      selectedValue: selectedValue,
      value: value
    });
  })), showSizeGuide ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(SizeGuide, {
    key: "size-guide"
  }) : null);
};

var MultiButtonOption = function MultiButtonOption(props) {
  var value = props.value,
      onClick = props.onClick,
      indexTypeOf = props.indexTypeOf,
      selectedValue = props.selectedValue;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement("button", {
    onClick: onClick,
    className: selectedValue === value ? "selected" : "",
    "data-value": value,
    "data-index-typeof": indexTypeOf
  }, value);
};

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/config.js":
/*!****************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/config.js ***!
  \****************************************************/
/*! namespace exports */
/*! export FancyStatus [provided] [no usage info] [missing usage info prevents renaming] */
/*! export Selectors [provided] [no usage info] [missing usage info prevents renaming] */
/*! export StaticThingViewConfig [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ThingViewConfig [provided] [no usage info] [missing usage info prevents renaming] */
/*! export salesStatus [provided] [no usage info] [missing usage info prevents renaming] */
/*! export textareaHeight [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "salesStatus": () => /* binding */ salesStatus,
/* harmony export */   "FancyStatus": () => /* binding */ FancyStatus,
/* harmony export */   "textareaHeight": () => /* binding */ textareaHeight,
/* harmony export */   "Selectors": () => /* binding */ Selectors,
/* harmony export */   "ThingViewConfig": () => /* binding */ ThingViewConfig,
/* harmony export */   "StaticThingViewConfig": () => /* binding */ StaticThingViewConfig
/* harmony export */ });
// SaleItem#get_status
var salesStatus = {
  EXPIRED: 'Expired',
  REMOVED: 'Deleted',
  PENDING: 'Pending',
  COMING_SOON: 'Coming soon',
  ACTIVE: 'Active',
  SOLD_OUT: 'Sold out'
};
var FancyStatus = {
  Addition: 'Addition',
  Removal: 'Removal',
  AfterAddition: 'AfterAddition',
  AfterRemoval: 'AfterRemoval',
  Idle: 'Idle'
};
var textareaHeight = {
  collapsed: 20,
  expanded: 40
};
var commonWrapperSelector = '#container-wrapper .wrapper-content #content';
var Selectors = {
  HomepageWrapper: commonWrapperSelector
};
var zoomMargin = 125;
var ThingViewConfig = {
  boundarySize: 640,
  zoomMargin: zoomMargin,
  // zoom box size 250 (246 + 2 + 2) / 2
  zoomBoxSize: zoomMargin * 2,
  // zoom box size 250 (246 + 2 + 2) / 2
  zoomScale: 1.5
};
var StaticThingViewConfig = {
  ThumbnailsLimit: {
    Basic: 18,
    More: 200
  }
};

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/container/entry-events.js":
/*!********************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/container/entry-events.js ***!
  \********************************************************************/
/*! namespace exports */
/*! export OtContainer [provided] [no usage info] [missing usage info prevents renaming] */
/*! export attachEntryEvents [provided] [no usage info] [missing usage info prevents renaming] */
/*! export scrollEvent [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attachEntryEvents": () => /* binding */ attachEntryEvents,
/* harmony export */   "OtContainer": () => /* binding */ OtContainer,
/* harmony export */   "scrollEvent": () => /* binding */ scrollEvent
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/store */ "./_static/modules/ui/overlay-thing/store/store.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ "./_static/modules/ui/overlay-thing/config.js");
/* harmony import */ var _routeutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./routeutils */ "./_static/modules/ui/overlay-thing/container/routeutils.js");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");






function handleOverlayThingKeyEvents(event) {
  if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') {
    return;
  }

  switch (event.which) {
    case fancyutils__WEBPACK_IMPORTED_MODULE_0__.KEYS.LEFT:
      _routeutils__WEBPACK_IMPORTED_MODULE_3__.pagingContext.movePrev();
      break;

    case fancyutils__WEBPACK_IMPORTED_MODULE_0__.KEYS.RIGHT:
      _routeutils__WEBPACK_IMPORTED_MODULE_3__.pagingContext.moveNext();
      break;

    case fancyutils__WEBPACK_IMPORTED_MODULE_0__.KEYS.ESC:
      // If popup is not on
      if ($('#popup_container:visible').length === 0) {
        _store_store__WEBPACK_IMPORTED_MODULE_1__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_4__.closeOverlay)());
      }

      break;
  }
}

function conditionalTransition(aElement) {
  // Turn off video
  $('#container-wrapper .btn-pause').attr('scroll', true).click(); // Ensure anchor is static (sticked to homepage timeline) or not.

  if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isStream)() && $(_config__WEBPACK_IMPORTED_MODULE_2__.Selectors.HomepageWrapper).has(aElement)) {
    (0,_routeutils__WEBPACK_IMPORTED_MODULE_3__.transition)(aElement.getAttribute('href'), _routeutils__WEBPACK_IMPORTED_MODULE_3__.LinkTypes.Static);
  } else {
    (0,_routeutils__WEBPACK_IMPORTED_MODULE_3__.transition)(aElement.getAttribute('href'));
  }
}

var oneshotEventAttached = false;
function attachEntryEvents() {
  if (oneshotEventAttached) {
    return;
  }

  oneshotEventAttached = true; // Remove pre-existing url event and start transition first

  $(document.body).off('click.overlayThingInit');

  if (window.__INIT_THING_ANCHOR != null) {
    conditionalTransition(window.__INIT_THING_ANCHOR);
    delete window.__INIT_THING_ANCHOR;
  } // TODO: replace to class-based event binding


  $(document.body).on('click', 'a', function (event) {
    if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isPlainLeftClick)(event) && this.getAttribute('data-prevent-overlay') == null && (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getObjectTypeFromUrl)((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getPathname)(this)) === 'Thing') {
      event.preventDefault(); // note: key event will be detached inside `closeOverlay()` call

      $(document).on('keydown.overlayThing', handleOverlayThingKeyEvents);
      conditionalTransition(this);
    }
  });
  $('#overlay-thing').on('click', '.popup.overlay-thing', function (event) {
    var $targ = $(event.target); // Center container

    if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.didClickOn)($targ, '.sidebar') || (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.didClickOn)($targ, '.thing-detail-container .content') || (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.didClickOn)($targ, '.thing-detail-container .timeline') || (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.eitherFancy)('Admin', function (_ref) {
      var sharedState = _ref.sharedState;
      return sharedState.draggingAdmin;
    })) {// pass
      // prev button
    } else if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.didClickOn)($targ, '.popup_prev')) {
      _routeutils__WEBPACK_IMPORTED_MODULE_3__.pagingContext.movePrev();
      return false; // next button
    } else if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.didClickOn)($targ, '.popup_next')) {
      _routeutils__WEBPACK_IMPORTED_MODULE_3__.pagingContext.moveNext();
      return false;
    } else {
      _store_store__WEBPACK_IMPORTED_MODULE_1__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_4__.closeOverlay)());
    }
  });
}
var OtContainer = {
  isStaticCache: undefined,
  isStatic: function isStatic() {
    if (this.isStaticCache === undefined) {
      this.isStaticCache = $(document.body).is('.static-ot');
    }

    return this.isStaticCache;
  },
  getDynamic: function getDynamic() {
    return $('#overlay-thing .thing-detail');
  },
  getStatic: function getStatic() {
    return $(document);
  },
  get: function get() {
    return this.isStatic() ? this.getStatic() : this.getDynamic();
  },
  scrollToTop: function scrollToTop() {
    if (this.isStatic()) {
      $(document.body.parentElement).scrollTop(0);
    } else {
      $('#overlay-thing').scrollTop(0);
    }
  }
};
window.OtContainer = OtContainer; // Only one event is allowed

var scrollEvent = {
  handleScroll: null,
  attach: function attach(func, prepare) {
    if (scrollEvent.handleScroll != null) {
      scrollEvent.detach();
    }

    var _prepare = prepare != null ? prepare : 10;

    var handleScroll = _.throttle(function () {
      if (OtContainer.isStatic()) {
        var viewportHeight = document.documentElement.clientHeight;

        if (scrollEvent.visible === true) {
          // console.debug('$(window).height() - $(window).scrollTop() - _prepare <= viewportHeight', $(window).height(), $(window).scrollTop(), _prepare, viewportHeight, $(window).height() - $(window).scrollTop() - _prepare <= viewportHeight)
          if (document.documentElement.scrollHeight - $(window).scrollTop() - _prepare <= viewportHeight) {
            func(true);
          }
        }
      } else {
        var el = this;
        var _viewportHeight = el.clientHeight;

        if (scrollEvent.visible === true) {
          if (el.scrollHeight - el.scrollTop - _prepare <= _viewportHeight) {
            func(true);
          }
        }
      }
    }, 50);

    this.handleScroll = handleScroll;
    var containerEl = OtContainer.isStatic() ? OtContainer.get().get(0) : $('#overlay-thing').get(0);
    containerEl.addEventListener('scroll', handleScroll, {
      passive: true
    });
    handleScroll();
  },
  detach: function detach() {
    var containerEl = OtContainer.get().get(0);
    containerEl.removeEventListener('scroll', this.handleScroll);
  },
  visible: false // copied variable on `state.appContext.visible` change

};

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/container/history.js":
/*!***************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/container/history.js ***!
  \***************************************************************/
/*! namespace exports */
/*! export historyData [provided] [no usage info] [missing usage info prevents renaming] */
/*! export historyHook [provided] [no usage info] [missing usage info prevents renaming] */
/*! export reloadCurrentThing [provided] [no usage info] [missing usage info prevents renaming] */
/*! export runOverlay [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "historyData": () => /* binding */ historyData,
/* harmony export */   "runOverlay": () => /* binding */ runOverlay,
/* harmony export */   "reloadCurrentThing": () => /* binding */ reloadCurrentThing,
/* harmony export */   "historyHook": () => /* binding */ historyHook
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/store */ "./_static/modules/ui/overlay-thing/store/store.ts");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");




var initialThingPageID = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromURL)(location.pathname).id;
var initialPageIsThingPage = initialThingPageID != null; // This stores initial static page history info that needs to be restored when modal get closed.

var historyData = {
  initialPath: location.pathname,

  /* mut */
  preservedHref: location.href,
  // Preserved Href just before open, and to be returned when closed.
  initialThingPageID: initialThingPageID,
  initialPageIsThingPage: initialPageIsThingPage,
  initialTitle: document.title,
  // This prop indicates current location is (static) thing page. Mutable.
  locationIsThingPage: initialPageIsThingPage,
  overlayIsOn: false
};
function runOverlay(thingID, thingURLType) {
  var killCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var queryString = arguments.length > 3 ? arguments[3] : undefined;

  // Context needs to be isolated from hook: https://github.com/rackt/redux-router/issues/157
  if (!$(document.body).hasClass('error-page')) {
    requestIdleCallback(function () {
      $(document.body).addClass('thing-overlay-on');
      _store_store__WEBPACK_IMPORTED_MODULE_2__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_3__.fetchThing)(thingID, thingURLType, killCache, false, queryString));
      historyData.overlayIsOn = true;
    });
  }
}

function stopOverlay() {
  historyData.overlayIsOn = false;
  _store_store__WEBPACK_IMPORTED_MODULE_2__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_3__.closeOverlay)());
}

function reloadCurrentThing() {
  var meta = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromURL)(location.href);
  var thingID = meta && meta.id;

  if (thingID != null && historyData.overlayIsOn) {
    runOverlay(thingID, meta.type, true);
  }
}
function historyHook(_ref) {
  var pathname = _ref.pathname,
      search = _ref.search;
  var meta = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromURL)(pathname);
  var thingID = meta && meta.id; // When initially (statically) renderred page is thing page
  // Moving to new thing page

  historyData.locationIsThingPage = thingID != null;

  if (historyData.locationIsThingPage) {
    runOverlay(thingID, meta.type, false, search);
  } else if (historyData.overlayIsOn) {
    stopOverlay();
  }
}
common_components__WEBPACK_IMPORTED_MODULE_1__.history.listen(historyHook);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/container/routeutils.js":
/*!******************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/container/routeutils.js ***!
  \******************************************************************/
/*! namespace exports */
/*! export LinkTypes [provided] [no usage info] [missing usage info prevents renaming] */
/*! export closeModal [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getUtmString [provided] [no usage info] [missing usage info prevents renaming] */
/*! export pagingContext [provided] [no usage info] [missing usage info prevents renaming] */
/*! export redirect [provided] [no usage info] [missing usage info prevents renaming] */
/*! export transition [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkTypes": () => /* binding */ LinkTypes,
/* harmony export */   "transition": () => /* binding */ transition,
/* harmony export */   "closeModal": () => /* binding */ closeModal,
/* harmony export */   "pagingContext": () => /* binding */ pagingContext,
/* harmony export */   "redirect": () => /* binding */ redirect,
/* harmony export */   "getUtmString": () => /* binding */ getUtmString
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./history */ "./_static/modules/ui/overlay-thing/container/history.js");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");



var LinkTypes = {
  Dynamic: 0,
  Static: 1,
  Timeline: 2,
  Internal: 3 // no update needed

}; // `staticLink`: transition from statically attached links

function transition(href) {
  var linkType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LinkTypes.Dynamic;

  // ID-only
  if (!_.isNaN(Number(href))) {
    href = "/things/".concat(href);
  }

  if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getObjectTypeFromUrl)(href) === "Thing") {
    var meta = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromURL)(href); // Update URL to go back when overlay is closed

    if (!_history__WEBPACK_IMPORTED_MODULE_1__.historyData.overlayIsOn) {
      _history__WEBPACK_IMPORTED_MODULE_1__.historyData.preservedHref = location.href;
    }

    common_components__WEBPACK_IMPORTED_MODULE_2__.history.push((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.stripPathname)(meta.href), null);
  } else {
    redirect(href);
  }
}
function closeModal() {
  if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isStaticPage)()) {
    return;
  }

  $(document.body).removeClass("thing-overlay-on"); // FIXME: isolate modal logic
} // NOOP

var pagingContext = {
  init: function init() {},
  movePrev: function movePrev() {},
  moveNext: function moveNext() {}
};
function redirect(destination) {
  if (destination == null) {
    return false;
  } else {
    location.href = destination;
    return true;
  }
}

function getUtm() {
  var $nav = $('.navigation');

  if ($nav.length > 0) {
    if ($nav.find('a.current[data-feed="featured"]').length > 0) {
      return "timeline_featured";
    } else if ($nav.find('a.current[data-feed="recommended"]').length > 0) {
      return "timeline_recommended";
    } else {
      var $shopLink = $nav.find('.shop li a');

      if ($shopLink.eq(0).is('.current')) {
        return "shop";
      } else if ($shopLink.eq(1).is('.current')) {
        return "";
      } else if ($shopLink.eq(2).is('.current')) {
        return "popular";
      } else if ($shopLink.eq(3).is('.current')) {
        return "newest";
      } else if ($shopLink.eq(4).is('.current')) {
        return "editors_picks";
      } else if ($shopLink.eq(5).is('.current')) {
        return "sales";
      }
    }
  } else {
    if ($('.wrapper-content.profile-section').length > 0) {
      return "userprofile";
    } else if ($('.wrapper-content.merchant').length > 0) {
      return "seller_shop";
    }
  }
}

function getUtmString() {
  var utm = getUtm();

  if (utm) {
    return "?utm=".concat(utm);
  } else {
    return '';
  }
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/reducers.ts":
/*!******************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/reducers.ts ***!
  \******************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread */ "./node_modules/@babel/runtime/helpers/objectSpread.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @reduxjs/toolkit */ "./node_modules/redux/es/redux.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _action_action_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./action/action-constants */ "./_static/modules/ui/overlay-thing/action/action-constants.js");
/* harmony import */ var _store_initial_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./store/initial-store */ "./_static/modules/ui/overlay-thing/store/initial-store.ts");
/* harmony import */ var _components_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/map */ "./_static/modules/ui/overlay-thing/components/map.ts");
/* harmony import */ var _appstate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./appstate */ "./_static/modules/ui/overlay-thing/appstate.ts");
/* harmony import */ var _container_entry_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./container/entry-events */ "./_static/modules/ui/overlay-thing/container/entry-events.js");
/* harmony import */ var _ThingTypes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ThingTypes */ "./_static/modules/ui/overlay-thing/ThingTypes.js");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./cache */ "./_static/modules/ui/overlay-thing/cache.js");











var loaded = false;
var lastFullyRenderedThingID = 0;

function appContext() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("appContext");
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.OPEN_THING:
      _container_entry_events__WEBPACK_IMPORTED_MODULE_6__.scrollEvent.visible = true;
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)(state, {
        visible: true
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CLOSE_THING:
      _container_entry_events__WEBPACK_IMPORTED_MODULE_6__.scrollEvent.visible = false;
      lastFullyRenderedThingID = 0;
      loaded = false;
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)(state, {
        visible: false,
        lastFullyRenderedThingID: lastFullyRenderedThingID
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.UPDATE_APP_CONTEXT:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)(state, action.context);

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.LOAD_THING:
      {
        // Due to multi-stage rendering (cache -> from-server-data -> ...)
        // it is unable to check state change correctly just by comparing ID;
        // Therefore, we set internal state per every update cycle and check
        // if state is fully updated.
        // FIXME: when cached response exist, it marks as rendered before
        if (loaded === true && lastFullyRenderedThingID !== action.data.id && action.data.fromServer) {
          lastFullyRenderedThingID = action.data.id;
        }

        var loggedIn = window.__FancyUser.loggedIn;
        var viewer = action.data.viewer || {};
        var userCountry = $.cookie.get("shipping_country_code") || action.data.current_country_code || state.userCountry;
        (0,_appstate__WEBPACK_IMPORTED_MODULE_5__.updateState)("loggedIn", loggedIn);
        (0,_appstate__WEBPACK_IMPORTED_MODULE_5__.updateState)("viewer", viewer);
        loaded = true;
        return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, {
          lastFullyRenderedThingID: lastFullyRenderedThingID,
          loggedIn: loggedIn,
          viewer: viewer,
          userCountry: userCountry
        });
      }

    default:
      return state;
  }
}

function populateThingContext(thingData) {
  thingData.loading = thingData.fromServer !== true;
  thingData.META = (0,_ThingTypes__WEBPACK_IMPORTED_MODULE_7__.getThingType)(thingData);
  thingData.URLMeta = (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.extractMetaFromURL)(location.href); // FIXME: provide current pathname

  thingData.owner = thingData.user;
} // Thing context


function thing() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("thing");
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.LOAD_THING:
      populateThingContext(action.data);
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)(state, {
        data: action.data,
        status: action.status,
        ID: action.ID,
        pendingID: null,
        isFetching: false
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.REQUEST_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, {
        pendingID: action.pendingID,
        status: action.status,
        isFetching: true
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.REQUEST_THING_FAILURE:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, {
        status: action.status,
        isFetching: false
      });
    // Reset state

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CLOSE_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("thing"));

    default:
      return state;
  }
} // Follow contexts


function followContext() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("followContext");
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    // reset thing context on new thing loading / closing.
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.LOAD_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("followContext"), {
        id: action.data.id,
        followStore: {
          following: action.data.sales ? Boolean(action.data.sales.seller && action.data.sales.seller.seller_follow) : false,
          loading: false
        },
        followUser: {
          following: action.data ? Boolean(action.data.following) : false,
          loading: false
        }
      });
    // Sidebar
    // Follow seller/user

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.TOGGLE_FOLLOW:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, action.followType, {
        loading: true,
        following: !state[action.followType].following
      }));

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CANCEL_FOLLOW:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, action.followType, {
        loading: false,
        following: !state[action.followType].following
      }));

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.COMPLETE_FOLLOW:
      if (action.followType === "followStore") {
        _cache__WEBPACK_IMPORTED_MODULE_8__.cache.update(state.id, undefined, "sales.seller.seller_follow", state[action.followType].following);
      }

      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, action.followType, {
        loading: false,
        following: state[action.followType].following
      }));

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CLOSE_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("followContext"));

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


function fancyContext() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("fancyContext");
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    // reset thing context on new thing loading / closing.
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.LOAD_THING:
      // Extract thing data for initial thing context data reset.
      // onFancyButtonUpdate(action.data.id, action.data.fancyd, getConciseNumberString(action.data.fancyd_count));
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("fancyContext"), {
        id: action.data.id,
        fancyd: action.data.fancyd,
        fancyd_count: action.data.fancyd_count,
        loading: false //status: FancyStatus.Idle,

      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.TOGGLE_FANCY:
      var nextFancydState = !state.fancyd; // return update(state, {
      //     fancyd: nextFancydState,
      //     loading: true,
      //     //status: getFancyStatus(nextFancydState)
      // });

      return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, state, {
        fancyd: nextFancydState,
        loading: true //status: getFancyStatus(nextFancydState)

      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CANCEL_FANCY:
      {
        var _nextFancydState = !state.fancyd; // return update(state, {
        //     fancyd: nextFancydState,
        //     loading: false,
        //     //status: getFancyStatus(nextFancydState)
        // });


        return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, state, {
          fancyd: _nextFancydState,
          loading: false //status: getFancyStatus(nextFancydState)

        });
      }
    // Update data

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.COMPLETE_FANCY:
      // cache.update(state.id, undefined, "fancyd", state.fancyd);
      // cache.update(state.id, undefined, "fancyd_count", action.fancyd_count);
      // onFancyButtonUpdate(state.id, state.fancyd, getConciseNumberString(action.fancyd_count));
      // return update(state, {
      //     loading: false,
      //     fancyd_count: action.fancyd_count,
      //     //status: getCompletionIdleStatus(state.fancyd)
      // });
      return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, state, {
        loading: false,
        fancyd_count: action.fancyd_count //status: getCompletionIdleStatus(state.fancyd)

      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CLOSE_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("fancyContext"));

    default:
      return state;
  }
}

function slideContext() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("slideContext");
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    // reset thing context on new thing loading / closing.
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.LOAD_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("slideContext"), {
        id: action.data.id
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.SET_THUMBNAIL_INDEX:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, {
        thumbnailIndex: action.thumbnailIndex
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CLOSE_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("slideContext"));

    default:
      return state;
  }
}

function saleContext() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("saleContext");
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    // reset thing context on new thing loading / closing.
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.LOAD_THING:
      {
        // Extract thing data for initial thing context data reset.
        var _thing = action.data;
        var sales = _thing && _thing.sales;
        var saleOptionInclSales = (0,_components_map__WEBPACK_IMPORTED_MODULE_4__.getFirstSaleOption)(sales);
        var nextContext = {
          selectedQuantity: 1,
          // saleOptionID: (saleOptionInclSales && saleOptionInclSales.id) || null,
          saleOptionID: null,
          currencyCode: action.data.currency_code,
          price: saleOptionInclSales && saleOptionInclSales.price || null,
          waiting: null
        };
        return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("saleContext"), nextContext);
      }

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.CLOSE_THING:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_9__.getInitialStoreState)("saleContext"));

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_3__.default.UPDATE_SALE_CONTEXT:
      {
        // Setting waiting
        if (action.waiting != null) {
          (0,_components_map__WEBPACK_IMPORTED_MODULE_4__.setWaiting)(state.saleOptionID, action.waiting);
        }

        var waiting = action.waiting; // Reset quantity / Change waiting if option is changed.

        if (action.saleOptionID != null && action.saleOptionID !== state.saleOptionID) {
          action.selectedQuantity = 1;
          waiting = null;
        }

        var _nextContext = {
          selectedQuantity: action.selectedQuantity,
          saleOptionID: action.saleOptionID,
          // `thing.id`? | `sio.id`?
          price: action.price,
          // (props.thing.sales_available && props.thing.sales.price) || null,
          // UI
          currencyCode: action.currencyCode,
          // props.thing.currency_code
          currencyMoney: action.currencyMoney,
          //
          currencySymbol: action.currencySymbol,
          //
          personalization: action.personalization,
          waiting: waiting
        };
        return (0,fancyutils__WEBPACK_IMPORTED_MODULE_2__.update)(state, _nextContext);
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


var rootReducer = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_10__.combineReducers)({
  appContext: appContext,
  // Thing contexts
  followContext: followContext,
  fancyContext: fancyContext,
  slideContext: slideContext,
  saleContext: saleContext,
  // etc.
  thing: thing
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rootReducer);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/store/initial-store.ts":
/*!*****************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/store/initial-store.ts ***!
  \*****************************************************************/
/*! namespace exports */
/*! export getAllInitialStoreState [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getInitialStoreState [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getInitialStoreState": () => /* binding */ getInitialStoreState,
/* harmony export */   "getAllInitialStoreState": () => /* binding */ getAllInitialStoreState
/* harmony export */ });
// Warning: objects has to be flat in each context
function getInitialStoreState(contextName) {
  switch (contextName) {
    case 'appContext':
      return {
        visible: false,
        viewer: {},
        loggedIn: null,
        userCountry: 'US',
        applePayDisplay: false,
        applePayTest: false
      };

    case 'thing':
      return {
        data: null,
        ID: null,
        pendingID: null,
        isFetching: null,
        status: 'idle' // { idle | request | failed }

      };

    case 'followContext':
      return {
        id: null,
        followStore: {
          following: undefined,
          loading: false
        },
        followUser: {
          following: undefined,
          loading: false
        }
      };

    case 'fancyContext':
      return {
        id: null,
        fancyd_count: 0,
        fancyd: false,
        loading: false,
        status: 'Idle' // { Idle | Addition | Removal | After- } - Fancy'd status for animation control 

      };

    case 'saleContext':
      return {
        selectedQuantity: 1,
        saleOptionID: null,
        // `thing.id`? | `sio.id`?
        currencyCode: null,
        // props.thing.currency_code
        currencyMoney: null,
        //
        currencySymbol: null,
        //
        price: null,
        // (props.thing.sales_available && props.thing.sales.price) || null,
        personalization: null
      };

    case 'slideContext':
      return {
        id: null,
        thumbnailIndex: 0
      };

    default:
      console.warn('`getInitialStoreState()`: Unknown context name ', contextName);
  }
}
;
var contexts = ['slideContext', 'saleContext', 'fancyContext', 'followContext', 'thing', 'appContext'];
function getAllInitialStoreState() {
  return contexts.reduce(function (state, contextKey) {
    state[contextKey] = getInitialStoreState(contextKey);
    return state;
  }, {});
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/store/store.ts":
/*!*********************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/store/store.ts ***!
  \*********************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @reduxjs/toolkit */ "./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux-thunk */ "./node_modules/redux-thunk/es/index.js");
/* harmony import */ var redux_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux-logger */ "./node_modules/redux-logger/dist/redux-logger.js");
/* harmony import */ var redux_logger__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux_logger__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _initial_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./initial-store */ "./_static/modules/ui/overlay-thing/store/initial-store.ts");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reducers */ "./_static/modules/ui/overlay-thing/reducers.ts");




 // import type { RootState } from '../reducers';

var middlewares = [redux_thunk__WEBPACK_IMPORTED_MODULE_0__.default];

if (true) {
  middlewares.push((redux_logger__WEBPACK_IMPORTED_MODULE_1___default()));
}

var store = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.configureStore)({
  reducer: _reducers__WEBPACK_IMPORTED_MODULE_2__.default,
  preloadedState: (0,_initial_store__WEBPACK_IMPORTED_MODULE_4__.getAllInitialStoreState)(),
  middleware: function middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false
    }).prepend(middlewares);
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (store);

/***/ })

}]);
//# sourceMappingURL=_static_modules_ui_overlay-thing_components_v2_Thing_Image_index_tsx-_static_modules_ui_overl-b8f045.24e7a90d873d869dc4e6.js.map