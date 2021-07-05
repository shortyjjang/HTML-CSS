(self["webpackChunkfancy"] = self["webpackChunkfancy"] || []).push([["OverlayThing.popup"],{

/***/ "./_static/modules/ui/overlay-thing/API.js":
/*!*************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/API.js ***!
  \*************************************************/
/*! namespace exports */
/*! export deleteThing [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deleteThing": () => /* binding */ deleteThing
/* harmony export */ });
function deleteThing(thing, callback) {
  alertify.confirm("Remove this from Fancy?", function (ok) {
    if (ok) {
      var param = {
        thing_id: thing.id,
        uid: thing.user.id,
        ntid: thing.ntid
      };
      $.post("/remove_new_thing.xml", param, function (xml) {
        if ($(xml).find("status_code").length > 0 && $(xml).find("status_code").text() == 1) {
          location.href = $(xml).find("url").text();
        } else if ($(xml).find("status_code").length > 0 && $(xml).find("status_code").text() == 0) {
          var msg = $(xml).find("message").text();
          alertify.alert(msg);
        }

        callback && callback();
      }, "xml");
    } else {
      callback && callback();
    }
  });
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/Review.tsx":
/*!****************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/Review.tsx ***!
  \****************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Review
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









var Votes = {
  Like: {
    param: {
      vote: 1
    }
  },
  Dislike: {
    param: {
      vote: -1
    }
  }
};

var Review = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(Review, _Component);

  function Review() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Review);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Review)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "state", {
      like: null
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "lock", false);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleLike", function (event) {
      event.preventDefault();

      _this.request(Votes.Like);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleDislike", function (event) {
      event.preventDefault();

      _this.request(Votes.Like);
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Review, [{
    key: "request",
    value: function request(VoteType) {
      var _this2 = this;

      if (this.lock) {
        return;
      }

      this.lock = true;
      var _this$props = this.props,
          review = _this$props.review,
          sales = _this$props.sales;
      $.ajax({
        type: 'PUT',
        url: "/rest-api/v1/reviews/".concat(sales.id, "/").concat(review.id),
        data: VoteType.param
      }).done(function () {
        _this2.setState({
          like: VoteType
        });
      }).always(function () {
        _this2.lock = false;
      });
    }
  }, {
    key: "getUpPercentage",
    value: function getUpPercentage(voteup, votedown) {
      if (!voteup) {
        return 0;
      } else {
        return (voteup / (voteup + votedown) * 100).toFixed(0);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          review = _this$props2.review,
          appContext = _this$props2.appContext;
      var body = review.body,
          date_created = review.date_created,
          voteup = review.voteup,
          votedown = review.votedown,
          rating = review.rating,
          user = review.user,
          title = review.title,
          viewer_can_vote = review.viewer_can_vote,
          option = review.option;
      var upPercentage = this.getUpPercentage(voteup, votedown);
      var like = this.state.like;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "rating"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "value"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", {
        style: {
          width: "".concat(rating * 10, "%")
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "date"
      }, date_created)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "review"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("h4", {
        className: "title"
      }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "option"
      }, "Option: ", option || ''), voteup > 0 || votedown > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "precentage"
      }, voteup, " of ", voteup + votedown, " people (", upPercentage, "%) found this review helpful.") : '', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "description"
      }, body), appContext.loggedIn && viewer_can_vote && [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        key: "feedback",
        className: "survey",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_8__.Display.NoneIf(like != null)
      }, "Was this review helpful? ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleLike,
        className: "like"
      }, "Like"), " \xB7", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleDislike,
        className: "unlike"
      }, "Unlike")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        key: "feedback-response",
        className: "success",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_8__.Display.NoneIf(like == null)
      }, "Thank you for your feedback.")]));
    }
  }]);

  return Review;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/BookingResultPopup.js":
/*!*********************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/BookingResultPopup.js ***!
  \*********************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ BookingResultPopup
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__);
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
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../container/routeutils */ "./_static/modules/ui/overlay-thing/container/routeutils.js");











var BookingResultPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(BookingResultPopup, _React$Component);

  function BookingResultPopup() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, BookingResultPopup);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(BookingResultPopup).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(BookingResultPopup, [{
    key: "render",
    value: function render() {
      var _this = this;

      var roomlist = this.props.roomlist;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("p", {
        className: "ltit"
      }, "Room Available"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "data-head after"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "type"
      }, "Room type"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "price"
      }, "Avg price/night"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "total"
      }, "Subtotal")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("ul", {
        className: "data-list after"
      }, roomlist && roomlist.map(function (room) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(BookingResultItem, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_1___default()({
          room: room
        }, _this.props));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return BookingResultPopup;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(BookingResultPopup, "popupName", 'booking-result');



var BookingResultItem = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(BookingResultItem, _React$Component2);

  function BookingResultItem() {
    var _getPrototypeOf2;

    var _this2;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, BookingResultItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(BookingResultItem)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this2), "handleBook", function () {
      var _this2$props = _this2.props,
          arrivalDate = _this2$props.arrivalDate,
          departureDate = _this2$props.departureDate,
          hotelID = _this2$props.hotelID,
          room = _this2$props.room,
          rooms = _this2$props.rooms;
      var params = {
        hotelId: hotelID,
        rateCode: room.rateCode,
        arrivalDate: arrivalDate,
        departureDate: departureDate,
        rooms: rooms
      };
      (0,_container_routeutils__WEBPACK_IMPORTED_MODULE_9__.redirect)("https://".concat(location.host, "/ean/hotel/book/?").concat($.param(params)));
    });

    return _this2;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(BookingResultItem, [{
    key: "render",
    value: function render() {
      var room = this.props.room;
      var price;

      var _description;

      var longDescription = '';

      if (room.supplierType == 'E') {
        price = room.chargeable.total;
        _description = room.RoomType.description;
        longDescription = room.RoomType.descriptionLong;
      } else {
        price = room.chargeable.maxNightlyRate;
        _description = room.roomTypeDescription;
      }

      var formattedPrice = "$" + parseFloat(price).toFixed(2);
      var nightlyPrice = room.supplierType == 'E' && room.nightlyrates ? '$' + parseFloat(room.nightlyrates[0].rate).toFixed(2) + '/night' : '';
      var description = $('<span />').html(_description).text();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "type"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("b", null, description), room.nonRefundable && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("b", null, "* Non Refundable")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "price"
      }, nightlyPrice), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "total"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("b", null, formattedPrice)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        rowspan: "2",
        className: "button"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btns-green-embo btn-bookit",
        onClick: this.handleBook
      }, "Book Now")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "description",
        dangerouslySetInnerHTML: {
          __html: longDescription
        }
      }));
    }
  }]);

  return BookingResultItem;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/EditPopup.js":
/*!************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/EditPopup.js ***!
  \************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.e, __webpack_require__.t, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ EditPopup
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
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../API */ "./_static/modules/ui/overlay-thing/API.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../map */ "./_static/modules/ui/overlay-thing/components/map.ts");














function onChangeSetState(key) {
  return function setStateWith(event) {
    this.setState(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()({}, key, event.target.value));
  };
}

var allowedVideoExtensions = ["mp4", "avi", "mov"];
var VideoUploadStatus = {
  Unknown: "Unknown",
  // fetching existing information
  Blank: "Blank",
  Uploading: "Uploading",
  UploadCompleted: "UploadCompleted"
};

function getVideoFilename(videoURL) {
  var videoFilenameSpl = videoURL.split("/");

  if (videoFilenameSpl.length > 1) {
    return videoFilenameSpl[videoFilenameSpl.length - 1];
  }
}

var EditPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(EditPopup, _React$Component);

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(EditPopup, [{
    key: "_getInitialState",
    value: function _getInitialState() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        thing: {}
      },
          _ref$thing = _ref.thing,
          thing = _ref$thing === void 0 ? {} : _ref$thing;

      var selectedCategory = thing.category_item && thing.category_item.category_id - 1;
      this.__existingVideo = null;
      return {
        categoryDisplay: false,
        selectedCategory: selectedCategory >= 0 ? selectedCategory : null,
        thingName: thing.name || "",
        thingTagUrl: thing.tag_url || "",
        appDescription: thing.metadata && thing.metadata.description || "",
        videoStatus: VideoUploadStatus.Unknown,
        videoURL: "",
        showList: false,
        lists: []
      };
    }
  }]);

  function EditPopup(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, EditPopup);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_1___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_2___default()(EditPopup).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "__existingVideo", null);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "updateVideoURL", function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        thing: {}
      },
          _ref2$thing = _ref2.thing,
          thing = _ref2$thing === void 0 ? {} : _ref2$thing;

      if (_this.isVideoUploadAllowed(thing)) {
        $.get("/rest-api/v1/video_cover/thing/".concat(thing.id)).fail(function (jqxhr) {
          if (jqxhr.status === 404 && _this.props.thing.id === thing.id) {
            _this.setState({
              videoStatus: VideoUploadStatus.Blank
            });
          }
        }).done(function (res) {
          _this.__existingVideo = res;

          if (_this.props.thing.id === thing.id) {
            _this.setState({
              videoStatus: VideoUploadStatus.UploadCompleted,
              videoURL: res.original
            });
          }
        });
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "getSelectedCategoryName", function () {
      var selectedCategory = _this.state.selectedCategory;

      if (selectedCategory != null) {
        return Categories[selectedCategory].title;
      } else {
        return "Choose a Category";
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleCategorySelection", function (event) {
      var idx = $(event.target).attr("data-idx");
      var numIdx = Number(idx);

      if (idx == null || numIdx === _this.state.selectedCategory) {
        _this.setState({
          selectedCategory: null,
          categoryDisplay: false
        }); // force update

      } else {
        _this.setState({
          selectedCategory: numIdx,
          categoryDisplay: false
        }); // force update

      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleTrickClick", function () {
      _this.setState({
        categoryDisplay: false
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "findFromRoot", function (selection) {
      return $(_this.root).find(selection);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "save", function () {
      var thing = _this.props.thing;

      if (_this.state.selectedCategory == null) {
        alert("You should select a cagegory.");
        return;
      }

      var title = _this.findFromRoot("#fancy-title").val().trim();

      var link = _this.findFromRoot("#fancy-web-link").val().trim();

      var description = _this.state.appDescription;

      var category = _this.findFromRoot(".figure-infomation .lists-popout.category input:checked").eq(0).attr("data-formvalue");

      var thing_id = thing.id;
      var uid = thing.user.id;

      if (title.length <= 0) {
        alert(gettext("Please enter title."));
        return false;
      }

      if (title.length > 150) {
        alert(gettext("Title is too long."));
        return false;
      }

      var param = {
        name: title,
        link: link,
        description: description,
        thing_id: thing_id,
        uid: uid
      };
      if (category != "-1" && category != "-2") param["category"] = category;

      function update_callback(xml) {
        var $xml = $(xml),
            $st = $xml.find("status_code"),
            msg = $xml.find("message").text();

        if ($st.text() == "0") {
          alert(msg);
        } else if ($st.text() == "1") {
          location.href = $(xml).find("thing_url").text();
        } else if ($st.text() == "2") {
          if (confirm(msg)) {
            param["ignore_dup_link"] = true;
            $.post("/update_new_thing.xml", param, update_callback, "xml");
          }
        }
      }

      $.post("/update_new_thing.xml", param, update_callback, "xml");
      return false;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleUpload", function (event) {
      event.preventDefault();
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);

      _this.uploadInput.dispatchEvent(evt);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleDelete", function () {
      (0,_API__WEBPACK_IMPORTED_MODULE_12__.deleteThing)(_this.props.thing, function () {
        _this.close();
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleFileUpload", function () {
      var thing = _this.props.thing;
      var inputEl = _this.uploadInput;
      var fileVal = inputEl.value.trim();
      var thing_id = thing.id;
      var uid = thing.user.id;
      var $em = $(_this.root).find(".progress > em");
      var $uploadButton = $(_this.root).find("a.change-img");
      $em.css("width", "1px").parent().show();
      $uploadButton.hide();

      if (fileVal.length > 0) {
        __webpack_require__.e(/*! import() | OverlayThing.admin */ "OverlayThing.admin").then(__webpack_require__.t.bind(__webpack_require__, /*! ../../../../../_ui/js/ajaxfileupload */ "./_static/_ui/js/ajaxfileupload.js", 7)).then(function () {
          $.ajaxFileUpload({
            url: "/newthing_image.xml?thing_id=" + thing_id + "&uid=" + uid,
            secureuri: false,
            fileElementId: inputEl.id,
            dataType: "xml",
            success: function success(xml, status) {
              var $xml = $(xml),
                  $st = $xml.find("status_code"),
                  $msg = $xml.find("message");

              if ($st.length && $st.text() == "1") {
                location.reload(false);
              } else if ($st.length && $st.text() == "0") {
                alert($msg.text());
                return false;
              } else {
                alert(gettext("Unable to upload file."));
                return false;
              }
            },
            error: function error(data, status, e) {
              alert(e);
              return false;
            },
            complete: function complete() {
              $em.parent().hide();
            },
            progress: function progress(percent) {
              $em.css("width", percent + "%");
              $uploadButton.css("display", "");
            }
          });
          $("#uploadphoto").attr("value", "");
        });
      }

      return false;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleVideoUploadTrigger", function () {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);

      _this.videoUploadInput.dispatchEvent(evt);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleVideoUpload", function (event) {
      var inputEl = _this.videoUploadInput;
      var fileVal = inputEl.value.trim();

      var ext = _this.getExtension(fileVal);

      var extensionIsAllowed = allowedVideoExtensions.some(function (ext) {
        return ext === ext;
      });

      if (!extensionIsAllowed && !window.confirm("Extension '.".concat(ext, "' is not allowed. Proceed?"))) {
        return false;
      }

      var thing = _this.props.thing;

      _this.setState({
        videoStatus: VideoUploadStatus.Uploading,
        videoURL: fileVal
      }, function () {
        var formData = new window.FormData();
        formData.append(inputEl.name, inputEl.files[0]);
        $.ajax({
          url: "/rest-api/v1/videos/videocontents",
          processData: false,
          contentType: false,
          type: "POST",
          data: formData
        }).success(function (res, status) {
          console.log("video update completed, registering cover...");
          var contentType = "thing"; // TODO: +article, etc

          var objectId = thing.id;
          var video_id = res.id;
          $.ajax({
            url: "/rest-api/v1/video_cover/".concat(contentType, "/").concat(objectId),
            type: "PUT",
            data: {
              video_id: video_id
            }
          }).success(function (res) {
            _this.setState({
              videoStatus: VideoUploadStatus.UploadCompleted
            });

            alert("cover registration complete");
          }).fail(function (data, status, e) {
            _this.setState({
              videoStatus: VideoUploadStatus.Blank
            });

            alert("".concat(e, ": failed to register cover."));
          });
        }).fail(function (data, status, e) {
          _this.setState({
            videoStatus: VideoUploadStatus.Blank
          });

          alert("".concat(e, ": failed to upload video. Please try again."));
        });
      });

      return false;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleRemoveVideo", function () {
      var thing = _this.props.thing;

      if (_this.__existingVideo && window.confirm("Are you sure to delete attached video?")) {
        var video_id = _this.__existingVideo.id;
        var contentType = "thing"; // TODO: +article, etc

        var objectId = thing.id;
        $.ajax({
          url: "/rest-api/v1/video_cover/".concat(contentType, "/").concat(objectId),
          type: "DELETE",
          data: {
            video_id: video_id
          }
        }).success(function (res) {
          _this.setState({
            videoStatus: VideoUploadStatus.Blank
          });

          console.log("Video cover successfully removed. Deleting video...");
        }).fail(function (data, status, e) {
          alert("".concat(e, ": failed to delete cover."));
        });
      } else if (_this.__existingVideo == null) {
        alert("Error: video is not loaded completed. Please try again.");
      }

      return false;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3___default()(_this), "handleSelectList", function (event) {
      event.preventDefault();

      _this.setState({
        showList: true
      });
    });

    _this.state = _this._getInitialState(props);
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(EditPopup, [{
    key: "close",
    value: function close() {
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.closePopup)(EditPopup.popupName);
    }
  }, {
    key: "isVideoUploadAllowed",
    value: function isVideoUploadAllowed(thing) {
      return (0,_map__WEBPACK_IMPORTED_MODULE_11__.isVideoUploadable)(thing);
    }
  }, {
    key: "getExtension",
    value: function getExtension(filename) {
      var spl = filename.split(".");
      return spl[spl.length - 1];
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.__last_tid = this.props.thing.id;
      this.updateVideoURL(this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this2 = this;

      console.debug(this.state);
      var np = this.props;

      if (this.__last_tid !== np.thing.id) {
        this.__last_tid = np.thing.id;
        this.setState(this._getInitialState(np), function () {
          _this2.updateVideoURL(np);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          viewer = _this$props.appContext.viewer,
          thing = _this$props.thing;
      var _this$state = this.state,
          appDescription = _this$state.appDescription,
          categoryDisplay = _this$state.categoryDisplay,
          selectedCategory = _this$state.selectedCategory,
          thingName = _this$state.thingName,
          thingTagUrl = _this$state.thingTagUrl,
          videoStatus = _this$state.videoStatus,
          videoURL = _this$state.videoURL;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        ref: function ref(element) {
          _this3.root = element;
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, "Edit thing"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "figure-infomation"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "figure-img"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", {
        className: "shadow"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "#",
        className: "change-img",
        onClick: this.handleUpload
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-pen"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, "Change image", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        id: "uploadphoto",
        type: "file",
        ref: function ref(element) {
          _this3.uploadInput = element;
        },
        name: "upload-file",
        onChange: this.handleFileUpload
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
        src: "/_static/_ui/images/common/blank.gif",
        style: {
          backgroundImage: "url(".concat(thing.image.src, ")")
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "progress",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("em", {
        style: {
          width: "60%"
        }
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, "Title"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "text",
        value: thingName,
        className: "text",
        id: "fancy-title",
        onChange: onChangeSetState("thingName").bind(this)
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, "Source"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "text",
        className: "text",
        placeholder: "http://",
        value: thingTagUrl,
        id: "fancy-web-link",
        onChange: onChangeSetState("thingTagUrl").bind(this)
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "select-category"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, "Category"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("select-category category", {
          focus: categoryDisplay
        }),
        onClick: function onClick() {
          _this3.setState({
            categoryDisplay: true
          });

          return false;
        }
      }, this.getSelectedCategoryName())), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "lists-popout category",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.BlockIf(categoryDisplay)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "trick",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.BlockIf(categoryDisplay),
        onClick: this.handleTrickClick
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", null, Categories.map(function (c, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          key: idx
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
          type: "checkbox",
          id: "category-".concat(idx + 1),
          "data-idx": idx,
          "data-formvalue": c.formValue,
          onChange: _this3.handleCategorySelection,
          checked: selectedCategory === idx
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", {
          htmlFor: "category-".concat(idx + 1)
        }, c.title));
      }))), viewer.is_admin_content && this.isVideoUploadAllowed(thing) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("label", null, "Item Video"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btns-white",
        onClick: this.handleVideoUploadTrigger,
        disabled: videoStatus === VideoUploadStatus.Unknown,
        style: fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.NoneIf(!(videoStatus === VideoUploadStatus.Blank || videoStatus === VideoUploadStatus.Unknown))
      }, "Upload Video"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "file",
        name: "video-file",
        id: "video-file",
        ref: function ref(element) {
          _this3.videoUploadInput = element;
        },
        onChange: this.handleVideoUpload,
        style: fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.None
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("video_item", {
          loading: videoStatus === VideoUploadStatus.Uploading || videoStatus === VideoUploadStatus.UploadCompleted
        }),
        style: fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.NoneIf(!(videoStatus === VideoUploadStatus.Uploading || videoStatus === VideoUploadStatus.UploadCompleted))
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, getVideoFilename(videoURL)), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "#",
        className: "del",
        onClick: this.handleRemoveVideo,
        style: fancymixin__WEBPACK_IMPORTED_MODULE_10__.Display.NoneIf(videoStatus !== VideoUploadStatus.UploadCompleted)
      }, "x")))), thing.can_be_modified && thing.has_launch_app && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "note description"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("textarea", {
        placeholder: "App description",
        id: "fancy-description",
        maxlength: "200",
        onChange: onChangeSetState("appDescription").bind(this),
        value: appDescription
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "btn-area"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btns-gray-embo btn-delete remove_new_thing",
        onClick: this.handleDelete
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del"
      }), " Delete item"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btns-gray-embo btn-cancel",
        onClick: this.close
      }, "Cancel"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btns-blue-embo btn-save",
        onClick: this.save
      }, "Save")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close",
        onClick: this.close
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return EditPopup;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(EditPopup, "popupName", "edit-thing");


var Categories = [{
  formValue: "Mens",
  title: "Men's"
}, {
  formValue: "Womens",
  title: "Women's"
}, {
  formValue: "Kids",
  title: "Kids"
}, {
  formValue: "Pets",
  title: "Pets"
}, {
  formValue: "Home",
  title: "Home"
}, {
  formValue: "Gadgets",
  title: "Gadgets"
}, {
  formValue: "Art",
  title: "Art"
}, {
  formValue: "Food",
  title: "Food"
}, {
  formValue: "Media",
  title: "Media"
}, {
  formValue: "Other",
  title: "Other"
}, {
  formValue: "Architecture",
  title: "Architecture"
}, {
  formValue: "travel-and-destinations",
  title: "Travel & Destinations"
}, {
  formValue: "sports-and-outdoors",
  title: "Sports & Outdoors"
}, {
  formValue: "diy-and-crafts",
  title: "DIY & Crafts"
}, {
  formValue: "Workspace",
  title: "Workspace"
}, {
  formValue: "cars-and-vehicles",
  title: "Cars & Vehicles"
}];

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/RequestSalePopup.js":
/*!*******************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/RequestSalePopup.js ***!
  \*******************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ RequestSalePopup
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
/* harmony import */ var _appstate__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../appstate */ "./_static/modules/ui/overlay-thing/appstate.ts");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../container/routeutils */ "./_static/modules/ui/overlay-thing/container/routeutils.js");












var RequestSalePopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(RequestSalePopup, _React$Component);

  function RequestSalePopup() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, RequestSalePopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(RequestSalePopup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleCustomerRequestSale", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (_appstate__WEBPACK_IMPORTED_MODULE_9__.default.loggedIn !== true) {
        window.require_login();
        return;
      }

      $.ajax({
        type: 'post',
        url: '/send_email_for_sale_request.json',
        data: {
          new_thing_id: _this.props.thing.ntid
        },
        dataType: 'json',
        success: function success() {
          alertify.alert(gettext("Thank you. Your request was successfully sent to Fancy."));
          (0,fancyutils__WEBPACK_IMPORTED_MODULE_8__.closePopup)('request_sale');
        },
        error: function error() {
          alertify.alert(gettext("There was an error while sending request. Please try again later."));
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleMerchantRequestSale", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (_appstate__WEBPACK_IMPORTED_MODULE_9__.default.loggedIn !== true) {
        window.require_login();
        return;
      }

      var thing = _this.props.thing;
      var baseURL = _appstate__WEBPACK_IMPORTED_MODULE_9__.default.viewer.is_seller ? '/merchant/products/new' : '/seller-signup';
      (0,_container_routeutils__WEBPACK_IMPORTED_MODULE_10__.redirect)("".concat(baseURL, "?ntid=").concat(thing.ntid, "&ntoid=").concat(thing.user.id));
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(RequestSalePopup, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, gettext("Request for sale")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "after"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: "sell merchant",
        onClick: this.handleMerchantRequestSale
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "tooltip"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "icon"
      }), " ", gettext("For merchants"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, gettext("I would like to sell this!"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        className: "customer",
        onClick: this.handleCustomerRequestSale
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "tooltip"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "icon"
      }), " ", gettext("For customers"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, gettext("I would like to buy this!"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null)))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return RequestSalePopup;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(RequestSalePopup, "popupName", 'request_sale');



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/ReviewsPopup.js":
/*!***************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/ReviewsPopup.js ***!
  \***************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ReviewsPopup
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
/* harmony import */ var _Review__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Review */ "./_static/modules/ui/overlay-thing/components/Review.tsx");











var ReviewsPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(ReviewsPopup, _React$Component);

  function ReviewsPopup() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ReviewsPopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ReviewsPopup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "state", {
      reviews: []
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "endReached", false);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleLoading", function () {
      var $ul = $(_this.reviewsContainer);
      var scrollTop = $ul.scrollTop();
      var scrollHeight = $ul[0].scrollHeight;

      if (!_this.endReached && scrollTop > scrollHeight - $ul.height() - 200) {
        _this.loadReviews();
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "getParam", function () {
      if (_this.state.reviews.length > 0) {
        return {
          cursor: _.last(_this.state.reviews).id - 1
        };
      } else {
        return null;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "loadReviews", function () {
      if (_this.loading || _this.endReached) {
        return;
      }

      _this.loading = true;

      _this.setState({
        loading: true
      }, function () {
        var sales = _this.props.sales;
        $.ajax({
          type: 'GET',
          url: "/rest-api/v1/reviews/".concat(sales.id),
          data: _this.getParam()
        }).then(function (_ref) {
          var reviews = _ref.reviews;

          if (reviews.length) {
            _this.setState({
              reviews: _this.postProcessReviews(reviews)
            });
          } else {
            _this.endReached = true;
          }
        }).always(function () {
          _this.setState({
            loading: false
          });

          _this.loading = false;
        });
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ReviewsPopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadReviews();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.sales.id !== prevProps.sales.id) {
        this.loadReviews();
      }
    }
  }, {
    key: "postProcessReviews",
    value: function postProcessReviews(reviews) {
      var _this2 = this;

      return reviews.map(function (review) {
        review.date_created = $.datepicker.formatDate('MM d, yy', new Date(review.date_created));
        review.viewer_can_vote = review.voted == 0 && review.user.id != _this2.props.appContext.viewer.id;
        return review;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          appContext = _this$props.appContext,
          sales = _this$props.sales;
      var _this$state = this.state,
          reviews = _this$state.reviews,
          loading = _this$state.loading;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, "Customer reviews"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "total-range"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, sales.review_rating > 0 ? String((sales.review_rating / 2).toFixed(1)) : '0', " stars"), " \u2013 ", sales.review_count, " customer reviews"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        onScroll: this.handleLoading,
        ref: function ref(element) {
          _this3.reviewsContainer = element;
        }
      }, reviews.map(function (review, i) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(_Review__WEBPACK_IMPORTED_MODULE_9__.default, {
          key: i,
          review: review,
          appContext: appContext,
          sales: sales
        });
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
        className: "loading",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_8__.Display.NoneIf(!loading)
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return ReviewsPopup;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(ReviewsPopup, "popupName", 'customer-review');



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/ShippingCountriesPopup.js":
/*!*************************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/ShippingCountriesPopup.js ***!
  \*************************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ShippingCountriesPopup
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
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _data_Countries__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../data/Countries */ "./_static/modules/ui/overlay-thing/data/Countries.js");
/* harmony import */ var _action_actions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../action/actions */ "./_static/modules/ui/overlay-thing/action/actions.js");














var ShippingCountriesPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(ShippingCountriesPopup, _React$Component);

  function ShippingCountriesPopup() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, ShippingCountriesPopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(ShippingCountriesPopup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      query: "",
      selectedCountry: ""
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "countries", _data_Countries__WEBPACK_IMPORTED_MODULE_11__.CountriesPair);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCountryClick", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var selectedCountry = event.currentTarget.getAttribute("data-code");

      _this.setState({
        selectedCountry: selectedCountry
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleSaveCountry", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var selectedCountry = _this.state.selectedCountry;
      var dispatch = _this.props.dispatch;

      if (_this.props.userCountry === selectedCountry) {
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.closePopup)(ShippingCountriesPopup.popupName);
        return;
      }

      $.post("/set_shipping_country", {
        code: selectedCountry,
        name: (0,_data_Countries__WEBPACK_IMPORTED_MODULE_11__.getCountryByCode)(selectedCountry)
      }).done(function () {
        dispatch((0,_action_actions__WEBPACK_IMPORTED_MODULE_12__.updateAppContext)({
          userCountry: _this.state.selectedCountry
        }));
        (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.closePopup)(ShippingCountriesPopup.popupName);
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCancel", function (event) {
      event.preventDefault();
      event.stopPropagation();
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_10__.closePopup)(ShippingCountriesPopup.popupName);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleQueryChange", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.setState({
        query: event.currentTarget.value
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleRemoveQuery", function (event) {
      event.preventDefault();
      event.stopPropagation();

      _this.setState({
        query: ""
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(ShippingCountriesPopup, [{
    key: "componentDidMount",
    // state.selectedCountry initialization
    value: function componentDidMount() {
      this.setState({
        selectedCountry: this.props.userCountry
      });
    } // state.selectedCountry initialization

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var userCountry = this.props.userCountry;

      if (prevProps.userCountry !== userCountry) {
        this.setState({
          selectedCountry: userCountry
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          selectedCountry = _this$state.selectedCountry,
          query = _this$state.query;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("p", {
        className: "ltit"
      }, gettext("Choose your country")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "country-list after"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("span", {
        className: "line"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "search"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("input", {
        type: "text",
        className: "text",
        placeholder: "Search country",
        onChange: this.handleQueryChange,
        value: query
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
        className: "remove",
        onClick: this.handleRemoveQuery,
        style: fancymixin__WEBPACK_IMPORTED_MODULE_9__.Display.NoneIf($.trim(query) === "")
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "right-outer scroll"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        code: "all"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("ul", {
        className: "after"
      }, this.countries.filter(function (_ref) {
        var _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 2),
            code = _ref2[0],
            name = _ref2[1];

        var q = $.trim(query).toLowerCase();

        if (q === "") {
          return true;
        } else {
          return name.toLowerCase().indexOf(q) > -1 || code.toLowerCase().indexOf(q) > -1;
        }
      }).map(function (_ref3, i) {
        var _ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref3, 2),
            code = _ref4[0],
            name = _ref4[1];

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("li", {
          className: selectedCountry === code ? "current" : null,
          key: i
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("a", {
          onClick: _this2.handleCountryClick,
          "data-code": code
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("b", null, name)));
      }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "btn-area"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btns-gray-embo cancel",
        onClick: this.handleCancel
      }, gettext("Cancel")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        className: "btns-blue-embo save",
        onClick: this.handleSaveCountry
      }, gettext("Save"))));
    }
  }]);

  return ShippingCountriesPopup;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(ShippingCountriesPopup, "popupName", "shipping");



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/SizeGuidePopup.js":
/*!*****************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/SizeGuidePopup.js ***!
  \*****************************************************************************/
/*! namespace exports */
/*! export SizeGuide [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ SizeGuidePopup,
/* harmony export */   "SizeGuide": () => /* binding */ SizeGuide
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
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");










var db = {
  display: 'block'
};
var dn = {
  display: 'none'
};

function displayIf(condition) {
  return condition ? db : dn;
}

var SizeGuidePopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(SizeGuidePopup, _React$Component);

  function SizeGuidePopup(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, SizeGuidePopup);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(SizeGuidePopup).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "handleCancelClick", function (event) {
      event.preventDefault();
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.closePopup)(SizeGuidePopup.popupName);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "loadSizeGuide", function () {
      var sales = _this.props.thing.sales;

      if (_this.loadingGuide || !sales.size_guide_id) {
        return;
      }

      _this.loadingGuide = true;

      _this.setState({
        loadingGuide: true
      }, function () {
        $.ajax({
          type: 'GET',
          url: " /rest-api/v1/seller/".concat(sales.seller.id, "/sizeguides/").concat(sales.size_guide_id),
          data: {}
        }).then(function (size_guide) {
          if (size_guide) {
            _this.setState({
              sizeGuide: size_guide
            });
          }
        }).always(function () {
          _this.setState({
            loadingGuide: false
          });

          _this.loadingGuide = false;
        });
      });
    });

    _this.state = {
      // tab: props.thing.sales.size_chart_ids.length > 0 ? 'sizechart' : 'measure',
      tab: 'measure',
      // sizeCharts: [],
      sizeGuide: null
    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(SizeGuidePopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // this.loadSizeCharts();
      this.loadSizeGuide();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      $.dialog(SizeGuidePopup.popupName).center();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          tab = _this$state.tab,
          sizeGuide = _this$state.sizeGuide;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("p", {
        className: "ltit"
      }, gettext('Size Guide')), sizeGuide && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(SizeGuide, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, this.props, {
        tab: tab,
        sizeGuide: sizeGuide
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("button", {
        type: "button",
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return SizeGuidePopup;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(SizeGuidePopup, "popupName", 'general_size_guide');


var SizeGuide = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(SizeGuide, _React$Component2);

  function SizeGuide() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, SizeGuide);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(SizeGuide).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(SizeGuide, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          tab = _this$props.tab,
          thing = _this$props.thing,
          sizeGuide = _this$props.sizeGuide;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "section measuring",
        style: displayIf(tab === 'measure')
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("p", null, "Please note that the following measuring guide is provided by ", thing.sales.seller.brand_name, " for this specific item. "), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "table"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("table", {
        className: "tb-type4"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("tr", null, sizeGuide.columns.length > 0 && sizeGuide.columns.map(function (column, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("th", null, column);
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("tbody", null, sizeGuide.rows.length > 0 && sizeGuide.rows.map(function (row, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("tr", null, row.map(function (column, idx) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("td", null, column, idx > 0 && (sizeGuide.unit == 'inch' ? '″' : sizeGuide.unit));
        }));
      })))), sizeGuide.images.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
        className: "thumbnail"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("img", {
        src: (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.schemeless)(sizeGuide.images[0].url),
        alt: ""
      })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", null));
    }
  }]);

  return SizeGuide;
}(react__WEBPACK_IMPORTED_MODULE_8__.Component);

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/VanityPopup.js":
/*!**************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/VanityPopup.js ***!
  \**************************************************************************/
/*! namespace exports */
/*! export VanityLearnMore [provided] [no usage info] [missing usage info prevents renaming] */
/*! export VanitySearchResult [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VanityLearnMore": () => /* binding */ VanityLearnMore,
/* harmony export */   "VanitySearchResult": () => /* binding */ VanitySearchResult
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var fancymixin__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fancymixin */ "./_static/modules/libf/FancyMixin.js");
/* harmony import */ var _container_routeutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../container/routeutils */ "./_static/modules/ui/overlay-thing/container/routeutils.js");
/* harmony import */ var _appstate__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../appstate */ "./_static/modules/ui/overlay-thing/appstate.ts");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../map */ "./_static/modules/ui/overlay-thing/components/map.ts");













var VanityLearnMore = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(VanityLearnMore, _React$Component);

  function VanityLearnMore() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, VanityLearnMore);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(VanityLearnMore).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(VanityLearnMore, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, "Learn more"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "terms"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("h3", null, "How it Works"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "After you purchase a vanity number, we will contact you within 1-2 business days with all the information you need to provide to your carrier to transfer your number. You should be able to use your new number within 1-3 days of contacting your carrier."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "The number is yours to keep. If you decide to change carriers or phones at any point, you can continue to use your vanity number."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("h3", null, "Compatibility"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "All numbers are compatible with the following US Wireless Carriers: AT&T, Spring, T-Mobile, and Verizon Wireless."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("h3", null, "Special Requests"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "Please note: we can only accept special requests for the last four digits of a desired phone number that is not listed."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "Additional fees may apply to specially requested phone numbers."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("h3", null, "Refunds and Returns"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "If for whatever reason your carrier of choice* will not accept your number, we will refund your order within 30 days of purchase. We cannot accept returns unless the carrier refuses to transfer the number."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "Numbers can only be transferred to the following US cell phone carriers: AT&T, Sprint, T-Mobile and Verizon Wireless."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("h3", null, "Powered by PhoneNumberGuy."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, "Any questions? ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        href: "/about/email"
      }, "Contact us"), " and we'll be happy to help.")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return VanityLearnMore;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(VanityLearnMore, "popupName", 'vanity_learn');

var propsToCheck = ['AC', 'minPrice', 'maxPrice', 'keyword'];
var formatVanityPrice = window.numeral != null ? function formatVanityPrice(price) {
  return window.numeral(price).format("$0,0.00");
} : function formatVanityPrice(price) {
  var priceFormatted = Number(price).toFixed(2);

  if (_.isNaN(priceFormatted)) {
    return price;
  } else {
    return "$".concat(priceFormatted);
  }
};
var VanitySearchResult = /*#__PURE__*/function (_React$Component2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(VanitySearchResult, _React$Component2);

  function VanitySearchResult() {
    var _getPrototypeOf2;

    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, VanitySearchResult);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, (_getPrototypeOf2 = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(VanitySearchResult)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "state", {
      sort: 'price_asc',
      result: [],
      currentPage: 0,
      endReached: false,
      loading: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleSort", function (event) {
      var sort = event.target.value;

      _this.setState({
        sort: sort
      }, function (_) {
        _this.search();
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "getSearchParams", function (page) {
      var sort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var _this$state = _this.state,
          AC = _this$state.AC,
          minPrice = _this$state.minPrice,
          maxPrice = _this$state.maxPrice,
          keyword = _this$state.keyword;
      var query = {};

      if (AC != null) {
        query.ac = AC;
      }

      if (keyword != null) {
        query.q = keyword;
      }

      if (minPrice == null && maxPrice == null || (0,_map__WEBPACK_IMPORTED_MODULE_12__.isVanityQueriable)({
        minPrice: minPrice,
        maxPrice: maxPrice
      }, true)) {
        query.p = (minPrice || '0') + '-' + maxPrice;
      }

      if (page != null && page > 1) {
        query.pg = page;
      }

      if (sort) {
        query.sort = sort;
      }

      return query;
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "search", function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          adding = _ref.adding;

      var _this$state2 = _this.state,
          currentPage = _this$state2.currentPage,
          loading = _this$state2.loading,
          sort = _this$state2.sort;

      if (loading) {
        return;
      }

      var page = adding ? currentPage + 1 : 1;

      var query = _this.getSearchParams(page, sort);

      _this.setState({
        loading: true
      }, function () {
        $.get('/rest-api/v1/things/vanity-number/search', query, function (response) {
          var nextState = {};

          if (response.data.length > 20 || response.next_page) {
            nextState.endReached = false;
            nextState.currentPage = page;
          } else {
            nextState.endReached = true;
          }

          if (!(0,fancyutils__WEBPACK_IMPORTED_MODULE_8__.isEmpty)(response.data)) {
            var prevResult = adding ? _this.state.result : [];
            nextState.result = prevResult.concat(response.data);
          } else {
            if (page > 1) {} else {
              nextState.result = [];
            }

            nextState.endReached = true;
          }

          _this.setState(nextState);
        }).always(function () {
          _this.setState({
            loading: false
          });
        });
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleGetMore", function (event) {
      _this.search({
        adding: true
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleCheckout", function (event) {
      if (_appstate__WEBPACK_IMPORTED_MODULE_11__.default.loggedIn !== true) {
        window.require_login();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      var pid = event.currentTarget.getAttribute('data-phone-id');
      $.post('/rest-api/v1/things/vanity-number/add-to-cart', {
        id: pid
      }, function (response) {
        if (response) {
          if (response.error_message) {
            var original_labels = alertify.labels;
            alertify.set({
              labels: {
                ok: 'Close'
              }
            });
            alertify.alert(response.error_message);
            alertify.set({
              labels: original_labels
            });
          } else {
            checkoutVanity();
          }
        }
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleKeywordInput", function (event) {
      if (event.keyCode === fancyutils__WEBPACK_IMPORTED_MODULE_8__.KEYS.ENTER) {
        event.preventDefault();
        var nextState = {
          keyword: event.target.value
        };

        if ((0,_map__WEBPACK_IMPORTED_MODULE_12__.isVanityQueriable)(nextState, false)) {
          _this.setState(nextState, function () {
            _this.search();
          });
        }
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0___default()(_this), "handleKeywordInputChange", function (event) {
      _this.setState({
        keyword: event.target.value
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(VanitySearchResult, [{
    key: "isUpdated",
    value: function isUpdated(currentProps, nextProps) {
      return propsToCheck.some(function (key) {
        return currentProps[key] !== nextProps[key];
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.setState(this.props, function () {
        _this2.search();
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;

      var nextProps = this.props;

      if (this.isUpdated(prevProps, nextProps)) {
        this.setState(_.extend({
          endReached: false,
          currentPage: 0,
          result: []
        }, nextProps), function () {
          _this3.search();
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$state3 = this.state,
          endReached = _this$state3.endReached,
          result = _this$state3.result,
          loading = _this$state3.loading,
          keyword = _this$state3.keyword;
      var empty = (0,fancyutils__WEBPACK_IMPORTED_MODULE_8__.isEmpty)(result);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, "Search results"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "result"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("fieldset", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("select", {
        className: "select-boxes2",
        onChange: this.handleSort
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("option", {
        value: "price_asc"
      }, "Lowest to Highest Price"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("option", {
        value: "price_desc"
      }, "Highest to Lowest Price")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "hastext"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("input", {
        type: "text",
        className: "text",
        placeholder: "Search by numbers or letters",
        onKeyDown: this.handleKeywordInput,
        onChange: this.handleKeywordInputChange,
        value: keyword
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        style: fancymixin__WEBPACK_IMPORTED_MODULE_9__.Display.NoneIf(empty)
      }, this.state.result.map(function (_ref2, idx) {
        var id_str = _ref2.id_str,
            display_num = _ref2.display_num,
            price = _ref2.price;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          key: "vanitySearch-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", {
          className: "number"
        }, display_num), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
          className: "price"
        }, formatVanityPrice(price)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
          className: "btn-checkout btns-green-embo",
          onClick: _this4.handleCheckout,
          "data-phone-id": id_str
        }, "Checkout"));
      }), !endReached && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
        onClick: this.handleGetMore
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
        className: "load-more ".concat(loading ? 'loading' : '')
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, "Load more numbers"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "empty",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_9__.Display.NoneIf(!(empty && endReached))
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "phone"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "icon"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, "Can't find what you're looking for?"), "No results found that match your search")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "empty loading",
        style: fancymixin__WEBPACK_IMPORTED_MODULE_9__.Display.NoneIf(!(empty && !endReached))
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return VanitySearchResult;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(VanitySearchResult, "popupName", 'vanity_result');

function checkoutVanity() {
  $.ajax({
    type: 'POST',
    url: '/rest-api/v1/checkout',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      "payment_gateway": 6,
      "is_vanity": 'true'
    }),
    processData: false
  }).then(function () {
    (0,_container_routeutils__WEBPACK_IMPORTED_MODULE_10__.redirect)("/vanity-number/checkout");
  }).fail(function (res) {
    if (res.responseText) {
      var json = JSON.parse(res.responseText);

      if (json.error) {
        var original_labels = alertify.labels;
        alertify.set({
          labels: {
            ok: 'Close'
          }
        });
        alertify.alert(json.error);
        alertify.set({
          labels: original_labels
        });
      }
    }
  });
}

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/currency.js":
/*!***********************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/currency.js ***!
  \***********************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ CurrencyPopup
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
/* harmony import */ var _data_currency__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../data/currency */ "./_static/modules/ui/overlay-thing/data/currency.js");
/* harmony import */ var _action_action_helpers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../action/action-helpers */ "./_static/modules/ui/overlay-thing/action/action-helpers.ts");











 // FIXME: refactor for common usage

var db = {
  display: "block"
};
var dn = {
  display: "none"
};

function displayIf(condition) {
  return condition ? db : dn;
}

var CurrencyPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(CurrencyPopup, _React$Component);

  function CurrencyPopup(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, CurrencyPopup);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(CurrencyPopup).call(this, props));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleContinentClick", function (event) {
      event.preventDefault();
      var currentContinent = $(event.currentTarget).attr("data-continent");

      _this.setState({
        currentContinent: currentContinent
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleCurrencyClick", function (event) {
      event.preventDefault();
      var chosenCode = $(event.currentTarget).attr("data-currency");

      _this.setState({
        chosenCode: chosenCode
      });
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleCancelClick", function (event) {
      event.preventDefault();
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.closePopup)(CurrencyPopup.popupName);

      _this.setState({
        chosenCode: null
      }); // reset

    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "handleSaveClick", function (event) {
      event.preventDefault();
      var chosenCode = _this.state.chosenCode;
      (0,_action_action_helpers__WEBPACK_IMPORTED_MODULE_10__.convertCurrency)(chosenCode);
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_9__.closePopup)(CurrencyPopup.popupName);
      $.ajax({
        type: "POST",
        url: "/set_my_currency.json",
        data: {
          currency_code: chosenCode
        }
      });

      _this.setState({
        chosenCode: null
      }); // reset

    });

    _this.currencies = (0,_data_currency__WEBPACK_IMPORTED_MODULE_11__.default)();
    _this.continents = [{
      code: "all",
      name: gettext("All Currencies")
    }, {
      code: "ap",
      name: gettext("Asia-Pacific")
    }, {
      code: "af",
      name: gettext("Africa and Middle East")
    }, {
      code: "am",
      name: gettext("Americas")
    }, {
      code: "eu",
      name: gettext("Europe")
    }, {
      code: "cc",
      name: gettext("Cryptocurrency")
    }];
    _this.state = {
      currentContinent: "all"
    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(CurrencyPopup, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          chosenCode = _this$state.chosenCode,
          currentContinent = _this$state.currentContinent;
      var currentCurrency = chosenCode || this.props.currentCurrency;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("p", {
        className: "ltit"
      }, gettext("Choose your currency")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "currency-list after"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
        className: "line"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "left"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "continents"
      }, this.continents.map(function (_ref, idx) {
        var code = _ref.code,
            name = _ref.name;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "continent code-continent-".concat(code),
          key: "continent-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentContinent === code
          }),
          onClick: _this2.handleContinentClick,
          "data-continent": code
        }, name));
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "right-outer scroll"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "right",
        style: displayIf(currentContinent === "all")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "major after"
      }, this.currencies.major.map(function (_ref2, idx) {
        var code = _ref2.code,
            name = _ref2.name,
            assist = _ref2.assist;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "currency",
          key: "currency-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentCurrency === code
          }),
          "data-currency": code,
          onClick: _this2.handleCurrencyClick
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, " ".concat(code)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, assist)));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "after"
      }, this.currencies.all.map(function (_ref3, idx) {
        var code = _ref3.code,
            name = _ref3.name,
            assist = _ref3.assist;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "currency",
          key: "currency-".concat(_this2.currencies.major.length + idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentCurrency === code
          }),
          "data-currency": code,
          onClick: _this2.handleCurrencyClick
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, " ".concat(code)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, assist)));
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "right",
        style: displayIf(currentContinent === "ap")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "after"
      }, this.currencies.ap.map(function (_ref4, idx) {
        var code = _ref4.code,
            name = _ref4.name,
            assist = _ref4.assist;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "currency",
          key: "currency-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentCurrency === code
          }),
          "data-currency": code,
          onClick: _this2.handleCurrencyClick
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, " ".concat(code)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, assist)));
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "right",
        style: displayIf(currentContinent === "af")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "after"
      }, this.currencies.af.map(function (_ref5, idx) {
        var code = _ref5.code,
            name = _ref5.name,
            assist = _ref5.assist;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "currency",
          key: "currency-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentCurrency === code
          }),
          "data-currency": code,
          onClick: _this2.handleCurrencyClick
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, " ".concat(code)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, assist)));
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "right",
        style: displayIf(currentContinent === "am")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "after"
      }, this.currencies.am.map(function (_ref6, idx) {
        var code = _ref6.code,
            name = _ref6.name,
            assist = _ref6.assist;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "currency",
          key: "currency-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentCurrency === code
          }),
          "data-currency": code,
          onClick: _this2.handleCurrencyClick
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, " ".concat(code)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, assist)));
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "right",
        style: displayIf(currentContinent === "eu")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "after"
      }, this.currencies.eu.map(function (_ref7, idx) {
        var code = _ref7.code,
            name = _ref7.name,
            assist = _ref7.assist;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "currency",
          key: "currency-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentCurrency === code
          }),
          "data-currency": code,
          onClick: _this2.handleCurrencyClick
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, " ".concat(code)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, assist)));
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "right",
        style: displayIf(currentContinent === "cc")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("ul", {
        className: "after"
      }, this.currencies.cc.map(function (_ref8, idx) {
        var code = _ref8.code,
            name = _ref8.name,
            assist = _ref8.assist;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("li", {
          className: "currency",
          key: "currency-".concat(idx)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
          className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
            current: currentCurrency === code
          }),
          "data-currency": code,
          onClick: _this2.handleCurrencyClick
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("b", null, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("small", null, " ".concat(code)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", null, assist)));
      }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
        className: "btn-area"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btns-gray-embo cancel",
        onClick: this.handleCancelClick
      }, gettext("Cancel")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
        className: "btns-blue-embo save",
        onClick: this.handleSaveClick
      }, gettext("Save"))));
    }
  }]);

  return CurrencyPopup;
}(react__WEBPACK_IMPORTED_MODULE_7__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(CurrencyPopup, "popupName", "show_currency");



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/index.js":
/*!********************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/index.js ***!
  \********************************************************************/
/*! namespace exports */
/*! export BookingResultPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/BookingResultPopup.js .default */
/*! export CurrencyPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/currency.js .default */
/*! export EditPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/EditPopup.js .default */
/*! export RequestSalePopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/RequestSalePopup.js .default */
/*! export ReturnPolicyDetailPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/return-detail.js .default */
/*! export ReviewsPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/ReviewsPopup.js .default */
/*! export ShippingCountriesPopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/ShippingCountriesPopup.js .default */
/*! export SizeGuidePopup [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/SizeGuidePopup.js .default */
/*! export VanityLearnMore [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/VanityPopup.js .VanityLearnMore */
/*! export VanitySearchResult [provided] [no usage info] [missing usage info prevents renaming] -> ./_static/modules/ui/overlay-thing/components/popup/VanityPopup.js .VanitySearchResult */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.d, __webpack_require__.r, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShippingCountriesPopup": () => /* reexport safe */ _ShippingCountriesPopup__WEBPACK_IMPORTED_MODULE_0__.default,
/* harmony export */   "CurrencyPopup": () => /* reexport safe */ _currency__WEBPACK_IMPORTED_MODULE_1__.default,
/* harmony export */   "BookingResultPopup": () => /* reexport safe */ _BookingResultPopup__WEBPACK_IMPORTED_MODULE_2__.default,
/* harmony export */   "RequestSalePopup": () => /* reexport safe */ _RequestSalePopup__WEBPACK_IMPORTED_MODULE_3__.default,
/* harmony export */   "SizeGuidePopup": () => /* reexport safe */ _SizeGuidePopup__WEBPACK_IMPORTED_MODULE_4__.default,
/* harmony export */   "ReturnPolicyDetailPopup": () => /* reexport safe */ _return_detail__WEBPACK_IMPORTED_MODULE_5__.default,
/* harmony export */   "EditPopup": () => /* reexport safe */ _EditPopup__WEBPACK_IMPORTED_MODULE_6__.default,
/* harmony export */   "ReviewsPopup": () => /* reexport safe */ _ReviewsPopup__WEBPACK_IMPORTED_MODULE_7__.default,
/* harmony export */   "VanityLearnMore": () => /* reexport safe */ _VanityPopup__WEBPACK_IMPORTED_MODULE_8__.VanityLearnMore,
/* harmony export */   "VanitySearchResult": () => /* reexport safe */ _VanityPopup__WEBPACK_IMPORTED_MODULE_8__.VanitySearchResult
/* harmony export */ });
/* harmony import */ var _ShippingCountriesPopup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShippingCountriesPopup */ "./_static/modules/ui/overlay-thing/components/popup/ShippingCountriesPopup.js");
/* harmony import */ var _currency__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./currency */ "./_static/modules/ui/overlay-thing/components/popup/currency.js");
/* harmony import */ var _BookingResultPopup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BookingResultPopup */ "./_static/modules/ui/overlay-thing/components/popup/BookingResultPopup.js");
/* harmony import */ var _RequestSalePopup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RequestSalePopup */ "./_static/modules/ui/overlay-thing/components/popup/RequestSalePopup.js");
/* harmony import */ var _SizeGuidePopup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SizeGuidePopup */ "./_static/modules/ui/overlay-thing/components/popup/SizeGuidePopup.js");
/* harmony import */ var _return_detail__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./return-detail */ "./_static/modules/ui/overlay-thing/components/popup/return-detail.js");
/* harmony import */ var _EditPopup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./EditPopup */ "./_static/modules/ui/overlay-thing/components/popup/EditPopup.js");
/* harmony import */ var _ReviewsPopup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ReviewsPopup */ "./_static/modules/ui/overlay-thing/components/popup/ReviewsPopup.js");
/* harmony import */ var _VanityPopup__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./VanityPopup */ "./_static/modules/ui/overlay-thing/components/popup/VanityPopup.js");










/***/ }),

/***/ "./_static/modules/ui/overlay-thing/components/popup/return-detail.js":
/*!****************************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/components/popup/return-detail.js ***!
  \****************************************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ReturnPolicyDetailPopup
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
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");








var ReturnPolicyDetailPopup = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(ReturnPolicyDetailPopup, _React$Component);

  function ReturnPolicyDetailPopup() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ReturnPolicyDetailPopup);

    return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(ReturnPolicyDetailPopup).apply(this, arguments));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ReturnPolicyDetailPopup, [{
    key: "render",
    value: function render() {
      var sales = this.props.sales;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement("p", {
        className: "ltit"
      }, gettext('Return policy')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement("div", {
        className: "terms"
      }, sales.shipping_policy && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement("p", null, sales.shipping_policy)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement("button", {
        className: "ly-close",
        title: "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6__.createElement("i", {
        className: "ic-del-black"
      })));
    }
  }]);

  return ReturnPolicyDetailPopup;
}(react__WEBPACK_IMPORTED_MODULE_6__.Component);

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(ReturnPolicyDetailPopup, "popupName", 'policy_detail');



/***/ }),

/***/ "./_static/modules/ui/overlay-thing/data/Countries.js":
/*!************************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/data/Countries.js ***!
  \************************************************************/
/*! namespace exports */
/*! export Countries [provided] [no usage info] [missing usage info prevents renaming] */
/*! export CountriesPair [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getCountryByCode [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Countries": () => /* binding */ Countries,
/* harmony export */   "getCountryByCode": () => /* binding */ getCountryByCode,
/* harmony export */   "CountriesPair": () => /* binding */ CountriesPair
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);


var _Countries;

var Countries = (_Countries = {
  'AE': 'United Arab Emirates',
  'AF': 'Afghanistan',
  'AG': 'Antigua And Barbuda',
  'AI': 'Anguilla',
  'AL': 'Albania',
  'AM': 'Armenia',
  'AN': 'Netherlands Antilles',
  'AO': 'Angola',
  'AQ': 'Antarctica',
  'AR': 'Argentina',
  'AS': 'American Samoa',
  'AT': 'Austria',
  'AU': 'Australia',
  'AW': 'Aruba',
  'AX': 'Aaland Islands',
  'AZ': 'Azerbaijan',
  'BA': 'Bosnia And Herzegowina',
  'BB': 'Barbados',
  'BD': 'Bangladesh',
  'BE': 'Belgium',
  'BF': 'Burkina Faso',
  'BG': 'Bulgaria',
  'BH': 'Bahrain',
  'BI': 'Burundi',
  'BJ': 'Benin',
  'BM': 'Bermuda',
  'BN': 'Brunei Darussalam',
  'BO': 'Bolivia',
  'BR': 'Brazil',
  'BS': 'Bahamas',
  'BT': 'Bhutan',
  'BV': 'Bouvet Island',
  'BW': 'Botswana',
  'BY': 'Belarus',
  'BZ': 'Belize',
  'CA': 'Canada',
  'CC': 'Cocos (keeling) Islands',
  'CD': 'Congo, Democratic Republic Of (was Zaire)',
  'CF': 'Central African Republic',
  'CG': 'Congo, Republic Of',
  'CH': 'Switzerland',
  'CI': "Cote D'ivoire",
  'CK': 'Cook Islands',
  'CL': 'Chile',
  'CM': 'Cameroon',
  'CN': 'China',
  'CO': 'Colombia',
  'CR': 'Costa Rica',
  'CU': 'Cuba',
  'CV': 'Cape Verde',
  'CX': 'Christmas Island',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'DJ': 'Djibouti',
  'DK': 'Denmark',
  'DM': 'Dominica',
  'DO': 'Dominican Republic',
  'DZ': 'Algeria',
  'EC': 'Ecuador',
  'EE': 'Estonia',
  'EG': 'Egypt',
  'EH': 'Western Sahara',
  'ES': 'Spain',
  'ET': 'Ethiopia',
  'FI': 'Finland',
  'FJ': 'Fiji',
  'FK': 'Falkland Islands (malvinas)',
  'FM': 'Micronesia, Federated States Of',
  'FO': 'Faroe Islands',
  'FR': 'France',
  'GA': 'Gabon',
  'GB': 'United Kingdom',
  'GD': 'Grenada',
  'GE': 'Georgia',
  'GF': 'French Guiana',
  'GH': 'Ghana',
  'GI': 'Gibraltar',
  'GL': 'Greenland',
  'GM': 'Gambia',
  'GN': 'Guinea',
  'GP': 'Guadeloupe',
  'GQ': 'Equatorial Guinea',
  'GR': 'Greece',
  'GS': 'South Georgia And The South Sandwich Islands',
  'GT': 'Guatemala',
  'GU': 'Guam',
  'GW': 'Guinea-bissau',
  'GY': 'Guyana',
  'HK': 'Hong Kong',
  'HM': 'Heard And Mc Donald Islands',
  'HN': 'Honduras',
  'HR': 'Croatia (local Name: Hrvatska)',
  'HT': 'Haiti',
  'HU': 'Hungary',
  'ID': 'Indonesia',
  'IE': 'Ireland',
  'IL': 'Israel',
  'IN': 'India',
  'IO': 'British Indian Ocean Territory',
  'IQ': 'Iraq',
  'IR': 'Iran (islamic Republic Of)',
  'IS': 'Iceland',
  'IT': 'Italy',
  'JM': 'Jamaica',
  'JO': 'Jordan',
  'JP': 'Japan',
  'KE': 'Kenya',
  'KG': 'Kyrgyzstan',
  'KH': 'Cambodia',
  'KI': 'Kiribati',
  'KM': 'Comoros',
  'KN': 'Saint Kitts And Nevis',
  'KP': 'Korea, North',
  'KR': 'Korea, Republic Of',
  'KW': 'Kuwait',
  'KY': 'Cayman Islands',
  'KZ': 'Kazakhstan',
  'LA': "Lao People's Democratic Republic",
  'LB': 'Lebanon',
  'LC': 'Saint Lucia',
  'LI': 'Liechtenstein',
  'LK': 'Sri Lanka',
  'LR': 'Liberia',
  'LS': 'Lesotho',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'LV': 'Latvia',
  'LY': 'Libyan Arab Jamahiriya',
  'MA': 'Morocco',
  'MC': 'Monaco',
  'MD': 'Moldova, Republic Of',
  'ME': 'Montenegro',
  'MG': 'Madagascar',
  'MH': 'Marshall Islands',
  'MK': 'Macedonia, The Former Yugoslav Republic Of',
  'ML': 'Mali',
  'MM': 'Myanmar',
  'MN': 'Mongolia',
  'MO': 'Macau',
  'MP': 'Northern Mariana Islands',
  'MQ': 'Martinique',
  'MR': 'Mauritania',
  'MS': 'Montserrat',
  'MT': 'Malta',
  'MU': 'Mauritius',
  'MV': 'Maldives',
  'MW': 'Malawi',
  'MX': 'Mexico',
  'MY': 'Malaysia',
  'MZ': 'Mozambique',
  'NA': 'Namibia',
  'NC': 'New Caledonia',
  'NE': 'Niger',
  'NF': 'Norfolk Island',
  'NG': 'Nigeria',
  'NI': 'Nicaragua',
  'NL': 'Netherlands',
  'NO': 'Norway',
  'NP': 'Nepal',
  'NR': 'Nauru',
  'NU': 'Niue',
  'NZ': 'New Zealand',
  'OM': 'Oman',
  'PA': 'Panama',
  'PE': 'Peru',
  'PF': 'French Polynesia',
  'PG': 'Papua New Guinea',
  'PH': 'Philippines',
  'PK': 'Pakistan',
  'PL': 'Poland',
  'PM': 'Saint Pierre And Miquelon',
  'PN': 'Pitcairn',
  'PR': 'Puerto Rico',
  'PS': 'Palestinian Territory',
  'PT': 'Portugal',
  'PW': 'Palau',
  'PY': 'Paraguay',
  'QA': 'Qatar',
  'RE': 'Reunion',
  'RO': 'Romania',
  'RS': 'Serbia',
  'RU': 'Russian Federation',
  'RW': 'Rwanda',
  'SA': 'Saudi Arabia',
  'SB': 'Solomon Islands',
  'SC': 'Seychelles',
  'SD': 'Sudan'
}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, "SD", 'Sudan'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SE', 'Sweden'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SG', 'Singapore'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SH', 'Saint Helena'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SI', 'Slovenia'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SJ', 'Svalbard And Jan Mayen Islands'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SK', 'Slovakia'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SL', 'Sierra Leone'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SM', 'San Marino'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SN', 'Senegal'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SO', 'Somalia'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SR', 'Suriname'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SS', 'South Sudan'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'ST', 'Sao Tome And Principe'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SV', 'El Salvador'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SY', 'Syrian Arab Republic'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'SZ', 'Swaziland'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TC', 'Turks And Caicos Islands'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TD', 'Chad'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TF', 'French Southern Territories'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TG', 'Togo'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TH', 'Thailand'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TJ', 'Tajikistan'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TK', 'Tokelau'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TL', 'Timor-leste'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TM', 'Turkmenistan'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TN', 'Tunisia'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TO', 'Tonga'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TR', 'Turkey'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TT', 'Trinidad And Tobago'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TV', 'Tuvalu'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TW', 'Taiwan'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'TZ', 'Tanzania, United Republic Of'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'UA', 'Ukraine'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'UG', 'Uganda'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'UM', 'United States Minor Outlying Islands'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'US', 'USA'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'UY', 'Uruguay'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'UZ', 'Uzbekistan'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'VA', 'Vatican City State (holy See)'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'VC', 'Saint Vincent And The Grenadines'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'VE', 'Venezuela'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'VG', 'Virgin Islands (british)'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'VI', 'Virgin Islands (u.s.)'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'VN', 'Viet Nam'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'VU', 'Vanuatu'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'WF', 'Wallis And Futuna Islands'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'WS', 'Samoa'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'YE', 'Yemen'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'YT', 'Mayotte'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'ZA', 'South Africa'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'ZM', 'Zambia'), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_Countries, 'ZW', 'Zimbabwe'), _Countries);
function getCountryByCode(code) {
  return Countries[code];
}
var CountriesPair = _.pairs(Countries).sort(function (a, b) {
  return a[0].localeCompare(b[0]);
}); // {code: name, ...} => [[code, name], ...]

/***/ }),

/***/ "./_static/modules/ui/overlay-thing/data/currency.js":
/*!***********************************************************!*\
  !*** ./_static/modules/ui/overlay-thing/data/currency.js ***!
  \***********************************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ getCurrencies
/* harmony export */ });
function getCurrencies() {
  return {
    "major": [{
      "name": gettext("U.S. dollars"),
      "code": "USD",
      "assist": gettext("United States ($)")
    }, {
      "name": gettext("British pounds"),
      "code": "GBP",
      "assist": gettext("United Kingdom (£)")
    }, {
      "name": gettext("Canadian dollars"),
      "code": "CAD",
      "assist": gettext("Canada ($)")
    }, {
      "name": gettext("Chinese yuan"),
      "code": "CNY",
      "assist": gettext("China (¥)")
    }, {
      "name": gettext("Euros"),
      "code": "EUR",
      "assist": gettext("European Union (€)")
    }, {
      "name": gettext("Japanese yen"),
      "code": "JPY",
      "assist": gettext("Japan (¥)")
    }, {
      "name": gettext("South Korean won"),
      "code": "KRW",
      "assist": gettext("Republic of Korea (₩)")
    }, {
      "name": gettext("Bitcoin"),
      "code": "BTC",
      "assist": gettext("Bitcoin (฿)")
    }],
    "all": [{
      "name": gettext("Australian dollars"),
      "code": "AUD",
      "assist": gettext("Australia ($)")
    }, {
      "name": gettext("Bahrain dinars"),
      "code": "BHD",
      "assist": gettext("Bahrain (BD)")
    }, {
      "name": gettext("Bitcoin"),
      "code": "BTC",
      "assist": gettext("Bitcoin (฿)")
    }, {
      "name": gettext("Brazil reals"),
      "code": "BRL",
      "assist": gettext("Brazil (R$)")
    }, {
      "name": gettext("British pounds"),
      "code": "GBP",
      "assist": gettext("United Kingdom (£)")
    }, {
      "name": gettext("Brunei dollars"),
      "code": "BND",
      "assist": gettext("Brunei ($)")
    }, {
      "name": gettext("Canadian dollars"),
      "code": "CAD",
      "assist": gettext("Canada ($)")
    }, {
      "name": gettext("Chinese yuan"),
      "code": "CNY",
      "assist": gettext("China (¥)")
    }, {
      "name": gettext("Czech koruny"),
      "code": "CZK",
      "assist": gettext("Czech (Kč)")
    }, {
      "name": gettext("Danish kroner"),
      "code": "DKK",
      "assist": gettext("Denmark (kr)")
    }, {
      "name": gettext("Egyptian pounds"),
      "code": "EGP",
      "assist": gettext("Egypt (£)")
    }, {
      "name": gettext("Euros"),
      "code": "EUR",
      "assist": gettext("European Union (€)")
    }, {
      "name": gettext("Hong Kong dollars"),
      "code": "HKD",
      "assist": gettext("Hong Kong ($)")
    }, {
      "name": gettext("Hungarian forints"),
      "code": "HUF",
      "assist": gettext("Hungary (Ft)")
    }, {
      "name": gettext("Indian rupees"),
      "code": "INR",
      "assist": gettext("India (₹)")
    }, {
      "name": gettext("Indonesian rupiahs"),
      "code": "IDR",
      "assist": gettext("Indonesia (Rp)")
    }, {
      "name": gettext("Israeli shekels"),
      "code": "ILS",
      "assist": gettext("Israel (₪)")
    }, {
      "name": gettext("Japanese yen"),
      "code": "JPY",
      "assist": gettext("Japan (¥)")
    }, {
      "name": gettext("Jordanian dinars"),
      "code": "JOD",
      "assist": gettext("Jordan (JD)")
    }, {
      "name": gettext("Kazakh tenge"),
      "code": "KZT",
      "assist": gettext("Kazakhstan (лв)")
    }, {
      "name": gettext("Kuwaiti dinars"),
      "code": "KWD",
      "assist": gettext("Kuwait (K.D.)")
    }, {
      "name": gettext("Lithuanian litai"),
      "code": "LTL",
      "assist": gettext("Lithuania (Lt)")
    }, {
      "name": gettext("Malaysian ringgits"),
      "code": "MYR",
      "assist": gettext("Malaysia (RM)")
    }, {
      "name": gettext("Mexican pesos"),
      "code": "MXN",
      "assist": gettext("Mexico ($)")
    }, {
      "name": gettext("New Zealand dollars"),
      "code": "NZD",
      "assist": gettext("New Zealand ($)")
    }, {
      "name": gettext("Norwegian kroner"),
      "code": "NOK",
      "assist": gettext("Norway (kr)")
    }, {
      "name": gettext("Pakistan rupees"),
      "code": "PKR",
      "assist": gettext("Pakistan (₨)")
    }, {
      "name": gettext("Philippine pesos"),
      "code": "PHP",
      "assist": gettext("Philippines (₱)")
    }, {
      "name": gettext("Polish zloty"),
      "code": "PLN",
      "assist": gettext("Poland (zł)")
    }, {
      "name": gettext("Qatar riyals"),
      "code": "QAR",
      "assist": gettext("Qatar (﷼)")
    }, {
      "name": gettext("Romanian leu"),
      "code": "RON",
      "assist": gettext("Romania (L)")
    }, {
      "name": gettext("Russian rubles"),
      "code": "RUB",
      "assist": gettext("Russia (руб)")
    }, {
      "name": gettext("Saudi riyals"),
      "code": "SAR",
      "assist": gettext("Saudi Arabia (﷼)")
    }, {
      "name": gettext("Serbian dinars"),
      "code": "RSD",
      "assist": gettext("Serbia (Дин.)")
    }, {
      "name": gettext("Singapore dollars"),
      "code": "SGD",
      "assist": gettext("Singapore ($)")
    }, {
      "name": gettext("South African rands"),
      "code": "ZAR",
      "assist": gettext("South Africa (R)")
    }, {
      "name": gettext("South Korean won"),
      "code": "KRW",
      "assist": gettext("Republic of Korea (₩)")
    }, {
      "name": gettext("Swedish kronor"),
      "code": "SEK",
      "assist": gettext("Sweden (kr)")
    }, {
      "name": gettext("Swiss francs"),
      "code": "CHF",
      "assist": gettext("Switzerland (CHF)")
    }, {
      "name": gettext("Taiwan dollars"),
      "code": "TWD",
      "assist": gettext("Taiwan (NT$)")
    }, {
      "name": gettext("Thai baht"),
      "code": "THB",
      "assist": gettext("Thailand (฿)")
    }, {
      "name": gettext("Turkish liras"),
      "code": "TRY",
      "assist": gettext("Turkey (₤)")
    }, {
      "name": gettext("U.S. dollars"),
      "code": "USD",
      "assist": gettext("United States ($)")
    }, {
      "name": gettext("United Arab Emirates dirhams"),
      "code": "AED",
      "assist": gettext("United Arab Emirates (AED)")
    }, {
      "name": gettext("Vietnamese dong"),
      "code": "VND",
      "assist": gettext("Viet Nam (₫)")
    }],
    "ap": [{
      "name": gettext("Australian dollars"),
      "code": "AUD",
      "assist": gettext("Australia ($)")
    }, {
      "name": gettext("Brunei dollars"),
      "code": "BND",
      "assist": gettext("Brunei ($)")
    }, {
      "name": gettext("Chinese yuan"),
      "code": "CNY",
      "assist": gettext("China (¥)")
    }, {
      "name": gettext("Hong Kong dollars"),
      "code": "HKD",
      "assist": gettext("Hong Kong ($)")
    }, {
      "name": gettext("Indian rupees"),
      "code": "INR",
      "assist": gettext("India (₹)")
    }, {
      "name": gettext("Indonesian rupiahs"),
      "code": "IDR",
      "assist": gettext("Indonesia (Rp)")
    }, {
      "name": gettext("Japanese yen"),
      "code": "JPY",
      "assist": gettext("Japan (¥)")
    }, {
      "name": gettext("Kazakh tenge"),
      "code": "KZT",
      "assist": gettext("Kazakhstan (лв)")
    }, {
      "name": gettext("Malaysian ringgits"),
      "code": "MYR",
      "assist": gettext("Malaysia (RM)")
    }, {
      "name": gettext("New Zealand dollars"),
      "code": "NZD",
      "assist": gettext("New Zealand ($)")
    }, {
      "name": gettext("Pakistan rupees"),
      "code": "PKR",
      "assist": gettext("Pakistan (₨)")
    }, {
      "name": gettext("Philippine pesos"),
      "code": "PHP",
      "assist": gettext("Philippines (₱)")
    }, {
      "name": gettext("Singapore dollars"),
      "code": "SGD",
      "assist": gettext("Singapore ($)")
    }, {
      "name": gettext("South Korean won"),
      "code": "KRW",
      "assist": gettext("Republic of Korea (₩)")
    }, {
      "name": gettext("Taiwan dollars"),
      "code": "TWD",
      "assist": gettext("Taiwan (NT$)")
    }, {
      "name": gettext("Thai baht"),
      "code": "THB",
      "assist": gettext("Thailand (฿)")
    }, {
      "name": gettext("Vietnamese dong"),
      "code": "VND",
      "assist": gettext("Viet Nam (₫)")
    }],
    "af": [{
      "name": gettext("Bahrain dinars"),
      "code": "BHD",
      "assist": gettext("Bahrain (BD)")
    }, {
      "name": gettext("Egyptian pounds"),
      "code": "EGP",
      "assist": gettext("Egypt (£)")
    }, {
      "name": gettext("Israeli shekels"),
      "code": "ILS",
      "assist": gettext("Israel (₪)")
    }, {
      "name": gettext("Jordanian dinars"),
      "code": "JOD",
      "assist": gettext("Jordan (JD)")
    }, {
      "name": gettext("Kuwaiti dinars"),
      "code": "KWD",
      "assist": gettext("Kuwait (K.D.)")
    }, {
      "name": gettext("Qatar riyals"),
      "code": "QAR",
      "assist": gettext("Qatar (﷼)")
    }, {
      "name": gettext("Saudi riyals"),
      "code": "SAR",
      "assist": gettext("Saudi Arabia (﷼)")
    }, {
      "name": gettext("South African rands"),
      "code": "ZAR",
      "assist": gettext("South Africa (R)")
    }, {
      "name": gettext("United Arab Emirates dirhams"),
      "code": "AED",
      "assist": gettext("United Arab Emirates (AED)")
    }],
    "am": [{
      "name": gettext("Brazil reals"),
      "code": "BRL",
      "assist": gettext("Brazil (R$)")
    }, {
      "name": gettext("Canadian dollars"),
      "code": "CAD",
      "assist": gettext("Canada ($)")
    }, {
      "name": gettext("Mexican pesos"),
      "code": "MXN",
      "assist": gettext("Mexico ($)")
    }, {
      "name": gettext("U.S. dollars"),
      "code": "USD",
      "assist": gettext("United States ($)")
    }],
    "eu": [{
      "name": gettext("British pounds"),
      "code": "GBP",
      "assist": gettext("United Kingdom (£)")
    }, {
      "name": gettext("Czech koruny"),
      "code": "CZK",
      "assist": gettext("Czech (Kč)")
    }, {
      "name": gettext("Danish kroner"),
      "code": "DKK",
      "assist": gettext("Denmark (kr)")
    }, {
      "name": gettext("Euros"),
      "code": "EUR",
      "assist": gettext("European Union (€)")
    }, {
      "name": gettext("Hungarian forints"),
      "code": "HUF",
      "assist": gettext("Hungary (Ft)")
    }, {
      "name": gettext("Lithuanian litai"),
      "code": "LTL",
      "assist": gettext("Lithuania (Lt)")
    }, {
      "name": gettext("Norwegian kroner"),
      "code": "NOK",
      "assist": gettext("Norway (kr)")
    }, {
      "name": gettext("Polish zloty"),
      "code": "PLN",
      "assist": gettext("Poland (zł)")
    }, {
      "name": gettext("Romanian leu"),
      "code": "RON",
      "assist": gettext("Romania (L)")
    }, {
      "name": gettext("Russian rubles"),
      "code": "RUB",
      "assist": gettext("Russia (руб)")
    }, {
      "name": gettext("Serbian dinars"),
      "code": "RSD",
      "assist": gettext("Serbia (Дин.)")
    }, {
      "name": gettext("Swedish kronor"),
      "code": "SEK",
      "assist": gettext("Sweden (kr)")
    }, {
      "name": gettext("Swiss francs"),
      "code": "CHF",
      "assist": gettext("Switzerland (CHF)")
    }, {
      "name": gettext("Turkish liras"),
      "code": "TRY",
      "assist": gettext("Turkey (₤)")
    }],
    "cc": [{
      "name": gettext("Bitcoin"),
      "code": "BTC",
      "assist": gettext("Bitcoin (฿)")
    }]
  };
}

/***/ })

}]);
//# sourceMappingURL=OverlayThing.popup.f9395948bbe2f717a5f8.js.map