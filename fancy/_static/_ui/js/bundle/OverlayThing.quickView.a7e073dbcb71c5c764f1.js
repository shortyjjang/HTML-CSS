/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./_static/modules/ui/overlay-thing/components/v2/QuickViewPopup.tsx":
/*!***************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/QuickViewPopup.tsx ***!
  \***************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ QuickViewPopup
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _bugsnag_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @bugsnag/js */ "./node_modules/@bugsnag/js/browser/notifier.js");
/* harmony import */ var _bugsnag_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_bugsnag_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @bugsnag/plugin-react */ "./node_modules/@bugsnag/plugin-react/dist/bugsnag-react.js");
/* harmony import */ var _bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");
/* harmony import */ var _Thing_SaleItem__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Thing/SaleItem */ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/index.tsx");
/* harmony import */ var _Thing_Image__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Thing/Image */ "./_static/modules/ui/overlay-thing/components/v2/Thing/Image/index.tsx");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../store/store */ "./_static/modules/ui/overlay-thing/store/store.ts");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../map */ "./_static/modules/ui/overlay-thing/components/map.ts");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");






















var QuickViewPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default()(QuickViewPopup, _React$Component);

  function QuickViewPopup() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, QuickViewPopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(QuickViewPopup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this), "handleCancelClick", function (event) {
      event.preventDefault();
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.closePopup)(QuickViewPopup.popupName);
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(QuickViewPopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $.dialog(QuickViewPopup.popupName).center();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(QuickView, {
        thingID: this.props.thingID
      });
    }
  }]);

  return QuickViewPopup;
}(react__WEBPACK_IMPORTED_MODULE_9__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(QuickViewPopup, "popupName", "thing-quickview");



var QuickView = function QuickView(_ref) {
  var thingID = _ref.thingID;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_19__.Provider, {
    store: _store_store__WEBPACK_IMPORTED_MODULE_16__.default
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(QuickViewEnhanced, {
    thingID: thingID
  }));
};

var QuickViewInside = function QuickViewInside(_ref2) {
  var thingID = _ref2.thingID,
      props = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1___default()(_ref2, ["thingID"]);

  var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_19__.useDispatch)();
  var ct = props.thing;
  (0,react__WEBPACK_IMPORTED_MODULE_9__.useEffect)(function () {
    if (!ct) {
      return;
    }

    if (ct.sales && ct.sales.options && ct.sales.options.length > 1) {
      var nonSoldoutOptions = ct.sales.options.filter(function (o) {
        return !o.soldout;
      });
      var minimumOption;

      if (nonSoldoutOptions.length > 0) {
        minimumOption = _.min(nonSoldoutOptions, function (o) {
          return Number(o.price);
        });
      } else {
        minimumOption = _.min(ct.sales.options, function (o) {
          return Number(o.price);
        });
      }

      if (ct.sales.options[0].id !== minimumOption.id) {
        dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_17__.updateSaleContext)({
          saleOptionID: minimumOption.id
        }));
      }
    }
  }, [ct]);
  (0,react__WEBPACK_IMPORTED_MODULE_9__.useEffect)(function () {
    dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_17__.fetchThing)(thingID, "things", false, false, ""));
  }, [thingID]);

  if (!props.thing?.sales) {
    return null;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(_FancyContext__WEBPACK_IMPORTED_MODULE_13__.default.Provider, {
    value: props.thing ? props : (0,_FancyContext__WEBPACK_IMPORTED_MODULE_13__.getFancyContextDefaultValue)()
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(QuickviewContent, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(_Thing_Image__WEBPACK_IMPORTED_MODULE_15__.default, {
    imageOnly: true,
    thumbsPerView: 4,
    galleryThumbsDirection: "horizontal"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(_Thing_SaleItem__WEBPACK_IMPORTED_MODULE_14__.default, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
    showInfo: false
  }, props)));
};

var QuickviewContent = function QuickviewContent() {
  var fancyProps = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_13__.useFancy)();
  var thing = fancyProps.thing,
      sales = fancyProps.thing.sales;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(react__WEBPACK_IMPORTED_MODULE_9__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
    className: "title"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
    href: "#",
    className: "brand"
  }, "Richard Clarkson Design"), thing.emojified_name, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(Price, fancyProps)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("dl", {
    className: "description optional"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("dt", null, "Description"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("dd", {
    className: "collapsed"
  }, "Brass rods are pushed into each of these holes forming a concave structure reminiscent of a bike wheel. The holes are drilled to such a fine tolerance..."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
    className: "more",
    href: thing.url
  }, "See Full Details")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
    href: thing.url,
    className: "btn-detail"
  }, "See Full Details"));
};

var Price = function Price(_ref3) {
  var thing = _ref3.thing,
      saleContext = _ref3.saleContext;
  var opt = (0,_map__WEBPACK_IMPORTED_MODULE_18__.getCurrentSaleOption)(thing.sales, saleContext);
  var discountPercentage = parseFloat(opt.discount_percentage); // TODO: use decimal?

  var discounting = discountPercentage > 0;
  var retailPrice = opt.retail_price;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
    className: "price"
  }, "$", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.floatFormatMinusTwo)(saleContext.price), discounting && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(react__WEBPACK_IMPORTED_MODULE_9__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("em", {
    className: "before"
  }, "$", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.floatFormatMinusTwo)(retailPrice)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("small", {
    className: "saved"
  }, "(Save ", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(discountPercentage, 0), "%)")));
};

if (__Config.bugsnag) {
  _bugsnag_js__WEBPACK_IMPORTED_MODULE_11___default().start({
    apiKey: "a54d48e98cb0410b7bdf0e60a905b00e",
    plugins: [new (_bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_12___default())()],
    user: {
      id: window.__FancyUser?.id || null
    }
  });
}

var ReduxComponentEnhancer = (0,react_redux__WEBPACK_IMPORTED_MODULE_19__.connect)(_map__WEBPACK_IMPORTED_MODULE_18__.mapStateToThingProps);
var QuickViewEnhanced = ReduxComponentEnhancer(QuickViewInside);
$(".quickview-open").on("click", function () {
  var tid = $(this).attr("data-tid");
  (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.renderPopup)(QuickViewPopup, {
    thingID: tid
  });
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			if(mode & 2 && typeof value == 'object' && value) {
/******/ 				for(const key in value) def[key] = () => value[key];
/******/ 			}
/******/ 			def['default'] = () => value;
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + {"OverlayThing.popup":"f9395948bbe2f717a5f8","OverlayThing.admin":"db09eb762af8c32c5be5"}[chunkId] + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "fancy:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => fn(event));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/_static/_ui/js/bundle/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"OverlayThing.quickView": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./_static/modules/ui/overlay-thing/components/v2/QuickViewPopup.tsx","vendors","libfancy","_static_modules_ui_overlay-thing_components_v2_Thing_Image_index_tsx-_static_modules_ui_overl-b8f045"]
/******/ 		];
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => {
/******/ 								installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 							});
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = () => {
/******/ 		
/******/ 		};
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = () => {
/******/ 		
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = () => {
/******/ 		
/******/ 			}
/******/ 			chunkLoadingGlobal = chunkLoadingGlobal.slice();
/******/ 			for(var i = 0; i < chunkLoadingGlobal.length; i++) webpackJsonpCallback(chunkLoadingGlobal[i]);
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkfancy"] = self["webpackChunkfancy"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	return __webpack_require__.x();
/******/ })()
;
//# sourceMappingURL=OverlayThing.quickView.a7e073dbcb71c5c764f1.js.map