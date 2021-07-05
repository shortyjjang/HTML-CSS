/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./_static/modules/ui/overlay-article/Shortcode.js":
/*!*********************************************************!*\
  !*** ./_static/modules/ui/overlay-article/Shortcode.js ***!
  \*********************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
/***/ (() => {

/* BEWARE: this code is directly imported via mobile article.new.html, use ES5 */
var ImageModes = {
  Full: 'Full',
  Normal: 'Normal',
  Quoted: 'Quoted',
  Grid: 'Grid'
};

function getRandomId() {
  return 'shortcode-' + String(Math.random()).substr(2);
}

function getJumper($element) {
  var _id = getRandomId();

  $element.attr('id', _id);
  return function () {
    return $('#' + _id);
  };
}

function jQueryPromiseAll(arrayOfPromises) {
  return jQuery.when.apply(jQuery, arrayOfPromises).then(function () {
    return Array.prototype.slice.call(arguments, 0);
  });
}

function getProductContext(products, callback) {
  if (products.length > 0) {
    jQueryPromiseAll(products.filter(function (e) {
      return e;
    }).map(function (sid) {
      var dfd = $.Deferred();
      $.get('/rest-api/v1/things/' + sid + '?sales=true&include_every_image=true').then(function (thing) {
        dfd.resolve(thing);
      }).fail(function (xhr) {
        if (xhr.status === 404) {
          alertify.alert('Product id ' + sid + 'not found.');
        } else {
          console.warn('There was an error whiel fetching sid:', sid, xhr);
        }

        dfd.resolve(null);
      });
      return dfd.promise();
    })).done(function (things) {
      var ctx = {
        items: things.map(function (thing) {
          var image_fit_to_bounds = false;
          var image = thing.image.src;

          try {
            image_fit_to_bounds = thing.sales.images[0].fit_to_bounds;
            image = thing.sales.images[0].src;
          } catch (e) {}

          return thing.sales && {
            title: thing.sales.emojified_name,
            price: thing.sales.price,
            retail_price: thing.sales.retail_price,
            image: image,
            image_fit_to_bounds: image_fit_to_bounds,
            id: thing.sales.id
          };
        }).filter(function (e) {
          return e;
        })
      };
      callback(ctx);
    });
  } else {
    console.warn('[ShortCodeTransformers]: Error - product does not exist');
  }
}

function getTemplateByImageMode(imageMode) {
  switch (imageMode) {
    case ImageModes.Grid:
      return '<div class="grid"><img src="/_ui/images/common/blank.gif"  alt="<%= image.caption %>" class="" style="background-image:url(\'<%= image.src %>\');" data-src="<%= image.src %>"><% if (image.caption) { %><figcaption class="text-placeholder"><%= image.caption %></figcaption><% } %></div>';

    case ImageModes.Full:
      return '<figure class="mode-full"><img src="<%= image.src %>" alt="<%= image.caption %>"></figure>';

    case ImageModes.Quoted:
      return '<figure class="mode-quoted"><p><img src="<%= image.src %>" alt="<%= image.caption %>"></p><p class="textarea"><%= image.caption %></p></figure>';

    case ImageModes.Normal:
    default:
      return '<figure class="mode-normal"><img src="<%= image.src %>" alt="<%= image.caption %>"></figure>';
  }
}

var ShortCodeTransformers = {};
/* 
<% {"name": fancy-article-gallery,
    "images": [{ src: "https://img-address-1", caption: "An image caption", uiid: 1 }, ... ],
    "title": "a gallery title",
    "tagline": "a gallery tagline"} %>
*/

ShortCodeTransformers['fancy-article-gallery'] = function (options, $shortcode) {
  var images = options.images;
  var title = options.title;
  var tagline = options.tagline;
  var markup = '';
  markup += '<div class="gallery">';
  markup += '<h3><span><%= title %></span><small class="tagline"><span><%= tagline %></span></small></h3>';
  markup += '<ul class="photo-list">';
  markup += '<% _.each(images, function(image, idx) { %>';
  markup += '<li class="<%= idx === 0 ? \'active\' : \'\' %>"><a href="<%= image.link %>" <%= image.link ? "rel=\'noopener\' target=\'_blank\' class=\'linked\'" : "onclick=\'return false;\'" %>><img src="<%= image.src %>"></a><span><%= image.caption %></span></li>';
  markup += '<% }) %>';
  markup += '</ul>';
  markup += '<div class="paging">';

  if (window.isWhitelabelV2) {
    markup += '<div class="btn"><a class="prev"></a><a class="next"></a></div>';
  }

  markup += '<% _.each(images, function(e, idx) { %> ';
  markup += '<a href="#" class="<%= idx === 0 ? \'current\' : \'\' %> pager"><%= idx + 1 %></a>';
  markup += '<% }) %>';
  markup += '</div>';
  markup += '</div>';
  var $next = $(_.template(markup)({
    images: images,
    title: title,
    tagline: tagline
  }));

  if (window.isWhitelabelV2) {
    $next.find('img').wrap('<span class="figure" />');
    $next = $('<div class="gallery-container" />').append($next);
  }

  $shortcode.replaceWith($next.prop('outerHTML'));
};
/*
<% {"name": "fancy-article-img",
    "images": [{
        "mode": "Quoted",
        "src": "https://img-address",
        "caption": "A image caption",
    }]
   } %>
*/


ShortCodeTransformers['fancy-article-img'] = function (options, $shortcode) {
  var images = options.images;
  var html = images.reduce(function (prev, image) {
    return prev + _.template(getTemplateByImageMode(image.mode))({
      image: image
    });
  }, '');

  if (images[0] && images[0].mode === ImageModes.Grid) {
    html = '<figure class="mode-grid">' + html + '</figure>';
  }

  $shortcode.replaceWith(html);
};

ShortCodeTransformers['fancy-article-product'] = function (options, $shortcode) {
  var items = options.products;
  var getIsolatedShortcodeElement = getJumper($shortcode);
  getProductContext(items, function (ctx) {
    var markup = '';
    markup += '<ul class="itemList product">';
    markup += '<% items.forEach(function(item) { %>';
    markup += '<li class="itemListElement" data-id="<%= item.id %>">';
    markup += '<a href="<%= item.html_url %>?utm=article">';
    markup += '<span class="figure <% if (item.image_fit_to_bounds) { %>fit<% } %>">';
    markup += '<img src="/_ui/images/common/blank.gif" style="background-image:url(<%= item.image %>)">';
    markup += '</span>';
    markup += '<span class="figcaption">';
    markup += '<span class="title"><%= item.title %></span>';
    markup += '<% if (item.retail_price != null) { %><b class="price sales">$<%= item.price %> <small class="before">$<%= item.retail_price %></small></b><% } else { %><b class="price">$<%= item.price %></b><% } %>';
    markup += '</span>';
    markup += '</li>';
    markup += '<% }); %>';
    markup += '</ul>';

    var next = _.template(markup)(ctx);

    getIsolatedShortcodeElement().replaceWith(next);
  });
};

ShortCodeTransformers['fancy-article-product-slideshow'] = function (options, $shortcode) {
  var items = options.products;
  var getIsolatedShortcodeElement = getJumper($shortcode);
  getProductContext(items, function (ctx) {
    var markup = '';
    markup += '<div class="itemSlide product">';
    markup += '<div class="itemSlideWrap">';
    markup += '<ul class="stream after">';
    markup += '<% items.forEach(function(item) { %>';
    markup += '<li class="itemSlideElement">';
    markup += '<div class="figure-item">';
    markup += '<figure <% if (item.image_fit_to_bounds) { %>class="fit"<% } %>><a href="<% if (item.html_url) { %><%= item.html_url %><% } else { %>/sales/<%= item.id %>?utm=article<% } %>?utm=article">';
    markup += '<span class="back"></span>';
    markup += '<img class="figure" src="/_ui/images/common/blank.gif"';
    markup += 'style="background-image: url(<%= item.image %>);">';
    markup += '</a></figure>';
    markup += '<figcaption>';
    markup += '<span class="show_cart">';
    markup += '<button class="btn-cart nopopup soldout">';
    markup += '<% if (item.retail_price != null) { %><b class="price sales">$<%= item.price %> <small class="before">$<%= item.retail_price %></small></b><% } else { %><b class="price">$<%= item.price %></b><% } %>';
    markup += '</button>';
    markup += '</span>';
    markup += '<a href="<%= item.html_url %>?utm=article" class="title"><%= item.title %></a>';
    markup += '</figcaption>';
    markup += '</div>';
    markup += '</li>';
    markup += '<% }); %>';
    markup += '</ul>';
    markup += '</div>';
    markup += '<a href="#" class="prev">Prev</a>';
    markup += '<a href="#" class="next">Next</a>';
    markup += '</div>';

    var next = _.template(markup)(ctx);

    getIsolatedShortcodeElement().replaceWith(next);
  });
};

function getWrappedSingleNode(target) {
  return $('<div class="singlenode-wrapper">' + target + '</div>');
}

function convertShortcode(content) {
  var $wrapped = getWrappedSingleNode(content);
  var $disposable = mountToDisposable($wrapped);
  $wrapped.find('p.shortcode').each(function (i, shortcode) {
    var $sc = $(shortcode);

    try {
      var data = JSON.parse($sc.attr('data-internal'));
      ShortCodeTransformers[data.name](data, $sc);
    } catch (e) {
      console.warn(e);
    }
  });
  $disposable.remove();
  return $wrapped.html();
}

window.convertArticleShortcode = convertShortcode;

function mountToDisposable(unmountedDOM) {
  // Create/Select disposable mounting DIV to correctly modify a element.
  var $disposable = $(document.body).find('.disposable');

  if ($disposable.length > 0) {
    $disposable = $disposable.eq(0).empty();
  } else {
    $disposable = $('<div />', {
      id: 'disposable',
      style: 'display:none;'
    }).appendTo(document.body);
  }

  if (unmountedDOM) {
    // Append unmounted DOM if exists
    $disposable.append(unmountedDOM);
  } // return disposable DOM


  return $disposable;
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/SyncedContext.js":
/*!*************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/SyncedContext.js ***!
  \*************************************************************/
/*! namespace exports */
/*! export onArticleFancyButtonUpdate [provided] [no usage info] [missing usage info prevents renaming] */
/*! export onFancyButtonUpdate [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onFancyButtonUpdate": () => /* binding */ onFancyButtonUpdate,
/* harmony export */   "onArticleFancyButtonUpdate": () => /* binding */ onArticleFancyButtonUpdate
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");

// This module deals with outside of React context (mostly raw DOM) with observing DOM structure and 
// do sub'd actions when React-context actions fires.

/*
if (process.env.NODE_ENV !== 'production') {
    window.__assert = true;
}

function assert(a,b) {
    if (window.__assert) console.assert(a,b)
}
*/

function findFancyButton(id)
/*:jQuery?*/
{
  if (typeof id === 'string') {
    var domCache = thingsDomCache[id];

    if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(domCache) === 'object') {
      return $(domCache);
    } else if (domCache === false) {// NOOP
    } else {
      var $query = $("#container-wrapper a[href^=\"/things/".concat(id, "\"]:visible"));

      if ($query.length > 0) {
        var containers = (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.dedupeArray)($query.map(function (i, e) {
          return $(e).closest('div.figure-item').get(0);
        }).toArray());

        if (containers && containers.length > 0) {
          var $btn = $(containers[0]).find('button.fancy, button.fancyd, a.fancyd, a.fancy');

          if ($btn.length > 0) {
            thingsDomCache[id] = $btn[0];
            return $btn;
          }
        }
      } // If not returned


      thingsDomCache[id] = false;
    }
  }
}

function findArticleFancyButton(id)
/*:jQuery?*/
{
  if (typeof id === 'string') {
    var domCache = thingsDomCache[id];

    if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(domCache) === 'object') {
      return $(domCache);
    } else if (domCache === false) {// NOOP
    } else {
      var $query = $("#container-wrapper a[href^=\"/articles/".concat(id, "\"]:visible"));

      if ($query.length > 0) {
        var containers = (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.dedupeArray)($query.map(function (i, e) {
          return $(e).closest('div.article_item').get(0);
        }).toArray());

        if (containers && containers.length > 0) {
          var $btn = $(containers[0]).find('button.fancy, button.fancyd, a.fancyd, a.fancy');

          if ($btn.length > 0) {
            thingsDomCache[id] = $btn[0];
            return $btn;
          }
        }
      } // If not returned


      thingsDomCache[id] = false;
    }
  }
} // via thing id 


var thingsDomCache = {};

function toggleFancyButton($btn, fancyd) {
  $btn.removeClass('fancy').removeClass('fancyd');
  $btn.addClass(fancyd ? 'fancyd' : 'fancy');
}

function replaceFancyCount($btn, fancyd, fc) {
  // Fancy | Fancy'd
  if ($btn.text().toLowerCase().indexOf('fancy') >= 0) {
    $btn.html("<span><i></i></span> ".concat(fancyd ? 'Fancy\'d' : 'Fancy')); // Fancy count
  } else {
    $btn.html("<span><i></i></span> ".concat(fc));
  }
}

function onFancyButtonUpdate(id
/*:string*/
, fancyd
/*:boolean*/
, fc
/*:string*/
) {
  var $btn = findFancyButton(id);

  if ($btn && $btn.length > 0) {
    toggleFancyButton($btn, fancyd);
    replaceFancyCount($btn, fancyd, fc);
  }
}
function onArticleFancyButtonUpdate(id
/*:string*/
, fancyd
/*:boolean*/
, fc
/*:string*/
) {
  var $btn = findArticleFancyButton(id);

  if ($btn && $btn.length > 0) {
    toggleFancyButton($btn, fancyd);
    replaceFancyCount($btn, fancyd, fc);
  }
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/action/action-constants.js":
/*!***********************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/action/action-constants.js ***!
  \***********************************************************************/
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
'REQUEST_ARTICLE', 'REQUEST_ARTICLE_FAILURE', 'LOAD_ARTICLE', // UI Actions
'OPEN_ARTICLE', 'CLOSE_ARTICLE');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (C);

/***/ }),

/***/ "./_static/modules/ui/overlay-article/action/action-helpers.js":
/*!*********************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/action/action-helpers.js ***!
  \*********************************************************************/
/*! namespace exports */
/*! export closeOverlay [provided] [no usage info] [missing usage info prevents renaming] */
/*! export fetchArticle [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeOverlay": () => /* binding */ closeOverlay,
/* harmony export */   "fetchArticle": () => /* binding */ fetchArticle
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _container_history__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../container/history */ "./_static/modules/ui/overlay-article/container/history.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/store */ "./_static/modules/ui/overlay-article/store/store.js");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../container/routeutils */ "./_static/modules/ui/overlay-article/container/routeutils.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions */ "./_static/modules/ui/overlay-article/action/actions.js");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cache */ "./_static/modules/ui/overlay-article/cache.js");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");








function shouldOpenArticle(state) {
  return state.appContext.visible !== true;
} // Blocks illegal requests


function shouldFetchArticle(state, articleID) {
  if (state.article.ID === articleID || state.article.isFetching) {
    return false;
  } else {
    return true;
  }
}

function closeOverlay() {
  return function (dispatch) {
    if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isStaticPage)()) {
      return;
    }

    (0,_container_routeutils__WEBPACK_IMPORTED_MODULE_3__.closeModal)();
    _container_history__WEBPACK_IMPORTED_MODULE_1__.historyData.overlayIsOn = false;
    common_components__WEBPACK_IMPORTED_MODULE_6__.history.push((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.stripPathname)(_container_history__WEBPACK_IMPORTED_MODULE_1__.historyData.preservedHref), null);
    document.title = _container_history__WEBPACK_IMPORTED_MODULE_1__.historyData.initialTitle;
    dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_4__.closeArticle)());
    $(document).off('keydown.overlayArticle');
    $(window).trigger('scroll');
  };
}
function fetchArticle(articleID) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _cache__WEBPACK_IMPORTED_MODULE_5__.ArticleCache.ARTICLES;
  var killCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var queryString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  return function (dispatch, getState) {
    if (articleID == null) {
      console.warn('fetchArticle(): articleID was null.');
      return;
    }

    var state = getState();

    if (shouldOpenArticle(state)) {
      dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_4__.openArticle)());
    }

    if (killCache) {
      _cache__WEBPACK_IMPORTED_MODULE_5__.cache.remove(articleID, type);
      delete state.article;
    }

    if (killCache || shouldFetchArticle(state, articleID)) {
      if (_cache__WEBPACK_IMPORTED_MODULE_5__.cache.exists(articleID, type)) {
        var cac = _cache__WEBPACK_IMPORTED_MODULE_5__.cache.get(articleID, type);
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_4__.loadArticle)(articleID, cac));
        onLoadArticle(cac); // if cache is crawled one, request should continue

        if (!cac.isCrawled) {
          return;
        }
      }

      dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_4__.requestArticle)(articleID));
      var options = {
        saved_users_top: 10,
        raw_content: 'true',
        include_viewer: 'true'
      };

      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getLocationArgPairs)('preview')) {
        options.preview = true;
      }

      $.get("/rest-api/v1/articles/".concat(articleID).concat(queryString), options).then(function (article) {
        _cache__WEBPACK_IMPORTED_MODULE_5__.cache.add(articleID, article, type);
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_4__.loadArticle)(articleID, article));
        onLoadArticle(article);
      }).fail(function (failureXHR) {
        // FIXME: This error handling only happens when there's server-side error -
        //        can't handle client-side ones
        dispatch((0,_actions__WEBPACK_IMPORTED_MODULE_4__.requestArticleFail)(articleID));

        if (failureXHR.status === 404) {
          alertify.alert("This page is not available. Please try again later."); // } else if (failureXHR.status >= 500) {
        } else {
          alertify.alert("There was an error while opening the page.<br> Please try again or contact <a mailto=\"cs@fancy.com\">cs@fancy.com</a>.");
        }

        if (_container_history__WEBPACK_IMPORTED_MODULE_1__.historyData.initialPageIsArticlePage) {
          location.href = '/';
        } else {
          dispatch(closeOverlay());
        }
      });
    }
  };
} // TODO: make unified eventemitter interface after all

function onLoadArticle(article) {
  var MPArgs = {
    article_id: article.id
  };
  var currentLocationArgPair = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getLocationArgPairs)('utm');

  if (currentLocationArgPair) {
    MPArgs.utm = currentLocationArgPair[1];
  }

  (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.MP)('View Article Detail', MPArgs);
}

window.___D = function () {
  return _store_store__WEBPACK_IMPORTED_MODULE_2__.default.getState();
};

/***/ }),

/***/ "./_static/modules/ui/overlay-article/action/actions.js":
/*!**************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/action/actions.js ***!
  \**************************************************************/
/*! namespace exports */
/*! export closeArticle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export loadArticle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export openArticle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export requestArticle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export requestArticleFail [provided] [no usage info] [missing usage info prevents renaming] */
/*! export updateAppContext [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "requestArticle": () => /* binding */ requestArticle,
/* harmony export */   "requestArticleFail": () => /* binding */ requestArticleFail,
/* harmony export */   "loadArticle": () => /* binding */ loadArticle,
/* harmony export */   "openArticle": () => /* binding */ openArticle,
/* harmony export */   "closeArticle": () => /* binding */ closeArticle,
/* harmony export */   "updateAppContext": () => /* binding */ updateAppContext
/* harmony export */ });
/* harmony import */ var _action_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action-constants */ "./_static/modules/ui/overlay-article/action/action-constants.js");
 // Action on requesting article starts

function requestArticle(pendingID) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.REQUEST_ARTICLE,
    status: 'request',
    pendingID: pendingID
  };
} // Action on requesting article fails

function requestArticleFail()
/*lastRequestFailedArticleID*/
{
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.REQUEST_ARTICLE_FAILURE,
    status: 'failed'
  };
} // action on loading request result

function loadArticle(ID, data) {
  // FIXME: should we do this here?
  var title = data.name;

  if (title) {
    document.title = "Fancy | ".concat(title);
  }

  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.LOAD_ARTICLE,
    status: 'idle',
    ID: ID,
    data: data
  };
} // Action on close overlay

function openArticle() {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.OPEN_ARTICLE
  };
} // Action on close overlay

function closeArticle() {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.CLOSE_ARTICLE,
    ID: null,
    pendingID: null,
    article: null
  };
}
function updateAppContext(contextObject) {
  return {
    type: _action_constants__WEBPACK_IMPORTED_MODULE_0__.default.UPDATE_APP_CONTEXT,
    context: contextObject
  };
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/appstate.js":
/*!********************************************************!*\
  !*** ./_static/modules/ui/overlay-article/appstate.js ***!
  \********************************************************/
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
// import assign from 'object-assign';
// module-level login state object and setter
var state = {
  viewer: {}
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (state);
/*
export function statify(config) {
    assign(state, config);
    state.loginNeededAttr = config.loggedIn ? {} : {'data-require_login': "true"};
}
*/

function updateState(k, v) {
  state[k] = v;
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/cache.js":
/*!*****************************************************!*\
  !*** ./_static/modules/ui/overlay-article/cache.js ***!
  \*****************************************************/
/*! namespace exports */
/*! export ArticleCache [provided] [no usage info] [missing usage info prevents renaming] */
/*! export cache [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArticleCache": () => /* binding */ ArticleCache,
/* harmony export */   "cache": () => /* binding */ cache
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");




 // Cache bucket

var ArticleCache = /*#__PURE__*/function () {
  function ArticleCache() {
    var _this = this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, ArticleCache);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "articles", {});

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "count", 0);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "exists", function (id, type, ignoreCralwed) {
      var cac = _this.get(id, type);

      var existence = cac != null && _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(cac) === 'object';

      if (ignoreCralwed) {
        existence = existence && cac.isCrawled !== true;
      }

      return existence;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "_get", function (id) {
      return _this[ArticleCache.ARTICLES][id] || null;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "get", function (id) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ArticleCache.ARTICLES;

      var cac = _this[type][id] || _this.getCrawled(id, type);

      return cac;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "getCrawled", function (id, type) {
      var cac = _this[type][id];

      if (cac && cac.isCrawled) {
        return cac;
      } else {
        return null;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "add", function (id, data, type) {
      // to add, cache should not be exist or crawled one
      var cac = _this[type][id];

      if (cac == null || cac.isCrawled === true) {
        _this[type][id] = data;
        _this.count += 1;
      } else {
        console.warn('cache.add(): Cache overwrite');
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "remove", function (id, type) {
      if (_this[type][id]) {
        delete _this[type][id];
        _this.count -= 1;
      } else {
        console.warn('cache.remove(): Non-existing cache removal');
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "update", function (id) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ArticleCache.ARTICLES;
      var selector = arguments.length > 2 ? arguments[2] : undefined;
      var value = arguments.length > 3 ? arguments[3] : undefined;

      if (selector == null) {
        console.warn('ArticleCache#update(): selector is empty');
        return;
      }

      var t = _this.get(id, type);

      if (t) {
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_4__.index)(t, selector, value);
      }
    });
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(ArticleCache, [{
    key: "sweep",
    value: function sweep() {// TODO: should sweep cache if too many cache added by looking `cache.count`
    }
  }]);

  return ArticleCache;
}();

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(ArticleCache, "ARTICLES", 'articles');

var cache = new ArticleCache();

/***/ }),

/***/ "./_static/modules/ui/overlay-article/components/ArticleCard.js":
/*!**********************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/components/ArticleCard.js ***!
  \**********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ArticleCard
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
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../container/routeutils */ "./_static/modules/ui/overlay-article/container/routeutils.js");











var ArticleCard = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(ArticleCard, _Component);

  function ArticleCard(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ArticleCard);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ArticleCard).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleLinkClick", function (event) {
      event.stopPropagation();

      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_8__.isPlainLeftClick)(event)) {
        event.preventDefault();
        var html_url = _this.props.html_url;
        (0,_container_routeutils__WEBPACK_IMPORTED_MODULE_9__.transition)(html_url, _container_routeutils__WEBPACK_IMPORTED_MODULE_9__.LinkTypes.Timeline);
      }
    });

    _this.state = {};
    _this.handleLinkClick = _.throttle(_this.handleLinkClick, 500);
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ArticleCard, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          cover_image = _this$props.cover_image,
          title = _this$props.title,
          url = _this$props.url,
          tagline = _this$props.tagline;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "article_item detail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: url
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "cover"
      }, cover_image && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
        src: "/_ui/images/common/blank.gif",
        style: {
          backgroundImage: "url(".concat(cover_image.url, ")")
        }
      }), !cover_image && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
        src: "/_ui/images/common/blank.gif"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "title"
      }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "description"
      }, tagline)));
    }
  }]);

  return ArticleCard;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);



/***/ }),

/***/ "./_static/modules/ui/overlay-article/components/ArticleFancydUsers.js":
/*!*****************************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/components/ArticleFancydUsers.js ***!
  \*****************************************************************************/
/*! namespace exports */
/*! export FancydUsers [provided] [no usage info] [missing usage info prevents renaming] */
/*! export handleProfileMouseOver [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "handleProfileMouseOver": () => /* binding */ handleProfileMouseOver,
/* harmony export */   "FancydUsers": () => /* binding */ FancydUsers
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../config */ "./_static/modules/ui/overlay-article/config.js");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../cache */ "./_static/modules/ui/overlay-article/cache.js");
/* harmony import */ var _SyncedContext__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../SyncedContext */ "./_static/modules/ui/overlay-article/SyncedContext.js");














function handleProfileMouseOver(event) {
  var $profile = $(event.currentTarget).find('em');
  $profile.css('margin-left', "".concat(-($profile.width() / 2) - 10, "px"));
}

var FancydUser = function FancydUser(_ref) {
  var _ref$user = _ref.user,
      user = _ref$user === void 0 ? {} : _ref$user,
      display = _ref.display,
      isViewer = _ref.isViewer;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
    href: user.html_url,
    className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("user", {
      _viewer: isViewer
    }),
    onMouseOver: handleProfileMouseOver,
    style: display
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
    src: "/_ui/images/common/blank.gif",
    style: {
      backgroundImage: "url(".concat(user.image_url || user.profile_image_url, ")")
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, user.fullname || user.full_name));
};

var bgXPosSequence = [0, -54, -108, -163, -218, -272, -327, -436, -490, -545, -599, -654, -708, -763, -817, -872, -926, -981, -1035, -1144, -1199, -1253, -1308, -1417, -1471];

function isUserEqual(a, b) {
  if (a == null || b == null) {
    return false;
  }

  return a.id === b.id;
}

function _handleFancydStateOnLoadArticle(slug, _ref2) {
  var fancyd = _ref2.fancyd,
      save_count = _ref2.save_count;
  var stateSetter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (_) {
    return _;
  };
  (0,_SyncedContext__WEBPACK_IMPORTED_MODULE_13__.onArticleFancyButtonUpdate)(slug, fancyd, (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.getConciseNumberString)(save_count));
  stateSetter({
    fancyd: fancyd,
    save_count: save_count,
    loading: false,
    fancyStatus: _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle
  });
}

function getFancyStatus(nextFancydState) {
  return nextFancydState ? _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition : _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal;
}

function getCompletionIdleStatus(currentFancyState) {
  var prevFancyState = !currentFancyState;
  return prevFancyState ? _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterRemoval : _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterAddition;
}

function getNextFancydCount(nextFancyd, currentFancydCount) {
  if (nextFancyd === true) {
    return currentFancydCount + 1;
  } else {
    return currentFancydCount - 1;
  }
}

function toggleFancy(article, currentState) {
  var stateSetter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (_) {
    return _;
  };
  var fancyd = currentState.fancyd,
      save_count = currentState.save_count,
      loading = currentState.loading;
  var nextFancyd = !fancyd;
  var nextFancydCount = getNextFancydCount(nextFancyd, save_count);

  if (!loading) {
    stateSetter({
      fancyd: nextFancyd,
      loading: true,
      fancyStatus: getFancyStatus(nextFancyd)
    });
    $.ajax({
      type: 'POST',
      url: '/articles/save.json',
      data: {
        article_id: article.id,
        action: nextFancyd ? 'save' : 'unsave'
      }
    }).done(function (json) {
      if (json.article_id && json.saved === !fancyd) {
        // Completing fancy
        _cache__WEBPACK_IMPORTED_MODULE_12__.cache.update(article.slug, undefined, 'saved', nextFancyd);
        _cache__WEBPACK_IMPORTED_MODULE_12__.cache.update(article.slug, undefined, 'save_count', nextFancydCount);
        (0,_SyncedContext__WEBPACK_IMPORTED_MODULE_13__.onArticleFancyButtonUpdate)(article.slug, nextFancyd, (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.getConciseNumberString)(nextFancydCount));
        stateSetter({
          loading: false,
          fancyd: nextFancyd,
          save_count: nextFancydCount,
          fancyStatus: getCompletionIdleStatus(nextFancyd)
        });
      } else {
        // cancelling fancy
        stateSetter({
          loading: false,
          fancyd: fancyd,
          save_count: save_count,
          fancyStatus: getFancyStatus(fancyd)
        });
      }
    }).fail(function () {
      // cancelling fancy
      stateSetter({
        loading: false,
        fancyd: fancyd,
        save_count: save_count,
        fancyStatus: getFancyStatus(fancyd)
      });
    });
  }
}

var FancydUsers = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(FancydUsers, _Component);

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(FancydUsers, [{
    key: "_getInitialState",
    value: function _getInitialState() {
      return {
        fancyAnimation: false,
        // button state
        fancyd: null,
        loading: false,
        save_count: null,
        fancyStatus: _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle // fancyStatus = 'Idle', { Idle | Addition | Removal | After- } - Fancy'd status for animation control

      };
    }
  }]);

  function FancydUsers(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, FancydUsers);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2___default()(FancydUsers).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "getFancydCountString", function () {
      var save_count = _this.state.save_count;
      return save_count != null ? (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.getConciseNumberString)(save_count, 0) : '0';
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "animateFancyBG", function (frame) {
      if (frame === undefined) {
        _this.animateFancyBG(0);
      } else if (frame < bgXPosSequence.length) {
        // Special branching due to misposition in background
        var xPos = bgXPosSequence[frame];
        $(_this.fancyBGAnimation).css('background-position-x', "".concat(xPos, "px"));
        setTimeout(function () {
          _this.animateFancyBG(frame + 1);
        }, 10);
      } else if (frame >= bgXPosSequence.length) {
        _this.setState({
          fancyAnimation: false
        });
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "getFancyduserDisplay", function (user, index, totalLength) {
      var viewer = _this.props.appContext.viewer;
      var _this$state = _this.state,
          fancyd = _this$state.fancyd,
          fancyStatus = _this$state.fancyStatus;
      var first = index === 0;
      var last = index === totalLength - 1;
      var display;

      if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterAddition || fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition) {
        // designer satisfaction 1)
        if (totalLength <= 8) {
          display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.Inline;
        } else {
          if (first) {
            display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.Inline;
          }
        }
      } else if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterRemoval || fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal) {
        if (first) {
          display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None;
        } else if (last) {
          display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.Inline;
        }
      } // designer satisfaction 2) https://app.asana.com/0/86925821949642/161445424426526


      var indexLimit = 8;

      if ((fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterAddition || fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition || fancyd && fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle) && index > indexLimit) {
        display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None;
      } else if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal && index >= indexLimit) {
        display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None;
      }

      if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle && !fancyd && isUserEqual(user, viewer)) {
        display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None;
      }

      return display;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "toggleFancy", function () {
      toggleFancy(_this.props.article, _this.state, function (ns) {
        _this.setState(ns);
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleFancydStateOnLoadArticle", function (article) {
      if (article == null) {
        article = _this.props.article;
      }

      _handleFancydStateOnLoadArticle(article.slug, {
        fancyd: article.saved,
        save_count: article.save_count
      }, function (ns) {
        _this.setState(ns);
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleFancyClick", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var article = _this.props.article;

      if (!_this.props.appContext.loggedIn) {
        window.require_login && window.require_login(null, 'fancy_article', article.id);
        return;
      }

      var _this$state2 = _this.state,
          fancyAnimation = _this$state2.fancyAnimation,
          fancyd = _this$state2.fancyd,
          loading = _this$state2.loading;

      if (loading) {
        return;
      }

      if (!fancyd && !fancyAnimation) {
        _this.setState({
          fancyAnimation: true
        }, function (_) {
          _this.animateFancyBG();
        });
      }

      if (!fancyd) {
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)('Fancy', {
          article_id: article.id
        });
      } else {
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)('Unfancy', {
          article_id: article.id
        });
      }

      _this.toggleFancy();
    });

    _this.state = _this._getInitialState();

    _this.fancyBGAnimationRef = function (element) {
      _this.fancyBGAnimation = element;
    };

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(FancydUsers, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleFancydStateOnLoadArticle();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var article = prevProps.article;
      var np = this.props; // Thing has been updated.

      if (article.id !== np.article.id || article.isCrawled !== np.article.isCrawled) {
        this.handleFancydStateOnLoadArticle(article);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$appContex = _this$props.appContext,
          loggedIn = _this$props$appContex.loggedIn,
          viewer = _this$props$appContex.viewer,
          _this$props$article = _this$props.article,
          saved_users = _this$props$article.saved_users,
          user = _this$props$article.user;
      var _this$state3 = this.state,
          fancyd = _this$state3.fancyd,
          fancyAnimation = _this$state3.fancyAnimation,
          fancyStatus = _this$state3.fancyStatus;
      var fancydUsers = [loggedIn && viewer, loggedIn && !isUserEqual(viewer, user) && user].concat(saved_users && saved_users.filter(function (fancydUser) {
        return !isUserEqual(fancydUser, user) && !isUserEqual(fancydUser, viewer);
      })).filter(function (e) {
        return e;
      });
      var fancydUserAnimClass;

      if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition) {
        fancydUserAnimClass = "add";
      } else if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal) {
        fancydUserAnimClass = "remove";
      } // designer satisfaction 1)
      // If user is less than 2 we need to apply special class.
      // In this way dont owner profile dont get 'consumed': https://app.asana.com/0/86925821949642/173945332708784


      var userCountSufficiency = fancydUsers.length <= 2 ? '_insuff' : '_suff';
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "like"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "count"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleFancyClick,
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("button button-static fancy _count", {
          fancyd: fancyd,
          loading: fancyAnimation
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        ref: this.fancyBGAnimationRef
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", null)), this.getFancydCountString()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "_fancyd"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("fancyd_user", fancydUserAnimClass, userCountSufficiency)
      }, fancydUsers.map(function (user, index) {
        var isViewer = isUserEqual(user, viewer);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(FancydUser, {
          key: index,
          user: user,
          display: _this2.getFancyduserDisplay(user, index, fancydUsers.length),
          isViewer: isViewer
        });
      })));
    }
  }]);

  return FancydUsers;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

/***/ }),

/***/ "./_static/modules/ui/overlay-article/components/ArticleWidgets.js":
/*!*************************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/components/ArticleWidgets.js ***!
  \*************************************************************************/
/*! namespace exports */
/*! export AdminHeader [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ArticleList [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MaybePaginationWindow [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ThingList [provided] [no usage info] [missing usage info prevents renaming] */
/*! export initGallery [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, module.loaded, module.id, module, __webpack_require__.hmd, __webpack_require__.r, __webpack_exports__, __webpack_require__.amdO, __webpack_require__.d, __webpack_require__.* */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThingList": () => /* binding */ ThingList,
/* harmony export */   "MaybePaginationWindow": () => /* binding */ MaybePaginationWindow,
/* harmony export */   "ArticleList": () => /* binding */ ArticleList,
/* harmony export */   "AdminHeader": () => /* binding */ AdminHeader,
/* harmony export */   "initGallery": () => /* binding */ initGallery
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_1__);
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
/* harmony import */ var _ThingCard__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ThingCard */ "./_static/modules/ui/overlay-article/components/ThingCard.js");
/* harmony import */ var _ArticleCard__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ArticleCard */ "./_static/modules/ui/overlay-article/components/ArticleCard.js");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../cache */ "./_static/modules/ui/overlay-article/cache.js");
/* module decorator */ module = __webpack_require__.hmd(module);














var ThingList = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default()(ThingList, _Component);

  function ThingList() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, ThingList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(ThingList)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this), "lastarticleID", null);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this), "state", {
      showShare: false,
      things: []
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this), "logExposed", function (things) {
      if (typeof window.LogExposed == "undefined") return;
      things.forEach(function (thing) {
        window.LogExposed.addLog(thing.id + "", "article");
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this), "updateThingList", function (articleID) {
      if (articleID == null) {
        return;
      }

      $.ajax({
        type: "get",
        url: "/rest-api/v1/articles/".concat(articleID, "/items")
      }).done(function (response) {
        if (!_this.unmounted) {
          var things = (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.convertThingsV1ToRest)(response.article_items).map(function (t) {
            if (window.isWhitelabel && t.sales) {
              var url = "".concat(t.html_url);
              t.url = url;
              t.html_url = url;
            }

            return t;
          });

          _this.logExposed(things);

          _this.setState({
            things: things
          });
        }
      }).fail(function (xhr) {
        console.warn("updateThingList():", xhr);
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(ThingList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Initial loading
      this.updateThingList(this.props.article.id, true);
      var things = (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.convertThingsV1ToRest)(this.props.article.things);
      this.setState({
        things: things
      });
      this.lastarticleID = this.props.article.id;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var nextProps = this.props; // Article has changed, reset things.

      if (this.lastarticleID !== nextProps.article.id) {
        var idCopy = nextProps.article.id;
        this.lastarticleID = idCopy;
        this.updateThingList(nextProps.article.id, true);
        var things = (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.convertThingsV1ToRest)(nextProps.article.things);
        this.setState({
          things: things
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          article = _this$props.article,
          appContext = _this$props.appContext,
          loggedIn = _this$props.appContext.loggedIn,
          hasPagination = _this$props.hasPagination;
      var things = this.state.things;
      var thingsHeader = article.options && article.options.item_header || null;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
        id: "content",
        className: "content ".concat(things.length === 0 ? "_empty" : "")
      }, thingsHeader && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("h3", null, thingsHeader), things.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(MaybePaginationWindow, {
        hasPagination: hasPagination,
        length: things.length
      }, things && things.map(function (thing, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(_ThingCard__WEBPACK_IMPORTED_MODULE_11__.default, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_1___default()({
          itemIdx: idx,
          itemType: "article",
          loggedIn: loggedIn,
          key: "timeline-recently-".concat(idx),
          onDelete: _this2.handleDelete,
          viewer: _this2.props.appContext.viewer,
          appContext: appContext,
          showDelete: false
        }, thing));
      })) : null);
    }
  }]);

  return ThingList;
}(react__WEBPACK_IMPORTED_MODULE_9__.Component);
var MaybePaginationWindow = /*#__PURE__*/function (_Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default()(MaybePaginationWindow, _Component2);

  function MaybePaginationWindow() {
    var _getPrototypeOf3;

    var _this3;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, MaybePaginationWindow);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this3 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, (_getPrototypeOf3 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(MaybePaginationWindow)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this3), "state", {
      page: 0
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this3), "handlePrevClick", function (e) {
      e.preventDefault();
      var minPage = 0;

      _this3.setState({
        page: Math.max(_this3.state.page - 1, minPage)
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this3), "handleNextClick", function (e) {
      e.preventDefault();
      var maxPage = Math.floor(_this3.props.length / 4) - 1;

      _this3.setState({
        page: Math.min(_this3.state.page + 1, maxPage)
      });
    });

    return _this3;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(MaybePaginationWindow, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          hasPagination = _this$props2.hasPagination,
          children = _this$props2.children;
      var style = {};

      if (hasPagination) {
        style.transform = "translateX(".concat(-101 * this.state.page, "%)");
      }

      var stream = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("ol", {
        className: "stream after",
        style: style
      }, children);

      if (hasPagination) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
          className: "itemSlide"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
          className: "itemSlideWrap"
        }, stream), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
          href: "#",
          className: "prev",
          onClick: this.handlePrevClick
        }, "Prev"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
          href: "#",
          className: "next",
          onClick: this.handleNextClick
        }, "Next"));
      } else {
        return stream;
      }
    }
  }]);

  return MaybePaginationWindow;
}(react__WEBPACK_IMPORTED_MODULE_9__.Component);
var ArticleList = /*#__PURE__*/function (_Component3) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default()(ArticleList, _Component3);

  function ArticleList() {
    var _getPrototypeOf4;

    var _this4;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, ArticleList);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this4 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, (_getPrototypeOf4 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(ArticleList)).call.apply(_getPrototypeOf4, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this4), "lastarticleID", null);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this4), "state", {
      articles: [],
      page: 1
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this4), "updateArticleList", function (articleID) {
      if (articleID == null) {
        return;
      }

      $.ajax({
        type: "get",
        url: window.isWhitelabel ? "/rest-api/v1/articles?limit=4&concise=true" : "/rest-api/v1/articles?featured"
      }).done(function (response) {
        if (!_this4.unmounted) {
          var articles = response.articles.filter(function (article) {
            return article.id !== articleID;
          });

          _this4.setState({
            articles: articles
          });
        }
      }).fail(function (xhr) {
        console.warn("updateArticleList():", xhr);
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this4), "handlePrevClick", function (event) {
      event.preventDefault();
      var $this = $(event.target);
      if ($this.hasClass("disabled")) return;

      _this4.setState({
        page: _this4.state.page - 1
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this4), "handleNextClick", function (event) {
      event.preventDefault();
      var $this = $(event.target);
      if ($this.hasClass("disabled")) return;

      _this4.setState({
        page: _this4.state.page + 1
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this4), "getLeftOffset", function () {
      var _this4$state = _this4.state,
          articles = _this4$state.articles,
          page = _this4$state.page;
      var left = (page - 1) * -860 - (page > 1 ? 4 : 0);
      var lastPageNum = (articles.length / 4 | 0) + (articles.length % 4 > 0 ? 1 : 0);

      if (articles.length > 4 && page >= lastPageNum) {
        var CardWidth = 205;
        var CardMargin = 10;
        var CardContainerWidth = 970;
        var CardContainerPadding = 14;
        var max = (articles.length - 1) * CardMargin + articles.length * CardWidth - CardContainerWidth + CardContainerPadding * 2;
        return "".concat(Math.max(left, -max), "px");
      } else {
        return left;
      }
    });

    return _this4;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(ArticleList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Initial loading
      this.updateArticleList(this.props.article.id);
      this.lastarticleID = this.props.article.id;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var nextProps = this.props; // Article has changed, reset articles.

      if (this.lastarticleID !== nextProps.article.id) {
        var idCopy = nextProps.article.id;
        this.lastarticleID = idCopy;
        this.updateArticleList(nextProps.article.id, true);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
    }
  }, {
    key: "render",
    value: function render() {
      var appContext = this.props.appContext;
      var _this$state = this.state,
          articles = _this$state.articles,
          page = _this$state.page;
      var maxPage = Math.ceil(articles.length / 4);
      var prevDisabled = page == 1;
      var nextDisabled = page == maxPage;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
        id: "sidebar"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
        className: "wrapper recommend-article"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("h3", {
        className: "stit"
      }, "MORE ARTICLES"), articles.length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
        className: "article_wrap",
        style: {
          left: this.getLeftOffset()
        }
      }, articles && articles.map(function (article, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement(_ArticleCard__WEBPACK_IMPORTED_MODULE_12__.default, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_1___default()({
          key: article.id,
          itemIdx: idx,
          appContext: appContext
        }, article));
      })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", null), articles.length > 4 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
        className: "paging"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
        href: "#",
        className: "".concat(prevDisabled ? "disabled" : "", " prev"),
        onClick: this.handlePrevClick
      }, "Prev"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
        href: "#",
        className: "".concat(nextDisabled ? "disabled" : "", " next"),
        onClick: this.handleNextClick
      }, "Next"))));
    }
  }]);

  return ArticleList;
}(react__WEBPACK_IMPORTED_MODULE_9__.Component);
var AdminHeader = /*#__PURE__*/function (_Component4) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default()(AdminHeader, _Component4);

  function AdminHeader(props) {
    var _this5;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, AdminHeader);

    _this5 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(AdminHeader).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this5), "handleLiveClick", function (event) {
      event.preventDefault();

      var self = _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this5);

      var $this = $(event.target);
      var article = _this5.props.article;
      var message = "Are you sure you want to set ".concat(article.title, " live on ").concat(window.isWhitelabel ? "Gear" : "Fancy", "?");
      if ($this.hasClass("on")) message = "Are you sure you want to hide ".concat(article.title, " from ").concat(window.isWhitelabel ? "Gear" : "Fancy", "?");
      var original_labels = window.alertify.labels;
      window.alertify.set({
        labels: {
          ok: $this.hasClass("on") ? "Hide" : "Set Live",
          cancel: "Cancel"
        }
      });
      window.alertify.confirm(message, function (yes) {
        if (yes) {
          var is_active = !$this.hasClass("on");
          $.post("/_admin/articles/update_active.json", {
            article_id: article.id,
            is_active: is_active
          }, function (json) {
            if (json.error) {
              window.alertify.alert(json.error);
            } else {
              window.alertify.alert(is_active ? "Activated" : "Deactivated");
              self.setState({
                is_active: is_active
              });
              _cache__WEBPACK_IMPORTED_MODULE_13__.cache.update(self.props.article.slug, undefined, "is_active", is_active);
            }
          });
        }
      });
      window.alertify.set({
        labels: original_labels
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6___default()(_this5), "handleEditArticleClick", function (e) {
      e.preventDefault();
      var article = _this5.props.article;
      window.open("/_admin/articles/edit?id=".concat(article.id));
    });

    _this5.state = {
      is_active: props.article.is_active
    };
    return _this5;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(AdminHeader, [{
    key: "render",
    value: function render() {
      var is_active = this.state.is_active;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
        className: "admin-header"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("div", {
        className: "inner"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("h2", null, "Admin Panel"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("a", {
        onClick: this.handleEditArticleClick
      }, "Edit Article"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("label", null, "Live"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9__.createElement("button", {
        className: "".concat(is_active ? "on" : "", " btn-switch"),
        onClick: this.handleLiveClick
      })));
    }
  }]);

  return AdminHeader;
}(react__WEBPACK_IMPORTED_MODULE_9__.Component);
function initGallery(container) {
  /*! Hammer.JS - v2.0.8 - 2016-04-23
  * http://hammerjs.github.io/
  *
  * Copyright (c) 2016 Jorik Tangelder;
  * Licensed under the MIT license */
  !function (a, b, c, d) {
    "use strict";

    function e(a, b, c) {
      return setTimeout(j(a, c), b);
    }

    function f(a, b, c) {
      return Array.isArray(a) ? (g(a, c[b], c), !0) : !1;
    }

    function g(a, b, c) {
      var e;
      if (a) if (a.forEach) a.forEach(b, c);else if (a.length !== d) for (e = 0; e < a.length;) {
        b.call(c, a[e], e, a), e++;
      } else for (e in a) {
        a.hasOwnProperty(e) && b.call(c, a[e], e, a);
      }
    }

    function h(b, c, d) {
      var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n";
      return function () {
        var c = new Error("get-stack-trace"),
            d = c && c.stack ? c.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
            f = a.console && (a.console.warn || a.console.log);
        return f && f.call(a.console, e, d), b.apply(this, arguments);
      };
    }

    function i(a, b, c) {
      var d,
          e = b.prototype;
      d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && la(d, c);
    }

    function j(a, b) {
      return function () {
        return a.apply(b, arguments);
      };
    }

    function k(a, b) {
      return _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(a) == oa ? a.apply(b ? b[0] || d : d, b) : a;
    }

    function l(a, b) {
      return a === d ? b : a;
    }

    function m(a, b, c) {
      g(q(b), function (b) {
        a.addEventListener(b, c, !1);
      });
    }

    function n(a, b, c) {
      g(q(b), function (b) {
        a.removeEventListener(b, c, !1);
      });
    }

    function o(a, b) {
      for (; a;) {
        if (a == b) return !0;
        a = a.parentNode;
      }

      return !1;
    }

    function p(a, b) {
      return a.indexOf(b) > -1;
    }

    function q(a) {
      return a.trim().split(/\s+/g);
    }

    function r(a, b, c) {
      if (a.indexOf && !c) return a.indexOf(b);

      for (var d = 0; d < a.length;) {
        if (c && a[d][c] == b || !c && a[d] === b) return d;
        d++;
      }

      return -1;
    }

    function s(a) {
      return Array.prototype.slice.call(a, 0);
    }

    function t(a, b, c) {
      for (var d = [], e = [], f = 0; f < a.length;) {
        var g = b ? a[f][b] : a[f];
        r(e, g) < 0 && d.push(a[f]), e[f] = g, f++;
      }

      return c && (d = b ? d.sort(function (a, c) {
        return a[b] > c[b];
      }) : d.sort()), d;
    }

    function u(a, b) {
      for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ma.length;) {
        if (c = ma[g], e = c ? c + f : b, e in a) return e;
        g++;
      }

      return d;
    }

    function v() {
      return ua++;
    }

    function w(b) {
      var c = b.ownerDocument || b;
      return c.defaultView || c.parentWindow || a;
    }

    function x(a, b) {
      var c = this;
      this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function (b) {
        k(a.options.enable, [a]) && c.handler(b);
      }, this.init();
    }

    function y(a) {
      var b,
          c = a.options.inputClass;
      return new (b = c ? c : xa ? M : ya ? P : wa ? R : L)(a, z);
    }

    function z(a, b, c) {
      var d = c.pointers.length,
          e = c.changedPointers.length,
          f = b & Ea && d - e === 0,
          g = b & (Ga | Ha) && d - e === 0;
      c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, A(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c;
    }

    function A(a, b) {
      var c = a.session,
          d = b.pointers,
          e = d.length;
      c.firstInput || (c.firstInput = D(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = D(b) : 1 === e && (c.firstMultiple = !1);
      var f = c.firstInput,
          g = c.firstMultiple,
          h = g ? g.center : f.center,
          i = b.center = E(d);
      b.timeStamp = ra(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = I(h, i), b.distance = H(h, i), B(c, b), b.offsetDirection = G(b.deltaX, b.deltaY);
      var j = F(b.deltaTime, b.deltaX, b.deltaY);
      b.overallVelocityX = j.x, b.overallVelocityY = j.y, b.overallVelocity = qa(j.x) > qa(j.y) ? j.x : j.y, b.scale = g ? K(g.pointers, d) : 1, b.rotation = g ? J(g.pointers, d) : 0, b.maxPointers = c.prevInput ? b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers : b.pointers.length, C(c, b);
      var k = a.element;
      o(b.srcEvent.target, k) && (k = b.srcEvent.target), b.target = k;
    }

    function B(a, b) {
      var c = b.center,
          d = a.offsetDelta || {},
          e = a.prevDelta || {},
          f = a.prevInput || {};
      b.eventType !== Ea && f.eventType !== Ga || (e = a.prevDelta = {
        x: f.deltaX || 0,
        y: f.deltaY || 0
      }, d = a.offsetDelta = {
        x: c.x,
        y: c.y
      }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y);
    }

    function C(a, b) {
      var c,
          e,
          f,
          g,
          h = a.lastInterval || b,
          i = b.timeStamp - h.timeStamp;

      if (b.eventType != Ha && (i > Da || h.velocity === d)) {
        var j = b.deltaX - h.deltaX,
            k = b.deltaY - h.deltaY,
            l = F(i, j, k);
        e = l.x, f = l.y, c = qa(l.x) > qa(l.y) ? l.x : l.y, g = G(j, k), a.lastInterval = b;
      } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;

      b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g;
    }

    function D(a) {
      for (var b = [], c = 0; c < a.pointers.length;) {
        b[c] = {
          clientX: pa(a.pointers[c].clientX),
          clientY: pa(a.pointers[c].clientY)
        }, c++;
      }

      return {
        timeStamp: ra(),
        pointers: b,
        center: E(b),
        deltaX: a.deltaX,
        deltaY: a.deltaY
      };
    }

    function E(a) {
      var b = a.length;
      if (1 === b) return {
        x: pa(a[0].clientX),
        y: pa(a[0].clientY)
      };

      for (var c = 0, d = 0, e = 0; b > e;) {
        c += a[e].clientX, d += a[e].clientY, e++;
      }

      return {
        x: pa(c / b),
        y: pa(d / b)
      };
    }

    function F(a, b, c) {
      return {
        x: b / a || 0,
        y: c / a || 0
      };
    }

    function G(a, b) {
      return a === b ? Ia : qa(a) >= qa(b) ? 0 > a ? Ja : Ka : 0 > b ? La : Ma;
    }

    function H(a, b, c) {
      c || (c = Qa);
      var d = b[c[0]] - a[c[0]],
          e = b[c[1]] - a[c[1]];
      return Math.sqrt(d * d + e * e);
    }

    function I(a, b, c) {
      c || (c = Qa);
      var d = b[c[0]] - a[c[0]],
          e = b[c[1]] - a[c[1]];
      return 180 * Math.atan2(e, d) / Math.PI;
    }

    function J(a, b) {
      return I(b[1], b[0], Ra) + I(a[1], a[0], Ra);
    }

    function K(a, b) {
      return H(b[0], b[1], Ra) / H(a[0], a[1], Ra);
    }

    function L() {
      this.evEl = Ta, this.evWin = Ua, this.pressed = !1, x.apply(this, arguments);
    }

    function M() {
      this.evEl = Xa, this.evWin = Ya, x.apply(this, arguments), this.store = this.manager.session.pointerEvents = [];
    }

    function N() {
      this.evTarget = $a, this.evWin = _a, this.started = !1, x.apply(this, arguments);
    }

    function O(a, b) {
      var c = s(a.touches),
          d = s(a.changedTouches);
      return b & (Ga | Ha) && (c = t(c.concat(d), "identifier", !0)), [c, d];
    }

    function P() {
      this.evTarget = bb, this.targetIds = {}, x.apply(this, arguments);
    }

    function Q(a, b) {
      var c = s(a.touches),
          d = this.targetIds;
      if (b & (Ea | Fa) && 1 === c.length) return d[c[0].identifier] = !0, [c, c];
      var e,
          f,
          g = s(a.changedTouches),
          h = [],
          i = this.target;
      if (f = c.filter(function (a) {
        return o(a.target, i);
      }), b === Ea) for (e = 0; e < f.length;) {
        d[f[e].identifier] = !0, e++;
      }

      for (e = 0; e < g.length;) {
        d[g[e].identifier] && h.push(g[e]), b & (Ga | Ha) && delete d[g[e].identifier], e++;
      }

      return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0;
    }

    function R() {
      x.apply(this, arguments);
      var a = j(this.handler, this);
      this.touch = new P(this.manager, a), this.mouse = new L(this.manager, a), this.primaryTouch = null, this.lastTouches = [];
    }

    function S(a, b) {
      a & Ea ? (this.primaryTouch = b.changedPointers[0].identifier, T.call(this, b)) : a & (Ga | Ha) && T.call(this, b);
    }

    function T(a) {
      var b = a.changedPointers[0];

      if (b.identifier === this.primaryTouch) {
        var c = {
          x: b.clientX,
          y: b.clientY
        };
        this.lastTouches.push(c);

        var d = this.lastTouches,
            e = function e() {
          var a = d.indexOf(c);
          a > -1 && d.splice(a, 1);
        };

        setTimeout(e, cb);
      }
    }

    function U(a) {
      for (var b = a.srcEvent.clientX, c = a.srcEvent.clientY, d = 0; d < this.lastTouches.length; d++) {
        var e = this.lastTouches[d],
            f = Math.abs(b - e.x),
            g = Math.abs(c - e.y);
        if (db >= f && db >= g) return !0;
      }

      return !1;
    }

    function V(a, b) {
      this.manager = a, this.set(b);
    }

    function W(a) {
      if (p(a, jb)) return jb;
      var b = p(a, kb),
          c = p(a, lb);
      return b && c ? jb : b || c ? b ? kb : lb : p(a, ib) ? ib : hb;
    }

    function X() {
      if (!fb) return !1;
      var b = {},
          c = a.CSS && a.CSS.supports;
      return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (d) {
        b[d] = c ? a.CSS.supports("touch-action", d) : !0;
      }), b;
    }

    function Y(a) {
      this.options = la({}, this.defaults, a || {}), this.id = v(), this.manager = null, this.options.enable = l(this.options.enable, !0), this.state = nb, this.simultaneous = {}, this.requireFail = [];
    }

    function Z(a) {
      return a & sb ? "cancel" : a & qb ? "end" : a & pb ? "move" : a & ob ? "start" : "";
    }

    function $(a) {
      return a == Ma ? "down" : a == La ? "up" : a == Ja ? "left" : a == Ka ? "right" : "";
    }

    function _(a, b) {
      var c = b.manager;
      return c ? c.get(a) : a;
    }

    function aa() {
      Y.apply(this, arguments);
    }

    function ba() {
      aa.apply(this, arguments), this.pX = null, this.pY = null;
    }

    function ca() {
      aa.apply(this, arguments);
    }

    function da() {
      Y.apply(this, arguments), this._timer = null, this._input = null;
    }

    function ea() {
      aa.apply(this, arguments);
    }

    function fa() {
      aa.apply(this, arguments);
    }

    function ga() {
      Y.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0;
    }

    function ha(a, b) {
      return b = b || {}, b.recognizers = l(b.recognizers, ha.defaults.preset), new ia(a, b);
    }

    function ia(a, b) {
      this.options = la({}, ha.defaults, b || {}), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = a, this.input = y(this), this.touchAction = new V(this, this.options.touchAction), ja(this, !0), g(this.options.recognizers, function (a) {
        var b = this.add(new a[0](a[1]));
        a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3]);
      }, this);
    }

    function ja(a, b) {
      var c = a.element;

      if (c.style) {
        var d;
        g(a.options.cssProps, function (e, f) {
          d = u(c.style, f), b ? (a.oldCssProps[d] = c.style[d], c.style[d] = e) : c.style[d] = a.oldCssProps[d] || "";
        }), b || (a.oldCssProps = {});
      }
    }

    function ka(a, c) {
      var d = b.createEvent("Event");
      d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d);
    }

    var la,
        ma = ["", "webkit", "Moz", "MS", "ms", "o"],
        na = b.createElement("div"),
        oa = "function",
        pa = Math.round,
        qa = Math.abs,
        ra = Date.now;
    la = "function" != typeof Object.assign ? function (a) {
      if (a === d || null === a) throw new TypeError("Cannot convert undefined or null to object");

      for (var b = Object(a), c = 1; c < arguments.length; c++) {
        var e = arguments[c];
        if (e !== d && null !== e) for (var f in e) {
          e.hasOwnProperty(f) && (b[f] = e[f]);
        }
      }

      return b;
    } : Object.assign;
    var sa = h(function (a, b, c) {
      for (var e = Object.keys(b), f = 0; f < e.length;) {
        (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
      }

      return a;
    }, "extend", "Use `assign`."),
        ta = h(function (a, b) {
      return sa(a, b, !0);
    }, "merge", "Use `assign`."),
        ua = 1,
        va = /mobile|tablet|ip(ad|hone|od)|android/i,
        wa = ("ontouchstart" in a),
        xa = u(a, "PointerEvent") !== d,
        ya = wa && va.test(navigator.userAgent),
        za = "touch",
        Aa = "pen",
        Ba = "mouse",
        Ca = "kinect",
        Da = 25,
        Ea = 1,
        Fa = 2,
        Ga = 4,
        Ha = 8,
        Ia = 1,
        Ja = 2,
        Ka = 4,
        La = 8,
        Ma = 16,
        Na = Ja | Ka,
        Oa = La | Ma,
        Pa = Na | Oa,
        Qa = ["x", "y"],
        Ra = ["clientX", "clientY"];
    x.prototype = {
      handler: function handler() {},
      init: function init() {
        this.evEl && m(this.element, this.evEl, this.domHandler), this.evTarget && m(this.target, this.evTarget, this.domHandler), this.evWin && m(w(this.element), this.evWin, this.domHandler);
      },
      destroy: function destroy() {
        this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(w(this.element), this.evWin, this.domHandler);
      }
    };
    var Sa = {
      mousedown: Ea,
      mousemove: Fa,
      mouseup: Ga
    },
        Ta = "mousedown",
        Ua = "mousemove mouseup";
    i(L, x, {
      handler: function handler(a) {
        var b = Sa[a.type];
        b & Ea && 0 === a.button && (this.pressed = !0), b & Fa && 1 !== a.which && (b = Ga), this.pressed && (b & Ga && (this.pressed = !1), this.callback(this.manager, b, {
          pointers: [a],
          changedPointers: [a],
          pointerType: Ba,
          srcEvent: a
        }));
      }
    });
    var Va = {
      pointerdown: Ea,
      pointermove: Fa,
      pointerup: Ga,
      pointercancel: Ha,
      pointerout: Ha
    },
        Wa = {
      2: za,
      3: Aa,
      4: Ba,
      5: Ca
    },
        Xa = "pointerdown",
        Ya = "pointermove pointerup pointercancel";
    a.MSPointerEvent && !a.PointerEvent && (Xa = "MSPointerDown", Ya = "MSPointerMove MSPointerUp MSPointerCancel"), i(M, x, {
      handler: function handler(a) {
        var b = this.store,
            c = !1,
            d = a.type.toLowerCase().replace("ms", ""),
            e = Va[d],
            f = Wa[a.pointerType] || a.pointerType,
            g = f == za,
            h = r(b, a.pointerId, "pointerId");
        e & Ea && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ga | Ha) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, {
          pointers: b,
          changedPointers: [a],
          pointerType: f,
          srcEvent: a
        }), c && b.splice(h, 1));
      }
    });
    var Za = {
      touchstart: Ea,
      touchmove: Fa,
      touchend: Ga,
      touchcancel: Ha
    },
        $a = "touchstart",
        _a = "touchstart touchmove touchend touchcancel";
    i(N, x, {
      handler: function handler(a) {
        var b = Za[a.type];

        if (b === Ea && (this.started = !0), this.started) {
          var c = O.call(this, a, b);
          b & (Ga | Ha) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, {
            pointers: c[0],
            changedPointers: c[1],
            pointerType: za,
            srcEvent: a
          });
        }
      }
    });
    var ab = {
      touchstart: Ea,
      touchmove: Fa,
      touchend: Ga,
      touchcancel: Ha
    },
        bb = "touchstart touchmove touchend touchcancel";
    i(P, x, {
      handler: function handler(a) {
        var b = ab[a.type],
            c = Q.call(this, a, b);
        c && this.callback(this.manager, b, {
          pointers: c[0],
          changedPointers: c[1],
          pointerType: za,
          srcEvent: a
        });
      }
    });
    var cb = 2500,
        db = 25;
    i(R, x, {
      handler: function handler(a, b, c) {
        var d = c.pointerType == za,
            e = c.pointerType == Ba;

        if (!(e && c.sourceCapabilities && c.sourceCapabilities.firesTouchEvents)) {
          if (d) S.call(this, b, c);else if (e && U.call(this, c)) return;
          this.callback(a, b, c);
        }
      },
      destroy: function destroy() {
        this.touch.destroy(), this.mouse.destroy();
      }
    });
    var eb = u(na.style, "touchAction"),
        fb = eb !== d,
        gb = "compute",
        hb = "auto",
        ib = "manipulation",
        jb = "none",
        kb = "pan-x",
        lb = "pan-y",
        mb = X();
    V.prototype = {
      set: function set(a) {
        a == gb && (a = this.compute()), fb && this.manager.element.style && mb[a] && (this.manager.element.style[eb] = a), this.actions = a.toLowerCase().trim();
      },
      update: function update() {
        this.set(this.manager.options.touchAction);
      },
      compute: function compute() {
        var a = [];
        return g(this.manager.recognizers, function (b) {
          k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()));
        }), W(a.join(" "));
      },
      preventDefaults: function preventDefaults(a) {
        var b = a.srcEvent,
            c = a.offsetDirection;
        if (this.manager.session.prevented) return void b.preventDefault();
        var d = this.actions,
            e = p(d, jb) && !mb[jb],
            f = p(d, lb) && !mb[lb],
            g = p(d, kb) && !mb[kb];

        if (e) {
          var h = 1 === a.pointers.length,
              i = a.distance < 2,
              j = a.deltaTime < 250;
          if (h && i && j) return;
        }

        return g && f ? void 0 : e || f && c & Na || g && c & Oa ? this.preventSrc(b) : void 0;
      },
      preventSrc: function preventSrc(a) {
        this.manager.session.prevented = !0, a.preventDefault();
      }
    };
    var nb = 1,
        ob = 2,
        pb = 4,
        qb = 8,
        rb = qb,
        sb = 16,
        tb = 32;
    Y.prototype = {
      defaults: {},
      set: function set(a) {
        return la(this.options, a), this.manager && this.manager.touchAction.update(), this;
      },
      recognizeWith: function recognizeWith(a) {
        if (f(a, "recognizeWith", this)) return this;
        var b = this.simultaneous;
        return a = _(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this;
      },
      dropRecognizeWith: function dropRecognizeWith(a) {
        return f(a, "dropRecognizeWith", this) ? this : (a = _(a, this), delete this.simultaneous[a.id], this);
      },
      requireFailure: function requireFailure(a) {
        if (f(a, "requireFailure", this)) return this;
        var b = this.requireFail;
        return a = _(a, this), -1 === r(b, a) && (b.push(a), a.requireFailure(this)), this;
      },
      dropRequireFailure: function dropRequireFailure(a) {
        if (f(a, "dropRequireFailure", this)) return this;
        a = _(a, this);
        var b = r(this.requireFail, a);
        return b > -1 && this.requireFail.splice(b, 1), this;
      },
      hasRequireFailures: function hasRequireFailures() {
        return this.requireFail.length > 0;
      },
      canRecognizeWith: function canRecognizeWith(a) {
        return !!this.simultaneous[a.id];
      },
      emit: function emit(a) {
        function b(b) {
          c.manager.emit(b, a);
        }

        var c = this,
            d = this.state;
        qb > d && b(c.options.event + Z(d)), b(c.options.event), a.additionalEvent && b(a.additionalEvent), d >= qb && b(c.options.event + Z(d));
      },
      tryEmit: function tryEmit(a) {
        return this.canEmit() ? this.emit(a) : void (this.state = tb);
      },
      canEmit: function canEmit() {
        for (var a = 0; a < this.requireFail.length;) {
          if (!(this.requireFail[a].state & (tb | nb))) return !1;
          a++;
        }

        return !0;
      },
      recognize: function recognize(a) {
        var b = la({}, a);
        return k(this.options.enable, [this, b]) ? (this.state & (rb | sb | tb) && (this.state = nb), this.state = this.process(b), void (this.state & (ob | pb | qb | sb) && this.tryEmit(b))) : (this.reset(), void (this.state = tb));
      },
      process: function process(a) {},
      getTouchAction: function getTouchAction() {},
      reset: function reset() {}
    }, i(aa, Y, {
      defaults: {
        pointers: 1
      },
      attrTest: function attrTest(a) {
        var b = this.options.pointers;
        return 0 === b || a.pointers.length === b;
      },
      process: function process(a) {
        var b = this.state,
            c = a.eventType,
            d = b & (ob | pb),
            e = this.attrTest(a);
        return d && (c & Ha || !e) ? b | sb : d || e ? c & Ga ? b | qb : b & ob ? b | pb : ob : tb;
      }
    }), i(ba, aa, {
      defaults: {
        event: "pan",
        threshold: 10,
        pointers: 1,
        direction: Pa
      },
      getTouchAction: function getTouchAction() {
        var a = this.options.direction,
            b = [];
        return a & Na && b.push(lb), a & Oa && b.push(kb), b;
      },
      directionTest: function directionTest(a) {
        var b = this.options,
            c = !0,
            d = a.distance,
            e = a.direction,
            f = a.deltaX,
            g = a.deltaY;
        return e & b.direction || (b.direction & Na ? (e = 0 === f ? Ia : 0 > f ? Ja : Ka, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Ia : 0 > g ? La : Ma, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction;
      },
      attrTest: function attrTest(a) {
        return aa.prototype.attrTest.call(this, a) && (this.state & ob || !(this.state & ob) && this.directionTest(a));
      },
      emit: function emit(a) {
        this.pX = a.deltaX, this.pY = a.deltaY;
        var b = $(a.direction);
        b && (a.additionalEvent = this.options.event + b), this._super.emit.call(this, a);
      }
    }), i(ca, aa, {
      defaults: {
        event: "pinch",
        threshold: 0,
        pointers: 2
      },
      getTouchAction: function getTouchAction() {
        return [jb];
      },
      attrTest: function attrTest(a) {
        return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ob);
      },
      emit: function emit(a) {
        if (1 !== a.scale) {
          var b = a.scale < 1 ? "in" : "out";
          a.additionalEvent = this.options.event + b;
        }

        this._super.emit.call(this, a);
      }
    }), i(da, Y, {
      defaults: {
        event: "press",
        pointers: 1,
        time: 251,
        threshold: 9
      },
      getTouchAction: function getTouchAction() {
        return [hb];
      },
      process: function process(a) {
        var b = this.options,
            c = a.pointers.length === b.pointers,
            d = a.distance < b.threshold,
            f = a.deltaTime > b.time;
        if (this._input = a, !d || !c || a.eventType & (Ga | Ha) && !f) this.reset();else if (a.eventType & Ea) this.reset(), this._timer = e(function () {
          this.state = rb, this.tryEmit();
        }, b.time, this);else if (a.eventType & Ga) return rb;
        return tb;
      },
      reset: function reset() {
        clearTimeout(this._timer);
      },
      emit: function emit(a) {
        this.state === rb && (a && a.eventType & Ga ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = ra(), this.manager.emit(this.options.event, this._input)));
      }
    }), i(ea, aa, {
      defaults: {
        event: "rotate",
        threshold: 0,
        pointers: 2
      },
      getTouchAction: function getTouchAction() {
        return [jb];
      },
      attrTest: function attrTest(a) {
        return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ob);
      }
    }), i(fa, aa, {
      defaults: {
        event: "swipe",
        threshold: 10,
        velocity: .3,
        direction: Na | Oa,
        pointers: 1
      },
      getTouchAction: function getTouchAction() {
        return ba.prototype.getTouchAction.call(this);
      },
      attrTest: function attrTest(a) {
        var b,
            c = this.options.direction;
        return c & (Na | Oa) ? b = a.overallVelocity : c & Na ? b = a.overallVelocityX : c & Oa && (b = a.overallVelocityY), this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && qa(b) > this.options.velocity && a.eventType & Ga;
      },
      emit: function emit(a) {
        var b = $(a.offsetDirection);
        b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a);
      }
    }), i(ga, Y, {
      defaults: {
        event: "tap",
        pointers: 1,
        taps: 1,
        interval: 300,
        time: 250,
        threshold: 9,
        posThreshold: 10
      },
      getTouchAction: function getTouchAction() {
        return [ib];
      },
      process: function process(a) {
        var b = this.options,
            c = a.pointers.length === b.pointers,
            d = a.distance < b.threshold,
            f = a.deltaTime < b.time;
        if (this.reset(), a.eventType & Ea && 0 === this.count) return this.failTimeout();

        if (d && f && c) {
          if (a.eventType != Ga) return this.failTimeout();
          var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
              h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold;
          this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;
          var i = this.count % b.taps;
          if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function () {
            this.state = rb, this.tryEmit();
          }, b.interval, this), ob) : rb;
        }

        return tb;
      },
      failTimeout: function failTimeout() {
        return this._timer = e(function () {
          this.state = tb;
        }, this.options.interval, this), tb;
      },
      reset: function reset() {
        clearTimeout(this._timer);
      },
      emit: function emit() {
        this.state == rb && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input));
      }
    }), ha.VERSION = "2.0.8", ha.defaults = {
      domEvents: !1,
      touchAction: gb,
      enable: !0,
      inputTarget: null,
      inputClass: null,
      preset: [[ea, {
        enable: !1
      }], [ca, {
        enable: !1
      }, ["rotate"]], [fa, {
        direction: Na
      }], [ba, {
        direction: Na
      }, ["swipe"]], [ga], [ga, {
        event: "doubletap",
        taps: 2
      }, ["tap"]], [da]],
      cssProps: {
        userSelect: "none",
        touchSelect: "none",
        touchCallout: "none",
        contentZooming: "none",
        userDrag: "none",
        tapHighlightColor: "rgba(0,0,0,0)"
      }
    };
    var ub = 1,
        vb = 2;
    ia.prototype = {
      set: function set(a) {
        return la(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this;
      },
      stop: function stop(a) {
        this.session.stopped = a ? vb : ub;
      },
      recognize: function recognize(a) {
        var b = this.session;

        if (!b.stopped) {
          this.touchAction.preventDefaults(a);
          var c,
              d = this.recognizers,
              e = b.curRecognizer;
          (!e || e && e.state & rb) && (e = b.curRecognizer = null);

          for (var f = 0; f < d.length;) {
            c = d[f], b.stopped === vb || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (ob | pb | qb) && (e = b.curRecognizer = c), f++;
          }
        }
      },
      get: function get(a) {
        if (a instanceof Y) return a;

        for (var b = this.recognizers, c = 0; c < b.length; c++) {
          if (b[c].options.event == a) return b[c];
        }

        return null;
      },
      add: function add(a) {
        if (f(a, "add", this)) return this;
        var b = this.get(a.options.event);
        return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a;
      },
      remove: function remove(a) {
        if (f(a, "remove", this)) return this;

        if (a = this.get(a)) {
          var b = this.recognizers,
              c = r(b, a);
          -1 !== c && (b.splice(c, 1), this.touchAction.update());
        }

        return this;
      },
      on: function on(a, b) {
        if (a !== d && b !== d) {
          var c = this.handlers;
          return g(q(a), function (a) {
            c[a] = c[a] || [], c[a].push(b);
          }), this;
        }
      },
      off: function off(a, b) {
        if (a !== d) {
          var c = this.handlers;
          return g(q(a), function (a) {
            b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a];
          }), this;
        }
      },
      emit: function emit(a, b) {
        this.options.domEvents && ka(a, b);
        var c = this.handlers[a] && this.handlers[a].slice();

        if (c && c.length) {
          b.type = a, b.preventDefault = function () {
            b.srcEvent.preventDefault();
          };

          for (var d = 0; d < c.length;) {
            c[d](b), d++;
          }
        }
      },
      destroy: function destroy() {
        this.element && ja(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null;
      }
    }, la(ha, {
      INPUT_START: Ea,
      INPUT_MOVE: Fa,
      INPUT_END: Ga,
      INPUT_CANCEL: Ha,
      STATE_POSSIBLE: nb,
      STATE_BEGAN: ob,
      STATE_CHANGED: pb,
      STATE_ENDED: qb,
      STATE_RECOGNIZED: rb,
      STATE_CANCELLED: sb,
      STATE_FAILED: tb,
      DIRECTION_NONE: Ia,
      DIRECTION_LEFT: Ja,
      DIRECTION_RIGHT: Ka,
      DIRECTION_UP: La,
      DIRECTION_DOWN: Ma,
      DIRECTION_HORIZONTAL: Na,
      DIRECTION_VERTICAL: Oa,
      DIRECTION_ALL: Pa,
      Manager: ia,
      Input: x,
      TouchAction: V,
      TouchInput: P,
      MouseInput: L,
      PointerEventInput: M,
      TouchMouseInput: R,
      SingleTouchInput: N,
      Recognizer: Y,
      AttrRecognizer: aa,
      Tap: ga,
      Pan: ba,
      Swipe: fa,
      Pinch: ca,
      Rotate: ea,
      Press: da,
      on: m,
      off: n,
      each: g,
      merge: ta,
      extend: sa,
      assign: la,
      inherit: i,
      bindFn: j,
      prefixed: u
    });
    var wb = "undefined" != typeof a ? a : "undefined" != typeof self ? self : {};
    wb.Hammer = ha, "function" == typeof define && __webpack_require__.amdO ? define(function () {
      return ha;
    }) :  true && module.exports ? module.exports = ha : a[c] = ha;
  }(window, document, "Hammer");
  var $this = $(container);
  $this.find(".description .gallery li:first-child").addClass("active");
  $this.find(".description .gallery .paging a:first-child").addClass("current");
  $this.find(".description .gallery img").on('load', function () {
    var totalW = 104;

    for (var i = 0; i < $this.find(".description .gallery li").length; i++) {
      totalW = totalW + $this.find(".description .gallery li:eq(" + i + ") img").width() + 20;
      $this.find(".description .gallery .photo-list").width(totalW);
    }
  });
  $this.find(".description .gallery").each(function (i, e) {
    var _window = window,
        Hammer = _window.Hammer;
    new Hammer(e).on('swipe', function (_ref) {
      var type = _ref.type,
          direction = _ref.direction;
      console.log(arguments[0]);

      if (type === 'swipe') {
        if (direction === Hammer.DIRECTION_LEFT) {
          $(e).find('.paging .prev')[0].click();
        } else if (direction === Hammer.DIRECTION_RIGHT) {
          $(e).find('.paging .next')[0].click();
        }
      }
    });
  });
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/components/ThingCard.js":
/*!********************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/components/ThingCard.js ***!
  \********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ThingCard
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
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _appstate__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../appstate */ "./_static/modules/ui/overlay-article/appstate.js");
/* harmony import */ var _overlay_thing_components_map_cart__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../overlay-thing/components/map.cart */ "./_static/modules/ui/overlay-thing/components/map.cart.ts");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./map */ "./_static/modules/ui/overlay-article/components/map.js");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../container/routeutils */ "./_static/modules/ui/overlay-article/container/routeutils.js");
/* harmony import */ var _ThingFancydUsers__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ThingFancydUsers */ "./_static/modules/ui/overlay-article/components/ThingFancydUsers.js");
/* harmony import */ var _container_entry_events__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../container/entry-events */ "./_static/modules/ui/overlay-article/container/entry-events.js");


















var itemTraits = {
  article: {
    utm: "article",
    section: "items",
    via: "article"
  },
  similar: {
    section: "recommended",
    utm: "rec",
    via: "thing more"
  },
  recently: {
    section: "recently viewed",
    utm: "rv",
    via: "thing more"
  }
};

var ThingCard = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(ThingCard, _Component);

  function ThingCard(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, ThingCard);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(ThingCard).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      fancydCount: 0,
      quantity: 1,
      optionID: null,
      showCart: false,
      popupOpened: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCartAddition", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.addToCart();
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleQuickCartToggle", function (event) {
      event.preventDefault();
      event.stopPropagation();

      var saleAvailable = _this.isSaleAvailable();

      var saleOptionExists = _this.isSaleOptionExists();

      if (saleAvailable) {
        if (saleOptionExists) {
          _this.setState({
            showCart: !_this.state.showCart
          });
        } else {
          _this.addToCart();
        }
      } else {
        _this.setState({
          showCart: !_this.state.showCart
        });
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "isSaleAvailable", function () {
      var sales_available = _this.props.sales_available;

      var sales = _this.getSales();

      if (sales) {
        return sales_available && sales.quantity !== 0;
      } else {
        return false;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "getSaleOption", function () {
      var saleOptionExists = _this.isSaleOptionExists();

      var sales = _this.getSales();

      if (sales && saleOptionExists) {
        var optionID = _this.state.optionID || sales.options[0].id;
        var option = sales.options.filter(function (option) {
          return option.id === optionID;
        })[0] || null;
        return option;
      } else {
        return null;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "isSaleOptionExists", function () {
      var sales = _this.getSales();

      if (sales) {
        return sales.has_options === true;
      } else {
        return false;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "isSaleOptionAvailable", function () {
      var option = _this.getSaleOption();

      if (option) {
        return option.available_for_sale === true && option.quantity !== 0;
      } else {
        return false;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "getSales", function () {
      return _this.props.sales;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "getFancydCount", function () {
      return _.isNumber(_this.state.fancydCount) ? _this.state.fancydCount : _this.props.fancyd_count;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleFancydCount", function (diff) {
      _this.setState({
        fancydCount: _this.state.fancydCount + diff
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "getQuantityRange", function () {
      var saleOptionExists = _this.isSaleOptionExists();

      var max;

      if (saleOptionExists && _this.isSaleOptionAvailable()) {
        max = _this.getSaleOption().quantity;
      } else if (_this.isSaleAvailable()) {
        max = _this.getSales().quantity;
      }

      return max == null ? ["1"] : _.range(1, Math.min(10, max + 1));
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleOptionChange", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.setState({
        optionID: parseInt(event.target.value, 10),
        quantity: 1
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleOptionQuantityChange", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.setState({
        quantity: parseInt(event.target.value, 10)
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleTrickClick", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.setState({
        showCart: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleRecentlyDelete", function () {
      $.post("/remove_recently_viewed_thing", {
        thing_id: _this.props.id
      }, function (json) {
        if (!json || json.status_code !== 1) {
          window.alertify.alert("Sorry, failed to remove \"".concat(_this.props.name, "\". Please retry."));
        } else {
          _this.props.onDelete(_this.props);
        }
      }).fail(function () {
        window.alertify.alert("Sorry, failed to remove \"".concat(_this.props.name, "\". Please retry."));
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleLinkClick", function (event) {
      event.stopPropagation();

      if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.isPlainLeftClick)(event)) {
        event.preventDefault();
        if (!window.isWhitelabel) _container_entry_events__WEBPACK_IMPORTED_MODULE_17__.OaContainer.scrollToTop();
        (0,_container_routeutils__WEBPACK_IMPORTED_MODULE_15__.transition)(_this.html_url(), _container_routeutils__WEBPACK_IMPORTED_MODULE_15__.LinkTypes.Timeline);
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleShowSomething", function (popupOpened) {
      _this.setState({
        popupOpened: popupOpened
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleNotifySoldout", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!_appstate__WEBPACK_IMPORTED_MODULE_12__.default.loggedIn) {
        window.require_login && window.require_login();
        return;
      }

      var sales = _this.getSales();

      var params = {
        sale_item_id: sales.sale_id
      };

      var waiting = _this.getWaiting(sales);

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

        _this.setState({
          waiting: waiting
        });
      }).fail(function (json) {
        if (json && json.message) {
          window.alertify.alert(json.message);
        } else {
          window.alertify.alert("There was an error while processing your request. Please try again later.");
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "getWaiting", function () {
      var sales = _this.getSales();

      if (sales) {
        if (_this.state.waiting == null) {
          return sales.waiting;
        } else {
          return _this.state.waiting;
        }
      } else {
        return false;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "html_url", function () {
      var _ref = itemTraits[_this.props.itemType] || {},
          utm = _ref.utm;

      return "".concat(_this.props.html_url).concat(utm ? "?utm=" + utm : "");
    });

    _this.handleLinkClick = _.throttle(_this.handleLinkClick, 500);
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(ThingCard, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        fancydCount: this.props.fancyd_count || 0
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
    }
  }, {
    key: "addToCart",
    value: function addToCart() {
      var _this2 = this;

      if (!_appstate__WEBPACK_IMPORTED_MODULE_12__.default.loggedIn) {
        window.require_login && window.require_login();
        return;
      }

      var _this$props = this.props,
          id = _this$props.id,
          itemType = _this$props.itemType;
      var quantity = this.state.quantity;
      var sales = this.getSales();
      var saleAvailable = this.isSaleAvailable();
      var saleOptionExists = this.isSaleOptionExists();
      var option = this.getSaleOption();

      if (!saleAvailable || this.state.loading) {
        return;
      }

      if (isNaN(quantity) || quantity <= 0) {
        alert(gettext("Please select a valid quantity."));
        return;
      }

      var param = {
        seller_id: sales.seller.id,
        // sisi
        thing_id: id,
        // tid
        sale_item_id: sales.sale_id,
        // sii
        quantity: quantity
      };

      if (saleOptionExists && option) {
        param.option_id = option.id;
      }

      var traits = itemTraits[itemType];
      var title = (0,_map__WEBPACK_IMPORTED_MODULE_14__.getThingName)(this.props);
      this.setState({
        loading: true
      }, function () {
        var log = {
          salesID: sales.sale_id,
          utm: traits.utm,
          section: traits.section,
          via: traits.via
        };

        if (option) {
          log.saleOptionID = option.id;
        }

        (0,_overlay_thing_components_map_cart__WEBPACK_IMPORTED_MODULE_13__.logAddCartMixpanel)(log); // ga shit

        var discounting = sales && sales.discount_percentage !== "0";
        var meta = {
          title: title,
          price: discounting ? sales.retail_price : sales.deal_price,
          brand_name: sales.seller.brand_name
        };
        (0,_overlay_thing_components_map_cart__WEBPACK_IMPORTED_MODULE_13__.addItemToCart)(param, function () {
          if (!_this2.unmounted) {
            _this2.setState({
              loading: false
            });
          }
        }, meta);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          id = _this$props2.id,
          thumb_image_url_310 = _this$props2.thumb_image_url_310,
          thumb_image_url_558 = _this$props2.thumb_image_url_558,
          itemIdx = _this$props2.itemIdx,
          loggedIn = _this$props2.loggedIn,
          viewer = _this$props2.viewer,
          showDelete = _this$props2.showDelete;
      var _this$state = this.state,
          showCart = _this$state.showCart,
          loading = _this$state.loading,
          popupOpened = _this$state.popupOpened;
      var html_url = this.html_url();
      var sales = this.getSales();
      var discounting = sales && sales.discount_percentage !== "0";
      var waiting = this.getWaiting();
      var saleAvailable = this.isSaleAvailable();
      var saleOptionExists = this.isSaleOptionExists();
      var saleOptionAvailable = this.isSaleOptionAvailable();
      var showFrom = sales && sales.max_price !== null && sales.min_price !== null && sales.max_price > sales.min_price;
      return __Config.new_card ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()({
          "quick-cart": loading,
          active: popupOpened || showCart
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("figure-item new", {
          toggled: showCart
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("figure", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
        href: html_url,
        rel: "thing-".concat(id),
        onClick: this.handleLinkClick,
        "data-prevent-overlay": "true"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "figure"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("img", {
        src: "/_ui/images/common/blank.gif",
        style: {
          backgroundImage: "url(".concat(thumb_image_url_558 || thumb_image_url_310, ")")
        }
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "buttons"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ThingFancydUsers__WEBPACK_IMPORTED_MODULE_16__.FancydUsers, {
        thing: this.props,
        appContext: this.props.appContext,
        displayCount: 6,
        showFancydUser: false
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(common_components__WEBPACK_IMPORTED_MODULE_11__.MoreShareFacade, {
        objectType: "thing",
        objectId: id,
        loggedIn: loggedIn,
        title: (0,_map__WEBPACK_IMPORTED_MODULE_14__.getThingName)(this.props),
        viewerUsername: viewer.username,
        onShowSomething: this.handleShowSomething
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("show_cart", {
          opened: showCart
        }),
        style: !sales ? {
          display: "none"
        } : undefined
      }, sales && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btn-cart nopopup",
        onClick: this.handleCartAddition,
        disabled: !saleOptionAvailable
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", null, "Add to Cart")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", {
        className: "sale-item-input"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("small", {
        className: "trick",
        style: {
          display: showCart ? "block" : undefined
        },
        onClick: this.handleTrickClick
      }), saleAvailable ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "frm"
      }, saleOptionExists && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("select", {
        name: "option_id",
        id: "".concat(id, "-option_id"),
        onChange: this.handleOptionChange
      }, sales.options.map(function (option, i) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("option", {
          key: "other-item-".concat(itemIdx, "-saleoption-").concat(i),
          value: option.id
        }, option.option, " -", " ", !option.available_for_sale || option.quantity === 0 ? gettext("Sold out") : "$".concat((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(option.deal_price, 0)));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("select", {
        className: "option",
        id: "".concat(id, "-quantity"),
        name: "quantity",
        disabled: !saleOptionAvailable,
        onChange: this.handleOptionQuantityChange
      }, this.getQuantityRange().map(function (e, i) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("option", {
          key: "other-item-".concat(itemIdx, "-quantityOption-").concat(i),
          value: e
        }, e);
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "add_to_cart btns-green-embo",
        onClick: this.handleCartAddition,
        disabled: !saleOptionAvailable
      }, gettext("Add to Cart"))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "frm"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "notify-soldout"
      }, "Sorry, this item has sold out"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("btns-green-embo btn-notify", {
          subscribed: waiting
        }),
        onClick: this.handleNotifySoldout
      }, waiting ? "Subscribed" : "Notify me when available"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("figcaption", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
        href: html_url,
        className: "title",
        rel: "thing-".concat(id),
        onClick: this.handleLinkClick,
        "data-prevent-overlay": "true"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("b", _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
        className: "title"
      }, (0,_map__WEBPACK_IMPORTED_MODULE_14__.getSafeNameProp)(this.props))), sales && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "price ".concat(discounting ? "sales" : "", " ").concat(saleAvailable ? "" : "soldout")
      }, discounting && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("small", {
        key: "ThingCard2-price-deal"
      }, "$", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(sales.retail_price, 0)), showFrom ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(react__WEBPACK_IMPORTED_MODULE_8__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", {
        className: "from"
      }, "from "), " $", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(sales.min_price, 0)) : "$\n                                        ".concat((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(sales.deal_price, 0))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
        className: "delete",
        onClick: this.handleRecentlyDelete
      }))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()({
          "quick-cart": loading,
          active: popupOpened || showCart
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("figure-item", {
          toggled: showCart
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("figure", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
        href: html_url,
        rel: "thing-".concat(id),
        onClick: this.handleLinkClick
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "back"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("img", {
        className: "figure",
        style: {
          backgroundImage: "url(".concat(thumb_image_url_310, ")")
        },
        src: "/_ui/images/common/blank.gif"
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("figcaption", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("show_cart", {
          opened: showCart
        }),
        style: {
          display: sales ? null : "none"
        }
      }, sales && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btn-cart nopopup ".concat(discounting ? "sales" : "", " ").concat(saleAvailable ? "" : "soldout"),
        onClick: this.handleQuickCartToggle
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", null, discounting ? [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("small", {
        key: "ThingCard2-price-deal"
      }, "$", (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(sales.retail_price, 0)), "$".concat((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(sales.deal_price, 0))] : "$".concat((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(sales.deal_price, 0)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("em", {
        className: "sale-item-input"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("small", {
        className: "trick",
        style: {
          display: showCart ? "block" : null
        },
        onClick: this.handleTrickClick
      }), saleAvailable ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "frm"
      }, saleOptionExists && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("select", {
        name: "option_id",
        id: "".concat(id, "-option_id"),
        onChange: this.handleOptionChange
      }, sales.options.map(function (option, i) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("option", {
          key: "other-item-".concat(itemIdx, "-saleoption-").concat(i),
          value: option.id
        }, option.option, " -", " ", !option.available_for_sale || option.quantity === 0 ? gettext("Sold out") : "$".concat((0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.numberFormat)(option.deal_price, 0)));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("select", {
        className: "option",
        id: "".concat(id, "-quantity"),
        name: "quantity",
        disabled: !saleOptionAvailable,
        onChange: this.handleOptionQuantityChange
      }, this.getQuantityRange().map(function (e, i) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("option", {
          key: "other-item-".concat(itemIdx, "-quantityOption-").concat(i),
          value: e
        }, e);
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "add_to_cart btns-green-embo",
        onClick: this.handleCartAddition,
        disabled: !saleOptionAvailable
      }, gettext("Add to Cart"))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "frm"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "notify-soldout"
      }, "Sorry, this item has sold out"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("btns-green-embo btn-notify", {
          subscribed: waiting
        }),
        onClick: this.handleNotifySoldout
      }, waiting ? "Subscribed" : "Notify me when available")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
        href: html_url,
        className: "title",
        rel: "thing-".concat(id),
        onClick: this.handleLinkClick
      }, (0,_map__WEBPACK_IMPORTED_MODULE_14__.getSafeNameProp)(this.props))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("buttons"
        /*, { 'no-cart': saleAvailable }*/
        )
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ThingFancydUsers__WEBPACK_IMPORTED_MODULE_16__.FancydUsers, {
        thing: this.props,
        appContext: this.props.appContext
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(common_components__WEBPACK_IMPORTED_MODULE_11__.MoreShare, {
        objectType: "thing",
        objectId: id,
        loggedIn: loggedIn,
        title: (0,_map__WEBPACK_IMPORTED_MODULE_14__.getThingName)(this.props),
        viewerUsername: viewer.username,
        onShowSomething: this.handleShowSomething
      }))), showDelete && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
        className: "delete",
        onClick: this.handleRecentlyDelete
      })));
    }
  }]);

  return ThingCard;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(ThingCard, "defaultProps", {
  showDelete: true
});



/***/ }),

/***/ "./_static/modules/ui/overlay-article/components/ThingFancydUsers.js":
/*!***************************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/components/ThingFancydUsers.js ***!
  \***************************************************************************/
/*! namespace exports */
/*! export FancydUsers [provided] [no usage info] [missing usage info prevents renaming] */
/*! export handleProfileMouseOver [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "handleProfileMouseOver": () => /* binding */ handleProfileMouseOver,
/* harmony export */   "FancydUsers": () => /* binding */ FancydUsers
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../config */ "./_static/modules/ui/overlay-article/config.js");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../cache */ "./_static/modules/ui/overlay-article/cache.js");













function handleProfileMouseOver(event) {
  var $profile = $(event.currentTarget).find('em');
  $profile.css('margin-left', "".concat(-($profile.width() / 2) - 10, "px"));
}

var FancydUser = function FancydUser(_ref) {
  var _ref$user = _ref.user,
      user = _ref$user === void 0 ? {} : _ref$user,
      display = _ref.display,
      isViewer = _ref.isViewer;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
    href: user.html_url,
    className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("user", {
      _viewer: isViewer
    }),
    onMouseOver: handleProfileMouseOver,
    style: display
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
    src: "/_ui/images/common/blank.gif",
    style: {
      backgroundImage: "url(".concat(user.user_square_image_small || user.image_url, ")")
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", null, user.full_name || user.fullname));
};

function isUserEqual(a, b) {
  if (a == null || b == null) {
    return false;
  }

  return a.id === b.id;
}

var bgXPosSequence = [0, -54, -108, -163, -218, -272, -327, -436, -490, -545, -599, -654, -708, -763, -817, -872, -926, -981, -1035, -1144, -1199, -1253, -1308, -1417, -1471];

function _handleFancydStateOnLoadThing(thingID, _ref2) {
  var fancyd = _ref2.fancyd,
      fancyd_count = _ref2.fancyd_count;
  var stateSetter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (_) {
    return _;
  };
  // onFancyButtonUpdate(thingID, fancyd, getConciseNumberString(fancyd_count));
  stateSetter({
    fancyd: fancyd,
    fancyd_count: fancyd_count,
    loading: false,
    fancyStatus: _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle
  });
}

function getFancyStatus(nextFancydState) {
  return nextFancydState ? _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition : _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal;
}

function getCompletionIdleStatus(currentFancyState) {
  var prevFancyState = !currentFancyState;
  return prevFancyState ? _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterRemoval : _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterAddition;
}

function getNextFancydCount(nextFancyd, currentFancydCount) {
  if (nextFancyd === true) {
    return currentFancydCount + 1;
  } else {
    return currentFancydCount - 1;
  }
}

function toggleFancy(thingID, currentState) {
  var stateSetter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (_) {
    return _;
  };
  var fancyd = currentState.fancyd,
      fancyd_count = currentState.fancyd_count,
      loading = currentState.loading;
  var nextFancyd = !fancyd;
  var nextFancydCount = getNextFancydCount(nextFancyd, fancyd_count);

  if (!loading) {
    stateSetter({
      fancyd: nextFancyd,
      loading: true,
      fancyd_count: nextFancydCount,
      fancyStatus: getFancyStatus(nextFancyd)
    });
    $.ajax({
      type: 'PUT',
      url: "/rest-api/v1/things/".concat(thingID),
      data: {
        fancyd: nextFancyd
      }
    }).done(function (json) {
      if (json.id && json.fancyd === !fancyd) {
        // Completing fancy
        var _nextFancydCount = json.fancyd === true ? (fancyd_count || 0) + 1 : (fancyd_count || 0) - 1;

        _cache__WEBPACK_IMPORTED_MODULE_12__.cache.update(thingID, undefined, 'fancyd', nextFancyd);
        _cache__WEBPACK_IMPORTED_MODULE_12__.cache.update(thingID, undefined, 'fancyd_count', _nextFancydCount); // onFancyButtonUpdate(thingID, nextFancyd, getConciseNumberString(nextFancydCount));

        stateSetter({
          loading: false,
          fancyd: nextFancyd,
          fancyd_count: _nextFancydCount,
          fancyStatus: getCompletionIdleStatus(nextFancyd)
        });
      } else {
        // cancelling fancy
        stateSetter({
          loading: false,
          fancyd: fancyd,
          fancyd_count: fancyd_count,
          fancyStatus: getFancyStatus(fancyd)
        });
      }
    }).fail(function () {
      // cancelling fancy
      stateSetter({
        loading: false,
        fancyd: fancyd,
        fancyd_count: fancyd_count,
        fancyStatus: getFancyStatus(fancyd)
      });
    });
  }
} // workaround for profile heads overflow on animation


var bigContainerStyle = {
  width: '285px'
};
var FancydUsers = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(FancydUsers, _Component);

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(FancydUsers, [{
    key: "_getInitialState",
    value: function _getInitialState() {
      return {
        fancyAnimation: false,
        // button state
        fancyd: null,
        loading: false,
        fancyd_count: null,
        fancyStatus: _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle // fancyStatus = 'Idle', { Idle | Addition | Removal | After- } - Fancy'd status for animation control

      };
    }
  }]);

  function FancydUsers(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, FancydUsers);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2___default()(FancydUsers).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "getFancydCountString", function () {
      var fancyd_count = _this.state.fancyd_count;
      return fancyd_count != null ? (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.getConciseNumberString)(fancyd_count, 0) : '0';
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "animateFancyBG", function (frame) {
      if (frame === undefined) {
        _this.animateFancyBG(0);
      } else if (frame < bgXPosSequence.length) {
        // Special branching due to misposition in background
        var xPos = bgXPosSequence[frame];
        $(_this.fancyBGAnimation).css('background-position-x', "".concat(xPos, "px"));
        setTimeout(function () {
          _this.animateFancyBG(frame + 1);
        }, 10);
      } else if (frame >= bgXPosSequence.length) {
        _this.setState({
          fancyAnimation: false
        });
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "getFancyduserDisplay", function (user, index, totalLength) {
      var _this$props = _this.props,
          viewer = _this$props.appContext.viewer,
          bigContainer = _this$props.bigContainer;
      var _this$state = _this.state,
          fancyd = _this$state.fancyd,
          fancyStatus = _this$state.fancyStatus;
      var first = index === 0;
      var last = index === totalLength - 1;
      var display;

      if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterAddition || fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition) {
        // designer satisfaction 1)
        if (totalLength <= 2) {
          display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.Inline;
        } else {
          if (first) {
            display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.Inline;
          }
        }
      } else if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterRemoval || fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal) {
        if (first) {
          display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None;
        } else if (last) {
          display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.Inline;
        }
      } // designer satisfaction 2) https://app.asana.com/0/86925821949642/161445424426526


      var indexLimit = bigContainer ? 6 : 5;

      if ((fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.AfterAddition || fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition || fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal || fancyd && fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle) && index > indexLimit) {
        display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None;
      }

      if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Idle && !fancyd && isUserEqual(user, viewer)) {
        display = fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None;
      }

      return display;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "toggleFancy", function () {
      toggleFancy(_this.props.thing.id, _this.state, function (ns) {
        _this.setState(ns);
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleFancydStateOnLoadThing", function (thing) {
      if (thing == null) {
        thing = _this.props.thing;
      }

      _handleFancydStateOnLoadThing(thing.id, {
        fancyd: thing.fancyd,
        fancyd_count: thing.fancyd_count
      }, function (ns) {
        _this.setState(ns);
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleFancyClick", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!_this.props.appContext.loggedIn) {
        window.require_login && window.require_login();
        return;
      }

      var thing = _this.props.thing;
      var _this$state2 = _this.state,
          fancyAnimation = _this$state2.fancyAnimation,
          fancyd = _this$state2.fancyd,
          loading = _this$state2.loading;

      if (loading) {
        return;
      }

      if (!fancyd && !fancyAnimation) {
        _this.setState({
          fancyAnimation: true
        }, function (_) {
          _this.animateFancyBG();
        });
      }

      if (!fancyd) {
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)('Fancy', {
          thing_id: thing.id
        });
      } else {
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.MP)('Unfancy', {
          thing_id: thing.id
        });
      }

      _this.toggleFancy();
    });

    _this.state = _this._getInitialState();

    _this.fancyBGAnimationRef = function (element) {
      _this.fancyBGAnimation = element;
    };

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(FancydUsers, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleFancydStateOnLoadThing();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref3) {
      var thing = _ref3.thing;

      // Thing has been updated.
      if (thing.id !== this.props.thing.id || thing.isCrawled !== this.props.thing.isCrawled) {
        this.handleFancydStateOnLoadThing(thing);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          _this$props2$appConte = _this$props2.appContext,
          loggedIn = _this$props2$appConte.loggedIn,
          viewer = _this$props2$appConte.viewer,
          _this$props2$thing = _this$props2.thing,
          fancyd_users = _this$props2$thing.fancyd_users,
          user = _this$props2$thing.user,
          bigContainer = _this$props2.bigContainer;
      var _this$state3 = this.state,
          fancyd = _this$state3.fancyd,
          fancyAnimation = _this$state3.fancyAnimation,
          fancyStatus = _this$state3.fancyStatus;
      var fancydUsers = [loggedIn && viewer, loggedIn && !isUserEqual(viewer, user) && user].concat(fancyd_users && fancyd_users.filter(function (fancydUser) {
        return !isUserEqual(fancydUser, user) && !isUserEqual(fancydUser, viewer);
      })).filter(function (e) {
        return e;
      });
      var fancydUserAnimClass;

      if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Addition) {
        fancydUserAnimClass = "add";
      } else if (fancyStatus === _config__WEBPACK_IMPORTED_MODULE_11__.FancyStatus.Removal) {
        fancydUserAnimClass = "remove";
      } // designer satisfaction 1)
      // If user is less than 2 we need to apply special class.
      // In this way dont owner profile dont get 'consumed': https://app.asana.com/0/86925821949642/173945332708784


      var userCountSufficiency = fancydUsers.length <= 2 ? '_insuff' : '_suff';
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        style: bigContainer && bigContainerStyle,
        className: "fancyd_users-wrap"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "count"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleFancyClick,
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("button button-static fancy _count", {
          fancyd: fancyd,
          loading: fancyAnimation
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        ref: this.fancyBGAnimationRef
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", null)), this.getFancydCountString()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "_fancyd"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("fancyd_user", fancydUserAnimClass, userCountSufficiency)
      }, fancydUsers.map(function (user, index) {
        var isViewer = isUserEqual(user, viewer);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(FancydUser, {
          key: index,
          user: user,
          display: _this2.getFancyduserDisplay(user, index, fancydUsers.length),
          isViewer: isViewer
        });
      })));
    }
  }]);

  return FancydUsers;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

/***/ }),

/***/ "./_static/modules/ui/overlay-article/components/article.js":
/*!******************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/components/article.js ***!
  \******************************************************************/
/*! namespace exports */
/*! export OverlayArticle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.e, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OverlayArticle": () => /* binding */ OverlayArticle,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var date_fns_format__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! date-fns/format */ "./node_modules/date-fns/format/index.js");
/* harmony import */ var date_fns_format__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(date_fns_format__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _container_history__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../container/history */ "./_static/modules/ui/overlay-article/container/history.js");
/* harmony import */ var _ArticleFancydUsers__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ArticleFancydUsers */ "./_static/modules/ui/overlay-article/components/ArticleFancydUsers.js");
/* harmony import */ var _container_entry_events__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../container/entry-events */ "./_static/modules/ui/overlay-article/container/entry-events.js");
/* harmony import */ var _ArticleWidgets__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./ArticleWidgets */ "./_static/modules/ui/overlay-article/components/ArticleWidgets.js");
/* harmony import */ var _Shortcode__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../Shortcode */ "./_static/modules/ui/overlay-article/Shortcode.js");
/* harmony import */ var _Shortcode__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_Shortcode__WEBPACK_IMPORTED_MODULE_18__);





















function mapStateToProps(state) {
  var appContext = state.appContext,
      _state$article = state.article,
      data = _state$article.data,
      isFetching = _state$article.isFetching,
      status = _state$article.status;

  if (data && data.content && window.convertArticleShortcode) {
    data.content = window.convertArticleShortcode(data.content);
  }

  return {
    appContext: appContext,
    status: status,
    article: data,
    isFetching: isFetching
  };
}

var Lightbox = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_8__.lazy)(function () {
  return Promise.all(/*! import() | OverlayArticle */[__webpack_require__.e("vendors"), __webpack_require__.e("OverlayArticle")]).then(__webpack_require__.bind(__webpack_require__, /*! react-images */ "./node_modules/react-images/lib/Lightbox.js"));
}); // Container class for overlayed article detail.

var OverlayArticle = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default()(OverlayArticle, _Component);

  function OverlayArticle() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, OverlayArticle);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(OverlayArticle).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(OverlayArticle, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _container_entry_events__WEBPACK_IMPORTED_MODULE_16__.OaContainer.scrollToTop();
      (0,common_components__WEBPACK_IMPORTED_MODULE_11__.applyProductSlide)(); // fitvids 1.2.0

      !function (t) {
        t.fn.fitVids = function (e) {
          var i = {
            customSelector: null,
            ignore: null
          };

          if (!document.getElementById("fit-vids-style")) {
            var r = document.head || document.getElementsByTagName("head")[0],
                a = ".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",
                d = document.createElement("div");
            d.innerHTML = '<p>x</p><style id="fit-vids-style">' + a + "</style>", r.appendChild(d.childNodes[1]);
          }

          return e && t.extend(i, e), this.each(function () {
            var e = ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', "object", "embed"];
            i.customSelector && e.push(i.customSelector);
            var r = ".fitvidsignore";
            i.ignore && (r = r + ", " + i.ignore);
            var a = t(this).find(e.join(","));
            a = a.not("object object"), a = a.not(r), a.each(function () {
              var e = t(this);

              if (!(e.parents(r).length > 0 || "embed" === this.tagName.toLowerCase() && e.parent("object").length || e.parent(".fluid-width-video-wrapper").length)) {
                e.css("height") || e.css("width") || !isNaN(e.attr("height")) && !isNaN(e.attr("width")) || (e.attr("height", 9), e.attr("width", 16));
                var i = "object" === this.tagName.toLowerCase() || e.attr("height") && !isNaN(parseInt(e.attr("height"), 10)) ? parseInt(e.attr("height"), 10) : e.height(),
                    a = isNaN(parseInt(e.attr("width"), 10)) ? e.width() : parseInt(e.attr("width"), 10),
                    d = i / a;

                if (!e.attr("name")) {
                  var o = "fitvid" + t.fn.fitVids._count;
                  e.attr("name", o), t.fn.fitVids._count++;
                }

                e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * d + "%"), e.removeAttr("height").removeAttr("width");
              }
            });
          });
        }, t.fn.fitVids._count = 0;
      }(window.jQuery || window.Zepto);
      $('.media-youtube').fitVids();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var pt = prevProps.article;
      var ct = this.props.article;

      if (ct != null) {
        if (!pt || pt.id !== ct.id) {
          if (!(0,fancyutils__WEBPACK_IMPORTED_MODULE_12__.isStaticArticlePage)()) {
            $("#overlay-article > .popup").attr("tabindex", -1).focus();
          }

          _container_entry_events__WEBPACK_IMPORTED_MODULE_16__.OaContainer.scrollToTop();
        }

        if (this.props.appContext.viewer.is_admin_senior) {
          $("body").addClass("admin");
        } else {
          $("body").removeClass("admin");
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          article = _this$props.article,
          viewer = _this$props.appContext.viewer;
      var display = null;

      if (_container_history__WEBPACK_IMPORTED_MODULE_14__.historyData.locationIsArticlePage) {
        if (article != null) {
          display = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null, viewer.is_admin_senior && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ArticleWidgets__WEBPACK_IMPORTED_MODULE_17__.AdminHeader, this.props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(Article, this.props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
            className: "container"
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ArticleWidgets__WEBPACK_IMPORTED_MODULE_17__.ThingList, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_2___default()({}, this.props, {
            hasPagination: window.isWhitelabel
          })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ArticleWidgets__WEBPACK_IMPORTED_MODULE_17__.ArticleList, this.props)));
        } else {
          display = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null);
        }
      } else {
        display = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null);
      }

      return display;
    }
  }]);

  return OverlayArticle;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_10__.connect)(mapStateToProps)(OverlayArticle));

var Article = /*#__PURE__*/function (_Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_7___default()(Article, _Component2);

  function Article(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, Article);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(Article).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "state", {
      lightboxImages: [],
      lightboxOpen: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleGalleryClick", function (event) {
      var $this = $(event.target);

      if (window.isWhitelabelV2) {
        if ($this.is(".gallery .paging a")) {
          event.preventDefault();

          var _$gallery = $this.closest(".gallery");

          var _$paging = _$gallery.find(".paging");

          var len = _$gallery.find('.paging a.pager').length;

          var galleryNth = $('.gallery').index($this.closest(".gallery"));
          var indexSelector = ".gallery:eq(".concat(galleryNth, ") .paging a.pager");

          var _idx;

          var incdec = 0;

          if ($this.is(".btn .prev")) {
            _idx = _$gallery.find('.paging a.pager.current').index(indexSelector);
            incdec = -1;
          } else if ($this.is(".btn .next")) {
            _idx = _$gallery.find('.paging a.pager.current').index(indexSelector);
            incdec = +1;
          } else {
            _idx = $this.index(indexSelector);
          }

          _idx += incdec;

          if (_idx < 0) {
            _idx = len - 1;
          } else if (_idx >= len - 1) {
            _idx = 0;
          }

          _$paging.find("a.current").removeClass("current").end().find("a.pager:eq(".concat(_idx, ")")).addClass("current");

          _$gallery.find("li.active").removeClass("active").end().find("li:eq(".concat(_idx, ")")).addClass("active");
        }
      } else {
        if ($this.is(".gallery .paging a, .gallery li *")) {
          if ($this.is(":not(.gallery li a.linked, .gallery li a.linked *)")) {
            event.preventDefault();
          }

          if ($this.is(".gallery li *")) {
            $this = $this.closest("li");
          }

          var $gallery = $this.closest(".gallery");
          var $paging = $gallery.find(".paging");
          var idx = $this.index();
          $paging.find("a.current").removeClass("current").end().find("a:eq(" + idx + ")").addClass("current");
          $gallery.find("li.active").removeClass("active").end().find("li:eq(" + idx + ")").addClass("active");
          var left = 0;

          if (idx == 0) {
            left = 0;
          } else if (idx == $gallery.find("li").length - 1) {
            left = $gallery.width() - $gallery.find(".photo-list").width();
          } else {
            left = ($gallery.width() - $gallery.find("li:eq(" + idx + ")").width()) / 2 - $gallery.find("li:eq(" + idx + ")").position().left;
          }

          $gallery.find(".photo-list").css("left", left + "px");
        }
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "prepareProductSlide", function (event, $this) {
      var $slide = $this.closest('.product');

      if ($slide.data('slideInit')) {
        event.preventDefault();
      } else {
        $slide.productSlide({
          itemPerSlide: 4,
          center: true
        });
        setTimeout(function () {
          $this.click();
        }, 500);
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleContentClick", function (event) {
      var $this = $(event.target);

      if ($this.is(".gallery *")) {
        _this.handleGalleryClick(event);
      } else if ($this.is(".description .grid")) {
        _this.prepareLightboxOpen();
      } else if ($this.is('.itemSlide .prev, .itemSlide .next')) {
        _this.prepareProductSlide(event, $this);
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleClickPrev", function () {
      _this.setState({
        lightboxCurrentImage: Math.max(_this.state.lightboxCurrentImage - 1, 0)
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleClickNext", function () {
      _this.setState({
        lightboxCurrentImage: Math.min(_this.state.lightboxCurrentImage + 1, _this.state.lightboxImages.length - 1)
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleClose", function () {
      _this.setState({
        lightboxOpen: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleClickThumbnail", function (idx) {
      _this.setState({
        lightboxCurrentImage: idx
      });
    });

    if ($("#article-fonts").length === 0) {
      $(document.head).append('<link rel="stylesheet" id="article-fonts" href="//fonts.googleapis.com/css?family=Merriweather:300,300i,400,400i,700,700i,900,900i|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i|Merriweather+Sans:300,300i,400,400i,700,700i,800,800i" type="text/css" />');

      if ($("body").is(".static-article")) {
        $("#container-wrapper #scroll-to-top").hide();
      }
    }

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(Article, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Initial loading
      (0,_ArticleWidgets__WEBPACK_IMPORTED_MODULE_17__.initGallery)(react_dom__WEBPACK_IMPORTED_MODULE_9__.findDOMNode(this));

      if (window.isWhitelabelV2) {
        setTimeout(function () {
          $('.itemSlide.product').productSlide({
            itemPerSlide: 4,
            center: true
          });
        }, 2500);
      }
    }
  }, {
    key: "prepareLightboxOpen",
    // lightbox stuff
    value: function prepareLightboxOpen() {
      this.setState({
        lightboxOpen: true,
        lightboxCurrentImage: 0,
        lightboxImages: $('.grid img').toArray().map(function (e) {
          return {
            src: $(e).data('src')
          };
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          _this$props2$appConte = _this$props2.appContext,
          lastFullyRenderedArticleID = _this$props2$appConte.lastFullyRenderedArticleID,
          viewer = _this$props2$appConte.viewer,
          loggedIn = _this$props2$appConte.loggedIn,
          article = _this$props2.article;
      var video;
      var coverImgUrl = '';

      if (article.cover_image) {
        coverImgUrl = article.cover_image.url;
      }

      if (common_components__WEBPACK_IMPORTED_MODULE_11__.Video.isVideoAvailableForArticle(article)) {
        var videoProps = {
          object: article,
          display: true,
          autoplay: article.cover_video.autoplay || false,
          lastFullyRenderedObjectID: lastFullyRenderedArticleID
        };

        if (coverImgUrl) {
          videoProps.poster = coverImgUrl;
        }

        video = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(common_components__WEBPACK_IMPORTED_MODULE_11__.Video, videoProps);
      }

      var coverImage = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "inner-wrapper"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        id: "coverImage",
        className: "cover image purple"
      }, video, !video && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "image"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("img", {
        id: "coverImg",
        src: coverImgUrl
      }))));
      var author = article.options && article.options.authors && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "author",
        dangerouslySetInnerHTML: {
          __html: article.options.authors
        }
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        id: "summary",
        className: "wrapper article-wrapper"
      }, !window.isWhitelabelV2 && coverImage, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "info"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("h1", {
        className: "title"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("b", null, article.title), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("small", null, article.tagline)), window.isWhitelabelV2 && author, window.isWhitelabelV2 && article.date_created && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "date text-placeholder"
      }, date_fns_format__WEBPACK_IMPORTED_MODULE_13___default()(article.date_created || new Date(), 'MMMM DD, YYYY')), window.isWhitelabel ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ArticleFancydUsers__WEBPACK_IMPORTED_MODULE_15__.FancydUsers, this.props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "interaction"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(common_components__WEBPACK_IMPORTED_MODULE_11__.MoreShare, {
        objectType: "article",
        objectId: article.id,
        loggedIn: loggedIn,
        title: article.title,
        viewerUsername: viewer.username,
        showShortcuts: true,
        fromThingSidebar: true
      }), article.options && article.options.action_button && _.isString(article.options.action_button.text) && article.options.action_button.text.trim() && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
        href: "".concat(article.options.action_button.link),
        className: "btn-shop"
      }, article.options.action_button.text), window.isWhitelabel ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_ArticleFancydUsers__WEBPACK_IMPORTED_MODULE_15__.FancydUsers, this.props) : null)), window.isWhitelabelV2 && coverImage, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "description more"
      }, !window.isWhitelabelV2 && author, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: article.content
        },
        onClick: this.handleContentClick
      })), window.isWhitelabelV2 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(react__WEBPACK_IMPORTED_MODULE_8__.Suspense, {
        fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(Lightbox, {
        fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null),
        images: this.state.lightboxImages,
        isOpen: this.state.lightboxOpen,
        preventScroll: true,
        showThumbnails: true,
        currentImage: this.state.lightboxCurrentImage,
        onClickPrev: this.handleClickPrev,
        onClickNext: this.handleClickNext,
        onClose: this.handleClose,
        onClickThumbnail: this.handleClickThumbnail
      })));
    }
  }]);

  return Article;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

/***/ }),

/***/ "./_static/modules/ui/overlay-article/components/map.js":
/*!**************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/components/map.js ***!
  \**************************************************************/
/*! namespace exports */
/*! export formatPrice [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getDescription [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSafeNameProp [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getThingName [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDescription": () => /* binding */ getDescription,
/* harmony export */   "formatPrice": () => /* binding */ formatPrice,
/* harmony export */   "getSafeNameProp": () => /* binding */ getSafeNameProp,
/* harmony export */   "getThingName": () => /* binding */ getThingName
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");

function getDescription(article) {
  return article.description;
}
function formatPrice(amount) {
  var newPrice = amount.toFixed(2) + '';
  var regex = /(\d)(\d{3})([,\.]|$)/;

  while (regex.test(newPrice)) {
    newPrice = newPrice.replace(regex, '$1,$2$3');
  }

  if (window.numberType === 2) {
    newPrice = newPrice.replace(/,/g, ' ').replace(/\./g, ',');
  }

  return newPrice;
}
function getSafeNameProp(_ref) {
  var emojified_name = _ref.emojified_name,
      name = _ref.name;

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

function salesAvailable(thing) {
  if (!(0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(thing.sales)) {
    return thing.sales_available;
  }

  return false;
}

function getThingName(thing) {
  if (thing.type === 'giftcard') {
    return gettext('Fancy Gift Card');
  } else if (salesAvailable(thing)) {
    return thing.sales.name;
  } else {
    return thing.name;
  }
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/config.js":
/*!******************************************************!*\
  !*** ./_static/modules/ui/overlay-article/config.js ***!
  \******************************************************/
/*! namespace exports */
/*! export FancyStatus [provided] [no usage info] [missing usage info prevents renaming] */
/*! export Selectors [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FancyStatus": () => /* binding */ FancyStatus,
/* harmony export */   "Selectors": () => /* binding */ Selectors
/* harmony export */ });
var FancyStatus = {
  Addition: 'Addition',
  Removal: 'Removal',
  AfterAddition: 'AfterAddition',
  AfterRemoval: 'AfterRemoval',
  Idle: 'Idle'
};
var commonWrapperSelector = '#sidebar .wrapper.article';
var Selectors = {
  HomepageWrapper: commonWrapperSelector
};

/***/ }),

/***/ "./_static/modules/ui/overlay-article/container/app.js":
/*!*************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/container/app.js ***!
  \*************************************************************/
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
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../action/action-helpers */ "./_static/modules/ui/overlay-article/action/action-helpers.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../store/store */ "./_static/modules/ui/overlay-article/store/store.js");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./history */ "./_static/modules/ui/overlay-article/container/history.js");










var App = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(App, _Component);

  function App() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, App);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(App).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(App, [{
    key: "handleCloseArticle",
    value: function handleCloseArticle(event) {
      event.preventDefault();
      event.stopPropagation();
      _store_store__WEBPACK_IMPORTED_MODULE_7__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_6__.closeOverlay)());
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "popup article ".concat(window.isWhitelabel ? 'whitelabel-article' : '', " ").concat(window.isWhitelabelV2 ? 'whitelabel-article-v2' : ''),
        id: "article-container"
      }, this.props.children, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("a", {
        href: "#",
        className: "ly-close",
        onClick: this.handleCloseArticle
      }, "Close"));
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_5__.Component);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),

/***/ "./_static/modules/ui/overlay-article/container/entry-events.js":
/*!**********************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/container/entry-events.js ***!
  \**********************************************************************/
/*! namespace exports */
/*! export OaContainer [provided] [no usage info] [missing usage info prevents renaming] */
/*! export attachEntryEvents [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attachEntryEvents": () => /* binding */ attachEntryEvents,
/* harmony export */   "OaContainer": () => /* binding */ OaContainer
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/store */ "./_static/modules/ui/overlay-article/store/store.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ "./_static/modules/ui/overlay-article/config.js");
/* harmony import */ var _routeutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./routeutils */ "./_static/modules/ui/overlay-article/container/routeutils.js");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../action/action-helpers */ "./_static/modules/ui/overlay-article/action/action-helpers.js");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./history */ "./_static/modules/ui/overlay-article/container/history.js");







function handleOverlayArticleKeyEvents(event) {
  if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") {
    return;
  }

  switch (event.which) {
    case fancyutils__WEBPACK_IMPORTED_MODULE_0__.KEYS.ESC:
      // If popup is not on
      if ($("#popup_container:visible").length === 0) {
        _store_store__WEBPACK_IMPORTED_MODULE_1__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_4__.closeOverlay)());
      }

      break;
  }
}

function conditionalTransition(aElement) {
  // Turn off video
  $("#container-wrapper .btn-pause").attr("scroll", true).click(); // Ensure anchor is static (sticked to homepage timeline) or not.

  if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isHomepage)() && $(_config__WEBPACK_IMPORTED_MODULE_2__.Selectors.HomepageWrapper).has(aElement)) {
    (0,_routeutils__WEBPACK_IMPORTED_MODULE_3__.transition)(aElement.getAttribute("href"), _routeutils__WEBPACK_IMPORTED_MODULE_3__.LinkTypes.Static);
  } else {
    (0,_routeutils__WEBPACK_IMPORTED_MODULE_3__.transition)(aElement.getAttribute("href"));
  }
}

var oneshotEventAttached = false;
function attachEntryEvents() {
  if (oneshotEventAttached) {
    return;
  }

  oneshotEventAttached = true; // Remove pre-existing url event and start transition first

  $(document.body).off("click.overlayArticleInit");

  if (window.__INIT_ARTICLE_ANCHOR != null) {
    conditionalTransition(window.__INIT_ARTICLE_ANCHOR);
    delete window.__INIT_ARTICLE_ANCHOR;
  } // TODO: replace to class-based event binding


  $(document.body).on("click", "a", function (event) {
    if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isPlainLeftClick)(event) && this.getAttribute("data-prevent-overlay") == null && (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getObjectTypeFromUrl)((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getPathname)(this)) === "Article") {
      event.preventDefault(); // note: key event will be detached inside `closeOverlay()` call

      $(document).on("keydown.overlayArticle", handleOverlayArticleKeyEvents);
      conditionalTransition(this);
    }
  });
  $("#overlay-article").on("click", function (event) {
    var $targ = $(event.target);

    if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.didClickOn)($targ, "#article-container") || _history__WEBPACK_IMPORTED_MODULE_5__.historyData.initialPageIsArticlePage) {//pass
    } else {
      _store_store__WEBPACK_IMPORTED_MODULE_1__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_4__.closeOverlay)());
    }
  });
}
var OaContainer = {
  isStatic: function isStatic() {
    return $(document.body).is(".static-article");
  },
  getDynamic: function getDynamic() {
    return $("#article-container");
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
      this.getDynamic().scrollTop(0);
    }
  }
};

/***/ }),

/***/ "./_static/modules/ui/overlay-article/container/history.js":
/*!*****************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/container/history.js ***!
  \*****************************************************************/
/*! namespace exports */
/*! export historyData [provided] [no usage info] [missing usage info prevents renaming] */
/*! export historyHook [provided] [no usage info] [missing usage info prevents renaming] */
/*! export runOverlay [provided] [no usage info] [missing usage info prevents renaming] */
/*! export stopOverlay [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "historyData": () => /* binding */ historyData,
/* harmony export */   "runOverlay": () => /* binding */ runOverlay,
/* harmony export */   "stopOverlay": () => /* binding */ stopOverlay,
/* harmony export */   "historyHook": () => /* binding */ historyHook
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/store */ "./_static/modules/ui/overlay-article/store/store.js");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../action/action-helpers */ "./_static/modules/ui/overlay-article/action/action-helpers.js");
/* harmony import */ var _action_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../action/actions */ "./_static/modules/ui/overlay-article/action/actions.js");





var initialArticlePageID = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromArticleURL)(location.pathname).id;
var initialPageIsArticlePage = initialArticlePageID != null; // This stores initial static page history info that needs to be restored when modal get closed.

var historyData = {
  initialPath: location.pathname,

  /* mut */
  preservedHref: location.href,
  // Preserved Href just before open, and to be returned when closed.
  initialArticlePageID: initialArticlePageID,
  initialPageIsArticlePage: initialPageIsArticlePage,
  initialTitle: document.title,
  // This prop indicates current location is (static) article page. Mutable.
  locationIsArticlePage: initialPageIsArticlePage,
  overlayIsOn: false
};
function runOverlay(articleID, articleURLType) {
  var killCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var queryString = arguments.length > 3 ? arguments[3] : undefined;

  if (!$(document.body).hasClass('error-page')) {
    // Context needs to be isolated from hook: https://github.com/rackt/redux-router/issues/157
    requestIdleCallback(function () {
      $(document.body).addClass('article-overlay-on');
      _store_store__WEBPACK_IMPORTED_MODULE_2__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_3__.fetchArticle)(articleID, articleURLType, killCache, queryString));
      historyData.overlayIsOn = true;
    });
  }
}
function stopOverlay() {
  historyData.overlayIsOn = false;
  _store_store__WEBPACK_IMPORTED_MODULE_2__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_3__.closeOverlay)());
}
function historyHook(_ref) {
  var pathname = _ref.pathname,
      search = _ref.search;
  var meta = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromArticleURL)(pathname);
  var articleID = meta && meta.id; // When initially (statically) renderred page is article page
  // Moving to new article page

  historyData.locationIsArticlePage = articleID != null;

  if (historyData.locationIsArticlePage) {
    runOverlay(articleID, meta.type, false, search);
  } else if (historyData.overlayIsOn) {
    stopOverlay();
  }
}
common_components__WEBPACK_IMPORTED_MODULE_1__.history.listen(historyHook);

/***/ }),

/***/ "./_static/modules/ui/overlay-article/container/routeutils.js":
/*!********************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/container/routeutils.js ***!
  \********************************************************************/
/*! namespace exports */
/*! export LinkTypes [provided] [no usage info] [missing usage info prevents renaming] */
/*! export closeModal [provided] [no usage info] [missing usage info prevents renaming] */
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
/* harmony export */   "redirect": () => /* binding */ redirect
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./history */ "./_static/modules/ui/overlay-article/container/history.js");



var LinkTypes = {
  Dynamic: 0,
  Static: 1,
  Timeline: 2,
  Internal: 3 // no update needed

}; // `staticLink`: transition from statically attached links

function transition(href) {
  // ID-only
  if (!_.isNaN(Number(href))) {
    href = "/articles/".concat(href);
  }

  if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getObjectTypeFromUrl)(href) === 'Article') {
    var meta = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromArticleURL)(href); // Update URL to go back when overlay is closed

    if (!_history__WEBPACK_IMPORTED_MODULE_2__.historyData.overlayIsOn) {
      _history__WEBPACK_IMPORTED_MODULE_2__.historyData.preservedHref = location.href;
    }

    common_components__WEBPACK_IMPORTED_MODULE_1__.history.push((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.stripPathname)(meta.href), null);
  } else {
    redirect(href);
  }
}
function closeModal() {
  if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isStaticPage)()) {
    return;
  }

  $(document.body).removeClass('article-overlay-on');
}
function redirect(destination) {
  if (destination == null) {
    return false;
  } else {
    location.href = destination;
    return true;
  }
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/index.js":
/*!*****************************************************!*\
  !*** ./_static/modules/ui/overlay-article/index.js ***!
  \*****************************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/Router.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/Switch.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/Route.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _container_app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./container/app */ "./_static/modules/ui/overlay-article/container/app.js");
/* harmony import */ var _container_entry_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./container/entry-events */ "./_static/modules/ui/overlay-article/container/entry-events.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./store/store */ "./_static/modules/ui/overlay-article/store/store.js");
/* harmony import */ var _components_article__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/article */ "./_static/modules/ui/overlay-article/components/article.js");
/* harmony import */ var _container_history__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./container/history */ "./_static/modules/ui/overlay-article/container/history.js");
// This is entrypoint, which `React.render` takes place after DOM is ready.












var onLoad = function onLoad() {
  __webpack_require__(/*! ./shared */ "./_static/modules/ui/overlay-article/shared.js");

  var thingRegex = /\/(sales|things)\/(\d+)/;
  var articleRegex = /\/articles\/(.+)/;
  var initialHref = location.href;
  $(window).on("popstate.overlay", function (event) {
    if (location.href !== initialHref && !(location.pathname.match(thingRegex) || location.pathname.match(articleRegex))) {
      event.preventDefault();
      location.reload();
    }
  });
  var overlayArticleContainer = (0,fancyutils__WEBPACK_IMPORTED_MODULE_3__.selectOrCreate)("#overlay-article");
  var $overlayArticleContainer = $(overlayArticleContainer);

  if ($overlayArticleContainer.hasClass('seo')) {
    $overlayArticleContainer.empty();
    $overlayArticleContainer.removeClass('seo');
  }

  (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.render)( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Provider, {
    store: _store_store__WEBPACK_IMPORTED_MODULE_7__.default
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_10__.default, {
    history: common_components__WEBPACK_IMPORTED_MODULE_4__.history
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_container_app__WEBPACK_IMPORTED_MODULE_5__.default, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.default, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.default, {
    path: "/articles/*",
    component: _components_article__WEBPACK_IMPORTED_MODULE_8__.default
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.default, {
    path: "*",
    component: function component() {
      return null;
    }
  }))))), overlayArticleContainer, function () {
    common_components__WEBPACK_IMPORTED_MODULE_4__.history.listen(_container_history__WEBPACK_IMPORTED_MODULE_9__.historyHook);
    (0,_container_history__WEBPACK_IMPORTED_MODULE_9__.historyHook)({
      pathname: location.pathname,
      search: location.search
    }); // should init once

    (0,_container_entry_events__WEBPACK_IMPORTED_MODULE_6__.attachEntryEvents)();
  });
};

if (document.readyState !== "loading") {
  onLoad();
} else {
  document.addEventListener("DOMContentLoaded", onLoad);
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/reducers.js":
/*!********************************************************!*\
  !*** ./_static/modules/ui/overlay-article/reducers.js ***!
  \********************************************************/
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
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _action_action_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action/action-constants */ "./_static/modules/ui/overlay-article/action/action-constants.js");
/* harmony import */ var _store_initial_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/initial-store */ "./_static/modules/ui/overlay-article/store/initial-store.js");
/* harmony import */ var _appstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./appstate */ "./_static/modules/ui/overlay-article/appstate.js");






var isLoggedIn = function isLoggedIn(viewer) {
  return !(0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(viewer) && viewer.id != null;
};

var loaded = false;
var lastFullyRenderedArticleID = 0;

function appContext() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_3__.getInitialStoreState)('appContext');
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.OPEN_ARTICLE:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.updateShallow)(state, {
        visible: true
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.CLOSE_ARTICLE:
      lastFullyRenderedArticleID = 0;
      loaded = false;
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.updateShallow)(state, {
        visible: false,
        lastFullyRenderedArticleID: lastFullyRenderedArticleID
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.UPDATE_APP_CONTEXT:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.updateShallow)(state, action.context);

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.LOAD_ARTICLE:
      {
        // Due to multi-stage rendering (cache -> from-server-data -> ...) 
        // it is unable to check state change correctly just by comparing ID;
        // Therefore, we set internal state per every update cycle and check 
        // if state is fully updated.
        // FIXME: when cached response exist, it marks as rendered before
        if (loaded === true && lastFullyRenderedArticleID !== action.data.id) {
          lastFullyRenderedArticleID = action.data.id;
        }

        var viewer = action.data.viewer || window.viewer || {};
        var loggedIn = isLoggedIn(viewer);
        var userCountry = action.data.current_country_code || state.userCountry;
        (0,_appstate__WEBPACK_IMPORTED_MODULE_2__.updateState)('loggedIn', loggedIn);
        (0,_appstate__WEBPACK_IMPORTED_MODULE_2__.updateState)('viewer', viewer);
        loaded = true;
        return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.update)(state, {
          lastFullyRenderedArticleID: lastFullyRenderedArticleID,
          loggedIn: loggedIn,
          viewer: viewer,
          userCountry: userCountry
        });
      }

    default:
      return state;
  }
}

function populateArticleContext(articleData) {
  articleData.loading = articleData.fromServer !== true;
  articleData.URLMeta = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.extractMetaFromURL)(location.href); // FIXME: provide current pathname

  articleData.owner = articleData.user;
} // Article context


function article() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_store_initial_store__WEBPACK_IMPORTED_MODULE_3__.getInitialStoreState)('article');
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.LOAD_ARTICLE:
      populateArticleContext(action.data);
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.updateShallow)(state, {
        data: action.data,
        status: action.status,
        ID: action.ID,
        pendingID: null,
        isFetching: false
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.REQUEST_ARTICLE:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.update)(state, {
        pendingID: action.pendingID,
        status: action.status,
        isFetching: true
      });

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.REQUEST_ARTICLE_FAILURE:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.update)(state, {
        status: action.status,
        isFetching: false
      });
    // Reset state

    case _action_action_constants__WEBPACK_IMPORTED_MODULE_1__.default.CLOSE_ARTICLE:
      return (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.updateShallow)((0,_store_initial_store__WEBPACK_IMPORTED_MODULE_3__.getInitialStoreState)('article'));

    default:
      return state;
  }
}

var rootReducer = (0,redux__WEBPACK_IMPORTED_MODULE_4__.combineReducers)({
  appContext: appContext,
  article: article
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rootReducer);

/***/ }),

/***/ "./_static/modules/ui/overlay-article/shared.js":
/*!******************************************************!*\
  !*** ./_static/modules/ui/overlay-article/shared.js ***!
  \******************************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/store */ "./_static/modules/ui/overlay-article/store/store.js");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cache */ "./_static/modules/ui/overlay-article/cache.js");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./container/routeutils */ "./_static/modules/ui/overlay-article/container/routeutils.js");



 // import { reloadCurrentArticle } from './container/history';

(0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getFancyDepsRoot)().Shared = {
  getStore: function getStore() {
    return _store_store__WEBPACK_IMPORTED_MODULE_1__.default.getState();
  },
  cache: _cache__WEBPACK_IMPORTED_MODULE_2__.cache,
  transition: _container_routeutils__WEBPACK_IMPORTED_MODULE_3__.transition // reloadCurrentArticle,

};

/***/ }),

/***/ "./_static/modules/ui/overlay-article/store/configure-store.js":
/*!*********************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/store/configure-store.js ***!
  \*********************************************************************/
/*! namespace exports */
/*! export configureStore [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "configureStore": () => /* binding */ configureStore
/* harmony export */ });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux-thunk */ "./node_modules/redux-thunk/es/index.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./_static/modules/ui/overlay-article/reducers.js");



var middleware = [redux_thunk__WEBPACK_IMPORTED_MODULE_0__.default];
var configureStore = function configureStore(initialState) {
  return (0,redux__WEBPACK_IMPORTED_MODULE_2__.createStore)(_reducers__WEBPACK_IMPORTED_MODULE_1__.default, initialState, redux__WEBPACK_IMPORTED_MODULE_2__.applyMiddleware.apply(void 0, middleware));
};

/***/ }),

/***/ "./_static/modules/ui/overlay-article/store/initial-store.js":
/*!*******************************************************************!*\
  !*** ./_static/modules/ui/overlay-article/store/initial-store.js ***!
  \*******************************************************************/
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
        userCountry: 'US'
      };

    case 'article':
      return {
        data: null,
        ID: null,
        pendingID: null,
        isFetching: null,
        status: 'idle' // { idle | request | failed }

      };

    default:
      console.warn('`getInitialStoreState()`: Unknown context name ', contextName);
  }
}
;
var contexts = ['article', 'appContext'];
function getAllInitialStoreState() {
  return contexts.reduce(function (state, contextKey) {
    state[contextKey] = getInitialStoreState(contextKey);
    return state;
  }, {});
}

/***/ }),

/***/ "./_static/modules/ui/overlay-article/store/store.js":
/*!***********************************************************!*\
  !*** ./_static/modules/ui/overlay-article/store/store.js ***!
  \***********************************************************/
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
/* harmony import */ var _configure_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./configure-store */ "./_static/modules/ui/overlay-article/store/configure-store.js");
/* harmony import */ var _initial_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./initial-store */ "./_static/modules/ui/overlay-article/store/initial-store.js");


var store = (0,_configure_store__WEBPACK_IMPORTED_MODULE_0__.configureStore)((0,_initial_store__WEBPACK_IMPORTED_MODULE_1__.getAllInitialStoreState)());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (store);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/map.cart.ts":
/*!*****************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/map.cart.ts ***!
  \*****************************************************************/
/*! namespace exports */
/*! export addItemToCart [provided] [no usage info] [missing usage info prevents renaming] */
/*! export logAddCartMixpanel [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "logAddCartMixpanel": () => /* binding */ logAddCartMixpanel,
/* harmony export */   "addItemToCart": () => /* binding */ addItemToCart
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");

var _window = window,
    Fancy = _window.Fancy,
    track_event = _window.track_event,
    dataLayer = _window.dataLayer,
    from_sds_page = _window.from_sds_page,
    TrackingEvents = _window.TrackingEvents;
function logAddCartMixpanel(_ref) {
  var salesID = _ref.salesID,
      saleOptionID = _ref.saleOptionID,
      utm = _ref.utm,
      section = _ref.section,
      via = _ref.via;

  if (salesID == null) {
    return;
  }

  if (utm == null) {
    var currentLocationArgPair = (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getLocationArgPairs)('utm');

    if (currentLocationArgPair) {
      utm = currentLocationArgPair[1];
    }
  }

  var log = {
    'sale id': salesID,
    via: via || 'thing page',
    utm: utm
  };

  if (section) {
    log.section = section;
  }

  if (saleOptionID && salesID !== saleOptionID) {
    log['option id'] = saleOptionID;
  }

  try {
    window.track_event && track_event('Add to Cart', log);
  } catch (e) {}

  return log;
}
function addItemToCart(param, callback, meta) {
  // should be replaced by Fancy.CartAPI.addItem
  param.from_sds_page = from_sds_page;

  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'Add_to_Cart_Button',
      product_id: param['sale_item_id'],
      option_id: param['option_id'],
      products: undefined,
      products_info: undefined,
      revenue: undefined
    });
  }

  return $.ajax({
    type: 'POST',
    url: '/add_item_to_cart.json',
    data: param
  }).done(function (json) {
    if (!json || json.status_code == null) {
      return;
    }

    if (json.status_code === 1) {
      if (meta) {
        TrackingEvents.addToCart([{
          id: param.sale_item_id,
          brand: meta.brand_name,
          name: meta.title,
          quantity: param.quantity,
          price: meta.price,
          variant: json.option
        }]); // avoid NaN
      }

      var args = {
        'THING_ID': param.thing_id,
        'ITEMCODE': json.itemcode,
        'THUMBNAIL_IMAGE_URL': json.image_url,
        'ITEMNAME': json.itemname,
        'QUANTITY': json.quantity,
        'PRICE': json.price,
        'OPTIONS': json.option,
        'HTML_URL': json.html_url,
        'CART_ID': json.cart_id
      };

      if (json.fancy_price) {
        args.FANCY_PRICE = json.fancy_price;
      }

      Fancy.Cart.addItem(args);
      Fancy.Cart.openPopup();
    } else if (json.status_code == 0) {
      if (json.message) {
        alert(json.message);
      }
    }
  }).always(function () {
    callback && callback();
  });
}

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
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
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
/******/ 			return "" + chunkId + "." + "1b89fb23510b2bc8bd58" + ".js";
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
/******/ 			"OverlayArticle.main": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./_static/modules/ui/overlay-article/index.js","vendors","libfancy"]
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
//# sourceMappingURL=OverlayArticle.main.ebe9e4c945243db16348.js.map