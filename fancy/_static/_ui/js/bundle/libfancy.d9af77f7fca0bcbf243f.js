(self["webpackChunkfancy"] = self["webpackChunkfancy"] || []).push([["libfancy"],{

/***/ "./_static/modules/libf/CDNUtils.js":
/*!******************************************!*\
  !*** ./_static/modules/libf/CDNUtils.js ***!
  \******************************************/
/*! namespace exports */
/*! export cdnUtils [provided] [no usage info] [missing usage info prevents renaming] */
/*! export schemeless [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "schemeless": () => /* binding */ schemeless,
/* harmony export */   "cdnUtils": () => /* binding */ cdnUtils
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);




var CDNUtils = /*#__PURE__*/function () {
  function CDNUtils() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, CDNUtils);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "HOSTS", {});

    // init hosts
    this.makeServer('THINGD_MEDIA', 'thingd-media-ec.thefancy.com');
    this.makeServer('THEFANCY_MEDIA', 'thefancy-media-ec.thefancy.com');
    this.makeServer('RESIZE_IMAGE', 'resize-ec.thefancy.com');
    this.makeServer('STATICFILES', 'static-ec.thefancy.com');
    this.makeServer('FANCY_WEB', 'site-ec.thefancy.com');
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(CDNUtils, [{
    key: "makeServer",
    value: function makeServer(type, template) {
      var HOSTS = this.HOSTS;

      if (!HOSTS[type]) {
        HOSTS[type] = [];
      }

      HOSTS[type].push(template);
    }
  }, {
    key: "getResizeURL",
    value: function getResizeURL(url, size, method, isSchemeless, cdn) {
      var parts = window.parseURL(url);
      var fixedName = /test_default/.test(parts.pathname) ? 'thingd' : 'thefancy';
      var path = "/resize/".concat(method ? method + '/' : '').concat(size, "/").concat(fixedName).concat(parts.pathname);
      var resizeUrl;

      if (cdn) {
        resizeUrl = this.getCDNURL(path);
      } else {
        resizeUrl = "".concat(parts.protocol, "//").concat(parts.hostname).concat(path);
      }

      if (isSchemeless) {
        resizeUrl = schemeless(resizeUrl);
      }

      return resizeUrl;
    }
  }, {
    key: "getCDNURL",
    value: function getCDNURL(url) {
      var HOSTS = this.HOSTS;
      var candidates;
      var parts = window.parseURL ? window.parseURL(url) : {};
      var path = parts.pathname;

      if (parts.hostname == 's3.amazonaws.com') {
        if (/\/media\.thefancy\.com/.test(parts.pathname)) {
          path = parts.pathname.replace(/^\/media\.thefancy\.com/, '');
          candidates = HOSTS.THEFANCY_MEDIA;
        } else if (/\/media\.thingd\.com/.test(parts.pathname)) {
          path = parts.pathname.replace(/^\/media\.thingd\.com/, '');
          candidates = HOSTS.THINGD_MEDIA;
        }
      } else if (/^\/(test_)?default/.test(path)) {
        candidates = HOSTS.THINGD_MEDIA;
      } else if (/^\/_ui/.test(path)) {
        candidates = HOSTS.FANCY_WEB;
      } else if (/^\/(resize|mark)/.test(path)) {
        candidates = HOSTS.RESIZE_IMAGE;
      } else if (/^\/_static_gen/.test(path)) {
        candidates = HOSTS.STATICFILES;
      } else {
        candidates = HOSTS.THEFANCY_MEDIA;
      }

      var hostname = candidates[sumChars(path.replace(/[^a-zA-Z0-9_]+/g, '')) % candidates.length];
      return '//' + hostname + path;
    } // Get REST URI for given resized_schemeless_image arguments
    // See `fancy.templatetags.resized_images`

  }, {
    key: "resizedSchemelessImage",
    value: function resizedSchemelessImage(url, size, method) {
      // FIXME: some url (like cover image, user image, etc) gives weird url
      //        and `window.parseURL()` attaches it to location.pathname.
      //        This is temporary fix for it
      if (url.match(/^(CoverImages\/|UserImages\/)/)) {
        url = "/".concat(url);
      }

      return this.getResizeURL(url, size, method, true, true);
    }
  }]);

  return CDNUtils;
}();

function sumChars(str) {
  var sum = 0,
      i,
      c;

  for (i = 0, c = str.length; i < c; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
}

function schemeless(url) {
  var match = typeof url === 'string' && url.match(/[http|https]\:(\/\/.*)/);
  return match == null ? url : match[1];
}
var cdnUtils = new CDNUtils();

/***/ }),

/***/ "./_static/modules/libf/CopyToClipboard.js":
/*!*************************************************!*\
  !*** ./_static/modules/libf/CopyToClipboard.js ***!
  \*************************************************/
/*! namespace exports */
/*! export copyToClipboard [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "copyToClipboard": () => /* binding */ copyToClipboard
/* harmony export */ });
/* harmony import */ var toggle_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! toggle-selection */ "./node_modules/toggle-selection/index.js");
/* harmony import */ var toggle_selection__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(toggle_selection__WEBPACK_IMPORTED_MODULE_0__);
// Removed prompt from 'copy-to-clipboard'
// https://github.com/sudodoki/copy-to-clipboard/blob/04386fe925e10fec353e35e81684c5c96920102e/index.js

function copyToClipboard(text, options) {
  var cb, reselectPrevious, range, selection, mark;

  if (!options) {
    options = {};
  }

  cb = options.cb || Function.prototype;

  try {
    reselectPrevious = toggle_selection__WEBPACK_IMPORTED_MODULE_0___default()();
    range = document.createRange();
    selection = document.getSelection();
    mark = document.createElement('mark');
    mark.textContent = text; // used to conserve newline, etc

    mark.style.whiteSpace = 'pre';
    document.body.appendChild(mark);
    range.selectNode(mark);
    selection.addRange(range);
    var successful = document.execCommand('copy');

    if (!successful) {
      console.warn('unable to copy via execCommand');
      window.clipboardData.setData('text', text);
    }
  } catch (err) {
    console.warn(err);
  } finally {
    cb(null);

    if (selection) {
      if (typeof selection.removeRange == 'function') {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }

    reselectPrevious();
  }
}

/***/ }),

/***/ "./_static/modules/libf/FancyMixin.js":
/*!********************************************!*\
  !*** ./_static/modules/libf/FancyMixin.js ***!
  \********************************************/
/*! namespace exports */
/*! export BGImage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export Display [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getElementGapFromHeader [provided] [no usage info] [missing usage info prevents renaming] */
/*! export initialDisplayNone [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialDisplayNone": () => /* binding */ initialDisplayNone,
/* harmony export */   "Display": () => /* binding */ Display,
/* harmony export */   "BGImage": () => /* binding */ BGImage,
/* harmony export */   "getElementGapFromHeader": () => /* binding */ getElementGapFromHeader
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _FancyUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FancyUtils */ "./_static/modules/libf/FancyUtils.ts");
// built from 'webpack.FancyUtils.config.js'
// loaded from 'FancyUtils.js' and exported as global module 'fancymixin'


var initialDisplayNone = {
  display: 'none'
}; // DEPRECATED

var Display = {
  None: {
    display: 'none'
  },
  Block: {
    display: 'block'
  },
  Inline: {
    display: 'inline'
  },
  InlineBlock: {
    display: 'inline-block'
  },
  NoneIf: function NoneIf(cond) {
    return cond ? Display.None : undefined;
  },
  BlockIf: function BlockIf(cond) {
    return cond ? Display.Block : undefined;
  },
  InlineIf: function InlineIf(cond) {
    return cond ? Display.Inline : undefined;
  },
  InlineBlockIf: function InlineBlockIf(cond) {
    return cond ? Display.InlineBlock : undefined;
  }
}; // Image using background-image

var BGImage = function BGImage(_ref) {
  var alt = _ref.alt,
      className = _ref.className,
      schemeless = _ref.schemeless,
      url = _ref.url;
  var backgroundImage = '';

  if (url) {
    backgroundImage = "url(".concat(schemeless ? (0,_FancyUtils__WEBPACK_IMPORTED_MODULE_1__.schemeless)(url) : url, ")");
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
    src: "/_ui/images/common/blank.gif",
    style: {
      backgroundImage: backgroundImage
    },
    className: className,
    alt: alt
  });
}; // measurePointElement = .figure-item.btn-more
// https://app.asana.com/0/260912680807/218844368911219

function getElementGapFromHeader(measurePointElement
/*:Element*/
)
/*:number*/
{
  var $headerFeatured = $('#header .header-featured');
  var $header = $('#header');
  var destHeight = $header.height();

  if ($headerFeatured.attr('data-expanded') === 'true') {
    destHeight += $headerFeatured.height();
  }

  return ~(document.body.scrollTop - $(measurePointElement).offset().top + destHeight) + 1; // convert - => + / + => -, integer
}

/***/ }),

/***/ "./_static/modules/libf/FancyUtils.ts":
/*!********************************************!*\
  !*** ./_static/modules/libf/FancyUtils.ts ***!
  \********************************************/
/*! namespace exports */
/*! export ClickOutside [provided] [no usage info] [missing usage info prevents renaming] */
/*! export FancyUser [provided] [no usage info] [missing usage info prevents renaming] */
/*! export KEYS [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MP [provided] [no usage info] [missing usage info prevents renaming] */
/*! export alertify [provided] [no usage info] [missing usage info prevents renaming] */
/*! export cartesianProductOf [provided] [no usage info] [missing usage info prevents renaming] */
/*! export cdnUtils [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/CDNUtils.js .cdnUtils */
/*! export closePopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/PopupHelper.js .closePopup */
/*! export convertThingsV1ToRest [provided] [no usage info] [missing usage info prevents renaming] */
/*! export copyToClipboard [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/CopyToClipboard.js .copyToClipboard */
/*! export debounceEventUntilTimeout [provided] [no usage info] [missing usage info prevents renaming] */
/*! export debounceUntilTimeout [provided] [no usage info] [missing usage info prevents renaming] */
/*! export dedupeArray [provided] [no usage info] [missing usage info prevents renaming] */
/*! export didClickOn [provided] [no usage info] [missing usage info prevents renaming] */
/*! export eitherFancy [provided] [no usage info] [missing usage info prevents renaming] */
/*! export escapeSelector [provided] [no usage info] [missing usage info prevents renaming] */
/*! export extractMetaFromArticleURL [provided] [no usage info] [missing usage info prevents renaming] */
/*! export extractMetaFromURL [provided] [no usage info] [missing usage info prevents renaming] */
/*! export floatFormatMinusTwo [provided] [no usage info] [missing usage info prevents renaming] */
/*! export formatDuration [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getCaretPos [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getConciseNumberString [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getDisplay [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getFancyDepsRoot [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getLocationArgPairs [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getObjectTypeFromUrl [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getPathname [provided] [no usage info] [missing usage info prevents renaming] */
/*! export index [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isClipboardSupported [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isElementOutsideViewport [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isEmpty [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isHomepage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isPlainLeftClick [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isSafari [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isStaticArticlePage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isStaticPage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isStream [provided] [no usage info] [missing usage info prevents renaming] */
/*! export isVisible [provided] [no usage info] [missing usage info prevents renaming] */
/*! export jQueryPromiseAll [provided] [no usage info] [missing usage info prevents renaming] */
/*! export loadCss [provided] [no usage info] [missing usage info prevents renaming] */
/*! export log [provided] [no usage info] [missing usage info prevents renaming] */
/*! export mergeObjectArgs [provided] [no usage info] [missing usage info prevents renaming] */
/*! export minmax [provided] [no usage info] [missing usage info prevents renaming] */
/*! export numberFormat [provided] [no usage info] [missing usage info prevents renaming] */
/*! export openPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/PopupHelper.js .openPopup */
/*! export padStart [provided] [no usage info] [missing usage info prevents renaming] */
/*! export promisifiedFetchImage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export proportionFormat [provided] [no usage info] [missing usage info prevents renaming] */
/*! export renderPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/PopupHelper.js .renderPopup */
/*! export schemeless [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/CDNUtils.js .schemeless */
/*! export selectOrCreate [provided] [no usage info] [missing usage info prevents renaming] */
/*! export setCaretPos [provided] [no usage info] [missing usage info prevents renaming] */
/*! export stripPathname [provided] [no usage info] [missing usage info prevents renaming] */
/*! export stripTags [provided] [no usage info] [missing usage info prevents renaming] */
/*! export triggerEvent [provided] [no usage info] [missing usage info prevents renaming] */
/*! export update [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateShallow [provided] [no usage info] [missing usage info prevents renaming] */
/*! export xmlUtil [provided] [no usage info] [missing usage info prevents renaming] */
/*! export zfill [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.d, __webpack_require__.r, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "padStart": () => /* binding */ padStart,
/* harmony export */   "zfill": () => /* binding */ zfill,
/* harmony export */   "selectOrCreate": () => /* binding */ selectOrCreate,
/* harmony export */   "extractMetaFromURL": () => /* binding */ extractMetaFromURL,
/* harmony export */   "extractMetaFromArticleURL": () => /* binding */ extractMetaFromArticleURL,
/* harmony export */   "getObjectTypeFromUrl": () => /* binding */ getObjectTypeFromUrl,
/* harmony export */   "getPathname": () => /* binding */ getPathname,
/* harmony export */   "floatFormatMinusTwo": () => /* binding */ floatFormatMinusTwo,
/* harmony export */   "isEmpty": () => /* binding */ isEmpty,
/* harmony export */   "setCaretPos": () => /* binding */ setCaretPos,
/* harmony export */   "getCaretPos": () => /* binding */ getCaretPos,
/* harmony export */   "KEYS": () => /* binding */ KEYS,
/* harmony export */   "triggerEvent": () => /* binding */ triggerEvent,
/* harmony export */   "update": () => /* binding */ update,
/* harmony export */   "updateShallow": () => /* binding */ updateShallow,
/* harmony export */   "getDisplay": () => /* binding */ getDisplay,
/* harmony export */   "stripTags": () => /* binding */ stripTags,
/* harmony export */   "isPlainLeftClick": () => /* binding */ isPlainLeftClick,
/* harmony export */   "isHomepage": () => /* binding */ isHomepage,
/* harmony export */   "isStream": () => /* binding */ isStream,
/* harmony export */   "promisifiedFetchImage": () => /* binding */ promisifiedFetchImage,
/* harmony export */   "debounceUntilTimeout": () => /* binding */ debounceUntilTimeout,
/* harmony export */   "debounceEventUntilTimeout": () => /* binding */ debounceEventUntilTimeout,
/* harmony export */   "getConciseNumberString": () => /* binding */ getConciseNumberString,
/* harmony export */   "numberFormat": () => /* binding */ numberFormat,
/* harmony export */   "proportionFormat": () => /* binding */ proportionFormat,
/* harmony export */   "isStaticPage": () => /* binding */ isStaticPage,
/* harmony export */   "isStaticArticlePage": () => /* binding */ isStaticArticlePage,
/* harmony export */   "index": () => /* binding */ index,
/* harmony export */   "log": () => /* binding */ log,
/* harmony export */   "isVisible": () => /* binding */ isVisible,
/* harmony export */   "dedupeArray": () => /* binding */ dedupeArray,
/* harmony export */   "getFancyDepsRoot": () => /* binding */ getFancyDepsRoot,
/* harmony export */   "eitherFancy": () => /* binding */ eitherFancy,
/* harmony export */   "didClickOn": () => /* binding */ didClickOn,
/* harmony export */   "xmlUtil": () => /* binding */ xmlUtil,
/* harmony export */   "MP": () => /* binding */ MP,
/* harmony export */   "getLocationArgPairs": () => /* binding */ getLocationArgPairs,
/* harmony export */   "formatDuration": () => /* binding */ formatDuration,
/* harmony export */   "minmax": () => /* binding */ minmax,
/* harmony export */   "openPopup": () => /* reexport safe */ _PopupHelper__WEBPACK_IMPORTED_MODULE_4__.openPopup,
/* harmony export */   "closePopup": () => /* reexport safe */ _PopupHelper__WEBPACK_IMPORTED_MODULE_4__.closePopup,
/* harmony export */   "renderPopup": () => /* reexport safe */ _PopupHelper__WEBPACK_IMPORTED_MODULE_4__.renderPopup,
/* harmony export */   "cdnUtils": () => /* reexport safe */ _CDNUtils__WEBPACK_IMPORTED_MODULE_5__.cdnUtils,
/* harmony export */   "schemeless": () => /* reexport safe */ _CDNUtils__WEBPACK_IMPORTED_MODULE_5__.schemeless,
/* harmony export */   "mergeObjectArgs": () => /* binding */ mergeObjectArgs,
/* harmony export */   "ClickOutside": () => /* binding */ ClickOutside,
/* harmony export */   "copyToClipboard": () => /* reexport safe */ _CopyToClipboard__WEBPACK_IMPORTED_MODULE_6__.copyToClipboard,
/* harmony export */   "isClipboardSupported": () => /* binding */ isClipboardSupported,
/* harmony export */   "convertThingsV1ToRest": () => /* binding */ convertThingsV1ToRest,
/* harmony export */   "isElementOutsideViewport": () => /* binding */ isElementOutsideViewport,
/* harmony export */   "FancyUser": () => /* binding */ FancyUser,
/* harmony export */   "stripPathname": () => /* binding */ stripPathname,
/* harmony export */   "cartesianProductOf": () => /* binding */ cartesianProductOf,
/* harmony export */   "jQueryPromiseAll": () => /* binding */ jQueryPromiseAll,
/* harmony export */   "loadCss": () => /* binding */ loadCss,
/* harmony export */   "alertify": () => /* binding */ alertify,
/* harmony export */   "escapeSelector": () => /* binding */ escapeSelector,
/* harmony export */   "isSafari": () => /* binding */ isSafari
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _PopupHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PopupHelper */ "./_static/modules/libf/PopupHelper.js");
/* harmony import */ var _CDNUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CDNUtils */ "./_static/modules/libf/CDNUtils.js");
/* harmony import */ var _CopyToClipboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CopyToClipboard */ "./_static/modules/libf/CopyToClipboard.js");




var __KEY__ = '__F';
var _window = window,
    _ = _window._;

window.requestIdleCallback = window.requestIdleCallback || function (cb) {
  var _window2;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  (_window2 = window).setTimeout.apply(_window2, [cb, 0].concat(args));
}; // Polyfills


Number.isNaN = Number.isNaN || function isNaN(value) {
  return value !== value;
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
}; // https://ponyfoo.com/articles/ecmascript-string-padding


function padStart(text, max, mask) {
  var cur = text.length;

  if (max <= cur) {
    return text;
  }

  var masked = max - cur;
  var filler = String(mask) || ' ';

  while (filler.length < masked) {
    filler += filler;
  }

  var fillerSlice = filler.slice(0, masked);
  return fillerSlice + text;
}
function zfill(text, max) {
  return padStart(text, max, '0');
} // Select element or create element via selector

function selectOrCreate(selector) {
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
  var element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';
  var attr;
  var attrValue;

  if (selector[0] === '.') {
    attr = 'class';
    var classNames = selector.split('.').filter(function (e) {
      return e;
    });

    if (classNames.length > 1) {
      // .abc.def
      attrValue = classNames.join(' ');
    } else {
      // .abc
      attrValue = selector.substr(1);
    }
  } else if (selector[0] === '#') {
    attr = 'id';
    attrValue = selector.substr(1);
  } else {
    // TODO: error handling - redirect to the page
    throw new Error('non-recognized selector:' + selector);
  }

  var target = $(container).find(selector).get(0);

  if (target == null) {
    target = $("<".concat(element, " ").concat(attr, "=\"").concat(attrValue, "\" />")).appendTo(container).get(0);
  }

  return target;
}
var thingRegex = /^\/(sales|things)\/(\d+)/;
function extractMetaFromURL(url) {
  url = stripDomain(url);
  var match = url.match(thingRegex); // ["/(sales|things)/1234", "sales", "1234"] | null

  var ret = {};

  if (match != null) {
    ret.href = stripURL(url); // Stripped relative URL

    ret.type = match[1]; // either { 'sales' | 'things' }

    ret.id = match[2]; // Integer
  }

  return ret;
}
var articleRegex = /^\/(articles)\/([^\?]+)/;
function extractMetaFromArticleURL(url) {
  url = stripDomain(url);
  var match = url.match(articleRegex); // ["/articles/test", "articles", "test"] | null

  var ret = {};

  if (match != null) {
    ret.href = stripURL(url); // Stripped relative URL

    ret.type = match[1]; // always { 'article' }

    ret.id = match[2]; // String
  }

  return ret;
}

function createElementParser(url) {
  var a = document.createElement('a');
  a.setAttribute('href', url);
  return a;
}

function stripDomain(url) {
  if (url) {
    var parser = createElementParser(url);
    var result = parser.pathname + parser.search + parser.hash; // IE FIX

    if (result.indexOf('/') !== 0) {
      result = '/' + result;
    }

    return result;
  } else {
    return '/';
  }
}

function getObjectTypeFromUrl(url) {
  var path = stripDomain(url);

  if (thingRegex.test(path)) {
    return 'Thing';
  } else if (articleRegex.test(path)) {
    return 'Article';
  } else {
    return null;
  }
} // Due to <a href=# /> -> a.pathname = location.pathname, we need cleaner

function getPathname(aElement) {
  if (aElement.pathname === location.pathname) {
    return '';
  } else {
    return aElement.pathname;
  }
} // http://domain/things/1234 => /things/1234
// deprecated, use stripDomain()

function stripURL(url) {
  var stripped = stripDomain(url);

  if (stripped) {
    return stripped;
  } else {
    return null;
  }
}

function floatFormatMinusTwo(number) {
  // simulates effect of floatformat:-2|intcomma
  var num = numberFormat(number, 2);
  var splitted = numberFormat(number, 2).split('.');

  if (splitted[1] === '00') {
    return splitted[0];
  } else return num;
} // Either empty or null/undefined; Python-side falsy values like {}, []

function isEmpty(obj) {
  return obj == null || obj === '' || obj instanceof Array && obj.length === 0 || _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3___default()(obj) === 'object' && Object.getOwnPropertyNames(obj).length === 0;
}
function setCaretPos(element, position) {
  element.focus();

  if (element.setSelectionRange) {
    element.setSelectionRange(position, position);
  } else if (element.createTextRange) {
    var range = element.createTextRange();
    range.moveEnd('character', position);
    range.collapse(false);
    range.select();
  }
}
;
function getCaretPos(element) {
  if (element.selectionStart) {
    return element.selectionStart;
  } else if (document.selection) {
    var range = document.selection.createRange();
    range.moveStart('character', -element.value.length);
    return range.text.length;
  } else {
    return -1;
  }
}
var KEYS = {
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  ESC: 27,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  SEMICOLON: 186,
  COMMA: 188 // ,

}; // Using DOM high-level event triggering system for React to recognize event

function triggerEvent(DOMRef, eventName, data) {
  var event;

  if (data) {
    event = new CustomEvent(eventName, {
      'bubbles': true,
      // Whether the event will bubble up through the DOM or not
      'cancelable': true,
      // Whether the event may be canceled or not
      'detail': data
    });
  } else {
    event = new Event(eventName, {
      'bubbles': true,
      // Whether the event will bubble up through the DOM or not
      'cancelable': true // Whether the event may be canceled or not

    });
  }

  return DOMRef.dispatchEvent(event);
} // Deep merge for reducers

function update(state, next) {
  var args = [true, {}, state];

  if (next) {
    args.push(next);
  }

  return $.extend.apply(null, args);
} // 'Shallow merge'

function updateShallow(state, next) {
  var args = [{}, state];

  if (next) {
    args.push(next);
  }

  return _.extend.apply(null, args);
}
function getDisplay(display) {
  return {
    display: display ? 'block' : 'none'
  };
} // '<a>b</a>' => 'b'

function stripTags(html) {
  var div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || null;
}
function isPlainLeftClick(event) {
  return !(event.button !== 0 || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey);
}

function testLegacyContextLocation() {
  try {
    // Root - /
    if (location.pathname === '/' && $('#container-wrapper .timeline').length > 0) {
      return true; // Search page - /search?q=foo
    } else if (/\/search\?q\=/.test(location.href)) {
      return true; // User page - /foo
    } else if ($('#container-wrapper .wrapper-content.profile-section').length > 0 && /^\/((?!\/).)*$/.test(location.pathname)) {
      return true;
    } else if ('/shop' === location.pathname || /^\/shop\/.*/.test(location.pathname)) {
      return true; // <username | shopname>/lists/<id>
      // <shopname>/collection/<id>
    } else if (/.*\/list\/\d+/.test(location.pathname) || /.*\/collection\/\d+/.test(location.pathname)) {
      return true;
    }
  } catch (e) {}

  return false;
}

var _isHomepage;

function isHomepage() {
  if (_isHomepage == null) {
    _isHomepage = location.pathname === '/';
  }

  return _isHomepage;
}

var _isStream;

function isStream() {
  if (_isStream == null) {
    return _isStream = testLegacyContextLocation();
  } else {
    return _isStream;
  }
}
function promisifiedFetchImage(src, resolveCallback, timeout) {
  var deferred = $.Deferred();
  deferred.then(resolveCallback);

  if (timeout) {
    setTimeout(function () {
      deferred.resolve();
    }, timeout);
  }

  var img = new Image();

  img.onload = function () {
    deferred.resolve();
  };

  img.onerror = function () {
    deferred.resolve();
  };

  img.src = src;
}
function debounceUntilTimeout(fun, delay) {
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var timer;
  return function delayedFunctionWrapper() {
    clearTimeout(timer);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.unshift(context);
    timer = setTimeout(fun.bind.apply(fun, args), delay);
  };
}
function debounceEventUntilTimeout(eventHandler, delay) {
  var timer;
  return function (e) {
    e.persist();
    clearTimeout(timer);
    timer = setTimeout(function () {
      return eventHandler(e);
    }, delay);
  };
}
var numberUnitPostfixes = ['', 'K', 'M', 'B', 'T'];
function getConciseNumberString(_num) {
  var num = Number(_num);

  if (_.isNaN(num) || !_.isNumber(num)) {
    return '';
  }

  var pos = 0;

  while (num > 1000) {
    num = num / 1000;
    pos += 1;
  }

  if (num % 1 !== 0) {
    // has some number after decimal point, i.e.) 10.5
    return num.toFixed(1) + numberUnitPostfixes[pos];
  } else {
    // integer i.e.) 10
    return String(num) + numberUnitPostfixes[pos];
  }
} // humanize.js

function numberFormat(number, decimals, decPoint, thousandsSep) {
  decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
  decPoint = decPoint === undefined ? '.' : decPoint;
  thousandsSep = thousandsSep === undefined ? ',' : thousandsSep;
  var sign = number < 0 ? '-' : '';
  number = Math.abs(+number || 0);
  var intPartNum = parseInt(number.toFixed(decimals), 10);
  var intPart = intPartNum + '';
  var j = intPart.length > 3 ? intPart.length % 3 : 0;
  return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPartNum).toFixed(decimals).slice(2) : '');
} // Number formatting utility i.e) 0.1 => 10%

function proportionFormat(number, isFixed) {
  var num = Number(number);

  if (_.isNumber(num) && !_.isNaN(num)) {
    if (isFixed) {
      return (num * 100).toFixed(0) + '%';
    } else {
      return num * 100 + '%';
    }
  } else {
    return '';
  }
}
function isStaticPage() {
  return document.body.className.indexOf('static-ot') !== -1;
}
function isStaticArticlePage() {
  return document.body.className.indexOf('static-article') !== -1;
} // http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference

function index(obj, is, value) {
  if (typeof is == 'string') {
    return index(obj, is.split('.'), value);
  } else if (is.length === 1 && value !== undefined) {
    obj[is[0]] = value;
    return value;
  } else if (is.length === 0) {
    return obj;
  } else if (obj[is[0]] !== undefined) {
    return index(obj[is[0]], is.slice(1), value);
  } else {// was unable to reach via selector
  }
} // export function dateFormat(format, datetime) {
//     return $.datepicker ? $.datepicker.formatDate(format, datetime) : datetime;
// }

function log() {
  if (true) {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    console.debug.apply(console, args);
  }
}
function isVisible(elm) {
  var vpH = $(window).height(); // Viewport Height

  var st = $(window).scrollTop(); // Scroll Top

  var $elm = $(elm);
  var offset = $elm.offset();
  var elementHeight = $elm.height();

  if (offset !== undefined && vpH !== undefined && st !== undefined && elementHeight !== undefined) {
    var y = offset.top;
    return y < vpH + st && y > st - elementHeight;
  }
} // http://stackoverflow.com/a/32533637/1189421
// Object deduping / boxed value is not supported.

function dedupeArray(vals) {
  if (vals) {
    return vals.sort().reduce(function (a, b) {
      if (b !== a[0]) {
        a.unshift(b);
      }

      return a;
    }, []);
  } else {
    return null;
  }
} // Access global state

function getFancyDepsRoot() {
  window[__KEY__] = window[__KEY__] || {};
  return window[__KEY__];
} // eitherFancy('jQuery', $ => $(...)); -> $(...)

function eitherFancy(namespace)
/*:object? */
{
  var doWith = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (Deps) {
    return Deps;
  };

  if (window[__KEY__]) {
    if (window[__KEY__][namespace]) {
      return doWith(window[__KEY__][namespace]);
    }
  } else {
    getFancyDepsRoot();
  }

  return null;
}
function didClickOn($targ, selector) {
  return $targ.parents(selector).length > 0 || $targ.is(selector);
}
var xmlUtil = {
  isSuccess: function isSuccess(xml) {
    var sc = $(xml).find("status_code");
    return sc.length > 0 && sc.text() === '1';
  },
  isFail: function isFail(xml) {
    var sc = $(xml).find("status_code");
    return sc.length > 0 && sc.text() === '0';
  }
};
function MP() {
  if (false) { var _window3; }
} // ?a=1 -> ['a', '1']

function getLocationArgPairs(key) {
  var originalArgStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : location.search;
  var argStr = originalArgStr.substr(1, originalArgStr.length);

  if (argStr) {
    var args = argStr.split('&').map(function (e) {
      return e.split('=');
    });

    if (key) {
      var ret;
      args.some(function (argPair) {
        if (argPair[0] === key) {
          ret = argPair;
        }
      });

      if (ret) {
        return ret;
      }
    } else {
      return args;
    }
  }
}
function formatDuration(value) {
  if (value == null) {
    // console.warn('formatDuration: undefined value', value)
    return '00:00';
  }

  var val = Number(value);

  if (_.isNaN(val)) {
    // console.warn('formatDuration: value causing NaN', value)
    return '00:00';
  }

  var remainder = val % 3600 | 0;
  var minutes = remainder / 60 | 0;
  var seconds = remainder % 60 | 0;
  return "".concat(zfill(String(minutes), 2), ":").concat(zfill(String(seconds), 2));
}
function minmax(value, lb, ub) {
  return Math.max(Math.min(value, ub), lb);
}


function mergeObjectArgs(args) {
  return args.reduce(function (p, n) {
    return $.extend(true, p, n);
  }, null);
}

function closestUntil(startingElement, targetElement) {
  var start = startingElement;

  while (start != null) {
    if (start === targetElement) return targetElement;

    if (start === document.body || start === document.documentElement) {
      return null;
    }

    start = start.parentElement;
  }

  return null;
}

var ClickOutside = /*#__PURE__*/function () {
  function ClickOutside(_ref) {
    var _this = this;

    var _component = _ref.component,
        _ref$popupElementRefK = _ref.popupElementRefKey,
        _popupElementRefKey = _ref$popupElementRefK === void 0 ? 'popupElement' : _ref$popupElementRefK;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ClickOutside);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "eventKey", '');

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "component", undefined);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "popupElementRefKey", '');

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "attached", false);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "handleAttach", function (closePopupFunction) {
      if (_this.attached || closePopupFunction == null) {
        return;
      }

      var component = _this.component,
          eventKey = _this.eventKey,
          handleDetach = _this.handleDetach,
          popupElementRefKey = _this.popupElementRefKey;
      $(document.body).on(eventKey, function (event) {
        if (!event.isTrigger && $.contains(document.body, event.target) && // check if element exists on DOM
        closestUntil(event.target, component[popupElementRefKey]) === null // is target element exist below popup element?
        ) {
            closePopupFunction(component);
            handleDetach();
          }
      });
      _this.attached = true;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "handleDetach", function () {
      $(document.body).off(_this.eventKey);
      _this.attached = false;
    });

    var key = Math.random().toString().substr(2, 8);
    this.eventKey = "click.attachClickOutside" + key;
    this.component = _component;
    this.popupElementRefKey = _popupElementRefKey;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ClickOutside, [{
    key: "destroy",
    value: function destroy() {
      delete this.component;
      this.handleDetach();
    }
  }]);

  return ClickOutside;
}();

function isClipboardSupported() {
  return document.queryCommandSupported != null && document.queryCommandSupported('copy');
}

function isSaleResponse(sales) {
  return sales != null && sales[0] != null;
} // Adapt server response (thing.to_v1 -> rest API)


function convertThingsV1ToRest(things) {
  return things.map(function (thing) {
    var converted = Object.assign({
      sales_available: false,
      id: thing.id_str,
      name: thing.name,
      fancyd: thing["fancy'd"],
      thumb_image_url_310: thing.thumb_image_url_310,
      thumb_image_url_558: thing.thumb_image_url_558,
      fancyd_count: thing.fancys,
      image: {
        src: thing.image_url,
        width: thing.image_url_width,
        height: thing.image_url_height
      },
      owner: thing.user,
      html_url: window.parseURL(thing.url).pathname,
      fancyd_users: thing.fancyd_users,
      sales: thing.sales
    }, thing);
    var sales = thing.sales;

    if (isSaleResponse(sales)) {
      var _sales = thing.sales[0];

      if (_sales.id == null && _sales.sale_id != null) {
        _sales.id = _sales.sale_id;
      } // converted.sales.waiting = sales.waiting;


      converted.sales = _sales;
      converted.sales.quantity = _sales.remaining_quantity;
      converted.sales.price = _sales.fancy_price;
      converted.sales_available = _sales.available_for_sale;
    } else {
      converted.sales = null;
    } // Flag for cache


    converted.isCrawled = true;
    return converted;
  });
}
function isElementOutsideViewport(element, excludingElement) {
  var elementRect = element.getBoundingClientRect();
  var upperBound = 0;
  var leftBound = 0;

  if (excludingElement) {
    var _element = excludingElement.element,
        type = excludingElement.type;

    if (_element) {
      var exclusionRect = _element.getBoundingClientRect();

      if (type === 'top') {
        upperBound = exclusionRect.bottom; // exclusion on top of el (header, etc)
      } else if (type === 'left') {
        leftBound = exclusionRect.right; // exclusion on left of el (sidebar, etc)
      } // right, bottom is TODO

    }
  }

  var html = document.documentElement;
  var lowerBound = window.innerHeight || html.clientHeight;
  var rightBound = window.innerWidth || html.clientWidth;
  var bottom = elementRect.bottom,
      top = elementRect.top,
      left = elementRect.left,
      right = elementRect.right;
  return top <= upperBound && bottom <= upperBound || top >= lowerBound && bottom >= upperBound || left <= leftBound && right <= leftBound || left >= rightBound && right >= rightBound;
}
var _FancyUser = {
  loggedIn: false,
  merchant: false,
  id: null
};

if (window.__FancyUser) {
  Object.assign(_FancyUser, window.__FancyUser);
}

var FancyUser = _FancyUser;
var locationHostname = "".concat(location.protocol, "//").concat(location.hostname);
function stripPathname(href) {
  var sp = href.split(locationHostname);
  return sp.length > 1 ? sp[1] : sp[0];
} // https://gist.github.com/ijy/6094414

function cartesianProductOf() {
  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return _.reduce(args, function (a, b) {
    return _.flatten(_.map(a, function (x) {
      return _.map(b, function (y) {
        return x.concat([y]);
      });
    }), true);
  }, [[]]);
}
function jQueryPromiseAll(arrayOfPromises) {
  return jQuery.when.apply(jQuery, arrayOfPromises).then(function () {
    return Array.prototype.slice.call(arguments, 0);
  });
}
var _loaded = {};
function loadCss(AppName) {
  var B = window.Bundle;

  if (_loaded[AppName]) {
    return;
  }

  if (B && B.cssToLoad && B.cssToLoad[AppName] && B.cssToLoad[AppName].length > 0) {
    while (B.cssToLoad[AppName].length > 0) {
      var nextUrl = B.cssToLoad[AppName].pop();
      $(document.head).append("<link href=\"".concat(nextUrl, "\" rel=\"stylesheet\">"));
      _loaded[AppName] = true;
    }
  }
}

var _alertify = window.alertify || {
  alert: function alert() {
    var _window4;

    (_window4 = window).alert.apply(_window4, arguments);
  },
  prompt: function prompt(message, fn, placeholder, cssClass) {
    if (fn) {
      var msg;

      if (placeholder) {
        msg = window.prompt(message, placeholder);
      } else {
        msg = window.prompt(message);
      }

      if (msg === null) {
        fn(false);
      } else {
        fn(true, msg);
      }
    }
  },
  confirm: function confirm(message, fn, cssClass) {
    if (fn) {
      fn(window.confirm(message));
    }
  },
  set: function set() {},
  labels: {
    ok: 'OK',
    cancel: 'Cancel'
  }
};

var alertify = _alertify; // https://code.jquery.com/jquery-3.3.1.js

function escapeSelector(sel) {
  // $.escapeSelector()
  var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g;

  var fcssescape = function fcssescape(ch, asCodePoint) {
    if (asCodePoint) {
      // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
      if (ch === "\0") {
        return "\uFFFD";
      } // Control characters and (dependent upon position) numbers get escaped as code points


      return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
    } // Other potentially-special ASCII characters get backslash-escaped


    return "\\" + ch;
  };

  return (sel + '').replace(rcssescape, fcssescape);
}
;
var isSafari_cac;
var isSafari = function isSafari() {
  if (isSafari_cac === undefined) {
    isSafari_cac = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  return isSafari_cac;
};

/***/ }),

/***/ "./_static/modules/libf/PopupHelper.js":
/*!*********************************************!*\
  !*** ./_static/modules/libf/PopupHelper.js ***!
  \*********************************************/
/*! namespace exports */
/*! export closePopup [provided] [no usage info] [missing usage info prevents renaming] */
/*! export openPopup [provided] [no usage info] [missing usage info prevents renaming] */
/*! export renderPopup [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "openPopup": () => /* binding */ openPopup,
/* harmony export */   "closePopup": () => /* binding */ closePopup,
/* harmony export */   "renderPopup": () => /* binding */ renderPopup
/* harmony export */ });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _FancyUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FancyUtils */ "./_static/modules/libf/FancyUtils.ts");




function selectPopup(popupName) {
  if ($("#popup_container .".concat(popupName)).length > 0) {
    if (popupName) {
      return $.dialog(popupName);
    }
  }

  return null;
}

function openPopup(popupName) {
  var bindOverlayData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var popup = selectPopup(popupName);

  if (popup) {
    if (bindOverlayData) {
      popup.$obj.data('via-overlay', true);
      popup.$obj.one('close', function () {
        $(this).data('via-overlay', false);
      });
    }

    popup.open();
  }
}
function closePopup(popupName) {
  var popup = selectPopup(popupName);

  if (popup) {
    popup.$obj.data('via-overlay', false);
    popup.close();
  }
}
var popupContainer = document.getElementById('popup_container');
function renderPopup(PopupComponent, attrs, callback) {
  // unless `attrs.openOnMount` is explicitly set as `false` and callback is set, it will open right after mount.
  attrs = attrs || {};

  if (attrs.openOnMount !== false && callback == null) {
    callback = function callback() {
      openPopup(PopupComponent.popupName);
    };
  }

  if (!PopupComponent.popupName) {
    console.warn("renderPopup: Please set `popupName` property of ".concat(PopupComponent.name));
  }

  return react_dom__WEBPACK_IMPORTED_MODULE_0__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(PopupComponent, attrs), (0,_FancyUtils__WEBPACK_IMPORTED_MODULE_2__.selectOrCreate)(".popup.".concat(PopupComponent.popupName || ''), popupContainer), callback);
}

/***/ }),

/***/ "./_static/modules/libf/common-components/AddlistAction.js":
/*!*****************************************************************!*\
  !*** ./_static/modules/libf/common-components/AddlistAction.js ***!
  \*****************************************************************/
/*! namespace exports */
/*! export AddlistAction [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddlistAction": () => /* binding */ AddlistAction
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
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












var AddlistAction = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(AddlistAction, _Component);

  function AddlistAction() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, AddlistAction);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(AddlistAction)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      lists: [],
      wanted: false,
      listSearchQuery: "",
      listCreationQuery: "",
      createListFocused: false,
      showList: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListSearch", function (event) {
      var listSearchQuery = event.target.value;

      _this.setStateSafe({
        listSearchQuery: listSearchQuery
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListCreation", function (event) {
      event.preventDefault();

      if (event.type === "keyup" && event.which !== fancyutils__WEBPACK_IMPORTED_MODULE_10__.KEYS.ENTER) {
        return;
      }

      var listCreationQuery = $.trim(_this.state.listCreationQuery);
      var _this$props = _this.props,
          objectId = _this$props.objectId,
          objectType = _this$props.objectType,
          merchantId = _this$props.merchantId;

      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.isEmpty)(listCreationQuery)) {
        return;
      } // save new list


      createList({
        merchantId: merchantId,
        listCreationQuery: listCreationQuery,
        callback: function callback() {
          _this.setStateSafe({
            listCreationQuery: ""
          }, function () {
            _this.drawUserList(objectId);

            _this.quickCreateList.focus();

            if (objectType === "thing") {
              (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)("Create New List", {
                "thing id": objectId,
                "list name": listCreationQuery,
                via: "thing detail"
              });
            }
          });
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleWishlistCheckboxChange", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var targ = event.currentTarget;
      var _this$props2 = _this.props,
          objectType = _this$props2.objectType,
          objectId = _this$props2.objectId,
          handleHide = _this$props2.handleHide;
      var name = "wanted";
      var params = {
        owned: false,
        wanted: targ.checked
      };
      var eventName = targ.checked ? "Add to List" : "Remove from List";

      if (objectType === "thing") {
        if (params.wanted && window.dataLayer) {
          window.dataLayer.push({
            event: "Add_to_Wishlist_Check",
            product_id: undefined,
            products_info: undefined,
            products: undefined,
            revenue: undefined,
            option_id: undefined
          });
        }

        $.ajax("/rest-api/v1/things/".concat(objectId), {
          type: "PUT",
          data: params
        }).done(function () {
          _this.drawUserList(objectId);

          _this.setStateSafe({
            wanted: params.wanted
          });

          if (params.wanted) {
            handleHide && handleHide();
          }
        }).error(function (err) {
          console.warn(err);
        });
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)(eventName, {
          "thing id": objectId,
          "list name": name,
          "list id": -1,
          via: "thing detail"
        });
      } else {
        console.warn("Add to list does not work with non-thing type");
        return;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListCheckboxChange", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var targ = event.currentTarget;
      var isChecked = targ.checked;
      var _this$props3 = _this.props,
          objectId = _this$props3.objectId,
          objectType = _this$props3.objectType,
          handleHide = _this$props3.handleHide,
          merchantId = _this$props3.merchantId;
      var lists = _this.state.lists;
      var selectedListId = targ.getAttribute("data-listid");
      var collectionAction = [Number(selectedListId), targ.checked];

      if (objectType === "thing") {
        var eventName = isChecked ? "Add to List" : "Remove from List";
        var theList = lists.filter(function (list) {
          return list.id === selectedListId;
        })[0];

        var callback = function callback() {
          _this.drawUserList(objectId);

          if (isChecked) {
            handleHide && handleHide();
          }

          (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)(eventName, {
            "thing id": objectId,
            "list name": theList.name,
            "list id": theList.id,
            via: "thing detail"
          });
        };

        if (merchantId) {
          updateList({
            merchantId: merchantId,
            objectId: objectId,
            collectionAction: collectionAction,
            callback: callback
          });
        } else {
          var checked = [];
          var unchecked = [];
          $(_this.lists).find('input[type="checkbox"]:not(.tag)').each(function () {
            var listId = this.getAttribute("data-listid");

            if (this.checked) {
              checked.push(listId);
            } else {
              unchecked.push(listId);
            }
          });
          updateList({
            checked: checked,
            unchecked: unchecked,
            objectId: objectId,
            callback: callback
          });
        }
      } else {
        console.warn("Add to list does not work with non-thing type");
        return;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCreateListLabelClick", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.setStateSafe({
        createListFocused: true
      }, function () {
        _this.quickCreateList.focus();
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCreateListBlur", function () {
      _this.setStateSafe({
        createListFocused: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCreateListQueryChange", function (event) {
      _this.setStateSafe({
        listCreationQuery: event.target.value
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(AddlistAction, [{
    key: "setStateSafe",
    value: function setStateSafe() {
      if (this.mounted) {
        this.setState.apply(this, arguments);
      }
    }
  }, {
    key: "drawUserList",
    value: function drawUserList(objectId) {
      var _this2 = this;

      objectId = objectId || this.props.objectId;
      getListCheckbox({
        merchantId: this.props.merchantId,
        objectId: objectId,
        callback: function callback(res) {
          _this2.setStateSafe(res);
        }
      });
    }
  }, {
    key: "isWishlistQuery",
    value: function isWishlistQuery(listSearchQuery) {
      return "wishlist".indexOf($.trim(listSearchQuery).toLowerCase()) !== -1;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
      this.listDrawn = false;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pp, ps) {
      var _this3 = this;

      if ((ps.showList !== this.state.showList || this.listDrawn === false) && this.state.showList === true) {
        if (this.listDrawn === false) {
          this.listDrawn = true;
        }

        this.drawUserList(this.props.objectId);
        setTimeout(function () {
          _this3.listSearchInput.focus();
        }, 0);
      }
    }
  }, {
    key: "show",
    value: function show() {
      this.setStateSafe({
        showList: true
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      this.setStateSafe({
        showList: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props4 = this.props,
          objectId = _this$props4.objectId,
          merchantId = _this$props4.merchantId;
      var _this$state = this.state,
          lists = _this$state.lists,
          wanted = _this$state.wanted,
          listSearchQuery = _this$state.listSearchQuery,
          listCreationQuery = _this$state.listCreationQuery,
          createListFocused = _this$state.createListFocused,
          showList = _this$state.showList;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        id: "show-addlist",
        className: "has-arrow more-share-popup addlist-action",
        style: (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.getDisplay)(showList)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "tit"
      }, merchantId ? gettext("Add to Collection") : gettext("Add to List")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "search before-bg-share2"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        ref: function ref(element) {
          _this4.listSearchInput = element;
        },
        type: "text",
        className: "text",
        placeholder: merchantId ? gettext("Search your collections") : gettext("Search your lists"),
        value: listSearchQuery,
        onChange: this.handleListSearch
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("ul", {
        className: "lists",
        ref: function ref(element) {
          _this4.lists = element;
        }
      }, !merchantId && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", {
        htmlFor: "wanted-".concat(objectId)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "checkbox",
        name: "wanted",
        checked: wanted,
        id: "wanted-".concat(objectId),
        className: "tag ".concat(wanted ? "checked" : ""),
        style: {
          display: this.isWishlistQuery(listSearchQuery) ? null : "none"
        },
        onChange: this.handleWishlistCheckboxChange
      }), " ", gettext("Wish List"))), lists && lists.map(function (list, idx) {
        var term = $.trim(listSearchQuery).toLowerCase();
        var style;

        if (_.isString(term) && term.length > 0) {
          style = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(list.name.toLowerCase().indexOf(term.toLowerCase()) === -1);
        }

        var className = list.selected ? "selected" : null;
        var ident = "".concat(objectId, "-").concat(list.id);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", {
          key: idx,
          style: style
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", {
          htmlFor: ident
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
          className: className,
          type: "checkbox",
          name: ident,
          id: ident,
          checked: list.selected,
          "data-listid": list.id,
          onChange: _this4.handleListCheckboxChange
        }), " ", list.name));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "new-list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", {
        htmlFor: "quick-create-list",
        style: {
          display: createListFocused ? "none" : "block"
        },
        onClick: this.handleCreateListLabelClick
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("i", {
        className: "icon"
      }), merchantId ? gettext("Create New Collection") : gettext("Create New List")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "text",
        id: "quick-create-list",
        ref: function ref(element) {
          _this4.quickCreateList = element;
        },
        onBlur: this.handleCreateListBlur,
        onKeyUp: this.handleListCreation,
        onChange: this.handleCreateListQueryChange,
        value: listCreationQuery,
        placeholder: merchantId ? gettext("Create New Collection") : gettext("Create New List")
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btn-create",
        onClick: this.handleListCreation
      }, gettext("Create"))));
    }
  }]);

  return AddlistAction;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

function getListCheckbox(_ref) {
  var merchantId = _ref.merchantId,
      objectId = _ref.objectId,
      callback = _ref.callback;

  if (merchantId) {
    $.get("/rest-api/v1/seller/".concat(merchantId, "/collections"), {
      selected_object_id: objectId
    }).done(function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          collections = _ref2.collections;

      var lists;

      if (collections.length > 0) {
        lists = collections.sort(function (a, b) {
          var aText = $.trim(a).toLowerCase();
          var bText = $.trim(b).toLowerCase();
          return aText < bText ? -1 : 1;
        }).map(function (_ref3) {
          var id = _ref3.id,
              name = _ref3.name,
              selected = _ref3.selected;
          return {
            id: id,
            name: name,
            selected: selected
          };
        });
      } else {
        lists = [];
      }

      callback && callback({
        lists: lists,
        wanted: null
      });
    }).error(function (err) {
      console.warn(err);
    });
  } else {
    $.get("/_get_list_checkbox.html", {
      tid: objectId
    }).done(function (html) {
      var $html = $(html);
      var $items = $html.filter("li").find("img").remove().end();
      var lists;

      if ($items.length > 0) {
        lists = $items.sort(function (a, b) {
          var aText = $.trim($(a).text()).toLowerCase();
          var bText = $.trim($(b).text()).toLowerCase();
          return aText < bText ? -1 : 1;
        }).map(function (_, item) {
          var $item = $(item);
          return {
            id: $item.find("label").attr("for"),
            name: $.trim($item.find("label").text()),
            selected: $item.find("input").prop("checked")
          };
        }).get();
      } else {
        lists = [];
      }

      var wanted = $html.filter('input[name="wanted"]').val() === "true";
      callback && callback({
        lists: lists,
        wanted: wanted
      });
    }).error(function (err) {
      console.warn(err);
    });
  }
}

function createList(_ref4) {
  var merchantId = _ref4.merchantId,
      listCreationQuery = _ref4.listCreationQuery,
      callback = _ref4.callback;

  if (merchantId) {
    $.post("/rest-api/v1/seller/".concat(merchantId, "/collections"), {
      list_name: listCreationQuery
    }).done(function (res) {
      // if ($(res).find("created").text() == 'False') {
      // if (false){
      //     alertify.alert(`List Title Not Available`, `There is already a list named ${listCreationQuery}. Try again with a different name.`);
      // } else {
      callback && callback(); // }
    }).error(function (err) {
      console.warn(err);
    });
  } else {
    $.post("/create_list.xml", {
      list_name: listCreationQuery,
      reaction: 0
    }).done(function (res) {
      if ($(res).find("created").text() == "False") {
        fancyutils__WEBPACK_IMPORTED_MODULE_10__.alertify.alert("<b>List Title Not Available</b><br><br>There is already a list named ".concat(listCreationQuery, ". Try again with a different name."));
      } else {
        callback && callback();
      }
    }).error(function (err) {
      console.warn(err);
    });
  }
}

function updateList(_ref5) {
  var merchantId = _ref5.merchantId,
      collectionAction = _ref5.collectionAction,
      objectId = _ref5.objectId,
      checked = _ref5.checked,
      unchecked = _ref5.unchecked,
      callback = _ref5.callback;

  if (merchantId) {
    var _collectionAction = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(collectionAction, 2),
        collectionId = _collectionAction[0],
        add = _collectionAction[1];

    $.ajax({
      url: "/rest-api/v1/seller/".concat(merchantId, "/collections/").concat(collectionId),
      type: "POST",
      data: {
        object_id: objectId,
        action: add ? "add" : "remove"
      }
    }).done(callback).error(function (err) {
      console.warn(err);
    });
  } else {
    $.post("/save_list_items", {
      tid: objectId,
      checked_list_ids: checked.join(","),
      unchecked_list_ids: unchecked.join(",")
    }).done(callback).error(function (err) {
      console.warn(err);
    });
  }
}

/***/ }),

/***/ "./_static/modules/libf/common-components/AddlistPopover.js":
/*!******************************************************************!*\
  !*** ./_static/modules/libf/common-components/AddlistPopover.js ***!
  \******************************************************************/
/*! namespace exports */
/*! export AddlistPopover [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddlistPopover": () => /* binding */ AddlistPopover
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
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












var AddlistPopover = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(AddlistPopover, _Component);

  function AddlistPopover() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, AddlistPopover);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(AddlistPopover)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      lists: [],
      wanted: false,
      listSearchQuery: '',
      listCreationQuery: '',
      createListFocused: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListSearch", function (event) {
      var listSearchQuery = event.target.value;

      _this.setStateSafe({
        listSearchQuery: listSearchQuery
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListCreation", function (event) {
      event.preventDefault();

      if (event.type === 'keyup' && event.which !== fancyutils__WEBPACK_IMPORTED_MODULE_10__.KEYS.ENTER) {
        return;
      }

      var listCreationQuery = $.trim(_this.state.listCreationQuery);
      var _this$props = _this.props,
          objectId = _this$props.objectId,
          objectType = _this$props.objectType,
          merchantId = _this$props.merchantId;

      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.isEmpty)(listCreationQuery)) {
        return;
      } // save new list


      createList({
        merchantId: merchantId,
        listCreationQuery: listCreationQuery,
        callback: function callback() {
          _this.setStateSafe({
            listCreationQuery: ''
          }, function () {
            _this.drawUserList(objectId);

            _this.quickCreateList.focus();

            if (objectType === 'thing') {
              (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)('Create New List', {
                'thing id': objectId,
                'list name': listCreationQuery,
                'via': 'thing detail'
              });
            }
          });
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleWishlistCheckboxChange", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var targ = event.currentTarget;
      var _this$props2 = _this.props,
          objectType = _this$props2.objectType,
          objectId = _this$props2.objectId,
          handleHide = _this$props2.handleHide;
      var name = 'wanted';
      var params = {
        owned: false,
        wanted: targ.checked
      };
      var eventName = targ.checked ? "Add to List" : "Remove from List";

      if (objectType === 'thing') {
        if (params.wanted && window.dataLayer) {
          window.dataLayer.push({
            'event': 'Add_to_Wishlist_Check',
            'product_id': undefined,
            'products_info': undefined,
            'products': undefined,
            'revenue': undefined,
            'option_id': undefined
          });
        }

        $.ajax("/rest-api/v1/things/".concat(objectId), {
          type: 'PUT',
          data: params
        }).done(function () {
          _this.drawUserList(objectId);

          _this.setStateSafe({
            wanted: params.wanted
          });

          if (params.wanted) {
            handleHide && handleHide();
          }
        }).error(function (err) {
          console.warn(err);
        });
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)(eventName, {
          'thing id': objectId,
          'list name': name,
          'list id': -1,
          'via': 'thing detail'
        });
      } else {
        console.warn('Add to list does not work with non-thing type');
        return;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleListCheckboxChange", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var targ = event.currentTarget;
      var isChecked = targ.checked;
      var _this$props3 = _this.props,
          objectId = _this$props3.objectId,
          objectType = _this$props3.objectType,
          handleHide = _this$props3.handleHide,
          merchantId = _this$props3.merchantId;
      var lists = _this.state.lists;
      var selectedListId = targ.getAttribute('data-listid');
      var collectionAction = [Number(selectedListId), targ.checked];

      if (objectType === 'thing') {
        var eventName = isChecked ? "Add to List" : "Remove from List";
        var theList = lists.filter(function (list) {
          return list.id === selectedListId;
        })[0];

        var callback = function callback() {
          _this.drawUserList(objectId);

          if (isChecked) {
            handleHide && handleHide();
          }

          (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.MP)(eventName, {
            'thing id': objectId,
            'list name': theList.name,
            'list id': theList.id,
            'via': 'thing detail'
          });
        };

        if (merchantId) {
          updateList({
            merchantId: merchantId,
            objectId: objectId,
            collectionAction: collectionAction,
            callback: callback
          });
        } else {
          var checked = [];
          var unchecked = [];
          $(_this.lists).find('input[type="checkbox"]:not(.tag)').each(function () {
            var listId = this.getAttribute('data-listid');

            if (this.checked) {
              checked.push(listId);
            } else {
              unchecked.push(listId);
            }
          });
          updateList({
            checked: checked,
            unchecked: unchecked,
            objectId: objectId,
            callback: callback
          });
        }
      } else {
        console.warn('Add to list does not work with non-thing type');
        return;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCreateListLabelClick", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.setStateSafe({
        createListFocused: true
      }, function () {
        _this.quickCreateList.focus();
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCreateListBlur", function () {
      _this.setStateSafe({
        createListFocused: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCreateListQueryChange", function (event) {
      _this.setStateSafe({
        listCreationQuery: event.target.value
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(AddlistPopover, [{
    key: "setStateSafe",
    value: function setStateSafe() {
      if (this.mounted) {
        this.setState.apply(this, arguments);
      }
    }
  }, {
    key: "drawUserList",
    value: function drawUserList(objectId) {
      var _this2 = this;

      objectId = objectId || this.props.objectId;
      getListCheckbox({
        merchantId: this.props.merchantId,
        objectId: objectId,
        callback: function callback(res) {
          _this2.setStateSafe(res);
        }
      });
    }
  }, {
    key: "isWishlistQuery",
    value: function isWishlistQuery(listSearchQuery) {
      return 'wishlist'.indexOf($.trim(listSearchQuery).toLowerCase()) !== -1;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
      this.listDrawn = false;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pp) {
      var _this3 = this;

      if ((pp.showList !== this.props.showList || this.listDrawn === false) && this.props.showList === true) {
        if (this.listDrawn === false) {
          this.listDrawn = true;
        }

        this.drawUserList(this.props.objectId);
        setTimeout(function () {
          _this3.listSearchInput.focus();
        }, 0);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props4 = this.props,
          objectId = _this$props4.objectId,
          showList = _this$props4.showList,
          headerGap = _this$props4.headerGap,
          merchantId = _this$props4.merchantId;
      var _this$state = this.state,
          lists = _this$state.lists,
          wanted = _this$state.wanted,
          listSearchQuery = _this$state.listSearchQuery,
          listCreationQuery = _this$state.listCreationQuery,
          createListFocused = _this$state.createListFocused;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        id: "show-addlist",
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("has-arrow more-share-popup", {
          bot: headerGap && headerGap < 16 + 269
          /*= tip + bubble*/

        }),
        style: (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.getDisplay)(showList)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "tit"
      }, merchantId ? gettext("Add to Collection") : gettext("Add to List")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "search before-bg-share2"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        ref: function ref(element) {
          _this4.listSearchInput = element;
        },
        type: "text",
        className: "text",
        placeholder: merchantId ? gettext('Search your collections') : gettext('Search your lists'),
        value: listSearchQuery,
        onChange: this.handleListSearch
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("ul", {
        className: "lists",
        ref: function ref(element) {
          _this4.lists = element;
        }
      }, !merchantId && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", {
        htmlFor: "wanted-".concat(objectId)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "checkbox",
        name: "wanted",
        checked: wanted,
        id: "wanted-".concat(objectId),
        className: "tag ".concat(wanted ? 'checked' : ''),
        style: {
          display: this.isWishlistQuery(listSearchQuery) ? null : 'none'
        },
        onChange: this.handleWishlistCheckboxChange
      }), " ", gettext('Wish List'))), lists && lists.map(function (list, idx) {
        var term = $.trim(listSearchQuery).toLowerCase();
        var style;

        if (_.isString(term) && term.length > 0) {
          style = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(list.name.toLowerCase().indexOf(term.toLowerCase()) === -1);
        }

        var className = list.selected ? "selected" : null;
        var ident = "".concat(objectId, "-").concat(list.id);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", {
          key: idx,
          style: style
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", {
          htmlFor: ident
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
          className: className,
          type: "checkbox",
          name: ident,
          id: ident,
          checked: list.selected,
          "data-listid": list.id,
          onChange: _this4.handleListCheckboxChange
        }), " ", list.name));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "new-list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("label", {
        htmlFor: "quick-create-list",
        style: {
          display: createListFocused ? 'none' : 'block'
        },
        onClick: this.handleCreateListLabelClick
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("i", {
        className: "icon"
      }), merchantId ? gettext('Create New Collection') : gettext("Create New List")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "text",
        id: "quick-create-list",
        ref: function ref(element) {
          _this4.quickCreateList = element;
        },
        onBlur: this.handleCreateListBlur,
        onKeyUp: this.handleListCreation,
        onChange: this.handleCreateListQueryChange,
        value: listCreationQuery,
        placeholder: merchantId ? gettext('Create New Collection') : gettext("Create New List")
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btn-create",
        onClick: this.handleListCreation
      }, gettext("Create"))));
    }
  }]);

  return AddlistPopover;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

function getListCheckbox(_ref) {
  var merchantId = _ref.merchantId,
      objectId = _ref.objectId,
      callback = _ref.callback;

  if (merchantId) {
    $.get("/rest-api/v1/seller/".concat(merchantId, "/collections"), {
      selected_object_id: objectId
    }).done(function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          collections = _ref2.collections;

      var lists;

      if (collections.length > 0) {
        lists = collections.sort(function (a, b) {
          var aText = $.trim(a).toLowerCase();
          var bText = $.trim(b).toLowerCase();
          return aText < bText ? -1 : 1;
        }).map(function (_ref3) {
          var id = _ref3.id,
              name = _ref3.name,
              selected = _ref3.selected;
          return {
            id: id,
            name: name,
            selected: selected
          };
        });
      } else {
        lists = [];
      }

      callback && callback({
        lists: lists,
        wanted: null
      });
    }).error(function (err) {
      console.warn(err);
    });
  } else {
    $.get('/_get_list_checkbox.html', {
      tid: objectId
    }).done(function (html) {
      var $html = $(html);
      var $items = $html.filter('li').find('img').remove().end();
      var lists;

      if ($items.length > 0) {
        lists = $items.sort(function (a, b) {
          var aText = $.trim($(a).text()).toLowerCase();
          var bText = $.trim($(b).text()).toLowerCase();
          return aText < bText ? -1 : 1;
        }).map(function (_, item) {
          var $item = $(item);
          return {
            id: $item.find('label').attr('for'),
            name: $.trim($item.find('label').text()),
            selected: $item.find('input').prop('checked')
          };
        }).get();
      } else {
        lists = [];
      }

      var wanted = $html.filter('input[name="wanted"]').val() === 'true';
      callback && callback({
        lists: lists,
        wanted: wanted
      });
    }).error(function (err) {
      console.warn(err);
    });
  }
}

function createList(_ref4) {
  var merchantId = _ref4.merchantId,
      listCreationQuery = _ref4.listCreationQuery,
      callback = _ref4.callback;

  if (merchantId) {
    $.post("/rest-api/v1/seller/".concat(merchantId, "/collections"), {
      list_name: listCreationQuery
    }).done(function (res) {
      // if ($(res).find("created").text() == 'False') {
      // if (false){
      //     alertify.alert(`List Title Not Available`, `There is already a list named ${listCreationQuery}. Try again with a different name.`);
      // } else {
      callback && callback(); // }
    }).error(function (err) {
      console.warn(err);
    });
  } else {
    $.post('/create_list.xml', {
      list_name: listCreationQuery,
      reaction: 0
    }).done(function (res) {
      if ($(res).find("created").text() == 'False') {
        fancyutils__WEBPACK_IMPORTED_MODULE_10__.alertify.alert("<b>List Title Not Available</b><br><br>There is already a list named ".concat(listCreationQuery, ". Try again with a different name."));
      } else {
        callback && callback();
      }
    }).error(function (err) {
      console.warn(err);
    });
  }
}

function updateList(_ref5) {
  var merchantId = _ref5.merchantId,
      collectionAction = _ref5.collectionAction,
      objectId = _ref5.objectId,
      checked = _ref5.checked,
      unchecked = _ref5.unchecked,
      callback = _ref5.callback;

  if (merchantId) {
    var _collectionAction = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(collectionAction, 2),
        collectionId = _collectionAction[0],
        add = _collectionAction[1];

    $.ajax({
      url: "/rest-api/v1/seller/".concat(merchantId, "/collections/").concat(collectionId),
      type: 'POST',
      data: {
        object_id: objectId,
        action: add ? 'add' : 'remove'
      }
    }).done(callback).error(function (err) {
      console.warn(err);
    });
  } else {
    $.post('/save_list_items', {
      tid: objectId,
      checked_list_ids: checked.join(','),
      unchecked_list_ids: unchecked.join(',')
    }).done(callback).error(function (err) {
      console.warn(err);
    });
  }
}

/***/ }),

/***/ "./_static/modules/libf/common-components/History.ts":
/*!***********************************************************!*\
  !*** ./_static/modules/libf/common-components/History.ts ***!
  \***********************************************************/
/*! namespace exports */
/*! export history [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "history": () => /* binding */ history
/* harmony export */ });
/* harmony import */ var history_createBrowserHistory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! history/createBrowserHistory */ "./node_modules/history/createBrowserHistory.js");

var history = (0,history_createBrowserHistory__WEBPACK_IMPORTED_MODULE_0__.default)();

/***/ }),

/***/ "./_static/modules/libf/common-components/MoreShare.js":
/*!*************************************************************!*\
  !*** ./_static/modules/libf/common-components/MoreShare.js ***!
  \*************************************************************/
/*! namespace exports */
/*! export MoreShare [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MoreShare": () => /* binding */ MoreShare
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
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");
/* harmony import */ var _SharePopover__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./SharePopover */ "./_static/modules/libf/common-components/SharePopover.js");
/* harmony import */ var _AddlistPopover__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./AddlistPopover */ "./_static/modules/libf/common-components/AddlistPopover.js");
/* harmony import */ var _MoreShareUtils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MoreShareUtils */ "./_static/modules/libf/common-components/MoreShareUtils.js");
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Popup */ "./_static/modules/libf/common-components/Popup.js");














 // returns dictionary with only one value true and else is false

function makeToggle(keys) {
  var obj = {};
  return function toggle() {
    keys.forEach(function (key) {
      obj[key] = false;
    });

    for (var _len = arguments.length, toggleKeys = new Array(_len), _key = 0; _key < _len; _key++) {
      toggleKeys[_key] = arguments[_key];
    }

    if (toggleKeys) {
      toggleKeys.forEach(function (key) {
        obj[key] = true;
      });
    }

    return obj;
  };
}

var toggleShow = makeToggle(["showShare", "showList", "showSellerList", "showMenu"]);
var MoreShare = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(MoreShare, _Component);

  function MoreShare() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, MoreShare);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(MoreShare)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "state", {
      showShare: false,
      showList: false,
      showMenu: false,
      headerGap: null,
      referrerURL: null,
      linkCopied: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleShareDisplay", function () {
      _this.setStateSafe({
        showShare: !_this.state.showShare,
        showList: false,
        showMenu: false,
        headerGap: (0,fancymixin__WEBPACK_IMPORTED_MODULE_10__.getElementGapFromHeader)(_this.moreMenuButton)
      }, _this.handleHook);

      if (_this.props.objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_13__.ShareObjectTypes.thing) {
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)("Share", {
          "thing id": _this.props.objectId
        });
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleListDisplay", function () {
      if (!fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.loggedIn) {
        _this.closePopup();

        window.require_login();
        return;
      }

      var showList = !_this.state.showList;

      _this.setStateSafe(toggleShow(showList ? "showList" : null), _this.handleHook);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleMerchantListDisplay", function () {
      if (!fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.loggedIn) {
        _this.closePopup();

        window.require_login();
        return;
      }

      var showSellerList = !_this.state.showSellerList;

      _this.setStateSafe(toggleShow(showSellerList ? "showSellerList" : null), _this.handleHook);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "closePopup", function () {
      _this.removeViewportCheck();

      _this.setStateSafe(toggleShow(), _this.handleHook);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "viewPortChecking", false);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "evtName", "scrollstop.MoreShare");

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "checkViewport", function () {
      if (_this.viewPortChecking) {
        return;
      }

      _this.viewPortChecking = true;
      $(window).on(_this.evtName, function () {
        var $root = $(_this.MoreShareEl);
        var headerEl = $("#header .header-featured").get(0);
        var _this$state = _this.state,
            showMenu = _this$state.showMenu,
            showShare = _this$state.showShare,
            showList = _this$state.showList,
            showSellerList = _this$state.showSellerList;
        var sel;

        if (showMenu) {
          sel = "#more-menu";
        } else if (showShare) {
          sel = "#show-share";
        } else if (showList || showSellerList) {
          sel = "#show-addlist";
        }

        var el = $root.find(sel).get(0);

        if (el) {
          var outsideViewport = (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.isElementOutsideViewport)(el, {
            element: headerEl,
            type: "top"
          });

          if (outsideViewport) {
            _this.closePopup();
          }
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "removeViewportCheck", function () {
      _this.viewPortChecking = false;
      $(window).off(_this.evtName);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleMoreShareToggle", function () {
      var objectType = _this.props.objectType;
      var _this$state2 = _this.state,
          showMenu = _this$state2.showMenu,
          showShare = _this$state2.showShare,
          showList = _this$state2.showList,
          showSellerList = _this$state2.showSellerList; // thing types will show menu

      if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_13__.ShareObjectTypes.thing || objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_13__.ShareObjectTypes.article) {
        if (showMenu || showShare || showList || showSellerList) {
          _this.closePopup();
        } else {
          _this.setStateSafe({
            showMenu: true,
            headerGap: (0,fancymixin__WEBPACK_IMPORTED_MODULE_10__.getElementGapFromHeader)(_this.moreMenuButton)
          }, _this.handleHook);
        } // non-thing types will show share popover directly, because add-to-list is not available

      } else {
        _this.handleShareDisplay();
      }

      return false;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleHook", function () {
      if (_this.props.onShowSomething) {
        var _this$state3 = _this.state,
            showList = _this$state3.showList,
            showShare = _this$state3.showShare,
            showMenu = _this$state3.showMenu,
            showSellerList = _this$state3.showSellerList;

        _this.props.onShowSomething(showList || showShare || showMenu || showSellerList, _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this));
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleHideList", function () {
      _this.setStateSafe({
        showList: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleHideShare", function () {
      _this.setStateSafe({
        showShare: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "linkCopiedRemovalTimer", null);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleCopyLink", function () {
      if (_this.linkCopiedRemovalTimer != null) {
        return;
      }

      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.copyToClipboard)(_this.state.referrerURL, {
        cb: function cb() {
          _this.setState({
            linkCopied: true
          });

          _this.linkCopiedRemovalTimer = setTimeout(function () {
            _this.setState({
              linkCopied: false
            });
          }, 5000);
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleFancydByDisplay", function () {
      event.preventDefault();
      event.stopPropagation();
      var _this$props = _this.props,
          viewerUsername = _this$props.viewerUsername,
          objectId = _this$props.objectId,
          objectType = _this$props.objectType;
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.renderPopup)(_Popup__WEBPACK_IMPORTED_MODULE_14__.FancydByPopup, {
        objectId: objectId,
        objectType: objectType,
        loggedIn: fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.loggedIn,
        viewerId: viewerUsername
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(MoreShare, [{
    key: "setStateSafe",
    value: function setStateSafe() {
      if (this.mounted) {
        this.setState.apply(this, arguments);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
      this.clickOutside = new fancyutils__WEBPACK_IMPORTED_MODULE_9__.ClickOutside({
        component: this,
        popupElementRefKey: "MoreShareEl"
      });

      if (this.props.facadeShowShare) {
        this.handleShareDisplay();
      }

      if (this.props.facadeShowList) {
        this.handleMoreShareToggle();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      this.clickOutside.destroy();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pp, ps) {
      var ns = this.state;
      var showList = ns.showList,
          showShare = ns.showShare,
          showMenu = ns.showMenu;

      if (showList || showShare || showMenu) {
        this.clickOutside.handleAttach(this.closePopup);
        this.checkViewport();

        if (showShare || showMenu) {
          (0,_MoreShareUtils__WEBPACK_IMPORTED_MODULE_13__.getShareURL)(this);
        }
      }

      if (ns.showMenu !== ps.showMenu && ns.showMenu === false) {
        this.setState({
          linkCopied: false
        });
        clearTimeout(this.linkCopiedRemovalTimer);
        this.linkCopiedRemovalTimer = null;
      }
    }
  }, {
    key: "shouldShowMerchantCollection",
    value: function shouldShowMerchantCollection() {
      return fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.merchant && fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.active_merchant;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          title = _this$props2.title,
          viewerUsername = _this$props2.viewerUsername,
          _this$props2$componen = _this$props2.componentClass,
          componentClass = _this$props2$componen === void 0 ? "menu-container" : _this$props2$componen,
          _this$props2$btnClass = _this$props2.btnClass,
          btnClass = _this$props2$btnClass === void 0 ? "btn-more" : _this$props2$btnClass,
          objectType = _this$props2.objectType,
          objectMeta = _this$props2.objectMeta,
          objectId = _this$props2.objectId,
          _this$props2$showShor = _this$props2.showShortcuts,
          showShortcuts = _this$props2$showShor === void 0 ? true : _this$props2$showShor,
          _this$props2$fromThin = _this$props2.fromThingSidebar,
          fromThingSidebar = _this$props2$fromThin === void 0 ? false : _this$props2$fromThin;

      if (objectType == null) {
        console.warn("objectType is not defined");
      }

      var _this$state4 = this.state,
          showShare = _this$state4.showShare,
          showList = _this$state4.showList,
          showMenu = _this$state4.showMenu,
          headerGap = _this$state4.headerGap,
          referrerURL = _this$state4.referrerURL,
          linkCopied = _this$state4.linkCopied,
          showSellerList = _this$state4.showSellerList;
      var isThing = objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_13__.ShareObjectTypes.thing;
      var isArticle = objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_13__.ShareObjectTypes.article;
      var showMerchantList = this.shouldShowMerchantCollection();
      var merchantId = showMerchantList && showSellerList ? fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.id : null;
      var newLayout = fromThingSidebar;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()(componentClass, "on-home ignore-ext", {
          open: showShare || showList || showMenu
        }),
        ref: function ref(el) {
          _this2.MoreShareEl = el;
        },
        "data-rendered": "true"
      }, newLayout && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btn-share",
        onClick: this.handleShareDisplay
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", {
        className: btnClass,
        onClick: this.handleMoreShareToggle,
        ref: function ref(element) {
          _this2.moreMenuButton = element;
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, _SharePopover__WEBPACK_IMPORTED_MODULE_11__.SharePopover.getShareMessage(objectType, "Share & Lists"))), (isThing || isArticle) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", {
        id: "more-menu",
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("has-arrow menu-content react new", {
          opened: showMenu,
          bot: headerGap && headerGap < 16 + 109
          /*= tip + bubble*/

        })
      }, !newLayout && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "share before-bg-share2",
        onClick: this.handleShareDisplay
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, gettext("Share item")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, gettext("Share this with friends"))), newLayout && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "fancyd-by before-bg-share2",
        onClick: this.handleFancydByDisplay
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, gettext("Fancy'd By")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, gettext("People who fancy'd this"))), isThing && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "add-list before-bg-share2",
        onClick: this.handleListDisplay
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, gettext("Lists")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, gettext("Add this to your saved lists"))), showMerchantList && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "add-list before-bg-share2",
        onClick: this.handleMerchantListDisplay
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, gettext("Add to Collection")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, gettext("Save this to your collections"))), showShortcuts && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        style: referrerURL ? null : {
          opacity: 0.7
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("copy-link"),
        onClick: this.handleCopyLink
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, linkCopied ? "Copied to clipboard" : "Item link"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, "Copy link to clipboard")))), isThing && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(_AddlistPopover__WEBPACK_IMPORTED_MODULE_12__.AddlistPopover, {
        key: "".concat(objectId, "-").concat(merchantId) || "".concat(objectId, "-addlist"),
        objectType: objectType,
        objectId: objectId,
        showList: showList || showSellerList,
        merchantId: merchantId,
        viewerUsername: viewerUsername,
        handleHide: this.handleHideList,
        headerGap: headerGap
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(_SharePopover__WEBPACK_IMPORTED_MODULE_11__.SharePopover, {
        objectType: objectType,
        objectId: objectId,
        objectMeta: objectMeta,
        showShare: showShare,
        title: title,
        referrerURL: this.state.referrerURL,
        viewerUsername: viewerUsername,
        headerGap: headerGap,
        handleHide: this.handleHideShare
      }));
    }
  }]);

  return MoreShare;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

/***/ }),

/***/ "./_static/modules/libf/common-components/MoreShareFacade.js":
/*!*******************************************************************!*\
  !*** ./_static/modules/libf/common-components/MoreShareFacade.js ***!
  \*******************************************************************/
/*! namespace exports */
/*! export MoreShareFacade [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MoreShareFacade": () => /* binding */ MoreShareFacade
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
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");










var MoreShareFacade = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(MoreShareFacade, _Component);

  function MoreShareFacade() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, MoreShareFacade);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(MoreShareFacade)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      share: false,
      list: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleClickShare", function () {
      _this.setState({
        share: true
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleClickList", function () {
      _this.setState({
        list: true
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(MoreShareFacade, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          share = _this$state.share,
          list = _this$state.list;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(react__WEBPACK_IMPORTED_MODULE_8__.Fragment, null, !(share || list) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(FakeMoreShare, {
        onClickShare: this.handleClickShare,
        onClickAddlist: this.handleClickList
      }), (share || list) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(common_components__WEBPACK_IMPORTED_MODULE_9__.MoreShare, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, this.props, {
        facadeShowShare: share,
        facadeShowList: list
      })));
    }
  }]);

  return MoreShareFacade;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

var FakeMoreShare = /*#__PURE__*/function (_Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(FakeMoreShare, _Component2);

  function FakeMoreShare() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, FakeMoreShare);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(FakeMoreShare).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(FakeMoreShare, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", {
        className: "menu-container on-home ignore-ext",
        "data-rendered": "true"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btn-share",
        onClick: this.props.onClickShare
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("small", {
        className: "btn-more",
        onClick: this.props.onClickAddlist
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", null, "Share & Lists")));
    }
  }]);

  return FakeMoreShare;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

/***/ }),

/***/ "./_static/modules/libf/common-components/MoreShareUtils.js":
/*!******************************************************************!*\
  !*** ./_static/modules/libf/common-components/MoreShareUtils.js ***!
  \******************************************************************/
/*! namespace exports */
/*! export ShareObjectTypes [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getShareURL [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShareObjectTypes": () => /* binding */ ShareObjectTypes,
/* harmony export */   "getShareURL": () => /* binding */ getShareURL
/* harmony export */ });
var ShareObjectTypes = {
  thing: 'thing',
  list: 'list',
  store: 'store',
  user: 'user',
  article: 'article'
};

function createReferredUrl(viewerUsername, objectId, objectType, objectMeta) {
  var url;

  if (objectType === ShareObjectTypes.thing) {
    url = "https://".concat(location.hostname, "/things/").concat(objectId);
  } else if (objectType === ShareObjectTypes.article && objectMeta) {
    url = "https://".concat(location.hostname, "/articles/").concat(objectMeta.slug);
  } else {
    url = location.href.replace(/(#.*)/, ''); // Remove hash
  }

  if (viewerUsername) {
    var connector = ~url.indexOf('?') ? '&' : '?';
    url = "".concat(url).concat(connector, "ref=").concat(viewerUsername);
  }

  return url;
}

function getShareURL(component, callback) {
  if (component.loading || component.state.referrerURL || component.props.referrerURL) {
    callback && callback(true);
    return;
  }

  component.loading = true; // If async loading is needed, assign setState callback.

  var cb = null;

  if (callback) {
    cb = function cb() {
      callback(false);
      component.loading = false;
    };
  }

  var _component$props = component.props,
      viewerUsername = _component$props.viewerUsername,
      objectId = _component$props.objectId,
      objectType = _component$props.objectType,
      objectMeta = _component$props.objectMeta;
  var originalUrl = createReferredUrl(viewerUsername, objectId, objectType, objectMeta);
  $.post('/get_short_url.json', {
    url: originalUrl
  }).done(function (res) {
    component.setState({
      referrerURL: res.short_url
    }, cb);
  }).fail(function () {
    component.setState({
      referrerURL: originalUrl
    }, cb);
    console.warn('/get_short_url failed');
  });
}

/***/ }),

/***/ "./_static/modules/libf/common-components/Popup.js":
/*!*********************************************************!*\
  !*** ./_static/modules/libf/common-components/Popup.js ***!
  \*********************************************************/
/*! namespace exports */
/*! export FancydByPopup [provided] [no usage info] [missing usage info prevents renaming] */
/*! export FancydByPopupV4 [provided] [no usage info] [missing usage info prevents renaming] */
/*! export FancydPerson [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FancydPerson": () => /* binding */ FancydPerson,
/* harmony export */   "FancydByPopup": () => /* binding */ FancydByPopup,
/* harmony export */   "FancydByPopupV4": () => /* binding */ FancydByPopupV4
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
/* harmony import */ var _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./MoreShareUtils */ "./_static/modules/libf/common-components/MoreShareUtils.js");











var FancydPerson = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(FancydPerson, _React$Component);

  function FancydPerson(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, FancydPerson);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(FancydPerson).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleFollow", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var user = _this.props.user;
      var _this$state = _this.state,
          following = _this$state.following,
          loading = _this$state.loading;

      if (_this.props.loggedIn !== true) {
        window.require_login();
        return;
      }

      if (loading) {
        return;
      }

      var url = following ? "/delete_follow.xml" : "/add_follow.xml";

      _this.setState({
        loading: true
      }, function () {
        $.ajax({
          type: "post",
          url: url,
          data: {
            user_id: user.id
          },
          dataType: "xml"
        }).done(function (xml) {
          var nextFollowing = !following;
          var $status = $(xml).find("status_code");

          if ($status.length && $status.text() !== 0) {
            _this.setState({
              following: nextFollowing
            });
          }
        }).always(function () {
          _this.setState({
            loading: false
          });
        });
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleTransition", function (event) {
      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.isPlainLeftClick)(event)) {
        var href = event.currentTarget.getAttribute("href");

        if (href) {
          location.href = href;
        }
      }
    });

    _this.state = {
      loading: false,
      following: false
    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(FancydPerson, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var following = this.props.following || this.props.user.following;

      if (following) {
        this.setState({
          following: following
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          user = _this$props.user,
          isAddedUser = _this$props.isAddedUser,
          viewerId = _this$props.viewerId;
      var following = this.state.following;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "/".concat(user.username),
        className: "username",
        onClick: this.handleTransition
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
        src: "/_ui/images/common/blank.gif",
        style: {
          backgroundImage: "url(".concat(user.image_url || user.user_square_image_small, ")")
        }
      }), isAddedUser ? "Added by " : "", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, user.fullname || user.full_name), isAddedUser ? "" : "@".concat(user.username)), viewerId !== user.id && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("btns-gray-embo", following ? "following" : "follow"),
        onClick: this.handleFollow
      }));
    }
  }]);

  return FancydPerson;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);
var FancydByPopup = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(FancydByPopup, _React$Component2);

  function FancydByPopup(props) {
    var _this2;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, FancydByPopup);

    _this2 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(FancydByPopup).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this2), "handleMore", function (event) {
      event.preventDefault();

      _this2.getFollowList();
    });

    _this2.state = _this2._getInitialState();
    return _this2;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(FancydByPopup, [{
    key: "_getInitialState",
    value: function _getInitialState() {
      return {
        loading: false,
        nextPage: 1,
        ended: null,
        added_user: null,
        users: [],
        owner: null
      };
    }
  }, {
    key: "getFollowList",
    value: function getFollowList(nextProps, reset) {
      var _this3 = this;

      var _ref = nextProps || this.props,
          objectId = _ref.objectId,
          objectType = _ref.objectType;

      var nextPage = this.state.nextPage;
      var immediateNextStateUpdate;

      if (reset) {
        immediateNextStateUpdate = this._getInitialState();
        immediateNextStateUpdate.loading = true;
      } else {
        immediateNextStateUpdate = {
          loading: true
        };
      }

      if (reset || this.state.loading !== true && this.state.ended !== true) {
        this.setState(immediateNextStateUpdate, function () {
          if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.thing) {
            $.get("/thing_follower_list.json", {
              thing_id: objectId,
              page: nextPage
            }, function (_ref2) {
              var has_next = _ref2.has_next,
                  users = _ref2.users,
                  owner = _ref2.owner;
              var nextState = {
                loading: false,
                users: _this3.state.users.concat(users),
                owner: owner
              };

              if (has_next) {
                nextState.nextPage = _this3.state.nextPage + 1;
                nextState.ended = false;
              } else {
                nextState.ended = true;
              }

              _this3.setState(nextState);
            }).fail(function () {
              _this3.setState({
                loading: false
              });
            });
          } else if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.article) {
            $.get("/rest-api/v1/articles/".concat(objectId, "/saved_users"), {
              page: nextPage
            }, function (_ref3) {
              var max_page = _ref3.max_page,
                  current_page = _ref3.current_page,
                  saved_users = _ref3.saved_users;
              var users = saved_users;
              var has_next = max_page > current_page;
              var nextState = {
                loading: false,
                users: _this3.state.users.concat(users),
                owner: null
              };

              if (has_next) {
                nextState.nextPage = _this3.state.nextPage + 1;
                nextState.ended = false;
              } else {
                nextState.ended = true;
              }

              _this3.setState(nextState);
            }).fail(function () {
              _this3.setState({
                loading: false
              });
            });
          }
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getFollowList();
      this.__last_tid = this.props.objectId;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(nextProps) {
      if (this.__last_tid !== nextProps.objectId) {
        this.__last_tid = nextProps.objectId;
        this.getFollowList(nextProps, true);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          ended = _this$state2.ended,
          users = _this$state2.users,
          owner = _this$state2.owner;
      var _this$props2 = this.props,
          loggedIn = _this$props2.loggedIn,
          viewerId = _this$props2.viewerId;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, gettext("Fancy'd by")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", null, owner ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(FancydPerson, {
        user: owner,
        isAddedUser: true,
        viewerId: viewerId,
        loggedIn: loggedIn
      }) : null, users.map(function (user, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(FancydPerson, {
          key: "FancydBy-".concat(idx),
          user: user,
          viewerId: viewerId,
          loggedIn: loggedIn
        });
      }), ended === false && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
        className: "more"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleMore
      }, gettext("View More")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return FancydByPopup;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(FancydByPopup, "popupName", "fancyd_list");

var FancydByPopupV4 = /*#__PURE__*/function (_React$Component3) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(FancydByPopupV4, _React$Component3);

  function FancydByPopupV4(props) {
    var _this4;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, FancydByPopupV4);

    _this4 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(FancydByPopupV4).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), "handleMore", function (event) {
      event.preventDefault();

      _this4.getFollowList();
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), "handleScroll", function (e) {
      var el = e.target;

      if (_this4.state.ended) {
        return;
      }

      if (el.scrollHeight - 50 <= el.clientHeight + el.scrollTop) {
        _this4.getFollowList();
      }
    });

    _this4.state = _this4._getInitialState();
    return _this4;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(FancydByPopupV4, [{
    key: "_getInitialState",
    value: function _getInitialState() {
      return {
        loading: false,
        nextPage: 1,
        next_cursor: null,
        ended: null,
        added_user: null,
        users: [],
        owner: null
      };
    }
  }, {
    key: "getFollowList",
    value: function getFollowList(nextProps, reset) {
      var _this5 = this;

      var _ref4 = nextProps || this.props,
          objectId = _ref4.objectId,
          objectType = _ref4.objectType,
          next_cursor = _ref4.next_cursor;

      var nextPage = this.state.nextPage;
      var immediateNextStateUpdate;

      if (reset) {
        immediateNextStateUpdate = this._getInitialState();
        immediateNextStateUpdate.loading = true;
      } else {
        immediateNextStateUpdate = {
          loading: true
        };
      }

      if (reset || this.state.loading !== true && this.state.ended !== true) {
        this.setState(immediateNextStateUpdate, function () {
          if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.thing) {
            var args = {};

            if (!!next_cursor) {
              args.cursor = next_cursor;
            }

            $.get("/rest-api/v1/things/".concat(objectId, "/fancyd-users"), args, function (_ref5) {
              var next_cursor = _ref5.next_cursor,
                  fancyd_users = _ref5.fancyd_users;
              var nextState = {
                loading: false,
                users: _this5.state.users.concat(fancyd_users),
                owner: null
              };

              if (!!next_cursor) {
                nextState.next_cursor = next_cursor;
                nextState.ended = false;
              } else {
                nextState.ended = true;
              }

              _this5.setState(nextState);
            }).fail(function () {
              _this5.setState({
                loading: false
              });
            });
          } else if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.article) {
            $.get("/rest-api/v1/articles/".concat(objectId, "/saved_users"), {
              page: nextPage
            }, function (_ref6) {
              var max_page = _ref6.max_page,
                  current_page = _ref6.current_page,
                  saved_users = _ref6.saved_users;
              var users = saved_users;
              var has_next = max_page > current_page;
              var nextState = {
                loading: false,
                users: _this5.state.users.concat(users),
                owner: null
              };

              if (has_next) {
                nextState.nextPage = _this5.state.nextPage + 1;
                nextState.ended = false;
              } else {
                nextState.ended = true;
              }

              _this5.setState(nextState);
            }).fail(function () {
              _this5.setState({
                loading: false
              });
            });
          }
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getFollowList();
      this.__last_tid = this.props.objectId;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(nextProps) {
      if (this.__last_tid !== nextProps.objectId) {
        this.__last_tid = nextProps.objectId;
        this.getFollowList(nextProps, true);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state3 = this.state,
          users = _this$state3.users,
          owner = _this$state3.owner;
      var _this$props3 = this.props,
          loggedIn = _this$props3.loggedIn,
          loading = _this$props3.loading,
          viewerId = _this$props3.viewerId;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, gettext("Liked by")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        onScroll: this.handleScroll
      }, owner ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(FancydPerson, {
        user: owner,
        isAddedUser: true,
        viewerId: viewerId,
        loggedIn: loggedIn
      }) : null, users.map(function (user, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(FancydPerson, {
          key: "FancydBy-".concat(idx),
          user: user,
          viewerId: viewerId,
          loggedIn: loggedIn
        });
      }), loading && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        id: "infscr-loading"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
        alt: "Loading...",
        src: "/_ui/images/common/loading.gif"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return FancydByPopupV4;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component); // const onLoad = () => { 
//     $(document.body).on("click", ".buttons .fancyd_user", function() {
//         if ($(this).closest('#overlay-thing').length > 0) {
//             return true;
//         }
//         const $container = $(this).closest(".buttons");
//         const objectId = $container.find(".fancy, .fancyd").attr("tid");
//         const objectType = 'thing';
//         if (objectId) {
//             renderPopup(FancydByPopup, { objectId, objectType, loggedIn: FancyUser.loggedIn, viewerId: FancyUser.id });
//             return false;
//         }
//     });
// }
// if (document.readyState !== 'loading') {
//     onLoad()
// } else {
//     document.addEventListener("DOMContentLoaded", onLoad)
// }

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(FancydByPopupV4, "popupName", "fancyd_list");

/***/ }),

/***/ "./_static/modules/libf/common-components/ProductSlide.js":
/*!****************************************************************!*\
  !*** ./_static/modules/libf/common-components/ProductSlide.js ***!
  \****************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ applyProductSlide
/* harmony export */ });
// fork of recommend-slide (accacb79d2af557369e02132ef5f486d226aa5d3)
function applyProductSlide() {
  $(function () {
    var mWidth = 920;

    function initSlide($el, option) {
      var $slide;

      if ($el.is('.itemSlide, .slideshow')) {
        $slide = $el;
      } else {
        $slide = $el.find(".itemSlide, .slideshow");
      }

      $slide.data('slideInit', true);
      var $list = $el.find("ul"),
          $li = $list.find("li"),
          itemWidth = $li.width() + 20,
          $prev = $el.find("a.prev"),
          $next = $el.find("a.next");
      var slideWidth = null;
      if (option.itemPerSlide) slideWidth = itemWidth * option.itemPerSlide;

      function resetRecommend() {
        if (!$slide || !$li) {
          $el.css("visibility", "visible");
          return;
        }

        if (slideWidth && slideWidth > itemWidth * $li.length) {
          $el.css("visibility", "visible");
          return;
        }

        if ($(window).width() < mWidth) {
          if (option.center) {
            $slide.find(".itemList").scrollLeft(($li.length * 147 - $(window).width() + 20) / 2);
          }

          $prev.removeClass("disabled");
          $next.removeClass("disabled");
        } else {
          if ($slide.width() > itemWidth * $li.length) {
            $prev.addClass("disabled");
            $next.addClass("disabled");

            if (option.center) {
              $slide.find(".itemList").css("left", "0px");
            }
          } else {
            if (option.center) {
              $slide.find(".itemList").css("left", -parseInt(($li.length * 285 - $(window).width() + 20) / 2) + "px");
            }

            $prev.removeClass("disabled");
            $next.removeClass("disabled");
          }
        }

        $el.css("visibility", "visible");
      }

      function getPrevLeft($el) {
        preparePrev();
        var left = Math.abs(parseInt($list.css("left"))),
            nextLeft,
            width = $slide.width();
        if (slideWidth) width = slideWidth;
        nextLeft = left - width;
        return nextLeft;
      }

      function getNextLeft($el) {
        prepareNext();
        var left = Math.abs(parseInt($list.css("left"))),
            nextLeft,
            width = $slide.width();
        if (slideWidth) width = slideWidth;
        nextLeft = left + width;
        return nextLeft;
      }

      function preparePrev() {
        var $li = $list.find("li"),
            left = Math.abs(parseInt($list.css("left"))),
            width = $slide.width(),
            itemWidth = $li.width() + 20;
        if (slideWidth) width = slideWidth;

        if (left < width) {
          var prepareCount = Math.ceil(Math.abs(width - left) / itemWidth);

          for (var i = 0; i < prepareCount; i++) {
            var $el = $list.find("li:not([_prev])").last();
            $el.clone().insertBefore($list.find("li").first());
            $el.attr("_prev", true);
          }

          $list.css("left", 0 - left - prepareCount * itemWidth + "px");
        }
      }

      function prepareNext() {
        var $li = $list.find("li"),
            left = Math.abs(parseInt($list.css("left"))),
            width = $slide.width(),
            listWidth = $li.length * ($li.width() + 20),
            itemWidth = $li.width() + 20,
            spare = listWidth - (left + width);
        if (slideWidth) width = slideWidth;

        if (spare - width < width) {
          var prepareCount = Math.ceil(Math.abs(width - (listWidth - (left + width))) / itemWidth);

          for (var i = 0; i < prepareCount; i++) {
            var $el = $list.find("li:not([_next])").first();
            $el.clone().insertAfter($list.find("li").last());
            $el.attr("_next", true);
          }
        }
      }

      function clearOld() {
        var $li = $list.find("li"),
            left = Math.abs(parseInt($list.css("left"))),
            itemWidth = $li.width() + 20,
            $prev = $list.find("li[_next]:not(:in-viewport)"),
            prevCnt = $prev.length;
        $list.find("li[_prev]:not(:in-viewport)").remove();
        $prev.remove();
        $list.css("left", 0 - left + prevCnt * itemWidth + "px");
      }

      resetRecommend();

      if (slideWidth && slideWidth > itemWidth * $li.length) {
        $prev.hide();
        $next.hide();
      }

      $el.on("click", "a.prev", function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass("_disabled")) return;
        var left = getPrevLeft($el);
        $this.addClass("_disabled");
        $list.animate({
          left: 0 - left + "px"
        }, 300, "easeInOutExpo", function () {
          clearOld();
          $this.removeClass("_disabled");
        });
      }).on("click", "a.next", function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass("_disabled")) return;
        var left = getNextLeft($el);
        $this.addClass("_disabled");
        $list.animate({
          left: 0 - left + "px"
        }, 300, "easeInOutExpo", function () {
          clearOld();
          $this.removeClass("_disabled");
        });
      });
    }

    $.fn.productSlide = function (option) {
      var option = option || {
        center: true
      };
      var self = this;
      var $slides = this.each(function () {
        var $el = $(this);
        initSlide($el, option);
      });
      return $slides;
    };
  });
}

/***/ }),

/***/ "./_static/modules/libf/common-components/SharePopover.js":
/*!****************************************************************!*\
  !*** ./_static/modules/libf/common-components/SharePopover.js ***!
  \****************************************************************/
/*! namespace exports */
/*! export SNSShareBox [provided] [no usage info] [missing usage info prevents renaming] */
/*! export SharePopover [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SharePopover": () => /* binding */ SharePopover,
/* harmony export */   "SNSShareBox": () => /* binding */ SNSShareBox
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
/* harmony import */ var _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./MoreShareUtils */ "./_static/modules/libf/common-components/MoreShareUtils.js");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");












var SNSDict = {
  "fb": "Facebook",
  "tw": "Twitter",
  "tb": "Tumblr"
};
var followingUsers = [];
var followingUsersRequested = false;
var ViewClasses = {
  Success: 'empty success',
  Default: 'empty default',
  Searching: 'empty searching',
  NoResult: 'empty no-result'
};
var SharePopover = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(SharePopover, _React$Component);

  function SharePopover(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, SharePopover);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SharePopover).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "state", {
      friendSearchQuery: '',
      searchedFriends: [],
      selectedUserID: null,
      sentUser: null,
      sendNote: '',
      sendSuccess: false,
      searching: false,
      isContact: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "mailUser", {
      id: 'EMAIL',
      type: 'email',
      profile_image_url: '/_ui/images/common/blank.gif',
      fullname: 'Email',

      /* mut */
      username: null
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleContinue", function (event) {
      event.preventDefault();

      _this.clearFriendList();

      if (_this.props.handleHide) {
        _this.props.handleHide();
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleFriendSearch", function (event) {
      var friendSearchQuery = event.target.value;
      var prevQuery = _this.state.friendSearchQuery;

      _this.setState({
        friendSearchQuery: friendSearchQuery,
        sendSuccess: false,
        searching: true
      }, function () {
        _this.searchFriends(prevQuery, friendSearchQuery);
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleSend", function () {
      var _this$state = _this.state,
          sendNote = _this$state.sendNote,
          selectedUserID = _this$state.selectedUserID,
          searchedFriends = _this$state.searchedFriends;
      var _this$props = _this.props,
          title = _this$props.title,
          referrerURL = _this$props.referrerURL;

      if (_this.sending) {
        return;
      }

      var isMailuser = selectedUserID === _this.mailUser.id;

      if (isMailuser) {
        _this.handleSendMail();

        return;
      } else if (searchedFriends.length === 0 || selectedUserID == null) {
        return;
      }

      var objectType = _this.props.objectType;
      var params;

      if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.thing) {
        params = {
          things: _this.props.objectId,
          user_id: selectedUserID
        };
      } else {
        params = {
          user_id: selectedUserID,
          message: "".concat(title, " ").concat(referrerURL)
        };
      }

      _this.sending = true;

      if ($.trim(sendNote)) {
        params.message += ' ' + $.trim(sendNote);
      }

      $.post('/messages/send-message.json', params).done(function (json) {
        if (json.status_code !== 1) {
          if (json.message) {
            fancyutils__WEBPACK_IMPORTED_MODULE_9__.alertify.alert(json.message);
          } else {
            fancyutils__WEBPACK_IMPORTED_MODULE_9__.alertify.alert("There was an error while sending message. Please try again.");
          }

          return;
        }

        _this.clearFriendList({
          sendSuccess: true,
          sentUserID: selectedUserID,
          selectedUserID: null
        }, ['searchedFriends']);

        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)('Complete Share', {
          "thing id": params.things,
          "type": "FancyMessage"
        });
      }).fail(function (xhr) {
        console.warn(xhr);
      }).always(function () {
        _this.sending = false;
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleSendMail", function () {
      if (_this.sending) {
        return;
      }

      if (_this.props.objectType == null) {
        console.warn('objectType should be provided.');
      }

      var object_type = _this.props.objectType || 'thing';

      var email_address = _this.mailUser.username.trim();

      var object_id = _this.props.objectId;
      _this.sending = true;
      var params = {
        email_address: email_address,
        object_type: object_type,
        object_id: object_id
      };
      var message = $.trim(_this.state.sendNote);

      if (message) {
        params.message = message;
      }

      if (_this.props.objectMeta && _this.props.objectMeta.type === 'shoplist') {
        params.object_meta = _this.props.objectMeta.type;
      }

      $.post('/messages/send-email.json', params).done(function (json) {
        if (json.status_code !== 1) {
          if (json.message) {
            fancyutils__WEBPACK_IMPORTED_MODULE_9__.alertify.alert(json.message);
          } else {
            fancyutils__WEBPACK_IMPORTED_MODULE_9__.alertify.alert("There was an error while sending message. Please try again.");
          }

          return;
        }

        _this.clearFriendList({
          sendSuccess: true,
          sentUserID: params.email_address,
          selectedUserID: null
        });

        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)('Complete Share', {
          "object id": params.object_id,
          "object type": params.object_type,
          "type": "Email"
        });
      }).fail(function (xhr) {
        var responseObject = null;

        try {
          responseObject = JSON.parse(xhr.responseText);
        } catch (e) {}

        if (responseObject && responseObject.message) {
          fancyutils__WEBPACK_IMPORTED_MODULE_9__.alertify.alert(responseObject.message);
        } else {
          fancyutils__WEBPACK_IMPORTED_MODULE_9__.alertify.alert("Error occured. please try again.\n" + xhr.status + ' ' + xhr.statusText);
        }

        console.warn(xhr);
      }).always(function () {
        _this.sending = false;
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "clearFriendList", function (additionals, excludes) {
      // remove search history for users
      var nextState = _.extend({
        friendSearchQuery: '',
        searchedFriends: [],
        sendNote: '',
        sendSuccess: false,
        sentUserID: null
      }, additionals);

      if (excludes) {
        excludes.forEach(function (excludeKey) {
          delete nextState[excludeKey];
          nextState[excludeKey] = _this.state[excludeKey];
        });
      }

      _this.setState(nextState);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleSendNoteInput", function (event) {
      var sendNote = event.target.value;

      _this.setState({
        sendNote: sendNote
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleUserSelect", function (event) {
      event.preventDefault();
      var selectedUserID = _this.state.selectedUserID;
      var nextID = $(event.currentTarget).attr('data-userid'); // Canceling

      if (String(selectedUserID) === $(event.currentTarget).attr('data-userid')) {
        _this.setState({
          selectedUserID: null
        }); // Selecting

      } else {
        _this.setState({
          selectedUserID: nextID
        });
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "getSelectedUser", function () {
      var selectedUserID = _this.state.selectedUserID;
      return _.find(_this.getSearchedFriends(), function (e) {
        return String(e.id) === selectedUserID;
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "getSentUser", function () {
      var sentUserID = _this.state.sentUserID;
      return _.find(_this.getSearchedFriends(), function (e) {
        return String(e.id) === sentUserID;
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "getDisplayUsers", function () {
      if (followingUsersRequested) {
        return;
      }

      _this.loadingDisplayUsers = true;
      followingUsersRequested = true;
      $.get('/get-share-display-users.json').done(function (res) {
        if (res.status_code === 1 && res.users.length > 0) {
          followingUsers.push.apply(followingUsers, res.users);
        }
      }).fail(function () {
        console.warn('failed to fetch display users');
      }).always(function () {
        _this.loadingDisplayUsers = false;

        _this.forceUpdate();
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleClickBackFromContact", function () {
      _this.setState({
        isContact: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleClickContactImport", function (event) {
      event.preventDefault();

      _this.setState({
        isContact: true
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "getSharedMailUser", function () {
      var friendSearchQuery = _this.state.friendSearchQuery;
      _this.mailUser.username = friendSearchQuery;
      return [_this.mailUser];
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "getSearchedFriends", function () {
      if (_this.state.friendSearchQuery.length !== 0 || _this.state.sendSuccess) {
        if (_this.isInputEmail()) {
          return _this.getSharedMailUser();
        } else {
          return _this.state.searchedFriends;
        }
      } else {
        return followingUsers;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "isInputEmail", function () {
      var friendSearchQuery = _this.state.friendSearchQuery;
      return friendSearchQuery.length > 1 && friendSearchQuery.indexOf('@') > 0;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "isEmailOnlyMode", function () {
      return !(_this.props.objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.thing || _this.props.objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.article) || !fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.loggedIn;
    });

    _this.searchFriends = (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.debounceUntilTimeout)(function searchFriends(prevQuery, friendSearchQuery) {
      var _this2 = this;

      if (this.isEmailOnlyMode()) {
        this.setState({
          searching: false
        });
        return;
      }

      var term = $.trim(friendSearchQuery);

      if ($.trim(prevQuery) === term) {
        return;
      }

      if (term === '') {
        this.setState({
          searchedFriends: [],
          selectedUserID: null
        });
        return;
      }

      this.setState({
        searching: true
      }, function () {
        $.get('/search-users.json', {
          term: term,
          filter_messages_permission: true
        }).done(function (searchedFriends) {
          var nextState = {
            searching: false
          };

          if (_this2.state.friendSearchQuery === friendSearchQuery) {
            nextState.searchedFriends = searchedFriends;
            nextState.selectedUserID = null;
          }

          _this2.setState(nextState);
        });
      });
    }, 200, _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this));
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(SharePopover, [{
    key: "getPrefix",
    value: function getPrefix(user) {
      return user.type === 'email' ? '' : '@';
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var showShare = this.props.showShare;
      var isContact = this.state.isContact; // share is closed, if contact mode close it.

      if (isContact && !showShare && prevProps.showShare !== showShare) {
        this.setState({
          isContact: false
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // Do loading friends stuff.
      if (!this.isEmailOnlyMode()) {
        this.getDisplayUsers();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          showShare = _this$props2.showShare,
          title = _this$props2.title,
          headerGap = _this$props2.headerGap,
          objectType = _this$props2.objectType,
          objectId = _this$props2.objectId,
          objectMeta = _this$props2.objectMeta,
          viewerUsername = _this$props2.viewerUsername,
          referrerURL = _this$props2.referrerURL;

      if (true) {
        viewerUsername == null && console.warn('SharePopover: viewerUsername missing');
      }

      var _this$state2 = this.state,
          friendSearchQuery = _this$state2.friendSearchQuery,
          sendNote = _this$state2.sendNote,
          sendSuccess = _this$state2.sendSuccess,
          sentUserID = _this$state2.sentUserID,
          searching = _this$state2.searching,
          isContact = _this$state2.isContact;
      var searchedFriends = this.getSearchedFriends();
      var selectedUser = this.getSelectedUser();
      var sentUser = this.getSentUser();
      var emptyDisplay = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.Block;
      var emptyClassName;
      var searchedFriendsDisplay;
      var inputIsEmail = this.isInputEmail();
      var emailOnlyMode = this.isEmailOnlyMode(); // Search returns nothing

      if (sendSuccess) {
        emptyClassName = ViewClasses.Success;
      } else {
        if (emailOnlyMode && !inputIsEmail) {
          emptyClassName = ViewClasses.Default;
        } else if (searchedFriends.length > 0) {
          if (!inputIsEmail && searching) {
            emptyClassName = ViewClasses.Searching;
          }
        } else if (searchedFriends.length === 0) {
          if (friendSearchQuery.length === 0) {
            if (this.loadingDisplayUsers) {
              emptyClassName = ViewClasses.Searching;
            } else {
              emptyClassName = ViewClasses.Default;
            }
          } else {
            if (searching) {
              emptyClassName = ViewClasses.Searching;
            } else {
              emptyClassName = ViewClasses.NoResult;
            }
          }
        }
      }

      if (emptyClassName) {
        searchedFriendsDisplay = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.None;
      } else {
        emptyDisplay = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.None;
      }

      if (selectedUser) {
        searchedFriendsDisplay = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.None;
      }

      var noteSendable = !this.sending && searchedFriends.length > 0 && !!selectedUser; // Sliding indicator style

      var isSNS = !(selectedUser || sendSuccess);
      var sentMessage = '';

      if (sendSuccess) {
        sentMessage += gettext("Sent to ");
        sentMessage += sentUser ? sentUser.fullname || sentUser.username : sentUserID;
      }

      var bottom = false;

      if (headerGap < 290) {
        bottom = true;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        id: "show-share",
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("more-share-popup more-share-popup-2 has-arrow", {
          bot: bottom
        }),
        style: (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.getDisplay)(showShare)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("h3", {
        className: "tit",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(isContact || selectedUser)
      }, SharePopover.getShareMessage(objectType, 'Share')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: "btn-back",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(!selectedUser || sentUser),
        onClick: function onClick() {
          _this3.setState({
            selectedUserID: null
          });

          return false;
        }
      }, "Back"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "frm",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(isContact)
      }, fancyutils__WEBPACK_IMPORTED_MODULE_9__.FancyUser.loggedIn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        id: "more-share-send"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "textbox before-bg-share2",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(selectedUser || sendSuccess)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        id: "more-share-email",
        className: "text",
        type: "text",
        placeholder: emailOnlyMode ? gettext("Enter email address") : gettext("Username or email address"),
        autoComplete: "off",
        onChange: this.handleFriendSearch,
        value: friendSearchQuery
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "lists",
        style: searchedFriendsDisplay
      }, searchedFriends.map(function (user, idx) {
        var term = $.trim(friendSearchQuery).toLowerCase();

        var prefix = _this3.getPrefix(user);

        var style;

        if (term) {
          if ("".concat(user.fullname, " ").concat(prefix).concat(user.username).toLowerCase().indexOf(term) === -1) {
            style = fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.None;
          }
        }

        var username;
        var imgClass;

        if (user.type === 'email') {
          username = user.username;
          imgClass = 'email';
        } else {
          username = "".concat(prefix).concat(user.username);
        }

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          key: idx,
          style: style
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: "before-bg-share2",
          onClick: _this3.handleUserSelect,
          "data-userid": user.id
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
          alt: "",
          className: imgClass,
          src: user.profile_image_url
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, user.fullname), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, username)));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: emptyClassName,
        style: emptyDisplay
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "circle bg-share2"
      }), emailOnlyMode ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "default"
      }, gettext("Share this via Email")) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "default"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, gettext("Find people to share with")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleClickContactImport
      }, gettext("Import from contacts"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "searching"
      }, gettext("Searching...")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "no-result"
      }, gettext("No users found")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "success"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, gettext("Success!")), sentMessage, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: "close",
        onClick: this.handleContinue
      }, gettext("Continue")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "send",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(selectedUser == null)
      }, selectedUser && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "recipient"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
        alt: "user image",
        className: selectedUser.type === 'email' && 'email',
        src: selectedUser.profile_image_url
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, selectedUser.fullname), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, this.getPrefix(selectedUser), selectedUser.username)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("fieldset", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("textarea", {
        placeholder: "Add a message",
        value: sendNote,
        onChange: this.handleSendNoteInput
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btn-send",
        disabled: !noteSendable,
        onClick: this.handleSend
      }, "Send")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(SNSShareBox, {
        showShareBox: isSNS,
        title: title,
        referrerURL: referrerURL,
        objectId: objectId,
        objectType: objectType,
        objectMeta: objectMeta,
        viewerUsername: viewerUsername
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "contact-sns",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(!isContact)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleClickBackFromContact,
        className: "back"
      }, "Back"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "/find-friends",
        className: "fb",
        target: "_blank"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, " Facebook")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "/find-friends?type=twitter",
        className: "tw",
        target: "_blank"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, " Twitter")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "/find-friends?type=gmail",
        className: "gm",
        target: "_blank"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, " Gmail"))));
    }
  }], [{
    key: "getShareMessage",
    value: function getShareMessage(objectType) {
      var defaultMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var shareMessage = defaultMessage;

      if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.list) {
        shareMessage = 'Share collection';
      } else if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.store) {
        shareMessage = 'Share store';
      } else if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.user) {
        shareMessage = 'Share profile';
      } else if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.article) {
        shareMessage = 'Share article';
      }

      return shareMessage;
    }
  }]);

  return SharePopover;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);
var SNSShareBox = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(SNSShareBox, _React$Component2);

  function SNSShareBox() {
    var _getPrototypeOf2;

    var _this4;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, SNSShareBox);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this4 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SNSShareBox)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), "state", {
      copied: false,
      referrerURL: '',
      textboxDisplay: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), "loading", false);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), "snsShareWindow", null);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), "handleEmbed", function () {
      var _assertThisInitialize = _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4),
          updateEmbedOption = _assertThisInitialize.updateEmbedOption,
          _assertThisInitialize2 = _assertThisInitialize.props,
          objectType = _assertThisInitialize2.objectType,
          objectId = _assertThisInitialize2.objectId,
          viewerUsername = _assertThisInitialize2.viewerUsername;

      if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.thing) {
        var $ep = $("#embed_popup");
        $ep.off('click.fancyembed').off('keyup.fancyembed').on('click.fancyembed', 'input[name="embed-info"]', function () {
          updateEmbedOption($("#embed_popup"), viewerUsername);
        }).on('keyup.fancyembed', 'input[name="embed-width"]', function () {
          updateEmbedOption($("#embed_popup"), viewerUsername);
        });
        $ep.find('.customize').removeClass('opened');
        $ep.find('input[name="embed-info"]').prop('checked', true);
        $ep.find('input[name="embed-width"]').val(450);
        $ep.attr('tid', objectId);
        updateEmbedOption($("#embed_popup"), viewerUsername);
        $.dialog("embed_item").open(true);
      }

      return false;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), "handleShare", function (event) {
      var _assertThisInitialize3 = _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4),
          _assertThisInitialize4 = _assertThisInitialize3.props,
          objectId = _assertThisInitialize4.objectId,
          objectType = _assertThisInitialize4.objectType;

      var element = event.currentTarget; // redirect to acquired URL using blank window, which does not blocked by blocker usually.
      // Low possiblity, but if assign fails with DOMException, silently pass so
      // user can retry without confusion.

      if (event.detail && event.detail.faintClick) {
        try {
          _this4.snsShareWindow.location.assign(element.getAttribute('href'));
        } catch (e) {} // Remove disposable window 


        _this4.snsShareWindow = null;
        return;
      } else {
        if (!_this4.getRefURL()) {
          _this4.snsShareWindow = window.open('about:blank', '_fancy_sns_share');
        }

        event.preventDefault();
      }

      (0,_MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.getShareURL)(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this4), function (directClick) {
        if (directClick) {
          window.open(element.getAttribute('href'), '_fancy_sns_share');
        } else {
          (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.triggerEvent)(element, 'click', {
            faintClick: true
          });
        }
      });

      if (objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.thing) {
        var type = SNSDict[element.className];
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)('Complete Share', {
          "thing id": objectId,
          type: type
        });
      }
    });

    return _this4;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(SNSShareBox, [{
    key: "getRefURL",
    value: function getRefURL() {
      return this.state.referrerURL || this.props.referrerURL;
    }
  }, {
    key: "updateEmbedOption",
    value: function updateEmbedOption($li, viewerUsername) {
      var $thumb = $li.find('.embed-thum');
      var $options = $li.find('input[name="embed-info"]');
      var types = [];
      $options.each(function () {
        var value = this.value,
            checked = this.checked;

        if (checked) {
          $thumb.addClass(value);
          types.push(value);
        } else {
          $thumb.removeClass(value);
        }
      });
      var width = parseInt($li.find('input[name="embed-width"]').val(), 10) || undefined;
      var snippet = $('<script />', {
        'src': "//".concat(location.hostname, "/embed.js?v=150608"),
        'async': true,
        'class': 'fancy-embed',
        'data-id': $li.attr('tid') || $li.attr('objectId') || '',
        'data-ref': viewerUsername,
        'data-type': types.length > 0 ? types.join(',') : '',
        'data-width': width
      }).prop('outerHTML');
      $li.find('textarea[name="embed-code"]').val(snippet);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          title = _this$props3.title,
          showShareBox = _this$props3.showShareBox,
          objectType = _this$props3.objectType;
      var textboxDisplay = this.state.textboxDisplay;
      var referrerURL = this.getRefURL();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        id: "more-share-sns",
        className: "more-share-sns",
        style: showShareBox ? fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.Block : fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.None
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "via after",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_11__.Display.NoneIf(textboxDisplay)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "https://www.facebook.com/sharer.php?u=".concat(referrerURL),
        onClick: this.handleShare,
        className: "fb",
        target: "_blank"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "ic-fb"
      }), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, gettext("Share with Facebook"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "https://twitter.com/share?text=".concat(encodeURI(title), "&url=").concat(referrerURL, "&via=fancy"),
        onClick: this.handleShare,
        className: "tw",
        target: "_blank"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "ic-tw"
      }), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, gettext("Share with Twitter"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "https://www.tumblr.com/share/link?url=".concat(referrerURL, "&name=").concat(encodeURI(title), "&description=").concat(encodeURI(title)),
        onClick: this.handleShare,
        className: "tb",
        target: "_blank"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "ic-tb"
      }), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, gettext("Share with Tumblr"))), objectType === _MoreShareUtils__WEBPACK_IMPORTED_MODULE_10__.ShareObjectTypes.thing && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleEmbed,
        className: "embed"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "ic-em"
      }), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, gettext("Embed this item")))));
    }
  }]);

  return SNSShareBox;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

/***/ }),

/***/ "./_static/modules/libf/common-components/Video.js":
/*!*********************************************************!*\
  !*** ./_static/modules/libf/common-components/Video.js ***!
  \*********************************************************/
/*! namespace exports */
/*! export Video [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getVideo [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getVideo": () => /* binding */ getVideo,
/* harmony export */   "Video": () => /* binding */ Video
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







 // import classnames from "classnames";
// import { proportionFormat, isSafari as isSafariUtil } from "fancyutils";


function getVideo(object) {
  if (object.h264_1000k_url) return object;
  var saleVideo = object && object.sales && object.sales.video;
  var thingOrArticleVideo = object && object.video_cover || object && object.cover_video;

  if (saleVideo) {
    return saleVideo;
  } else if (thingOrArticleVideo) {
    try {
      if (!thingOrArticleVideo.h264_1000k_url && object.cover_video.outputs.h264_1000k) {
        thingOrArticleVideo.h264_1000k_url = object.cover_video.outputs.h264_1000k.url;
      }
    } catch (e) {}

    return thingOrArticleVideo;
  } else if (object.metadata && object.metadata.video_url) {
    return {
      thumbnail_url: object.image.src,
      original_url: object.metadata.video_url
    };
  } else {
    console.warn("<Video /> component is mounted but with unknown type");
    return {};
  }
}
var Video = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(Video, _React$Component);

  function Video(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Video);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Video).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "el", null);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "videoEl", null);

    _this.id = +new Date();
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Video, [{
    key: "getSrc",
    value: function getSrc() {
      var object = this.props.object;
      var video = getVideo(object);
      return video.h264_1000k_url || video.original_url || video.original;
    }
  }, {
    key: "getThumbnail",
    value: function getThumbnail() {
      var object = this.props.object;
      var video = getVideo(object);
      return video.thumbnail_url;
    }
  }, {
    key: "getLoop",
    value: function getLoop() {
      var object = this.props.object;
      return getVideo(object).loop;
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.lastFullyRenderedObjectID !== this.props.lastFullyRenderedObjectID || nextProps.display !== this.props.display || nextProps.playing !== this.props.playing || nextProps.object !== this.props.object;
    }
  }, {
    key: "prepare",
    value: function prepare() {
      var domCls = "video-".concat(this.id);
      var $el = $(".".concat(domCls));

      if ($el.length) {
        if ($el[0].src !== this.getSrc()) {
          $el[0].src = this.getSrc();
          $el[0].loop = !!this.getLoop();
          $el[0].currentTime = 0;
        }
      } else {
        $el = $("<video id=\"myVideo\" class=\"".concat(domCls, "\" preload=\"auto\" playsInline disablePictureInPicture autoplay muted controls controlslist=\"nodownload nofullscreen noremoteplayback\" src=\"").concat(this.getSrc(), "\" loop=\"").concat(!!this.getLoop(), "\" poster=\"").concat(this.getThumbnail(), "\"/>")).on("ended", function () {
          this.currentTime = 0;
        });
        this.videoEl = $el.get(0);
        $(this.el).empty().append(this.videoEl);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var np = this.props;

      if (np.display !== prevProps.display) {
        if (np.display === false) {
          this.videoEl && this.videoEl.pause();
        } else {
          this.videoEl && this.videoEl.play();
        }
      }

      if (np.display && np.playing != prevProps.playing) {
        if (np.playing === false) {
          this.videoEl && this.videoEl.pause();
        } else {
          this.videoEl && this.videoEl.play();
        }
      }

      this.prepare();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          display = _this$props.display,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style,
          playing = _this$props.playing;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        style: _.extend(style, fancymixin__WEBPACK_IMPORTED_MODULE_8__.Display.NoneIf(!display)),
        className: "video_player nozoom",
        ref: function ref(el) {
          _this2.el = el;

          if (!_this2.videoEl) {
            _this2.prepare();
          }
        }
      });
    }
  }], [{
    key: "isVideoAvailableForThing",
    value: function isVideoAvailableForThing(thing) {
      var thingHasVideo = false;

      if (thing) {
        if (thing.video_cover) {
          thingHasVideo = true;
        } else if (thing.metadata) {
          if (thing.metadata.video_url) {
            thingHasVideo = true;
          }
        } else if (thing.sales) {
          if (thing.sales.video) {
            thingHasVideo = true;
          }
        }
      }

      return thingHasVideo;
    }
  }, {
    key: "isVideoAvailableForArticle",
    value: function isVideoAvailableForArticle(article) {
      if (article && article.cover_video && article.cover_video.status == "ready") {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Video;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

/***/ }),

/***/ "./_static/modules/libf/common-components/index.js":
/*!*********************************************************!*\
  !*** ./_static/modules/libf/common-components/index.js ***!
  \*********************************************************/
/*! namespace exports */
/*! export AddlistAction [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/AddlistAction.js .AddlistAction */
/*! export AddlistPopover [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/AddlistPopover.js .AddlistPopover */
/*! export FancydByPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/Popup.js .FancydByPopup */
/*! export FancydByPopupV4 [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/Popup.js .FancydByPopupV4 */
/*! export FancydPerson [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/Popup.js .FancydPerson */
/*! export MoreShare [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/MoreShare.js .MoreShare */
/*! export MoreShareFacade [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/MoreShareFacade.js .MoreShareFacade */
/*! export ShareObjectTypes [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/MoreShareUtils.js .ShareObjectTypes */
/*! export SharePopover [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/SharePopover.js .SharePopover */
/*! export Video [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/Video.js .Video */
/*! export applyProductSlide [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/ProductSlide.js .default */
/*! export getShareURL [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/MoreShareUtils.js .getShareURL */
/*! export history [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/libf/common-components/History.ts .history */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.d, __webpack_require__.r, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Video": () => /* reexport safe */ _Video__WEBPACK_IMPORTED_MODULE_0__.Video,
/* harmony export */   "MoreShare": () => /* reexport safe */ _MoreShare__WEBPACK_IMPORTED_MODULE_1__.MoreShare,
/* harmony export */   "MoreShareFacade": () => /* reexport safe */ _MoreShareFacade__WEBPACK_IMPORTED_MODULE_2__.MoreShareFacade,
/* harmony export */   "ShareObjectTypes": () => /* reexport safe */ _MoreShareUtils__WEBPACK_IMPORTED_MODULE_3__.ShareObjectTypes,
/* harmony export */   "getShareURL": () => /* reexport safe */ _MoreShareUtils__WEBPACK_IMPORTED_MODULE_3__.getShareURL,
/* harmony export */   "SharePopover": () => /* reexport safe */ _SharePopover__WEBPACK_IMPORTED_MODULE_4__.SharePopover,
/* harmony export */   "AddlistPopover": () => /* reexport safe */ _AddlistPopover__WEBPACK_IMPORTED_MODULE_5__.AddlistPopover,
/* harmony export */   "AddlistAction": () => /* reexport safe */ _AddlistAction__WEBPACK_IMPORTED_MODULE_6__.AddlistAction,
/* harmony export */   "FancydByPopup": () => /* reexport safe */ _Popup__WEBPACK_IMPORTED_MODULE_7__.FancydByPopup,
/* harmony export */   "FancydByPopupV4": () => /* reexport safe */ _Popup__WEBPACK_IMPORTED_MODULE_7__.FancydByPopupV4,
/* harmony export */   "FancydPerson": () => /* reexport safe */ _Popup__WEBPACK_IMPORTED_MODULE_7__.FancydPerson,
/* harmony export */   "history": () => /* reexport safe */ _History__WEBPACK_IMPORTED_MODULE_8__.history,
/* harmony export */   "applyProductSlide": () => /* reexport safe */ _ProductSlide__WEBPACK_IMPORTED_MODULE_9__.default
/* harmony export */ });
/* harmony import */ var _Video__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Video */ "./_static/modules/libf/common-components/Video.js");
/* harmony import */ var _MoreShare__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MoreShare */ "./_static/modules/libf/common-components/MoreShare.js");
/* harmony import */ var _MoreShareFacade__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MoreShareFacade */ "./_static/modules/libf/common-components/MoreShareFacade.js");
/* harmony import */ var _MoreShareUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MoreShareUtils */ "./_static/modules/libf/common-components/MoreShareUtils.js");
/* harmony import */ var _SharePopover__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SharePopover */ "./_static/modules/libf/common-components/SharePopover.js");
/* harmony import */ var _AddlistPopover__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AddlistPopover */ "./_static/modules/libf/common-components/AddlistPopover.js");
/* harmony import */ var _AddlistAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AddlistAction */ "./_static/modules/libf/common-components/AddlistAction.js");
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Popup */ "./_static/modules/libf/common-components/Popup.js");
/* harmony import */ var _History__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./History */ "./_static/modules/libf/common-components/History.ts");
/* harmony import */ var _ProductSlide__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ProductSlide */ "./_static/modules/libf/common-components/ProductSlide.js");











/***/ })

}]);
//# sourceMappingURL=libfancy.d9af77f7fca0bcbf243f.js.map