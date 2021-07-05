/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./_static/modules/ui/overlay-thing/Shared.js":
/*!****************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/Shared.js ***!
  \****************************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/store */ "./_static/modules/ui/overlay-thing/store/store.ts");
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cache */ "./_static/modules/ui/overlay-thing/cache.js");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./container/routeutils */ "./_static/modules/ui/overlay-thing/container/routeutils.js");
/* harmony import */ var _container_history__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./container/history */ "./_static/modules/ui/overlay-thing/container/history.js");





(0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.getFancyDepsRoot)().Shared = {
  getStore: function getStore() {
    return _store_store__WEBPACK_IMPORTED_MODULE_1__.default.getState();
  },
  cache: _cache__WEBPACK_IMPORTED_MODULE_2__.cache,
  pagingContext: _container_routeutils__WEBPACK_IMPORTED_MODULE_3__.pagingContext,
  transition: _container_routeutils__WEBPACK_IMPORTED_MODULE_3__.transition,
  reloadCurrentThing: _container_history__WEBPACK_IMPORTED_MODULE_4__.reloadCurrentThing
};

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/MerchantInfo.tsx":
/*!*************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/MerchantInfo.tsx ***!
  \*************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! swiper/react */ "./node_modules/swiper/esm/react/swiper.js");
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! swiper/react */ "./node_modules/swiper/esm/react/swiper-slide.js");
/* harmony import */ var _ThingCard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ThingCard */ "./_static/modules/ui/overlay-thing/components/v2/ThingCard.tsx");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");








var MerchantInfo = function MerchantInfo() {
  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_5__.useFancy)(),
      thing = _useFancy.thing,
      seller = _useFancy.thing.sales.seller;

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState, 2),
      showMore = _useState2[0],
      setShowMore = _useState2[1];

  var descEl = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    setShowMore(descEl.current ? descEl.current.clientHeight <= 80 : false);
  }, [thing.id]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
    className: "merchant-info"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("h2", {
    className: "stit"
  }, "More about ", seller.brand_name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_3___default()("description", {
      collapsed: !showMore
    })
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: seller.description
    },
    ref: descEl
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("a", {
    className: "more",
    style: {
      display: showMore ? "none" : undefined
    },
    onClick: function onClick() {
      return setShowMore(true);
    }
  }, "Read more"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("a", {
    className: "btns-blue-embo",
    href: seller.shop_url
  }, "Explore more"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_6__.Swiper, {
    className: "swiper-no-swiping"
  }, seller.sale_items.map(function (item, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_7__.SwiperSlide, {
      key: i,
      tag: "li"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ThingCard__WEBPACK_IMPORTED_MODULE_4__.default, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, item, {
      brand_name: seller.brand_name
    })));
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MerchantInfo);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Recommendation.tsx":
/*!***************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Recommendation.tsx ***!
  \***************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! swiper/react */ "./node_modules/swiper/esm/react/swiper.js");
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! swiper/react */ "./node_modules/swiper/esm/react/swiper-slide.js");
/* harmony import */ var _ThingCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThingCard */ "./_static/modules/ui/overlay-thing/components/v2/ThingCard.tsx");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");






var Recommendation = function Recommendation() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Likeable, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(RecentlyViewed, null));
};

var convertThingsV1 = function convertThingsV1(things) {
  return things.map(function (_ref) {
    var html_url = _ref.url,
        image_url = _ref.thumb_image_url_558,
        sales = _ref.sales,
        name = _ref.name;
    return {
      html_url: html_url,
      image_url: image_url,
      max_price: sales ? sales[0].max_price : 0,
      min_price: sales ? sales[0].min_price : 0,
      brand_name: sales ? sales[0].seller.brand_name : '',
      title: sales ? sales[0].title : name
    };
  });
};

var Likeable = function Likeable() {
  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_3__.useFancy)(),
      recommended = _useFancy.thing.recommended;

  return recommended?.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "recommend similar"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("h2", {
    className: "stit"
  }, "You May Also Like")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_4__.Swiper, {
    className: "recommend similar swiper-no-swiping",
    slidesPerColumn: 5
  }, recommended?.map(function (thing, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_5__.SwiperSlide, {
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ThingCard__WEBPACK_IMPORTED_MODULE_2__.default, thing));
  }))) : null;
};

var RecentlyViewed = function RecentlyViewed() {
  var _useFancy2 = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_3__.useFancy)(),
      thing = _useFancy2.thing;

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
      things = _useState2[0],
      setThings = _useState2[1]; // const [offset, setOffset] = useState(4);


  var offset = 4;
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    $.ajax({
      type: "get",
      url: "/recently_viewed_things_json?include_sale_item_option=True&rapi_compl=True&count=4&thing_id=".concat(thing.id)
    }).then(function (response) {
      var recently = convertThingsV1(response);
      setThings(recently);
    });
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "recommend recently"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("h2", {
    className: "stit"
  }, "Recently Viewed")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_4__.Swiper, {
    className: "recommend recently swiper-no-swiping",
    slidesPerColumn: 4
  }, things ? things.filter(function (_, i) {
    if (offset > 4) {
      return i >= offset - 4 && i < offset;
    }

    return i < offset;
  }).map(function (thing, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_5__.SwiperSlide, {
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ThingCard__WEBPACK_IMPORTED_MODULE_2__.default, thing));
  }) : null));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Recommendation);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Reviews.tsx":
/*!********************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Reviews.tsx ***!
  \********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectSpread */ "./node_modules/@babel/runtime/helpers/objectSpread.js");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/esm/components/core/core-class.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! swiper */ "./node_modules/swiper/esm/components/thumbs/thumbs.js");
/* harmony import */ var react_image_lightbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-image-lightbox */ "./node_modules/react-image-lightbox/dist/index.es.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");








swiper__WEBPACK_IMPORTED_MODULE_7__.default.use([swiper__WEBPACK_IMPORTED_MODULE_8__.default]);

function useDefaultReviews(_ref) {
  var page = _ref.page,
      per_page = _ref.per_page,
      q = _ref.q,
      sort = _ref.sort,
      setLoading = _ref.setLoading;

  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_6__.useFancy)(),
      thing = _useFancy.thing;

  var sid = thing.sales.id;
  var skip = !sort && !per_page && (!page || page === 1) && !q;
  var reviews = useReviews({
    skip: skip,
    sid: sid,
    page: page,
    per_page: per_page,
    q: q,
    sort: sort,
    setLoading: setLoading
  });

  if (skip) {
    return thing.reviews;
  } else {
    return reviews;
  }
}

function useReviews(_ref2) {
  var _ref2$skip = _ref2.skip,
      skip = _ref2$skip === void 0 ? false : _ref2$skip,
      sid = _ref2.sid,
      page = _ref2.page,
      per_page = _ref2.per_page,
      q = _ref2.q,
      sort = _ref2.sort,
      setLoading = _ref2.setLoading;

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState, 2),
      reviews = _useState2[0],
      setReviews = _useState2[1];

  var param = $.extend({}, {
    q: q,
    page: page,
    per_page: per_page,
    sort: sort
  });
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
    if (skip) {
      return;
    }

    setLoading?.(true);
    $.get("/rest-api/v2/reviews/saleitem/".concat(sid), param).then(function (res) {
      setReviews(res);
    }).always(function () {
      setLoading?.(false);
    });
  }, [skip, sid, q, page, per_page, sort]);
  return reviews;
}

var Reviews = function Reviews() {
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false),
      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)({
    page: undefined,
    per_page: undefined,
    q: undefined,
    sort: undefined
  }),
      _useState6 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState5, 2),
      reviewOption = _useState6[0],
      _setReviewOption = _useState6[1];

  var reviews = useDefaultReviews(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, reviewOption, {
    setLoading: setLoading
  }));

  if (reviewOption.q === undefined && (!reviews || reviews.review_count === 0)) {
    return null;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("review-points review-section", {
      loading: loading
    })
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement(ReviewHead, {
    reviews: reviews
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement(ReviewList, {
    reviews: reviews,
    reviewOption: reviewOption,
    setReviewOption: function setReviewOption(applying) {
      _setReviewOption(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, reviewOption, applying));
    }
  }));
};

var ReviewHead = function ReviewHead(_ref3) {
  var reviews = _ref3.reviews;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement(react__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("h3", {
    className: "stit"
  }, reviews.summary.rating_avg, " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("small", {
    className: "count"
  }, "(", reviews.summary.total_ratings, " rating", reviews.summary.total_ratings != 1 ? "s" : "", ")")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("ul", {
    className: "optional"
  }, reviews.summary.attributes.map(function (a, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("label", null, a.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
      className: "review-range"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("i", {
      className: "review-range-value",
      style: {
        width: "".concat(Number(a.rating) * 20, "%")
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("b", null, a.rating));
  })));
};

var ReviewEntry = function ReviewEntry(_ref4) {
  var review = _ref4.review;

  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null),
      _useState8 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState7, 2),
      photoIndex = _useState8[0],
      setPhotoIndex = _useState8[1];

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("small", {
    className: "date"
  }, review.date), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
    className: "review-range " + "point" + (review.rating | 0)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
    className: "bg"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("i", {
    className: "review-range-value"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", null))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
    className: "username"
  }, review.name), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
    className: "verified"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("em", null, "Verified User")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("b", {
    className: "title"
  }, review.title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
    className: "description"
  }, review.review), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", null, review.images.map(function (image, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
      className: "photo",
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("img", {
      onClick: function onClick() {
        setPhotoIndex(i);
      },
      alt: "review image",
      src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      style: {
        backgroundImage: "url('".concat(image.thumbnail_url, "')")
      }
    }));
  }), photoIndex !== null && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_image_lightbox__WEBPACK_IMPORTED_MODULE_4__.default, {
    mainSrc: review.images[photoIndex].image_url,
    nextSrc: review.images[(photoIndex + 1) % review.images.length].image_url,
    prevSrc: review.images[(photoIndex + review.images.length - 1) % review.images.length].image_url,
    onCloseRequest: function onCloseRequest() {
      return setPhotoIndex(null);
    },
    onMovePrevRequest: function onMovePrevRequest() {
      return setPhotoIndex((photoIndex + review.images.length - 1) % review.images.length);
    },
    onMoveNextRequest: function onMoveNextRequest() {
      return setPhotoIndex((photoIndex + 1) % review.images.length);
    }
  })));
};

var ReviewList = function ReviewList(_ref5) {
  var reviews = _ref5.reviews,
      reviewOption = _ref5.reviewOption,
      setReviewOption = _ref5.setReviewOption;
  var currentPage = reviewOption.page || 1;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement(react__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("fieldset", {
    className: "search"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("label", null, "Filter reviews"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("input", {
    type: "text",
    placeholder: "Search topics and reviews",
    className: "text",
    onChange: (0,fancyutils__WEBPACK_IMPORTED_MODULE_5__.debounceEventUntilTimeout)(function (e) {
      setReviewOption({
        q: e.target.value
      });
    }, 500)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
    className: "sort"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("label", null, "Sort By:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("select", {
    onChange: function onChange(_ref6) {
      var target = _ref6.target;
      setReviewOption({
        sort: target.value
      });
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("option", {
    value: "newest"
  }, "Most Recent"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("option", {
    value: "rating_desc"
  }, "Highest Rated"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("option", {
    value: "rating_asc"
  }, "Lowest Rated")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("ul", {
    className: "review-list"
  }, reviews.reviews.length > 0 ? reviews.reviews.map(function (review, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement(ReviewEntry, {
      key: i,
      review: review
    });
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
    className: "no-review"
  }, "There is no review matching your request. Please try another option.")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
    className: "review-pagination"
  }, currentPage > 1 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement(react__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
    href: "#",
    className: "more"
  }, "See more reviews"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
    className: "prev",
    onClick: function onClick() {
      setReviewOption({
        page: Math.max(1, currentPage - 1)
      });
    }
  }, "Prev")), currentPage < reviews.total_pages && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
    className: "next",
    onClick: function onClick() {
      setReviewOption({
        page: Math.min(currentPage + 1, reviews.total_pages)
      });
    }
  }, "Next"), _.range(1, reviews.total_pages + 1).map(function (pageNum, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
      key: i,
      onClick: function onClick() {
        setReviewOption({
          page: pageNum
        });
      },
      className: currentPage === pageNum ? "current" : undefined
    }, pageNum);
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Reviews);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/Detail.tsx":
/*!*************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/Detail.tsx ***!
  \*************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");





var Overview = function Overview() {
  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_3__.useFancy)(),
      thing = _useFancy.thing;

  var sales = thing.sales;
  var bv = sales.seller.brand_values;
  var shippingInfo = sales.shipping_info || {};
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "overview"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dl", {
    className: "shipping optional"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dt", null, "Shipping Information"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dd", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
    className: "from"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", null, shippingInfo.origin)), shippingInfo.cost && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
    className: "cost"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", null, shippingInfo.cost)), shippingInfo.window && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
    className: "days"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", null, shippingInfo.window))))), bv.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dl", {
    className: "brand-value optional"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dt", null, "Buy with Confidence"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dd", null, bv.slice(0, 3).map(function (_ref) {
    var _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 2),
        className = _ref2[0],
        text = _ref2[1];

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
      key: className,
      className: "badge ".concat(className)
    }, text);
  }))) : null);
};

var Description = function Description() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("features"),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
      menu = _useState2[0],
      setMenu = _useState2[1];

  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false),
      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState3, 2),
      showMore = _useState4[0],
      setShowMore = _useState4[1];

  var descEl = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  var props = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_3__.useFancy)();
  var thing = props.thing,
      sales = props.thing.sales;
  var showFeatures = !!(sales.features && sales.features.trim());
  var showSpecs = !!(sales.specifications && sales.specifications.trim());
  var showReturns = !!(sales.return_exchange_policy_title && sales.return_exchange_policy_title.trim()) || !!(sales.shipping_policy && sales.shipping_policy.trim());
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (showFeatures) {
      setMenu('features');
    } else if (showSpecs) {
      setMenu('specification');
    } else if (showReturns) {
      setMenu('returns');
    }

    setShowMore(descEl.current ? descEl.current.clientHeight <= 76 : false);
  }, [thing.id]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "detail"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dl", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("description optional")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dt", null, "Description"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dd", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      collapsed: !showMore
    })
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: sales.description
    },
    ref: descEl
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
    className: "more",
    onClick: function onClick() {
      return setShowMore(true);
    },
    style: {
      display: showMore ? 'none' : undefined
    }
  }, "Read more")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "features-menu"
  }, showFeatures && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      current: menu === "features"
    }),
    onClick: function onClick(e) {
      e.preventDefault();
      setMenu("features");
    }
  }, "Features"), showSpecs && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      current: menu === "specification"
    }),
    onClick: function onClick(e) {
      e.preventDefault();
      setMenu("specification");
    }
  }, "Specifications"), showReturns && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      current: menu === "returns"
    }),
    onClick: function onClick(e) {
      e.preventDefault();
      setMenu("returns");
    }
  }, "Returns")), showFeatures && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dl", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("features optional", {
      show: menu === "features"
    }),
    "data-featuretype": "features"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dt", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
    onClick: function onClick(e) {
      e.preventDefault();
      setMenu("features");
    }
  }, "Features")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dd", {
    dangerouslySetInnerHTML: {
      __html: sales.features
    }
  })), showSpecs && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dl", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("features optional", {
      show: menu === "specification"
    }),
    "data-featuretype": "specifications"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dt", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
    onClick: function onClick(e) {
      e.preventDefault();
      setMenu("specification");
    }
  }, "Specifications")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dt", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dd", {
    dangerouslySetInnerHTML: {
      __html: sales.specifications
    }
  })), showReturns && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dl", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("features optional", {
      show: menu === "returns"
    }),
    "data-featuretype": "returns"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dt", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
    onClick: function onClick(e) {
      e.preventDefault();
      setMenu("returns");
    }
  }, "Returns")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("dd", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", null, sales.return_exchange_policy_title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", null, sales.shipping_policy))));
};

var Detail = function Detail() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "figure-detail"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Overview, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Description, null));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Detail);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/Info.tsx":
/*!***********************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/Info.tsx ***!
  \***********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _SaleItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SaleItem */ "./_static/modules/ui/overlay-thing/components/v2/Thing/SaleItem/index.tsx");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");




var Info = function Info() {
  var fancyProps = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_2__.useFancy)();
  var _fancyProps$thing = fancyProps.thing,
      reviews = _fancyProps$thing.reviews,
      sales = _fancyProps$thing.sales,
      fancyContext = fancyProps.fancyContext;
  var r = reviews.summary;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "figure-info"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "vendor"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    href: sales.seller.shop_url
  }, sales.seller.brand_name)), r.total_ratings > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "review-points"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    style: {
      cursor: r.total_reviews > 0 ? "pointer" : undefined
    },
    onClick: function onClick() {
      if (r.total_reviews > 0) {
        var $el = $(".review-section");
        var headerSize = parseInt($(".container").css("padding-top")) || 0;

        if ($el.length) {
          $(window).scrollTop($el[0].offsetTop - headerSize);
        }
      }
    }
  }, r.rating_avg, " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("small", {
    className: "count"
  }, "(", r.total_ratings, " rating", r.total_ratings != 1 ? 's' : '', ")"), " ")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SaleItem__WEBPACK_IMPORTED_MODULE_1__.default, fancyProps));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Info);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/Thing/index.tsx":
/*!************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/Thing/index.tsx ***!
  \************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _Image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Image */ "./_static/modules/ui/overlay-thing/components/v2/Thing/Image/index.tsx");
/* harmony import */ var _Info__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Info */ "./_static/modules/ui/overlay-thing/components/v2/Thing/Info.tsx");
/* harmony import */ var _Detail__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Detail */ "./_static/modules/ui/overlay-thing/components/v2/Thing/Detail.tsx");





var Thing = function Thing() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "wrapper-content"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Image__WEBPACK_IMPORTED_MODULE_1__.default, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Info__WEBPACK_IMPORTED_MODULE_2__.default, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Detail__WEBPACK_IMPORTED_MODULE_3__.default, null));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Thing);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/ThingCard.tsx":
/*!**********************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/ThingCard.tsx ***!
  \**********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ThingCard
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");


function ThingCard(_ref) {
  var brand_name = _ref.brand_name,
      title = _ref.title,
      html_url = _ref.html_url,
      image_url = _ref.image_url,
      max_price = _ref.max_price,
      min_price = _ref.min_price;
  var p = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "$", (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.numberFormat)(min_price, 0));

  if (max_price !== min_price) {
    p = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("em", {
      className: "from"
    }, "from "), " $", (0,fancyutils__WEBPACK_IMPORTED_MODULE_1__.numberFormat)(min_price, 0));
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "figure-item new"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("figure", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    href: html_url
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    className: "figure",
    style: {
      backgroundImage: "url(".concat(image_url, ")")
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
    src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    style: {
      backgroundImage: "url(".concat(image_url, ")")
    }
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("figcaption", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    href: html_url
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    className: "category"
  }, brand_name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("b", {
    className: "title"
  }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    className: "price"
  }, p))));
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/v2/index.tsx":
/*!******************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/v2/index.tsx ***!
  \******************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _Thing__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Thing */ "./_static/modules/ui/overlay-thing/components/v2/Thing/index.tsx");
/* harmony import */ var _MerchantInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./MerchantInfo */ "./_static/modules/ui/overlay-thing/components/v2/MerchantInfo.tsx");
/* harmony import */ var _Recommendation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Recommendation */ "./_static/modules/ui/overlay-thing/components/v2/Recommendation.tsx");
/* harmony import */ var _Reviews__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Reviews */ "./_static/modules/ui/overlay-thing/components/v2/Reviews.tsx");
/* harmony import */ var _container_history__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../container/history */ "./_static/modules/ui/overlay-thing/container/history.js");
/* harmony import */ var _FancyContext__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./FancyContext */ "./_static/modules/ui/overlay-thing/components/v2/FancyContext.tsx");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../store/store */ "./_static/modules/ui/overlay-thing/store/store.ts");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../map */ "./_static/modules/ui/overlay-thing/components/map.ts");


















function AdminMessages() {
  var _useFancy = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_13__.useFancy)(),
      thing = _useFancy.thing;

  if (!thing.messages) {
    return null;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
    className: "warning"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("span", null, "This item is not visible to customers because:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("ul", null, thing.messages.map(function (m, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("li", {
      key: i
    }, m);
  })));
}

function BreadCrumb() {
  var _useFancy2 = (0,_FancyContext__WEBPACK_IMPORTED_MODULE_13__.useFancy)(),
      thing = _useFancy2.thing;

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
    className: "breadcrumb"
  }, thing.breadcrumbs.map(function (_ref, i) {
    var label = _ref.label,
        href = _ref.href;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(react__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("a", {
      href: href
    }, label), " ", i !== thing.breadcrumbs.length - 1 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(react__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("span", {
      className: "arrow"
    }, ">"), " ") : null);
  }));
}

var AppV2 = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(AppV2, _Component);

  function AppV2() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, AppV2);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(AppV2).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(AppV2, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var pt = prevProps.thing;
      var ct = this.props.thing;

      if (ct != null) {
        if (!pt || pt.id !== ct.id) {
          if ((0,fancyutils__WEBPACK_IMPORTED_MODULE_7__.isStaticPage)()) {
            $(window).scrollTop(0);
          } else {
            $("#overlay-thing > .popup").attr("tabindex", -1).focus();
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
              _store_store__WEBPACK_IMPORTED_MODULE_14__.default.dispatch((0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_15__.updateSaleContext)({
                saleOptionID: minimumOption.id
              }));
            }
          }
        }
      }
    }
  }, {
    key: "getFancyContext",
    value: function getFancyContext() {
      return this.props.thing ? this.props : (0,_FancyContext__WEBPACK_IMPORTED_MODULE_13__.getFancyContextDefaultValue)();
    }
  }, {
    key: "render",
    value: function render() {
      var thing = this.props.thing;

      if (_container_history__WEBPACK_IMPORTED_MODULE_12__.historyData.locationIsThingPage && thing != null) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(_FancyContext__WEBPACK_IMPORTED_MODULE_13__.default.Provider, {
          value: this.getFancyContext()
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(AdminMessages, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(BreadCrumb, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(_Thing__WEBPACK_IMPORTED_MODULE_8__.default, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(_Reviews__WEBPACK_IMPORTED_MODULE_11__.default, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(_MerchantInfo__WEBPACK_IMPORTED_MODULE_9__.default, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(_Recommendation__WEBPACK_IMPORTED_MODULE_10__.default, null));
      } else {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", null);
      }
    }
  }]);

  return AppV2;
}(react__WEBPACK_IMPORTED_MODULE_5__.Component);

var ReduxComponentEnhancer = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(_map__WEBPACK_IMPORTED_MODULE_16__.mapStateToThingProps);
var Overlay = ReduxComponentEnhancer(AppV2);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Overlay);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/index.tsx":
/*!****************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/index.tsx ***!
  \****************************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/Router.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/Switch.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/Route.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _bugsnag_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @bugsnag/js */ "./node_modules/@bugsnag/js/browser/notifier.js");
/* harmony import */ var _bugsnag_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_bugsnag_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @bugsnag/plugin-react */ "./node_modules/@bugsnag/plugin-react/dist/bugsnag-react.js");
/* harmony import */ var _bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var common_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! common-components */ "./_static/modules/libf/common-components/index.js");
/* harmony import */ var _components_v2__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/v2 */ "./_static/modules/ui/overlay-thing/components/v2/index.tsx");
/* harmony import */ var _container_entry_events__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./container/entry-events */ "./_static/modules/ui/overlay-thing/container/entry-events.js");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./container/routeutils */ "./_static/modules/ui/overlay-thing/container/routeutils.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./store/store */ "./_static/modules/ui/overlay-thing/store/store.ts");
/* harmony import */ var _container_history__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./container/history */ "./_static/modules/ui/overlay-thing/container/history.js");
// This is entrypoint, which `React.render` takes place after DOM is ready.













if (__Config.bugsnag) {
  _bugsnag_js__WEBPACK_IMPORTED_MODULE_3___default().start({
    apiKey: "a54d48e98cb0410b7bdf0e60a905b00e",
    plugins: [new (_bugsnag_plugin_react__WEBPACK_IMPORTED_MODULE_4___default())()],
    user: {
      id: window.__FancyUser?.id || undefined
    }
  });
}

var onLoad = function onLoad() {
  __webpack_require__(/*! ./Shared */ "./_static/modules/ui/overlay-thing/Shared.js");

  var overlayContainer = document.querySelector("#container-wrapper .container");
  var thingRegex = /\/(sales|things)\/(\d+)/;
  var articleRegex = /\/articles\/(.+)/;
  var initialHref = location.href;
  $(window).on("popstate.overlay", function (event) {
    if (location.href !== initialHref && !(location.pathname.match(thingRegex) || location.pathname.match(articleRegex))) {
      event.preventDefault();
      location.reload();
    }
  });
  var ErrorBoundary = __Config.bugsnag ? _bugsnag_js__WEBPACK_IMPORTED_MODULE_3___default().getPlugin("react").createErrorBoundary(react__WEBPACK_IMPORTED_MODULE_0__) : react__WEBPACK_IMPORTED_MODULE_0__.Fragment;
  var tree = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ErrorBoundary, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Provider, {
    store: _store_store__WEBPACK_IMPORTED_MODULE_9__.default
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.default, {
    history: common_components__WEBPACK_IMPORTED_MODULE_5__.history
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.default, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.default, {
    path: "/things/*"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_v2__WEBPACK_IMPORTED_MODULE_6__.default, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.default, {
    path: "*",
    component: function component() {
      return null;
    }
  })))));
  (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.render)(tree, overlayContainer, function () {
    common_components__WEBPACK_IMPORTED_MODULE_5__.history.listen(_container_history__WEBPACK_IMPORTED_MODULE_10__.historyHook);
    (0,_container_history__WEBPACK_IMPORTED_MODULE_10__.historyHook)({
      pathname: location.pathname,
      search: location.search
    }); // should init once

    (0,_container_entry_events__WEBPACK_IMPORTED_MODULE_7__.attachEntryEvents)();
    _container_routeutils__WEBPACK_IMPORTED_MODULE_8__.pagingContext.init();
  });
};

if (document.readyState !== "loading") {
  onLoad();
} else {
  document.addEventListener("DOMContentLoaded", onLoad);
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
/******/ 			"OverlayThing.main": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./_static/modules/ui/overlay-thing/index.tsx","vendors","libfancy","_static_modules_ui_overlay-thing_components_v2_Thing_Image_index_tsx-_static_modules_ui_overl-b8f045"]
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
//# sourceMappingURL=OverlayThing.main.13dad84def596e9ac97b.js.map