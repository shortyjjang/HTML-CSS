(self["webpackChunkfancy"] = self["webpackChunkfancy"] || []).push([["_static_modules_ui_more-share_Action_tsx"],{

/***/ "./_static/modules/ui/more-share/Action.tsx":
/*!**************************************************!*\
  !*** ./_static/modules/ui/more-share/Action.tsx ***!
  \**************************************************/
/*! namespace exports */
/*! export setup [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setup": () => /* binding */ setup
/* harmony export */ });
/* harmony import */ var fancyutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fancyutils */ "./_static/modules/libf/FancyUtils.ts");
/* harmony import */ var _overlay_thing_components_popup_AddlistPopup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../overlay-thing/components/popup/AddlistPopup */ "./_static/modules/ui/overlay-thing/components/popup/AddlistPopup.js");



var getUrl = function getUrl(thingUrl, viewerUsername) {
  var url = "https://fancy.com".concat(thingUrl);

  if (viewerUsername) {
    var connector = ~url.indexOf("?") ? "&" : "?";
    url = "".concat(url).concat(connector, "ref=").concat(viewerUsername);
  }

  return url;
};

var copyAction = function copyAction(thingUrl, viewerUsername, $messageEl) {
  (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.copyToClipboard)(getUrl(thingUrl, viewerUsername));
  $messageEl.text("Link copied!");
  setTimeout(function () {
    $messageEl.text("Copy link");
  }, 2000);
};

function setup() {
  $(function () {
    // click outside to close
    $(document).on("click", ".figure-item .menu-container .btn-more", function () {
      var $el = $(this);
      var $container = $el.closest(".menu-container");

      if ($container.hasClass("show-list")) {
        $container.removeClass("show-list");
      } else if ($container.hasClass("show-share")) {
        $container.removeClass("show-share");
      } else if ($container.hasClass("opened")) {
        $container.removeClass("opened").closest("li").removeClass("active");
        $(document.body).removeClass("show-more-share");
      } else {
        $container.addClass("opened").closest("li").addClass("active");
        $(document.body).addClass("show-more-share");
      }

      if (!$el.data("clickoutside")) {
        var ts = Math.random();
        var evt = "click.action-clickoutside-".concat(ts);
        $el.data("clickoutside", evt);
        $(document).on(evt, function (e2) {
          if ($(e2.target).is($el) || $(e2.target).closest($container).length) {
            return true;
          }

          e2.preventDefault();
          e2.stopPropagation();
          $el.closest(".menu-container.opened").removeClass("opened").closest("li").removeClass("active");
          $(document.body).removeClass("show-more-share"); // close addlist popover

          $el.closest(".menu-container").removeClass("show-list");
          $(document).off(evt);
          $el.data("clickoutside", null);
        });
      }
    }).on("click", ".figure-item .menu-container .add-list", function () {
      if (!window.__FancyUser.loggedIn) {
        window.require_login();
        return false;
      }

      var $this = $(this);
      var objectId = $this.closest("li").attr("tid");
      (0,fancyutils__WEBPACK_IMPORTED_MODULE_0__.renderPopup)(_overlay_thing_components_popup_AddlistPopup__WEBPACK_IMPORTED_MODULE_1__.default, {
        objectId: objectId
      });
      return false;
    }).on("click", ".figure-item .menu-container .copy-link", function () {
      var $el = $(this);
      var url = $el.closest(".figure-item").data("url");
      copyAction(url, window.__FancyUser.viewerUsername, $el);
      return false;
    }).on("click", ".figure-item .menu-container .share", function () {
      $(this).closest(".menu-container").addClass("show-share");
      return false;
    }).on("click", ".figure-item .menu-container .ly-close", function () {
      $(this).closest(".menu-container").removeClass("opened");
      return false;
    });
  });
} // $(function () {
//     $(".figure-item #show-share .close, .figure-item #show-addlist .close").click(function (e) {
//         e.preventDefault();
//         $(this).closest(".menu-container").removeClass("show-share").removeClass("show-list");
//         return false;
//     });
// });

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

/***/ })

}]);
//# sourceMappingURL=_static_modules_ui_more-share_Action_tsx.46354aedc6520501a332.js.map